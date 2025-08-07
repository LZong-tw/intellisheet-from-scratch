import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import React from 'react'

// 導入要測試的 store
// import { useYourStore } from '../stores/yourStore'

// Mock zustand
vi.mock('zustand')

describe('Store Name', () => {
  // 在每個測試前重置 store
  beforeEach(() => {
    // 重置 store 到初始狀態
    // useYourStore.setState(initialState)
  })

  describe('初始狀態', () => {
    it('應該有正確的初始值', () => {
      const { result } = renderHook(() => ({
        // 模擬 store 的初始狀態
        items: [],
        loading: false,
        error: null
      }))
      
      expect(result.current.items).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('Actions 測試', () => {
    it('應該正確添加項目', () => {
      const { result } = renderHook(() => {
        const [items, setItems] = React.useState<string[]>([])
        
        const addItem = (item: string) => {
          setItems(prev => [...prev, item])
        }
        
        return { items, addItem }
      })
      
      act(() => {
        result.current.addItem('新項目')
      })
      
      expect(result.current.items).toContain('新項目')
      expect(result.current.items).toHaveLength(1)
    })

    it('應該正確更新項目', () => {
      const { result } = renderHook(() => {
        const [items, setItems] = React.useState([
          { id: 1, name: '項目1' },
          { id: 2, name: '項目2' }
        ])
        
        const updateItem = (id: number, updates: Partial<{ name: string }>) => {
          setItems(prev => 
            prev.map(item => 
              item.id === id ? { ...item, ...updates } : item
            )
          )
        }
        
        return { items, updateItem }
      })
      
      act(() => {
        result.current.updateItem(1, { name: '更新的項目1' })
      })
      
      expect(result.current.items[0].name).toBe('更新的項目1')
      expect(result.current.items[1].name).toBe('項目2')
    })

    it('應該正確刪除項目', () => {
      const { result } = renderHook(() => {
        const [items, setItems] = React.useState([
          { id: 1, name: '項目1' },
          { id: 2, name: '項目2' }
        ])
        
        const deleteItem = (id: number) => {
          setItems(prev => prev.filter(item => item.id !== id))
        }
        
        return { items, deleteItem }
      })
      
      act(() => {
        result.current.deleteItem(1)
      })
      
      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].id).toBe(2)
    })
  })

  describe('異步 Actions 測試', () => {
    it('應該處理載入狀態', async () => {
      const mockFetch = vi.fn().mockResolvedValue(['item1', 'item2'])
      
      const { result } = renderHook(() => {
        const [items, setItems] = React.useState<string[]>([])
        const [loading, setLoading] = React.useState(false)
        
        const fetchItems = async () => {
          setLoading(true)
          try {
            const data = await mockFetch()
            setItems(data)
          } finally {
            setLoading(false)
          }
        }
        
        return { items, loading, fetchItems }
      })
      
      expect(result.current.loading).toBe(false)
      
      const promise = act(async () => {
        await result.current.fetchItems()
      })
      
      // 檢查載入狀態
      expect(result.current.loading).toBe(true)
      
      await promise
      
      expect(result.current.loading).toBe(false)
      expect(result.current.items).toEqual(['item1', 'item2'])
    })

    it('應該處理錯誤狀態', async () => {
      const mockError = new Error('獲取失敗')
      const mockFetch = vi.fn().mockRejectedValue(mockError)
      
      const { result } = renderHook(() => {
        const [error, setError] = React.useState<Error | null>(null)
        
        const fetchItems = async () => {
          try {
            await mockFetch()
          } catch (err) {
            setError(err as Error)
          }
        }
        
        return { error, fetchItems }
      })
      
      await act(async () => {
        await result.current.fetchItems()
      })
      
      expect(result.current.error).toBe(mockError)
    })
  })

  describe('Computed Values 測試', () => {
    it('應該正確計算衍生狀態', () => {
      const { result } = renderHook(() => {
        const items = [
          { id: 1, completed: true },
          { id: 2, completed: false },
          { id: 3, completed: true }
        ]
        
        const completedCount = items.filter(item => item.completed).length
        const totalCount = items.length
        
        return { completedCount, totalCount }
      })
      
      expect(result.current.completedCount).toBe(2)
      expect(result.current.totalCount).toBe(3)
    })
  })

  describe('Subscriptions 測試', () => {
    it('應該正確訂閱狀態變化', () => {
      const listener = vi.fn()
      
      const { result } = renderHook(() => {
        const [value, setValue] = React.useState(0)
        
        React.useEffect(() => {
          listener(value)
        }, [value])
        
        return { value, setValue }
      })
      
      expect(listener).toHaveBeenCalledWith(0)
      
      act(() => {
        result.current.setValue(1)
      })
      
      expect(listener).toHaveBeenCalledWith(1)
      expect(listener).toHaveBeenCalledTimes(2)
    })
  })
})