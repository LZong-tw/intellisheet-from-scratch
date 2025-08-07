# E2E 測試指南

本指南提供了使用 Playwright 進行端對端測試的完整說明。

## E2E 測試概述

端對端（E2E）測試模擬真實用戶在瀏覽器中的操作，測試整個應用程式的工作流程。E2E 測試能夠發現單元測試無法捕獲的問題，如路由、API 整合、跨頁面狀態等。

## Playwright 基礎

### 測試結構

```typescript
import { test, expect } from '@playwright/test'

test.describe('功能名稱', () => {
  test.beforeEach(async ({ page }) => {
    // 每個測試前的準備
    await page.goto('/')
  })

  test('測試名稱', async ({ page }) => {
    // 測試步驟
  })
})
```

### 常用操作

#### 導航

```typescript
// 訪問頁面
await page.goto('/dashboard')

// 等待頁面載入
await page.waitForLoadState('networkidle')

// 前進/後退
await page.goBack()
await page.goForward()

// 重新載入
await page.reload()
```

#### 定位元素

```typescript
// 文本選擇器
await page.locator('text=登入').click()

// CSS 選擇器
await page.locator('.submit-button').click()

// 角色選擇器
await page.getByRole('button', { name: '提交' }).click()

// 標籤選擇器
await page.getByLabel('用戶名').fill('user123')

// 測試 ID
await page.getByTestId('user-profile').click()

// 組合選擇器
await page.locator('article').filter({ hasText: '標題' }).click()
```

#### 交互操作

```typescript
// 點擊
await page.click('button')
await page.dblclick('button')
await page.click('button', { button: 'right' }) // 右鍵

// 輸入文字
await page.fill('input[name="email"]', 'test@example.com')
await page.type('input[name="email"]', 'test@example.com') // 逐字輸入

// 選擇下拉選單
await page.selectOption('select', 'value1')

// 勾選/取消勾選
await page.check('input[type="checkbox"]')
await page.uncheck('input[type="checkbox"]')

// 上傳文件
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf')

// 拖放
await page.dragAndDrop('#source', '#target')
```

#### 鍵盤操作

```typescript
// 按鍵
await page.keyboard.press('Enter')
await page.keyboard.press('Control+A')
await page.keyboard.press('Tab')

// 輸入文字
await page.keyboard.type('Hello World')

// 組合鍵
await page.keyboard.down('Shift')
await page.keyboard.press('Tab')
await page.keyboard.up('Shift')
```

## 進階測試技巧

### 等待策略

```typescript
// 等待元素出現
await page.waitForSelector('.loading', { state: 'hidden' })
await page.waitForSelector('.content', { state: 'visible' })

// 等待導航
await page.waitForURL('/dashboard')
await page.waitForURL(/\/user\/\d+/)

// 等待網路請求
await page.waitForLoadState('networkidle')

// 等待函數
await page.waitForFunction(() => document.querySelector('.data')?.textContent?.includes('完成'))

// 自定義等待
await expect(page.locator('.status')).toHaveText('就緒', { timeout: 10000 })
```

### 處理彈出視窗

```typescript
test('處理新視窗', async ({ page, context }) => {
  // 監聽新頁面
  const pagePromise = context.waitForEvent('page')
  
  await page.click('a[target="_blank"]')
  
  const newPage = await pagePromise
  await newPage.waitForLoadState()
  
  // 在新視窗中操作
  await expect(newPage).toHaveTitle('新頁面')
  
  // 關閉新視窗
  await newPage.close()
})

test('處理對話框', async ({ page }) => {
  // 處理 alert
  page.on('dialog', dialog => dialog.accept())
  
  await page.click('button')
  
  // 處理 confirm
  page.on('dialog', async dialog => {
    expect(dialog.message()).toBe('確定要刪除嗎？')
    await dialog.accept() // 或 dialog.dismiss()
  })
})
```

### 網路攔截

```typescript
test('模擬 API 響應', async ({ page }) => {
  // 攔截請求
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ])
    })
  })
  
  await page.goto('/users')
  
  await expect(page.locator('.user-list')).toContainText('User 1')
})

test('模擬網路錯誤', async ({ page }) => {
  await page.route('**/api/data', route => {
    route.abort('failed')
  })
  
  await page.goto('/dashboard')
  
  await expect(page.locator('.error')).toContainText('網路錯誤')
})
```

