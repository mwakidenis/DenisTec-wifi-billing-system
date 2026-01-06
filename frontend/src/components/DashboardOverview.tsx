import React from 'react'
import { Users, DollarSign, Wifi, TrendingUp, Activity, Clock, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'
import { useNavigate } from 'react-router-dom'
import type { DashboardStats } from '../types'

interface DashboardOverviewProps {
  stats: DashboardStats | null
  onRefresh?: () => void
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, onRefresh }) => {
  const navigate = useNavigate()
  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions.toString(),
      icon: Wifi,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      change: stats.activeSessions > 0 ? 'Live' : 'None',
      changeType: stats.activeSessions > 0 ? 'positive' : 'neutral'
    },
    {
      title: 'Today\'s Revenue',
      value: formatCurrency(stats.todayRevenue),
      icon: TrendingUp,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50',
      change: 'Today',
      changeType: 'neutral'
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Monitor your WiFi billing system performance in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl border border-white/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'bg-emerald-100 text-emerald-700' : 
                stat.changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/admin/users')}
              className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 hover:from-blue-100 hover:to-cyan-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 shadow-md group-hover:shadow-lg transition-shadow">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">Manage Users</p>
                  <p className="text-sm text-blue-600 hidden sm:block">View and manage customer accounts</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
              </div>
            </button>
            <button 
              onClick={() => navigate('/admin/plans')}
              className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 hover:from-emerald-100 hover:to-green-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-md group-hover:shadow-lg transition-shadow">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">Create New Plan</p>
                  <p className="text-sm text-emerald-600 hidden sm:block">Add new internet packages</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
              </div>
            </button>
            <button 
              onClick={() => navigate('/admin/sessions')}
              className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:from-purple-100 hover:to-pink-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-md group-hover:shadow-lg transition-shadow">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">View Active Sessions</p>
                  <p className="text-sm text-purple-600 hidden sm:block">Monitor current connections</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-purple-500 group-hover:text-purple-600 transition-colors" />
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">System Status</h3>
            </div>
            <button 
              onClick={onRefresh}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-900">API Server</span>
              </div>
              <span className="text-sm text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-full">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-900">Database</span>
              </div>
              <span className="text-sm text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-900">M-Pesa Integration</span>
              </div>
              <span className="text-sm text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-full">Active (Dev)</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-900">Router Connection</span>
              </div>
              <span className="text-sm text-amber-700 font-bold bg-amber-100 px-2 py-1 rounded-full">Checking...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          </div>
          <button 
            onClick={() => navigate('/admin/payments')}
            className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 via-green-50 to-transparent rounded-2xl border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">New user registered</p>
              <p className="text-xs text-emerald-600 font-medium">+254712345678 • 2 minutes ago</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 via-cyan-50 to-transparent rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-4 shadow-sm">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Payment completed</p>
              <p className="text-xs text-blue-600 font-medium">KES 100 • Premium 24 Hours • 5 minutes ago</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-transparent rounded-2xl border border-purple-100 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-sm">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Session started</p>
              <p className="text-xs text-purple-600 font-medium">User connected to WiFi • 8 minutes ago</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview