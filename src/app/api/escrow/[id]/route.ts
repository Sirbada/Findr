import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH: update escrow status
// { action: 'release' } — buyer confirms receipt, status → 'released'
// { action: 'dispute', reason: string } — buyer opens dispute, status → 'disputed'
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const authClient: any = (supabase as any).auth
  const sessionData = authClient.getSession
    ? await authClient.getSession()
    : await authClient.getUser()
  const user = sessionData?.data?.session?.user || sessionData?.data?.user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || !body.action) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { action, reason } = body

  // Fetch the escrow transaction
  const { data: escrow, error: fetchError } = await supabase
    .from('escrow_transactions')
    .select('id, buyer_id, seller_id, status')
    .eq('id', id)
    .single()

  if (fetchError || !escrow) {
    return NextResponse.json({ error: 'Escrow transaction not found' }, { status: 404 })
  }

  // Only buyer can release or dispute
  if (escrow.buyer_id !== user.id) {
    return NextResponse.json({ error: 'Only the buyer can perform this action' }, { status: 403 })
  }

  if (escrow.status !== 'held') {
    return NextResponse.json({ error: 'Escrow is not in held status' }, { status: 400 })
  }

  let updateData: Record<string, unknown>

  if (action === 'release') {
    updateData = {
      status: 'released',
      released_at: new Date().toISOString(),
    }
  } else if (action === 'dispute') {
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json({ error: 'Dispute reason is required' }, { status: 400 })
    }
    updateData = {
      status: 'disputed',
      disputed_at: new Date().toISOString(),
      dispute_reason: reason.trim(),
    }
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('escrow_transactions')
    .update(updateData)
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update escrow status' }, { status: 500 })
  }

  return NextResponse.json({ success: true, status: updateData.status })
}

// GET: get escrow transaction details
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const authClient: any = (supabase as any).auth
  const sessionData = authClient.getSession
    ? await authClient.getSession()
    : await authClient.getUser()
  const user = sessionData?.data?.session?.user || sessionData?.data?.user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { data, error } = await supabase
    .from('escrow_transactions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Escrow transaction not found' }, { status: 404 })
  }

  if (data.buyer_id !== user.id && data.seller_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ transaction: data })
}
