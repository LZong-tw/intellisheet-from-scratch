# 單元測試指南

本指南提供了撰寫高品質單元測試的詳細說明和最佳實踐。

## 單元測試概述

單元測試是針對應用程式中最小可測試單元（如函數、方法、組件）的測試。在 IntelliSheet 專案中，我們使用 Vitest 和 React Testing Library 進行單元測試。

## 測試結構

### 基本結構

每個測試文件應該遵循以下結構：

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'

describe('測試套件名稱', () => {
  // 設置和清理
  beforeEach(() => {
    // 測試前的準備
  })

  afterEach(() => {
    // 測試後的清理
  })

  // 測試分組
  describe('功能分組', () => {
    it('應該執行某個行為', () => {
      // Arrange - 準備
      // Act - 執行
      // Assert - 斷言
    })
  })
})
```

## 組件測試

### 基本組件測試

```typescript
import { render, screen } from '@/test/utils/test-utils'
import Button from '@/components/Button'

describe('Button', () => {
  it('應該渲染按鈕文字', () => {
    render(<Button>點擊我</Button>)
    
    expect(screen.getByRole('button', { name: /點擊我/ })).toBeInTheDocument()
  })

  it('應該處理點擊事件', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>點擊</Button>)
    
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 測試 Props

```typescript
describe('Card 組件', () => {
  it('應該根據 props 渲染內容', () => {
    const props = {
      title: '標題',
      description: '描述',
      image: 'image.jpg'
    }
    
    render(<Card {...props} />)
    
    expect(screen.getByText(props.title)).toBeInTheDocument()
    expect(screen.getByText(props.description)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', props.image)
  })

  it('應該處理可選 props', () => {
    render(<Card title="必需標題" />)
    
    expect(screen.getByText('必需標題')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
```

### 測試狀態變化

```typescript
describe('Counter 組件', () => {
  it('應該更新計數器', async () => {
    const user = userEvent.setup()
    render(<Counter initialValue={0} />)
    
    const incrementButton = screen.getByRole('button', { name: /增加/ })
    const decrementButton = screen.getByRole('button', { name: /減少/ })
    const display = screen.getByTestId('counter-display')
    
    expect(display).toHaveTextContent('0')
    
    await user.click(incrementButton)
    expect(display).toHaveTextContent('1')
    
    await user.click(decrementButton)
    expect(display).toHaveTextContent('0')
  })
})
```

## Hook 測試

### 基本 Hook 測試

```typescript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '@/hooks/useCounter'

describe('useCounter', () => {
  it('應該初始化為提供的值', () => {
    const { result } = renderHook(() => useCounter(10))
    
    expect(result.current.count).toBe(10)
  })

  it('應該增加計數', () => {
    const { result } = renderHook(() => useCounter(0))
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

### 異步 Hook 測試

```typescript
describe('useApi', () => {
  it('應該獲取數據', async () => {
    const mockData = { id: 1, name: 'Test' }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })
    
    const { result } = renderHook(() => useApi('/api/data'))
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual(mockData)
    })
  })

  it('應該處理錯誤', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('API Error'))
    
    const { result } = renderHook(() => useApi('/api/data'))
    
    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.loading).toBe(false)
    })
  })
})
```

## 測試用戶交互

### 表單交互

```typescript
describe('LoginForm', () => {
  it('應該提交表單數據', async () => {
    const handleSubmit = vi.fn()
    const user = userEvent.setup()
    
    render(<LoginForm onSubmit={handleSubmit} />)
    
    // 填寫表單
    await user.type(screen.getByLabelText(/用戶名/), 'testuser')
    await user.type(screen.getByLabelText(/密碼/), 'password123')
    
    // 提交表單
    await user.click(screen.getByRole('button', { name: /登入/ }))
    
    // 驗證
    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    })
  })

  it('應該顯示驗證錯誤', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} />)
    
    // 直接提交空表單
    await user.click(screen.getByRole('button', { name: /登入/ }))
    
    // 檢查錯誤訊息
    expect(screen.getByText(/用戶名為必填/)).toBeInTheDocument()
    expect(screen.getByText(/密碼為必填/)).toBeInTheDocument()
  })
})
```

### 鍵盤交互

```typescript
describe('SearchBox', () => {
  it('應該處理鍵盤快捷鍵', async () => {
    const handleSearch = vi.fn()
    const user = userEvent.setup()
    
    render(<SearchBox onSearch={handleSearch} />)
    
    const input = screen.getByRole('searchbox')
    await user.type(input, 'test query')
    
    // 按 Enter 鍵搜尋
    await user.keyboard('{Enter}')
    
    expect(handleSearch).toHaveBeenCalledWith('test query')
    
    // 按 Escape 清空
    await user.keyboard('{Escape}')
    
    expect(input).toHaveValue('')
  })
})
```

## Mock 和 Stub

### Mock 函數

```typescript
describe('UserService', () => {
  it('應該調用 API 並處理響應', async () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'User' })
    })
    
    const result = await UserService.getUser(1)
    
    expect(mockFetch).toHaveBeenCalledWith('/api/users/1')
    expect(result).toEqual({ id: 1, name: 'User' })
  })
})
```

### Mock 模組

```typescript
// Mock 整個模組
vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// 在測試中使用
import { apiClient } from '@/services/api'

