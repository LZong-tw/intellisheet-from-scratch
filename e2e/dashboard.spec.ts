import { test, expect } from '@playwright/test'

test.describe('IntelliSheet Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test.describe('頁面載入', () => {
    test('應該顯示儀表板標題和歡迎訊息', async ({ page }) => {
      await expect(page.locator('h1:has-text("儀表板")')).toBeVisible()
      await expect(page.locator('text=/歡迎回來/')).toBeVisible()
    })

    test('應該顯示所有統計卡片', async ({ page }) => {
      const statsCards = [
        { title: '活躍表格', value: '24' },
        { title: '總用戶數', value: '1,234' },
        { title: '數據記錄', value: '45.2K' },
        { title: 'API 調用', value: '892K' }
      ]

      for (const card of statsCards) {
        await expect(page.locator(`text="${card.title}"`)).toBeVisible()
        await expect(page.locator(`text="${card.value}"`)).toBeVisible()
      }
    })
  })

  test.describe('導航功能', () => {
    test('應該能從側邊欄導航到各個頁面', async ({ page }) => {
      const navItems = [
        { text: '智能表格', url: '/spreadsheet' },
        { text: '權限管理', url: '/permissions' },
        { text: '工作流程', url: '/workflows' },
        { text: '數據分析', url: '/analytics' },
        { text: 'AI 工具', url: '/ai-tools' },
        { text: '設定', url: '/settings' }
      ]

      for (const item of navItems) {
        await page.click(`nav >> text="${item.text}"`)
        await expect(page).toHaveURL(new RegExp(item.url))
        await page.click('nav >> text="儀表板"')
        await expect(page).toHaveURL(/\/dashboard/)
      }
    })
  })

  test.describe('快速操作', () => {
    test('應該能點擊新建表格按鈕', async ({ page }) => {
      await page.click('button:has-text("新建表格")')
      await expect(page).toHaveURL(/\/spreadsheet/)
    })

    test('應該能點擊邀請用戶按鈕', async ({ page }) => {
      // 模擬點擊邀請用戶（可能會開啟模態框）
      await page.click('button:has-text("邀請用戶")')
      // 根據實際實現調整斷言
    })

    test('應該能點擊導出報告按鈕', async ({ page }) => {
      await page.click('button:has-text("導出報告")')
      // 檢查是否觸發下載或顯示導出選項
    })
  })

  test.describe('圖表顯示', () => {
    test('應該顯示活動趨勢圖表', async ({ page }) => {
      await expect(page.locator('text="活動趨勢"')).toBeVisible()
      // 檢查圖表容器
      const chartContainer = page.locator('text="活動趨勢" >> .. >> .recharts-wrapper')
      await expect(chartContainer).toBeVisible()
    })

    test('應該顯示用戶活動圖表', async ({ page }) => {
      await expect(page.locator('text="用戶活動"')).toBeVisible()
      const chartContainer = page.locator('text="用戶活動" >> .. >> .recharts-wrapper')
      await expect(chartContainer).toBeVisible()
    })
  })

  test.describe('最近活動', () => {
    test('應該顯示最近活動列表', async ({ page }) => {
      await expect(page.locator('text="最近活動"')).toBeVisible()
      
      // 檢查活動項目
      const activities = page.locator('.space-y-4 > div')
      await expect(activities).toHaveCount.greaterThan(0)
    })

    test('應該顯示活動的用戶和時間', async ({ page }) => {
      // 檢查第一個活動項目
      const firstActivity = page.locator('.space-y-4 > div').first()
      await expect(firstActivity.locator('text=/前$/')).toBeVisible()
    })
  })

  test.describe('響應式設計', () => {
    test('應該在移動設備上正確顯示', async ({ page }) => {
      // 設置移動設備視窗
      await page.setViewportSize({ width: 375, height: 667 })
      
      // 統計卡片應該垂直排列
      const cards = page.locator('.bg-white.p-6.rounded-lg')
      const firstCard = await cards.first().boundingBox()
      const secondCard = await cards.nth(1).boundingBox()
      
      expect(firstCard?.y).toBeLessThan(secondCard?.y || 0)
    })

    test('應該在平板設備上正確顯示', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // 檢查佈局是否適應平板尺寸
      await expect(page.locator('nav')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()
    })
  })

  test.describe('數據刷新', () => {
    test('應該能手動刷新數據', async ({ page }) => {
      // 假設有刷新按鈕
      const refreshButton = page.locator('button[aria-label="刷新數據"]')
      if (await refreshButton.isVisible()) {
        await refreshButton.click()
        // 檢查是否有載入指示器
        await expect(page.locator('.loading-spinner')).toBeVisible()
        await expect(page.locator('.loading-spinner')).toBeHidden({ timeout: 5000 })
      }
    })
  })

  test.describe('無障礙性', () => {
    test('應該有正確的標題結構', async ({ page }) => {
      // 應該只有一個 h1
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)
      
      // 檢查其他標題層級
      const h2Elements = page.locator('h2')
      await expect(h2Elements).toHaveCount.greaterThan(0)
    })

    test('應該可以使用鍵盤導航', async ({ page }) => {
      // Tab 到第一個可聚焦元素
      await page.keyboard.press('Tab')
      
      // 檢查焦點是否在預期元素上
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('統計卡片應該有適當的語義標記', async ({ page }) => {
      const cards = page.locator('article, [role="article"]')
      await expect(cards).toHaveCount.greaterThan(0)
    })
  })

  test.describe('性能', () => {
    test('頁面應該在 3 秒內載入完成', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/dashboard', { waitUntil: 'networkidle' })
      const loadTime = Date.now() - startTime
      
      expect(loadTime).toBeLessThan(3000)
    })

    test('應該不會有明顯的佈局偏移', async ({ page }) => {
      // 等待初始載入
      await page.waitForTimeout(1000)
      
      // 截圖比較
      const screenshot1 = await page.screenshot()
      await page.waitForTimeout(1000)
      const screenshot2 = await page.screenshot()
      
      // 簡單比較兩張截圖是否相同
      expect(screenshot1).toEqual(screenshot2)
    })
  })
})