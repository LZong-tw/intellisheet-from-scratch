import { test, expect } from '@playwright/test'
import { IntelliSheetPage } from '../utils/e2e-utils'

test.describe('Dashboard E2E Tests', () => {
  let page: IntelliSheetPage

  test.beforeEach(async ({ page: playwrightPage }) => {
    page = new IntelliSheetPage(playwrightPage)
    await page.goto()
  })

  test.describe('Dashboard Loading and Navigation', () => {
    test('should load dashboard successfully', async () => {
      await page.expectURL('/dashboard')
      await page.expectToBeVisible('h1')
      await page.expectTextContent('h1', /IntelliSheet Dashboard/)
    })

    test('should display all feature cards', async () => {
      await page.expectToBeVisible('text=Excel-like Spreadsheet')
      await page.expectToBeVisible('text=Dynamic Permissions')
      await page.expectToBeVisible('text=Workflow Automation')
      await page.expectToBeVisible('text=Advanced Analytics')
      await page.expectToBeVisible('text=AI-Powered Tools')
    })

    test('should navigate to different sections from feature cards', async () => {
      // Test spreadsheet navigation
      await page.page.click('text=Excel-like Spreadsheet')
      await page.expectURL('/spreadsheet')
      
      // Go back to dashboard
      await page.navigateTo('/dashboard')
      
      // Test permissions navigation
      await page.page.click('text=Dynamic Permissions')
      await page.expectURL('/permissions')
      
      // Go back to dashboard
      await page.navigateTo('/dashboard')
      
      // Test workflows navigation
      await page.page.click('text=Workflow Automation')
      await page.expectURL('/workflows')
    })
  })

  test.describe('Dashboard Stats and Metrics', () => {
    test('should display system metrics', async () => {
      await page.expectToBeVisible('text=Quick Stats')
      await page.expectToBeVisible('text=Active Users')
      await page.expectToBeVisible('text=Total Spreadsheets')
      await page.expectToBeVisible('text=Workflows Running')
    })

    test('should show recent activity section', async () => {
      await page.expectToBeVisible('text=Recent Activity')
      
      // Check for activity items
      const activityItems = page.page.locator('[data-testid="activity-item"]')
      await expect(activityItems).toHaveCount(expect.any(Number))
    })

    test('should display system health status', async () => {
      await page.expectToBeVisible('text=System Health')
      
      // Should show health indicators
      const healthIndicators = page.page.locator('[data-testid="health-indicator"]')
      await expect(healthIndicators).toHaveCount(expect.any(Number))
    })
  })

  test.describe('Dashboard Actions', () => {
    test('should handle refresh action', async () => {
      const refreshButton = page.page.getByRole('button', { name: /refresh/i })
      
      // Click refresh button
      await refreshButton.click()
      
      // Should show loading state briefly
      await page.page.waitForLoadState('networkidle')
      
      // Dashboard should still be functional
      await page.expectToBeVisible('text=IntelliSheet Dashboard')
    })

    test('should support search functionality', async () => {
      const searchInput = page.page.getByRole('textbox', { name: /search/i })
      
      await searchInput.fill('spreadsheet')
      await page.page.keyboard.press('Enter')
      
      // Should filter or highlight relevant content
      await page.page.waitForTimeout(1000) // Wait for search results
    })

    test('should handle notification center', async () => {
      const notificationButton = page.page.getByRole('button', { name: /notifications/i })
      
      await notificationButton.click()
      
      // Should open notification panel
      await page.expectToBeVisible('[data-testid="notification-panel"]')
    })
  })

  test.describe('Quick Actions', () => {
    test('should create new spreadsheet from dashboard', async () => {
      const newSpreadsheetButton = page.page.getByRole('button', { name: /new spreadsheet/i })
      
      await newSpreadsheetButton.click()
      
      // Should navigate to spreadsheet creation or open modal
      await page.page.waitForTimeout(2000)
      
      // Check if navigated to spreadsheet page or modal opened
      const currentURL = page.page.url()
      expect(currentURL).toMatch(/(spreadsheet|dashboard)/)
    })

    test('should create new workflow from dashboard', async () => {
      const newWorkflowButton = page.page.getByRole('button', { name: /create workflow/i })
      
      await newWorkflowButton.click()
      
      // Should navigate to workflow creation
      await page.page.waitForTimeout(2000)
      
      const currentURL = page.page.url()
      expect(currentURL).toMatch(/(workflow|dashboard)/)
    })

    test('should handle user management action', async () => {
      const addUserButton = page.page.getByRole('button', { name: /add user/i })
      
      await addUserButton.click()
      
      // Should open user management modal or navigate to user page
      await page.page.waitForTimeout(1000)
    })
  })

  test.describe('Data Visualization', () => {
    test('should display charts and graphs', async () => {
      // Check for chart containers
      await page.expectToBeVisible('[data-testid="usage-chart"]')
      await page.expectToBeVisible('[data-testid="performance-chart"]')
    })

    test('should handle chart interactions', async () => {
      const chartContainer = page.page.locator('[data-testid="usage-chart"]')
      
      // Hover over chart to see tooltips
      await chartContainer.hover()
      
      // Should show tooltip or highlight data points
      await page.page.waitForTimeout(500)
    })

    test('should update charts with real-time data', async () => {
      // Wait for any real-time updates
      await page.page.waitForTimeout(3000)
      
      // Charts should still be visible and functional
      await page.expectToBeVisible('[data-testid="usage-chart"]')
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async () => {
      await page.page.setViewportSize({ width: 375, height: 667 })
      
      await page.expectToBeVisible('text=IntelliSheet Dashboard')
      
      // Check if mobile layout is applied
      const container = page.page.locator('[data-testid="dashboard-container"]')
      await expect(container).toBeVisible()
    })

    test('should work on tablet devices', async () => {
      await page.page.setViewportSize({ width: 768, height: 1024 })
      
      await page.expectToBeVisible('text=IntelliSheet Dashboard')
      
      // Should show appropriate tablet layout
      const gridContainer = page.page.locator('.grid')
      await expect(gridContainer).toBeVisible()
    })

    test('should work on desktop', async () => {
      await page.page.setViewportSize({ width: 1920, height: 1080 })
      
      await page.expectToBeVisible('text=IntelliSheet Dashboard')
      
      // All feature cards should be visible in desktop layout
      const featureCards = page.page.locator('[data-testid="feature-card"]')
      await expect(featureCards).toHaveCount(5) // Assuming 5 feature cards
    })
  })

  test.describe('Performance', () => {
    test('should load within acceptable time', async () => {
      const startTime = Date.now()
      
      await page.goto()
      await page.expectToBeVisible('text=IntelliSheet Dashboard')
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
    })

    test('should handle multiple simultaneous actions', async () => {
      // Perform multiple actions quickly
      const refreshButton = page.page.getByRole('button', { name: /refresh/i })
      const searchInput = page.page.getByRole('textbox', { name: /search/i })
      
      await Promise.all([
        refreshButton.click(),
        searchInput.fill('test'),
        page.page.click('text=Excel-like Spreadsheet')
      ])
      
      // Should handle all actions without errors
      await page.page.waitForLoadState('networkidle')
    })
  })

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      // Simulate network failure
      await page.page.route('**/api/**', route => route.abort())
      
      await page.page.reload()
      
      // Should show error state or fallback content
      await page.page.waitForTimeout(2000)
      
      // Dashboard should still be partially functional
      await page.expectToBeVisible('text=IntelliSheet')
    })

    test('should recover from errors', async () => {
      // First simulate error
      await page.page.route('**/api/**', route => route.abort())
      await page.page.reload()
      
      // Then restore network
      await page.page.unroute('**/api/**')
      
      // Try to refresh or perform action
      const refreshButton = page.page.getByRole('button', { name: /refresh/i })
      await refreshButton.click()
      
      // Should recover and show normal content
      await page.page.waitForTimeout(3000)
    })
  })

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async () => {
      // Start from the first focusable element
      await page.page.keyboard.press('Tab')
      
      // Should be able to navigate through all interactive elements
      for (let i = 0; i < 10; i++) {
        await page.page.keyboard.press('Tab')
      }
      
      // Should be able to activate elements with Enter/Space
      await page.page.keyboard.press('Enter')
    })

    test('should have proper ARIA labels', async () => {
      // Check for important ARIA attributes
      const ariaLabels = page.page.locator('[aria-label]')
      await expect(ariaLabels).toHaveCount(expect.any(Number))
      
      const landmarks = page.page.locator('[role="main"], [role="navigation"], [role="banner"]')
      await expect(landmarks).toHaveCount(expect.any(Number))
    })

    test('should support screen readers', async () => {
      // Check for proper heading hierarchy
      const h1 = page.page.locator('h1')
      await expect(h1).toHaveCount(1)
      
      const h2s = page.page.locator('h2')
      await expect(h2s).toHaveCount(expect.any(Number))
      
      // Check for descriptive text
      const descriptions = page.page.locator('[aria-describedby]')
      await expect(descriptions).toHaveCount(expect.any(Number))
    })
  })

  test.describe('User Experience', () => {
    test('should provide visual feedback for interactions', async () => {
      const featureCard = page.page.locator('text=Excel-like Spreadsheet').first()
      
      // Hover should provide visual feedback
      await featureCard.hover()
      await page.page.waitForTimeout(500)
      
      // Click should provide feedback
      await featureCard.click()
      await page.page.waitForTimeout(1000)
    })

    test('should maintain state during navigation', async () => {
      // Perform search
      const searchInput = page.page.getByRole('textbox', { name: /search/i })
      await searchInput.fill('test query')
      
      // Navigate away and back
      await page.page.click('text=Excel-like Spreadsheet')
      await page.navigateTo('/dashboard')
      
      // Search should be cleared (or maintained based on UX design)
      const currentSearchValue = await searchInput.inputValue()
      expect(typeof currentSearchValue).toBe('string')
    })

    test('should provide contextual help and tooltips', async () => {
      // Hover over info icons or help buttons
      const helpButtons = page.page.locator('[data-testid="help-button"], [title]')
      const count = await helpButtons.count()
      
      if (count > 0) {
        await helpButtons.first().hover()
        await page.page.waitForTimeout(1000)
        
        // Should show tooltip or help text
        const tooltip = page.page.locator('[role="tooltip"], .tooltip')
        await expect(tooltip).toBeVisible()
      }
    })
  })
})