import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import PublishClient from '@/components/dashboard/PublishClient'

export const dynamic = 'force-dynamic'

export default async function PublishPage() {
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
    .limit(6)

  const publishedUrl = `https://${wedding.slug}.bymean.id`

  return (
    <DashboardLayout wedding={wedding} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      <PublishClient
        wedding={wedding}
        guests={guests ?? []}
        publishedUrl={publishedUrl}
      />
    </DashboardLayout>
  )
}
