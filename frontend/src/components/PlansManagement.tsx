import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Zap, Clock, Download, DollarSign, X } from 'lucide-react'
import { adminAPI } from '../services/api'
import { formatCurrency, formatDuration } from '../utils/formatters'
import toast from 'react-hot-toast'
import type { Plan } from '../types'

const PlansManagement: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    dataLimit: '',
    speedLimit: ''
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await adminAPI.getPlans()
      if (response.success && response.data) {
        setPlans(response.data)
      }
    } catch (error) {
      toast.error('Failed to load plans')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = () => {
    setEditingPlan(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      dataLimit: '',
      speedLimit: ''
    })
    setShowModal(true)
  }

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      dataLimit: plan.dataLimit,
      speedLimit: plan.speedLimit
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const planData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        dataLimit: formData.dataLimit,
        speedLimit: formData.speedLimit
      }

      if (editingPlan) {
        await adminAPI.updatePlan(editingPlan.id, planData)
        toast.success('Plan updated successfully')
      } else {
        await adminAPI.createPlan(planData)
        toast.success('Plan created successfully')
      }

      setShowModal(false)
      fetchPlans()
    } catch (error) {
      toast.error('Failed to save plan')
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        await adminAPI.deletePlan(planId)
        toast.success('Plan deleted successfully')
        fetchPlans()
      } catch (error) {
        toast.error('Failed to delete plan')
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">Plans Management</h1>
          <p className="text-gray-600 mt-1">Create and manage internet packages</p>
        </div>
        <button
          onClick={handleCreatePlan}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full border ${
                      plan.isActive 
                        ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200' 
                        : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(plan.price)}
                </div>
                <div className="text-sm text-gray-500 font-medium mt-1">per {formatDuration(plan.duration)}</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-600 font-medium">Speed</div>
                    <div className="text-sm font-semibold text-gray-900">{plan.speedLimit}</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-600 font-medium">Data Limit</div>
                    <div className="text-sm font-semibold text-gray-900">{plan.dataLimit}</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 font-medium">Duration</div>
                    <div className="text-sm font-semibold text-gray-900">{formatDuration(plan.duration)}</div>
                  </div>
                </div>
              </div>

              {plan.description && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 italic">{plan.description}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Premium 24 Hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Brief description of the plan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="24"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Limit</label>
                  <input
                    type="text"
                    required
                    value={formData.dataLimit}
                    onChange={(e) => setFormData({ ...formData, dataLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10GB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speed Limit</label>
                  <input
                    type="text"
                    required
                    value={formData.speedLimit}
                    onChange={(e) => setFormData({ ...formData, speedLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="20Mbps"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlansManagement