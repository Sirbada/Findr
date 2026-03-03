import { createClient } from '@/lib/supabase/client'

export async function requireAdmin() {
  const supabase = createClient()
  const authClient: any = (supabase as any).auth
  const userData = authClient.getUser
    ? await authClient.getUser()
    : await authClient.getSession()
  const user = userData?.data?.user || userData?.data?.session?.user
  if (!user) {
    throw new Error('Authentication required')
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin, admin_role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    throw new Error('Admin access required')
  }

  return { user, profile }
}

export async function checkAdminPermission(requiredRole: 'admin' | 'moderator' | 'support' = 'moderator') {
  const { profile } = await requireAdmin()
  
  const roleHierarchy = {
    'support': 0,
    'moderator': 1,
    'admin': 2
  }
  
  const userLevel = roleHierarchy[profile.admin_role as keyof typeof roleHierarchy] ?? -1
  const requiredLevel = roleHierarchy[requiredRole]
  
  if (userLevel < requiredLevel) {
    throw new Error(`${requiredRole} access required`)
  }
  
  return profile
}