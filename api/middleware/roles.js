// 角色權限中介層

const store = require('../data/store');

function hasRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: '未登入' });
    }
    
    const user = store.users.find(u => u.id === req.session.userId);
    if (!user) {
      return res.status(401).json({ error: '使用者不存在' });
    }
    
    if (allowedRoles.includes(user.role)) {
      req.user = user;
      return next();
    }
    
    return res.status(403).json({ error: '權限不足' });
  };
}

module.exports = { hasRole };
