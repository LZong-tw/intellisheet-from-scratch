import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi, beforeEach } from 'vitest'

// Custom render function that includes Router wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Common mock functions
export const mockNavigate = vi.fn()

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1', formId: 'test-form' }),
    useLocation: () => ({ pathname: '/dashboard', search: '', hash: '', state: null }),
  }
})

// Mock zustand stores
export const mockSpreadsheetStore = {
  spreadsheets: [],
  currentSpreadsheet: null,
  loading: false,
  error: null,
  createSpreadsheet: vi.fn(),
  loadSpreadsheet: vi.fn(),
  updateSpreadsheet: vi.fn(),
  deleteSpreadsheet: vi.fn(),
  addRow: vi.fn(),
  updateCell: vi.fn(),
  deleteRow: vi.fn(),
}

export const mockPermissionStore = {
  permissions: [],
  roles: [],
  loading: false,
  error: null,
  loadPermissions: vi.fn(),
  updatePermission: vi.fn(),
  createRole: vi.fn(),
  deleteRole: vi.fn(),
}

export const mockWorkflowStore = {
  workflows: [],
  activeWorkflow: null,
  loading: false,
  error: null,
  createWorkflow: vi.fn(),
  updateWorkflow: vi.fn(),
  deleteWorkflow: vi.fn(),
  executeWorkflow: vi.fn(),
}

// Mock API responses
export const mockApiResponses = {
  spreadsheets: [
    {
      id: '1',
      name: 'Test Spreadsheet',
      description: 'A test spreadsheet',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {
        headers: ['Name', 'Email', 'Role'],
        rows: [
          { id: '1', cells: { Name: 'John Doe', Email: 'john@example.com', Role: 'Admin' } },
          { id: '2', cells: { Name: 'Jane Smith', Email: 'jane@example.com', Role: 'User' } },
        ]
      }
    }
  ],
  permissions: [
    {
      id: '1',
      resourceId: '1',
      userId: 'user1',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    }
  ],
  workflows: [
    {
      id: '1',
      name: 'Test Workflow',
      description: 'A test workflow',
      triggers: [],
      actions: [],
      isActive: true
    }
  ]
}

// Helper functions for testing
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 100))

export const createMockEvent = (overrides = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: { value: '' },
  ...overrides
})

export const createMockFile = (name = 'test.csv', content = 'header1,header2\nvalue1,value2') => 
  new File([content], name, { type: 'text/csv' })

// Mock localStorage
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

// Setup localStorage mock
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  })
})