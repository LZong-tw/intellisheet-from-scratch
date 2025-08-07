import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';

// Mock the stores
vi.mock('@/stores/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
    logout: vi.fn(),
  })),
}));

vi.mock('@/stores/useThemeStore', () => ({
  useThemeStore: vi.fn(() => ({
    theme: 'light',
    toggleTheme: vi.fn(),
  })),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Layout />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders navigation menu items', () => {
    renderWithRouter(<Layout />);
    
    // Check for main navigation items
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/spreadsheets/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();
  });

  it('renders navigation menu items', () => {
    renderWithRouter(<Layout />);
    
    // Check for main navigation items
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/spreadsheets/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();
  });

  it('renders main content area', () => {
    renderWithRouter(<Layout />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders header with title', () => {
    renderWithRouter(<Layout />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText(/next-generation spreadsheet platform/i)).toBeInTheDocument();
  });

  it('renders sidebar toggle button', () => {
    renderWithRouter(<Layout />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});