import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, FileText, Bot, Zap, BarChart3, Shield, Database, Target, Lightbulb, Wand2, Eye, MessageSquare, Code, Calendar, Users, Globe, ArrowRight, ChevronRight, Play } from 'lucide-react';

const AIFeatures = () => {
  // State
  const [activeFeature, setActiveFeature] = useState('insights');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [automationSuggestions, setAutomationSuggestions] = useState([]);

  // Simulate AI analysis
  useEffect(() => {
    generateInsights();
    detectAnomalies();
    generatePredictions();
    generateSuggestions();
  }, []);

  const generateInsights = () => {
    setLoading(true);
    setTimeout(() => {
      setInsights([
        {
          id: 1,
          type: 'trend',
          title: 'Sales Growth Acceleration',
          description: 'Sales velocity increased by 32% in the last 30 days compared to the previous period',
          impact: 'high',
          confidence: 92,
          actions: ['View detailed report', 'Set up alerts', 'Share with team']
        },
        {
          id: 2,
          type: 'pattern',
          title: 'Customer Churn Pattern Detected',
          description: 'Customers with support tickets > 3 in first month have 65% higher churn rate',
          impact: 'medium',
          confidence: 87,
          actions: ['Create workflow', 'Analyze cohort', 'Implement retention strategy']
        },
        {
          id: 3,
          type: 'optimization',
          title: 'Workflow Optimization Opportunity',
          description: 'Invoice approval workflow can be reduced from 5 to 3 steps without compromising compliance',
          impact: 'medium',
          confidence: 78,
          actions: ['Review workflow', 'Simulate changes', 'Apply optimization']
        },
        {
          id: 4,
          type: 'forecast',
          title: 'Resource Constraint Predicted',
          description: 'Based on current growth, you\'ll need 2 additional team members by Q3',
          impact: 'high',
          confidence: 85,
          actions: ['View forecast', 'Plan hiring', 'Adjust capacity']
        }
      ]);
      setLoading(false);
    }, 1500);
  };

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
      },
      {
        id: 3,
        severity: 'low',
        field: 'Customer Age',
        record: 'CUST-1234',
        value: '150',
        expected: '18-100',
        deviation: '50%',
        detected: '1 day ago'
      }
    ]);
  };

  const generatePredictions = () => {
    setPredictions([
      {
        id: 1,
        metric: 'Monthly Revenue',
        current: '$125,000',
        predicted: '$142,000',
        change: '+13.6%',
        confidence: 88,
        timeframe: 'Next 30 days'
      },
      {
        id: 2,
        metric: 'Support Tickets',
        current: '245',
        predicted: '312',
        change: '+27.3%',
        confidence: 76,
        timeframe: 'Next week'
      },
      {
        id: 3,
        metric: 'Customer Acquisition',
        current: '89',
        predicted: '104',
        change: '+16.8%',
        confidence: 82,
        timeframe: 'Next month'
      }
    ]);
  };

  const generateSuggestions = () => {
    setSuggestions([
      {
        id: 1,
        type: 'schema',
        title: 'Add Customer Lifetime Value Field',
        description: 'Based on your data patterns, adding a CLV calculation would provide valuable insights',
        effort: 'low',
        impact: 'high'
      },
      {
        id: 2,
        type: 'automation',
        title: 'Automate Follow-up Emails',
        description: '73% of your follow-ups follow a predictable pattern that can be automated',
        effort: 'medium',
        impact: 'high'
      },
      {
        id: 3,
        type: 'permission',
        title: 'Refine Access Controls',
        description: 'Current permissions are broader than necessary for 3 roles',
        effort: 'low',
        impact: 'medium'
      }
    ]);

    setAutomationSuggestions([
      {
        id: 1,
        name: 'Smart Lead Scoring',
        description: 'Automatically score and prioritize leads based on engagement patterns',
        accuracy: 92,
        timeSaved: '5 hours/week',
        status: 'ready'
      },
      {
        id: 2,
        name: 'Intelligent Task Assignment',
        description: 'Route tasks to team members based on workload and expertise',
        accuracy: 87,
        timeSaved: '3 hours/week',
        status: 'ready'
      },
      {
        id: 3,
        name: 'Predictive Inventory Reorder',
        description: 'Predict and automate reorder points based on historical patterns',
        accuracy: 94,
        timeSaved: '8 hours/week',
        status: 'beta'
      }
    ]);
  };

  // Feature cards configuration
  const features = [
    {
      id: 'insights',
      name: 'Smart Insights',
      icon: Lightbulb,
      color: 'blue',
      description: 'AI-generated insights from your data patterns'
    },
    {
      id: 'anomalies',
      name: 'Anomaly Detection',
      icon: AlertTriangle,
      color: 'orange',
      description: 'Identify unusual patterns and outliers'
    },
    {
      id: 'predictions',
      name: 'Predictive Analytics',
      icon: TrendingUp,
      color: 'green',
      description: 'Forecast trends and future values'
    },
    {
      id: 'suggestions',
      name: 'AI Suggestions',
      icon: Wand2,
      color: 'purple',
      description: 'Intelligent recommendations for optimization'
    },
    {
      id: 'nlp',
      name: 'Natural Language',
      icon: MessageSquare,
      color: 'indigo',
      description: 'Query your data using natural language'
    },
    {
      id: 'automation',
      name: 'Smart Automation',
      icon: Bot,
      color: 'pink',
      description: 'AI-powered workflow automation'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[color] || colors.blue;
  };

  const renderContent = () => {
    switch (activeFeature) {
      case 'insights':
        return (
          <div className="space-y-4">
            {insights.map(insight => (
              <div key={insight.id} className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      insight.type === 'trend' ? 'bg-green-100' :
                      insight.type === 'pattern' ? 'bg-blue-100' :
                      insight.type === 'optimization' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      {insight.type === 'trend' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                       insight.type === 'pattern' ? <BarChart3 className="w-5 h-5 text-blue-600" /> :
                       insight.type === 'optimization' ? <Zap className="w-5 h-5 text-purple-600" /> :
                       <Target className="w-5 h-5 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{insight.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                          insight.impact === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {insight.impact} impact
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600">{insight.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {insight.actions.map((action, index) => (
                    <button key={index} className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'anomalies':
        return (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Severity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Field</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Record</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actual Value</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Expected Range</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Deviation</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Detected</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {anomalies.map(anomaly => (
                  <tr key={anomaly.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        anomaly.severity === 'high' ? 'bg-red-100 text-red-700' :
                        anomaly.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {anomaly.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{anomaly.field}</td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{anomaly.record}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{anomaly.value}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{anomaly.expected}</td>
                    <td className="px-6 py-4 text-sm font-medium text-red-600">{anomaly.deviation}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{anomaly.detected}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'predictions':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predictions.map(prediction => (
              <div key={prediction.id} className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{prediction.metric}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Current</span>
                    <span className="text-lg font-semibold text-slate-900">{prediction.current}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Predicted</span>
                    <span className="text-lg font-semibold text-blue-600">{prediction.predicted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Change</span>
                    <span className={`text-lg font-semibold ${
                      prediction.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {prediction.change}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">Confidence</span>
                      <span className="text-xs font-medium text-slate-900">{prediction.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Timeframe: {prediction.timeframe}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'suggestions':
        return (
          <div className="space-y-4">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{suggestion.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        suggestion.type === 'schema' ? 'bg-blue-100 text-blue-700' :
                        suggestion.type === 'automation' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {suggestion.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{suggestion.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500">
                        Effort: <span className={`font-medium ${
                          suggestion.effort === 'low' ? 'text-green-600' :
                          suggestion.effort === 'medium' ? 'text-amber-600' :
                          'text-red-600'
                        }`}>{suggestion.effort}</span>
                      </span>
                      <span className="text-sm text-slate-500">
                        Impact: <span className={`font-medium ${
                          suggestion.impact === 'high' ? 'text-green-600' :
                          suggestion.impact === 'medium' ? 'text-amber-600' :
                          'text-red-600'
                        }`}>{suggestion.impact}</span>
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    Apply <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'nlp':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">Natural Language Query</h3>
              <p className="text-slate-600 mb-8 text-center">Ask questions about your data in plain English</p>
              
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="e.g., Show me all customers who made purchases over $1000 last month"
                  className="w-full px-6 py-4 pr-12 border border-slate-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Example Queries:</h4>
                {[
                  'What were our top 5 products by revenue last quarter?',
                  'Show me all pending tasks assigned to the sales team',
                  'Which customers haven\'t made a purchase in 90 days?',
                  'Calculate the average processing time for support tickets this month'
                ].map((query, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'automation':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">AI-Powered Automation</h3>
              <p className="text-purple-700">Intelligent workflows that learn and adapt from your data patterns</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {automationSuggestions.map(automation => (
                <div key={automation.id} className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Bot className="w-8 h-8 text-purple-600" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      automation.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {automation.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{automation.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{automation.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Accuracy</span>
                      <span className="font-medium text-slate-900">{automation.accuracy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Time Saved</span>
                      <span className="font-medium text-green-600">{automation.timeSaved}</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Enable
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-10 h-10" />
              <h1 className="text-3xl font-bold">AI-Powered Features</h1>
            </div>
            <p className="text-purple-100">Intelligent automation and insights powered by machine learning</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold mb-1">98.5%</div>
            <div className="text-purple-100 text-sm">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {features.map(feature => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`p-4 bg-white rounded-lg border-2 transition-all ${
                activeFeature === feature.id 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto ${getColorClasses(feature.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">{feature.name}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{feature.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          renderContent()
        )}
      </div>

      {/* AI Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-slate-900">1,247</span>
          </div>
          <p className="text-sm text-slate-600">AI Actions Today</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-slate-900">94%</span>
          </div>
          <p className="text-sm text-slate-600">Prediction Accuracy</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-slate-900">42hrs</span>
          </div>
          <p className="text-sm text-slate-600">Time Saved This Week</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">156</span>
          </div>
          <p className="text-sm text-slate-600">Anomalies Prevented</p>
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;