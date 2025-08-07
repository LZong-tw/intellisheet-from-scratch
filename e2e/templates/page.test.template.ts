import { test, expect, Page } from '@playwright/test'

// 測試配置
test.describe.configure({ mode: 'parallel' })

test.describe('Page Name', () => {
  // 測試前的準備工作
  test.beforeEach(async ({ page }) => {
    // 導航到測試頁面
    await page.goto('/')
    
    // 等待頁面載入完成
    await page.waitForLoadState('networkidle')
  })

  test.describe('頁面載入測試', () => {
    test('應該成功載入頁面', async ({ page }) => {
      // 檢查頁面標題
      await expect(page).toHaveTitle(/Your App Title/)
      
      // 檢查主要元素是否存在
      await expect(page.locator('h1')).toBeVisible()
    })

    test('應該顯示正確的內容', async ({ page }) => {
      // 檢查特定文本
      await expect(page.locator('text=歡迎')).toBeVisible()
      
      // 檢查多個元素
      const elements = page.locator('.card')
      await expect(elements).toHaveCount(4)
    })
  })

  test.describe('導航測試', () => {
    test('應該能夠導航到其他頁面', async ({ page }) => {
      // 點擊導航連結
      await page.click('text=關於我們')
      
      // 檢查 URL 變化
      await expect(page).toHaveURL(/\/about/)
      
      // 檢查新頁面內容
      await expect(page.locator('h1')).toContainText('關於我們')
    })

    test('應該正確處理返回按鈕', async ({ page }) => {
      // 導航到新頁面
      await page.click('text=產品')
      await expect(page).toHaveURL(/\/products/)
      
      // 使用瀏覽器返回
      await page.goBack()
      await expect(page).toHaveURL('/')
    })
  })

  test.describe('表單交互測試', () => {
    test('應該能夠填寫並提交表單', async ({ page }) => {
      // 填寫表單
      await page.fill('input[name="username"]', 'testuser')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('textarea[name="message"]', '這是測試訊息')
      
      // 選擇下拉選單
      await page.selectOption('select[name="category"]', 'support')
      
      // 勾選複選框
      await page.check('input[type="checkbox"]')
      
      // 提交表單
      await page.click('button[type="submit"]')
      
      // 驗證成功訊息
      await expect(page.locator('.success-message')).toBeVisible()
      await expect(page.locator('.success-message')).toContainText('提交成功')
    })

    test('應該顯示表單驗證錯誤', async ({ page }) => {
      // 不填寫必填欄位直接提交
      await page.click('button[type="submit"]')
      
      // 檢查錯誤訊息
      await expect(page.locator('.error-message')).toBeVisible()
      await expect(page.locator('input[name="username"]')).toHaveClass(/error/)
    })
  })

  test.describe('響應式測試', () => {
    test('應該在移動設備上正確顯示', async ({ page }) => {
      // 設置視窗大小為移動設備
      await page.setViewportSize({ width: 375, height: 667 })
      
      // 檢查移動選單按鈕
      await expect(page.locator('.mobile-menu-button')).toBeVisible()
      
      // 檢查桌面導航應該隱藏
      await expect(page.locator('.desktop-nav')).toBeHidden()
      
      // 測試移動選單功能
      await page.click('.mobile-menu-button')
      await expect(page.locator('.mobile-menu')).toBeVisible()
    })

    test('應該在平板設備上正確顯示', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // 檢查佈局調整
      const sidebar = page.locator('.sidebar')
      await expect(sidebar).toHaveCSS('width', '200px')
    })
  })

  test.describe('異步操作測試', () => {
    test('應該正確處理數據載入', async ({ page }) => {
      // 觸發數據載入
      await page.click('button:has-text("載入數據")')
      
      // 檢查載入狀態
      await expect(page.locator('.loading-spinner')).toBeVisible()
      
      // 等待數據載入完成
      await expect(page.locator('.data-table')).toBeVisible({ timeout: 10000 })
      
      // 檢查數據是否顯示
      const rows = page.locator('.data-table tr')
      await expect(rows).toHaveCount.greaterThan(1)
    })

    test('應該處理 API 錯誤', async ({ page }) => {
      // 模擬 API 錯誤
      await page.route('**/api/data', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: '伺服器錯誤' })
        })
      })
      
      await page.click('button:has-text("載入數據")')
      
      // 檢查錯誤訊息
      await expect(page.locator('.error-alert')).toBeVisible()
      await expect(page.locator('.error-alert')).toContainText('載入失敗')
    })
  })

  test.describe('鍵盤導航測試', () => {
    test('應該支持鍵盤導航', async ({ page }) => {
      // Tab 導航
      await page.keyboard.press('Tab')
      await expect(page.locator('a:focus')).toBeVisible()
      
      // Enter 鍵激活
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(/\/dashboard/)
      
      // Escape 鍵關閉模態框
      await page.click('button:has-text("開啟對話框")')
      await expect(page.locator('.modal')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.locator('.modal')).toBeHidden()
    })
  })

  test.describe('無障礙測試', () => {
    test('應該有適當的 ARIA 標籤', async ({ page }) => {
      // 檢查主要地標
      await expect(page.locator('nav[aria-label="主導航"]')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()
      
      // 檢查表單標籤
      const input = page.locator('input[name="search"]')
      await expect(input).toHaveAttribute('aria-label', '搜尋')
      
      // 檢查按鈕的可訪問性
      const button = page.locator('button:has-text("提交")')
      await expect(button).toHaveAttribute('type', 'submit')
    })

    test('應該可以使用螢幕閱讀器導航', async ({ page }) => {
      // 檢查標題層級
      const h1 = await page.locator('h1').count()
      expect(h1).toBe(1)
      
      // 檢查連結的描述性文本
      const links = page.locator('a')
      const count = await links.count()
      
      for (let i = 0; i < count; i++) {
        const text = await links.nth(i).textContent()
        expect(text).not.toBe('')
        expect(text).not.toMatch(/點擊這裡|更多/)
      }
    })
  })

  test.describe('性能測試', () => {
    test('頁面應該在合理時間內載入', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/', { waitUntil: 'networkidle' })
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // 3秒內載入
    })

    test('應該優化圖片載入', async ({ page }) => {
      // 檢查圖片是否有延遲載入
      const images = page.locator('img')
      const count = await images.count()
      
      for (let i = 0; i < count; i++) {
        const img = images.nth(i)
        const loading = await img.getAttribute('loading')
        
        // 視窗外的圖片應該延遲載入
        const isInViewport = await img.isInViewport()
        if (!isInViewport) {
          expect(loading).toBe('lazy')
        }
      }
    })
  })

  test.describe('安全測試', () => {
    test('應該防止 XSS 攻擊', async ({ page }) => {
      // 嘗試注入腳本
      const xssPayload = '<script>alert("XSS")</script>'
      await page.fill('input[name="comment"]', xssPayload)
      await page.click('button:has-text("提交")')
      
      // 檢查是否正確轉義
      const displayedText = await page.locator('.comment-display').textContent()
      expect(displayedText).not.toContain('<script>')
      expect(displayedText).toContain('&lt;script&gt;')
    })
  })
})

// 輔助函數
async function login(page: Page, username: string, password: string) {
  await page.fill('input[name="username"]', username)
  await page.fill('input[name="password"]', password)
  await page.click('button:has-text("登入")')
  await page.waitForURL('/dashboard')
}

async function waitForDataLoad(page: Page) {
  await page.waitForSelector('.loading-spinner', { state: 'hidden' })
  await page.waitForSelector('.data-content', { state: 'visible' })
}