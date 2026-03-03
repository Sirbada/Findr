import { createClient } from '@/lib/supabase/client'
import { requireAdmin } from './middleware'

export interface AdminStats {
  totalUsers: number
  activeListings: number
  pendingListings: number
  reportedContent: number
  dailyActiveUsers: number
  newUsersToday: number
  listingsToday: number
  revenue: {
    total: number
    monthly: number
    transactions: number
  }
}

export interface UserData {
  id: string
  full_name: string
  email: string
  phone: string
  city: string
  is_verified: boolean
  is_blocked: boolean
  trust_score: number
  listing_count: number
  last_active_at: string
  created_at: string
  blocked_reason?: string
}

export interface ListingData {
  id: string
  title: string
  category: string
  price: number
  city: string
  status: string
  views: number
  user_id: string
  user_name: string
  created_at: string
  updated_at: string
  images: string[]
}

export interface ReportData {
  id: string
  type: 'listing' | 'user'
  target_id: string
  target_title: string
  reporter_name: string
  reason: string
  description: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
}

export class AdminQueries {
  private supabase = createClient()

  async getStats(): Promise<AdminStats> {
    await requireAdmin()

    const today = new Date().toISOString().split('T')[0]
    const thisMonth = new Date().toISOString().slice(0, 7)

    // Run all queries in parallel
    const [
      { count: totalUsers },
      { count: activeListings },
      { count: pendingListings },
      { count: reportedContent },
      { count: newUsersToday },
      { count: listingsToday },
      { data: transactions }
    ] = await Promise.all([
      this.supabase.from('profiles').select('id', { count: 'exact', head: true }),
      this.supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      this.supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      this.supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      this.supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00`),
      this.supabase.from('listings').select('id', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00`),
      this.supabase.from('transactions').select('amount, status').eq('status', 'completed')
    ])

    // Calculate revenue
    const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
    const { data: monthlyTransactions } = await this.supabase
      .from('transactions')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', `${thisMonth}-01T00:00:00`)

    const monthlyRevenue = monthlyTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

