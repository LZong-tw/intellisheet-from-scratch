# IntelliSheet Claude MVP

> 基於 Claude AI 打造的下一代智能試算表平台

![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)

## 🎯 專案概覽

IntelliSheet 是一個結合了 Excel 易用性與企業級權限控制的智能試算表平台。透過 Claude AI 的強大能力，提供智能數據分析、自動化工作流程以及動態權限管理功能。

## 🚀 快速開始

### 1. 進入平台目錄
```bash
cd intellisheet-platform
```

### 2. 選擇適合您系統的啟動方式

**Linux/macOS:**
```bash
./start.sh
```

**Windows PowerShell:**
```powershell
.\start.ps1
```

### 3. 開始使用
瀏覽器會自動開啟 http://localhost:3000

## 📁 專案結構

```
intellisheet-claude-mvp/
├── intellisheet-platform/          # 🏠 主要平台程式碼
│   ├── src/                        # React 應用程式
│   ├── start.sh                    # Linux/macOS 啟動腳本
│   ├── start.ps1                   # Windows PowerShell 啟動腳本
│   └── README.md                   # 詳細使用說明
├── *.ts                           # 🧩 核心功能模組
│   ├── core type system.ts        # 型別系統
│   ├── workflow automation engine.ts  # 工作流程引擎
│   ├── collaboration engine.ts    # 協作引擎
│   └── ...                        # 其他功能模組
└── README.md                      # 📖 專案總覽 (本文件)
```

## ✨ 核心特色

- 🎨 **Excel-like 介面** - 熟悉的試算表操作體驗
- 🔐 **動態權限管理** - 支援 RBAC 和 ABAC 權限模式
- 🤖 **AI 智能助手** - Claude AI 驅動的數據分析與建議
- ⚡ **即時協作** - 多人同時編輯與即時同步
- 📊 **進階分析** - 豐富的圖表與儀表板功能
- 🔄 **工作流程自動化** - 視覺化流程設計器

## 📚 詳細文件

- [平台使用指南](./intellisheet-platform/README.md) - 完整的功能說明與使用範例
- [API 文件](./intellisheet%20sdk.ts) - SDK 與 API 參考
- [架構設計](./core%20type%20system.ts) - 系統核心架構

## 🛠️ 技術堆疊

- **前端**: React 18 + TypeScript + Tailwind CSS
- **狀態管理**: Zustand
- **表格處理**: TanStack Table
- **AI 整合**: Claude API
- **即時通訊**: Socket.io

## 🤝 參與貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

---

**🚀 立即體驗 IntelliSheet - 讓您的數據管理更智能！**
