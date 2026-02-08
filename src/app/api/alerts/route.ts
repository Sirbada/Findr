import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch user's active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch alerts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: alerts || []
    })

  } catch (error) {
    console.error('Get alerts API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const { category, city, min_price, max_price, rooms_min, property_type } = body

    if (!category || !city) {
      return NextResponse.json(
        { success: false, error: 'category and city are required' },
        { status: 400 }
      )
    }

    // Validate category
    if (!['housing', 'cars', 'jobs'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category. Must be housing, cars, or jobs' },
        { status: 400 }
      )
    }

    // Check if user already has 10+ alerts (prevent spam)
    const { count: existingAlerts } = await supabase
      .from('alerts')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (existingAlerts && existingAlerts >= 10) {
      return NextResponse.json(
        { success: false, error: 'Maximum 10 active alerts allowed' },
        { status: 429 }
      )
    }

    // Create alert
    const alertData = {
      user_id: user.id,
      category,
      city: city.toLowerCase(),
      min_price: min_price || 0,
      max_price: max_price || 999999999,
      rooms_min: rooms_min || 0,
      property_type: property_type || null,
      is_active: true
    }

    const { data: alert, error: insertError } = await supabase
      .from('alerts')
      .insert([alertData])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating alert:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create alert' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: alert,
      message: 'Alert created successfully. You\'ll be notified when matching listings are posted.'
    }, { status: 201 })

  } catch (error) {
    console.error('Create alert API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get('id')
    
    if (!alertId) {
      return NextResponse.json(
        { success: false, error: 'Alert ID is required' },
        { status: 400 }
      )
    }

    // Delete/deactivate alert (soft delete)
    const { data: alert, error: deleteError } = await supabase
      .from('alerts')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', alertId)
      .eq('user_id', user.id) // Ensure user can only delete their own alerts
      .select()
      .single()

    if (deleteError) {
      if (deleteError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Alert not found' },
          { status: 404 }
        )
      }
      
      console.error('Error deleting alert:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete alert' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: alert,
      message: 'Alert deleted successfully'
    })

  } catch (error) {
    console.error('Delete alert API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}