import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { status, admin_notes } = body

  if (!status || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'status must be "approved" or "rejected"' }, { status: 400 })
  }

  // Fetch the verification request to get user_id
  const { data: verificationRequest, error: fetchError } = await supabase
    .from('verification_requests')
    .select('id, user_id, status')
    .eq('id', id)
    .single()

  if (fetchError || !verificationRequest) {
    return NextResponse.json({ error: 'Verification request not found' }, { status: 404 })
  }

  // Update the verification request
  const { data: updated, error: updateError } = await supabase
    .from('verification_requests')
    .update({
      status,
      admin_notes: admin_notes || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq('id', id)
    .select('id, status, admin_notes, reviewed_at')
    .single()

  if (updateError) {
    console.error('Error updating verification request:', updateError)
    return NextResponse.json({ error: 'Failed to update verification request' }, { status: 500 })
  }

  // If approved, update the user's profile to set is_verified = true
  if (status === 'approved') {
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', verificationRequest.user_id)

    if (profileUpdateError) {
      console.error('Error updating profile verification status:', profileUpdateError)
      // Don't fail the request — the verification status was updated
    }
  }

  // If rejected, ensure is_verified is false
  if (status === 'rejected') {
    await supabase
      .from('profiles')
      .update({ is_verified: false })
      .eq('id', verificationRequest.user_id)
  }

  return NextResponse.json({ request: updated })
}
