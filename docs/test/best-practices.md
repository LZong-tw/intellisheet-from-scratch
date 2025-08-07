# 測試最佳實踐

本指南涵蓋了編寫高品質測試的最佳實踐和指導原則。

## 通用原則

### 1. 測試金字塔

遵循測試金字塔原則，保持適當的測試比例：

```
         /\
        /E2E\      <- 少量但關鍵的端對端測試（10%）
       /------\
      /整合測試\    <- 中等數量的整合測試（20%）
     /----------\
    /  單元測試   \  <- 大量的單元測試（70%）
   /--------------\
```

### 2. F.I.R.S.T 原則

- **Fast（快速）**：測試應該快速執行
- **Independent（獨立）**：測試之間不應相互依賴
- **Repeatable（可重複）**：測試結果應該一致
- **Self-Validating（自我驗證）**：測試應該有明確的通過/失敗結果
- **Timely（及時）**：測試應該與代碼同時編寫

### 3. AAA 模式

每個測試應該遵循 Arrange-Act-Assert 模式：

```typescript
it('應該計算訂單總額', () => {
  // Arrange - 準備測試數據
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ]
  
  // Act - 執行要測試的操作
  const total = calculateOrderTotal(items)
  
  // Assert - 驗證結果
  expect(total).toBe(250)
})
```

## 命名規範

### 測試文件命名

```
ComponentName.test.tsx    # 組件測試
functionName.test.ts      # 函數測試
feature.spec.ts          # E2E 測試
```

### 測試描述命名

```typescript
// ❌ 不好的命名
describe('User', () => {
  it('test 1', () => {})
  it('works', () => {})
})

// ✅ 好的命名
describe('UserProfile', () => {
  it('應該顯示用戶的姓名和頭像', () => {})
  it('當用戶未登入時應該顯示登入按鈕', () => {})
  it('點擊編輯按鈕應該開啟編輯模式', () => {})
})
```

### 中文命名建議

使用一致的中文動詞：
- 應該（should）
- 當...時（when）
- 如果...則（if...then）
- 能夠（can）

## 單元測試最佳實踐

### 1. 測試行為而非實現

```typescript
// ❌ 測試實現細節
it('應該調用 setState', () => {
  const component = shallow(<Counter />)
  component.instance().increment()
  expect(component.instance().state.count).toBe(1)
})

// ✅ 測試行為
it('應該增加顯示的計數', () => {
  render(<Counter />)
  const button = screen.getByRole('button', { name: /增加/ })
  const display = screen.getByTestId('count-display')
  
  fireEvent.click(button)
  
  expect(display).toHaveTextContent('1')
})
```

### 2. 隔離外部依賴

```typescript
// Mock API 調用
vi.mock('@/services/api', () => ({
  fetchUser: vi.fn()
}))

it('應該顯示用戶信息', async () => {
  const mockUser = { id: 1, name: 'John' }
  vi.mocked(fetchUser).mockResolvedValue(mockUser)
  
  render(<UserProfile userId={1} />)
  
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument()
  })
})
```

### 3. 使用測試助手函數

```typescript
// test-utils.ts
export function createMockUser(overrides = {}) {
  return {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  }
}

// 在測試中使用
it('應該顯示用戶信息', () => {
  const user = createMockUser({ name: 'Custom Name' })
  render(<UserCard user={user} />)
  expect(screen.getByText('Custom Name')).toBeInTheDocument()
})
```

### 4. 避免測試私有方法

```typescript
// ❌ 不要測試私有方法
it('應該正確格式化日期', () => {
  const component = new DateFormatter()
  expect(component._formatDate('2023-01-01')).toBe('01/01/2023')
})

// ✅ 通過公共接口測試
it('應該顯示格式化的日期', () => {
  render(<DateDisplay date="2023-01-01" />)
  expect(screen.getByText('01/01/2023')).toBeInTheDocument()
})
```

## E2E 測試最佳實踐

### 1. 使用 Page Objects

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async login(email: string, password: string) {
    await this.page.goto('/login')
    await this.page.fill('[name="email"]', email)
    await this.page.fill('[name="password"]', password)
    await this.page.click('button[type="submit"]')
    await this.page.waitForURL('/dashboard')
  }
  
  async getErrorMessage() {
    return this.page.locator('.error-message').textContent()
  }
}

// 測試中使用
test('應該處理登入錯誤', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login('invalid@email.com', 'wrong-password')
  
  const error = await loginPage.getErrorMessage()
  expect(error).toBe('無效的電子郵件或密碼')
})
```

### 2. 資料清理策略

```typescript
test.describe('用戶管理', () => {
  let testUserId: string
  
  test.afterEach(async ({ request }) => {
    // 清理測試數據
    if (testUserId) {
      await request.delete(`/api/users/${testUserId}`)
    }
  })
  
  test('應該創建新用戶', async ({ page, request }) => {
    // 測試邏輯
    const response = await request.post('/api/users', {
      data: { name: 'Test User' }
    })
    testUserId = (await response.json()).id
  })
})
```

### 3. 智慧等待策略

```typescript
// ❌ 避免硬編碼等待
await page.waitForTimeout(5000)

