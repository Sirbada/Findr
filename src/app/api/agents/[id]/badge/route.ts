import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch user's verification status (public endpoint - no auth required)
    const { data: verification, error: verificationError } = await supabase
      .from('agent_verifications')
      .select('status, verified_at, business_name')
      .eq('user_id', userId)
      .eq('status', 'verified')
      .single()

    if (verificationError && verificationError.code !== 'PGRST116') {
      console.error('Error fetching verification badge:', verificationError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch verification badge' },
        { status: 500 }
      )
    }

    const isVerified = !!verification

    // Get user's listing stats for Super Pro badge determination
    let listingCount = 0
    let avgRating = 0
    
    if (isVerified) {
      const { count } = await supabase
        .from('listings')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'active')

      listingCount = count || 0

      // TODO: Calculate average rating from reviews table
      // For now, mock rating based on listing count
      avgRating = Math.min(4.8, 3.5 + (listingCount * 0.1))
    }

    // Determine badge type
    let badgeType = null
    if (isVerified) {
      if (listingCount >= 20 && avgRating >= 4.5) {
        badgeType = 'super_pro'
      } else if (listingCount >= 5) {
        badgeType = 'pro'
      } else {
        badgeType = 'verified'
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        is_verified: isVerified,
        badge_type: badgeType,
        business_name: verification?.business_name || null,
        verified_at: verification?.verified_at || null,
        stats: {
          listing_count: listingCount,
          avg_rating: parseFloat(avgRating.toFixed(1))
        }
      }
    })

  } catch (error) {
    console.error('Badge check API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}