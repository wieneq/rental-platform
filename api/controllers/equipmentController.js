const store = require('../data/store');

// 取得所有器材
exports.getAll = (req, res) => {
  try {
    const { category, status } = req.query;
    
    let equipment = [...store.equipment];
    
    // 過濾
    if (category) {
      equipment = equipment.filter(e => e.category === category);
    }
    if (status) {
      equipment = equipment.filter(e => e.status === status);
    }
    
    // 加入擁有者資訊
    equipment = equipment.map(e => {
      const owner = store.users.find(u => u.id === e.ownerId);
      return {
        ...e,
        ownerName: owner ? owner.name : '未知'
      };
    });
    
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: '取得器材列表失敗', message: error.message });
  }
};

// 取得單一器材
exports.getById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const equipment = store.equipment.find(e => e.id === id);
    
    if (!equipment) {
      return res.status(404).json({ error: '器材不存在' });
    }
    
    const owner = store.users.find(u => u.id === equipment.ownerId);
    
    res.json({
      ...equipment,
      ownerName: owner ? owner.name : '未知'
    });
  } catch (error) {
    res.status(500).json({ error: '取得器材失敗', message: error.message });
  }
};

// 建立器材
exports.create = (req, res) => {
  try {
    const { name, description, category, hourlyRate, depositAmount, image } = req.body;
    const userId = req.session.userId;
    
    // 驗證
    if (!name || !description || !category || !hourlyRate || !depositAmount) {
      return res.status(400).json({ error: '所有欄位都是必填的' });
    }
    
    const newEquipment = {
      id: store.getNextId('equipment'),
      name,
      description,
      category,
      ownerId: userId,
      hourlyRate: parseFloat(hourlyRate),
      depositAmount: parseFloat(depositAmount),
      status: 'available',
      image: image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzk1YTVhNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zmo5p2RIDQ8L3RleHQ+PC9zdmc+',
      createdAt: new Date()
    };
    
    store.equipment.push(newEquipment);
    
    res.json({ success: true, equipment: newEquipment });
  } catch (error) {
    res.status(500).json({ error: '建立器材失敗', message: error.message });
  }
};

// 更新器材
exports.update = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.session.userId;
    const user = store.users.find(u => u.id === userId);
    
    const equipment = store.equipment.find(e => e.id === id);
    if (!equipment) {
      return res.status(404).json({ error: '器材不存在' });
    }
    
    // 權限檢查：只有擁有者或管理員可以更新
    if (equipment.ownerId !== userId && user.role !== 'admin') {
      return res.status(403).json({ error: '無權限更新此器材' });
    }
    
    const { name, description, category, hourlyRate, depositAmount, status, image } = req.body;
    
    if (name) equipment.name = name;
    if (description) equipment.description = description;
    if (category) equipment.category = category;
    if (hourlyRate) equipment.hourlyRate = parseFloat(hourlyRate);
    if (depositAmount) equipment.depositAmount = parseFloat(depositAmount);
    if (status) equipment.status = status;
    if (image) equipment.image = image;
    
    res.json({ success: true, equipment });
  } catch (error) {
    res.status(500).json({ error: '更新器材失敗', message: error.message });
  }
};

// 刪除器材
exports.delete = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.session.userId;
    const user = store.users.find(u => u.id === userId);
    
    const index = store.equipment.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: '器材不存在' });
    }
    
    const equipment = store.equipment[index];
    
    // 權限檢查
    if (equipment.ownerId !== userId && user.role !== 'admin') {
      return res.status(403).json({ error: '無權限刪除此器材' });
    }
    
    store.equipment.splice(index, 1);
    
    res.json({ success: true, message: '器材已刪除' });
  } catch (error) {
    res.status(500).json({ error: '刪除器材失敗', message: error.message });
  }
};
