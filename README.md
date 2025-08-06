# IntelliSheet Platform v2.0

> 下一代智能試算表平台 - 結合 Excel 的易用性與企業級的權限控制

![IntelliSheet](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)

## 🚀 快速開始

### Linux/macOS 使用者
```bash
# 克隆專案
git clone <your-repo-url>
cd <repo-name>

# 一鍵啟動
./start.sh

# 或手動啟動
npm install
npm run dev
```

### Windows 使用者
```powershell
# 克隆專案
git clone <your-repo-url>
cd <repo-name>

# 一鍵啟動 (PowerShell)
.\start.ps1

# 如果執行政策限制，請使用
powershell -ExecutionPolicy Bypass -File start.ps1

# 或手動啟動
npm install
npm run dev
```

訪問 http://localhost:3000 即可開始使用！

## 🎯 核心功能

### 1. Excel-like 表格編輯
- ✅ 直接點擊儲存格進行編輯
- ✅ 支援公式計算 (e.g., =A1+B1)
- ✅ 複製/貼上與復原/重做功能
- ✅ 欄位排序與篩選
- ✅ 即時自動儲存
- ✅ 匯入/匯出 CSV 檔案

### 2. 動態權限管理
- ✅ **簡單模式**: 傳統的角色權限矩陣 (RBAC)
- ✅ **進階模式**: 基於屬性的存取控制 (ABAC)
- ✅ 狀態驅動的動態權限
- ✅ 即時權限評估引擎

### 3. 工作流程自動化
- ✅ 視覺化工作流程編輯器
- ✅ 拖放式節點設計
- ✅ 事件觸發器與條件判斷
- ✅ 與試算表深度整合
- ✅ 測試與儲存功能

### 4. 即時分析儀表板
- ✅ 即時數據視覺化
- ✅ 自訂報表產生器
- ✅ 效能監控指標
- ✅ 使用行為分析
- ✅ 時間範圍選擇與比較模式

### 5. AI 智能助手
- ✅ 異常檢測與警報
- ✅ 趨勢預測與分析
- ✅ 自然語言查詢
- ✅ 智能數據建議
- ✅ AI 自動化任務

## 📁 專案結構

```
.
├── src/
│   ├── components/        # 共用元件
│   │   └── Layout.tsx     # 主要版面配置
│   ├── pages/            # 頁面元件
│   │   ├── Dashboard.tsx      # 主控台 (含即時更新)
│   │   ├── Spreadsheet.tsx    # 試算表編輯器 (含公式支援)
│   │   ├── Permissions.tsx    # 權限管理
│   │   ├── Workflows.tsx      # 工作流程 (含視覺化編輯器)
│   │   ├── Analytics.tsx      # 分析報表 (含互動圖表)
│   │   ├── AITools.tsx        # AI 工具 (含即時洞察)
│   │   └── Settings.tsx       # 系統設定
│   ├── App.tsx           # 主應用程式
│   ├── main.tsx          # 進入點
│   └── index.css         # 全域樣式
├── public/               # 靜態資源
├── original-templates/   # 原始範本檔案
│   ├── advanced analytics dashboard.ts
│   ├── ai-powered features dashboard.ts
│   ├── collaboration engine.ts
│   ├── core type system.ts
│   ├── intellisheet cli.ts
│   ├── intellisheet sdk.ts
│   ├── intellisheet solution templates.ts
│   ├── schema as code.ts
│   ├── virtual scrolling performance table.ts
│   └── workflow automation engine.ts
├── package.json          # 專案配置
├── start.sh             # 快速啟動腳本 (Linux/macOS)
├── start.ps1            # 快速啟動腳本 (Windows PowerShell)
├── tailwind.config.js   # Tailwind CSS 配置
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 建構配置
```

## 🛠️ 技術架構

- **前端框架**: React 18 + TypeScript
- **路由管理**: React Router v6
- **狀態管理**: React Hooks + Context
- **UI 框架**: Tailwind CSS
- **圖表庫**: Recharts
- **動畫效果**: Framer Motion
- **通知系統**: React Hot Toast
- **圖標**: Lucide React
- **構建工具**: Vite

## 🎨 使用示例

### 建立新的試算表
1. 點擊 Dashboard 的 "Create New Sheet"
2. 直接點擊儲存格開始編輯
3. 使用公式列輸入公式 (e.g., =E2+F2)
4. 使用 Ctrl+C/V 複製貼上，Ctrl+Z/Y 復原重做

### 設定權限規則
1. 進入 Permissions 頁面
2. 選擇 Simple Matrix 或 Advanced ABAC 模式
3. 配置角色權限或建立動態規則

### 建立自動化工作流程
1. 進入 Workflows 頁面
2. 點擊 "Create Workflow"
3. 從左側面板拖放節點到畫布
4. 點擊節點進行配置
5. 測試並儲存工作流程

## 🔐 權限系統說明

### Simple Matrix Mode (簡單矩陣模式)
- 適用於固定角色的組織
- 直觀的權限矩陣設定
- 支援批次權限操作

### Advanced ABAC Mode (進階 ABAC 模式)
- 基於使用者屬性的動態權限
- 支援複雜的條件表達式
- 即時權限評估

範例規則：
```javascript
// 部門經理可以編輯自己部門的資料
user.role === "Manager" && user.department === resource.department

// 資料擁有者有完整權限
user.id === resource.ownerId

// 工作時間內才能存取
currentTime >= "09:00" && currentTime <= "18:00"
```

## 📊 效能優化

- **虛擬滾動**: 支援 100K+ 行數據流暢瀏覽
- **智能快取**: 減少不必要的重新渲染
- **延遲載入**: 按需載入功能模組
- **公式計算**: 即時計算與快取結果

## 🚧 開發計畫

- [ ] 離線模式支援
- [ ] 行動裝置優化
- [ ] 更多 AI 功能
- [ ] 第三方整合 API
- [ ] 多語言支援

## 📝 授權

MIT License - 詳見 LICENSE 文件

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

---

**IntelliSheet** - 讓試算表變得更智能、更強大！