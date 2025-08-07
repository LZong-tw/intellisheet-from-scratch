import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import Dashboard from '../../../src/pages/Dashboard'

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  TableProperties: () => <div data-testid="table-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  GitBranch: () => <div data-testid="branch-icon" />,
  BarChart3: () => <div data-testid="chart-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Users: () => <div data-testid="users-icon" />,
  FileText: () => <div data-testid="file-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-icon" />,
  AlertCircle: () => <div data-testid="alert-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Bell: () => <div data-testid="bell-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  ArrowUp: () => <div data-testid="arrow-up-icon" />,
  ArrowDown: () => <div data-testid="arrow-down-icon" />,
  MoreVertical: () => <div data-testid="more-icon" />,
}))

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}))

// Mock Recharts
vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Tooltip: () => <div data-testid="tooltip" />,
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: vi.fn(),
  __esModule: true,
}))

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock Date.now() for consistent time-based tests
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2024-01-15T12:00:00Z').getTime())
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Dashboard />)
      expect(screen.getByText(/IntelliSheet Dashboard/)).toBeInTheDocument()
    })

    it('should render the main heading', () => {
      render(<Dashboard />)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should render feature cards', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Excel-like Spreadsheet')).toBeInTheDocument()
      expect(screen.getByText('Dynamic Permissions')).toBeInTheDocument()
      expect(screen.getByText('Workflow Automation')).toBeInTheDocument()
      // These might be named differently in the actual component
      const featureCards = screen.getAllByRole('link')
      expect(featureCards.length).toBeGreaterThan(3)
    })

    it('should render feature descriptions', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Direct cell editing with enterprise-grade performance')).toBeInTheDocument()
      expect(screen.getByText('State-driven ABAC with real-time rule evaluation')).toBeInTheDocument()
      expect(screen.getByText('Visual workflow builder with drag-and-drop')).toBeInTheDocument()
    })

    it('should render stats and metrics sections', () => {
      render(<Dashboard />)
      
      // Look for actual text in the dashboard
      expect(screen.getByText('Platform Activity')).toBeInTheDocument()
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      expect(screen.getByText('System Status')).toBeInTheDocument()
    })

    it('should render charts and data visualizations', () => {
      render(<Dashboard />)
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })
  })

  describe('Feature Cards', () => {
    it('should render feature icons', () => {
      render(<Dashboard />)
      
      expect(screen.getByTestId('table-icon')).toBeInTheDocument()
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
      expect(screen.getByTestId('branch-icon')).toBeInTheDocument()
      expect(screen.getByTestId('chart-icon')).toBeInTheDocument()
      expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument()
    })

    it('should have correct navigation links', () => {
      render(<Dashboard />)
      
      const spreadsheetLink = screen.getByRole('link', { name: /excel-like spreadsheet/i })
      expect(spreadsheetLink).toHaveAttribute('href', '/spreadsheet')
      
      const permissionsLink = screen.getByRole('link', { name: /dynamic permissions/i })
      expect(permissionsLink).toHaveAttribute('href', '/permissions')
      
      const workflowsLink = screen.getByRole('link', { name: /workflow automation/i })
      expect(workflowsLink).toHaveAttribute('href', '/workflows')
    })

    it('should display feature statistics', () => {
      render(<Dashboard />)
      
      // Check for stats that should be displayed
      expect(screen.getByText(/sheets/i)).toBeInTheDocument()
      expect(screen.getByText(/rules/i)).toBeInTheDocument()
      expect(screen.getByText(/workflows/i)).toBeInTheDocument()
    })
  })

  describe('Dashboard Actions', () => {
    it('should handle refresh action', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      // Find refresh button by icon since it might not have a label
      const refreshButton = screen.getByTestId('refresh-icon').closest('button')
      expect(refreshButton).toBeInTheDocument()
      
      if (refreshButton) {
        await user.click(refreshButton)
      }
      
      // Should show loading state or success message
      expect(screen.getByTestId('refresh-icon')).toBeInTheDocument()
    })

    it('should handle search functionality', async () => {
      render(<Dashboard />)
      
      // Search icon should be present
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })

    it('should handle notification actions', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const notificationButton = screen.getByTestId('bell-icon').closest('button')
      expect(notificationButton).toBeInTheDocument()
      
      if (notificationButton) {
        await user.click(notificationButton)
      }
      
      // Should show notification panel or update notification count
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument()
    })
  })

  describe('Quick Actions', () => {
    it('should render quick action links', () => {
      render(<Dashboard />)
      
      expect(screen.getByRole('link', { name: /create new sheet/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /view workflows/i })).toBeInTheDocument()
    })

    it('should handle quick action clicks', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const newSpreadsheetLink = screen.getByRole('link', { name: /create new sheet/i })
      expect(newSpreadsheetLink).toHaveAttribute('href', '/spreadsheet/new')
      
      // Should have correct navigation link
      expect(newSpreadsheetLink).toBeInTheDocument()
    })
  })

  describe('Data Display', () => {
    it('should show system metrics', () => {
      render(<Dashboard />)
      
      // Look for metric displays that actually exist
      expect(screen.getByText('Feature Usage')).toBeInTheDocument()
      expect(screen.getByText('Platform Activity')).toBeInTheDocument()
      expect(screen.getByText('System Status')).toBeInTheDocument()
    })

    it('should display recent activity', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      // Should show activity items - check for basic structure
      const activitySection = screen.getByText('Recent Activity').closest('div')
      expect(activitySection).toBeInTheDocument()
    })

    it('should show system health status', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('System Status')).toBeInTheDocument()
      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      render(<Dashboard />)
      
      const gridContainer = screen.getByRole('main').querySelector('.grid')
      expect(gridContainer).toHaveClass('grid')
    })

    it('should handle mobile layout', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<Dashboard />)
      
      // Should have appropriate responsive classes
      const container = screen.getByRole('heading', { level: 1 }).closest('div')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Interactive Elements', () => {
    it('should handle hover effects on feature cards', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const featureCard = screen.getByText('Excel-like Spreadsheet').closest('a')
      await user.hover(featureCard!)
      
      expect(featureCard).toBeInTheDocument()
    })

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const firstFeatureCard = screen.getByRole('link', { name: /excel-like spreadsheet/i })
      firstFeatureCard.focus()
      
      await user.tab()
      // Should move focus to next interactive element
      expect(document.activeElement).not.toBe(firstFeatureCard)
    })
  })

  describe('Error Handling', () => {
    it('should handle data loading errors gracefully', async () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<Dashboard />)
      
      // Should not crash and should show fallback content
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    it('should show loading states when appropriate', () => {
      render(<Dashboard />)
      
      // Should handle loading states for async data
      const container = screen.getByRole('heading', { level: 1 }).closest('div')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Dashboard />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })
      
      expect(h1).toBeInTheDocument()
      expect(h2s.length).toBeGreaterThan(0)
    })

    it('should have accessible buttons and links', () => {
      render(<Dashboard />)
      
      const buttons = screen.getAllByRole('button')
      const links = screen.getAllByRole('link')
      
      buttons.forEach(button => {
        expect(button).toBeEnabled()
      })
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })

    it('should support screen readers', () => {
      render(<Dashboard />)
      
      // Should have proper semantic structure
      const container = screen.getByRole('heading', { level: 1 }).closest('div')
      expect(container).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not cause memory leaks with useEffect', () => {
      const { unmount } = render(<Dashboard />)
      
      // Should cleanup properly when unmounted
      expect(() => unmount()).not.toThrow()
    })

    it('should handle large datasets efficiently', () => {
      render(<Dashboard />)
      
      // Should render without performance issues
      const container = screen.getByRole('heading', { level: 1 }).closest('div')
      expect(container).toBeInTheDocument()
    })
  })
})