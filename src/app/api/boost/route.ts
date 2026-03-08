import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: create a boost record (requires auth, status='pending')
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
  if (!body || !body.listing_id || !body.listing_type || !body.boost_type || !body.duration_days || !body.amount_paid) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { listing_id, listing_type, boost_type, duration_days, amount_paid, payment_method } = body

  const validBoostTypes = ['featured', 'top', 'urgent']
  if (!validBoostTypes.includes(boost_type)) {
    return NextResponse.json({ error: 'Invalid boost type' }, { status: 400 })
  }

  if (typeof duration_days !== 'number' || duration_days <= 0) {
    return NextResponse.json({ error: 'Invalid duration' }, { status: 400 })
  }

  if (typeof amount_paid !== 'number' || amount_paid <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const validPaymentMethods = ['mtn_momo', 'orange_money', 'paypal']
  const method = validPaymentMethods.includes(payment_method) ? payment_method : null

  const { data, error } = await supabase
    .from('listing_boosts')
    .insert({
      listing_id,
      listing_type,
      user_id: user.id,
      boost_type,
      duration_days,
      amount_paid,
      payment_method: method,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create boost' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}

// GET: list boosts for current user's listings
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
    .from('listing_boosts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch boosts' }, { status: 500 })
  }

  return NextResponse.json({ boosts: data })
}
