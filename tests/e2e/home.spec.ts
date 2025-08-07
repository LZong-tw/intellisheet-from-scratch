import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('should display main header', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/IntelliSheet/i)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Next-Generation Spreadsheet Platform/)
  })

  test('should toggle sidebar', async ({ page }) => {
    await page.goto('/')
    const toggleButton = page.locator('button').first()
    await toggleButton.click()
    await expect(page.getByText('IntelliSheet')).not.toBeVisible()
  })
})