# 測試模板使用指南

本目錄包含了各種測試模板，幫助您快速開始編寫測試。

## 可用模板

### 1. 組件測試模板 (`component.test.template.tsx`)

用於測試 React 組件的模板，包含：
- 基本渲染測試
- Props 測試
- 用戶交互測試
- 狀態管理測試
- 異步操作測試
- 錯誤處理測試
- 無障礙測試

**使用方式：**
```bash
# 複製模板到您的測試目錄
cp src/test/templates/component.test.template.tsx src/components/__tests__/YourComponent.test.tsx

# 修改以下內容：
# 1. 將 'Component Name' 替換為您的組件名稱
# 2. 導入您要測試的組件
# 3. 根據組件功能調整測試案例
```

### 2. Hook 測試模板 (`hook.test.template.ts`)

用於測試自定義 React Hooks 的模板，包含：
- 基本功能測試
- 參數變化測試
- 副作用測試
- 異步操作測試
- 錯誤處理測試
- 性能測試（memoization）

**使用方式：**
```bash
# 複製模板
cp src/test/templates/hook.test.template.ts src/hooks/__tests__/useYourHook.test.ts

# 修改內容：
# 1. 導入您的 Hook
# 2. 替換 'useYourHook' 為實際的 Hook 名稱
# 3. 根據 Hook 功能調整測試
```

### 3. Store 測試模板 (`store.test.template.ts`)

用於測試 Zustand 或其他狀態管理的模板，包含：
- 初始狀態測試
- Actions 測試
- 異步 Actions 測試
- Computed values 測試
- Subscriptions 測試

**使用方式：**
```bash
# 複製模板
cp src/test/templates/store.test.template.ts src/stores/__tests__/yourStore.test.ts

# 修改內容：
# 1. 導入您的 store
# 2. 替換模擬實現為實際的 store 調用
# 3. 根據 store 結構調整測試
```

## E2E 測試模板

### 頁面測試模板 (`e2e/templates/page.test.template.ts`)

用於端對端測試的完整模板，包含：
- 頁面載入測試
- 導航測試
- 表單交互測試
- 響應式測試
- 異步操作測試
- 鍵盤導航測試
- 無障礙測試
- 性能測試
- 安全測試

**使用方式：**
```bash
# 複製模板
cp e2e/templates/page.test.template.ts e2e/your-feature.spec.ts

# 修改內容：
# 1. 替換 'Page Name' 為您的功能名稱
# 2. 更新 URL 和選擇器
# 3. 根據實際頁面調整測試案例
```

## 快速開始步驟

1. **選擇合適的模板**
   - 組件 → `component.test.template.tsx`
   - Hook → `hook.test.template.ts`
   - Store → `store.test.template.ts`
   - E2E → `page.test.template.ts`

2. **複製並重命名**
   ```bash
   # 例如測試 UserProfile 組件
   cp src/test/templates/component.test.template.tsx \
      src/components/__tests__/UserProfile.test.tsx
   ```

3. **修改測試內容**
   - 更新 import 語句
   - 替換測試描述
   - 調整測試案例以符合實際功能

4. **執行測試**
   ```bash
   # 執行單元測試
   npm run test UserProfile

   # 執行 E2E 測試
   npm run test:e2e user-profile
   ```

## 常用測試模式

### 條件渲染測試
```typescript
it('應該根據條件顯示不同內容', () => {
  const { rerender } = render(<Component isLoggedIn={false} />)
  expect(screen.getByText('請登入')).toBeInTheDocument()
  
  rerender(<Component isLoggedIn={true} />)
  expect(screen.getByText('歡迎回來')).toBeInTheDocument()
})
```

### API Mock 測試
```typescript
it('應該處理 API 響應', async () => {
  const mockData = { id: 1, name: 'Test' }
  vi.mocked(apiCall).mockResolvedValue(mockData)
  
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### 表單驗證測試
```typescript
it('應該驗證必填欄位', async () => {
  const user = userEvent.setup()
  render(<Form />)
  
  await user.click(screen.getByRole('button', { name: /提交/ }))
  
  expect(screen.getByText('此欄位為必填')).toBeInTheDocument()
})
```

## 測試命名規範

- 使用中文描述，清楚表達測試意圖
- 遵循 "應該..." 的格式
- 包含條件和預期結果

範例：
- ✅ `應該在用戶點擊按鈕時顯示對話框`
- ✅ `當輸入無效電郵時應該顯示錯誤訊息`
- ❌ `測試按鈕`
- ❌ `工作正常`

## 需要幫助？

- 查看 [單元測試指南](../../../docs/test/unit-testing.md)
- 查看 [E2E 測試指南](../../../docs/test/e2e-testing.md)
- 查看 [測試最佳實踐](../../../docs/test/best-practices.md)