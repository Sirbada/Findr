'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, Users, Home, Flag, Settings, LogOut,
  Shield, BarChart3, Bell, Menu, X
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAdminAccess()
  }, [user, authLoading])

  async function checkAdminAccess() {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/admin/check')
      const data = await response.json()

      if (!response.ok || data.error || !data.is_admin) {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  const navigation = [
    { 
      name: 'Tableau de bord', 
      nameEn: 'Dashboard', 
      href: '/admin', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Utilisateurs', 
      nameEn: 'Users', 
      href: '/admin/users', 
      icon: Users 
    },
    { 
      name: 'Annonces', 
      nameEn: 'Listings', 
      href: '/admin/listings', 
      icon: Home 
    },
    { 
      name: 'Signalements', 
      nameEn: 'Reports', 
      href: '/admin/reports', 
      icon: Flag 
    },
    { 
      name: 'Statistiques', 
      nameEn: 'Analytics', 
      href: '/admin/analytics', 
      icon: BarChart3 
    },
    { 
      name: 'Paramètres', 
      nameEn: 'Settings', 
      href: '/admin/settings', 
      icon: Settings 
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500">Findr</p>
            </div>
          </div>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="block text-xs text-gray-500">{item.nameEn}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* User info and logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email || "User" || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Administrateur
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tableau utilisateur</span>
            </Link>
            
            <button
              onClick={async () => {
                await signOut()
                router.push('/')
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Admin</span>
            </div>
            
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}