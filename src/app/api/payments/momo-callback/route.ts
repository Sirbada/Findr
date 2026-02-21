import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const payloadSchema = z.object({
  status: z.string(),
  referenceId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  phone: z.string(),
  timestamp: z.string(),
  signature: z.string(),
})

function verifySignature(raw: string, signature: string, secret: string) {
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(request: Request) {
  const secret = process.env.MOMO_WEBHOOK_SECRET || ''
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const raw = await request.text()
  const data = JSON.parse(raw)
  const parsed = payloadSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (!verifySignature(raw, parsed.data.signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const supabase = await createClient()
  if (parsed.data.status === 'SUCCESSFUL') {
    await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', parsed.data.orderId)
  }

  return NextResponse.json({ ok: true })
}
