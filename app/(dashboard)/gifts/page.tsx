import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import GiftsClient from '@/components/dashboard/GiftsClient'

export const dynamic = 'force-dynamic'

export default async function GiftsPage() {
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

  const { data: giftAccounts } = await supabase
    .from('gift_accounts')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: true })

  return (
    <DashboardLayout wedding={wedding} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      <GiftsClient weddingId={wedding.id} giftAccounts={giftAccounts ?? []} />
    </DashboardLayout>
  )
}