'use client'

import { useState } from 'react'
import type { GiftAccount, GiftType } from '@/types'

type GiftsClientProps = {
  weddingId: string
  giftAccounts: GiftAccount[]
}

export default function GiftsClient({ weddingId, giftAccounts }: GiftsClientProps) {
  const banks = giftAccounts.filter((a) => a.type === 'bank')
  const ewallets = giftAccounts.filter((a) => a.type === 'ewallet' || a.type === 'qris')

  const [addingType, setAddingType] = useState<GiftType | null>(null)
  const [label, setLabel] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addAccount(e: React.FormEvent) {
    e.preventDefault()
    if (!addingType || !label.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/gift-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingId, type: addingType, label, accountNumber }),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error ?? 'Gagal menyimpan')
      }
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
      setSaving(false)
    }
  }

  async function deleteAccount(id: string) {
    if (!window.confirm('Hapus rekening ini?')) return
    const res = await fetch(`/api/gift-accounts/${id}`, { method: 'DELETE' })
    if (res.ok) window.location.reload()
  }

  function initials(label: string): string {
    return label.replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase() || label.charAt(0).toUpperCase()
  }

  function AddForm() {
    return (
      <form onSubmit={addAccount} className="mt-4 border border-primary/20 rounded-lg p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-text mb-1 font-label">Nama Bank / E-Wallet</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm"
            placeholder={addingType === 'bank' ? 'Bank BCA' : 'GoPay'}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text mb-1 font-label">Nomor Rekening</label>
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm"
            placeholder={addingType === 'bank' ? '8890112233' : '08123456789'}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving || !label.trim()}
            className="px-4 py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-lg text-sm font-medium"
          >
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={() => { setAddingType(null); setError(null) }}
            className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-gray-600 hover:bg-stone-50"
          >
            Batal
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-medium text-text mb-2">Amplop Digital</h1>
        <p className="text-text-muted font-body">Kelola rekening bank dan dompet digital untuk menerima hadiah dari tamu.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <section className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-medium text-text flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance</span>
              Bank Tujuan
            </h2>
          </div>
          <div className="space-y-4 flex-1">
            {banks.length === 0 && (
              <p className="text-sm text-text-muted text-center py-6">Belum ada rekening bank. Tambahkan rekening tujuan Anda.</p>
            )}
            {banks.map((b) => (
              <div key={b.id} className="border border-stone-200 rounded-lg p-4 hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-stone-50 flex items-center justify-center text-primary font-bold">{initials(b.label)}</div>
                    <div>
                      <h3 className="font-semibold text-text">{b.label}</h3>
                      <p className="text-sm text-text-muted font-mono">{b.account_number ?? '—'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAccount(b.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {addingType === 'bank' ? (
            <AddForm />
          ) : (
            <button
              onClick={() => setAddingType('bank')}
              className="mt-6 w-full border-2 border-dashed border-stone-300 rounded-lg py-4 text-text-muted hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <span className="material-symbols-outlined">add</span>
              Tambah Rekening
            </button>
          )}
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-medium text-text flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              Dompet Digital
            </h2>
          </div>
          <div className="space-y-4 flex-1">
            {ewallets.length === 0 && (
              <p className="text-sm text-text-muted text-center py-6">Belum ada dompet digital.</p>
            )}
            {ewallets.map((e) => (
              <div key={e.id} className="border border-stone-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">smartphone</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{e.label}</h3>
                    <p className="text-sm text-text-muted font-mono">{e.account_number ?? 'Belum diatur'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-primary font-medium">Ditampilkan</span>
                  <button
                    onClick={() => deleteAccount(e.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {addingType === 'ewallet' ? (
            <AddForm />
          ) : (
            <button
              onClick={() => setAddingType('ewallet')}
              className="mt-6 w-full border-2 border-dashed border-stone-300 rounded-lg py-4 text-text-muted hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <span className="material-symbols-outlined">add</span>
              Tambah E-Wallet
            </button>
          )}
        </section>
      </div>

      <div className="flex justify-end pt-6 border-t border-stone-100">
        <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">save</span>
          Simpan Perubahan
        </button>
      </div>
    </div>
  )
}