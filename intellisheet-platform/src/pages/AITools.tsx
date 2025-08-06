import { Sparkles, Brain, Zap, AlertTriangle, TrendingUp, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const aiFeatures = [
  {
    icon: Brain,
    title: 'Smart Predictions',
    description: 'AI-powered predictions based on historical data patterns',
    status: 'active',
    accuracy: '94%',
  },
  {
    icon: AlertTriangle,
    title: 'Anomaly Detection',
    description: 'Automatically detect outliers and unusual patterns',
    status: 'active',
    accuracy: '89%',
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis',
    description: 'Identify trends and forecast future values',
    status: 'beta',
    accuracy: '87%',
  },
  {
    icon: Search,
    title: 'Natural Language Query',
    description: 'Ask questions about your data in plain English',
    status: 'coming soon',
    accuracy: 'N/A',
  },
]

export default function AITools() {
  const [selectedFeature, setSelectedFeature] = useState(0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Sparkles className="w-8 h-8 mr-3 text-purple-500" />
            AI Assistant
          </h2>
          <p className="text-gray-400">Machine learning for insights, predictions, and anomaly detection</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">AI Model:</span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">
            IntelliSheet ML v2.0
          </span>
        </div>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all ${
              selectedFeature === index ? 'ring-2 ring-purple-500' : ''
            }`}
            onClick={() => setSelectedFeature(index)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                  <feature.icon className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${
                feature.status === 'active' ? 'bg-green-500/20 text-green-400' :
                feature.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {feature.status}
              </span>
              {feature.accuracy !== 'N/A' && (
                <span className="text-sm text-gray-400">
                  Accuracy: <span className="text-white font-medium">{feature.accuracy}</span>
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights Demo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Live AI Insights
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Anomaly Detected</span>
              <span className="text-xs text-yellow-400">2 mins ago</span>
            </div>
            <p className="text-sm text-gray-400">
              Unusual spike in sales data for Product SKU-1234. 300% increase compared to historical average.
            </p>
            <button className="mt-2 text-sm text-purple-400 hover:text-purple-300">
              Investigate →
            </button>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Trend Prediction</span>
              <span className="text-xs text-green-400">15 mins ago</span>
            </div>
            <p className="text-sm text-gray-400">
              Based on current patterns, Q4 revenue is projected to increase by 23% with 85% confidence.
            </p>
            <button className="mt-2 text-sm text-purple-400 hover:text-purple-300">
              View Details →
            </button>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Data Quality Alert</span>
              <span className="text-xs text-orange-400">1 hour ago</span>
            </div>
            <p className="text-sm text-gray-400">
              Missing data detected in 5% of employee records. AI suggests data imputation strategy.
            </p>
            <button className="mt-2 text-sm text-purple-400 hover:text-purple-300">
              Fix Now →
            </button>
          </div>
        </div>
      </motion.div>

      {/* Natural Language Query Demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Natural Language Query (Beta)</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Ask anything about your data..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
          />
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-gray-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-600">
              "Show me top performing employees"
            </span>
            <span className="text-xs bg-gray-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-600">
              "What's our monthly growth rate?"
            </span>
            <span className="text-xs bg-gray-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-600">
              "Find all overdue tasks"
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}