### 截圖和錄影

```typescript
test('視覺測試', async ({ page }) => {
  await page.goto('/dashboard')
  
  // 全頁截圖
  await page.screenshot({ path: 'dashboard.png', fullPage: true })
  
  // 元素截圖
  await page.locator('.chart').screenshot({ path: 'chart.png' })
  
  // 視覺比較
  await expect(page).toHaveScreenshot('dashboard.png')
})

// 在 playwright.config.ts 中配置錄影
use: {
  video: 'on-first-retry',
  screenshot: 'only-on-failure'
}
```

## 實際測試案例

### 完整的用戶流程

```typescript
test.describe('用戶註冊流程', () => {
  test('新用戶應該能成功註冊並登入', async ({ page }) => {
    // 1. 訪問註冊頁面
    await page.goto('/register')
    
    // 2. 填寫註冊表單
    await page.getByLabel('姓名').fill('張三')
    await page.getByLabel('電子郵件').fill('zhangsan@example.com')
    await page.getByLabel('密碼').fill('SecurePass123!')
    await page.getByLabel('確認密碼').fill('SecurePass123!')
    
    // 3. 同意條款
    await page.getByRole('checkbox', { name: '我同意服務條款' }).check()
    
    // 4. 提交註冊
    await page.getByRole('button', { name: '註冊' }).click()
    
    // 5. 驗證跳轉到歡迎頁面
    await expect(page).toHaveURL('/welcome')
    await expect(page.locator('h1')).toContainText('歡迎，張三')
    
    // 6. 登出
    await page.getByRole('button', { name: '登出' }).click()
    
    // 7. 使用新帳號登入
    await page.goto('/login')
    await page.getByLabel('電子郵件').fill('zhangsan@example.com')
    await page.getByLabel('密碼').fill('SecurePass123!')
    await page.getByRole('button', { name: '登入' }).click()
    
    // 8. 驗證成功登入
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('.user-name')).toContainText('張三')
  })
})
```

### 數據操作流程

```typescript
test.describe('表格數據管理', () => {
  test.beforeEach(async ({ page }) => {
    // 登入
    await page.goto('/login')
    await page.getByLabel('電子郵件').fill('admin@example.com')
    await page.getByLabel('密碼').fill('admin123')
    await page.getByRole('button', { name: '登入' }).click()
    
    // 導航到表格頁面
    await page.goto('/spreadsheet')
  })

  test('應該能創建、編輯和刪除數據', async ({ page }) => {
    // 創建新記錄
    await page.getByRole('button', { name: '新增' }).click()
    
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel('名稱').fill('測試產品')
    await dialog.getByLabel('價格').fill('99.99')
    await dialog.getByLabel('庫存').fill('100')
    await dialog.getByRole('button', { name: '儲存' }).click()
    
    // 驗證新記錄
    const newRow = page.locator('tr', { hasText: '測試產品' })
    await expect(newRow).toBeVisible()
    await expect(newRow).toContainText('99.99')
    await expect(newRow).toContainText('100')
    
    // 編輯記錄
    await newRow.getByRole('button', { name: '編輯' }).click()
    
    const editDialog = page.getByRole('dialog')
    await editDialog.getByLabel('價格').clear()
    await editDialog.getByLabel('價格').fill('89.99')
    await editDialog.getByRole('button', { name: '更新' }).click()
    
    // 驗證更新
    await expect(newRow).toContainText('89.99')
    
    // 刪除記錄
    await newRow.getByRole('button', { name: '刪除' }).click()
    
    // 確認刪除
    await page.getByRole('button', { name: '確認刪除' }).click()
    
    // 驗證刪除
    await expect(newRow).not.toBeVisible()
  })
})
```

### 響應式測試

