# 測試樣板

本文檔提供了各種測試模式的模板，方便快速創建新的測試。

## 目錄

- [組件測試樣板](#組件測試樣板)
- [頁面測試樣板](#頁面測試樣板)
- [Hook 測試樣板](#hook-測試樣板)
- [Store 測試樣板](#store-測試樣板)
- [E2E 測試樣板](#e2e-測試樣板)
- [工具函數測試樣板](#工具函數測試樣板)

## 組件測試樣板

### 基礎組件測試

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Component from '@/components/Component';

// Mock dependencies
vi.mock('@/stores/useStore', () => ({
  useStore: vi.fn(() => ({
    data: [],
    isLoading: false,
    fetchData: vi.fn(),
  })),
}));

describe('Component', () => {
  it('renders without crashing', () => {
    render(<Component />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    vi.mocked(useStore).mockReturnValue({
      data: [],
      isLoading: true,
      fetchData: vi.fn(),
    });

    render(<Component />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays data when loaded', () => {
    const mockData = [{ id: 1, name: 'Test Item' }];
    vi.mocked(useStore).mockReturnValue({
      data: mockData,
      isLoading: false,
      fetchData: vi.fn(),
    });

    render(<Component />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const mockFetchData = vi.fn();
    
    vi.mocked(useStore).mockReturnValue({
      data: [],
      isLoading: false,
      fetchData: mockFetchData,
    });

    render(<Component />);
    
    await user.click(screen.getByRole('button', { name: /refresh/i }));
    expect(mockFetchData).toHaveBeenCalled();
  });

  it('handles errors gracefully', () => {
    vi.mocked(useStore).mockReturnValue({
      data: [],
      isLoading: false,
      error: 'Failed to load data',
      fetchData: vi.fn(),
    });

    render(<Component />);
    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
  });
});
```

### 表單組件測試

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormComponent from '@/components/FormComponent';

describe('FormComponent', () => {
  it('renders form fields', () => {
    render(<FormComponent />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<FormComponent />);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    
    render(<FormComponent onSubmit={mockSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });

  it('shows success message after submission', async () => {
    const user = userEvent.setup();
    render(<FormComponent />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
    });
  });
});
```

### 列表組件測試

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListComponent from '@/components/ListComponent';

describe('ListComponent', () => {
  const mockItems = [
    { id: 1, name: 'Item 1', description: 'Description 1' },
    { id: 2, name: 'Item 2', description: 'Description 2' },
    { id: 3, name: 'Item 3', description: 'Description 3' },
  ];

  it('renders list items', () => {
    render(<ListComponent items={mockItems} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('handles empty list', () => {
    render(<ListComponent items={[]} />);
    
    expect(screen.getByText(/no items found/i)).toBeInTheDocument();
  });

  it('handles item selection', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    
    render(<ListComponent items={mockItems} onSelect={mockOnSelect} />);
    
    await user.click(screen.getByText('Item 1'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  it('handles item deletion', async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();
    
    render(<ListComponent items={mockItems} onDelete={mockOnDelete} />);
    
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockItems[0].id);
  });

  it('filters items based on search', async () => {
    const user = userEvent.setup();
    render(<ListComponent items={mockItems} />);
    
    await user.type(screen.getByPlaceholderText(/search/i), 'Item 1');
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });
});
```

## 頁面測試樣板

### 基礎頁面測試

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PageComponent from '@/pages/PageComponent';

// Mock stores
vi.mock('@/stores/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
  })),
}));

vi.mock('@/stores/usePageStore', () => ({
  usePageStore: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
    fetchData: vi.fn(),
  })),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PageComponent', () => {
  it('renders page title', () => {
    renderWithRouter(<PageComponent />);
    expect(screen.getByRole('heading', { name: /page title/i })).toBeInTheDocument();
  });

  it('displays loading state', () => {
    vi.mocked(usePageStore).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      fetchData: vi.fn(),
    });

    renderWithRouter(<PageComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays data when loaded', () => {
    const mockData = [{ id: 1, title: 'Test Item' }];
    vi.mocked(usePageStore).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      fetchData: vi.fn(),
    });

    renderWithRouter(<PageComponent />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('handles errors', () => {
    vi.mocked(usePageStore).mockReturnValue({
      data: [],
      isLoading: false,
      error: 'Failed to load data',
      fetchData: vi.fn(),
    });

    renderWithRouter(<PageComponent />);
    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
  });

  it('fetches data on mount', async () => {
    const mockFetchData = vi.fn();
    vi.mocked(usePageStore).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      fetchData: mockFetchData,
    });

    renderWithRouter(<PageComponent />);
    
    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalled();
    });
  });
});
```

## Hook 測試樣板

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from '@/hooks/useCustomHook';

describe('useCustomHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useCustomHook());
    
    expect(result.current.value).toBe(initialValue);
    expect(result.current.isLoading).toBe(false);
  });

  it('updates state when action is called', async () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.updateValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });

  it('handles async operations', async () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.fetchData();
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });

  it('handles errors', async () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.fetchDataWithError();
    });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(result.current.error).toBe('An error occurred');
  });
});
```

## Store 測試樣板

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStore } from '@/stores/useStore';

describe('Store', () => {
  it('has initial state', () => {
    const { result } = renderHook(() => useStore());
    
    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('adds item to store', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.addItem({ id: 1, name: 'Test Item' });
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({ id: 1, name: 'Test Item' });
  });

  it('removes item from store', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.addItem({ id: 1, name: 'Test Item' });
      result.current.removeItem(1);
    });
    
    expect(result.current.items).toHaveLength(0);
  });

  it('updates item in store', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.addItem({ id: 1, name: 'Test Item' });
      result.current.updateItem(1, { id: 1, name: 'Updated Item' });
    });
    
    expect(result.current.items[0].name).toBe('Updated Item');
  });

  it('sets loading state', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.setLoading(true);
    });
    
    expect(result.current.isLoading).toBe(true);
  });

  it('sets error state', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.setError('An error occurred');
    });
    
    expect(result.current.error).toBe('An error occurred');
  });

  it('clears error', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.setError('An error occurred');
      result.current.clearError();
    });
    
    expect(result.current.error).toBe(null);
  });
});
```

## E2E 測試樣板

### 基礎 E2E 測試

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/page-url');
    await page.waitForLoadState('networkidle');
  });

  test('should perform basic action', async ({ page }) => {
    // Navigate to page
    await page.goto('/feature-page');
    
    // Check if page loads correctly
    await expect(page.getByRole('heading', { name: /feature title/i })).toBeVisible();
    
    // Perform action
    await page.getByRole('button', { name: /action button/i }).click();
    
    // Verify result
    await expect(page.getByText(/action completed/i)).toBeVisible();
  });

  test('should handle form submission', async ({ page }) => {
    // Fill form
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    
    // Submit form
    await page.getByRole('button', { name: /submit/i }).click();
    
    // Verify success
    await expect(page.getByText(/form submitted successfully/i)).toBeVisible();
  });

  test('should handle validation errors', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /submit/i }).click();
    
    // Check for validation errors
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByTestId('desktop-menu')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByTestId('mobile-menu')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Navigate with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Verify navigation worked
    await expect(page.getByText(/expected result/i)).toBeVisible();
  });
});
```

### 用戶流程測試

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Journey', () => {
  test('complete user registration flow', async ({ page }) => {
    // 1. Visit registration page
    await page.goto('/register');
    
    // 2. Fill registration form
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    
    // 3. Submit form
    await page.getByRole('button', { name: /register/i }).click();
    
    // 4. Verify email verification
    await expect(page.getByText(/check your email/i)).toBeVisible();
    
    // 5. Simulate email verification
    await page.goto('/verify?token=mock-token');
    
    // 6. Verify account is activated
    await expect(page.getByText(/account activated/i)).toBeVisible();
    
    // 7. Login with new account
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    
    // 8. Verify successful login
    await expect(page.getByText(/welcome testuser/i)).toBeVisible();
  });
});
```

