import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SettingsClient from '@/components/dashboard/SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
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

  const { data: profile } = await supabase.from('profiles').select('display_name, email').eq('id', user.id).single()

  return (
    <DashboardLayout wedding={wedding} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      <SettingsClient
        weddingId={wedding.id}
        coupleNames={wedding.couple_names}
        weddingDate={wedding.wedding_date}
        profileName={profile?.display_name ?? ''}
        profileEmail={profile?.email ?? user.email ?? ''}
      />
    </DashboardLayout>
  )
}