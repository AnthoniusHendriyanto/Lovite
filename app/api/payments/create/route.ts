import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TIER_PRICES } from '@/types'
import type { PaymentChannel } from '@/types'

// Phase 4+: Tripay checkout creation. Active only when TRIPAY_* env keys exist.
const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE

export async function POST(request: Request) {
  if (!TRIPAY_API_KEY || !TRIPAY_PRIVATE_KEY || !TRIPAY_MERCHANT_CODE) {
    return NextResponse.json(
      { error: 'Tripay belum dikonfigurasi. Gunakan pembayaran manual.' },
      { status: 501 }
    )
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { weddingId, method } = body as { weddingId: string; method: PaymentChannel }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('user_id, tier, slug')
    .eq('id', weddingId)
    .single()

  if (!wedding || wedding.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      wedding_id: weddingId,
      amount: TIER_PRICES[wedding.tier as keyof typeof TIER_PRICES],
      channel: method ?? 'tripay_qris',
      status: 'pending',
    })
    .select()
    .single()

  if (paymentError) return NextResponse.json({ error: paymentError.message }, { status: 500 })

  const resp = await fetch('https://tripay.co.id/api-sandbox/transaction/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TRIPAY_API_KEY}` },
    body: JSON.stringify({
      method,
      merchant_ref: payment.id,
      amount: payment.amount,
      customer_name: user.email ?? 'ByMean Customer',
      customer_email: user.email,
      order_items: [{ sku: wedding.slug, name: `Template ${wedding.tier}`, price: payment.amount, quantity: 1 }],
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/publish?paid=1`,
      expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }),
  })

  const data = await resp.json()
  if (!resp.ok) {
    return NextResponse.json({ error: data.message ?? 'Gagal membuat pembayaran Tripay' }, { status: 502 })
  }

  await supabase.from('payments').update({ tripay_ref: data.data.reference }).eq('id', payment.id)

  return NextResponse.json({ checkout_url: data.data.checkout_url, payment })
}