import React, { useState } from 'react'
import { Settings, Wifi, DollarSign, Bell, Shield, Database, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      systemName: 'COLLOSPOT',
      companyName: 'COLLOSPOT Ltd',
      supportEmail: 'support@collospot.com',
      supportPhone: '+254700000000',
      timezone: 'Africa/Nairobi'
    },
    mpesa: {
      consumerKey: '',
      consumerSecret: '',
      shortcode: '174379',
      passkey: '',
      environment: 'sandbox'
    },
    router: {
      host: '192.168.1.1',
      username: 'admin',
      password: '',
      port: '8728'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      paymentAlerts: true,
      sessionAlerts: false
    }
  })

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'mpesa', name: 'M-Pesa', icon: DollarSign },
    { id: 'router', name: 'Router', icon: Wifi },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'database', name: 'Database', icon: Database }
  ]

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`)
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
          <input
            type="text"
            value={settings.general.systemName}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, systemName: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            value={settings.general.companyName}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, companyName: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
          <input
            type="email"
            value={settings.general.supportEmail}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, supportEmail: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
          <input
            type="tel"
            value={settings.general.supportPhone}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, supportPhone: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <button
        onClick={() => handleSave('General')}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </button>
    </div>
  )

  const renderMpesaSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Warning:</strong> These are sensitive credentials. Make sure to keep them secure.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Consumer Key</label>
          <input
            type="password"
            value={settings.mpesa.consumerKey}
            onChange={(e) => setSettings({
              ...settings,
              mpesa: { ...settings.mpesa, consumerKey: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter M-Pesa consumer key"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Consumer Secret</label>
          <input
            type="password"
            value={settings.mpesa.consumerSecret}
            onChange={(e) => setSettings({
              ...settings,
              mpesa: { ...settings.mpesa, consumerSecret: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter M-Pesa consumer secret"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shortcode</label>
          <input
            type="text"
            value={settings.mpesa.shortcode}
            onChange={(e) => setSettings({
              ...settings,
              mpesa: { ...settings.mpesa, shortcode: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
          <select
            value={settings.mpesa.environment}
            onChange={(e) => setSettings({
              ...settings,
              mpesa: { ...settings.mpesa, environment: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="sandbox">Sandbox</option>
            <option value="production">Production</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => handleSave('M-Pesa')}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
      >
        <Save className="w-4 h-4 mr-2" />
        Save M-Pesa Settings
      </button>
    </div>
  )

  const renderRouterSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Router IP Address</label>
          <input
            type="text"
            value={settings.router.host}
            onChange={(e) => setSettings({
              ...settings,
              router: { ...settings.router, host: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">API Port</label>
          <input
            type="text"
            value={settings.router.port}
            onChange={(e) => setSettings({
              ...settings,
              router: { ...settings.router, port: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={settings.router.username}
            onChange={(e) => setSettings({
              ...settings,
              router: { ...settings.router, username: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={settings.router.password}
            onChange={(e) => setSettings({
              ...settings,
              router: { ...settings.router, password: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => toast.success('Router connection tested successfully')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Connection
        </button>
        <button
          onClick={() => handleSave('Router')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive email alerts for important events</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, emailNotifications: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-500">Send SMS alerts to customers</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, smsNotifications: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <button
        onClick={() => handleSave('Notification')}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Preferences
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure your WiFi billing system</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'mpesa' && renderMpesaSettings()}
          {activeTab === 'router' && renderRouterSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Security settings coming soon...</p>
            </div>
          )}
          {activeTab === 'database' && (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Database management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage