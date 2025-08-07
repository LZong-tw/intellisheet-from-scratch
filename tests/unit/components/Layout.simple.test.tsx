import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import Layout from '../../../src/components/Layout'

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  LayoutDashboard: () => <div data-testid="dashboard-icon" />,
  TableProperties: () => <div data-testid="table-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  GitBranch: () => <div data-testid="branch-icon" />,
  BarChart3: () => <div data-testid="chart-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  FileSpreadsheet: () => <div data-testid="spreadsheet-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="close-icon" />,
}))

describe('Layout Component - Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<Layout />)
    expect(screen.getByText('IntelliSheet')).toBeInTheDocument()
  })

  it('should render the brand name', () => {
    render(<Layout />)
    expect(screen.getByText('IntelliSheet')).toBeInTheDocument()
  })

  it('should render navigation icons', () => {
    render(<Layout />)
    
    expect(screen.getByTestId('spreadsheet-icon')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument()
    expect(screen.getByTestId('table-icon')).toBeInTheDocument()
  })

  it('should render navigation items', () => {
    render(<Layout />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Spreadsheets')).toBeInTheDocument()
    expect(screen.getByText('Permissions')).toBeInTheDocument()
  })
})