describe('DataManager', () => {
  it('應該獲取數據', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] })
    
    const manager = new DataManager()
    const data = await manager.fetchData()
    
    expect(apiClient.get).toHaveBeenCalledWith('/data')
    expect(data).toEqual([])
  })
})
```

## 測試異步行為

### Promise 和 async/await

```typescript
describe('異步操作', () => {
  it('應該等待 Promise 完成', async () => {
    const promise = Promise.resolve('success')
    const result = await promise
    
    expect(result).toBe('success')
  })

  it('應該處理 Promise 拒絕', async () => {
    const promise = Promise.reject(new Error('failed'))
    
    await expect(promise).rejects.toThrow('failed')
  })
})
```

### 測試 Timer

```typescript
describe('Timer 功能', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('應該在延遲後執行', () => {
    const callback = vi.fn()
    
    setTimeout(callback, 1000)
    
    expect(callback).not.toHaveBeenCalled()
    
    vi.advanceTimersByTime(1000)
    
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('應該定期執行', () => {
    const callback = vi.fn()
    
    setInterval(callback, 1000)
    
    vi.advanceTimersByTime(3000)
    
    expect(callback).toHaveBeenCalledTimes(3)
  })
})
```

## 測試覆蓋率

### 查看覆蓋率

```bash
# 生成覆蓋率報告
npm run test:coverage

# 查看 HTML 報告
open coverage/index.html
```

### 覆蓋率配置

在 `vitest.config.ts` 中配置：

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.{ts,tsx}'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
})
```

## 最佳實踐

### 1. 描述性測試名稱

```typescript
// ❌ 不好
it('測試 1', () => {})

// ✅ 好
it('當用戶點擊提交按鈕時，應該驗證表單並顯示錯誤', () => {})
```

### 2. 單一職責

```typescript
// ❌ 測試太多東西
it('應該渲染並處理所有交互', () => {
  // 測試渲染
  // 測試點擊
  // 測試輸入
  // 測試提交
})

// ✅ 分開測試
it('應該正確渲染初始狀態', () => {})
it('應該處理按鈕點擊', () => {})
it('應該驗證輸入', () => {})
```

### 3. 避免實現細節

```typescript
// ❌ 測試實現細節
expect(component.state.isOpen).toBe(true)
expect(component.instance().handleClick).toHaveBeenCalled()

// ✅ 測試行為
expect(screen.getByRole('dialog')).toBeVisible()
expect(screen.getByText('成功訊息')).toBeInTheDocument()
```

### 4. 使用適當的查詢方法

優先順序：
1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId`

### 5. 等待異步操作

```typescript
// ❌ 可能會失敗
fireEvent.click(button)
expect(screen.getByText('載入完成')).toBeInTheDocument()

// ✅ 正確等待
await userEvent.click(button)
await waitFor(() => {
  expect(screen.getByText('載入完成')).toBeInTheDocument()
})
```

## 疑難排解

### 常見問題

1. **找不到元素**
   - 使用 `screen.debug()` 查看當前 DOM
   - 確認元素是否已渲染
   - 檢查查詢方法是否正確

2. **異步測試失敗**
   - 使用 `waitFor` 等待元素出現
   - 確保使用 `async/await`
   - 調整 timeout 時間

3. **Mock 不生效**
   - 確認 mock 在正確的位置
   - 使用 `vi.clearAllMocks()` 清理
   - 檢查 import 順序