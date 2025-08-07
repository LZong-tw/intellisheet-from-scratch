# IntelliSheet 測試手冊

本手冊提供了 IntelliSheet 專案的完整測試指南，包括單元測試、整合測試和端對端測試。

## 目錄

1. [快速開始](./quick-start.md)
2. [單元測試指南](./unit-testing.md)
3. [E2E 測試指南](./e2e-testing.md)
4. [測試最佳實踐](./best-practices.md)
5. [CI/CD 整合](./ci-cd.md)

## 測試框架概覽

### 使用的技術堆疊

- **單元測試**: Vitest + React Testing Library
- **E2E 測試**: Playwright
- **測試工具**: 
  - @testing-library/user-event (用戶交互模擬)
  - @testing-library/jest-dom (DOM 斷言)

### 測試目錄結構

```
workspace/
├── src/
│   ├── components/
│   │   └── __tests__/        # 組件單元測試
│   ├── pages/
│   │   └── __tests__/        # 頁面單元測試
│   ├── stores/
│   │   └── __tests__/        # 狀態管理測試
│   └── test/
│       ├── setup.ts          # 測試環境設置
│       ├── utils/            # 測試工具函數
│       ├── mocks/            # Mock 數據和函數
│       └── templates/        # 測試模板
├── e2e/                      # E2E 測試
│   ├── templates/            # E2E 測試模板
│   ├── dashboard.spec.ts     # Dashboard E2E 測試
│   └── spreadsheet.spec.ts   # Spreadsheet E2E 測試
├── vitest.config.ts          # Vitest 配置
└── playwright.config.ts      # Playwright 配置
```

## 快速開始

### 安裝依賴

```bash
npm install
```

### 執行測試

```bash
# 執行所有單元測試
npm run test

# 執行單元測試並監聽變化
npm run test:watch

# 執行單元測試並生成覆蓋率報告
npm run test:coverage

# 執行 E2E 測試
npm run test:e2e

# 執行 E2E 測試（有界面模式）
npm run test:e2e:ui

# 執行特定的測試文件
npm run test -- Layout.test.tsx
npm run test:e2e -- dashboard.spec.ts
```

## 測試策略

### 1. 單元測試

針對獨立的組件、函數和模組進行測試：

- 組件渲染和行為
- 自定義 Hooks
- 工具函數
- 狀態管理邏輯

### 2. 整合測試

測試多個組件或模組之間的交互：

- 路由導航
- 數據流
- API 整合

### 3. E2E 測試

模擬真實用戶場景的完整流程測試：

- 用戶工作流程
- 跨頁面交互
- 實際瀏覽器行為

## 測試覆蓋率目標

- 單元測試覆蓋率: > 80%
- 關鍵功能 E2E 覆蓋率: 100%
- 整體測試覆蓋率: > 70%

## 持續整合

測試會在以下情況自動執行：

1. 推送代碼到 main 分支
2. 建立 Pull Request
3. 每日定時執行完整測試套件

## 常見問題

### Q: 測試執行失敗怎麼辦？

A: 請檢查：
1. 是否安裝了所有依賴
2. 是否有未提交的代碼變更
3. 測試環境是否正確設置

### Q: 如何調試失敗的測試？

A: 
- 單元測試：使用 `npm run test:ui` 查看視覺化測試結果
- E2E 測試：使用 `npm run test:e2e:debug` 進入調試模式

### Q: 如何新增測試？

A: 
1. 參考 `src/test/templates/` 中的測試模板
2. 在對應的 `__tests__` 目錄中建立測試文件
3. 遵循既有的命名規範和測試結構

## 相關資源

- [Vitest 文檔](https://vitest.dev/)
- [React Testing Library 文檔](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright 文檔](https://playwright.dev/)

## 聯絡方式

如有問題或建議，請聯絡測試團隊或在專案 Issue 中提出。