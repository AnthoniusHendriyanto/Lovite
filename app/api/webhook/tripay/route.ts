import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHash } from 'crypto'

// Phase 4+: Tripay webhook callback. Verifies HMAC-SHA256 signature, then
// marks the payment paid + publishes the wedding. Inert without TRIPAY keys.
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY

export async function POST(request: Request) {
  if (!TRIPAY_PRIVATE_KEY) {
    return NextResponse.json({ error: 'Tripay belum dikonfigurasi' }, { status: 501 })
  }

  const body = await request.text()
  const signature = request.headers.get('x-callback-signature') ?? ''

  const computed = createHash('sha256')
    .update(`${TRIPAY_PRIVATE_KEY}${body}`)
    .digest('hex')

  if (computed !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)
  if (event.event !== 'payment_status') {
    return NextResponse.json({ success: true })
  }

  const { reference, status } = event.data
  const isPaid = status === 'PAID' || status === 'SETTLEMENT'

  const supabase = createAdminClient()
  const { data: payment } = await supabase
    .from('payments')
    .select('id, wedding_id')
    .eq('tripay_ref', reference)
    .single()

  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

  await supabase
    .from('payments')
    .update({
      status: isPaid ? 'paid' : 'failed',
      paid_at: isPaid ? new Date().toISOString() : null,
    })
    .eq('id', payment.id)

  if (isPaid) {
    await supabase.from('weddings').update({ status: 'published' }).eq('id', payment.wedding_id)
  }

  return NextResponse.json({ success: true })
}