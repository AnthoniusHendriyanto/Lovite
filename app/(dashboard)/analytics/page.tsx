import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import AnalyticsClient from '@/components/dashboard/AnalyticsClient'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
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

  const [{ count: guestCount }, { count: rsvpCount }, { count: messageCount }, { data: rsvps }] =
    await Promise.all([
      supabase.from('guests').select('id', { count: 'exact', head: true }).eq('wedding_id', wedding.id),
      supabase.from('rsvps').select('id', { count: 'exact', head: true }).eq('wedding_id', wedding.id),
      supabase.from('messages').select('id', { count: 'exact', head: true }).eq('wedding_id', wedding.id),
      supabase
        .from('rsvps')
        .select('attendance')
        .eq('wedding_id', wedding.id),
    ])

  const hadir = rsvps?.filter((r) => r.attendance === 'hadir').length ?? 0
  const tidak = rsvps?.filter((r) => r.attendance === 'tidak').length ?? 0

  return (
    <DashboardLayout wedding={wedding} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      <AnalyticsClient
        guestCount={guestCount ?? 0}
        rsvpCount={rsvpCount ?? 0}
        messageCount={messageCount ?? 0}
        hadir={hadir}
        tidak={tidak}
      />
    </DashboardLayout>
  )
}