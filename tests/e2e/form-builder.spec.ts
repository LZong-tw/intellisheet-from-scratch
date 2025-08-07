import { test, expect } from '@playwright/test';

test.describe('Form Builder', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the form builder
    await page.goto('/form-builder');
    await page.waitForLoadState('networkidle');
  });

  test('should create a new form', async ({ page }) => {
    // Fill in form details
    await page.getByLabel(/form title/i).fill('Test Form');
    await page.getByLabel(/form description/i).fill('This is a test form');
    
    // Add a text field
    await page.getByRole('button', { name: /add field/i }).click();
    await page.getByLabel(/field label/i).fill('Name');
    await page.getByLabel(/field type/i).selectOption('text');
    await page.getByLabel(/placeholder/i).fill('Enter your name');
    await page.getByLabel(/required/i).check();
    
    // Add an email field
    await page.getByRole('button', { name: /add field/i }).click();
    await page.getByLabel(/field label/i).nth(1).fill('Email');
    await page.getByLabel(/field type/i).nth(1).selectOption('email');
    await page.getByLabel(/placeholder/i).nth(1).fill('Enter your email');
    await page.getByLabel(/required/i).nth(1).check();
    
    // Save the form
    await page.getByRole('button', { name: /save form/i }).click();
    
    // Check for success message
    await expect(page.getByText(/form saved successfully/i)).toBeVisible();
  });

  test('should edit existing form', async ({ page }) => {
    // Select an existing form
    await page.getByRole('button', { name: /load form/i }).click();
    await page.getByText('Existing Form').click();
    
    // Edit form title
    await page.getByLabel(/form title/i).clear();
    await page.getByLabel(/form title/i).fill('Updated Form Title');
    
    // Add a new field
    await page.getByRole('button', { name: /add field/i }).click();
    await page.getByLabel(/field label/i).fill('Phone Number');
    await page.getByLabel(/field type/i).selectOption('tel');
    
    // Save changes
    await page.getByRole('button', { name: /save form/i }).click();
    
    // Check for success message
    await expect(page.getByText(/form updated successfully/i)).toBeVisible();
  });

  test('should delete form fields', async ({ page }) => {
    // Load a form with existing fields
    await page.getByRole('button', { name: /load form/i }).click();
    await page.getByText('Form with Fields').click();
    
    // Delete the first field
    await page.getByRole('button', { name: /delete field/i }).first().click();
    
    // Confirm deletion
    await page.getByRole('button', { name: /confirm/i }).click();
    
    // Check that field is removed
    await expect(page.getByText('Name')).not.toBeVisible();
  });

  test('should reorder form fields', async ({ page }) => {
    // Load a form with multiple fields
    await page.getByRole('button', { name: /load form/i }).click();
    await page.getByText('Form with Multiple Fields').click();
    
    // Drag and drop to reorder
    const firstField = page.getByText('Name').first();
    const secondField = page.getByText('Email').first();
    
    await firstField.dragTo(secondField);
    
    // Check that order has changed
    const fields = page.locator('.field-item');
    await expect(fields.nth(0)).toContainText('Email');
    await expect(fields.nth(1)).toContainText('Name');
  });

  test('should preview form', async ({ page }) => {
    // Create a simple form
    await page.getByLabel(/form title/i).fill('Preview Test Form');
    await page.getByRole('button', { name: /add field/i }).click();
    await page.getByLabel(/field label/i).fill('Test Field');
    
    // Click preview button
    await page.getByRole('button', { name: /preview/i }).click();
    
    // Check if preview mode is active
    await expect(page.getByText(/form preview/i)).toBeVisible();
    await expect(page.getByText('Preview Test Form')).toBeVisible();
    await expect(page.getByLabel('Test Field')).toBeVisible();
    
    // Exit preview mode
    await page.getByRole('button', { name: /exit preview/i }).click();
    await expect(page.getByText(/form builder/i)).toBeVisible();
  });

  test('should configure form settings', async ({ page }) => {
    // Open settings panel
    await page.getByRole('button', { name: /settings/i }).click();
    
    // Configure form settings
    await page.getByLabel(/allow multiple submissions/i).check();
    await page.getByLabel(/require authentication/i).check();
    await page.getByLabel(/send email notifications/i).check();
    
    // Save settings
    await page.getByRole('button', { name: /save settings/i }).click();
    
    // Check for success message
    await expect(page.getByText(/settings saved/i)).toBeVisible();
  });

  test('should validate form fields', async ({ page }) => {
    // Try to save form without title
    await page.getByRole('button', { name: /save form/i }).click();
    
    // Check for validation error
    await expect(page.getByText(/form title is required/i)).toBeVisible();
    
    // Add title and try again
    await page.getByLabel(/form title/i).fill('Valid Form');
    await page.getByRole('button', { name: /save form/i }).click();
    
    // Should save successfully
    await expect(page.getByText(/form saved successfully/i)).toBeVisible();
  });

  test('should handle different field types', async ({ page }) => {
    // Add text field
    await page.getByRole('button', { name: /add field/i }).click();
    await page.getByLabel(/field label/i).fill('Text Field');
    await page.getByLabel(/field type/i).selectOption('text');
    
    // Add number field
    await page.getByRole('button', { name: /add field/i }).click();
    await page.getByLabel(/field label/i).nth(1).fill('Number Field');
    await page.getByLabel(/field type/i).nth(1).selectOption('number');
    
    // Add select field
    await page.getByRole('button', { name: /add field/i }).click();
    await page.getByLabel(/field label/i).nth(2).fill('Select Field');
    await page.getByLabel(/field type/i).nth(2).selectOption('select');
    
    // Add options for select field
    await page.getByLabel(/options/i).fill('Option 1, Option 2, Option 3');
    
    // Add checkbox field
    await page.getByRole('button', { name: /add field/i }).click();
    await page.getByLabel(/field label/i).nth(3).fill('Checkbox Field');
    await page.getByLabel(/field type/i).nth(3).selectOption('checkbox');
    
    // Check that all field types are properly configured
    await expect(page.getByText('Text Field')).toBeVisible();
    await expect(page.getByText('Number Field')).toBeVisible();
    await expect(page.getByText('Select Field')).toBeVisible();
    await expect(page.getByText('Checkbox Field')).toBeVisible();
  });

  test('should export form', async ({ page }) => {
    // Create a form
    await page.getByLabel(/form title/i).fill('Export Test Form');
    await page.getByRole('button', { name: /add field/i }).click();
    await page.getByLabel(/field label/i).fill('Export Field');
    
    // Export as JSON
    await page.getByRole('button', { name: /export/i }).click();
    await page.getByText('Export as JSON').click();
    
    // Check for download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.json');
  });

  test('should import form', async ({ page }) => {
    // Click import button
    await page.getByRole('button', { name: /import/i }).click();
    
    // Upload a form file
    await page.setInputFiles('input[type="file"]', {
      name: 'test-form.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({
        title: 'Imported Form',
        fields: []
      }))
    });
    
    // Confirm import
    await page.getByRole('button', { name: /import form/i }).click();
    
    // Check that form is loaded
    await expect(page.getByLabel(/form title/i)).toHaveValue('Imported Form');
  });
});