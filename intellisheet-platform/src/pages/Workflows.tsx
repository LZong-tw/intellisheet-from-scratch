import { useState } from 'react'
import { GitBranch, Play, Pause, Plus, Settings, Clock, CheckCircle, AlertCircle, X, Mail, Database, Filter, Calendar, Webhook, ArrowRight, Zap, Activity, ChevronLeft, Save, TestTube } from 'lucide-react'
import { motion } from 'framer-motion'

interface Workflow {
  id: string
  name: string
  description: string
  trigger: string
  status: 'active' | 'paused' | 'draft'
  lastRun: string
  runs: number
  successRate: number
}

interface WorkflowNode {
  id: string
  name: string
  type: string
  icon: any
  position: { x: number; y: number }
  config?: any
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'New Employee Onboarding',
    description: 'Automatically create accounts and assign permissions',
    trigger: 'On new employee record',
    status: 'active',
    lastRun: '2 hours ago',
    runs: 156,
    successRate: 98,
  },
  {
    id: '2',
    name: 'Monthly Report Generation',
    description: 'Generate and distribute monthly performance reports',
    trigger: 'Every month on 1st',
    status: 'active',
    lastRun: '5 days ago',
    runs: 24,
    successRate: 100,
  },
  {
    id: '3',
    name: 'Data Backup Workflow',
    description: 'Backup critical spreadsheets to cloud storage',
    trigger: 'Every day at 2 AM',
    status: 'paused',
    lastRun: '1 week ago',
    runs: 365,
    successRate: 99.5,
  },
]

const nodeTypes = {
  triggers: {
    name: 'Triggers',
    color: 'blue',
    nodes: [
      { id: 'row_created', name: 'Row Created', icon: Plus },
      { id: 'field_changed', name: 'Field Changed', icon: Database },
      { id: 'schedule', name: 'Schedule', icon: Clock },
      { id: 'webhook', name: 'Webhook', icon: Webhook },
    ]
  },
  conditions: {
    name: 'Conditions',
    color: 'yellow',
    nodes: [
      { id: 'if_else', name: 'If/Else', icon: GitBranch },
      { id: 'filter', name: 'Filter Rows', icon: Filter },
    ]
  },
  actions: {
    name: 'Actions',
    color: 'green',
    nodes: [
      { id: 'send_email', name: 'Send Email', icon: Mail },
      { id: 'update_row', name: 'Update Row', icon: Database },
      { id: 'create_row', name: 'Create Row', icon: Plus },
      { id: 'webhook_action', name: 'Call Webhook', icon: Webhook },
    ]
  }
}

