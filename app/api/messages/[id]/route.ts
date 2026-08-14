import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: message } = await supabase
    .from('messages')
    .select('wedding_id')
    .eq('id', params.id)
    .single()

  if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

  const { data: wedding } = await supabase
    .from('weddings')
    .select('user_id')
    .eq('id', message.wedding_id)
    .single()

  if (!wedding || wedding.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { data, error } = await supabase
    .from('messages')
    .update({ approved: Boolean(body.approved) })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: data })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: message } = await supabase
    .from('messages')
    .select('wedding_id')
    .eq('id', params.id)
    .single()

  if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

  const { data: wedding } = await supabase
    .from('weddings')
    .select('user_id')
    .eq('id', message.wedding_id)
    .single()

  if (!wedding || wedding.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase.from('messages').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}