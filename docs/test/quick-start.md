# 快速開始測試指南

本指南將幫助您快速上手 IntelliSheet 的測試環境。

## 環境準備

### 1. 安裝測試依賴

```bash
# 如果尚未安裝，執行以下命令
npm install
```

### 2. 安裝 Playwright 瀏覽器

```bash
# 首次使用需要安裝瀏覽器
npx playwright install
```

## 執行第一個測試

### 單元測試

```bash
# 執行所有單元測試
npm run test

# 執行特定測試文件
npm run test Layout.test.tsx

# 監聽模式（開發時使用）
npm run test:watch
```

### E2E 測試

```bash
# 執行所有 E2E 測試
npm run test:e2e

# 執行特定測試
npm run test:e2e dashboard.spec.ts

# UI 模式（視覺化調試）
npm run test:e2e:ui
```

## 撰寫您的第一個測試

### 1. 單元測試範例

建立文件 `src/components/__tests__/MyComponent.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/utils/test-utils'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('應該正確渲染', () => {
    render(<MyComponent title="測試標題" />)
    
    expect(screen.getByText('測試標題')).toBeInTheDocument()
  })
})
```

### 2. E2E 測試範例

建立文件 `e2e/my-feature.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('我的功能', () => {
  test('應該完成基本流程', async ({ page }) => {
    // 導航到頁面
    await page.goto('/my-page')
    
    // 執行操作
    await page.click('button:has-text("開始")')
    
    // 驗證結果
    await expect(page.locator('.result')).toBeVisible()
  })
})
```

## 常用測試命令

### 單元測試命令

```bash
# 執行測試
npm run test

# 監聽模式
npm run test:watch

# 覆蓋率報告
npm run test:coverage

# UI 模式
npm run test:ui

# 調試模式
npm run test -- --inspect
```

### E2E 測試命令

```bash
# 執行測試
npm run test:e2e

# 頭部模式（顯示瀏覽器）
npm run test:e2e:headed

# 調試模式
npm run test:e2e:debug

# 生成測試報告
npm run test:e2e:report
```

## 測試文件命名規範

- **單元測試**: `ComponentName.test.tsx` 或 `functionName.test.ts`
- **E2E 測試**: `feature-name.spec.ts`

## 測試數據管理

### Mock 數據

放置在 `src/test/mocks/` 目錄：

```typescript
// src/test/mocks/userData.ts
export const mockUser = {
  id: '1',
  name: '測試用戶',
  email: 'test@example.com'
}
```

### 測試環境變數

建立 `.env.test` 文件：

```env
VITE_API_URL=http://localhost:3001
VITE_TEST_MODE=true
```

## 調試技巧

### 1. 單元測試調試

```typescript
// 使用 console.log
it('調試測試', () => {
  const result = myFunction()
  console.log('結果:', result)
  expect(result).toBe(expected)
})

// 使用 screen.debug()
it('調試 DOM', () => {
  render(<MyComponent />)
  screen.debug() // 印出當前 DOM
})
```

### 2. E2E 測試調試

```typescript
// 暫停執行
test('調試 E2E', async ({ page }) => {
  await page.goto('/dashboard')
  await page.pause() // 暫停在這裡
  await page.click('button')
})

// 截圖
test('截圖調試', async ({ page }) => {
  await page.goto('/dashboard')
  await page.screenshot({ path: 'debug.png' })
})
```

## 最佳實踐快速提示

1. **保持測試獨立性** - 每個測試應該能獨立執行
2. **使用描述性的測試名稱** - 清楚說明測試的目的
3. **遵循 AAA 模式** - Arrange, Act, Assert
4. **避免測試實現細節** - 測試行為而非實現
5. **使用測試模板** - 參考 `src/test/templates/`

## 下一步

- 閱讀[單元測試指南](./unit-testing.md)深入了解單元測試
- 閱讀[E2E 測試指南](./e2e-testing.md)深入了解端對端測試
- 查看[測試最佳實踐](./best-practices.md)提升測試品質