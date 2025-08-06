import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Play, Pause, Plus, Trash2, Settings, Zap, Mail, Database, Webhook, Clock, Filter, GitBranch, CheckCircle, XCircle, AlertCircle, Activity, Copy, Save, TestTube, Calendar, User, FileText, Bot, Globe, Shield, ArrowRight, Code, Eye } from 'lucide-react';

// Workflow Node Types
const nodeTypes = {
  trigger: {
    icon: Zap,
    color: 'green',
    category: 'Triggers',
    nodes: [
      { id: 'row_created', name: 'Row Created', icon: Plus, description: 'When a new row is added' },
      { id: 'row_updated', name: 'Row Updated', icon: Database, description: 'When a row is modified' },
      { id: 'field_changed', name: 'Field Changed', icon: Settings, description: 'When specific field changes' },
      { id: 'schedule', name: 'Schedule', icon: Clock, description: 'Run at specific times' },
      { id: 'webhook', name: 'Webhook', icon: Webhook, description: 'External webhook trigger' },
      { id: 'form_submitted', name: 'Form Submitted', icon: FileText, description: 'When form is submitted' }
    ]
  },
  condition: {
    icon: GitBranch,
    color: 'yellow',
    category: 'Conditions',
    nodes: [
      { id: 'if_else', name: 'If/Else', icon: GitBranch, description: 'Conditional branching' },
      { id: 'filter', name: 'Filter', icon: Filter, description: 'Filter data based on criteria' },
      { id: 'switch', name: 'Switch', icon: GitBranch, description: 'Multiple condition paths' },
      { id: 'approval', name: 'Approval', icon: CheckCircle, description: 'Require approval to continue' }
    ]
  },
  action: {
    icon: Zap,
    color: 'blue',
    category: 'Actions',
    nodes: [
      { id: 'update_row', name: 'Update Row', icon: Database, description: 'Update row data' },
      { id: 'create_row', name: 'Create Row', icon: Plus, description: 'Create new row' },
      { id: 'delete_row', name: 'Delete Row', icon: Trash2, description: 'Delete row' },
      { id: 'send_email', name: 'Send Email', icon: Mail, description: 'Send email notification' },
      { id: 'http_request', name: 'HTTP Request', icon: Globe, description: 'Make API call' },
      { id: 'run_script', name: 'Run Script', icon: Code, description: 'Execute custom code' },
      { id: 'assign_user', name: 'Assign User', icon: User, description: 'Assign to team member' },
      { id: 'create_task', name: 'Create Task', icon: CheckCircle, description: 'Create task or ticket' }
    ]
  },
  integration: {
    icon: Globe,
    color: 'purple',
    category: 'Integrations',
    nodes: [
      { id: 'slack', name: 'Slack', icon: Bot, description: 'Send Slack message' },
      { id: 'teams', name: 'Teams', icon: Bot, description: 'Send Teams message' },
      { id: 'google_drive', name: 'Google Drive', icon: FileText, description: 'Create/update documents' },
      { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'Create calendar event' },
      { id: 'ai_assistant', name: 'AI Assistant', icon: Bot, description: 'AI-powered automation' }
    ]
  }
};

// Sample workflows
const sampleWorkflows = [
  {
    id: 1,
    name: 'New Employee Onboarding',
    description: 'Automate the onboarding process for new hires',
    status: 'active',
    lastRun: '2 hours ago',
    runs: 145,
    category: 'HR',
    nodes: 5,
    trigger: 'Row Created'
  },
  {
    id: 2,
    name: 'Invoice Approval Workflow',
    description: 'Route invoices for approval based on amount',
    status: 'active',
    lastRun: '30 minutes ago',
    runs: 892,
    category: 'Finance',
    nodes: 8,
    trigger: 'Field Changed'
  },
  {
    id: 3,
    name: 'Customer Support Escalation',
    description: 'Escalate tickets based on priority and SLA',
    status: 'testing',
    lastRun: '1 day ago',
    runs: 67,
    category: 'Support',
    nodes: 6,
    trigger: 'Schedule'
  },
  {
    id: 4,
    name: 'Inventory Reorder Alert',
    description: 'Alert when inventory falls below threshold',
    status: 'inactive',
    lastRun: 'Never',
    runs: 0,
    category: 'Operations',
    nodes: 4,
    trigger: 'Field Changed'
  }
];

const WorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState(sampleWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentNodes, setCurrentNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [testMode, setTestMode] = useState(false);
  const canvasRef = useRef(null);

  // Add node to workflow
  const addNode = useCallback((nodeType, node) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: nodeType,
      ...node,
      position: { x: 100 + currentNodes.length * 200, y: 200 },
      config: {}
    };
    setCurrentNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
  }, [currentNodes]);

  // Remove node from workflow
  const removeNode = useCallback((nodeId) => {
    setCurrentNodes(prev => prev.filter(n => n.id !== nodeId));
    setSelectedNode(null);
  }, []);

  // Run workflow test
  const testWorkflow = useCallback(() => {
    setTestMode(true);
    const log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'success',
      message: 'Test execution completed successfully',
      nodes: currentNodes.length,
      duration: '1.2s'
    };
    setExecutionLogs(prev => [log, ...prev].slice(0, 10));
    
    setTimeout(() => {
      setTestMode(false);
    }, 2000);
  }, [currentNodes]);

  // Save workflow
  const saveWorkflow = useCallback(() => {
    const workflow = {
      id: selectedWorkflow?.id || Date.now(),
      name: selectedWorkflow?.name || 'New Workflow',
      description: selectedWorkflow?.description || '',
      status: 'inactive',
      lastRun: 'Never',
      runs: 0,
      category: 'Custom',
      nodes: currentNodes.length,
      trigger: currentNodes[0]?.name || 'Manual'
    };
    
    if (selectedWorkflow) {
      setWorkflows(prev => prev.map(w => w.id === workflow.id ? workflow : w));
    } else {
      setWorkflows(prev => [...prev, workflow]);
    }
    
    setShowBuilder(false);
  }, [selectedWorkflow, currentNodes]);

  // Workflow Canvas Component
  const WorkflowCanvas = () => {
    return (
      <div className="relative h-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300" ref={canvasRef}>
        {currentNodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Start Building Your Workflow</h3>
              <p className="text-sm text-slate-500 mb-4">Drag and drop nodes from the sidebar to get started</p>
            </div>
          </div>
        ) : (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw connections between nodes */}
            {currentNodes.map((node, index) => {
              if (index === 0) return null;
              const prevNode = currentNodes[index - 1];
              return (
                <line
                  key={`connection_${index}`}
                  x1={prevNode.position.x + 150}
                  y1={prevNode.position.y + 40}
                  x2={node.position.x}
                  y2={node.position.y + 40}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>
        )}
        
        {/* Render nodes */}
        {currentNodes.map((node, index) => {
          const Icon = node.icon;
          const categoryColor = Object.values(nodeTypes).find(cat => 
            cat.nodes.some(n => n.id === node.id)
          )?.color || 'blue';
          
          return (
            <div
              key={node.id}
              className={`absolute bg-white rounded-lg border-2 p-4 cursor-move shadow-lg transition-all ${
                selectedNode?.id === node.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
              } ${testMode ? 'animate-pulse' : ''}`}
              style={{
                left: node.position.x,
                top: node.position.y,
                width: '150px'
              }}
              onClick={() => setSelectedNode(node)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${categoryColor}-100`}>
                  <Icon className={`w-4 h-4 text-${categoryColor}-600`} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNode(node.id);
                  }}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h4 className="text-sm font-medium text-slate-900">{node.name}</h4>
              {index === 0 && (
                <span className="text-xs text-green-600 font-medium">Trigger</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Node Configuration Panel
  const NodeConfig = () => {
    if (!selectedNode) return null;
    
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Configure: {selectedNode.name}</h3>
        
        <div className="space-y-4">
          {selectedNode.id === 'row_created' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Table</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  <option>Employees</option>
                  <option>Customers</option>
                  <option>Orders</option>
                </select>
              </div>
            </>
          )}
          
          {selectedNode.id === 'field_changed' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Table</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  <option>Orders</option>
                  <option>Invoices</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Field to Watch</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  <option>Status</option>
                  <option>Amount</option>
                  <option>Priority</option>
                </select>
              </div>
            </>
          )}
          
          {selectedNode.id === 'schedule' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Schedule</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                <option>Every hour</option>
                <option>Every day at 9 AM</option>
                <option>Every Monday</option>
                <option>Custom cron expression</option>
              </select>
            </div>
          )}
          
          {selectedNode.id === 'send_email' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Email subject" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Body</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg" rows="4" placeholder="Email body..."></textarea>
              </div>
            </>
          )}
          
          {selectedNode.id === 'if_else' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
              <div className="flex gap-2">
                <select className="flex-1 px-3 py-2 border border-slate-200 rounded-lg">
                  <option>Status</option>
                  <option>Amount</option>
                  <option>Priority</option>
                </select>
                <select className="flex-1 px-3 py-2 border border-slate-200 rounded-lg">
                  <option>equals</option>
                  <option>not equals</option>
                  <option>greater than</option>
                  <option>less than</option>
                </select>
                <input type="text" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg" placeholder="Value" />
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-slate-200">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Apply Configuration
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {!showBuilder ? (
        // Workflow List View
        <>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Workflow Automation</h1>
                <p className="text-slate-600 mt-1">Create powerful automations without code</p>
              </div>
              <button
                onClick={() => {
                  setSelectedWorkflow(null);
                  setCurrentNodes([]);
                  setShowBuilder(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Workflow
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">{workflows.filter(w => w.status === 'active').length}</span>
              </div>
              <p className="text-sm text-slate-600">Active Workflows</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-slate-900">2,104</span>
              </div>
              <p className="text-sm text-slate-600">Total Executions</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                <span className="text-2xl font-bold text-slate-900">98.5%</span>
              </div>
              <p className="text-sm text-slate-600">Success Rate</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-slate-900">1.2s</span>
              </div>
              <p className="text-sm text-slate-600">Avg. Execution Time</p>
            </div>
          </div>

          {/* Workflow List */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 rounded-lg font-medium ${activeCategory === 'all' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveCategory('active')}
                  className={`px-3 py-1 rounded-lg font-medium ${activeCategory === 'active' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveCategory('testing')}
                  className={`px-3 py-1 rounded-lg font-medium ${activeCategory === 'testing' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Testing
                </button>
                <button
                  onClick={() => setActiveCategory('inactive')}
                  className={`px-3 py-1 rounded-lg font-medium ${activeCategory === 'inactive' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Inactive
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-slate-200">
              {workflows.filter(w => activeCategory === 'all' || w.status === activeCategory).map(workflow => (
                <div key={workflow.id} className="px-6 py-4 hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{workflow.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          workflow.status === 'active' ? 'bg-green-100 text-green-700' :
                          workflow.status === 'testing' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {workflow.status}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                          {workflow.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{workflow.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Trigger: {workflow.trigger}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          {workflow.nodes} nodes
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {workflow.runs} runs
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last run: {workflow.lastRun}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {workflow.status === 'active' ? (
                        <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Pause">
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Activate">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedWorkflow(workflow);
                          setCurrentNodes([]);
                          setShowBuilder(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg" title="View Logs">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Workflow Builder View
        <div className="h-screen -m-6 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowBuilder(false)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <div>
                  <input
                    type="text"
                    defaultValue={selectedWorkflow?.name || 'New Workflow'}
                    className="text-xl font-bold text-slate-900 bg-transparent border-none focus:outline-none"
                  />
                  <input
                    type="text"
                    defaultValue={selectedWorkflow?.description || 'Add description...'}
                    className="text-sm text-slate-600 bg-transparent border-none focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={testWorkflow}
                  disabled={currentNodes.length === 0 || testMode}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-slate-300 flex items-center gap-2"
                >
                  <TestTube className="w-4 h-4" />
                  {testMode ? 'Testing...' : 'Test'}
                </button>
                <button
                  onClick={saveWorkflow}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Workflow Nodes</h3>
                
                {Object.entries(nodeTypes).map(([key, category]) => (
                  <div key={key} className="mb-6">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">{category.category}</h4>
                    <div className="space-y-2">
                      {category.nodes.map(node => {
                        const Icon = node.icon;
                        return (
                          <button
                            key={node.id}
                            onClick={() => addNode(key, node)}
                            className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition-colors group"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${category.color}-100 group-hover:bg-${category.color}-200`}>
                                <Icon className={`w-4 h-4 text-${category.color}-600`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">{node.name}</p>
                                <p className="text-xs text-slate-500">{node.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-6 bg-slate-100">
              <WorkflowCanvas />
            </div>

            {/* Configuration Panel */}
            <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
              <div className="p-6">
                {selectedNode ? (
                  <NodeConfig />
                ) : (
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm text-slate-600">Select a node to configure</p>
                  </div>
                )}
                
                {/* Execution Logs */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Execution Logs</h3>
                  {executionLogs.length > 0 ? (
                    <div className="space-y-2">
                      {executionLogs.map(log => (
                        <div key={log.id} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium ${
                              log.status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {log.status === 'success' ? '✓ Success' : '✗ Failed'}
                            </span>
                            <span className="text-xs text-slate-500">{log.duration}</span>
                          </div>
                          <p className="text-xs text-slate-600">{log.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No execution logs yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowAutomation;