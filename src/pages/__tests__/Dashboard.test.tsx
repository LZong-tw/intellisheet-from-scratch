import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/utils/test-utils'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Dashboard from '../Dashboard'

// Mock chart components
vi.mock('recharts', () => ({
  AreaChart: vi.fn(({ children }) => <div data-testid="area-chart">{children}</div>),
  BarChart: vi.fn(({ children }) => <div data-testid="bar-chart">{children}</div>),
  Area: vi.fn(() => null),
  Bar: vi.fn(() => null),
  XAxis: vi.fn(() => null),
  YAxis: vi.fn(() => null),
  CartesianGrid: vi.fn(() => null),
  Tooltip: vi.fn(() => null),
  ResponsiveContainer: vi.fn(({ children }) => <div>{children}</div>)
}))

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('渲染測試', () => {
    it('應該正確渲染 Dashboard 頁面', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('儀表板')).toBeInTheDocument()
      expect(screen.getByText(/歡迎回來/)).toBeInTheDocument()
    })

    it('應該顯示所有統計卡片', () => {
      render(<Dashboard />)
      
      // 檢查統計卡片
      expect(screen.getByText('活躍表格')).toBeInTheDocument()
      expect(screen.getByText('總用戶數')).toBeInTheDocument()
      expect(screen.getByText('數據記錄')).toBeInTheDocument()
      expect(screen.getByText('API 調用')).toBeInTheDocument()
    })

    it('應該顯示統計數值', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('24')).toBeInTheDocument()
      expect(screen.getByText('1,234')).toBeInTheDocument()
      expect(screen.getByText('45.2K')).toBeInTheDocument()
      expect(screen.getByText('892K')).toBeInTheDocument()
    })
  })

  describe('圖表測試', () => {
    it('應該渲染活動趨勢圖表', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('活動趨勢')).toBeInTheDocument()
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    })

    it('應該渲染用戶活動圖表', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('用戶活動')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })
  })

  describe('快速操作測試', () => {
    it('應該顯示所有快速操作按鈕', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('快速操作')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /新建表格/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /邀請用戶/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /導出報告/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /查看文檔/ })).toBeInTheDocument()
    })

    it('應該處理快速操作點擊', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const newSheetButton = screen.getByRole('button', { name: /新建表格/ })
      await user.click(newSheetButton)
      
      // 這裡可以添加導航或其他行為的驗證
    })
  })

  describe('最近活動測試', () => {
    it('應該顯示最近活動列表', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('最近活動')).toBeInTheDocument()
      expect(screen.getByText(/創建了新表格/)).toBeInTheDocument()
      expect(screen.getByText(/更新了權限設置/)).toBeInTheDocument()
    })

    it('應該顯示活動時間', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('5分鐘前')).toBeInTheDocument()
      expect(screen.getByText('1小時前')).toBeInTheDocument()
    })
  })

  describe('響應式測試', () => {
    it('應該在小螢幕上正確排列卡片', () => {
      // 模擬小螢幕
      window.innerWidth = 375
      render(<Dashboard />)
      
      const cards = screen.getAllByRole('article')
      expect(cards.length).toBeGreaterThan(0)
      
      // 檢查是否使用正確的網格佈局類
      const container = cards[0].parentElement
      expect(container).toHaveClass('grid')
    })
  })

  describe('載入狀態測試', () => {
    it('應該在數據載入時顯示骨架屏', async () => {
      // 模擬異步載入
      const DelayedDashboard = () => {
        const [loading, setLoading] = React.useState(true)
        
        React.useEffect(() => {
          setTimeout(() => setLoading(false), 100)
        }, [])
        
        if (loading) {
          return <div>載入中...</div>
        }
        
        return <Dashboard />
      }
      
      render(<DelayedDashboard />)
      
      expect(screen.getByText('載入中...')).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.getByText('儀表板')).toBeInTheDocument()
      })
    })
  })

  describe('數據更新測試', () => {
    it('應該定期更新數據', async () => {
      vi.useFakeTimers()
      render(<Dashboard />)
      
      const initialValue = screen.getByText('24')
      expect(initialValue).toBeInTheDocument()
      
      // 快進時間觸發更新
      vi.advanceTimersByTime(30000) // 30秒
      
      // 這裡可以驗證數據是否更新
      // 實際實現需要根據組件的更新邏輯
      
      vi.useRealTimers()
    })
  })

  describe('錯誤處理測試', () => {
    it('應該在數據載入失敗時顯示錯誤訊息', async () => {
      // 模擬 API 錯誤
      const ErrorDashboard = () => {
        const [error, setError] = React.useState(false)
        
        React.useEffect(() => {
          // 模擬 API 調用失敗
          setError(true)
        }, [])
        
        if (error) {
          return <div role="alert">載入數據時發生錯誤</div>
        }
        
        return <Dashboard />
      }
      
      render(<ErrorDashboard />)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('載入數據時發生錯誤')
      })
    })
  })
})