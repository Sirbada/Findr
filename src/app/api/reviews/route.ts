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

  const { reviewee_id, listing_id, listing_type, rating, comment } = body

  if (!reviewee_id || typeof reviewee_id !== 'string') {
    return NextResponse.json({ error: 'reviewee_id is required' }, { status: 400 })
  }

  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 })
  }

  if (user.id === reviewee_id) {
    return NextResponse.json({ error: 'You cannot review yourself' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      reviewer_id: user.id,
      reviewee_id,
      listing_id: listing_id || null,
      listing_type: listing_type || null,
      rating,
      comment: comment || null,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      // Unique constraint violation
      return NextResponse.json({ error: 'You have already reviewed this user for this listing' }, { status: 409 })
    }
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }

  return NextResponse.json({ review_id: data.id }, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')

  if (!userId) {
    return NextResponse.json({ error: 'user_id query param is required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      listing_id,
      listing_type,
      reviewer:reviewer_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }

  return NextResponse.json({ reviews: data || [] })
}