## 工具函數測試樣板

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, validateEmail, calculateTotal } from '@/utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-01-15');
      expect(formatDate(date)).toBe('2023-01-15');
    });

    it('handles invalid date', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('calculateTotal', () => {
    it('calculates total correctly', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 1 },
      ];
      expect(calculateTotal(items)).toBe(25);
    });

    it('handles empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('handles zero quantities', () => {
      const items = [
        { price: 10, quantity: 0 },
        { price: 5, quantity: 1 },
      ];
      expect(calculateTotal(items)).toBe(5);
    });
  });
});
```

## 測試工具函數

### 測試工具函數

```typescript
// tests/utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { withRouter = false, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (withRouter) {
      return <BrowserRouter>{children}</BrowserRouter>;
    }
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
```

### Mock 數據

```typescript
// tests/utils/mocks/data.ts
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
};

export const mockForm = {
  id: '1',
  title: 'Test Form',
  description: 'Test Description',
  fields: [
    {
      id: 'field1',
      type: 'text',
      label: 'Name',
      required: true,
    },
  ],
};

export const mockSpreadsheet = {
  id: '1',
  name: 'Test Spreadsheet',
  data: [
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2'],
  ],
};
```

---

使用這些樣板可以快速創建高質量的測試，確保代碼的可靠性和可維護性。