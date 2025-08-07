# 測試手冊

本手冊涵蓋了 IntelliSheet 項目的完整測試策略，包括單元測試、E2E 測試和測試最佳實踐。

## 目錄

- [測試架構](#測試架構)
- [單元測試](#單元測試)
- [E2E 測試](#e2e-測試)
- [測試運行](#測試運行)
- [測試最佳實踐](#測試最佳實踐)
- [故障排除](#故障排除)

## 測試架構

### 技術棧

- **單元測試**: Vitest + React Testing Library
- **E2E 測試**: Playwright
- **測試覆蓋率**: V8 Coverage
- **測試報告**: HTML Reporter

### 目錄結構

```
tests/
├── setup.ts                 # 測試環境設置
├── unit/                    # 單元測試
│   ├── components/          # 組件測試
│   ├── pages/              # 頁面測試
│   └── stores/             # 狀態管理測試
├── e2e/                    # E2E 測試
│   ├── navigation.spec.ts   # 導航測試
│   ├── form-builder.spec.ts # 表單構建器測試
│   └── spreadsheet.spec.ts  # 電子表格測試
└── utils/                  # 測試工具函數
    ├── test-utils.tsx      # 測試工具
    └── mocks/              # Mock 數據
```

## 單元測試

### 組件測試

組件測試使用 React Testing Library 和 Vitest，專注於測試組件的行為而非實現細節。

#### 測試模式

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Component Name', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<Component />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

#### 常用測試模式

1. **渲染測試**: 檢查組件是否正確渲染
2. **交互測試**: 測試用戶操作（點擊、輸入等）
3. **狀態測試**: 驗證組件狀態變化
4. **Props 測試**: 測試不同 props 的影響
5. **錯誤處理測試**: 測試錯誤情況

### 頁面測試

頁面測試涵蓋完整的頁面功能，包括路由、數據獲取和用戶流程。

#### 測試重點

- 頁面加載和渲染
- 數據獲取和顯示
- 用戶交互流程
- 錯誤狀態處理
- 響應式設計

### 狀態管理測試

測試 Zustand stores 的狀態變化和副作用。

```typescript
import { renderHook, act } from '@testing-library/react';
import { useStore } from '@/stores/useStore';

describe('Store', () => {
  it('should update state', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.updateState(newValue);
    });
    
    expect(result.current.state).toBe(newValue);
  });
});
```

## E2E 測試

### 測試策略

E2E 測試使用 Playwright，模擬真實用戶行為，測試完整的用戶流程。

#### 測試類型

1. **導航測試**: 測試頁面間導航
2. **功能測試**: 測試核心功能
3. **用戶流程測試**: 測試完整用戶旅程
4. **響應式測試**: 測試不同設備
5. **性能測試**: 測試加載時間和響應性

### 測試結構

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/page-url');
    await page.waitForLoadState('networkidle');
  });

  test('should perform action', async ({ page }) => {
    await page.getByRole('button').click();
    await expect(page.getByText('Result')).toBeVisible();
  });
});
```

### 測試最佳實踐

1. **使用語義選擇器**: 優先使用 `getByRole`, `getByLabel` 等
2. **等待策略**: 使用適當的等待策略
3. **隔離測試**: 每個測試獨立運行
4. **數據清理**: 測試後清理測試數據
5. **並行執行**: 利用 Playwright 的並行執行能力

## 測試運行

### 命令

```bash
# 運行所有測試
npm test

# 運行單元測試
npm run test:unit

# 運行 E2E 測試
npm run test:e2e

# 運行測試並生成覆蓋率報告
npm run test:coverage

# 運行特定測試文件
npm test tests/unit/components/Component.test.tsx

# 運行測試並監視變化
npm run test:watch
```

### 配置

#### Vitest 配置 (vitest.config.ts)

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

#### Playwright 配置 (playwright.config.ts)

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
  },
});
```

## 測試最佳實踐

### 1. 測試命名

使用描述性的測試名稱，清楚表達測試的目的：

```typescript
// 好的命名
it('should display error message when form validation fails')

// 不好的命名
it('should work')
```

### 2. 測試組織

使用 `describe` 塊組織相關測試：

```typescript
describe('Form Component', () => {
  describe('when form is valid', () => {
    it('should submit successfully')
  });
  
  describe('when form is invalid', () => {
    it('should show validation errors')
  });
});
```

### 3. 測試隔離

每個測試應該獨立運行，不依賴其他測試：

```typescript
beforeEach(() => {
  // 設置測試環境
  vi.clearAllMocks();
});

afterEach(() => {
  // 清理測試環境
  cleanup();
});
```

### 4. Mock 策略

合理使用 Mock，避免過度 Mock：

```typescript
// 只 Mock 外部依賴
vi.mock('@/stores/useStore', () => ({
  useStore: vi.fn(() => mockStore)
}));

// 不要 Mock 內部邏輯
// 避免 Mock 組件內部的狀態管理
```

### 5. 斷言策略

使用具體的斷言，避免過於寬鬆：

```typescript
// 好的斷言
expect(screen.getByText('Success')).toBeInTheDocument();
expect(button).toBeDisabled();

// 避免的斷言
expect(element).toBeTruthy();
```

## 故障排除

### 常見問題

1. **測試超時**
   - 檢查異步操作是否正確等待
   - 增加測試超時時間

2. **Mock 不工作**
   - 確保 Mock 在測試前設置
   - 檢查 Mock 路徑是否正確

3. **選擇器找不到元素**
   - 使用更穩定的選擇器
   - 檢查元素是否在 DOM 中

4. **測試環境問題**
   - 確保測試環境正確設置
   - 檢查依賴是否安裝

### 調試技巧

1. **使用 `screen.debug()`**
   ```typescript
   screen.debug(); // 輸出當前 DOM
   ```

2. **使用 Playwright 調試模式**
   ```bash
   npx playwright test --debug
   ```

3. **使用 Vitest UI**
   ```bash
   npm run test:ui
   ```

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

### 測試報告

- 單元測試覆蓋率報告保存在 `coverage/` 目錄
- E2E 測試報告保存在 `test-results/` 目錄
- 使用 `npm run test:report` 查看詳細報告

## 貢獻指南

### 添加新測試

1. 創建測試文件
2. 遵循現有的測試模式
3. 確保測試覆蓋率
4. 更新相關文檔

### 測試審查

- 確保測試有意義
- 檢查測試覆蓋率
- 驗證測試穩定性
- 確認測試性能

---

更多詳細信息，請參考各個測試文件的註釋和示例。