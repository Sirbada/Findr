'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

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

  const supabase = createSupabaseClient()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Check user roles
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
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

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async () => {
    // Implement sign in logic
    // This is a placeholder - actual implementation depends on auth flow
    console.log('Sign in function called')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
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