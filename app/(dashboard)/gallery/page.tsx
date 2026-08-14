import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { getMyWeddings } from '@/lib/queries'
import GalleryClient from '@/components/dashboard/GalleryClient'
import { TEMPLATE_META } from '@/templates/registry'
import type { Template } from '@/types'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [weddings, { data: templates }] = await Promise.all([
    getMyWeddings(user.id),
    supabase.from('templates').select('*').eq('active', true).order('tier'),
  ])

  const activeTemplateId = weddings[0]?.template_id ?? null

  const enriched = (templates ?? []).map((t: Template) => ({
    ...t,
    name: TEMPLATE_META[t.id]?.name ?? t.name,
    category: TEMPLATE_META[t.id]?.category ?? t.category,
  }))

  return (
    <DashboardLayout wedding={weddings[0]} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="font-display text-4xl lg:text-5xl text-text mb-3">Pilih Template</h1>
          <p className="text-text-muted text-lg max-w-2xl font-body leading-relaxed">
            Pilih desain yang mencerminkan kisah cinta Anda. Semua template dapat disesuaikan sepenuhnya.
          </p>
        </div>
        <GalleryClient templates={enriched} activeTemplateId={activeTemplateId} />
      </div>
    </DashboardLayout>
  )
}