```typescript
test.describe('響應式設計', () => {
  const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ]
  
  viewports.forEach(({ name, width, height }) => {
    test(`應該在 ${name} 上正確顯示`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/dashboard')
      
      if (name === 'Mobile') {
        // 移動版應該顯示漢堡選單
        await expect(page.locator('.mobile-menu-button')).toBeVisible()
        await expect(page.locator('.desktop-nav')).not.toBeVisible()
        
        // 測試移動選單
        await page.locator('.mobile-menu-button').click()
        await expect(page.locator('.mobile-menu')).toBeVisible()
      } else {
        // 桌面版應該顯示完整導航
        await expect(page.locator('.desktop-nav')).toBeVisible()
        await expect(page.locator('.mobile-menu-button')).not.toBeVisible()
      }
      
      // 檢查內容是否正確排列
      const cards = await page.locator('.stat-card').count()
      expect(cards).toBeGreaterThan(0)
    })
  })
})
```

## 測試組織

### Page Object 模式

```typescript
// pages/DashboardPage.ts
export class DashboardPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/dashboard')
  }
  
  async getStatValue(statName: string) {
    return this.page.locator(`.stat-card:has-text("${statName}") .value`).textContent()
  }
  
  async clickQuickAction(actionName: string) {
    await this.page.getByRole('button', { name: actionName }).click()
  }
  
  async waitForDataLoad() {
    await this.page.waitForSelector('.loading', { state: 'hidden' })
  }
}

// 在測試中使用
test('使用 Page Object', async ({ page }) => {
  const dashboard = new DashboardPage(page)
  
  await dashboard.goto()
  await dashboard.waitForDataLoad()
  
  const userCount = await dashboard.getStatValue('總用戶數')
  expect(userCount).toBe('1,234')
  
  await dashboard.clickQuickAction('新建表格')
  await expect(page).toHaveURL('/spreadsheet')
})
```

### 共享設置

```typescript
// fixtures/auth.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // 登入
    await page.goto('/login')
    await page.getByLabel('電子郵件').fill('admin@example.com')
    await page.getByLabel('密碼').fill('admin123')
    await page.getByRole('button', { name: '登入' }).click()
    await page.waitForURL('/dashboard')
    
    // 使用已認證的頁面
    await use(page)
  }
})

// 使用 fixture
test('需要認證的測試', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/settings')
  // 已經登入，可以直接測試
})
```

## 調試技巧

### 調試模式

```bash
# 開啟調試模式
npx playwright test --debug

# 開啟 UI 模式
npx playwright test --ui

# 顯示瀏覽器
npx playwright test --headed

# 減慢執行速度
npx playwright test --slow-mo=1000
```

### 調試代碼

```typescript
test('調試測試', async ({ page }) => {
  // 暫停執行
  await page.pause()
  
  // 截圖調試
  await page.screenshot({ path: 'debug-state.png' })
  
  // 輸出 HTML
  console.log(await page.content())
  
  // 評估頁面狀態
  const title = await page.evaluate(() => document.title)
  console.log('Page title:', title)
})
```

## 性能優化

### 並行執行

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
})

// 測試文件中
test.describe.configure({ mode: 'parallel' })
```

### 重用狀態

```typescript
// global-setup.ts
async function globalSetup() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  // 登入並保存狀態
  await page.goto('/login')
  await page.fill('[name="email"]', 'admin@example.com')
  await page.fill('[name="password"]', 'admin123')
  await page.click('button[type="submit"]')
  
  // 保存認證狀態
  await page.context().storageState({ path: 'auth.json' })
  await browser.close()
}

// 在測試中使用
test.use({ storageState: 'auth.json' })
```

## 最佳實踐

1. **使用描述性的測試名稱**
2. **保持測試獨立性**
3. **避免硬編碼等待時間**
4. **使用 Page Object 模式組織代碼**
5. **適當使用截圖和錄影**
6. **處理測試數據清理**
7. **使用適當的斷言和等待**

## 常見問題

### 元素無法點擊

```typescript
// 等待元素可點擊
await page.locator('button').click({ force: true })

// 滾動到元素
await page.locator('button').scrollIntoViewIfNeeded()
await page.locator('button').click()
```

### 處理動態內容

```typescript
// 等待特定文本出現
await page.waitForFunction(
  text => document.body.textContent?.includes(text),
  '載入完成'
)

// 使用更靈活的選擇器
await page.locator('text=/價格.*\d+/').click()
```