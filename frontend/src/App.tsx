import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerPortal from './pages/CustomerPortal'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<CustomerPortal />} />
      <Route path="/portal" element={<CustomerPortal />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/*" 
        element={
          user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role) ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App