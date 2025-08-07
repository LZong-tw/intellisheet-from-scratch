import { test, expect } from '@playwright/test'
import { IntelliSheetPage, SpreadsheetPage, FormBuilderPage } from '../utils/e2e-utils'

/**
 * E2E Test Template
 * 
 * Instructions:
 * 1. Replace 'Feature Name' with your actual feature name
 * 2. Update the test scenarios for your specific feature
 * 3. Add appropriate test data and selectors
 * 4. Use page objects for better maintainability
 */

test.describe('Feature Name E2E Tests', () => {
  let page: IntelliSheetPage

  test.beforeEach(async ({ page: playwrightPage }) => {
    page = new IntelliSheetPage(playwrightPage)
    await page.goto()
  })

  test.describe('Navigation and Basic UI', () => {
    test('should load the application successfully', async () => {
      await page.expectURL('/dashboard')
      await page.expectToBeVisible('[data-testid="main-content"]')
    })

    test('should navigate between pages', async () => {
      await page.clickNavLink('Spreadsheet')
      await page.expectURL('/spreadsheet')
      
      await page.clickNavLink('Analytics')
      await page.expectURL('/analytics')
      
      await page.clickNavLink('Dashboard')
      await page.expectURL('/dashboard')
    })

    test('should display correct page titles', async () => {
      await page.navigateTo('/dashboard')
      await expect(page.page).toHaveTitle(/Dashboard/)
      
      await page.navigateTo('/spreadsheet')
      await expect(page.page).toHaveTitle(/Spreadsheet/)
    })
  })

  test.describe('User Workflows', () => {
    test('should complete the main user workflow', async () => {
      // Example: Create a new spreadsheet workflow
      await page.navigateTo('/spreadsheet')
      await page.clickButton('New Spreadsheet')
      
      await page.waitForModal()
      await page.fillForm({
        name: 'Test Spreadsheet',
        description: 'A test spreadsheet for E2E testing'
      })
      await page.submitForm()
      
      // Verify spreadsheet was created
      await page.expectTextContent('[data-testid="spreadsheet-title"]', 'Test Spreadsheet')
      
      // Add some data
      const spreadsheetPage = new SpreadsheetPage(page.page)
      await spreadsheetPage.editCell(0, 0, 'Name')
      await spreadsheetPage.editCell(0, 1, 'Email')
      await spreadsheetPage.editCell(1, 0, 'John Doe')
      await spreadsheetPage.editCell(1, 1, 'john@example.com')
      
      // Save the spreadsheet
      await page.clickButton('Save')
      await page.expectToBeVisible('[data-testid="success-message"]')
    })

    test('should handle error scenarios', async () => {
      await page.navigateTo('/spreadsheet')
      await page.clickButton('New Spreadsheet')
      
      await page.waitForModal()
      // Try to submit without required fields
      await page.submitForm()
      
      // Should show validation errors
      await page.expectToBeVisible('[data-testid="error-name"]')
    })

    test('should support data export', async () => {
      const spreadsheetPage = new SpreadsheetPage(page.page)
      await spreadsheetPage.goto()
      
      // Create some test data
      await spreadsheetPage.addRow()
      await spreadsheetPage.editCell(0, 0, 'Test Data')
      
      // Test export functionality
      const downloadPromise = page.page.waitForEvent('download')
      await spreadsheetPage.exportData('csv')
      const download = await downloadPromise
      
      expect(download.suggestedFilename()).toMatch(/\.csv$/)
    })
  })

  test.describe('Form Functionality', () => {
    test('should create and use forms', async () => {
      const formBuilderPage = new FormBuilderPage(page.page)
      await formBuilderPage.navigateTo('/form-builder')
      
      // Create a new form
      await formBuilderPage.clickButton('New Form')
      await formBuilderPage.fillForm({
        name: 'Contact Form',
        description: 'A simple contact form'
      })
      await formBuilderPage.saveForm()
      
      // Add form fields
      await formBuilderPage.dragFieldToCanvas('text', { x: 100, y: 100 })
      await formBuilderPage.configureField('field-1', {
        label: 'Full Name',
        required: true
      })
      
      await formBuilderPage.dragFieldToCanvas('email', { x: 100, y: 200 })
      await formBuilderPage.configureField('field-2', {
        label: 'Email Address',
        required: true
      })
      
      // Preview the form
      await formBuilderPage.previewForm()
      await page.expectToBeVisible('[data-testid="form-preview"]')
      
      // Test form submission
      await page.fillForm({
        'field-1': 'John Doe',
        'field-2': 'john@example.com'
      })
      await page.submitForm()
      
      await page.expectToBeVisible('[data-testid="success-message"]')
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async () => {
      await page.page.setViewportSize({ width: 375, height: 667 })
      await page.goto()
      
      // Check mobile navigation
      await page.expectToBeVisible('[data-testid="mobile-menu-button"]')
      await page.clickButton('Menu')
      await page.expectToBeVisible('[data-testid="mobile-nav"]')
    })

    test('should work on tablet devices', async () => {
      await page.page.setViewportSize({ width: 768, height: 1024 })
      await page.goto()
      
      // Verify tablet layout
      await page.expectToBeVisible('[data-testid="tablet-layout"]')
    })

    test('should work on desktop', async () => {
      await page.page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto()
      
      // Verify desktop layout
      await page.expectToBeVisible('[data-testid="desktop-layout"]')
      await page.expectToBeVisible('[data-testid="sidebar"]')
    })
  })

  test.describe('Performance', () => {
    test('should load pages within acceptable time', async () => {
      const startTime = Date.now()
      await page.goto()
      const loadTime = Date.now() - startTime
      
      expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    })

    test('should handle large datasets', async () => {
      const spreadsheetPage = new SpreadsheetPage(page.page)
      await spreadsheetPage.goto()
      
      // Create a spreadsheet with many rows
      for (let i = 0; i < 100; i++) {
        await spreadsheetPage.addRow()
        await spreadsheetPage.editCell(i, 0, `Row ${i}`)
      }
      
      // Verify performance is still acceptable
      const startTime = Date.now()
      await spreadsheetPage.sortColumn(0, 'asc')
      const sortTime = Date.now() - startTime
      
      expect(sortTime).toBeLessThan(2000) // Should sort within 2 seconds
    })
  })

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async () => {
      await page.goto()
      
      // Test tab navigation
      await page.page.keyboard.press('Tab')
      await expect(page.page.locator(':focus')).toBeVisible()
      
      // Test enter key functionality
      await page.page.keyboard.press('Enter')
      // Verify appropriate action was taken
    })

    test('should have proper ARIA labels', async () => {
      await page.goto()
      
      // Check for important ARIA labels
      await expect(page.page.locator('[aria-label]')).toHaveCount(expect.any(Number))
      await expect(page.page.locator('[role="main"]')).toBeVisible()
    })

    test('should support screen readers', async () => {
      await page.goto()
      
      // Verify semantic HTML structure
      await expect(page.page.locator('main')).toBeVisible()
      await expect(page.page.locator('nav')).toBeVisible()
      await expect(page.page.locator('h1')).toBeVisible()
    })
  })

  test.describe('Data Persistence', () => {
    test('should save and load data correctly', async () => {
      const spreadsheetPage = new SpreadsheetPage(page.page)
      await spreadsheetPage.goto()
      
      // Create and save data
      await spreadsheetPage.editCell(0, 0, 'Persistent Data')
      await page.clickButton('Save')
      
      // Reload page and verify data persists
      await page.page.reload()
      await page.expectTextContent('[data-testid="cell-0-0"]', 'Persistent Data')
    })

    test('should handle offline scenarios', async () => {
      await page.goto()
      
      // Simulate offline
      await page.page.context().setOffline(true)
      
      // Try to perform an action that requires network
      await page.clickButton('Refresh Data')
      await page.expectToBeVisible('[data-testid="offline-message"]')
      
      // Go back online
      await page.page.context().setOffline(false)
      await page.clickButton('Retry')
      await page.expectToBeVisible('[data-testid="success-message"]')
    })
  })

  test.describe('Integration', () => {
    test('should integrate with external services', async () => {
      // Mock external API responses
      await page.page.route('**/api/external/*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: 'mocked' })
        })
      })
      
      await page.goto()
      await page.clickButton('Sync External Data')
      await page.expectToBeVisible('[data-testid="sync-success"]')
    })

    test('should handle authentication flows', async () => {
      await page.navigateTo('/login')
      
      await page.fillForm({
        email: 'test@example.com',
        password: 'password123'
      })
      await page.submitForm()
      
      // Should redirect to dashboard after login
      await page.expectURL('/dashboard')
      await page.expectToBeVisible('[data-testid="user-menu"]')
    })
  })
})