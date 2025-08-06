import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  TableProperties,
  Shield,
  GitBranch,
  BarChart3,
  Sparkles,
  Settings,
  FileSpreadsheet,
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Spreadsheets', href: '/spreadsheet', icon: TableProperties },
  { name: 'Permissions', href: '/permissions', icon: Shield },
  { name: 'Workflows', href: '/workflows', icon: GitBranch },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'AI Tools', href: '/ai-tools', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div
        className={clsx(
          'flex flex-col bg-gray-800 border-r border-gray-700 transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <FileSpreadsheet className="w-8 h-8 text-primary-500" />
          {sidebarOpen && (
            <span className="ml-3 text-xl font-bold text-white">
              IntelliSheet
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-gray-700 hover:bg-gray-700/50"
        >
          <svg
            className={clsx('w-5 h-5 transition-transform', !sidebarOpen && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              Next-Generation Spreadsheet Platform
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Version 2.0</span>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}