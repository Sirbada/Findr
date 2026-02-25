'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { CheckCircle, AlertTriangle, XCircle, X, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }
    
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer({ 
  toasts, 
  removeToast 
}: { 
  toasts: Toast[]
  removeToast: (id: string) => void 
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map(toast => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  )
}

function ToastItem({ 
  toast, 
  onRemove 
}: { 
  toast: Toast
  onRemove: () => void 
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(onRemove, 300) // Wait for animation
  }

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-500',
      titleColor: 'text-emerald-900',
      messageColor: 'text-emerald-700'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-900',
      messageColor: 'text-amber-700'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700'
    }
  }

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor, messageColor } = config[toast.type]

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out max-w-sm w-full
        ${isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div className={`
        ${bgColor} ${borderColor} border rounded-lg shadow-lg p-4
        backdrop-blur-sm
      `}>
        <div className="flex items-start">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>

          {/* Content */}
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${titleColor}`}>
              {toast.title}
            </h3>
            {toast.message && (
              <p className={`mt-1 text-sm ${messageColor}`}>
                {toast.message}
              </p>
            )}
          </div>

          {/* Close button */}
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={handleRemove}
              className={`
                inline-flex rounded-md p-1.5 
                ${titleColor} 
                hover:${bgColor} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                transition-colors
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper hooks for specific toast types
export function useSuccessToast() {
  const { addToast } = useToast()
  return (title: string, message?: string) => 
    addToast({ type: 'success', title, message })
}

export function useErrorToast() {
  const { addToast } = useToast()
  return (title: string, message?: string) => 
    addToast({ type: 'error', title, message })
}

export function useWarningToast() {
  const { addToast } = useToast()
  return (title: string, message?: string) => 
    addToast({ type: 'warning', title, message })
}

export function useInfoToast() {
  const { addToast } = useToast()
  return (title: string, message?: string) => 
    addToast({ type: 'info', title, message })
}