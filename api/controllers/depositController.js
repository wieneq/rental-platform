const store = require('../data/store');

// 取得所有押金記錄
exports.getAll = (req, res) => {
  try {
    const userId = req.session.userId;
    const user = store.users.find(u => u.id === userId);
    
    let deposits = [...store.deposits];
    
    // 非管理員只能看自己的押金
    if (user.role !== 'admin') {
      deposits = deposits.filter(d => d.userId === userId);
    }
    
    // 加入預約和器材資訊
    deposits = deposits.map(d => {
      const booking = store.bookings.find(b => b.id === d.bookingId);
      const equipment = booking ? store.equipment.find(e => e.id === booking.equipmentId) : null;
      const renter = store.users.find(u => u.id === d.userId);
      return {
        ...d,
        equipmentName: equipment ? equipment.name : '未知',
        renterName: renter ? renter.name : '未知'
      };
    });
    
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ error: '取得押金記錄失敗', message: error.message });
  }
};

// 退還押金
exports.refund = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const deposit = store.deposits.find(d => d.id === id);
    if (!deposit) {
      return res.status(404).json({ error: '押金記錄不存在' });
    }
    
    if (deposit.status === 'refunded') {
      return res.status(400).json({ error: '押金已退還' });
    }
    
    deposit.status = 'refunded';
    deposit.refundedAt = new Date();
    
    res.json({ success: true, deposit });
  } catch (error) {
    res.status(500).json({ error: '退還押金失敗', message: error.message });
  }
};

// 扣款
exports.deduct = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { deductedAmount, reason } = req.body;
    
    const deposit = store.deposits.find(d => d.id === id);
    if (!deposit) {
      return res.status(404).json({ error: '押金記錄不存在' });
    }
    
    if (deposit.status === 'refunded') {
      return res.status(400).json({ error: '押金已退還' });
    }
    
    deposit.deductedAmount = parseFloat(deductedAmount);
    deposit.reason = reason;
    deposit.status = 'deducted';
    deposit.refundedAt = new Date();
    
    res.json({ success: true, deposit });
  } catch (error) {
    res.status(500).json({ error: '扣款失敗', message: error.message });
  }
};

module.exports = exports;
