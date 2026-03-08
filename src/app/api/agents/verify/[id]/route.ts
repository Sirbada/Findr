import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: verificationId } = await params
    
    if (!verificationId) {
      return NextResponse.json(
        { success: false, error: 'Verification ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Get current user and check admin role
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin (you need to implement admin role checking)
    // For now, checking against a hardcoded admin email or role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single()

    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin privileges required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, admin_notes } = body

    // Validate status
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be pending, verified, or rejected' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      status,
      admin_notes: admin_notes || null,
      updated_at: new Date().toISOString()
    }

    // Set verified_at timestamp if approving
    if (status === 'verified') {
      updateData.verified_at = new Date().toISOString()
    } else {
      updateData.verified_at = null
    }

    // Update verification status
    const { data: verification, error: updateError } = await supabase
      .from('agent_verifications')
      .update(updateData)
      .eq('id', verificationId)
      .select(`
        *,
        profiles!agent_verifications_user_id_fkey (
          id,
          full_name,
          email
        )
      `)
      .single()

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Verification not found' },
          { status: 404 }
        )
      }
      
      console.error('Error updating verification:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update verification status' },
        { status: 500 }
      )
    }

    // TODO: Send notification to user about verification status change
    // This could be implemented via email, SMS, or push notification

    return NextResponse.json({
      success: true,
      data: verification,
      message: `Verification ${status} successfully`
    })

  } catch (error) {
    console.error('Admin verification update API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: verificationId } = await params
    
    const supabase = await createClient()
    
    // Get current user and check admin role
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check admin role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin privileges required' },
        { status: 403 }
      )
    }

    // Fetch verification details with user info
    const { data: verification, error: fetchError } = await supabase
      .from('agent_verifications')
      .select(`
        *,
        profiles!agent_verifications_user_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('id', verificationId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Verification not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching verification:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch verification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: verification
    })

  } catch (error) {
    console.error('Admin get verification API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}