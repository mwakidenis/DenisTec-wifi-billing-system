import React, { useState, useEffect } from 'react'
import { Wifi, Check, Clock, Zap, CreditCard, Download, Upload, DollarSign, Phone, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDuration, isValidKenyanPhone } from '../utils/formatters'
import { publicAPI } from '../services/api'
import toast from 'react-hot-toast'
import type { Plan, PaymentStatusResponse } from '../types'

const CustomerPortal: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await publicAPI.getPlans()
      if (response.success && response.data) {
        setPlans(response.data)
      }
    } catch (error) {
      toast.error('Failed to load plans')
    }
  }

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    setShowPayment(true)
    setPaymentStatus(null)
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPlan) return
    
    if (!isValidKenyanPhone(phoneNumber)) {
      toast.error('Please enter a valid Kenyan phone number')
      return
    }

    setLoading(true)

    try {
      const response = await publicAPI.makePayment({
        phone: phoneNumber,
        amount: selectedPlan.price,
        planId: selectedPlan.id
      })

      if (response.success && response.data) {
        setPaymentStatus('pending')
        toast.success('Payment request sent to your phone')
        
        pollPaymentStatus(response.data.checkoutRequestId)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Payment failed')
      setLoading(false)
    }
  }

  const pollPaymentStatus = async (checkoutRequestId: string) => {
    const maxAttempts = 30
    let attempts = 0

    const poll = async () => {
      try {
        const response = await publicAPI.getPaymentStatus(checkoutRequestId)
        
        if (response.success && response.data) {
          const { status, sessionToken } = response.data
          
          if (status === 'completed') {
            setPaymentStatus('completed')
            setLoading(false)
            toast.success('Payment successful! You can now connect to the internet.')
            
            if (sessionToken) {
              setTimeout(() => {
                connectToInternet(sessionToken)
              }, 2000)
            }
          } else if (status === 'failed') {
            setPaymentStatus('failed')
            setLoading(false)
            toast.error('Payment failed. Please try again.')
          } else if (attempts < maxAttempts) {
            attempts++
            setTimeout(poll, 10000)
          } else {
            setPaymentStatus('timeout')
            setLoading(false)
            toast.error('Payment timeout. Please check your phone and try again.')
          }
        }
      } catch (error) {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(poll, 10000)
        } else {
          setLoading(false)
          toast.error('Unable to verify payment status')
        }
      }
    }

    poll()
  }

  const connectToInternet = async (sessionToken: string) => {
    try {
      const response = await publicAPI.connect({ sessionToken })
      
      if (response.success) {
        setPaymentStatus('connected')
        setConnectionStatus('connected')
        toast.success('Connected to internet successfully!')
        
        // Close payment modal after successful connection
        setTimeout(() => {
          setShowPayment(false)
          setSelectedPlan(null)
          setPhoneNumber('')
          setPaymentStatus(null)
        }, 3000)
      }
    } catch (error) {
      toast.error('Connection failed. Please contact support.')
    }
  }

  const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
          <Wifi className="w-6 h-6 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        {plan.description && (
          <p className="text-gray-600 mb-4">{plan.description}</p>
        )}
        
        <div className="text-3xl font-bold text-primary-600 mb-4">
          {formatCurrency(plan.price)}
          <span className="text-sm text-gray-500 font-normal">/{formatDuration(plan.duration)}</span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Zap className="w-4 h-4 mr-2 text-green-500" />
            Speed: {plan.speedLimit}
          </div>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Download className="w-4 h-4 mr-2 text-blue-500" />
            Data: {plan.dataLimit}
          </div>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-green-500" />
            Valid for {formatDuration(plan.duration)}
          </div>
        </div>

        <button
          onClick={() => handleSelectPlan(plan)}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Select Plan
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Wifi className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">COLLOSPOT</h1>
            </div>
            <p className="text-lg text-gray-600 mb-2">Smart WiFi Billing for the Modern Kenyan Network</p>
            <p className="text-sm text-gray-500 italic">"Connect. Pay. Browse — Seamlessly."</p>
            
            {/* Connection Status */}
            <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-gray-100">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-500 pulse-dot' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium">
                {connectionStatus === 'connected' ? 'Connected to Internet' : 'Not Connected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Internet Plan</h2>
          <p className="text-gray-600">Select a plan, pay via M-Pesa, and get instant internet access</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* How it Works */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Choose Plan</h3>
              <p className="text-sm text-gray-600">Select the internet plan that suits your needs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Pay via M-Pesa</h3>
              <p className="text-sm text-gray-600">Enter your phone number and complete payment</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Auto Connect</h3>
              <p className="text-sm text-gray-600">System automatically connects you to internet</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Start Browsing</h3>
              <p className="text-sm text-gray-600">Enjoy high-speed internet access immediately</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Complete Payment</h2>
              <button
                onClick={() => setShowPayment(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {paymentStatus === null && (
              <form onSubmit={handlePayment}>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">{selectedPlan.name}</h3>
                  <p className="text-2xl font-bold text-primary-600">{formatCurrency(selectedPlan.price)}</p>
                  <p className="text-sm text-gray-600">{formatDuration(selectedPlan.duration)} • {selectedPlan.dataLimit}</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0712345678"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your M-Pesa registered phone number
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay {formatCurrency(selectedPlan.price)}
                    </>
                  )}
                </button>
              </form>
            )}

            {paymentStatus === 'pending' && (
              <div className="text-center py-8">
                <div className="loading-spinner mx-auto mb-4"></div>
                <h3 className="text-lg font-medium mb-2">Payment Pending</h3>
                <p className="text-gray-600 mb-4">
                  Please check your phone and enter your M-Pesa PIN to complete the payment.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      You will receive an M-Pesa prompt on {phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === 'completed' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Payment Successful!</h3>
                <p className="text-gray-600">
                  Connecting you to the internet...
                </p>
              </div>
            )}

            {paymentStatus === 'connected' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Connected!</h3>
                <p className="text-gray-600">
                  You are now connected to the internet. Enjoy browsing!
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-4">
                  Your payment could not be processed. Please try again.
                </p>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Wifi className="w-6 h-6 text-primary-400 mr-2" />
              <span className="text-xl font-bold">COLLOSPOT</span>
            </div>
            <p className="text-gray-400 mb-4">Smart WiFi Billing for the Modern Kenyan Network</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <span>📞 Support: +254 700 000 000</span>
              <span>📧 support@collospot.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CustomerPortal