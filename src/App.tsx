import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Spreadsheet from './pages/Spreadsheet'
import Permissions from './pages/Permissions'
import Workflows from './pages/Workflows'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import AITools from './pages/AITools'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="spreadsheet/:id?" element={<Spreadsheet />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="ai-tools" element={<AITools />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
          },
        }}
      />
    </>
  )
}

export default App