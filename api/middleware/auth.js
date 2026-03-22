// 認證中介層 - 檢查使用者是否已登入

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: '未登入', message: '請先登入' });
}

module.exports = { isAuthenticated };
