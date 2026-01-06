import React, { useState, useEffect } from 'react'
import { Wifi, Search, Filter, Power, Clock, User, Activity } from 'lucide-react'
import { adminAPI } from '../services/api'
import { formatCurrency } from '../utils/formatters'
import toast from 'react-hot-toast'
import type { Session, PaginatedResponse } from '../types'

const SessionsManagement: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchSessions()
  }, [currentPage, statusFilter])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getSessions({
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter
      })
      
      if (response.success && response.data) {
        setSessions(response.data.sessions)
        setTotalPages(response.data.pagination.pages)
      }
    } catch (error) {
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    if (confirm('Are you sure you want to terminate this session?')) {
      try {
        await adminAPI.terminateSession(sessionId)
        toast.success('Session terminated successfully')
        fetchSessions()
      } catch (error) {
        toast.error('Failed to terminate session')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-900 border border-green-200'
      case 'expired': return 'bg-yellow-100 text-yellow-900 border border-yellow-200'
      case 'terminated': return 'bg-red-100 text-red-900 border border-red-200'
      default: return 'bg-gray-100 text-gray-900 border border-gray-200'
    }
  }

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start)
    const endTime = end ? new Date(end) : new Date()
    const diff = endTime.getTime() - startTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-600 mt-1">Monitor and manage active user sessions</p>
        </div>
        <button 
          onClick={fetchSessions}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Sessions</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="loading-spinner mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading sessions...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {session.user?.firstName && session.user?.lastName 
                                ? `${session.user.firstName} ${session.user.lastName}`
                                : session.user?.phone || 'Unknown User'
                              }
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.ipAddress || 'No IP'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {session.plan?.name || 'Unknown Plan'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.plan?.price ? formatCurrency(session.plan.price) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full border ${
                          session.status === 'ACTIVE' ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200' :
                          session.status === 'EXPIRED' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200' :
                          'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDuration(session.startTime, session.endTime)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Started: {new Date(session.startTime).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.dataUsed ? `${(Number(session.dataUsed) / (1024 * 1024)).toFixed(2)} MB` : '0 MB'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {session.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleTerminateSession(session.id)}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                          >
                            <Power className="w-4 h-4 mr-1" />
                            Terminate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {session.user?.firstName && session.user?.lastName 
                            ? `${session.user.firstName} ${session.user.lastName}`
                            : session.user?.phone || 'Unknown User'
                          }
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {session.ipAddress || 'No IP'}
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full border ${
                      session.status === 'ACTIVE' ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200' :
                      session.status === 'EXPIRED' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200' :
                      'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-gray-500 text-xs">Plan</div>
                      <div className="font-medium text-gray-900">{session.plan?.name || 'Unknown Plan'}</div>
                      <div className="text-xs text-gray-500">
                        {session.plan?.price ? formatCurrency(session.plan.price) : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Duration</div>
                      <div className="text-gray-900">{formatDuration(session.startTime, session.endTime)}</div>
                      <div className="text-xs text-gray-500">
                        Started: {new Date(session.startTime).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Data: {session.dataUsed ? `${(Number(session.dataUsed) / (1024 * 1024)).toFixed(2)} MB` : '0 MB'}
                    </div>
                    {session.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        className="text-red-600 hover:text-red-800 transition-colors flex items-center text-sm"
                      >
                        <Power className="w-4 h-4 mr-1" />
                        Terminate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionsManagement