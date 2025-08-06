import { useState } from 'react'
import { Shield, Users, Key, ToggleLeft, ToggleRight, Copy, Trash2, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

type PermissionMode = 'simple' | 'advanced'

interface Role {
  id: string
  name: string
  color: string
}

interface Permission {
  id: string
  resource: string
  actions: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
}

interface ABACRule {
  id: string
  name: string
  condition: string
  permissions: string[]
  enabled: boolean
}

const mockRoles: Role[] = [
  { id: '1', name: 'Admin', color: 'bg-red-500' },
  { id: '2', name: 'Manager', color: 'bg-blue-500' },
  { id: '3', name: 'Employee', color: 'bg-green-500' },
  { id: '4', name: 'Guest', color: 'bg-gray-500' },
]

const mockResources = ['Spreadsheets', 'Reports', 'Users', 'Settings', 'Workflows']

const mockABACRules: ABACRule[] = [
  {
    id: '1',
    name: 'Department Manager Access',
    condition: 'user.role === "Manager" && user.department === resource.department',
    permissions: ['read', 'update'],
    enabled: true,
  },
  {
    id: '2',
    name: 'Owner Full Access',
    condition: 'user.id === resource.ownerId',
    permissions: ['create', 'read', 'update', 'delete'],
    enabled: true,
  },
  {
    id: '3',
    name: 'Time-based Access',
    condition: 'currentTime >= "09:00" && currentTime <= "18:00"',
    permissions: ['read', 'update'],
    enabled: false,
  },
]

export default function Permissions() {
  const [mode, setMode] = useState<PermissionMode>('simple')
  const [selectedRole, setSelectedRole] = useState<string>('1')
  const [permissions, setPermissions] = useState<Record<string, Permission>>({})
  const [abacRules, setABACRules] = useState(mockABACRules)

  const togglePermission = (roleId: string, resource: string, action: string) => {
    const key = `${roleId}-${resource}`
    setPermissions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        id: key,
        resource,
        actions: {
          ...prev[key]?.actions,
          [action]: !prev[key]?.actions?.[action],
        },
      },
    }))
    toast.success('Permission updated')
  }

  const toggleRule = (ruleId: string) => {
    setABACRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    )
    toast.success('Rule toggled')
  }

  const deleteRule = (ruleId: string) => {
    setABACRules(prev => prev.filter(rule => rule.id !== ruleId))
    toast.success('Rule deleted')
  }

  const duplicateRule = (rule: ABACRule) => {
    const newRule = {
      ...rule,
      id: String(Date.now()),
      name: `${rule.name} (Copy)`,
    }
    setABACRules(prev => [...prev, newRule])
    toast.success('Rule duplicated')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Permission Management</h2>
          <p className="text-gray-400">Configure access control for your workspace</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">Mode:</span>
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setMode('simple')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'simple'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Simple Matrix
            </button>
            <button
              onClick={() => setMode('advanced')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === 'advanced'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Advanced ABAC
            </button>
          </div>
        </div>
      </div>

      {mode === 'simple' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Role Selector */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Select Role
            </h3>
            <div className="flex space-x-3">
              {mockRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedRole === role.id
                      ? 'bg-gray-700 ring-2 ring-primary-500'
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                    <span>{role.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Permission Matrix
              </h3>
              <div className="flex space-x-2">
                <button className="text-sm text-gray-400 hover:text-white">
                  Allow All
                </button>
                <span className="text-gray-600">|</span>
                <button className="text-sm text-gray-400 hover:text-white">
                  Deny All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="pb-3">Resource</th>
                    <th className="pb-3 text-center">Create</th>
                    <th className="pb-3 text-center">Read</th>
                    <th className="pb-3 text-center">Update</th>
                    <th className="pb-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {mockResources.map((resource) => {
                    const key = `${selectedRole}-${resource}`
                    const perm = permissions[key]
                    return (
                      <tr key={resource}>
                        <td className="py-3 font-medium">{resource}</td>
                        {['create', 'read', 'update', 'delete'].map((action) => (
                          <td key={action} className="py-3 text-center">
                            <button
                              onClick={() => togglePermission(selectedRole, resource, action)}
                              className="p-1"
                            >
                              {perm?.actions?.[action as keyof typeof perm.actions] ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                              )}
                            </button>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ABAC Rules */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Attribute-Based Access Control Rules
              </h3>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium">
                Add Rule
              </button>
            </div>
            <div className="space-y-4">
              {abacRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{rule.name}</h4>
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className="p-1"
                        >
                          {rule.enabled ? (
                            <ToggleRight className="w-5 h-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-400">Condition:</span>
                          <code className="bg-gray-800 px-2 py-1 rounded">
                            {rule.condition}
                          </code>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-400">Permissions:</span>
                          <div className="flex space-x-1">
                            {rule.permissions.map((perm) => (
                              <span
                                key={perm}
                                className="bg-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-4">
                      <button
                        onClick={() => duplicateRule(rule)}
                        className="p-1.5 hover:bg-gray-700 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-1.5 hover:bg-gray-700 rounded text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rule Testing */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Test Rules</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">User Context</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono"
                  rows={4}
                  placeholder='{ "id": "123", "role": "Manager", "department": "Sales" }'
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Resource Context</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm font-mono"
                  rows={4}
                  placeholder='{ "type": "spreadsheet", "department": "Sales", "ownerId": "456" }'
                />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium">
              Evaluate Rules
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}