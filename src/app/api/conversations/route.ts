import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.listing_id || !body?.listing_type || !body?.seller_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { listing_id, listing_type, seller_id } = body

  // Upsert conversation based on unique constraint
  const { data: conversation, error } = await supabase
    .from('conversations')
    .upsert(
      {
        listing_id,
        listing_type,
        buyer_id: user.id,
        seller_id,
      },
      {
        onConflict: 'listing_id,listing_type,buyer_id,seller_id',
        ignoreDuplicates: false,
      }
    )
    .select('id')
    .single()

  if (error) {
    // If upsert fails (e.g. table doesn't exist), try to select existing
    const { data: existing, error: selectError } = await supabase
      .from('conversations')
      .select('id')
      .eq('listing_id', listing_id)
      .eq('listing_type', listing_type)
      .eq('buyer_id', user.id)
      .eq('seller_id', seller_id)
      .single()

    if (selectError || !existing) {
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
    }
    return NextResponse.json({ conversation_id: existing.id }, { status: 200 })
  }

  return NextResponse.json({ conversation_id: conversation.id }, { status: 201 })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      id,
      listing_id,
      listing_type,
      buyer_id,
      seller_id,
      last_message_at,
      created_at
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })

  if (error) {
    return NextResponse.json({ conversations: [] }, { status: 200 })
  }

  // Fetch latest message for each conversation
  const conversationsWithMessages = await Promise.all(
    (conversations || []).map(async (conv) => {
      const { data: messages } = await supabase
        .from('messages')
        .select('content, created_at, sender_id')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)

      const latestMessage = messages?.[0] || null

      // Determine the other party
      const otherUserId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id

      // Try to get other user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', otherUserId)
        .single()

      return {
        ...conv,
        latest_message: latestMessage,
        other_user: profile || { full_name: null, phone: null },
        is_buyer: conv.buyer_id === user.id,
      }
    })
  )

  return NextResponse.json({ conversations: conversationsWithMessages }, { status: 200 })
}
