# 共享器材租賃管理平台

展示版本 - 完全免費的 Vercel 部署方案

## 功能特色

✅ **即時日曆預約** - FullCalendar 整合，視覺化時段管理，同時段衝突檢測  
✅ **線上簽核** - Signature Pad 手寫電子簽名，自動生成 PDF 租約  
✅ **押金管理** - 透明化押金收取、退還、扣款流程  
✅ **損毀報修追蹤** - 問題通報、照片上傳、狀態更新  
✅ **多角色系統** - 管理員、器材擁有者、租用者三種角色  
✅ **帳號密碼認證** - 簡易登入註冊系統（免審核，註冊即可使用）  

## 技術棧

**前端**
- HTML + CSS + JavaScript (原生)
- Bootstrap 5 (UI 框架)
- FullCalendar (日曆元件)
- Signature Pad (簽名元件)

**後端**
- Node.js + Express
- 記憶體儲存 (展示用，重啟後清空)
- pdf-lib (PDF 生成)
- bcryptjs (密碼加密)
- express-session (會話管理)

**部署**
- Vercel (免費方案)
- Serverless Functions
- 自動 CI/CD (GitHub 連接)

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 本地運行

```bash
npm start
```

伺服器將運行於 http://localhost:3000

### 3. 部署到 GitHub + Vercel

**詳細步驟請查看：** [DEPLOY.md](DEPLOY.md)

**快速摘要：**
1. 使用 VS Code 源代碼管理初始化 Git
2. 提交並發布到 GitHub（VS Code 會自動處理）
3. 在 Vercel.com 用 GitHub 登入
4. 導入您的 GitHub 存儲庫
5. 添加環境變數 `SESSION_SECRET`
6. 點擊 Deploy 完成！

每次推送到 GitHub，Vercel 會自動重新部署 🚀

## 登入方式

展示版本採用**簡易登入**方式：

1. 訪問登入頁面
2. **選擇角色**：管理員 / 器材擁有者 / 租用者
3. 帳號密碼可隨意輸入（或留空）
4. 點擊登入即可

系統會自動以選定的角色登入對應的示範帳號。

### 傳統登入方式（可選）

如果想使用傳統帳密登入，可以使用以下測試帳號：

| 帳號 | 密碼 | 角色 |
|------|------|------|
| admin | demo123 | 管理員 |
| owner1 | demo123 | 器材擁有者 |
| renter1 | demo123 | 租用者 |

## 使用流程

### 租用者流程
1. 註冊/登入
2. 瀏覽器材列表
3. 查看器材詳情，選擇預約時段
4. 確認預約
5. 線上簽署租約（手寫簽名）
6. 下載 PDF 租約
7. 取件後如有損毀可通報報修

### 器材擁有者流程
1. 登入
2. 新增器材（名稱、描述、時薪、押金）
3. 查看預約管理
4. 查看收益統計

### 管理員流程
1. 登入
2. 查看系統概況
3. 處理報修記錄
4. 管理押金（退還/扣款）

## 專案結構

```
/共享器材租賃管理平台/
├── public/               # 前端檔案
│   ├── index.html        # 首頁
│   ├── login.html        # 登入頁
│   ├── register.html     # 註冊頁
│   ├── equipment-list.html       # 器材列表
│   ├── equipment-detail.html     # 器材詳情 + 預約
│   ├── contract-sign.html        # 線上簽約
│   ├── my-contracts.html         # 我的租約
│   ├── dashboard.html            # 控制台
│   ├── css/style.css     # 自訂樣式
│   └── js/api.js         # API 呼叫封裝
├── api/                  # 後端 API
│   ├── data/
│   │   ├── store.js      # 記憶體儲存
│   │   └── seed.js       # 範例資料
│   ├── middleware/
│   │   ├── auth.js       # 認證中介層
│   │   └── roles.js      # 角色權限
│   ├── controllers/      # 業務邏輯控制器
│   └── routes/           # API 路由
├── server.js             # Express 主程式
├── package.json
├── vercel.json           # Vercel 部署設定
└── README.md
```

## API 端點

### 認證
- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 取得當前使用者

### 器材
- `GET /api/equipment` - 取得所有器材
- `GET /api/equipment/:id` - 取得單一器材
- `POST /api/equipment` - 建立器材 (需權限)
- `PUT /api/equipment/:id` - 更新器材 (需權限)
- `DELETE /api/equipment/:id` - 刪除器材 (需權限)

### 預約
- `GET /api/bookings` - 取得預約列表
- `POST /api/bookings/check-availability` - 檢查可用性
- `POST /api/bookings` - 建立預約
- `PUT /api/bookings/:id/status` - 更新預約狀態

### 租約
- `POST /api/contracts/sign` - 簽署租約
- `GET /api/contracts` - 取得租約列表
- `GET /api/contracts/:id` - 取得單一租約
- `GET /api/contracts/:id/download` - 下載 PDF

### 押金
- `GET /api/deposits` - 取得押金記錄
- `PUT /api/deposits/:id/refund` - 退還押金 (管理員)
- `PUT /api/deposits/:id/deduct` - 扣款 (管理員)

### 報修
- `GET /api/repairs` - 取得報修記錄
- `POST /api/repairs` - 建立報修
- `PUT /api/repairs/:id` - 更新報修狀態 (管理員)

## 核心功能實作

### 1. 時段衝突檢測
```javascript
// 檢查預約時間是否重疊
const conflicts = bookings.filter(b => {
  return (startTime < b.endTime && endTime > b.startTime);
});
```

### 2. PDF 租約生成
使用 `pdf-lib` 生成包含簽名的租約文件，儲存為 Base64 (展示版暫存方案)

### 3. 電子簽名
使用 `Signature Pad` 在 Canvas 上繪製簽名，支援滑鼠和觸控裝置

### 4. 角色權限控制
- 租用者：瀏覽、預約、簽約、報修
- 器材擁有者：+ 新增/管理自己的器材
- 管理員：+ 管理所有資源

## 展示版限制

⚠️ **記憶體儲存** - 伺服器重啟後資料清空  
⚠️ **檔案暫存** - 簽名/PDF 轉為 Base64 儲存  
⚠️ **無持久化** - 適合展示，不適合正式環境  

## 升級至正式版

若要長期使用，建議整合：
- **資料庫**：MongoDB / PostgreSQL
- **檔案儲存**：Cloudflare R2 (免費 10GB) 或 AWS S3
- **金流串接**：綠界、藍新等第三方支付

## 授權

MIT License

---

**展示平台** | 2026 © Rental Platform