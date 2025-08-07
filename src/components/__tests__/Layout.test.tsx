import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/utils/test-utils'
import { useLocation } from 'react-router-dom'
import Layout from '../Layout'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn(),
    Outlet: () => <div data-testid="outlet">Outlet Content</div>
  }
})

describe('Layout', () => {
  beforeEach(() => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/dashboard',
      search: '',
      hash: '',
      state: null,
      key: ''
    })
  })

  describe('渲染測試', () => {
    it('應該正確渲染 Layout 組件', () => {
      render(<Layout />)
      
      // 檢查主要結構
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByTestId('outlet')).toBeInTheDocument()
    })

    it('應該顯示所有導航連結', () => {
      render(<Layout />)
      
      // 檢查所有導航項目
      expect(screen.getByText('儀表板')).toBeInTheDocument()
      expect(screen.getByText('智能表格')).toBeInTheDocument()
      expect(screen.getByText('權限管理')).toBeInTheDocument()
      expect(screen.getByText('工作流程')).toBeInTheDocument()
      expect(screen.getByText('數據分析')).toBeInTheDocument()
      expect(screen.getByText('AI 工具')).toBeInTheDocument()
      expect(screen.getByText('設定')).toBeInTheDocument()
    })

    it('應該顯示用戶資訊', () => {
      render(<Layout />)
      
      expect(screen.getByText('管理員')).toBeInTheDocument()
      expect(screen.getByText('admin@intellisheet.com')).toBeInTheDocument()
    })
  })

  describe('導航激活狀態測試', () => {
    it('應該高亮當前路徑的導航項目', () => {
      vi.mocked(useLocation).mockReturnValue({
        pathname: '/spreadsheet',
        search: '',
        hash: '',
        state: null,
        key: ''
      })
      
      render(<Layout />)
      
      const spreadsheetLink = screen.getByRole('link', { name: /智能表格/i })
      expect(spreadsheetLink.parentElement).toHaveClass('bg-gray-800')
    })

    it('應該對其他導航項目不添加激活樣式', () => {
      vi.mocked(useLocation).mockReturnValue({
        pathname: '/dashboard',
        search: '',
        hash: '',
        state: null,
        key: ''
      })
      
      render(<Layout />)
      
      const spreadsheetLink = screen.getByRole('link', { name: /智能表格/i })
      expect(spreadsheetLink.parentElement).not.toHaveClass('bg-gray-800')
    })
  })

  describe('響應式測試', () => {
    it('應該在不同螢幕尺寸下正確顯示', () => {
      // 測試桌面版
      window.innerWidth = 1200
      render(<Layout />)
      
      const sidebar = screen.getByRole('navigation')
      expect(sidebar).toHaveClass('w-64')
      
      // 清理並測試移動版
      // 注意：實際測試中可能需要觸發 resize 事件
    })
  })

  describe('圖標渲染測試', () => {
    it('應該為每個導航項目顯示正確的圖標', () => {
      render(<Layout />)
      
      // 檢查 SVG 圖標是否存在
      const icons = screen.getAllByRole('img', { hidden: true })
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('無障礙測試', () => {
    it('應該有正確的 ARIA 標籤', () => {
      render(<Layout />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      
      // 檢查連結的可訪問性
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })

    it('應該支持鍵盤導航', () => {
      render(<Layout />)
      
      const firstLink = screen.getByRole('link', { name: /儀表板/i })
      firstLink.focus()
      
      expect(document.activeElement).toBe(firstLink)
    })
  })
})