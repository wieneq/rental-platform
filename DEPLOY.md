# 🚀 部署指南 - GitHub + Vercel

## 📋 前置準備

### 需要的工具：
- ✅ Node.js（已安裝）
- ⬜ Git（需要安裝）
- ⬜ GitHub 帳號
- ⬜ Vercel 帳號（可用 GitHub 登入）

---

## 方法一：使用 VS Code 內建功能（最簡單 🌟）

### 步驟 1️⃣：安裝 Git

如果還沒安裝 Git：
- 下載：https://git-scm.com/download/win
- 安裝時全部使用預設選項即可
- **重要：** 安裝完成後重啟 VS Code

### 步驟 2️⃣：在 VS Code 初始化 Git

1. 點擊 VS Code 左側的「源代碼管理」圖標（三個圓點連線的圖標）
2. 點擊「初始化存儲庫」按鈕
3. 看到所有文件列表出現

### 步驟 3️⃣：提交代碼

1. 在源代碼管理面板，點擊「暫存所有更改」（+ 號）
2. 在上方訊息框輸入：`初始提交 - 共享器材租賃管理平台`
3. 點擊「提交」按鈕（✓ 打勾圖標）

### 步驟 4️⃣：發布到 GitHub

1. 點擊「發布分支」按鈕
2. 選擇「發布到 GitHub 公開存儲庫」（或私有，看您的需求）
3. 如果是第一次使用，VS Code 會要求登入 GitHub
4. 登入後自動創建存儲庫並上傳代碼 ✅

---

## 方法二：使用 GitHub Desktop（圖形化介面）

### 1. 安裝 GitHub Desktop
- 下載：https://desktop.github.com/
- 安裝並登入 GitHub 帳號

### 2. 添加項目
1. File → Add Local Repository
2. 選擇專案資料夾：`D:\20260322共享器材租賃管理平台`
3. 如果提示未初始化，點擊「Create a repository」

### 3. 發布到 GitHub
1. 填寫提交訊息：`初始提交`
2. 點擊「Commit to main」
3. 點擊「Publish repository」
4. 選擇是否公開，然後「Publish」

---

## 方法三：命令行（進階用戶）

### 前提：需先安裝 Git

```powershell
# 初始化 Git（在專案資料夾中執行）
git init

# 設定用戶資訊（首次使用必須）
git config --global user.name "您的名字"
git config --global user.email "您的郵箱"

# 添加所有文件
git add .

# 提交
git commit -m "初始提交 - 共享器材租賃管理平台"

# 設定主分支
git branch -M main

# 連接到 GitHub（需先在 github.com 創建空白 repository）
git remote add origin https://github.com/您的用戶名/repository名稱.git

# 推送
git push -u origin main
```

---

## 🚀 部署到 Vercel

### 📍 步驟一：創建 Vercel 帳號

1. 訪問：https://vercel.com
2. 點擊「Sign Up」
3. **選擇「Continue with GitHub」**（這樣可以自動連接您的 GitHub 存儲庫）
4. 授權 Vercel 訪問您的 GitHub

### 📍 步驟二：導入項目

1. 登入後，點擊「Add New...」→「Project」
2. 從列表中找到您剛才上傳的 GitHub 存儲庫
3. 點擊右側的「Import」按鈕

### 📍 步驟三：配置項目

**Configure Project 頁面設定：**

| 設定項 | 值 |
|--------|-----|
| Framework Preset | Other |
| Root Directory | `./` (預設) |
| Build Command | 留空 |
| Output Directory | `public` |
| Install Command | `npm install` |

**環境變數（Environment Variables）：**

點擊「Environment Variables」展開，添加：

```
Name: SESSION_SECRET
Value: rental-platform-secret-key-2026
```

### 📍 步驟四：部署

1. 點擊底部的「Deploy」按鈕
2. 等待部署完成（約 1-2 分鐘）
3. 看到 🎉 慶祝畫面就成功了！
4. 點擊「Visit」查看您的網站

### 📍 步驟五：獲取網址

部署成功後，您會得到一個網址，例如：
```
https://your-project-name.vercel.app
```

---

## 🔄 後續更新流程

每次修改代碼後：

### 使用 VS Code：
1. 在「源代碼管理」中暫存並提交更改
2. 點擊「同步更改」按鈕（雲朵上下箭頭圖標）
3. Vercel 會自動檢測到更改並重新部署

### 使用 GitHub Desktop：
1. Commit 更改
2. 點擊「Push origin」
3. Vercel 自動部署

### 使用命令行：
```bash
git add .
git commit -m "更新說明"
git push
```

---

## ⚠️ 重要提醒

### Vercel 免費方案限制：

1. **記憶體儲存問題：**
   - 現在使用的是記憶體儲存
   - 每次部署後資料會重置
   - 建議：整合 MongoDB Atlas（免費 512MB）

2. **Session 限制：**
   - Serverless 環境下 Session 可能不穩定
   - 目前的自動登入機制可以暫時解決

3. **執行時間限制：**
   - 免費方案每個請求最多 10 秒
   - 目前專案沒問題

### 網站功能測試：

部署後請測試：
- ✅ 登入功能（選擇角色登入）
- ✅ 瀏覽器材
- ✅ 預約功能（會自動登入）
- ✅ 簽署租約
- ✅ 新增器材（器材擁有者/管理員）

---

## 🎯 檢查清單

### GitHub 上傳：
- [ ] Git 已安裝
- [ ] 專案已初始化 Git
- [ ] 代碼已提交
- [ ] 已推送到 GitHub
- [ ] 在 github.com 可以看到代碼

