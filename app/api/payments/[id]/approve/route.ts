import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Admin verifies a manual payment → marks paid + publishes the wedding.
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 })
  }

  const { data: payment } = await supabase
    .from('payments')
    .select('id, wedding_id, status')
    .eq('id', params.id)
    .single()

  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

  const { data: updated, error } = await supabase
    .from('payments')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', params.id)
    .select('id, status')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { error: weddingError } = await supabase
    .from('weddings')
    .update({ status: 'published' })
    .eq('id', payment.wedding_id)

  if (weddingError) return NextResponse.json({ error: weddingError.message }, { status: 500 })

  return NextResponse.json({ payment: updated })
}