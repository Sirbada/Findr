import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { document_type, document_url, selfie_url } = body

  if (!document_type || !document_url) {
    return NextResponse.json({ error: 'document_type and document_url are required' }, { status: 400 })
  }

  const validDocTypes = ['national_id', 'passport', 'drivers_license']
  if (!validDocTypes.includes(document_type)) {
    return NextResponse.json({ error: 'Invalid document_type' }, { status: 400 })
  }

  // Check if there's already a pending request
  const { data: existing } = await supabase
    .from('verification_requests')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .single()

  if (existing) {
    return NextResponse.json({ error: 'You already have a pending verification request' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('verification_requests')
    .insert({
      user_id: user.id,
      document_type,
      document_url,
      selfie_url: selfie_url || null,
      status: 'pending',
    })
    .select('id, status, document_type, submitted_at, admin_notes')
    .single()

  if (error) {
    console.error('Error creating verification request:', error)
    return NextResponse.json({ error: 'Failed to create verification request' }, { status: 500 })
  }

  return NextResponse.json({ request: data }, { status: 201 })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('verification_requests')
    .select('id, status, document_type, submitted_at, admin_notes')
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found
    console.error('Error fetching verification request:', error)
    return NextResponse.json({ error: 'Failed to fetch verification status' }, { status: 500 })
  }

  return NextResponse.json({ request: data || null })
}
