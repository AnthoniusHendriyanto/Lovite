import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TIER_PRICES } from '@/types'
import type { PaymentChannel } from '@/types'

// Couple submits a manual payment (proof uploaded to Supabase Storage).
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { weddingId, proofUrl, channel = 'manual' } = body as {
    weddingId: string
    proofUrl?: string
    channel?: PaymentChannel
  }

  if (!weddingId) {
    return NextResponse.json({ error: 'weddingId is required' }, { status: 400 })
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('user_id, tier, status')
    .eq('id', weddingId)
    .single()

  if (!wedding || wedding.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const amount = TIER_PRICES[wedding.tier as keyof typeof TIER_PRICES]

  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      wedding_id: weddingId,
      amount,
      channel,
      status: 'pending',
      proof_url: proofUrl ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ payment })
}