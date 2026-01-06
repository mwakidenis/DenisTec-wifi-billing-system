// Currency formatter for Kenyan Shillings
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format bytes to human readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Format duration in hours to human readable format
export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  } else {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    
    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`
    }
  }
}

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Handle Kenyan phone numbers
  if (cleaned.startsWith('254')) {
    const number = cleaned.slice(3)
    return `+254 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
  } else if (cleaned.startsWith('0')) {
    const number = cleaned.slice(1)
    return `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
  }
  
  return phone
}

// Format date to local string
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } else {
    return formatDate(date)
  }
}

// Format session status
export const formatSessionStatus = (status: string): { text: string; className: string } => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return { text: 'Active', className: 'status-active' }
    case 'EXPIRED':
      return { text: 'Expired', className: 'status-inactive' }
    case 'TERMINATED':
      return { text: 'Terminated', className: 'status-inactive' }
    default:
      return { text: status, className: 'status-pending' }
  }
}

// Format payment status
export const formatPaymentStatus = (status: string): { text: string; className: string } => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return { text: 'Completed', className: 'status-active' }
    case 'PENDING':
      return { text: 'Pending', className: 'status-pending' }
    case 'FAILED':
      return { text: 'Failed', className: 'status-inactive' }
    case 'CANCELLED':
      return { text: 'Cancelled', className: 'status-inactive' }
    default:
      return { text: status, className: 'status-pending' }
  }
}

// Generate random session token
export const generateSessionToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Validate Kenyan phone number
export const isValidKenyanPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's a valid Kenyan number
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return true
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    return true
  } else if (cleaned.length === 9) {
    // Assume it's missing the country code
    return true
  }
  
  return false
}

// Convert speed string to Mbps number for comparison
export const parseSpeedToMbps = (speed: string): number => {
  const match = speed.match(/(\d+(?:\.\d+)?)\s*(Kbps|Mbps|Gbps)/i)
  if (!match) return 0
  
  const value = parseFloat(match[1])
  const unit = match[2].toLowerCase()
  
  switch (unit) {
    case 'kbps':
      return value / 1000
    case 'mbps':
      return value
    case 'gbps':
      return value * 1000
    default:
      return value
  }
}