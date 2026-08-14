import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { weddingId, name, phone } = await request.json()
  if (!weddingId || !name?.trim()) {
    return NextResponse.json({ error: 'weddingId dan nama wajib diisi' }, { status: 400 })
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
    .from('guests')
    .insert({ wedding_id: weddingId, name: name.trim(), phone: phone?.trim() || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ guest: data })
}
