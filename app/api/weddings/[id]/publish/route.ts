import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: wedding } = await supabase
    .from('weddings')
    .select('user_id, tier, status')
    .eq('id', params.id)
    .single()

  if (!wedding || wedding.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Free tier publishes immediately; paid/premium require payment first.
  if (wedding.tier === 'free') {
    const { data, error } = await supabase
      .from('weddings')
      .update({ status: 'published' })
      .eq('id', params.id)
      .select('id, slug, status')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ wedding: data })
  }

  const { data, error } = await supabase
    .from('weddings')
    .update({ status: 'pending_payment' })
    .eq('id', params.id)
    .select('id, slug, tier, status')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ wedding: data, paymentRequired: true })
}