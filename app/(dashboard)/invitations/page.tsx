import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { getMyWeddings } from '@/lib/queries'
import type { Wedding } from '@/types'

export const dynamic = 'force-dynamic'

function formatDate(date: string | null): string {
  if (!date) return 'Belum diatur'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T00:00:00`))
}

const tierLabel: Record<Wedding['tier'], string> = { free: 'Gratis', paid: 'Berbayar', premium: 'Premium' }

export default async function InvitationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const weddings = await getMyWeddings(user.id)

  return (
    <DashboardLayout wedding={weddings[0] ?? null} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-4xl font-bold text-text">Undangan</h1>
            <p className="text-text-muted mt-1 text-sm font-body">Kelola undangan pernikahan Anda.</p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm shadow-sm active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Buat Undangan
          </Link>
        </div>

        {weddings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-16 text-center">
            <div className="w-16 h-16 mx-auto bg-surface-alt rounded-full flex items-center justify-center mb-4 text-primary">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            </div>
            <h2 className="font-headline text-2xl font-medium text-text mb-2">Belum ada undangan</h2>
            <p className="font-body text-stone-500 mb-8">Mulai dengan memilih template favorit Anda.</p>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-body font-medium rounded-full py-3 px-8 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">palette</span>
              Pilih Template
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {weddings.map((w) => (
              <div key={w.id} className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">favorite</span>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-medium text-text">{w.couple_names ?? 'Undangan Pernikahan'}</h3>
                    <p className="text-sm text-text-muted font-body">
                      {formatDate(w.wedding_date)} • {tierLabel[w.tier as Wedding['tier']]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold font-label uppercase tracking-wider ${
                    w.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {w.status === 'published' ? 'Published' : w.status === 'pending_payment' ? 'Menunggu Pembayaran' : 'Draft'}
                  </span>
                  <Link
                    href={`/builder/${w.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-text hover:bg-stone-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit
                  </Link>
                  <Link
                    href="/publish"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">publish</span>
                    Publikasikan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}