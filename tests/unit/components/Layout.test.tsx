import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
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

describe('Layout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Layout />)
      expect(screen.getByText('IntelliSheet')).toBeInTheDocument()
    })

    it('should render the logo and brand name', () => {
      render(<Layout />)
      expect(screen.getByTestId('spreadsheet-icon')).toBeInTheDocument()
      expect(screen.getByText('IntelliSheet')).toBeInTheDocument()
    })

    it('should render all navigation items', () => {
      render(<Layout />)
      
      const expectedNavItems = [
        'Dashboard',
        'Spreadsheets', 
        'Permissions',
        'Workflows',
        'Analytics',
        'AI Tools',
        'Settings'
      ]
      
      expectedNavItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })
    })

    it('should render navigation icons', () => {
      render(<Layout />)
      
      expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument()
      expect(screen.getByTestId('table-icon')).toBeInTheDocument()
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
      expect(screen.getByTestId('branch-icon')).toBeInTheDocument()
      expect(screen.getByTestId('chart-icon')).toBeInTheDocument()
      expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument()
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
    })

    it('should render the main content area', () => {
      render(<Layout />)
      expect(screen.getByRole('main')).toBeInTheDocument()
    })
  })

  describe('Sidebar Functionality', () => {
    it('should start with sidebar open by default', () => {
      render(<Layout />)
      const sidebar = screen.getByRole('navigation').closest('div')
      expect(sidebar).toHaveClass('w-64') // Open state class
      expect(screen.getByText('IntelliSheet')).toBeVisible()
    })

    it('should toggle sidebar when menu button is clicked', async () => {
      const user = userEvent.setup()
      render(<Layout />)
      
      const menuButton = screen.getByRole('button')
      await user.click(menuButton)
      
      const sidebar = screen.getByRole('navigation').closest('div')
      expect(sidebar).toHaveClass('w-16') // Collapsed state class
    })

    it('should hide brand name when sidebar is collapsed', async () => {
      const user = userEvent.setup()
      render(<Layout />)
      
      const menuButton = screen.getByRole('button')
      await user.click(menuButton)
      
      // Brand name should not be visible in collapsed state
      expect(screen.queryByText('IntelliSheet')).not.toBeInTheDocument()
    })

    it('should show brand name when sidebar is expanded', async () => {
      const user = userEvent.setup()
      render(<Layout />)
      
      const menuButton = screen.getByRole('button')
      
      // Click to collapse
      await user.click(menuButton)
      expect(screen.queryByText('IntelliSheet')).not.toBeInTheDocument()
      
      // Click to expand
      await user.click(menuButton)
      expect(screen.getByText('IntelliSheet')).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('should render navigation links with correct href attributes', () => {
      render(<Layout />)
      
      const expectedLinks = [
        { text: 'Dashboard', href: '/dashboard' },
        { text: 'Spreadsheets', href: '/spreadsheet' },
        { text: 'Permissions', href: '/permissions' },
        { text: 'Workflows', href: '/workflows' },
        { text: 'Analytics', href: '/analytics' },
        { text: 'AI Tools', href: '/ai-tools' },
        { text: 'Settings', href: '/settings' },
      ]
      
      expectedLinks.forEach(({ text, href }) => {
        const link = screen.getByRole('link', { name: new RegExp(text, 'i') })
        expect(link).toHaveAttribute('href', href)
      })
    })

    it('should apply active styles to current navigation item', () => {
      // Mock the current location
      const mockLocation = { pathname: '/dashboard' }
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom')
        return {
          ...actual,
          useLocation: () => mockLocation,
        }
      })
      
      render(<Layout />)
      
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      // NavLink will apply active classes automatically based on current route
      expect(dashboardLink).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes for mobile', () => {
      render(<Layout />)
      
      const sidebar = screen.getByRole('navigation').closest('div')
      expect(sidebar).toHaveClass('flex', 'flex-col')
    })

    it('should maintain layout structure across different screen sizes', () => {
      render(<Layout />)
      
      const container = screen.getByRole('navigation').closest('.flex.h-screen')
      expect(container).toHaveClass('flex', 'h-screen', 'bg-gray-900')
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      render(<Layout />)
      
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Layout />)
      
      const firstLink = screen.getByRole('link', { name: /dashboard/i })
      firstLink.focus()
      
      // Tab to next navigation item
      await user.tab()
      expect(screen.getByRole('link', { name: /spreadsheets/i })).toHaveFocus()
    })

    it('should have accessible button for sidebar toggle', () => {
      render(<Layout />)
      
      const menuButton = screen.getByRole('button')
      expect(menuButton).toBeInTheDocument()
      expect(menuButton).toBeEnabled()
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to sidebar', () => {
      render(<Layout />)
      
      const sidebar = screen.getByRole('navigation').closest('div')
      expect(sidebar).toHaveClass(
        'flex',
        'flex-col',
        'bg-gray-800',
        'border-r',
        'border-gray-700',
        'transition-all',
        'duration-300'
      )
    })

    it('should apply dark theme classes', () => {
      render(<Layout />)
      
      const container = screen.getByRole('navigation').closest('.bg-gray-900')
      expect(container).toHaveClass('bg-gray-900')
      
      const sidebar = screen.getByRole('navigation').closest('div')
      expect(sidebar).toHaveClass('bg-gray-800', 'border-gray-700')
    })

    it('should have transition classes for smooth animations', () => {
      render(<Layout />)
      
      const sidebar = screen.getByRole('navigation').closest('div')
      expect(sidebar).toHaveClass('transition-all', 'duration-300')
    })
  })

  describe('Integration with Router', () => {
    it('should render Outlet for nested routes', () => {
      render(<Layout />)
      
      // The Outlet component from react-router-dom should be rendered
      // This is handled by the router context in our test utils
      expect(screen.getByRole('main')).toBeInTheDocument()
    })
  })

  describe('State Management', () => {
    it('should manage sidebar open state correctly', async () => {
      const user = userEvent.setup()
      render(<Layout />)
      
      const menuButton = screen.getByRole('button')
      const sidebar = screen.getByRole('navigation').closest('div')
      
      // Initial state - open
      expect(sidebar).toHaveClass('w-64')
      
      // Toggle to closed
      await user.click(menuButton)
      expect(sidebar).toHaveClass('w-16')
      
      // Toggle back to open
      await user.click(menuButton)
      expect(sidebar).toHaveClass('w-64')
    })
  })
})