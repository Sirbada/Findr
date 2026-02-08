import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    const { business_name, license_number, phone_verified, documents_url } = body

    // Validate required fields
    if (!business_name || !license_number) {
      return NextResponse.json(
        { success: false, error: 'business_name and license_number are required' },
        { status: 400 }
      )
    }

    // Check if user already has a pending/verified application
    const { data: existing, error: checkError } = await supabase
      .from('agent_verifications')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing verification:', checkError)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    if (existing) {
      // Update existing application
      const { data: verification, error: updateError } = await supabase
        .from('agent_verifications')
        .update({
          business_name,
          license_number,
          phone_verified: phone_verified || false,
          documents_url: documents_url || null,
          status: 'pending', // Reset to pending when updated
          created_at: new Date().toISOString() // Reset timestamp
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating verification:', updateError)
        return NextResponse.json(
          { success: false, error: 'Failed to update verification application' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: verification,
        message: 'Verification application updated successfully. Our team will review it within 48h.'
      })
    } else {
      // Create new verification application
      const verificationData = {
        user_id: user.id,
        business_name,
        license_number,
        phone_verified: phone_verified || false,
        documents_url: documents_url || null,
        status: 'pending'
      }

      const { data: verification, error: insertError } = await supabase
        .from('agent_verifications')
        .insert([verificationData])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating verification:', insertError)
        return NextResponse.json(
          { success: false, error: 'Failed to submit verification application' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: verification,
        message: 'Verification application submitted successfully. Our team will review it within 48h.'
      }, { status: 201 })
    }

  } catch (error) {
    console.error('Agent verification API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    // Fetch user's verification status
    const { data: verification, error: verificationError } = await supabase
      .from('agent_verifications')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (verificationError && verificationError.code !== 'PGRST116') {
      console.error('Error fetching verification:', verificationError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch verification status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: verification || null
    })

  } catch (error) {
    console.error('Get verification API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}