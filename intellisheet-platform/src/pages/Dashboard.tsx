import { Link } from 'react-router-dom'
import {
  TableProperties,
  Shield,
  GitBranch,
  BarChart3,
  Sparkles,
  Users,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Search,
  Bell,
  Settings,
  ArrowUp,
  ArrowDown,
  MoreVertical,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts'
import toast from 'react-hot-toast'

const features = [
  {
    title: 'Excel-like Spreadsheet',
    description: 'Direct cell editing with enterprise-grade performance',
    icon: TableProperties,
    href: '/spreadsheet',
    stats: { sheets: 12, rows: '50K+' },
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Dynamic Permissions',
    description: 'State-driven ABAC with real-time rule evaluation',
    icon: Shield,
    href: '/permissions',
    stats: { rules: 24, roles: 8 },
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Workflow Automation',
    description: 'Visual workflow builder with drag-and-drop',
    icon: GitBranch,
    href: '/workflows',
    stats: { workflows: 6, executions: '1.2K' },
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Real-time insights and predictive analytics',
    icon: BarChart3,
    href: '/analytics',
    stats: { reports: 15, insights: 42 },
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: 'AI Assistant',
    description: 'Machine learning for anomaly detection',
    icon: Sparkles,
    href: '/ai-tools',
    stats: { predictions: 89, accuracy: '94%' },
    color: 'from-pink-500 to-pink-600',
  },
]

const recentActivities = [
  { id: 1, action: 'Sheet updated', user: 'John Doe', time: '2 mins ago', icon: FileText, type: 'update' },
  { id: 2, action: 'Permission rule created', user: 'Admin', time: '15 mins ago', icon: Shield, type: 'create' },
  { id: 3, action: 'Workflow executed', user: 'System', time: '1 hour ago', icon: GitBranch, type: 'system' },
  { id: 4, action: 'Report generated', user: 'Jane Smith', time: '3 hours ago', icon: BarChart3, type: 'report' },
]

const systemStatus = [
  { name: 'API Response Time', value: '45ms', status: 'good', trend: 'down' },
  { name: 'Database Load', value: '23%', status: 'good', trend: 'stable' },
  { name: 'Active Users', value: '142', status: 'good', trend: 'up' },
  { name: 'Error Rate', value: '0.02%', status: 'warning', trend: 'up' },
]

// Generate chart data
const generateChartData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    users: Math.floor(Math.random() * 50) + 100,
    sheets: Math.floor(Math.random() * 100) + 200,
    workflows: Math.floor(Math.random() * 30) + 10,
  }))
}

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false)
  const [activities, setActivities] = useState(recentActivities)
  const [stats, setStats] = useState({
    activeUsers: 142,
    totalSheets: 1234,
    efficiencyGain: 89,
    uptime: 99.9,
  })
  const [chartData, setChartData] = useState(generateChartData())
  const [notifications, setNotifications] = useState(3)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDashboard()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const refreshDashboard = () => {
    setRefreshing(true)
    setTimeout(() => {
      // Simulate data updates
      setStats({
        activeUsers: stats.activeUsers + Math.floor(Math.random() * 10 - 5),
        totalSheets: stats.totalSheets + Math.floor(Math.random() * 5),
        efficiencyGain: Math.min(100, stats.efficiencyGain + (Math.random() * 2 - 1)),
        uptime: 99.9,
      })
      
      // Update chart data
      setChartData(generateChartData())
      
      // Add new activity
      const newActivity = {
        id: Date.now(),
        action: ['Sheet updated', 'Workflow executed', 'User logged in', 'Report viewed'][Math.floor(Math.random() * 4)],
        user: ['John Doe', 'Jane Smith', 'System', 'Admin'][Math.floor(Math.random() * 4)],
        time: 'Just now',
        icon: [FileText, GitBranch, Users, BarChart3][Math.floor(Math.random() * 4)],
        type: ['update', 'system', 'login', 'view'][Math.floor(Math.random() * 4)],
      }
      setActivities([newActivity, ...activities.slice(0, 3)])
      
      setRefreshing(false)
      toast.success('Dashboard refreshed')
    }, 1000)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'search':
        toast('Opening global search...')
        break
      case 'notifications':
        setNotifications(0)
        toast('Viewing notifications...')
        break
      case 'settings':
        toast('Opening settings...')
        break
    }
  }

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range)
    refreshDashboard()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Overview of your IntelliSheet platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuickAction('search')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleQuickAction('notifications')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          <button
            onClick={refreshDashboard}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            disabled={refreshing}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => handleQuickAction('settings')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)',
          }} />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome to IntelliSheet 2.0</h2>
          <p className="text-lg opacity-90 mb-4">
            The next-generation spreadsheet platform that combines Excel-like simplicity with enterprise-grade permissions
          </p>
          <div className="flex gap-4">
            <Link
              to="/spreadsheet/new"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Sheet
            </Link>
            <Link
              to="/workflows"
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium"
            >
              View Workflows
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Feature Cards with Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link
              to={feature.href}
              className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all relative group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </div>
              <div className={`bg-gradient-to-r ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <div className="flex justify-between text-sm">
                {Object.entries(feature.stats).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-500 capitalize">{key}:</span>
                    <span className="ml-1 font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-500">Last accessed 2 hours ago</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Platform Activity</h3>
            <select
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sheets" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="workflows" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-400">Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-400">Sheets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-sm text-gray-400">Workflows</span>
            </div>
          </div>
        </motion.div>

        {/* Usage Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Feature Usage</h3>
          <div className="space-y-4">
            {[
              { name: 'Spreadsheets', usage: 85, color: 'bg-blue-500' },
              { name: 'Workflows', usage: 72, color: 'bg-green-500' },
              { name: 'Analytics', usage: 68, color: 'bg-orange-500' },
              { name: 'AI Tools', usage: 45, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-gray-400">{item.usage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.usage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-2 rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            System Status
          </h3>
          <div className="space-y-3">
            {systemStatus.map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <span className="text-gray-400">{item.name}</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{item.value}</span>
                  {item.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-500" />}
                  {item.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
                  {item.status === 'good' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500 ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
            View Details
          </button>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </h3>
            <Link to="/activity" className="text-sm text-primary-500 hover:text-primary-400">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'create' ? 'bg-green-500/20' :
                  activity.type === 'update' ? 'bg-blue-500/20' :
                  activity.type === 'system' ? 'bg-purple-500/20' :
                  'bg-orange-500/20'
                }`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-400">by {activity.user}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-750 transition-colors cursor-pointer">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">{stats.activeUsers}</p>
          <p className="text-sm text-gray-400">Active Users</p>
          <p className="text-xs text-green-400 mt-1">+5% from last week</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-750 transition-colors cursor-pointer">
          <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">{stats.totalSheets.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Total Sheets</p>
          <p className="text-xs text-green-400 mt-1">+12 today</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-750 transition-colors cursor-pointer">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold">{stats.efficiencyGain.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">Efficiency Gain</p>
          <p className="text-xs text-orange-400 mt-1">Above target</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-750 transition-colors cursor-pointer">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold">{stats.uptime}%</p>
          <p className="text-sm text-gray-400">Uptime</p>
          <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
        </div>
      </motion.div>
    </div>
  )
}