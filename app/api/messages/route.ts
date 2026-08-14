import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const body = await request.json()

  const { wedding_id, name, message } = body ?? {}

  if (!wedding_id || !name || !message) {
    return NextResponse.json({ error: 'wedding_id, name, dan message wajib diisi' }, { status: 400 })
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id')
    .eq('id', wedding_id)
    .eq('status', 'published')
    .single()

  if (!wedding) return NextResponse.json({ error: 'Wedding tidak ditemukan' }, { status: 404 })

  const { error } = await supabase
    .from('messages')
    .insert({ wedding_id, name, message, approved: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}