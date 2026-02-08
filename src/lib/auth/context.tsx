'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface User {
  id: string
  email?: string
  phone?: string
  name?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (phone: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Demo user for development
  useEffect(() => {
    // Simulate loading and set a demo user
    const timer = setTimeout(() => {
      const demoUser = {
        id: 'demo-user-123',
        phone: '+237 6 99 00 00 00',
        name: 'Jean Kamga',
        email: 'jean.kamga@example.com'
      }
      setUser(demoUser)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const signIn = async (phone: string) => {
    // Mock sign in - in production this would use Supabase auth
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    const mockUser = {
      id: `user-${Date.now()}`,
      phone,
      name: 'Utilisateur Demo'
    }
    setUser(mockUser)
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setUser(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}