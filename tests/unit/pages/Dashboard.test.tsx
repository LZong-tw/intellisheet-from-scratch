import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import { useDashboardStore } from '@/stores/useDashboardStore';

// Mock dependencies
vi.mock('@/stores/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
  })),
}));

vi.mock('@/stores/useDashboardStore', () => ({
  useDashboardStore: vi.fn(() => ({
    stats: {
      totalForms: 10,
      totalSubmissions: 150,
      activeUsers: 25,
      conversionRate: 0.75,
    },
    recentActivity: [
      {
        id: '1',
        type: 'form_created',
        message: 'New form created',
        timestamp: new Date().toISOString(),
      },
    ],
    isLoading: false,
    fetchStats: vi.fn(),
    fetchRecentActivity: vi.fn(),
  })),
}));

vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard page', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it('displays user information', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('displays statistics cards', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/total forms/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    expect(screen.getByText(/total submissions/i)).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    
    expect(screen.getByText(/active users/i)).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    
    expect(screen.getByText(/conversion rate/i)).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays recent activity', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
    expect(screen.getByText(/new form created/i)).toBeInTheDocument();
  });

  it('displays charts and analytics', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/submissions over time/i)).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('displays quick actions', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/quick actions/i)).toBeInTheDocument();
    expect(screen.getByText(/create new form/i)).toBeInTheDocument();
    expect(screen.getByText(/view analytics/i)).toBeInTheDocument();
  });

  it('handles loading state', async () => {
    vi.mocked(useDashboardStore).mockReturnValue({
      stats: null,
      recentActivity: [],
      isLoading: true,
      fetchStats: vi.fn(),
      fetchRecentActivity: vi.fn(),
    });

    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    vi.mocked(useDashboardStore).mockReturnValue({
      stats: null,
      recentActivity: [],
      isLoading: false,
      error: 'Failed to load dashboard data',
      fetchStats: vi.fn(),
      fetchRecentActivity: vi.fn(),
    });

    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/failed to load dashboard data/i)).toBeInTheDocument();
  });

  it('calls fetch functions on mount', async () => {
    const mockFetchStats = vi.fn();
    const mockFetchRecentActivity = vi.fn();

    vi.mocked(useDashboardStore).mockReturnValue({
      stats: {
        totalForms: 10,
        totalSubmissions: 150,
        activeUsers: 25,
        conversionRate: 0.75,
      },
      recentActivity: [],
      isLoading: false,
      fetchStats: mockFetchStats,
      fetchRecentActivity: mockFetchRecentActivity,
    });

    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(mockFetchStats).toHaveBeenCalled();
      expect(mockFetchRecentActivity).toHaveBeenCalled();
    });
  });

  it('displays empty state when no data', () => {
    vi.mocked(useDashboardStore).mockReturnValue({
      stats: {
        totalForms: 0,
        totalSubmissions: 0,
        activeUsers: 0,
        conversionRate: 0,
      },
      recentActivity: [],
      isLoading: false,
      fetchStats: vi.fn(),
      fetchRecentActivity: vi.fn(),
    });

    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });
});