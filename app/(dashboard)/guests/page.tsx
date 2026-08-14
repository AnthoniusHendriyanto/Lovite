import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import GuestsClient from '@/components/dashboard/GuestsClient'

export const dynamic = 'force-dynamic'

export default async function GuestsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!wedding) notFound()

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false })

  const { data: rsvps } = await supabase
    .from('rsvps')
    .select('guest_name, attendance')
    .eq('wedding_id', wedding.id)

  return (
    <DashboardLayout wedding={wedding} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      <GuestsClient weddingId={wedding.id} guests={guests ?? []} rsvps={rsvps ?? []} weddingSlug={wedding.slug} />
    </DashboardLayout>
  )
}
