'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Wedding, Rsvp } from '@/types'
import { buildWAShareLink } from '@/lib/utils'

type RsvpClientProps = {
  wedding: Wedding
  rsvps: Rsvp[]
  invitedCount: number
}

const statusBadge = {
  hadir: 'bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20',
  ragu: 'bg-[#FFC107]/10 text-[#FFC107] border border-[#FFC107]/20',
  tidak: 'bg-[#F44336]/10 text-[#F44336] border border-[#F44336]/20',
} as const

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'Baru saja'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} hari lalu`
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

export default function RsvpClient({ wedding, rsvps, invitedCount }: RsvpClientProps) {
  const [query, setQuery] = useState('')

  const stats = useMemo(() => {
    const hadir = rsvps.filter((r) => r.attendance === 'hadir').length
    const ragu = rsvps.filter((r) => r.attendance === 'ragu').length
    const tidak = rsvps.filter((r) => r.attendance === 'tidak').length
    return { hadir, ragu, tidak, total: rsvps.length }
  }, [rsvps])

  const pct = invitedCount > 0 ? Math.round((stats.hadir / invitedCount) * 100) : 0
  const donutLength = 251.2
  const hadirOffset = donutLength - (donutLength * stats.hadir) / (invitedCount || 1)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return q ? rsvps.filter((r) => r.guest_name.toLowerCase().includes(q)) : rsvps
  }, [rsvps, query])

  function sendReminder() {
    const link = buildWAShareLink(wedding.slug, process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'bymean.id')
    window.open(link, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline text-4xl text-text mb-2">RSVP</h2>
          <p className="font-body text-text-muted">Kelola konfirmasi kehadiran tamu Anda.</p>
        </div>
        <button
          onClick={sendReminder}
          className="bg-primary hover:bg-primary-dark text-white font-label font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">send</span>
          Kirim Pengingat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-sm text-text-muted uppercase tracking-wider">Total Diundang</span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">groups</span>
          </div>
          <span className="font-headline text-4xl font-semibold text-text">{invitedCount}</span>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-sm text-text-muted uppercase tracking-wider">Konfirmasi Hadir</span>
            <span className="material-symbols-outlined text-[#4CAF50] bg-[#4CAF50]/10 p-2 rounded-lg">check_circle</span>
          </div>
          <span className="font-headline text-4xl font-semibold text-text">{stats.hadir}</span>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-sm text-text-muted uppercase tracking-wider">Menunggu</span>
            <span className="material-symbols-outlined text-[#FFC107] bg-[#FFC107]/10 p-2 rounded-lg">schedule</span>
          </div>
          <span className="font-headline text-4xl font-semibold text-text">{stats.ragu + (invitedCount - stats.total)}</span>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label text-sm text-text-muted uppercase tracking-wider">Tidak Hadir</span>
            <span className="material-symbols-outlined text-[#F44336] bg-[#F44336]/10 p-2 rounded-lg">cancel</span>
          </div>
          <span className="font-headline text-4xl font-semibold text-text">{stats.tidak}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 lg:col-span-1">
          <h3 className="font-headline text-xl text-text mb-6">Ringkasan Konfirmasi</h3>
          <div className="flex items-center justify-center relative h-48 w-full">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#FFC107" strokeOpacity={0.3} strokeWidth="12" />
              <circle
                className="transition-all duration-1000"
                cx="50" cy="50" fill="transparent" r="40"
                stroke="#4CAF50"
                strokeDasharray={donutLength.toFixed(1)}
                strokeDashoffset={hadirOffset.toFixed(2)}
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-headline text-3xl font-semibold text-text">{pct}%</span>
              <span className="font-label text-xs text-text-muted">Hadir</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
              <span className="font-label text-sm text-text-muted">Hadir ({stats.hadir})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFC107] opacity-50"></div>
              <span className="font-label text-sm text-text-muted">Menunggu</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-xl text-text">Respon Terbaru</h3>
            <Link href="/rsvp" className="text-primary hover:text-primary-dark font-label text-sm font-semibold transition-colors">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-4">
            {rsvps.length === 0 ? (
              <p className="text-center text-text-muted text-sm py-8">Belum ada respon RSVP.</p>
            ) : (
              rsvps.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${r.attendance === 'hadir' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : r.attendance === 'ragu' ? 'bg-[#FFC107]/10 text-[#FFC107]' : 'bg-[#F44336]/10 text-[#F44336]'}`}>
                      <span className="material-symbols-outlined text-sm">{r.attendance === 'hadir' ? 'check' : r.attendance === 'ragu' ? 'more_horiz' : 'close'}</span>
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-text">{r.guest_name}</p>
                      <p className="font-label text-xs text-text-muted">
                        {r.attendance === 'hadir' ? `Membawa ${r.guest_count} tamu` : r.attendance === 'ragu' ? 'Belum memutuskan' : 'Tidak bisa hadir'}
                      </p>
                    </div>
                  </div>
                  <span className="font-label text-xs text-text-muted">{timeAgo(r.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <h3 className="font-headline text-xl text-text">Daftar Respon</h3>
          <div className="flex gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-stone-50 border-transparent rounded-lg font-body text-sm focus:border-primary focus:ring-primary w-64"
                placeholder="Cari nama tamu..."
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-stone-50 text-text-muted font-label font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Kehadiran</th>
                <th className="px-6 py-4">Jumlah Tamu</th>
                <th className="px-6 py-4">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-text-muted text-sm">Belum ada respon RSVP.</td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text">{r.guest_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge[r.attendance]}`}>
                        {r.attendance === 'hadir' ? 'Hadir' : r.attendance === 'ragu' ? 'Menunggu' : 'Tidak Hadir'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{r.guest_count}</td>
                    <td className="px-6 py-4 text-text-muted">{timeAgo(r.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}