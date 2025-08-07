# 測試快速開始指南

本指南將幫助您快速開始使用 IntelliSheet 的測試架構。

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 運行測試

```bash
# 運行所有測試
npm test

# 運行單元測試
npm run test:unit

# 運行 E2E 測試
npm run test:e2e

# 運行測試並生成覆蓋率報告
npm run test:coverage
```

### 3. 查看測試報告

```bash
# 查看 E2E 測試報告
npm run test:report

# 查看單元測試 UI
npm run test:ui
```

## 創建新測試

### 單元測試

1. **創建組件測試**

```typescript
// tests/unit/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

2. **創建頁面測試**

```typescript
// tests/unit/pages/MyPage.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyPage from '@/pages/MyPage';

// Mock stores
vi.mock('@/stores/useStore', () => ({
  useStore: vi.fn(() => ({
    data: [],
    isLoading: false,
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

describe('MyPage', () => {
  it('renders page content', () => {
    renderWithRouter(<MyPage />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
```

### E2E 測試

```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-feature');
    await page.waitForLoadState('networkidle');
  });

  test('should perform action', async ({ page }) => {
    await page.getByRole('button').click();
    await expect(page.getByText('Result')).toBeVisible();
  });
});
```

## 測試最佳實踐

### 1. 使用測試工具函數

```typescript
import { render, screen, fillForm, submitForm } from '@/tests/utils/test-utils';

describe('Form Component', () => {
  it('submits form successfully', async () => {
    const user = userEvent.setup();
    render(<FormComponent />);
    
    await fillForm(user, {
      name: 'John Doe',
      email: 'john@example.com',
    });
    
    await submitForm(user);
    
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

### 2. 使用 Mock 數據

```typescript
import { mockForms, mockUsers } from '@/tests/utils/mocks';

describe('Component', () => {
  it('displays mock data', () => {
    render(<Component forms={mockForms} users={mockUsers} />);
    
    expect(screen.getByText('Contact Form')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });
});
```

### 3. 測試異步操作

```typescript
import { waitFor } from '@testing-library/react';

it('handles async operation', async () => {
  render(<Component />);
  
  await user.click(screen.getByRole('button'));
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

## 調試測試

### 1. 使用 screen.debug()

```typescript
it('debug test', () => {
  render(<Component />);
  screen.debug(); // 輸出當前 DOM
});
```

### 2. 使用 Playwright 調試模式

```bash
npx playwright test --debug
```

### 3. 使用 Vitest UI

```bash
npm run test:ui
```

## 常見問題

### 1. 測試找不到元素

- 使用更穩定的選擇器（`getByRole`, `getByLabel`）
- 檢查元素是否在 DOM 中
- 使用 `screen.debug()` 查看當前 DOM

### 2. 異步測試失敗

- 使用 `waitFor` 等待元素出現
- 檢查異步操作是否正確完成
- 增加測試超時時間

### 3. Mock 不工作

- 確保 Mock 在測試前設置
- 檢查 Mock 路徑是否正確
- 使用 `vi.clearAllMocks()` 清理 Mock

## 測試覆蓋率

### 查看覆蓋率報告

```bash
npm run test:coverage
```

覆蓋率報告將保存在 `coverage/` 目錄中。

### 覆蓋率目標

- 語句覆蓋率: 80%+
- 分支覆蓋率: 70%+
- 函數覆蓋率: 90%+
- 行覆蓋率: 80%+

## 持續集成

### GitHub Actions 配置

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e
```

## 下一步

1. 閱讀完整的 [測試手冊](README.md)
2. 查看 [測試樣板](test-templates.md)
3. 開始為您的組件編寫測試
4. 設置持續集成

---

如有問題，請參考測試手冊或聯繫開發團隊。