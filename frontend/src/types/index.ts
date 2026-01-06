export interface User {
  id: string
  email?: string
  phone: string
  firstName?: string
  lastName?: string
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'TECHNICIAN' | 'SUPPORT'
  isActive: boolean
  createdAt: string
}

export interface Plan {
  id: string
  name: string
  description?: string
  price: number
  duration: number // in hours
  dataLimit: string
  speedLimit: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  userId: string
  planId: string
  macAddress?: string
  ipAddress?: string
  startTime: string
  endTime?: string
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED'
  dataUsed: number
  sessionToken: string
  routerSessionId?: string
  user?: User
  plan?: Plan
}

export interface Payment {
  id: string
  userId: string
  planId: string
  amount: number
  mpesaReceiptNumber?: string
  checkoutRequestId?: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  paymentMethod: string
  createdAt: string
  updatedAt: string
  user?: User
  plan?: Plan
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  todayRevenue: number
  activeSessions: number
  totalSessions: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  errors?: Array<{ msg: string; param: string }>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface PaymentRequest {
  phone: string
  planId: string
  amount: number
}

export interface PaymentStatusResponse {
  status: 'pending' | 'completed' | 'failed' | 'timeout'
  sessionToken?: string
  amount?: number
}

export interface ConnectionRequest {
  sessionToken: string
}