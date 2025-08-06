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
} from 'lucide-react'
import { motion } from 'framer-motion'

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
  { id: 1, action: 'Sheet updated', user: 'John Doe', time: '2 mins ago', icon: FileText },
  { id: 2, action: 'Permission rule created', user: 'Admin', time: '15 mins ago', icon: Shield },
  { id: 3, action: 'Workflow executed', user: 'System', time: '1 hour ago', icon: GitBranch },
  { id: 4, action: 'Report generated', user: 'Jane Smith', time: '3 hours ago', icon: BarChart3 },
]

const systemStatus = [
  { name: 'API Response Time', value: '45ms', status: 'good' },
  { name: 'Database Load', value: '23%', status: 'good' },
  { name: 'Active Users', value: '142', status: 'good' },
  { name: 'Error Rate', value: '0.02%', status: 'warning' },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-2">Welcome to IntelliSheet 2.0</h2>
        <p className="text-lg opacity-90 mb-4">
          The next-generation spreadsheet platform that combines Excel-like simplicity with enterprise-grade permissions
        </p>
        <div className="flex gap-4">
          <Link
            to="/spreadsheet/new"
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium"
          >
            Create New Sheet
          </Link>
          <Link
            to="/workflows"
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium"
          >
            View Workflows
          </Link>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={feature.href}
              className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all hover:scale-105"
            >
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
            </Link>
          </motion.div>
        ))}
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
                  {item.status === 'good' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-400">by {activity.user}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
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
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">142</p>
          <p className="text-sm text-gray-400">Active Users</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-sm text-gray-400">Total Sheets</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold">89%</p>
          <p className="text-sm text-gray-400">Efficiency Gain</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold">99.9%</p>
          <p className="text-sm text-gray-400">Uptime</p>
        </div>
      </motion.div>
    </div>
  )
}