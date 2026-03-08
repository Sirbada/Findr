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
    setTimeout(onRemove, 300)
  }

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-[#F0F9F4]',
      borderColor: 'border-[#E6F2EC]',
      iconColor: 'text-[#2D8A5F]',
      titleColor: 'text-[#0D3D24]',
      messageColor: 'text-[#1B5E3B]'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-[#DC2626]',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-[#FEF3C7]',
      iconColor: 'text-[#E8960C]',
      titleColor: 'text-amber-900',
      messageColor: 'text-amber-700'
    },
    info: {
      icon: Info,
      bgColor: 'bg-[#F4F4F1]',
      borderColor: 'border-[#E8E8E4]',
      iconColor: 'text-[#4A4A45]',
      titleColor: 'text-[#1A1A18]',
      messageColor: 'text-[#4A4A45]'
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
        ${bgColor} ${borderColor} border rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] p-4
      `}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
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
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={handleRemove}
              className="inline-flex rounded-md p-1.5 text-[#7A7A73] hover:text-[#1A1A18] hover:bg-[#EEECEA] focus:outline-none transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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