// ✅ 使用條件等待
await page.waitForSelector('.content', { state: 'visible' })
await page.waitForLoadState('networkidle')
await expect(page.locator('.status')).toHaveText('完成')
```

### 4. 處理不穩定的測試

```typescript
test('可能不穩定的測試', async ({ page }) => {
  // 重試特定操作
  await expect(async () => {
    await page.click('.dynamic-button')
    await expect(page.locator('.result')).toBeVisible()
  }).toPass({
    intervals: [1000, 2000, 5000],
    timeout: 10000
  })
})
```

## 測試組織結構

### 1. 邏輯分組

```typescript
describe('ShoppingCart', () => {
  describe('添加商品', () => {
    it('應該添加新商品到購物車', () => {})
    it('應該更新已存在商品的數量', () => {})
    it('應該顯示商品總數', () => {})
  })
  
  describe('移除商品', () => {
    it('應該從購物車移除商品', () => {})
    it('當購物車為空時應該顯示空狀態', () => {})
  })
  
  describe('結算', () => {
    it('應該計算正確的總價', () => {})
    it('應該應用折扣碼', () => {})
  })
})
```

### 2. 共享設置和清理

```typescript
describe('API 測試', () => {
  let server: MockServer
  
  beforeAll(async () => {
    server = await createMockServer()
  })
  
  afterAll(async () => {
    await server.close()
  })
  
  beforeEach(() => {
    server.reset()
  })
  
  it('應該處理 API 請求', async () => {
    // 測試邏輯
  })
})
```

## 性能考慮

### 1. 並行執行

```typescript
// vitest.config.ts
export default {
  test: {
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    }
  }
}

// 測試文件
describe.concurrent('並行測試套件', () => {
  it.concurrent('測試 1', async () => {})
  it.concurrent('測試 2', async () => {})
})
```

### 2. 選擇性執行

```typescript
// 只執行特定測試
it.only('只執行這個測試', () => {})

// 跳過測試
it.skip('暫時跳過這個測試', () => {})

// 條件執行
it.skipIf(process.env.CI)('本地開發測試', () => {})
```

### 3. 測試優化

```typescript
// 重用昂貴的設置
let expensiveResource: Resource

beforeAll(async () => {
  expensiveResource = await createExpensiveResource()
})

afterAll(async () => {
  await expensiveResource.cleanup()
})

// 使用 test.each 減少重複
test.each([
  { input: 1, expected: 2 },
  { input: 2, expected: 4 },
  { input: 3, expected: 6 }
])('應該將 $input 翻倍為 $expected', ({ input, expected }) => {
  expect(double(input)).toBe(expected)
})
```

## 持續整合最佳實踐

### 1. CI 配置範例

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v3
```

### 2. 測試報告

```typescript
// vitest.config.ts
export default {
  test: {
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './test-results/junit.xml'
    }
  }
}
```

## 調試技巧

### 1. 視覺化調試

```typescript
// 單元測試
it('調試 DOM', () => {
  render(<ComplexComponent />)
  
  // 打印整個 DOM
  screen.debug()
  
  // 打印特定元素
  screen.debug(screen.getByRole('button'))
})

// E2E 測試
test('視覺調試', async ({ page }) => {
  await page.pause() // 暫停執行
  await page.screenshot({ path: 'debug.png' })
})
```

### 2. 日誌和斷點

```typescript
it('使用日誌調試', () => {
  const result = complexFunction()
  
  console.log('Result:', result)
  console.table(result.items)
  
  // 使用 debugger
  debugger
  
  expect(result).toMatchObject({ success: true })
})
```

## 常見陷阱和解決方案

### 1. 異步測試問題

```typescript
// ❌ 忘記等待異步操作
it('應該載入數據', () => {
  render(<DataList />)
  expect(screen.getByText('數據1')).toBeInTheDocument() // 可能失敗
})

// ✅ 正確等待
it('應該載入數據', async () => {
  render(<DataList />)
  await waitFor(() => {
    expect(screen.getByText('數據1')).toBeInTheDocument()
  })
})
```

### 2. 測試污染

```typescript
// ❌ 測試之間共享狀態
let sharedState = []

it('測試 1', () => {
  sharedState.push('item')
  expect(sharedState).toHaveLength(1)
})

it('測試 2', () => {
  // 這個測試會失敗因為 sharedState 已被修改
  expect(sharedState).toHaveLength(0)
})

// ✅ 每個測試隔離狀態
describe('測試套件', () => {
  let state: string[]
  
  beforeEach(() => {
    state = []
  })
  
  it('測試 1', () => {
    state.push('item')
    expect(state).toHaveLength(1)
  })
  
  it('測試 2', () => {
    expect(state).toHaveLength(0)
  })
})
```

### 3. 過度 Mock

```typescript
// ❌ Mock 太多實現細節
vi.mock('react', () => ({
  ...vi.importActual('react'),
  useState: vi.fn(() => [false, vi.fn()])
}))

// ✅ 只 Mock 必要的外部依賴
vi.mock('@/services/api')
```

## 測試文檔和維護

### 1. 測試即文檔

```typescript
describe('PaymentProcessor', () => {
  describe('processPayment', () => {
    it('應該成功處理有效的信用卡付款', () => {
      // 這個測試同時作為 API 使用文檔
      const payment = {
        amount: 100,
        currency: 'TWD',
        card: {
          number: '4111111111111111',
          expiry: '12/25',
          cvv: '123'
        }
      }
      
      const result = processPayment(payment)
      
      expect(result).toEqual({
        success: true,
        transactionId: expect.any(String),
        amount: 100,
        currency: 'TWD'
      })
    })
  })
})
```

### 2. 測試維護檢查清單

- [ ] 定期檢查並移除過時的測試
- [ ] 更新測試以反映需求變更
- [ ] 重構重複的測試代碼
- [ ] 確保測試描述準確
- [ ] 維護測試性能
- [ ] 更新測試依賴