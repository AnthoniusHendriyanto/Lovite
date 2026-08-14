import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import RsvpClient from '@/components/dashboard/RsvpClient'

export const dynamic = 'force-dynamic'

export default async function RsvpPage() {
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

  const [{ data: rsvps }, { count: invitedCount }] = await Promise.all([
    supabase
      .from('rsvps')
      .select('*')
      .eq('wedding_id', wedding.id)
      .order('created_at', { ascending: false }),
    supabase.from('guests').select('id', { count: 'exact', head: true }).eq('wedding_id', wedding.id),
  ])

  return (
    <DashboardLayout wedding={wedding} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      <RsvpClient wedding={wedding} rsvps={rsvps ?? []} invitedCount={invitedCount ?? 0} />
    </DashboardLayout>
  )
}