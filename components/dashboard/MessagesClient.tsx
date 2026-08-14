'use client'

import { useMemo, useState } from 'react'
import type { Message } from '@/types'

type MessagesClientProps = {
  messages: Message[]
}

type Filter = 'all' | 'pending' | 'approved'

const avatarColors = ['bg-primary/10 text-primary', 'bg-[#E8F0FE] text-[#1A73E8]', 'bg-[#FCE8E6] text-[#D93025]']

export default function MessagesClient({ messages }: MessagesClientProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState<Record<string, boolean>>({})

  const counts = useMemo(() => {
    const pendingCount = messages.filter((m) => !m.approved).length
    const approvedCount = messages.filter((m) => m.approved).length
    return { all: messages.length, pending: pendingCount, approved: approvedCount }
  }, [messages])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return messages.filter((m) => {
      const matchesFilter =
        filter === 'all' || (filter === 'pending' && !m.approved) || (filter === 'approved' && m.approved)
      const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.message.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [messages, filter, query])

  async function setApproved(id: string, approved: boolean) {
    setPending((p) => ({ ...p, [id]: true }))
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      })
      if (!res.ok) throw new Error()
      window.location.reload()
    } finally {
      setPending((p) => ({ ...p, [id]: false }))
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Hapus ucapan ini?')) return
    await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    window.location.reload()
  }

  function initials(name: string): string {
    return name.split(' ').slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase()
  }

  function timeAgo(iso: string): string {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (seconds < 60) return 'Baru saja'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} menit lalu`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} jam lalu`
    return `${Math.floor(hours / 24)} hari lalu`
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-4xl text-text mb-2">Ucapan & Doa</h2>
          <p className="text-text-muted font-body">Kelola pesan dan doa dari tamu undangan Anda.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors font-label font-medium bg-white">
          <span className="material-symbols-outlined text-sm">download</span>
          Ekspor
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-label font-medium transition-colors border ${filter === 'all' ? 'bg-primary/10 text-primary border-primary/20' : 'text-text-muted hover:bg-stone-50 border-transparent'}`}
          >
            Semua ({counts.all})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-1.5 rounded-full text-sm font-label font-medium transition-colors border ${filter === 'pending' ? 'bg-primary/10 text-primary border-primary/20' : 'text-text-muted hover:bg-stone-50 border-transparent'}`}
          >
            Menunggu Moderasi ({counts.pending})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-1.5 rounded-full text-sm font-label font-medium transition-colors border ${filter === 'approved' ? 'bg-primary/10 text-primary border-primary/20' : 'text-text-muted hover:bg-stone-50 border-transparent'}`}
          >
            Disetujui ({counts.approved})
          </button>
        </div>
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border-none rounded-lg text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="Cari pesan..."
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-dashed border-stone-200 text-center">
            <p className="text-text-muted font-body text-sm">Belum ada ucapan.</p>
          </div>
        ) : (
          filtered.map((m, i) => (
            <div
              key={m.id}
              className={`bg-white p-6 rounded-xl shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 ${!m.approved ? 'border border-primary/30' : 'border border-stone-100'}`}
            >
              {!m.approved && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}
              <div className="flex-1 space-y-3 pl-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-headline text-lg ${avatarColors[i % avatarColors.length]}`}>
                    {initials(m.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-text font-body">{m.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-label">
                      <span className={`px-2 py-0.5 rounded-md ${m.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-50 text-text-muted'}`}>
                        {m.approved ? 'Disetujui' : 'Menunggu'}
                      </span>
                      <span className="text-text-muted/60">• {timeAgo(m.created_at)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-text/90 font-body leading-relaxed text-sm">{m.message}</p>
              </div>
              <div className="flex md:flex-col justify-end gap-2 md:w-40 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                {!m.approved && (
                  <button
                    onClick={() => setApproved(m.id, true)}
                    disabled={pending[m.id]}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-label text-sm font-medium disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                    Setujui
                  </button>
                )}
                <button
                  onClick={() => remove(m.id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Hapus"
                >
                  <span className="material-symbols-outlined">delete</span>
                  <span className="md:hidden">Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}