import { BarChart3, TrendingUp, Users, FileText, ArrowUp, ArrowDown, Download, Filter, RefreshCw, Calendar, ChevronDown, Settings, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'

const performanceData = [
  { month: 'Jan', users: 4000, sheets: 2400, queries: 2400 },
  { month: 'Feb', users: 3000, sheets: 1398, queries: 2210 },
  { month: 'Mar', users: 2000, sheets: 9800, queries: 2290 },
  { month: 'Apr', users: 2780, sheets: 3908, queries: 2000 },
  { month: 'May', users: 1890, sheets: 4800, queries: 2181 },
  { month: 'Jun', users: 2390, sheets: 3800, queries: 2500 },
]

const usageByDepartment = [
  { name: 'Sales', value: 35, color: '#3b82f6' },
  { name: 'Engineering', value: 30, color: '#10b981' },
  { name: 'Marketing', value: 20, color: '#f59e0b' },
  { name: 'HR', value: 15, color: '#ef4444' },
]

const metrics = [
  { label: 'Active Users', value: '2,345', change: '+12%', trend: 'up' },
  { label: 'Total Sheets', value: '15,234', change: '+23%', trend: 'up' },
  { label: 'Avg. Load Time', value: '0.8s', change: '-15%', trend: 'down' },
  { label: 'Error Rate', value: '0.02%', change: '-50%', trend: 'down' },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedDimension, setSelectedDimension] = useState('department')
  const [data, setData] = useState(performanceData)

  // Refresh data based on time range
  useEffect(() => {
    refreshData()
  }, [timeRange])

  const refreshData = () => {
    setLoading(true)
    setTimeout(() => {
      // Simulate data refresh
      const newData = performanceData.map(item => ({
        ...item,
        users: item.users + Math.floor(Math.random() * 1000 - 500),
        sheets: item.sheets + Math.floor(Math.random() * 1000 - 500),
        queries: item.queries + Math.floor(Math.random() * 1000 - 500),
      }))
      setData(newData)
      setLoading(false)
    }, 1000)
  }

  const handleExport = (format: string) => {
    console.log(`Exporting data as ${format}`)
    alert(`Exporting analytics data as ${format}...`)
  }

  const handleDrillDown = (metric: string) => {
    setSelectedMetric(metric)
    console.log('Drilling down into:', metric)
  }

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' },
  ]

  const dimensions = [
    { value: 'department', label: 'By Department' },
    { value: 'region', label: 'By Region' },
    { value: 'product', label: 'By Product' },
    { value: 'time', label: 'By Time Period' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-400">Real-time insights and predictive analytics</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>{timeRanges.find(t => t.value === timeRange)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10 hidden group-hover:block">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                    timeRange === range.value ? 'bg-gray-700' : ''
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compare Toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              compareMode ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Compare Periods
          </button>

          {/* Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* Refresh */}
          <button
            onClick={refreshData}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Export */}
          <div className="relative group">
            <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10 hidden group-hover:block">
              <button
                onClick={() => handleExport('csv')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Export as PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Export as Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800 rounded-lg p-6 space-y-4"
        >
          <h3 className="font-semibold mb-4">Filter Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Department</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
                <option>All Departments</option>
                <option>Sales</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>HR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Metric Type</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
                <option>All Metrics</option>
                <option>Performance</option>
                <option>Usage</option>
                <option>Errors</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Dimension</label>
              <select 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                value={selectedDimension}
                onChange={(e) => setSelectedDimension(e.target.value)}
              >
                {dimensions.map(dim => (
                  <option key={dim.value} value={dim.value}>{dim.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
              Reset
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors"
            onClick={() => handleDrillDown(metric.label.toLowerCase().replace(' ', '_'))}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{metric.label}</span>
              <div className="flex items-center gap-2">
                {metric.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <Info className="w-4 h-4 text-gray-500 cursor-help" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{metric.value}</span>
              <span className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change}
              </span>
            </div>
            {compareMode && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <span className="text-xs text-gray-400">Previous: {metric.value}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Performance Trends
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">Revenue</button>
              <button className="px-3 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded-lg">Orders</button>
              <button className="px-3 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded-lg">Users</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={loading ? [] : data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="sheets" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="queries" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Usage by Department */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              Usage {dimensions.find(d => d.value === selectedDimension)?.label}
            </h3>
            <button className="p-1 hover:bg-gray-700 rounded">
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={usageByDepartment}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {usageByDepartment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {usageByDepartment.map((dept) => (
              <div 
                key={dept.name} 
                className="flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
                onClick={() => handleDrillDown(dept.name.toLowerCase())}
              >
                <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: dept.color }} />
                <span className="text-sm">
                  {dept.name}: {dept.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
            Weekly Activity Heatmap
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Show:</span>
            <select className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm">
              <option>All Activity</option>
              <option>Reads</option>
              <option>Writes</option>
              <option>Shares</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center">
              <p className="text-xs text-gray-400 mb-2">{day}</p>
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${Math.random() * 0.8 + 0.2})`,
                    }}
                    title={`${Math.floor(Math.random() * 100)} activities`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end mt-4 gap-4">
          <span className="text-xs text-gray-400">Less</span>
          <div className="flex gap-1">
            {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
              <div
                key={opacity}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">More</span>
        </div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-500" />
            Recent Reports
          </h3>
          <button className="text-sm text-primary-500 hover:text-primary-400">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {['Monthly Performance Summary', 'User Activity Report', 'System Health Check', 'Permission Audit Log'].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-3 text-gray-400" />
                <div>
                  <span>{report}</span>
                  <p className="text-xs text-gray-400">Generated {index + 1} hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleExport('pdf')}
                  className="p-1 hover:bg-gray-600 rounded"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button className="text-sm text-primary-500 hover:text-primary-400">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}