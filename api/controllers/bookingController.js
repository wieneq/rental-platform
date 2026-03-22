const store = require('../data/store');

// 取得所有預約
exports.getAll = (req, res) => {
  try {
    const { equipmentId, userId, status } = req.query;
    const currentUserId = req.session.userId;
    const currentUser = store.users.find(u => u.id === currentUserId);
    
    let bookings = [...store.bookings];
    
    // 非管理員只能看自己的預約或自己器材的預約
    if (currentUser.role !== 'admin') {
      bookings = bookings.filter(b => {
        if (b.userId === currentUserId) return true;
        const equipment = store.equipment.find(e => e.id === b.equipmentId);
        if (equipment && equipment.ownerId === currentUserId) return true;
        return false;
      });
    }
    
    // 過濾
    if (equipmentId) {
      bookings = bookings.filter(b => b.equipmentId === parseInt(equipmentId));
    }
    if (userId) {
      bookings = bookings.filter(b => b.userId === parseInt(userId));
    }
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }
    
    // 加入器材和使用者資訊
    bookings = bookings.map(b => {
      const equipment = store.equipment.find(e => e.id === b.equipmentId);
      const user = store.users.find(u => u.id === b.userId);
      return {
        ...b,
        equipmentName: equipment ? equipment.name : '未知',
        userName: user ? user.name : '未知'
      };
    });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: '取得預約失敗', message: error.message });
  }
};

// 檢查可用性
exports.checkAvailability = (req, res) => {
  try {
    const { equipmentId, startTime, endTime } = req.body;
    
    if (!equipmentId || !startTime || !endTime) {
      return res.status(400).json({ error: '缺少必要參數' });
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // 檢查時間衝突
    const conflicts = store.bookings.filter(b => {
      if (b.equipmentId !== parseInt(equipmentId)) return false;
      if (b.status === 'cancelled') return false;
      
      const bookingStart = new Date(b.startTime);
      const bookingEnd = new Date(b.endTime);
      
      // 檢查時間重疊
      return (start < bookingEnd && end > bookingStart);
    });
    
    res.json({
      available: conflicts.length === 0,
      conflicts: conflicts.map(c => ({
        id: c.id,
        startTime: c.startTime,
        endTime: c.endTime
      }))
    });
  } catch (error) {
    res.status(500).json({ error: '檢查可用性失敗', message: error.message });
  }
};

// 建立預約
exports.create = (req, res) => {
  try {
    const { equipmentId, startTime, endTime } = req.body;
    const userId = req.session.userId;
    
    if (!equipmentId || !startTime || !endTime) {
      return res.status(400).json({ error: '所有欄位都是必填的' });
    }
    
    const equipment = store.equipment.find(e => e.id === parseInt(equipmentId));
    if (!equipment) {
      return res.status(404).json({ error: '器材不存在' });
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // 檢查時間衝突
    const conflicts = store.bookings.filter(b => {
      if (b.equipmentId !== parseInt(equipmentId)) return false;
      if (b.status === 'cancelled') return false;
      
      const bookingStart = new Date(b.startTime);
      const bookingEnd = new Date(b.endTime);
      
      return (start < bookingEnd && end > bookingStart);
    });
    
    if (conflicts.length > 0) {
      return res.status(400).json({ error: '此時段已被預約' });
    }
    
    // 計算時數和金額
    const totalHours = Math.ceil((end - start) / (1000 * 60 * 60));
    const totalAmount = totalHours * equipment.hourlyRate;
    
    const newBooking = {
      id: store.getNextId('bookings'),
      equipmentId: parseInt(equipmentId),
      userId,
      startTime: start,
      endTime: end,
      totalHours,
      totalAmount,
      status: 'pending',
      createdAt: new Date()
    };
    
    store.bookings.push(newBooking);
    
    res.json({ success: true, booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: '建立預約失敗', message: error.message });
  }
};

// 更新預約狀態
exports.updateStatus = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    const booking = store.bookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: '預約不存在' });
    }
    
    booking.status = status;
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: '更新預約失敗', message: error.message });
  }
};
