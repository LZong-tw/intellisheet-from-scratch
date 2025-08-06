import { useState } from 'react'
import { GitBranch, Play, Pause, Plus, Settings, Clock, CheckCircle, AlertCircle } from 'lucide-react'
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

export default function Workflows() {
  const [workflows] = useState(mockWorkflows)
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflow Automation</h2>
          <p className="text-gray-400">Visual workflow builder with drag-and-drop interface</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </button>
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
              <button className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium">
                {workflow.status === 'active' ? 'Pause' : 'Activate'}
              </button>
              <button className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded">
                <Settings className="w-4 h-4" />
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
        <h3 className="text-lg font-semibold mb-4">Workflow Builder Preview</h3>
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-6">
              Visual workflow builder with drag-and-drop nodes for triggers, conditions, and actions.
              Connect spreadsheet events to automated workflows with no code required.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-sm">Triggers</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                  <GitBranch className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-sm">Conditions</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                  <Play className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-sm">Actions</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}