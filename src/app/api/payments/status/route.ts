import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mtnMomoService } from '@/lib/payments/mtn-momo'
import { orangeMoneyService } from '@/lib/payments/orange-money'

/**
 * Check payment status
 * GET /api/payments/status?ref=xxx&provider=momo|orange
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref')
  const provider = searchParams.get('provider')

  if (!ref || !provider) {
    return NextResponse.json({ error: 'ref and provider are required' }, { status: 400 })
  }

  try {
    let providerStatus

    if (provider === 'momo') {
      providerStatus = await mtnMomoService.checkStatus(ref)
    } else if (provider === 'orange') {
      providerStatus = await orangeMoneyService.checkStatus(ref)
    } else {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    // Also check our DB
    const supabase = await createClient()
    const { data: transaction } = await supabase
      .from('transactions')
      .select('status, updated_at')
      .eq('payment_reference', ref)
      .single()

    return NextResponse.json({
      provider: providerStatus,
      database: transaction || null,
    })
  } catch (error) {
    console.error('[Payment Status] Error:', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}
