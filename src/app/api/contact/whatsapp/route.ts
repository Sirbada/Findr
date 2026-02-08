import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Rate limiting: Simple IP-based (consider Redis/Upstash for production)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

function getRealIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  return request.ip || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10

  const current = rateLimit.get(ip)
  
  if (!current || now > current.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listing_id')
    
    if (!listingId) {
      return NextResponse.json(
        { success: false, error: 'listing_id parameter is required' },
        { status: 400 }
      )
    }

    // Rate limiting check
    const clientIP = getRealIP(request)
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      )
    }

    const supabase = await createClient()
    
    // Fetch listing with owner's phone number
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select(`
        id, 
        title, 
        user_id,
        whatsapp_number,
        profiles!listings_user_id_fkey (
          id,
          phone,
          full_name
        )
      `)
      .eq('id', listingId)
      .eq('status', 'active')
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found or not active' },
        { status: 404 }
      )
    }

    // Get phone number (prioritize whatsapp_number, fallback to user profile phone)
    const phone = listing.whatsapp_number || listing.profiles?.phone
    
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Owner contact information not available' },
        { status: 404 }
      )
    }

    // Clean phone number (remove +, spaces, dashes)
    const cleanPhone = phone.replace(/[\+\s\-\(\)]/g, '')
    
    // Ensure it starts with country code (default to Cameroon +237 if local number)
    const formattedPhone = cleanPhone.startsWith('237') 
      ? cleanPhone 
      : cleanPhone.startsWith('6') || cleanPhone.startsWith('2') 
        ? `237${cleanPhone}` 
        : cleanPhone

    // Create WhatsApp message
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par cette annonce: "${listing.title}"\n\nVu sur Findr.cm`
    )
    
    const whatsappURL = `https://wa.me/${formattedPhone}?text=${message}`

    // Log contact event for analytics (no personal data stored)
    // RLS Policy needed: Allow anonymous insert for analytics
    await supabase
      .from('listing_contacts')
      .insert([
        {
          listing_id: listingId,
          contact_method: 'whatsapp',
          contacted_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    return NextResponse.json({
      success: true,
      data: {
        whatsapp_url: whatsappURL,
        listing_title: listing.title,
        contact_available: true
      }
    })

  } catch (error) {
    console.error('WhatsApp contact API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}