    // Calculate daily active users (users who performed an action in the last 24 hours)
    const { count: dailyActiveUsers } = await this.supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('last_active_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    return {
      totalUsers: totalUsers || 0,
      activeListings: activeListings || 0,
      pendingListings: pendingListings || 0,
      reportedContent: reportedContent || 0,
      dailyActiveUsers: dailyActiveUsers || 0,
      newUsersToday: newUsersToday || 0,
      listingsToday: listingsToday || 0,
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        transactions: transactions?.length || 0
      }
    }
  }

  async getUsers(page = 1, limit = 20, search?: string, status?: 'all' | 'active' | 'blocked' | 'unverified'): Promise<{ users: UserData[]; total: number }> {
    await requireAdmin()

    let query = this.supabase
      .from('profiles')
      .select(`
        id, full_name, email, phone, city, 
        is_verified, is_blocked, trust_score, 
        listing_count, last_active_at, created_at, 
        blocked_reason
      `)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    if (status && status !== 'all') {
      switch (status) {
        case 'blocked':
          query = query.eq('is_blocked', true)
          break
        case 'unverified':
          query = query.eq('is_verified', false)
          break
        case 'active':
          query = query.eq('is_blocked', false)
          break
      }
    }

    const { count } = await query.select('id', { count: 'exact', head: true })
    const { data, error } = await query.range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    return {
      users: data as UserData[],
      total: count || 0
    }
  }

  async getListings(page = 1, limit = 20, status?: 'all' | 'pending' | 'approved' | 'rejected'): Promise<{ listings: ListingData[]; total: number }> {
    await requireAdmin()

    let query = this.supabase
      .from('listings')
      .select(`
        id, title, category, price, city, status, views,
        user_id, images, created_at, updated_at,
        profiles!inner(full_name)
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { count } = await query.select('id', { count: 'exact', head: true })
    const { data, error } = await query.range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    const listings = (data as any[])?.map(listing => ({
      ...listing,
      user_name: listing.profiles.full_name
    })) || []

    return {
      listings: listings as ListingData[],
      total: count || 0
    }
  }

  async getReports(page = 1, limit = 20, status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'): Promise<{ reports: ReportData[]; total: number }> {
    await requireAdmin()

    let query = this.supabase
      .from('reports')
      .select(`
        id, listing_id, user_id, reason, description, status, created_at,
        reporter:profiles!reports_reporter_id_fkey(full_name),
        listing:listings(title),
        user:profiles!reports_user_id_fkey(full_name)
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { count } = await query.select('id', { count: 'exact', head: true })
    const { data, error } = await query.range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    const reports = (data as any[])?.map(report => ({
      id: report.id,
      type: report.listing_id ? 'listing' : 'user' as 'listing' | 'user',
      target_id: report.listing_id || report.user_id,
      target_title: report.listing?.title || report.user?.full_name || 'Unknown',
      reporter_name: report.reporter?.full_name || 'Anonymous',
      reason: report.reason,
      description: report.description,
      status: report.status,
      created_at: report.created_at
    })) || []

    return {
      reports: reports as ReportData[],
      total: count || 0
    }
  }

  // User management actions
  async banUser(userId: string, reason: string): Promise<void> {
    const { user: adminUser } = await requireAdmin()

    const { error } = await this.supabase
      .from('profiles')
      .update({
        is_blocked: true,
        blocked_reason: reason,
        blocked_at: new Date().toISOString(),
        blocked_by: adminUser.id
      })
      .eq('id', userId)

    if (error) throw error

    // Log the action
    await this.logAdminAction('block_user', 'user', userId, { reason })
  }

  async unbanUser(userId: string): Promise<void> {
    const { user: adminUser } = await requireAdmin()

    const { error } = await this.supabase
      .from('profiles')
      .update({
        is_blocked: false,
        blocked_reason: null,
        blocked_at: null,
        blocked_by: null
      })
      .eq('id', userId)

    if (error) throw error

    await this.logAdminAction('unblock_user', 'user', userId, {})
  }

  async verifyUser(userId: string): Promise<void> {
    const { user: adminUser } = await requireAdmin()

    const { error } = await this.supabase
      .from('profiles')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verified_by: adminUser.id
      })
      .eq('id', userId)

    if (error) throw error

    await this.logAdminAction('verify_user', 'user', userId, {})
  }

  // Listing management actions
  async approveListing(listingId: string): Promise<void> {
    const { user: adminUser } = await requireAdmin()

    const { error } = await this.supabase
      .from('listings')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: adminUser.id
      })
      .eq('id', listingId)

    if (error) throw error

    await this.logAdminAction('approve_listing', 'listing', listingId, {})
  }

  async rejectListing(listingId: string, reason: string): Promise<void> {
    const { user: adminUser } = await requireAdmin()

    const { error } = await this.supabase
      .from('listings')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        approved_by: adminUser.id
      })
      .eq('id', listingId)

    if (error) throw error

    await this.logAdminAction('reject_listing', 'listing', listingId, { reason })
  }

  async deleteListing(listingId: string): Promise<void> {
    await requireAdmin()

    const { error } = await this.supabase
      .from('listings')
      .delete()
      .eq('id', listingId)

    if (error) throw error

    await this.logAdminAction('delete_listing', 'listing', listingId, {})
  }

  // Report management
  async resolveReport(reportId: string, action: 'resolved' | 'dismissed'): Promise<void> {
    const { user: adminUser } = await requireAdmin()

    const { error } = await this.supabase
      .from('reports')
      .update({
        status: action,
        handled_by: adminUser.id,
        handled_at: new Date().toISOString()
      })
      .eq('id', reportId)

    if (error) throw error

    await this.logAdminAction('resolve_report', 'report', reportId, { action })
  }

  // Activity logging
  private async logAdminAction(action: string, targetType: string, targetId: string, details: any): Promise<void> {
    const { user } = await requireAdmin()

    await this.supabase.from('activity_log').insert({
      admin_id: user.id,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      ip_address: null, // Could be populated from request headers
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    })
  }
}

export const adminQueries = new AdminQueries()