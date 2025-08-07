import { test, expect } from '@playwright/test'

test.describe('IntelliSheet 智能表格', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spreadsheet')
    await page.waitForLoadState('networkidle')
  })

  test.describe('表格基本功能', () => {
    test('應該顯示表格標題和工具列', async ({ page }) => {
      await expect(page.locator('h1:has-text("智能表格")')).toBeVisible()
      await expect(page.locator('[role="toolbar"]')).toBeVisible()
    })

    test('應該顯示表格網格', async ({ page }) => {
      const table = page.locator('table, [role="grid"]')
      await expect(table).toBeVisible()
      
      // 檢查是否有表頭
      const headers = page.locator('th')
      await expect(headers).toHaveCount.greaterThan(0)
    })

    test('應該能選擇單元格', async ({ page }) => {
      // 點擊第一個可編輯單元格
      const firstCell = page.locator('td').first()
      await firstCell.click()
      
      // 檢查單元格是否被選中
      await expect(firstCell).toHaveClass(/selected|active|focus/)
    })
  })

  test.describe('單元格編輯', () => {
    test('應該能編輯單元格內容', async ({ page }) => {
      const cell = page.locator('td').first()
      await cell.click()
      
      // 雙擊進入編輯模式
      await cell.dblclick()
      
      // 輸入新內容
      await page.keyboard.type('測試內容')
      await page.keyboard.press('Enter')
      
      // 驗證內容已更新
      await expect(cell).toContainText('測試內容')
    })

    test('應該能使用 Tab 鍵導航單元格', async ({ page }) => {
      const firstCell = page.locator('td').first()
      await firstCell.click()
      
      // 按 Tab 移動到下一個單元格
      await page.keyboard.press('Tab')
      
      // 檢查焦點是否移動
      const focusedCell = page.locator(':focus')
      await expect(focusedCell).not.toBe(firstCell)
    })

    test('應該支持複製貼上', async ({ page }) => {
      const sourceCell = page.locator('td').first()
      await sourceCell.click()
      await sourceCell.dblclick()
      await page.keyboard.type('複製內容')
      await page.keyboard.press('Enter')
      
      // 複製
      await sourceCell.click()
      await page.keyboard.press('Control+C')
      
      // 移動到另一個單元格
      const targetCell = page.locator('td').nth(1)
      await targetCell.click()
      
      // 貼上
      await page.keyboard.press('Control+V')
      
      await expect(targetCell).toContainText('複製內容')
    })
  })

  test.describe('工具列功能', () => {
    test('應該能使用撤銷/重做功能', async ({ page }) => {
      // 編輯單元格
      const cell = page.locator('td').first()
      await cell.click()
      await cell.dblclick()
      await page.keyboard.type('原始內容')
      await page.keyboard.press('Enter')
      
      // 撤銷
      await page.click('button[aria-label="撤銷"]')
      await expect(cell).not.toContainText('原始內容')
      
      // 重做
      await page.click('button[aria-label="重做"]')
      await expect(cell).toContainText('原始內容')
    })

    test('應該能插入行和列', async ({ page }) => {
      const initialRowCount = await page.locator('tr').count()
      
      // 插入新行
      await page.click('button[aria-label="插入行"]')
      
      const newRowCount = await page.locator('tr').count()
      expect(newRowCount).toBe(initialRowCount + 1)
    })

    test('應該能刪除行和列', async ({ page }) => {
      // 選擇一行
      const row = page.locator('tr').nth(1)
      await row.click()
      
      const initialRowCount = await page.locator('tr').count()
      
      // 刪除行
      await page.click('button[aria-label="刪除行"]')
      
      const newRowCount = await page.locator('tr').count()
      expect(newRowCount).toBe(initialRowCount - 1)
    })
  })

  test.describe('格式化功能', () => {
    test('應該能設置文字格式', async ({ page }) => {
      const cell = page.locator('td').first()
      await cell.click()
      
      // 設置粗體
      await page.click('button[aria-label="粗體"]')
      
      // 檢查樣式是否應用
      await expect(cell).toHaveCSS('font-weight', '700')
    })

    test('應該能設置單元格背景色', async ({ page }) => {
      const cell = page.locator('td').first()
      await cell.click()
      
      // 開啟顏色選擇器
      await page.click('button[aria-label="背景顏色"]')
      
      // 選擇顏色
      await page.click('[data-color="#ffeb3b"]')
      
      // 檢查背景色
      await expect(cell).toHaveCSS('background-color', 'rgb(255, 235, 59)')
    })
  })

  test.describe('公式功能', () => {
    test('應該能輸入和計算公式', async ({ page }) => {
      // 在 A1 輸入數字
      const cellA1 = page.locator('td[data-cell="A1"]')
      await cellA1.click()
      await cellA1.dblclick()
      await page.keyboard.type('10')
      await page.keyboard.press('Enter')
      
      // 在 B1 輸入數字
      const cellB1 = page.locator('td[data-cell="B1"]')
      await cellB1.click()
      await cellB1.dblclick()
      await page.keyboard.type('20')
      await page.keyboard.press('Enter')
      
      // 在 C1 輸入公式
      const cellC1 = page.locator('td[data-cell="C1"]')
      await cellC1.click()
      await cellC1.dblclick()
      await page.keyboard.type('=A1+B1')
      await page.keyboard.press('Enter')
      
      // 驗證計算結果
      await expect(cellC1).toContainText('30')
    })

    test('應該顯示公式錯誤', async ({ page }) => {
      const cell = page.locator('td').first()
      await cell.click()
      await cell.dblclick()
      await page.keyboard.type('=INVALID()')
      await page.keyboard.press('Enter')
      
      // 檢查錯誤顯示
      await expect(cell).toContainText('#ERROR')
    })
  })

  test.describe('數據篩選和排序', () => {
    test('應該能對列進行排序', async ({ page }) => {
      // 點擊列標題進行排序
      const columnHeader = page.locator('th').first()
      await columnHeader.click()
      
      // 檢查排序圖標
      await expect(columnHeader.locator('.sort-icon')).toBeVisible()
      
      // 再次點擊反向排序
      await columnHeader.click()
      await expect(columnHeader.locator('.sort-icon.desc')).toBeVisible()
    })

    test('應該能使用篩選功能', async ({ page }) => {
      // 開啟篩選選單
      await page.click('button[aria-label="篩選"]')
      
      // 輸入篩選條件
      await page.fill('input[placeholder="篩選..."]', '測試')
      await page.keyboard.press('Enter')
      
      // 檢查表格是否已篩選
      const visibleRows = page.locator('tr:visible')
      const rowCount = await visibleRows.count()
      expect(rowCount).toBeGreaterThan(0)
    })
  })

  test.describe('協作功能', () => {
    test('應該顯示其他用戶的游標', async ({ page }) => {
      // 模擬其他用戶
      const userCursor = page.locator('.user-cursor')
      
      // 如果有協作功能，應該能看到其他用戶的游標
      if (await userCursor.isVisible()) {
        await expect(userCursor).toHaveAttribute('data-user')
      }
    })

    test('應該能看到編輯歷史', async ({ page }) => {
      // 開啟歷史面板
      await page.click('button[aria-label="版本歷史"]')
      
      // 檢查歷史列表
      const historyPanel = page.locator('[role="dialog"]:has-text("版本歷史")')
      await expect(historyPanel).toBeVisible()
      
      const historyItems = historyPanel.locator('.history-item')
      await expect(historyItems).toHaveCount.greaterThan(0)
    })
  })

  test.describe('導入導出', () => {
    test('應該能導出為 Excel', async ({ page }) => {
      // 準備下載
      const downloadPromise = page.waitForEvent('download')
      
      // 點擊導出按鈕
      await page.click('button[aria-label="導出"]')
      await page.click('text="導出為 Excel"')
      
      // 等待下載
      const download = await downloadPromise
      expect(download.suggestedFilename()).toMatch(/\.xlsx?$/)
    })

    test('應該能導入 CSV 文件', async ({ page }) => {
      // 點擊導入按鈕
      await page.click('button[aria-label="導入"]')
      
      // 選擇文件
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'test.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('Name,Age\nJohn,30\nJane,25')
      })
      
      // 確認導入
      await page.click('button:has-text("確認導入")')
      
      // 檢查數據是否導入
      await expect(page.locator('td:has-text("John")')).toBeVisible()
      await expect(page.locator('td:has-text("30")')).toBeVisible()
    })
  })

  test.describe('性能和響應式', () => {
    test('應該能處理大量數據', async ({ page }) => {
      // 載入大數據集
      await page.click('button:has-text("載入範例數據")')
      await page.click('text="大數據集 (10000 行)"')
      
      // 等待載入
      await page.waitForLoadState('networkidle')
      
      // 檢查虛擬滾動是否工作
      const visibleRows = await page.locator('tr:visible').count()
      expect(visibleRows).toBeLessThan(100) // 應該使用虛擬滾動
      
      // 滾動測試
      await page.keyboard.press('End')
      await page.waitForTimeout(500)
      
      // 檢查是否能看到最後的數據
      await expect(page.locator('text="第 10000 行"')).toBeVisible()
    })

    test('應該在移動設備上可用', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // 檢查是否有移動版界面
      await expect(page.locator('.mobile-toolbar')).toBeVisible()
      
      // 測試觸控操作
      const cell = page.locator('td').first()
      await cell.tap()
      
      // 檢查是否顯示移動編輯器
      await expect(page.locator('.mobile-editor')).toBeVisible()
    })
  })
})