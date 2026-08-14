import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: wedding } = await supabase
    .from('weddings')
    .select('user_id')
    .eq('id', params.id)
    .single()

  if (!wedding || wedding.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()

  const update: Record<string, unknown> = {}
  if (body.content) update.content = body.content
  if (body.theme) update.theme = body.theme
  if (body.couple_names) update.couple_names = body.couple_names
  if (body.wedding_date) update.wedding_date = body.wedding_date

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('weddings')
    .update(update)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ wedding: data })
}