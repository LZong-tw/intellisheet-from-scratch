import { Page, Locator, expect } from '@playwright/test'

export class IntelliSheetPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Navigation methods
  async goto() {
    await this.page.goto('/')
    await this.waitForPageLoad()
  }

  async navigateTo(path: string) {
    await this.page.goto(path)
    await this.waitForPageLoad()
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  // Common element getters
  get navigation() {
    return this.page.locator('[data-testid="navigation"]')
  }

  get mainContent() {
    return this.page.locator('[data-testid="main-content"]')
  }

  get loadingSpinner() {
    return this.page.locator('[data-testid="loading-spinner"]')
  }

  get errorMessage() {
    return this.page.locator('[data-testid="error-message"]')
  }

  get successMessage() {
    return this.page.locator('[data-testid="success-message"]')
  }

  // Wait for loading to complete
  async waitForLoading() {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 })
  }

  // Navigation helpers
  async clickNavLink(text: string) {
    await this.page.getByRole('link', { name: text }).click()
    await this.waitForPageLoad()
  }

  async clickButton(text: string) {
    await this.page.getByRole('button', { name: text }).click()
  }

  // Form helpers
  async fillForm(formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      await this.page.fill(`[name="${field}"]`, value)
    }
  }

  async submitForm() {
    await this.clickButton('Submit')
  }

  // Table helpers
  async getTableRows() {
    return this.page.locator('tbody tr')
  }

  async getTableCell(row: number, column: number) {
    return this.page.locator(`tbody tr:nth-child(${row}) td:nth-child(${column})`)
  }

  async clickTableRow(row: number) {
    await this.page.locator(`tbody tr:nth-child(${row})`).click()
  }

  // File upload helpers
  async uploadFile(selector: string, filePath: string) {
    await this.page.setInputFiles(selector, filePath)
  }

  // Modal helpers
  async waitForModal() {
    await this.page.locator('[data-testid="modal"]').waitFor()
  }

  async closeModal() {
    await this.page.keyboard.press('Escape')
    await this.page.locator('[data-testid="modal"]').waitFor({ state: 'hidden' })
  }

  // Screenshot helpers
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` })
  }

  // Assertion helpers
  async expectToBeVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible()
  }

  async expectTextContent(selector: string, text: string) {
    await expect(this.page.locator(selector)).toHaveText(text)
  }

  async expectURL(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path))
  }
}

export class SpreadsheetPage extends IntelliSheetPage {
  // Spreadsheet-specific methods
  get spreadsheetGrid() {
    return this.page.locator('[data-testid="spreadsheet-grid"]')
  }

  get addRowButton() {
    return this.page.getByRole('button', { name: 'Add Row' })
  }

  get deleteRowButton() {
    return this.page.getByRole('button', { name: 'Delete Row' })
  }

  async clickCell(row: number, column: number) {
    await this.page.locator(`[data-testid="cell-${row}-${column}"]`).click()
  }

  async editCell(row: number, column: number, value: string) {
    await this.clickCell(row, column)
    await this.page.keyboard.press('Enter')
    await this.page.fill('[data-testid="cell-editor"]', value)
    await this.page.keyboard.press('Enter')
  }

  async addRow() {
    await this.addRowButton.click()
  }

  async deleteRow(row: number) {
    await this.page.locator(`[data-testid="row-${row}"] [data-testid="row-menu"]`).click()
    await this.deleteRowButton.click()
  }

  async selectColumn(column: number) {
    await this.page.locator(`[data-testid="column-header-${column}"]`).click()
  }

  async sortColumn(column: number, direction: 'asc' | 'desc' = 'asc') {
    await this.selectColumn(column)
    await this.page.getByRole('button', { name: `Sort ${direction}ending` }).click()
  }

  async filterColumn(column: number, value: string) {
    await this.selectColumn(column)
    await this.page.getByRole('button', { name: 'Filter' }).click()
    await this.page.fill('[data-testid="filter-input"]', value)
    await this.page.getByRole('button', { name: 'Apply Filter' }).click()
  }

  async exportData(format: 'csv' | 'xlsx' | 'json') {
    await this.page.getByRole('button', { name: 'Export' }).click()
    await this.page.getByRole('button', { name: format.toUpperCase() }).click()
  }
}

export class FormBuilderPage extends IntelliSheetPage {
  // Form builder specific methods
  get formCanvas() {
    return this.page.locator('[data-testid="form-canvas"]')
  }

  get fieldPalette() {
    return this.page.locator('[data-testid="field-palette"]')
  }

  async dragFieldToCanvas(fieldType: string, position: { x: number; y: number }) {
    const field = this.fieldPalette.locator(`[data-testid="field-${fieldType}"]`)
    await field.dragTo(this.formCanvas, { targetPosition: position })
  }

  async configureField(fieldId: string, config: Record<string, any>) {
    await this.page.locator(`[data-testid="field-${fieldId}"]`).click()
    
    for (const [property, value] of Object.entries(config)) {
      await this.page.fill(`[data-testid="config-${property}"]`, String(value))
    }
  }

  async previewForm() {
    await this.page.getByRole('button', { name: 'Preview' }).click()
    await this.waitForModal()
  }

  async saveForm() {
    await this.page.getByRole('button', { name: 'Save Form' }).click()
  }

  async publishForm() {
    await this.page.getByRole('button', { name: 'Publish' }).click()
  }
}

// Test data generators
export const generateTestUser = (overrides: Partial<any> = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  ...overrides
})

export const generateTestSpreadsheet = (overrides: Partial<any> = {}) => ({
  name: 'Test Spreadsheet',
  description: 'A test spreadsheet',
  headers: ['Name', 'Email', 'Department'],
  rows: [
    { Name: 'John Doe', Email: 'john@example.com', Department: 'Engineering' },
    { Name: 'Jane Smith', Email: 'jane@example.com', Department: 'Marketing' }
  ],
  ...overrides
})

// Common test patterns
export const testPatterns = {
  async testCRUDOperations(page: IntelliSheetPage, entityName: string) {
    // Create
    await page.clickButton(`New ${entityName}`)
    await page.waitForModal()
    await page.fillForm({ name: `Test ${entityName}` })
    await page.submitForm()
    await page.expectToBeVisible(`[data-testid="${entityName.toLowerCase()}-item"]`)
    
    // Read
    await page.expectTextContent(`[data-testid="${entityName.toLowerCase()}-name"]`, `Test ${entityName}`)
    
    // Update
    await page.clickButton('Edit')
    await page.fillForm({ name: `Updated ${entityName}` })
    await page.submitForm()
    await page.expectTextContent(`[data-testid="${entityName.toLowerCase()}-name"]`, `Updated ${entityName}`)
    
    // Delete
    await page.clickButton('Delete')
    await page.clickButton('Confirm Delete')
    await expect(page.page.locator(`[data-testid="${entityName.toLowerCase()}-item"]`)).not.toBeVisible()
  },

  async testFormValidation(page: IntelliSheetPage, requiredFields: string[]) {
    await page.submitForm()
    
    for (const field of requiredFields) {
      await page.expectToBeVisible(`[data-testid="error-${field}"]`)
    }
  },

  async testResponsiveDesign(page: IntelliSheetPage) {
    // Desktop
    await page.page.setViewportSize({ width: 1920, height: 1080 })
    await page.expectToBeVisible('[data-testid="desktop-layout"]')
    
    // Tablet
    await page.page.setViewportSize({ width: 768, height: 1024 })
    await page.expectToBeVisible('[data-testid="tablet-layout"]')
    
    // Mobile
    await page.page.setViewportSize({ width: 375, height: 667 })
    await page.expectToBeVisible('[data-testid="mobile-layout"]')
  }
}