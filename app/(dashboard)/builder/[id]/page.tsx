import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import BuilderClient from '@/components/builder/BuilderClient'

export const dynamic = 'force-dynamic'

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!wedding || wedding.user_id !== user.id) notFound()

  return (
    <DashboardLayout wedding={wedding} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      <BuilderClient wedding={wedding} />
    </DashboardLayout>
  )
}
