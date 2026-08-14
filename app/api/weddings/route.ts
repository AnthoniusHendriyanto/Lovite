import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'
import type { InvitationContent, ThemeData } from '@/types'

const DEFAULT_CONTENT: InvitationContent = {
  couple: {
    partner1_name: '',
    partner1_full_name: '',
    partner1_parents: '',
    partner2_name: '',
    partner2_full_name: '',
    partner2_parents: '',
    photo_url: null,
  },
  events: [{ name: 'Akad Nikah', date: '', time: '', venue: '', address: '', maps_url: null }],
  love_story: [],
  gallery: [],
  music_url: null,
  streaming_url: null,
  opening_text: '',
  closing_text: '',
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { templateId, coupleNames, weddingDate } = body

  if (!templateId) {
    return NextResponse.json({ error: 'templateId is required' }, { status: 400 })
  }

  const { data: template } = await supabase
    .from('templates')
    .select('id, default_theme, tier')
    .eq('id', templateId)
    .single()

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  const baseSlug = coupleNames ? generateSlug(coupleNames) : 'undangan'
  let slug = baseSlug || 'undangan'
  let attempts = 0

  while (attempts < 5) {
    const { error } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: existing } = await supabase.from('weddings').select('id').eq('slug', slug).maybeSingle()

    if (!existing) break
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
    attempts++
  }

  const theme = (template.default_theme ?? {}) as ThemeData

  const { data: wedding, error } = await supabase
    .from('weddings')
    .insert({
      user_id: user.id,
      slug,
      template_id: templateId,
      tier: template.tier,
      content: DEFAULT_CONTENT,
      theme,
      status: 'draft',
      couple_names: coupleNames || null,
      wedding_date: weddingDate || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ wedding })
}