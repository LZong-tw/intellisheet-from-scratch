import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('should navigate between main pages', async ({ page }) => {
    // Check if we're on the dashboard
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    
    // Navigate to Spreadsheet
    await page.getByRole('link', { name: /spreadsheet/i }).click();
    await expect(page.getByRole('heading', { name: /spreadsheet/i })).toBeVisible();
    
    // Navigate to Analytics
    await page.getByRole('link', { name: /analytics/i }).click();
    await expect(page.getByRole('heading', { name: /analytics/i })).toBeVisible();
    
    // Navigate to AI Tools
    await page.getByRole('link', { name: /ai tools/i }).click();
    await expect(page.getByRole('heading', { name: /ai tools/i })).toBeVisible();
    
    // Navigate to Workflows
    await page.getByRole('link', { name: /workflows/i }).click();
    await expect(page.getByRole('heading', { name: /workflows/i })).toBeVisible();
    
    // Navigate to Permissions
    await page.getByRole('link', { name: /permissions/i }).click();
    await expect(page.getByRole('heading', { name: /permissions/i })).toBeVisible();
    
    // Navigate to Settings
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
    
    // Navigate back to Dashboard
    await page.getByRole('link', { name: /dashboard/i }).click();
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should maintain active state for current page', async ({ page }) => {
    // Check dashboard is active initially
    await expect(page.getByRole('link', { name: /dashboard/i })).toHaveClass(/active/);
    
    // Navigate to Spreadsheet
    await page.getByRole('link', { name: /spreadsheet/i }).click();
    await expect(page.getByRole('link', { name: /spreadsheet/i })).toHaveClass(/active/);
    
    // Navigate to Analytics
    await page.getByRole('link', { name: /analytics/i }).click();
    await expect(page.getByRole('link', { name: /analytics/i })).toHaveClass(/active/);
  });

  test('should display user information in header', async ({ page }) => {
    // Check if user info is displayed
    await expect(page.getByText(/test user/i)).toBeVisible();
    await expect(page.getByText(/test@example\.com/i)).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    // Get initial theme
    const body = page.locator('body');
    const initialTheme = await body.getAttribute('class');
    
    // Click theme toggle
    await page.getByRole('button', { name: /toggle theme/i }).click();
    
    // Check if theme changed
    const newTheme = await body.getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
    
    // Toggle back
    await page.getByRole('button', { name: /toggle theme/i }).click();
    const finalTheme = await body.getAttribute('class');
    expect(finalTheme).toBe(initialTheme);
  });

  test('should handle logout', async ({ page }) => {
    // Click logout button
    await page.getByRole('button', { name: /logout/i }).click();
    
    // Should redirect to login page or show logout confirmation
    await expect(page.getByText(/logged out/i)).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu is accessible
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
    
    // Open mobile menu
    await page.getByRole('button', { name: /menu/i }).click();
    
    // Check if navigation links are visible in mobile menu
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /spreadsheet/i })).toBeVisible();
    
    // Close mobile menu
    await page.getByRole('button', { name: /close/i }).click();
    
    // Menu should be hidden
    await expect(page.getByRole('link', { name: /dashboard/i })).not.toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on navigation
    await page.keyboard.press('Tab');
    
    // Navigate through menu items with arrow keys
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('link', { name: /spreadsheet/i })).toBeFocused();
    
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('link', { name: /analytics/i })).toBeFocused();
    
    // Activate with Enter
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: /analytics/i })).toBeVisible();
  });

  test('should show breadcrumbs', async ({ page }) => {
    // Navigate to a sub-page
    await page.getByRole('link', { name: /spreadsheet/i }).click();
    
    // Check if breadcrumbs are displayed
    await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();
    await expect(page.getByText(/home/i)).toBeVisible();
    await expect(page.getByText(/spreadsheet/i)).toBeVisible();
  });

  test('should handle deep linking', async ({ page }) => {
    // Navigate directly to a page
    await page.goto('/spreadsheet');
    await expect(page.getByRole('heading', { name: /spreadsheet/i })).toBeVisible();
    
    // Navigate to another page
    await page.goto('/analytics');
    await expect(page.getByRole('heading', { name: /analytics/i })).toBeVisible();
  });
});