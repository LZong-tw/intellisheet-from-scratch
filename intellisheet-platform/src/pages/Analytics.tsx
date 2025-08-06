import { BarChart3, TrendingUp, Users, FileText, ArrowUp, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-gray-400">Real-time insights and predictive analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{metric.label}</span>
              {metric.trend === 'up' ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{metric.value}</span>
              <span className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change}
              </span>
            </div>
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
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Performance Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
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
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-500" />
            Usage by Department
          </h3>
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
              <div key={dept.name} className="flex items-center">
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
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
          Weekly Activity Heatmap
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center">
              <p className="text-xs text-gray-400 mb-2">{day}</p>
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${Math.random() * 0.8 + 0.2})`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-purple-500" />
          Recent Reports
        </h3>
        <div className="space-y-3">
          {['Monthly Performance Summary', 'User Activity Report', 'System Health Check', 'Permission Audit Log'].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-3 text-gray-400" />
                <span>{report}</span>
              </div>
              <button className="text-sm text-primary-500 hover:text-primary-400">
                View
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}