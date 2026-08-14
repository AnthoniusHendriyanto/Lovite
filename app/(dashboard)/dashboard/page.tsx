import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { getMyWeddings } from '@/lib/queries'

export const dynamic = 'force-dynamic'

function daysUntil(date: string | null): number | null {
  if (!date) return null
  const target = new Date(`${date}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

function formatDate(date: string | null): string | null {
  if (!date) return null
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

const rsvpBadge = {
  hadir: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  ragu: 'bg-amber-50 text-amber-700 border border-amber-100',
  tidak: 'bg-rose-50 text-rose-700 border border-rose-100',
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const weddings = await getMyWeddings(user.id)
  const wedding = weddings[0] ?? null

  const [{ data: rsvps }, { data: messages }] = await Promise.all([
    supabase
      .from('rsvps')
      .select('id, guest_name, attendance, created_at')
      .eq('wedding_id', wedding?.id ?? '')
      .order('created_at', { ascending: false })
      .limit(4),
    supabase.from('messages').select('id').eq('wedding_id', wedding?.id ?? ''),
  ])

  const confirmed = rsvps?.filter((r) => r.attendance === 'hadir').length ?? 0
  const waiting = rsvps?.filter((r) => r.attendance === 'ragu').length ?? 0
  const messagesCount = messages?.length ?? 0
  const days = daysUntil(wedding?.wedding_date ?? null)

  return (
    <DashboardLayout wedding={wedding} avatarUrl={user.user_metadata?.avatar_url as string | undefined}>
      {!wedding ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-16 text-center mt-8">
          <div className="w-16 h-16 mx-auto bg-surface-alt rounded-full flex items-center justify-center mb-4 text-primary">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </div>
          <h1 className="font-headline text-3xl font-medium text-text mb-2">Buat undangan pertamamu</h1>
          <p className="font-body text-stone-500 mb-8">Pilih template yang mencerminkan kisah cintamu.</p>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-body font-medium rounded-full py-3 px-8 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Pilih Template
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-medium text-text tracking-tight">Ringkasan</h1>
            <p className="font-body text-stone-500 mt-2">Selamat datang kembali, berikut perkembangan undangan pernikahan Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-stone-100 flex flex-col justify-between hover:border-stone-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
              </div>
              <div>
                <p className="font-body text-stone-500 text-sm mb-1">Tamu Dikonfirmasi</p>
                <p className="font-headline text-3xl font-medium text-text">{confirmed}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-stone-100 flex flex-col justify-between hover:border-stone-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">hourglass_empty</span>
                </div>
              </div>
              <div>
                <p className="font-body text-stone-500 text-sm mb-1">Menunggu</p>
                <p className="font-headline text-3xl font-medium text-text">{waiting}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-stone-100 flex flex-col justify-between hover:border-stone-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-surface-alt text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">forum</span>
                </div>
              </div>
              <div>
                <p className="font-body text-stone-500 text-sm mb-1">Ucapan Masuk</p>
                <p className="font-headline text-3xl font-medium text-text">{messagesCount}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-stone-100 flex flex-col justify-between hover:border-stone-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
              </div>
              <div>
                <p className="font-body text-stone-500 text-sm mb-1">Dilihat</p>
                <p className="font-headline text-3xl font-medium text-text">—</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-headline text-2xl font-medium text-text">RSVP Terbaru</h3>
                <Link href="/rsvp" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                  Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="overflow-x-auto">
                {rsvps && rsvps.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-alt text-stone-500 text-xs font-semibold font-label uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Nama Tamu</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Waktu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-body text-sm">
                      {rsvps.map((r) => (
                        <tr key={r.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold text-xs">
                              {r.guest_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-text">{r.guest_name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${rsvpBadge[r.attendance as keyof typeof rsvpBadge]}`}>
                              {r.attendance === 'hadir' ? 'Hadir' : r.attendance === 'ragu' ? 'Menunggu' : 'Tidak'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-stone-500">
                            {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(r.created_at))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-10 text-center">
                    <p className="font-body text-stone-500">Belum ada RSVP masuk.</p>
                    <p className="font-body text-sm text-stone-400 mt-1">Bagikan undangan untuk mulai mengumpulkan konfirmasi.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-stone-100 text-center relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-surface-alt rounded-full opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-surface-alt rounded-full opacity-50"></div>
                <div className="relative z-10 w-full">
                  <div className="w-16 h-16 mx-auto bg-stone-50 rounded-full flex items-center justify-center mb-4 text-primary">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                  </div>
                  <h3 className="font-headline text-2xl font-medium text-text mb-2">Hari Bahagia Anda</h3>
                  <div className="inline-block bg-surface-alt px-4 py-2 rounded-full mb-6">
                    <p className="font-body text-sm font-semibold text-primary">{formatDate(wedding.wedding_date) ?? 'Belum diatur'}</p>
                  </div>
                  <div className="mb-8">
                    <p className="text-5xl font-headline font-medium text-text">{days ?? '—'}</p>
                    <p className="text-sm font-label text-stone-500 uppercase tracking-widest mt-1">Hari Lagi</p>
                  </div>
                  <Link
                    href={`/builder/${wedding.id}`}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-body font-medium rounded-full py-3 px-6 transition-all shadow-sm active:scale-95 flex justify-center items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit Undangan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
