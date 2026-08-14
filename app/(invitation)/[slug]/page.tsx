import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTemplateComponent } from '@/templates/registry'
import type { InvitationData } from '@/types'
import type { Metadata } from 'next'

type Props = {
  params: { slug: string }
  searchParams: { to?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: wedding } = await supabase
    .from('weddings')
    .select('couple_names, wedding_date, content')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!wedding) return { title: 'ByMean' }

  return {
    title: `${wedding.couple_names} — ByMean`,
    description: `Undangan pernikahan ${wedding.couple_names}`,
    openGraph: {
      title: `${wedding.couple_names}`,
      description: `Kami mengundang kamu ke pernikahan kami 💍`,
      type: 'website',
    },
  }
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const supabase = createClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!wedding) notFound()

  const [{ data: template }, { data: giftAccounts }, { data: messages }, { data: rsvps }] =
    await Promise.all([
      supabase.from('templates').select('*').eq('id', wedding.template_id).single(),
      supabase.from('gift_accounts').select('*').eq('wedding_id', wedding.id),
      supabase.from('messages').select('*').eq('wedding_id', wedding.id).eq('approved', true),
      supabase.from('rsvps').select('attendance').eq('wedding_id', wedding.id),
    ])

  if (!template) notFound()

  const rsvpCount = {
    hadir: rsvps?.filter((r) => r.attendance === 'hadir').length ?? 0,
    tidak: rsvps?.filter((r) => r.attendance === 'tidak').length ?? 0,
    ragu:  rsvps?.filter((r) => r.attendance === 'ragu').length ?? 0,
    total: rsvps?.length ?? 0,
  }

  const data: InvitationData = {
    wedding,
    template,
    gift_accounts: giftAccounts ?? [],
    messages: messages ?? [],
    rsvp_count: rsvpCount,
  }

  const Template = await getTemplateComponent(wedding.template_id)
  if (!Template) notFound()

  const guestName = searchParams.to

  return <Template data={data} guestName={guestName} />
}
