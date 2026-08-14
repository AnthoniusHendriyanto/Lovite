import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const body = await request.json()

  const { wedding_id, guest_name, attendance, guest_count } = body ?? {}

  if (!wedding_id || !guest_name || !attendance) {
    return NextResponse.json({ error: 'wedding_id, guest_name, dan attendance wajib diisi' }, { status: 400 })
  }
  if (!['hadir', 'tidak', 'ragu'].includes(attendance)) {
    return NextResponse.json({ error: 'attendance tidak valid' }, { status: 400 })
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id')
    .eq('id', wedding_id)
    .eq('status', 'published')
    .single()

  if (!wedding) return NextResponse.json({ error: 'Wedding tidak ditemukan' }, { status: 404 })

  const { error } = await supabase
    .from('rsvps')
    .insert({
      wedding_id,
      guest_name,
      attendance,
      guest_count: Number(guest_count) || 1,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}