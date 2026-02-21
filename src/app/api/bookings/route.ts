import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/security/validation'

const bookingSchema = z.object({
  property_id: z.string().uuid().optional(),
  vehicle_id: z.string().uuid().optional(),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
})

function isValidRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  return !Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime()) && s < e
}

export async function POST(request: Request) {
  const rate = checkRateLimit(`bookings:${request.headers.get('x-forwarded-for') || 'local'}`, 8, 60_000)
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { property_id, vehicle_id, start_date, end_date } = parsed.data
  if ((property_id && vehicle_id) || (!property_id && !vehicle_id)) {
    return NextResponse.json({ error: 'Invalid listing target' }, { status: 400 })
  }
  if (!isValidRange(start_date, end_date)) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
  }

  const supabase = await createClient()
  const authClient: any = (supabase as any).auth
  const sessionData = authClient.getSession
    ? await authClient.getSession()
    : await authClient.getUser()
  const user = sessionData?.data?.session?.user || sessionData?.data?.user
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const availabilityQuery = supabase
    .from('availability')
    .select('id')
    .lte('start_date', end_date)
    .gte('end_date', start_date)

  if (property_id) {
    availabilityQuery.eq('property_id', property_id)
  } else {
    availabilityQuery.eq('vehicle_id', vehicle_id as string)
  }

  const { data: overlaps } = await availabilityQuery.select('start_date,end_date')
  if (overlaps && overlaps.length > 0) {
    return NextResponse.json({ 
      error: 'Dates unavailable', 
      conflicts: overlaps.map((o: any) => ({ start_date: o.start_date, end_date: o.end_date }))
    }, { status: 409 })
  }

  let unitPrice = 0
  let currency = 'XAF'
  if (property_id) {
    const { data: pricing, error: pricingError } = await supabase
      .from('properties')
      .select('price_per_night,currency')
      .eq('id', property_id)
      .single()
    if (pricingError || !pricing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    unitPrice = pricing.price_per_night
    currency = pricing.currency || 'XAF'
  } else {
    const { data: pricing, error: pricingError } = await supabase
      .from('vehicles')
      .select('price_per_day,currency')
      .eq('id', vehicle_id as string)
      .single()
    if (pricingError || !pricing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    unitPrice = pricing.price_per_day
    currency = pricing.currency || 'XAF'
  }

  const nights = Math.max(1, Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24)))
  const total_price = unitPrice * nights

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      property_id: property_id || null,
      vehicle_id: vehicle_id || null,
      start_date,
      end_date,
      status: 'pending',
      total_price,
      currency,
    })
    .select('id')
    .single()

  if (bookingError) {
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 })
  }

  const { error: availabilityError } = await supabase.from('availability').insert({
    property_id: property_id || null,
    vehicle_id: vehicle_id || null,
    start_date,
    end_date,
    is_blocked: true,
    booking_id: booking.id,
    created_by: user.id,
  })

  if (availabilityError) {
    return NextResponse.json({ error: 'Availability lock failed' }, { status: 409 })
  }

  return NextResponse.json({ booking_id: booking.id, total_price }, { status: 201 })
}
