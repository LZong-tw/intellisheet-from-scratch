import { Settings as SettingsIcon, User, Bell, Shield, Database, Code } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-400">Configure your IntelliSheet workspace</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Profile Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Display Name</label>
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                defaultValue="admin@intellisheet.com"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h3>
          <div className="space-y-3">
            {[
              'Email notifications for sheet updates',
              'Weekly analytics reports',
              'Permission change alerts',
              'AI insight notifications',
            ].map((item) => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security
          </h3>
          <div className="space-y-4">
            <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
              Change Password
            </button>
            <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
              Enable Two-Factor Authentication
            </button>
            <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
              View Login History
            </button>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            System
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Rate Limit</span>
              <span className="text-sm text-gray-400">1000 req/hour</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage Used</span>
              <span className="text-sm text-gray-400">2.3 GB / 10 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Version</span>
              <span className="text-sm text-gray-400">v2.0.0</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Developer Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Developer Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">API Key</label>
            <div className="flex">
              <input
                type="text"
                value="isk_live_xxxxxxxxxxxxxxxxxxxxx"
                readOnly
                className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-3 py-2 font-mono text-sm"
              />
              <button className="px-4 bg-gray-700 hover:bg-gray-600 border border-l-0 border-gray-600 rounded-r-lg">
                Copy
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Webhook URL</label>
            <input
              type="url"
              placeholder="https://your-domain.com/webhook"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}