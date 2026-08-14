'use client'

import { useState } from 'react'

type SettingsClientProps = {
  weddingId: string
  coupleNames: string | null
  weddingDate: string | null
  profileName: string
  profileEmail: string
}

export default function SettingsClient({ weddingId, coupleNames, weddingDate, profileName, profileEmail }: SettingsClientProps) {
  const [names, setNames] = useState(coupleNames ?? '')
  const [date, setDate] = useState(weddingDate ?? '')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus('idle')
    try {
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couple_names: names, wedding_date: date || undefined }),
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-text">Pengaturan</h1>
        <p className="text-text-muted mt-1 text-sm font-body">Kelola pengaturan dasar undangan Anda.</p>
      </div>

      <form onSubmit={save} className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-6">
        <h3 className="font-headline text-xl font-medium text-text flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">wedding</span>
          Informasi Undangan
        </h3>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5 font-label">Nama Pasangan</label>
          <input
            value={names}
            onChange={(e) => setNames(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm text-text"
            placeholder="Raka & Nadia"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5 font-label">Tanggal Pernikahan</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm text-text"
          />
        </div>
        {status === 'ok' && <p className="text-sm text-emerald-600">Perubahan tersimpan.</p>}
        {status === 'error' && <p className="text-sm text-red-600">Gagal menyimpan perubahan.</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h3 className="font-headline text-xl font-medium text-text flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">account_circle</span>
          Akun
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-headline font-semibold text-xl">
            {profileName.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium text-text">{profileName}</p>
            <p className="text-sm text-text-muted">{profileEmail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}