export default function Workflows() {
  const [workflows, setWorkflows] = useState(mockWorkflows)
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [currentNodes, setCurrentNodes] = useState<WorkflowNode[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [draggedNode, setDraggedNode] = useState<any>(null)
  const [workflowName, setWorkflowName] = useState('New Workflow')
  const [testMode, setTestMode] = useState(false)

  const handleNodeDragStart = (node: any) => {
    setDraggedNode(node)
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedNode) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - 75 // Center the node
    const y = e.clientY - rect.top - 30

    const newNode: WorkflowNode = {
      id: `${draggedNode.id}_${Date.now()}`,
      name: draggedNode.name,
      type: draggedNode.id,
      icon: draggedNode.icon,
      position: { x, y }
    }

    setCurrentNodes([...currentNodes, newNode])
    setDraggedNode(null)
  }

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeNode = (nodeId: string) => {
    setCurrentNodes(currentNodes.filter(node => node.id !== nodeId))
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }

  const handleWorkflowAction = (workflowId: string, action: 'pause' | 'activate' | 'delete') => {
    if (action === 'delete') {
      setWorkflows(workflows.filter(w => w.id !== workflowId))
    } else {
      setWorkflows(workflows.map(w => {
        if (w.id === workflowId) {
          return {
            ...w,
            status: action === 'pause' ? 'paused' : 'active'
          }
        }
        return w
      }))
    }
  }

  const saveWorkflow = () => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: workflowName,
      description: 'Workflow created with visual builder',
      trigger: currentNodes.find(n => ['row_created', 'field_changed', 'schedule', 'webhook'].includes(n.type))?.name || 'Manual',
      status: 'draft',
      lastRun: 'Never',
      runs: 0,
      successRate: 0
    }
    setWorkflows([...workflows, newWorkflow])
    setShowBuilder(false)
    alert('Workflow saved successfully!')
  }

  const testWorkflow = () => {
    setTestMode(true)
    setTimeout(() => {
      setTestMode(false)
      alert('Workflow test completed successfully!')
    }, 3000)
  }

  if (showBuilder) {
    return (
      <div className="h-screen flex">
        {/* Node Palette */}
        <div className="w-64 bg-gray-800 p-4 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Workflow Builder</h3>
            <button
              onClick={() => setShowBuilder(false)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg"
            placeholder="Workflow name"
          />

          {Object.entries(nodeTypes).map(([key, category]) => (
            <div key={key}>
              <h4 className="text-sm font-medium text-gray-400 mb-3">{category.name}</h4>
              <div className="space-y-2">
                {category.nodes.map((node) => {
                  const Icon = node.icon
                  return (
                    <div
                      key={node.id}
                      draggable
                      onDragStart={() => handleNodeDragStart(node)}
                      className="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-move transition-colors"
                    >
                      <div className={`w-8 h-8 bg-${category.color}-500/20 rounded flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 text-${category.color}-500`} />
                      </div>
                      <span className="text-sm">{node.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="pt-4 space-y-2">
            <button
              onClick={testWorkflow}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              Test Workflow
            </button>
            <button
              onClick={saveWorkflow}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Workflow
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex">
          <div
            className="flex-1 bg-gray-900 relative overflow-auto"
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
          >
            {currentNodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">Drag nodes here to start building your workflow</p>
                </div>
              </div>
            )}

            {/* Connection lines */}
            {currentNodes.length > 1 && (
              <svg className="absolute inset-0 pointer-events-none">
                {currentNodes.map((node, index) => {
                  if (index === 0) return null
                  const prevNode = currentNodes[index - 1]
                  return (
                    <line
                      key={node.id}
                      x1={prevNode.position.x + 75}
                      y1={prevNode.position.y + 40}
                      x2={node.position.x + 75}
                      y2={node.position.y + 40}
                      stroke="#475569"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  )
                })}
              </svg>
            )}

            {/* Nodes */}
            {currentNodes.map((node) => {
              const Icon = node.icon
              const category = Object.values(nodeTypes).find(cat =>
                cat.nodes.some(n => n.id === node.type)
              )
              
              return (
                <div
                  key={node.id}
                  className={`absolute bg-gray-800 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    selectedNode?.id === node.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700'
                  } ${testMode ? 'animate-pulse' : ''}`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    width: '150px'
                  }}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center bg-${category?.color}-500/20`}>
                      <Icon className={`w-4 h-4 text-${category?.color}-500`} />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNode(node.id)
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-medium">{node.name}</p>
                </div>
              )
            })}
          </div>

          {/* Node Configuration */}
          {selectedNode && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Configure: {selectedNode.name}</h3>
              
              <div className="space-y-4">
                {selectedNode.type === 'row_created' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Table</label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg">
                      <option>Employees</option>
                      <option>Customers</option>
                      <option>Orders</option>
                    </select>
                  </div>
                )}

                {selectedNode.type === 'field_changed' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Table</label>
                      <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg">
                        <option>Orders</option>
                        <option>Invoices</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Field to Watch</label>
                      <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg">
                        <option>Status</option>
                        <option>Amount</option>
                        <option>Priority</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedNode.type === 'schedule' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Schedule</label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg">
                      <option>Every hour</option>
                      <option>Every day at 9 AM</option>
                      <option>Every Monday</option>
                      <option>Custom cron</option>
                    </select>
                  </div>
                )}

                {selectedNode.type === 'send_email' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">To</label>
                      <input type="email" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Subject</label>
                      <input type="text" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg" placeholder="Email subject" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Body</label>
                      <textarea className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg" rows={4} placeholder="Email body..." />
                    </div>
                  </>
                )}

                {selectedNode.type === 'if_else' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Condition</label>
                    <div className="space-y-2">
                      <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg">
                        <option>Status</option>
                        <option>Amount</option>
                        <option>Priority</option>
                      </select>
                      <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg">
                        <option>equals</option>
                        <option>not equals</option>
                        <option>greater than</option>
                        <option>less than</option>
                      </select>
                      <input type="text" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg" placeholder="Value" />
                    </div>
                  </div>
                )}

                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Apply Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflow Automation</h2>
          <p className="text-gray-400">Visual workflow builder with drag-and-drop interface</p>
        </div>
        <button 
          onClick={() => setShowBuilder(true)}
          className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold">{workflows.filter(w => w.status === 'active').length}</span>
          </div>
          <p className="text-sm text-gray-400">Active Workflows</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6 text-green-500" />
            <span className="text-xl font-bold">2,104</span>
          </div>
          <p className="text-sm text-gray-400">Total Executions</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-xl font-bold">98.5%</span>
          </div>
          <p className="text-sm text-gray-400">Success Rate</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-bold">1.2s</span>
          </div>
          <p className="text-sm text-gray-400">Avg. Execution Time</p>
        </div>
      </div>

      {/* Workflow List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750"
            onClick={() => setSelectedWorkflow(workflow.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <GitBranch className="w-5 h-5 mr-3 text-primary-500" />
                <div>
                  <h3 className="font-semibold">{workflow.name}</h3>
                  <p className="text-sm text-gray-400">{workflow.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {workflow.status === 'active' ? (
                  <span className="flex items-center text-green-500 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </span>
                ) : workflow.status === 'paused' ? (
                  <span className="flex items-center text-yellow-500 text-sm">
                    <Pause className="w-4 h-4 mr-1" />
                    Paused
                  </span>
                ) : (
                  <span className="flex items-center text-gray-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Draft
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>Trigger: {workflow.trigger}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Play className="w-4 h-4 mr-2" />
                <span>Last run: {workflow.lastRun}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
              <div>
                <span className="text-gray-400">Total runs:</span>
                <span className="ml-1 font-medium">{workflow.runs}</span>
              </div>
              <div>
                <span className="text-gray-400">Success rate:</span>
                <span className="ml-1 font-medium text-green-500">{workflow.successRate}%</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleWorkflowAction(workflow.id, workflow.status === 'active' ? 'pause' : 'activate')
                }}
                className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium"
              >
                {workflow.status === 'active' ? 'Pause' : 'Activate'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowBuilder(true)
                }}
                className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Delete this workflow?')) {
                    handleWorkflowAction(workflow.id, 'delete')
                  }
                }}
                className="p-1.5 bg-gray-700 hover:bg-red-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visual Workflow Builder Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Workflow Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="font-medium mb-1">Email Notification</h4>
            <p className="text-sm text-gray-400">Send email when specific conditions are met</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
              <Database className="w-6 h-6 text-green-500" />
            </div>
            <h4 className="font-medium mb-1">Data Sync</h4>
            <p className="text-sm text-gray-400">Sync data between spreadsheets automatically</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
              <Webhook className="w-6 h-6 text-purple-500" />
            </div>
            <h4 className="font-medium mb-1">API Integration</h4>
            <p className="text-sm text-gray-400">Connect to external services via webhooks</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}