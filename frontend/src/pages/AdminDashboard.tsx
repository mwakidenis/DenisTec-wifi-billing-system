import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Wifi, 
  Settings, 
  LogOut,
  Menu,
  X,
  DollarSign,
  Activity,
  Clock,
  TrendingUp,
  Bell,
  Search,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { adminAPI } from '../services/api'
import { formatCurrency } from '../utils/formatters'
import toast from 'react-hot-toast'
import type { DashboardStats } from '../types'

// Dashboard components
import DashboardOverview from '../components/DashboardOverview'
import UsersManagement from '../components/UsersManagement'
import PlansManagement from '../components/PlansManagement'
import SessionsManagement from '../components/SessionsManagement'
import PaymentsManagement from '../components/PaymentsManagement'
import SettingsPage from '../components/SettingsPage'

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)
      const response = await adminAPI.getDashboardStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (error) {
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Plans', href: '/admin/plans', icon: CreditCard },
    { name: 'Sessions', href: '/admin/sessions', icon: Wifi },
    { name: 'Payments', href: '/admin/payments', icon: DollarSign },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    toast.success('Logged out successfully')
  }

  const handleRefresh = () => {
    fetchDashboardStats(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">COLLOSPOT</span>
              <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 h-full flex flex-col">
          <div className="px-6 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
                  <span className="text-white font-bold">{(user?.firstName || 'A')[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Welcome back!</p>
                  <p className="text-xs text-indigo-600 font-medium">{user?.firstName || 'Admin'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2 px-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'
                  }`} />
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 xl:pl-72">
        {/* Top bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all w-64"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {stats && (
                <div className="hidden lg:flex items-center space-x-4">
                  <div className="flex items-center bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-xl border border-emerald-100">
                    <TrendingUp className="w-4 h-4 mr-2 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">{formatCurrency(stats.todayRevenue)}</span>
                    <span className="text-emerald-500 ml-1 text-xs font-medium">today</span>
                  </div>
                  <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-100">
                    <Activity className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-semibold text-blue-700">{stats.activeSessions}</span>
                    <span className="text-blue-500 ml-1 text-xs font-medium">active</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Routes>
              <Route path="/" element={<DashboardOverview stats={stats} onRefresh={handleRefresh} />} />
              <Route path="/users" element={<UsersManagement />} />
              <Route path="/plans" element={<PlansManagement />} />
              <Route path="/sessions" element={<SessionsManagement />} />
              <Route path="/payments" element={<PaymentsManagement />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard