import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: create offer (requires auth, buyer_id = current user)
export async function POST(request: Request) {
  const supabase = await createClient()
  const authClient: any = (supabase as any).auth
  const sessionData = authClient.getSession
    ? await authClient.getSession()
    : await authClient.getUser()
  const user = sessionData?.data?.session?.user || sessionData?.data?.user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || !body.listing_id || !body.listing_type || !body.seller_id || !body.amount) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { listing_id, listing_type, seller_id, amount, message } = body

  if (typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  // Prevent buyer from making offer on their own listing
  if (seller_id === user.id) {
    return NextResponse.json({ error: 'Cannot make offer on your own listing' }, { status: 400 })
  }

  const validTypes = ['housing', 'cars', 'services']
  if (!validTypes.includes(listing_type)) {
    return NextResponse.json({ error: 'Invalid listing type' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('offers')
    .insert({
      listing_id,
      listing_type,
      buyer_id: user.id,
      seller_id,
      amount,
      message: message || null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}

// GET: list offers for current user (as buyer or seller)
export async function GET() {
  const supabase = await createClient()
  const authClient: any = (supabase as any).auth
  const sessionData = authClient.getSession
    ? await authClient.getSession()
    : await authClient.getUser()
  const user = sessionData?.data?.session?.user || sessionData?.data?.user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
  }

  return NextResponse.json({ offers: data })
}

// PATCH: update offer status (seller only: accept/reject/counter)
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const authClient: any = (supabase as any).auth
  const sessionData = authClient.getSession
    ? await authClient.getSession()
    : await authClient.getUser()
  const user = sessionData?.data?.session?.user || sessionData?.data?.user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || !body.id || !body.status) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { id, status, counter_amount } = body

  const validStatuses = ['accepted', 'rejected', 'countered']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  if (status === 'countered' && (!counter_amount || typeof counter_amount !== 'number' || counter_amount <= 0)) {
    return NextResponse.json({ error: 'Counter amount required for counter offer' }, { status: 400 })
  }

  // Verify the current user is the seller of this offer
  const { data: offer, error: fetchError } = await supabase
    .from('offers')
    .select('id, seller_id')
    .eq('id', id)
    .single()

  if (fetchError || !offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  }

  if (offer.seller_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updateData: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (status === 'countered' && counter_amount) {
    updateData.counter_amount = counter_amount
  }

  const { error: updateError } = await supabase
    .from('offers')
    .update(updateData)
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
