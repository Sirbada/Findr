'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type User = {
  id: string
  phone?: string | null
  email?: string | null
  user_metadata?: Record<string, any>
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const authClient: any = (supabase as any).auth

    const getSession = async () => {
      const sessionData = authClient.getSession
        ? await authClient.getSession()
        : await authClient.getUser()
      const sessionUser = sessionData?.data?.session?.user || sessionData?.data?.user
      setUser(sessionUser ?? null)

      if (sessionUser) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', sessionUser.id)
          .single()

        if (roles) {
          setIsAdmin(['admin', 'super_admin'].includes(roles.role))
          setIsSuperAdmin(roles.role === 'super_admin')
        }
      }

      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    let unsubscribe: (() => void) | undefined
    if (authClient.onAuthStateChange) {
      const { data } = authClient.onAuthStateChange(async (_event: any, session: any) => {
        const sessionUser = session?.user ?? null
        setUser(sessionUser)

        if (sessionUser) {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', sessionUser.id)
            .single()

          if (roles) {
            setIsAdmin(['admin', 'super_admin'].includes(roles.role))
            setIsSuperAdmin(roles.role === 'super_admin')
          }
        } else {
          setIsAdmin(false)
          setIsSuperAdmin(false)
        }
      })
      unsubscribe = data?.subscription?.unsubscribe
    }

    return () => { if (unsubscribe) unsubscribe() }
  }, [])

  const signIn = async () => {
    // Placeholder — actual implementation uses phone OTP flow at /login
  }

  const signOut = async () => {
    const supabase = createClient()
    const authClient: any = (supabase as any).auth
    if (authClient.signOut) await authClient.signOut()
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
    isSuperAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
