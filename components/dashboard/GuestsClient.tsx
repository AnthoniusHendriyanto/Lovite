'use client'

import { useMemo, useState } from 'react'
import type { Guest, Rsvp } from '@/types'

type GuestsClientProps = {
  weddingId: string
  guests: Guest[]
  rsvps: Pick<Rsvp, 'guest_name' | 'attendance'>[]
}

const statusBadge = {
  hadir: 'bg-[#E8F5E9] text-[#2E7D32]',
  ragu: 'bg-[#FFF8E1] text-[#FF8F00]',
  tidak: 'bg-[#FFEBEE] text-[#C62828]',
  belum: 'bg-gray-100 text-gray-500',
} as const

export default function GuestsClient({ weddingId, guests, rsvps }: GuestsClientProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'hadir' | 'menunggu'>('all')
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rsvpByGuest = useMemo(() => {
    const map = new Map<string, Rsvp['attendance']>()
    for (const r of rsvps) {
      if (!map.has(r.guest_name)) map.set(r.guest_name, r.attendance)
    }
    return map
  }, [rsvps])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return guests.filter((g) => {
      const matchesQuery = !q || g.name.toLowerCase().includes(q)
      const status = rsvpByGuest.get(g.name) ?? (g.checked_in ? 'hadir' : 'belum')
      const matchesFilter =
        filter === 'all' ||
        (filter === 'hadir' && status === 'hadir') ||
        (filter === 'menunggu' && (status === 'ragu' || status === 'belum'))
      return matchesQuery && matchesFilter
    })
  }, [guests, rsvpByGuest, query, filter])

  const counts = useMemo(() => {
    const hadir = guests.filter((g) => (rsvpByGuest.get(g.name) ?? (g.checked_in ? 'hadir' : 'belum')) === 'hadir').length
    return { total: guests.length, hadir, menunggu: guests.length - hadir }
  }, [guests, rsvpByGuest])

  async function addGuest(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingId, name, phone }),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error ?? 'Gagal menambah tamu')
      }
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah tamu')
      setSaving(false)
    }
  }

  async function deleteGuest(id: string) {
    if (!window.confirm('Hapus tamu ini?')) return
    const res = await fetch(`/api/guests/${id}`, { method: 'DELETE' })
    if (res.ok) window.location.reload()
  }

  function statusOf(g: Guest): keyof typeof statusBadge {
    return rsvpByGuest.get(g.name) ?? (g.checked_in ? 'hadir' : 'belum')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold text-text">Daftar Tamu</h1>
          <p className="text-text-muted mt-1 text-sm font-body">Kelola undangan dan pantau status kehadiran tamu Anda.</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm shadow-sm active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Tamu
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm text-text transition-all"
            placeholder="Cari nama tamu…"
            type="text"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 transition-colors ${filter === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-white border border-stone-200 text-gray-600 hover:bg-stone-50'}`}
          >
            Semua <span className="ml-1 opacity-80 text-xs">{counts.total}</span>
          </button>
          <button
            onClick={() => setFilter('hadir')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 transition-colors ${filter === 'hadir' ? 'bg-primary text-white shadow-sm' : 'bg-white border border-stone-200 text-gray-600 hover:bg-stone-50'}`}
          >
            Hadir <span className="ml-1 text-xs opacity-70">{counts.hadir}</span>
          </button>
          <button
            onClick={() => setFilter('menunggu')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 transition-colors ${filter === 'menunggu' ? 'bg-primary text-white shadow-sm' : 'bg-white border border-stone-200 text-gray-600 hover:bg-stone-50'}`}
          >
            Menunggu <span className="ml-1 text-xs opacity-70">{counts.menunggu}</span>
          </button>
        </div>
      </div>

      {adding && (
        <form onSubmit={addGuest} className="bg-white rounded-xl shadow-sm border border-primary/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-medium text-text">Tambah Tamu</h3>
            <button type="button" onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5 font-label">Nama Lengkap</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm text-text"
                placeholder="Nama tamu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5 font-label">No. WhatsApp</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm text-text"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 font-body">{error}</p>}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-stone-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-5 py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
            >
              {saving ? 'Menyimpan…' : 'Simpan Tamu'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 text-gray-500 font-medium border-b border-stone-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-text">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted text-sm">
                    Belum ada tamu{guests.length === 0 ? '. Tambahkan tamu pertama Anda.' : ' yang cocok.'}
                  </td>
                </tr>
              ) : (
                filtered.map((g) => {
                  const status = statusOf(g)
                  return (
                    <tr key={g.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {g.name.split(' ').slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase()}
                          </div>
                          <span className="font-semibold">{g.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{g.phone ?? '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status === 'hadir' ? 'bg-[#2E7D32]' : status === 'ragu' ? 'bg-[#FF8F00]' : status === 'tidak' ? 'bg-[#C62828]' : 'bg-gray-400'}`}></span>
                          {status === 'hadir' ? 'Hadir' : status === 'ragu' ? 'Menunggu' : status === 'tidak' ? 'Tidak' : 'Belum'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => deleteGuest(g.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
