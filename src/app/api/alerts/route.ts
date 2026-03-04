import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: save a search alert
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
  if (!body || !body.category) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { category, filters, label, alert_frequency } = body

  const validCategories = ['housing', 'cars', 'services', 'emplois']
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const validFrequencies = ['instant', 'daily', 'weekly']
  const frequency = validFrequencies.includes(alert_frequency) ? alert_frequency : 'daily'

  const { data, error } = await supabase
    .from('saved_searches')
    .insert({
      user_id: user.id,
      category,
      filters: filters || {},
      label: label || null,
      alert_frequency: frequency,
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to save search' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}

// GET: list user's saved searches
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
    .from('saved_searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch saved searches' }, { status: 500 })
  }

  return NextResponse.json({ saved_searches: data })
}

// DELETE: remove a saved search (query param ?id=)
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const authClient: any = (supabase as any).auth
  const sessionData = authClient.getSession
    ? await authClient.getSession()
    : await authClient.getUser()
  const user = sessionData?.data?.session?.user || sessionData?.data?.user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
  }

  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete saved search' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
