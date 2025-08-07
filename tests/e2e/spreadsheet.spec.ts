import { test, expect } from '@playwright/test';

test.describe('Spreadsheet', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the spreadsheet page
    await page.goto('/spreadsheet');
    await page.waitForLoadState('networkidle');
  });

  test('should load spreadsheet interface', async ({ page }) => {
    // Check if spreadsheet is loaded
    await expect(page.getByRole('heading', { name: /spreadsheet/i })).toBeVisible();
    await expect(page.getByTestId('spreadsheet-grid')).toBeVisible();
    await expect(page.getByTestId('toolbar')).toBeVisible();
  });

  test('should create new spreadsheet', async ({ page }) => {
    // Click new spreadsheet button
    await page.getByRole('button', { name: /new spreadsheet/i }).click();
    
    // Fill in spreadsheet details
    await page.getByLabel(/spreadsheet name/i).fill('Test Spreadsheet');
    await page.getByLabel(/description/i).fill('This is a test spreadsheet');
    
    // Create the spreadsheet
    await page.getByRole('button', { name: /create/i }).click();
    
    // Check that new spreadsheet is loaded
    await expect(page.getByText('Test Spreadsheet')).toBeVisible();
  });

  test('should edit cell content', async ({ page }) => {
    // Click on a cell
    await page.getByTestId('cell-A1').click();
    
    // Type content
    await page.keyboard.type('Hello World');
    await page.keyboard.press('Enter');
    
    // Check that content is saved
    await expect(page.getByTestId('cell-A1')).toContainText('Hello World');
  });

  test('should navigate between cells', async ({ page }) => {
    // Click on cell A1
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('A1 Content');
    await page.keyboard.press('Enter');
    
    // Navigate to B1
    await page.keyboard.press('Tab');
    await page.keyboard.type('B1 Content');
    await page.keyboard.press('Enter');
    
    // Navigate to A2
    await page.keyboard.press('ArrowDown');
    await page.keyboard.type('A2 Content');
    await page.keyboard.press('Enter');
    
    // Check all cells have content
    await expect(page.getByTestId('cell-A1')).toContainText('A1 Content');
    await expect(page.getByTestId('cell-B1')).toContainText('B1 Content');
    await expect(page.getByTestId('cell-A2')).toContainText('A2 Content');
  });

  test('should format cells', async ({ page }) => {
    // Select a cell
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('Formatted Text');
    await page.keyboard.press('Enter');
    
    // Open format menu
    await page.getByRole('button', { name: /format/i }).click();
    
    // Make text bold
    await page.getByRole('button', { name: /bold/i }).click();
    
    // Change text color
    await page.getByRole('button', { name: /text color/i }).click();
    await page.getByRole('button', { name: /red/i }).click();
    
    // Check that formatting is applied
    await expect(page.getByTestId('cell-A1')).toHaveClass(/bold/);
    await expect(page.getByTestId('cell-A1')).toHaveClass(/text-red/);
  });

  test('should insert and delete rows/columns', async ({ page }) => {
    // Insert a row
    await page.getByRole('button', { name: /insert row/i }).click();
    
    // Insert a column
    await page.getByRole('button', { name: /insert column/i }).click();
    
    // Check that new row and column are added
    await expect(page.getByTestId('row-2')).toBeVisible();
    await expect(page.getByTestId('column-B')).toBeVisible();
    
    // Delete a row
    await page.getByTestId('row-1').click({ button: 'right' });
    await page.getByText('Delete Row').click();
    
    // Check that row is deleted
    await expect(page.getByTestId('row-1')).not.toBeVisible();
  });

  test('should use formulas', async ({ page }) => {
    // Enter numbers in cells
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('10');
    await page.keyboard.press('Enter');
    
    await page.getByTestId('cell-A2').click();
    await page.keyboard.type('20');
    await page.keyboard.press('Enter');
    
    // Enter formula in A3
    await page.getByTestId('cell-A3').click();
    await page.keyboard.type('=A1+A2');
    await page.keyboard.press('Enter');
    
    // Check that formula result is displayed
    await expect(page.getByTestId('cell-A3')).toContainText('30');
  });

  test('should sort data', async ({ page }) => {
    // Enter data in column A
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('Zebra');
    await page.keyboard.press('Enter');
    
    await page.getByTestId('cell-A2').click();
    await page.keyboard.type('Apple');
    await page.keyboard.press('Enter');
    
    await page.getByTestId('cell-A3').click();
    await page.keyboard.type('Banana');
    await page.keyboard.press('Enter');
    
    // Select the range to sort
    await page.getByTestId('cell-A1').click();
    await page.keyboard.down('Shift');
    await page.getByTestId('cell-A3').click();
    await page.keyboard.up('Shift');
    
    // Sort ascending
    await page.getByRole('button', { name: /sort/i }).click();
    await page.getByText('Sort A to Z').click();
    
    // Check that data is sorted
    await expect(page.getByTestId('cell-A1')).toContainText('Apple');
    await expect(page.getByTestId('cell-A2')).toContainText('Banana');
    await expect(page.getByTestId('cell-A3')).toContainText('Zebra');
  });

  test('should filter data', async ({ page }) => {
    // Enter data
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('Category');
    await page.keyboard.press('Enter');
    
    await page.getByTestId('cell-A2').click();
    await page.keyboard.type('Fruit');
    await page.keyboard.press('Enter');
    
    await page.getByTestId('cell-A3').click();
    await page.keyboard.type('Vegetable');
    await page.keyboard.press('Enter');
    
    // Apply filter
    await page.getByRole('button', { name: /filter/i }).click();
    await page.getByText('Filter by Category').click();
    await page.getByText('Fruit').click();
    
    // Check that only fruit is visible
    await expect(page.getByTestId('cell-A2')).toBeVisible();
    await expect(page.getByTestId('cell-A3')).not.toBeVisible();
  });

  test('should create charts', async ({ page }) => {
    // Enter data for chart
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('Month');
    await page.keyboard.press('Enter');
    
    await page.getByTestId('cell-B1').click();
    await page.keyboard.type('Sales');
    await page.keyboard.press('Enter');
    
    await page.getByTestId('cell-A2').click();
    await page.keyboard.type('January');
    await page.keyboard.press('Enter');
    
    await page.getByTestId('cell-B2').click();
    await page.keyboard.type('100');
    await page.keyboard.press('Enter');
    
    // Select data range
    await page.getByTestId('cell-A1').click();
    await page.keyboard.down('Shift');
    await page.getByTestId('cell-B2').click();
    await page.keyboard.up('Shift');
    
    // Create chart
    await page.getByRole('button', { name: /insert chart/i }).click();
    await page.getByText('Bar Chart').click();
    
    // Check that chart is created
    await expect(page.getByTestId('chart-container')).toBeVisible();
  });

  test('should save and load spreadsheets', async ({ page }) => {
    // Create some content
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('Test Content');
    await page.keyboard.press('Enter');
    
    // Save spreadsheet
    await page.getByRole('button', { name: /save/i }).click();
    await page.getByLabel(/spreadsheet name/i).fill('Test Save');
    await page.getByRole('button', { name: /save/i }).click();
    
    // Check for success message
    await expect(page.getByText(/saved successfully/i)).toBeVisible();
    
    // Load a different spreadsheet
    await page.getByRole('button', { name: /open/i }).click();
    await page.getByText('Existing Spreadsheet').click();
    
    // Check that content is loaded
    await expect(page.getByTestId('cell-A1')).toContainText('Existing Content');
  });

  test('should export spreadsheet', async ({ page }) => {
    // Create some content
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('Export Test');
    await page.keyboard.press('Enter');
    
    // Export as Excel
    await page.getByRole('button', { name: /export/i }).click();
    await page.getByText('Export as Excel').click();
    
    // Check for download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.xlsx');
  });

  test('should collaborate in real-time', async ({ page, context }) => {
    // Open a second browser context to simulate another user
    const secondPage = await context.newPage();
    await secondPage.goto('/spreadsheet');
    
    // Both users should see the same spreadsheet
    await expect(page.getByTestId('spreadsheet-grid')).toBeVisible();
    await expect(secondPage.getByTestId('spreadsheet-grid')).toBeVisible();
    
    // User 1 makes a change
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('User 1 Content');
    await page.keyboard.press('Enter');
    
    // User 2 should see the change
    await expect(secondPage.getByTestId('cell-A1')).toContainText('User 1 Content');
    
    // User 2 makes a change
    await secondPage.getByTestId('cell-B1').click();
    await secondPage.keyboard.type('User 2 Content');
    await secondPage.keyboard.press('Enter');
    
    // User 1 should see the change
    await expect(page.getByTestId('cell-B1')).toContainText('User 2 Content');
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Test Ctrl+C (Copy)
    await page.getByTestId('cell-A1').click();
    await page.keyboard.type('Copy Test');
    await page.keyboard.press('Control+C');
    
    // Test Ctrl+V (Paste)
    await page.getByTestId('cell-B1').click();
    await page.keyboard.press('Control+V');
    
    // Check that content is pasted
    await expect(page.getByTestId('cell-B1')).toContainText('Copy Test');
    
    // Test Ctrl+Z (Undo)
    await page.keyboard.press('Control+Z');
    await expect(page.getByTestId('cell-B1')).not.toContainText('Copy Test');
    
    // Test Ctrl+Y (Redo)
    await page.keyboard.press('Control+Y');
    await expect(page.getByTestId('cell-B1')).toContainText('Copy Test');
  });
});