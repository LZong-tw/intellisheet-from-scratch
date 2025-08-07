# IntelliSheet Testing Guide

## 概述

本文檔提供 IntelliSheet 專案的完整測試指南，包含單元測試、E2E 測試，以及使用 Playwright 進行自動化測試的詳細說明。

## 目錄

- [測試架構](#測試架構)
- [快速開始](#快速開始)
- [單元測試](#單元測試)
- [E2E 測試](#e2e-測試)
- [測試工具](#測試工具)
- [測試樣板](#測試樣板)
- [最佳實踐](#最佳實踐)
- [故障排除](#故障排除)

## 測試架構

### 工具堆疊

- **單元測試**: Vitest + React Testing Library
- **E2E 測試**: Playwright
- **模擬**: Vi (Vitest 內建)
- **斷言**: expect (Vitest/Playwright 內建)

### 目錄結構

```
tests/
├── e2e/                    # E2E 測試
│   ├── dashboard.spec.ts
│   ├── spreadsheet.spec.ts
│   └── workflows.spec.ts
├── unit/                   # 單元測試
│   ├── components/
│   │   ├── Layout.test.tsx
│   │   └── FormBuilder.test.tsx
│   └── pages/
│       ├── Dashboard.test.tsx
│       └── Spreadsheet.test.tsx
├── utils/                  # 測試工具
│   ├── test-utils.tsx      # React Testing Library 工具
│   └── e2e-utils.ts        # Playwright 頁面物件
├── fixtures/               # 測試資料
│   └── test-data.ts
└── templates/              # 測試樣板
    ├── component.test.template.tsx
    └── e2e.test.template.ts
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

# 執行單元測試並監視變更
npm run test:watch

# 執行單元測試並產生覆蓋率報告
npm run test:coverage

# 執行 E2E 測試
npm run test:e2e

# 執行 E2E 測試並開啟 UI
npm run test:e2e:ui

# 執行 E2E 測試（有視窗模式）
npm run test:e2e:headed

# 除錯 E2E 測試
npm run test:e2e:debug
```

### 測試 UI

```bash
# 開啟 Vitest UI（單元測試）
npm run test:ui

# 開啟 Playwright UI（E2E 測試）
npm run test:e2e:ui
```

## 單元測試

### 設定檔案

- `vite.config.ts`: Vitest 配置
- `src/test/setup.ts`: 測試環境設定

### 撰寫單元測試

#### 基本元件測試

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import MyComponent from '../../src/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<MyComponent onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

#### 模擬外部依賴

```typescript
// 模擬 React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ id: 'test-id' }),
}))

// 模擬 Zustand Store
vi.mock('../../src/stores/useStore', () => ({
  default: () => ({
    data: [],
    loading: false,
    fetchData: vi.fn(),
  })
}))
```

### 測試類型

1. **渲染測試**: 驗證元件正確渲染
2. **互動測試**: 測試使用者操作
3. **狀態測試**: 驗證狀態管理
4. **條件渲染**: 測試不同條件下的渲染
5. **無障礙性**: 確保可訪問性
6. **效能測試**: 檢查重複渲染

## E2E 測試

### 設定檔案

- `playwright.config.ts`: Playwright 配置

### 撰寫 E2E 測試

#### 基本頁面測試

```typescript
import { test, expect } from '@playwright/test'
import { IntelliSheetPage } from '../utils/e2e-utils'

test.describe('Dashboard Tests', () => {
  let page: IntelliSheetPage

  test.beforeEach(async ({ page: playwrightPage }) => {
    page = new IntelliSheetPage(playwrightPage)
    await page.goto()
  })

  test('should load dashboard', async () => {
    await page.expectURL('/dashboard')
    await page.expectToBeVisible('h1')
  })

  test('should navigate between pages', async () => {
    await page.clickNavLink('Spreadsheet')
    await page.expectURL('/spreadsheet')
  })
})
```

#### 使用頁面物件模式

```typescript
// 創建專用頁面類別
export class SpreadsheetPage extends IntelliSheetPage {
  async editCell(row: number, column: number, value: string) {
    await this.clickCell(row, column)
    await this.page.keyboard.press('Enter')
    await this.page.fill('[data-testid="cell-editor"]', value)
    await this.page.keyboard.press('Enter')
  }

  async addRow() {
    await this.page.click('[data-testid="add-row-button"]')
  }
}
```

### 測試策略

1. **關鍵使用者流程**: 測試主要功能路徑
2. **跨瀏覽器**: 在不同瀏覽器中測試
3. **響應式設計**: 測試不同螢幕尺寸
4. **效能**: 驗證載入時間和響應速度
5. **錯誤處理**: 測試錯誤情境
6. **無障礙性**: 確保鍵盤導航和螢幕閱讀器支援

## 測試工具

### 測試工具函數 (`tests/utils/test-utils.tsx`)

提供包裝好的渲染函數和常用模擬：

- `render()`: 包含 Router 的渲染函數
- `mockNavigate`: 模擬導航函數
- `mockSpreadsheetStore`: 模擬試算表 Store
- `waitForLoadingToFinish()`: 等待載入完成
- `createMockEvent()`: 創建模擬事件

### E2E 工具 (`tests/utils/e2e-utils.ts`)

頁面物件和工具方法：

- `IntelliSheetPage`: 基本頁面物件
- `SpreadsheetPage`: 試算表專用頁面物件
- `FormBuilderPage`: 表單建構器頁面物件
- `testPatterns`: 常用測試模式

### 測試資料 (`tests/fixtures/test-data.ts`)

預定義的測試資料：

- `testSpreadsheetData`: 試算表測試資料
- `testFormData`: 表單測試資料
- `testPermissions`: 權限測試資料
- `testWorkflows`: 工作流程測試資料

## 測試樣板

### 元件測試樣板

使用 `tests/templates/component.test.template.tsx`:

1. 複製樣板檔案
2. 替換 `ComponentName` 為實際元件名稱
3. 更新 props 和測試案例
4. 移除不需要的匯入

### E2E 測試樣板

使用 `tests/templates/e2e.test.template.ts`:

1. 複製樣板檔案
2. 替換 `Feature Name` 為實際功能名稱
3. 更新測試場景
4. 添加適當的測試資料和選擇器

## 最佳實踐

### 單元測試最佳實踐

1. **測試行為，而非實作**
   ```typescript
   // ✅ 好的做法
   expect(screen.getByRole('button')).toBeEnabled()
   
   // ❌ 避免的做法
   expect(component.state.isEnabled).toBe(true)
   ```

2. **使用語義化選擇器**
   ```typescript
   // ✅ 好的做法
   screen.getByRole('button', { name: /submit/i })
   screen.getByLabelText('Email address')
   
   // ❌ 避免的做法
   screen.getByClassName('btn-submit')
   ```

3. **等待非同步操作**
   ```typescript
   // ✅ 好的做法
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument()
   })
   
   // ❌ 避免的做法
   expect(screen.getByText('Success')).toBeInTheDocument()
   ```

### E2E 測試最佳實踐

1. **使用頁面物件模式**
   ```typescript
   // ✅ 好的做法
   const spreadsheetPage = new SpreadsheetPage(page)
   await spreadsheetPage.editCell(0, 0, 'New Value')
   
   // ❌ 避免的做法
   await page.click('[data-testid="cell-0-0"]')
   await page.keyboard.press('Enter')
   await page.fill('[data-testid="cell-editor"]', 'New Value')
   ```

2. **等待載入完成**
   ```typescript
   // ✅ 好的做法
   await page.waitForLoadState('networkidle')
   await expect(page.locator('text=Dashboard')).toBeVisible()
   
   // ❌ 避免的做法
   await page.waitForTimeout(5000)
   ```

3. **使用穩定的選擇器**
   ```typescript
   // ✅ 好的做法
   page.getByRole('button', { name: 'Save' })
   page.getByTestId('save-button')
   
   // ❌ 避免的做法
   page.locator('.btn.btn-primary.save-btn')
   ```

### 測試資料管理

1. **使用工廠函數**
   ```typescript
   const createTestUser = (overrides = {}) => ({
     id: 'test-user',
     name: 'Test User',
     email: 'test@example.com',
     ...overrides
   })
   ```

2. **隔離測試資料**
   ```typescript
   beforeEach(() => {
     // 每個測試都使用新的資料
     const testData = createFreshTestData()
   })
   ```

3. **清理測試資料**
   ```typescript
   afterEach(async () => {
     // 清理測試產生的資料
     await cleanupTestData()
   })
   ```

## 故障排除

### 常見問題

#### 1. 測試超時

```typescript
// 增加超時時間
test('slow test', async () => {
  // 測試內容
}, 10000) // 10 秒超時
```

#### 2. 模擬不生效

```typescript
// 確保模擬在匯入之前
vi.mock('./module', () => ({
  default: vi.fn()
}))

// 然後匯入
import MyComponent from './MyComponent'
```

#### 3. React Testing Library 查詢失敗

```typescript
// 使用 debug() 查看 DOM
render(<MyComponent />)
screen.debug() // 印出當前 DOM

// 使用 findBy* 等待元素出現
const element = await screen.findByText('Loading...')
```

#### 4. Playwright 元素未找到

```typescript
// 等待元素出現
await page.waitForSelector('[data-testid="element"]')

// 使用更寬鬆的選擇器
await page.locator('text=Save').first().click()
```

### 除錯技巧

#### 單元測試除錯

```typescript
// 1. 使用 console.log
console.log(screen.getByRole('button').textContent)

// 2. 使用 screen.debug()
screen.debug() // 印出整個 DOM
screen.debug(screen.getByRole('button')) // 印出特定元素

// 3. 使用 VSCode 除錯器
// 在測試中設定中斷點
```

#### E2E 測試除錯

```bash
# 1. 使用有視窗模式
npm run test:e2e:headed

# 2. 使用除錯模式
npm run test:e2e:debug

# 3. 截圖和錄影
await page.screenshot({ path: 'debug.png' })
```

### 效能最佳化

#### 單元測試效能

```typescript
// 1. 使用 vi.mock() 避免不必要的匯入
vi.mock('expensive-library')

// 2. 重用測試設定
const defaultProps = { /* ... */ }
beforeEach(() => {
  // 設定一次，多次使用
})

// 3. 避免不必要的渲染
const { rerender } = render(<Component {...props} />)
rerender(<Component {...newProps} />) // 重用實例
```

#### E2E 測試效能

```typescript
// 1. 並行執行測試
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : undefined, // 本地並行，CI 序列
})

// 2. 重用認證狀態
test.beforeAll(async ({ browser }) => {
  // 一次登入，多次使用
})

// 3. 選擇性執行
test.describe('Critical tests', () => {
  // 只執行關鍵測試
})
```

## 持續整合

### GitHub Actions 設定

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:run
      
      - name: Run E2E tests
        run: npm run test:e2e
```

### 測試報告

- **覆蓋率報告**: `npm run test:coverage`
- **E2E 報告**: 自動產生在 `playwright-report/`
- **截圖和錄影**: 失敗時自動擷取

## 總結

這個測試框架提供：

- ✅ 完整的單元測試覆蓋
- ✅ 端到端測試自動化
- ✅ 可重用的測試樣板
- ✅ 豐富的測試工具
- ✅ 詳細的文檔和最佳實踐

使用這些工具和指南，您可以確保 IntelliSheet 應用程式的品質和穩定性。