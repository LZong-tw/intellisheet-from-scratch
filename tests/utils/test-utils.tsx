import { render, RenderOptions, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement, ReactNode } from 'react';
import userEvent from '@testing-library/user-event';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  initialEntries?: string[];
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { withRouter = false, initialEntries = ['/'], ...renderOptions } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => {
    if (withRouter) {
      return (
        <BrowserRouter>
          {children}
        </BrowserRouter>
      );
    }
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// 重新導出所有 testing-library 的函數
export * from '@testing-library/react';
export { customRender as render };

// 測試工具函數
export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  ...overrides,
});

export const createMockForm = (overrides = {}) => ({
  id: '1',
  title: 'Test Form',
  description: 'Test Description',
  fields: [
    {
      id: 'field1',
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'Enter your name',
    },
  ],
  settings: {
    allowMultipleSubmissions: true,
    requireAuthentication: false,
  },
  ...overrides,
});

export const createMockSpreadsheet = (overrides = {}) => ({
  id: '1',
  name: 'Test Spreadsheet',
  description: 'Test Description',
  data: [
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2'],
    ['A3', 'B3', 'C3'],
  ],
  ...overrides,
});

export const createMockSubmission = (overrides = {}) => ({
  id: '1',
  formId: '1',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
  },
  submittedAt: new Date().toISOString(),
  ...overrides,
});

// 等待函數
export const waitForElementToBeRemoved = async (element: Element) => {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
};

// 表單測試工具
export const fillForm = async (user: ReturnType<typeof userEvent.setup>, formData: Record<string, string>) => {
  for (const [field, value] of Object.entries(formData)) {
    const input = screen.getByLabelText(new RegExp(field, 'i'));
    await user.clear(input);
    await user.type(input, value);
  }
};

export const submitForm = async (user: ReturnType<typeof userEvent.setup>) => {
  const submitButton = screen.getByRole('button', { name: /submit|save|create/i });
  await user.click(submitButton);
};

// 驗證工具
export const expectFormValidationError = (errorMessage: string) => {
  expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
};

export const expectSuccessMessage = (message: string) => {
  expect(screen.getByText(new RegExp(message, 'i'))).toBeInTheDocument();
};

// 導航工具
export const navigateTo = async (user: ReturnType<typeof userEvent.setup>, linkText: string) => {
  const link = screen.getByRole('link', { name: new RegExp(linkText, 'i') });
  await user.click(link);
};

// 選擇器工具
export const getByTestId = (testId: string) => {
  return screen.getByTestId(testId);
};

export const queryByTestId = (testId: string) => {
  return screen.queryByTestId(testId);
};

// 斷言工具
export const expectElementToBeVisible = (element: Element | null) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectElementToNotBeVisible = (element: Element | null) => {
  expect(element).not.toBeInTheDocument();
};

// 異步工具
export const waitForLoadingToFinish = async () => {
  await screen.findByText(/loading/i, {}, { timeout: 1000 }).catch(() => {
    // 如果沒有找到 loading 文字，表示已經加載完成
  });
};

export const waitForElementToAppear = async (text: string, timeout = 5000) => {
  return screen.findByText(new RegExp(text, 'i'), {}, { timeout });
};

// 模擬 API 響應
export const mockApiResponse = (data: any, delay = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (error: string, delay = 100) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(error)), delay);
  });
};

// 測試數據生成器
export const generateTestData = (count: number, generator: (index: number) => any) => {
  return Array.from({ length: count }, (_, index) => generator(index));
};

// 清理工具
export const cleanupTestData = () => {
  // 清理測試數據的邏輯
  localStorage.clear();
  sessionStorage.clear();
};

// 測試環境設置
export const setupTestEnvironment = () => {
  // 設置測試環境
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// 導出常用類型
export type TestUser = ReturnType<typeof userEvent.setup>;
export type MockData = {
  user: ReturnType<typeof createMockUser>;
  form: ReturnType<typeof createMockForm>;
  spreadsheet: ReturnType<typeof createMockSpreadsheet>;
  submission: ReturnType<typeof createMockSubmission>;
};