### Vercel 部署：
- [ ] Vercel 帳號已創建
- [ ] 專案已導入
- [ ] 環境變數已設定（SESSION_SECRET）
- [ ] 部署成功
- [ ] 可以訪問網站
- [ ] 登入功能正常
- [ ] 預約功能正常

---
vercel --prod
```

---

## 環境變數設定

Vercel 部署後需要設定環境變數（可選）：

1. 進入 Vercel 專案設定
2. 找到 "Environment Variables"
3. 新增：
   - `SESSION_SECRET`: 任意隨機字串（提升安全性）

---

## 常見問題

### Q: 部署後資料消失？
A: 展示版使用記憶體儲存，重啟後會清空。每次啟動會自動載入範例資料。

### Q: 簽名或 PDF 無法儲存？
A: 展示版將檔案轉為 Base64 儲存在記憶體中，這是暫存方案。

### Q: 如何升級到正式版？
A: 整合資料庫（MongoDB/PostgreSQL）和檔案儲存（Cloudflare R2）。

### Q: Vercel 會收費嗎？
A: 免費方案足夠展示使用。只有流量超過 100GB/月才會收費。

---

## 測試流程

### 完整租用流程測試

1. **註冊並登入**
   - 訪問首頁 → 點擊「立即註冊」
   - 填寫資料，選擇「租用者」
   - 自動登入並導向控制台

2. **瀏覽並預約器材**
   - 點擊「瀏覽器材」
   - 選擇「Canon EOS R5 相機」
   - 查看日曆，點擊明天早上 10:00-14:00
   - 系統自動計算租金（4小時 × $500 = $2000）
   - 確認預約

3. **線上簽約**
   - 自動導向簽約頁面
   - 查看租約內容
   - 在簽名板上簽名
   - 點擊「確認簽署」
   - 系統自動生成 PDF 租約

4. **下載租約**
   - 導向「我的租約」頁面
   - 點擊「下載 PDF」
   - 檢查 PDF 內容是否包含簽名

5. **查看控制台**
   - 預約數、租約數、報修數統計
   - 快速操作按鈕

---

## 檔案結構說明

```
專案根目錄/
├── api/                    # 後端 API
│   ├── controllers/        # 業務邏輯（6個）
│   ├── routes/             # API 路由（6個）
│   ├── middleware/         # 認證與權限（2個）
│   └── data/
│       ├── store.js        # 記憶體儲存
│       └── seed.js         # 範例資料
│
├── public/                 # 前端頁面
│   ├── index.html          # 首頁
│   ├── login.html          # 登入
│   ├── register.html       # 註冊
│   ├── equipment-list.html # 器材列表
│   ├── equipment-detail.html  # 器材詳情 + 預約
│   ├── contract-sign.html  # 線上簽約
│   ├── my-bookings.html    # 我的預約
│   ├── my-contracts.html   # 我的租約
│   ├── my-repairs.html     # 報修記錄
│   ├── dashboard.html      # 控制台
│   ├── css/style.css       # 自訂樣式
│   └── js/api.js           # API 封裝
│
├── server.js               # Express 主程式
├── package.json            # 依賴設定
├── vercel.json             # Vercel 配置
└── README.md               # 專案說明
```

---

## 進階功能開發

若要擴展功能，可參考以下方向：

### 1. 整合資料庫
```bash
# MongoDB 範例
npm install mongodb mongoose

# 修改 api/data/store.js 改為資料庫連接
```

### 2. 整合檔案儲存
```bash
# Cloudflare R2 範例
npm install @aws-sdk/client-s3

# 修改 api/controllers/contractController.js
# 將 Base64 檔案上傳到 R2
```

### 3. 新增支付功能
```bash
# 綠界金流範例
npm install ecpay_aio_nodejs

# 在簽約後加入支付流程
```

### 4. Email 通知
```bash
# Nodemailer 範例
npm install nodemailer

# 預約成功、簽約完成時發送 Email
```

---

## 效能優化建議

### 前端優化
- 圖片使用 WebP 格式
- 啟用 Lazy Loading
- 壓縮 CSS/JS

### 後端優化
- 加入 Redis 快取
- API 回應壓縮（gzip）
- Rate Limiting 防護

### Vercel 優化
- 使用 CDN 加速靜態資源
- 設定適當的 Cache Headers
- 啟用 Edge Functions（若需要）

---

## 安全性檢查清單

✅ 密碼使用 bcryptjs 雜湊  
✅ Session 使用 HttpOnly Cookie  
✅ API 端點有權限檢查  
⚠️ 未實作 CSRF Token（展示版）  
⚠️ 未實作 Rate Limiting（展示版）  
⚠️ 未實作 HTTPS 強制（Vercel 自動啟用）  

正式環境建議加入：
- CSRF 保護
- Rate Limiting
- 輸入驗證與清理
- SQL Injection 防護（若使用 SQL）

---

## 技術支援

遇到問題？檢查以下項目：

1. **依賴安裝失敗**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **伺服器無法啟動**
   - 檢查 3000 Port 是否被佔用
   - 查看錯誤訊息中的提示

3. **Vercel 部署失敗**
   - 確認 package.json 格式正確
   - 確認 vercel.json 存在
   - 查看 Vercel 部署日誌

4. **功能異常**
   - 開啟瀏覽器 Console 查看錯誤
   - 檢查 Network 請求是否成功
   - 確認已登入（需要認證的功能）

---

## 授權

MIT License - 可自由使用、修改、分發
