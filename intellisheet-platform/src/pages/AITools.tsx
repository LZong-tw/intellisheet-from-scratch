import { Sparkles, Brain, Zap, AlertTriangle, TrendingUp, Search, RefreshCw, Play, ChevronRight, Target, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

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
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<any[]>([])
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [automationTasks, setAutomationTasks] = useState<any[]>([])
  const [queryInput, setQueryInput] = useState('')
  const [aiStats, setAiStats] = useState({
    actionsToday: 1247,
    accuracy: 94,
    timeSaved: 42,
    anomaliesPrevented: 156
  })

  // Generate AI insights on mount
  useEffect(() => {
    generateInsights()
    detectAnomalies()
    generateAutomationTasks()
  }, [])

  const generateInsights = () => {
    setLoading(true)
    setTimeout(() => {
      setInsights([
        {
          id: 1,
          type: 'trend',
          title: 'Sales Growth Acceleration',
          description: 'Sales velocity increased by 32% in the last 30 days compared to the previous period',
          impact: 'high',
          confidence: 92,
          timestamp: '2 mins ago'
        },
        {
          id: 2,
          type: 'pattern',
          title: 'Customer Churn Pattern Detected',
          description: 'Customers with support tickets > 3 in first month have 65% higher churn rate',
          impact: 'medium',
          confidence: 87,
          timestamp: '15 mins ago'
        },
        {
          id: 3,
          type: 'optimization',
          title: 'Workflow Optimization Opportunity',
          description: 'Invoice approval workflow can be reduced from 5 to 3 steps without compromising compliance',
          impact: 'medium',
          confidence: 78,
          timestamp: '1 hour ago'
        }
      ])
      setLoading(false)
    }, 1500)
  }

  const detectAnomalies = () => {
    setAnomalies([
      {
        id: 1,
        severity: 'high',
        field: 'Order Amount',
        record: 'ORD-2451',
        value: '$45,230',
        expected: '$2,000-5,000',
        deviation: '900%',
        detected: '2 hours ago'
      },
      {
        id: 2,
        severity: 'medium',
        field: 'Processing Time',
        record: 'TASK-8923',
        value: '72 hours',
        expected: '4-8 hours',
        deviation: '800%',
        detected: '5 hours ago'
      }
    ])
  }

  const generateAutomationTasks = () => {
    setAutomationTasks([
      {
        id: 1,
        name: 'Auto-categorize Expenses',
        description: 'Automatically categorize expense reports based on historical patterns',
        accuracy: 96,
        timeSaved: '3 hrs/week',
        status: 'ready'
      },
      {
        id: 2,
        name: 'Smart Data Validation',
        description: 'Validate data entries in real-time using ML patterns',
        accuracy: 92,
        timeSaved: '5 hrs/week',
        status: 'ready'
      },
      {
        id: 3,
        name: 'Predictive Scheduling',
        description: 'Optimize team schedules based on workload predictions',
        accuracy: 88,
        timeSaved: '8 hrs/week',
        status: 'training'
      }
    ])
  }

  const handleRefresh = () => {
    generateInsights()
    // Increment stats
    setAiStats(prev => ({
      ...prev,
      actionsToday: prev.actionsToday + Math.floor(Math.random() * 10),
      anomaliesPrevented: prev.anomaliesPrevented + Math.floor(Math.random() * 3)
    }))
  }

  const handleInvestigate = (id: number) => {
    console.log('Investigating insight:', id)
    // In a real app, this would navigate to detailed view
    alert('Opening detailed investigation view...')
  }

  const handleApplyInsight = (id: number) => {
    console.log('Applying insight:', id)
    alert('Applying recommended changes...')
  }

  const handleEnableAutomation = (id: number) => {
    console.log('Enabling automation:', id)
    const task = automationTasks.find(t => t.id === id)
    if (task) {
      alert(`Enabling "${task.name}" automation...`)
    }
  }

  const handleNLQuery = () => {
    if (queryInput.trim()) {
      console.log('Processing query:', queryInput)
      alert(`Processing: "${queryInput}"\n\nIn a real implementation, this would query your data and return results.`)
    }
  }

  const handleExampleQuery = (query: string) => {
    setQueryInput(query)
    setTimeout(() => handleNLQuery(), 100)
  }

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
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title="Refresh insights"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-sm text-gray-400">AI Model:</span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">
            IntelliSheet ML v2.0
          </span>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="text-xl font-bold">{aiStats.actionsToday.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-400">AI Actions Today</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-green-500" />
            <span className="text-xl font-bold">{aiStats.accuracy}%</span>
          </div>
          <p className="text-sm text-gray-400">Prediction Accuracy</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-bold">{aiStats.timeSaved}hrs</span>
          </div>
          <p className="text-sm text-gray-400">Time Saved This Week</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold">{aiStats.anomaliesPrevented}</span>
          </div>
          <p className="text-sm text-gray-400">Anomalies Prevented</p>
        </motion.div>
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{insight.title}</span>
                  <span className="text-xs text-gray-400">{insight.timestamp}</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                      insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {insight.impact} impact
                    </span>
                    <span className="text-xs text-gray-500">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleInvestigate(insight.id)}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Investigate →
                    </button>
                    <button 
                      onClick={() => handleApplyInsight(insight.id)}
                      className="px-3 py-1 text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Anomalies */}
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                Detected Anomalies
              </h4>
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="bg-gray-700/50 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${
                      anomaly.severity === 'high' ? 'text-red-400' :
                      anomaly.severity === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {anomaly.field} Anomaly
                    </span>
                    <span className="text-xs text-gray-400">{anomaly.detected}</span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Record: {anomaly.record}</p>
                    <p>Value: <span className="text-white">{anomaly.value}</span> (Expected: {anomaly.expected})</p>
                    <p>Deviation: <span className="text-orange-400">{anomaly.deviation}</span></p>
                  </div>
                  <button 
                    onClick={() => handleInvestigate(anomaly.id)}
                    className="mt-2 text-sm text-purple-400 hover:text-purple-300"
                  >
                    Review Details →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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
          <div className="relative">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNLQuery()}
              placeholder="Ask anything about your data..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleNLQuery}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span 
              onClick={() => handleExampleQuery("Show me top performing employees")}
              className="text-xs bg-gray-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-600"
            >
              "Show me top performing employees"
            </span>
            <span 
              onClick={() => handleExampleQuery("What's our monthly growth rate?")}
              className="text-xs bg-gray-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-600"
            >
              "What's our monthly growth rate?"
            </span>
            <span 
              onClick={() => handleExampleQuery("Find all overdue tasks")}
              className="text-xs bg-gray-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-600"
            >
              "Find all overdue tasks"
            </span>
            <span 
              onClick={() => handleExampleQuery("Which customers haven't made a purchase in 90 days?")}
              className="text-xs bg-gray-700 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-600"
            >
              "Which customers haven't made a purchase in 90 days?"
            </span>
          </div>
        </div>
      </motion.div>

      {/* AI-Powered Automation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-500" />
          AI-Powered Automation
        </h3>
        <p className="text-gray-400 text-sm mb-6">Intelligent workflows that learn and adapt from your data patterns</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {automationTasks.map((task) => (
            <div key={task.id} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Brain className="w-6 h-6 text-purple-500" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.status === 'ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {task.status}
                </span>
              </div>
              <h4 className="font-semibold mb-2">{task.name}</h4>
              <p className="text-sm text-gray-400 mb-3">{task.description}</p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Accuracy</span>
                  <span className="text-white">{task.accuracy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time Saved</span>
                  <span className="text-green-400">{task.timeSaved}</span>
                </div>
              </div>
              <button 
                onClick={() => handleEnableAutomation(task.id)}
                className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                Enable
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}