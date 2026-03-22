const store = require('../data/store');

// 取得所有報修
exports.getAll = (req, res) => {
  try {
    const userId = req.session.userId;
    const user = store.users.find(u => u.id === userId);
    
    let repairs = [...store.repairs];
    
    // 非管理員只能看自己的報修
    if (user.role !== 'admin') {
      repairs = repairs.filter(r => r.userId === userId);
    }
    
    // 加入器材和使用者資訊
    repairs = repairs.map(r => {
      const equipment = store.equipment.find(e => e.id === r.equipmentId);
      const renter = store.users.find(u => u.id === r.userId);
      return {
        ...r,
        equipmentName: equipment ? equipment.name : '未知',
        renterName: renter ? renter.name : '未知'
      };
    });
    
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ error: '取得報修記錄失敗', message: error.message });
  }
};

// 建立報修
exports.create = (req, res) => {
  try {
    const { bookingId, description, severity, photos } = req.body;
    const userId = req.session.userId;
    
    if (!bookingId || !description || !severity) {
      return res.status(400).json({ error: '所有欄位都是必填的' });
    }
    
    const booking = store.bookings.find(b => b.id === parseInt(bookingId));
    if (!booking) {
      return res.status(404).json({ error: '預約不存在' });
    }
    
    if (booking.userId !== userId) {
      return res.status(403).json({ error: '無權限報修此預約' });
    }
    
    const newRepair = {
      id: store.getNextId('repairs'),
      bookingId: booking.id,
      userId,
      equipmentId: booking.equipmentId,
      description,
      severity, // minor, moderate, severe
      photos: photos || [], // Base64 圖片陣列
      status: 'pending',
      adminNotes: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    store.repairs.push(newRepair);
    
    res.json({ success: true, repair: newRepair });
  } catch (error) {
    res.status(500).json({ error: '建立報修失敗', message: error.message });
  }
};

// 更新報修狀態
exports.updateStatus = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, adminNotes } = req.body;
    
    const repair = store.repairs.find(r => r.id === id);
    if (!repair) {
      return res.status(404).json({ error: '報修記錄不存在' });
    }
    
    if (status) repair.status = status; // pending, in_progress, resolved
    if (adminNotes !== undefined) repair.adminNotes = adminNotes;
    repair.updatedAt = new Date();
    
    res.json({ success: true, repair });
  } catch (error) {
    res.status(500).json({ error: '更新報修失敗', message: error.message });
  }
};

module.exports = exports;
