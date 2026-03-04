import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: create escrow transaction (requires auth, buyer_id = current user)
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

  const { listing_id, listing_type, seller_id, amount, payment_method } = body

  if (typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  if (user.id === seller_id) {
    return NextResponse.json({ error: 'Cannot escrow your own listing' }, { status: 400 })
  }

  const platform_fee = Math.round(amount * 0.03)

  const { data, error } = await supabase
    .from('escrow_transactions')
    .insert({
      listing_id,
      listing_type,
      buyer_id: user.id,
      seller_id,
      amount,
      platform_fee,
      status: 'held',
      payment_method: payment_method || null,
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create escrow transaction' }, { status: 500 })
  }

  return NextResponse.json({ escrow_id: data.id }, { status: 201 })
}

// GET: list escrow transactions for current user
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
    .from('escrow_transactions')
    .select('*')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch escrow transactions' }, { status: 500 })
  }

  return NextResponse.json({ transactions: data })
}
