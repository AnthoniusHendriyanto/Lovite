import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Public checkin endpoint: guest scans QR → POST { token } → marks checked_in=true.
// Uses service role (admin client) since RLS prevents public updates to guests table.
export async function POST(request: Request) {
  const body = await request.json()
  const { token } = body as { token: string }

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: guest } = await supabase
    .from('guests')
    .select('id, name, wedding_id')
    .eq('link_token', token)
    .single()

  if (!guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('guests')
    .update({ checked_in: true })
    .eq('id', guest.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ guest_name: guest.name, wedding_id: guest.wedding_id })
}