const bcrypt = require('bcryptjs');
const store = require('../data/store');

// 註冊
exports.register = async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    
    // 驗證
    if (!username || !password || !name || !role) {
      return res.status(400).json({ error: '所有欄位都是必填的' });
    }
    
    if (!['renter', 'owner'].includes(role)) {
      return res.status(400).json({ error: '角色只能是 renter 或 owner' });
    }
    
    // 檢查帳號是否已存在
    const existingUser = store.users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: '帳號已被註冊' });
    }
    
    // 雜湊密碼
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 建立使用者（直接啟用，不需審核）
    const newUser = {
      id: store.getNextId('users'),
      username,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date()
    };
    
    store.users.push(newUser);
    
    // 自動登入
    req.session.userId = newUser.id;
    
    res.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: '註冊失敗', message: error.message });
  }
};

// 登入（展示版本 - 簡化驗證）
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // 展示版：根據角色自動匹配用戶
    let user;
    
    if (role === 'admin') {
      // 尋找管理員
      user = store.users.find(u => u.role === 'admin');
    } else if (role === 'owner') {
      // 尋找器材擁有者
      user = store.users.find(u => u.role === 'owner');
    } else if (role === 'renter') {
      // 尋找租用者
      user = store.users.find(u => u.role === 'renter');
    }
    
    if (!user) {
      return res.status(401).json({ error: '找不到對應角色的用戶' });
    }
    
    // 建立 Session
    req.session.userId = user.id;
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: '登入失敗', message: error.message });
  }
};

// 登出
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: '登出失敗' });
    }
    res.json({ success: true, message: '已登出' });
  });
};

// 取得當前使用者
exports.me = (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: '未登入' });
  }
  
  const user = store.users.find(u => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: '使用者不存在' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role
  });
};
