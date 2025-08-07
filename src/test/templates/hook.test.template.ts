import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'

// 導入要測試的 Hook
// import { useYourHook } from '../hooks/useYourHook'

describe('useYourHook', () => {
  describe('基本功能測試', () => {
    it('應該返回初始值', () => {
      const { result } = renderHook(() => {
        // 使用你的 hook
        return { value: 'initial' }
      })
      
      expect(result.current.value).toBe('initial')
    })

    it('應該正確更新值', () => {
      const { result } = renderHook(() => {
        const [value, setValue] = React.useState('initial')
        return { value, setValue }
      })
      
      act(() => {
        result.current.setValue('updated')
      })
      
      expect(result.current.value).toBe('updated')
    })
  })

  describe('參數變化測試', () => {
    it('應該在參數改變時重新計算', () => {
      const { result, rerender } = renderHook(
        ({ multiplier }) => {
          const [count, setCount] = React.useState(1)
          const value = count * multiplier
          return { value, setCount }
        },
        {
          initialProps: { multiplier: 2 }
        }
      )
      
      expect(result.current.value).toBe(2)
      
      // 更新 props
      rerender({ multiplier: 3 })
      expect(result.current.value).toBe(3)
    })
  })

  describe('副作用測試', () => {
    it('應該在掛載時執行副作用', () => {
      const sideEffect = vi.fn()
      
      renderHook(() => {
        React.useEffect(() => {
          sideEffect()
        }, [])
      })
      
      expect(sideEffect).toHaveBeenCalledTimes(1)
    })

    it('應該在卸載時清理', () => {
      const cleanup = vi.fn()
      
      const { unmount } = renderHook(() => {
        React.useEffect(() => {
          return cleanup
        }, [])
      })
      
      unmount()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })
  })

  describe('異步操作測試', () => {
    it('應該處理異步數據獲取', async () => {
      const fetchData = vi.fn().mockResolvedValue({ data: 'test' })
      
      const { result } = renderHook(() => {
        const [data, setData] = React.useState(null)
        const [loading, setLoading] = React.useState(false)
        
        const load = async () => {
          setLoading(true)
          const response = await fetchData()
          setData(response.data)
          setLoading(false)
        }
        
        return { data, loading, load }
      })
      
      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(false)
      
      await act(async () => {
        await result.current.load()
      })
      
      expect(result.current.data).toBe('test')
      expect(result.current.loading).toBe(false)
      expect(fetchData).toHaveBeenCalledTimes(1)
    })
  })

  describe('錯誤處理測試', () => {
    it('應該捕獲並處理錯誤', async () => {
      const error = new Error('測試錯誤')
      const fetchData = vi.fn().mockRejectedValue(error)
      
      const { result } = renderHook(() => {
        const [data, setData] = React.useState(null)
        const [error, setError] = React.useState(null)
        
        const load = async () => {
          try {
            const response = await fetchData()
            setData(response)
          } catch (err) {
            setError(err)
          }
        }
        
        return { data, error, load }
      })
      
      await act(async () => {
        await result.current.load()
      })
      
      expect(result.current.error).toBe(error)
      expect(result.current.data).toBeNull()
    })
  })

  describe('性能測試', () => {
    it('應該正確實現 memoization', () => {
      const expensiveCalculation = vi.fn((value: number) => value * 2)
      
      const { result, rerender } = renderHook(
        ({ value }) => {
          const memoized = React.useMemo(() => {
            return expensiveCalculation(value)
          }, [value])
          
          return memoized
        },
        {
          initialProps: { value: 1 }
        }
      )
      
      expect(result.current).toBe(2)
      expect(expensiveCalculation).toHaveBeenCalledTimes(1)
      
      // 相同的值不應該重新計算
      rerender({ value: 1 })
      expect(expensiveCalculation).toHaveBeenCalledTimes(1)
      
      // 不同的值應該重新計算
      rerender({ value: 2 })
      expect(result.current).toBe(4)
      expect(expensiveCalculation).toHaveBeenCalledTimes(2)
    })
  })
})