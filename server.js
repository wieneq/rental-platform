const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中介層設定
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// 信任 Vercel 反向代理
app.set('trust proxy', 1);

// Session 設定
app.use(session({
  secret: process.env.SESSION_SECRET || 'rental-platform-secret-key-2026',
  resave: true,
  saveUninitialized: true,
  proxy: true,
  cookie: { 
    secure: false, // Vercel 環境設為 false
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 小時
  }
}));

// 初始化範例資料
require('./api/data/seed');

// API 路由
app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/equipment', require('./api/routes/equipment'));
app.use('/api/bookings', require('./api/routes/bookings'));
app.use('/api/contracts', require('./api/routes/contracts'));
app.use('/api/deposits', require('./api/routes/deposits'));
app.use('/api/repairs', require('./api/routes/repairs'));

// 首頁路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 處理所有 HTML 頁面
app.get('/*.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', req.path));
});

// 錯誤處理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '伺服器錯誤', message: err.message });
});

// 啟動伺服器 (只在本地環境)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 共享器材租賃管理平台運行於 http://localhost:${PORT}`);
    console.log(`📚 展示版本 - 使用記憶體儲存 (Vercel 部署用)`);
  });
}

module.exports = app;
