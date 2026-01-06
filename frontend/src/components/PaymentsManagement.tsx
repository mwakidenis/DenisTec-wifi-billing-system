import React, { useState, useEffect } from 'react'
import { DollarSign, Search, Filter, Download, Calendar, CreditCard } from 'lucide-react'
import { adminAPI } from '../services/api'
import { formatCurrency } from '../utils/formatters'
import toast from 'react-hot-toast'
import type { Payment, PaginatedResponse } from '../types'

const PaymentsManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchPayments()
  }, [currentPage, statusFilter])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getPayments({
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter
      })
      
      if (response.success && response.data) {
        setPayments(response.data.payments)
        setTotalPages(response.data.pagination.pages)
      }
    } catch (error) {
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-900 border border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-900 border border-yellow-200'
      case 'failed': return 'bg-red-100 text-red-900 border border-red-200'
      case 'cancelled': return 'bg-gray-100 text-gray-900 border border-gray-200'
      default: return 'bg-gray-100 text-gray-900 border border-gray-200'
    }
  }

  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">Payments Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all payment transactions</p>
        </div>
        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              Total
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              Count
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Payments</p>
            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              Pending
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-gray-900">
              {payments.filter(p => p.status === 'PENDING').length}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">✗</span>
            </div>
            <div className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">
              Failed
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Failed</p>
            <p className="text-2xl font-bold text-gray-900">
              {payments.filter(p => p.status === 'FAILED').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
            >
              <option value="all">All Payments</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="loading-spinner mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading payments...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.id.slice(0, 8)}...
                          </div>
                          {payment.mpesaReceiptNumber && (
                            <div className="text-xs text-gray-500 mt-1">
                              Receipt: {payment.mpesaReceiptNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.user?.firstName && payment.user?.lastName 
                              ? `${payment.user.firstName} ${payment.user.lastName}`
                              : payment.user?.phone || 'Unknown'
                            }
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {payment.user?.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.plan?.name || 'Unknown Plan'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <span className="mr-2">📱</span>
                          {payment.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.user?.firstName && payment.user?.lastName 
                          ? `${payment.user.firstName} ${payment.user.lastName}`
                          : payment.user?.phone || 'Unknown'
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {payment.user?.phone}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Plan</div>
                      <div className="font-medium text-gray-900">{payment.plan?.name || 'Unknown Plan'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Amount</div>
                      <div className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Method</div>
                      <div className="text-gray-700">📱 {payment.paymentMethod}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Date</div>
                      <div className="text-gray-700">{new Date(payment.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Transaction: {payment.id.slice(0, 8)}...
                      {payment.mpesaReceiptNumber && (
                        <span className="ml-2">Receipt: {payment.mpesaReceiptNumber}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
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

export default PaymentsManagement