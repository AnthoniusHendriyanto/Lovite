import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { GiftType } from '@/types'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { weddingId, type, label, accountNumber } = await request.json()

  if (!weddingId || !type || !label?.trim()) {
    return NextResponse.json({ error: 'weddingId, type, dan label wajib diisi' }, { status: 400 })
  }

  const validTypes: GiftType[] = ['bank', 'ewallet', 'qris']
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'type tidak valid' }, { status: 400 })
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('user_id')
    .eq('id', weddingId)
    .single()

  if (!wedding || wedding.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('gift_accounts')
    .insert({
      wedding_id: weddingId,
      type,
      label: label.trim(),
      account_number: accountNumber?.trim() || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ giftAccount: data })
}