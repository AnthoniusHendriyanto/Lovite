'use client'
import { useState } from 'react'

type State = 'idle' | 'loading' | 'done' | 'error'

export default function RSVPForm({ weddingId }: { weddingId: string }) {
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState<'hadir' | 'tidak'>('hadir')
  const [count, setCount] = useState(1)
  const [state, setState] = useState<State>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    const res = await fetch('/api/rsvps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wedding_id: weddingId, guest_name: name, attendance, guest_count: count }),
    })
    setState(res.ok ? 'done' : 'error')
  }

  if (state === 'done') {
    return (
      <div className="bg-white/95 rounded-2xl w-full p-8 md:p-10 text-center shadow-[0_10px_30px_-10px_rgba(46,36,48,0.05)] border border-white/50">
        <span className="material-symbols-outlined text-primary text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
        <h3 className="font-headline text-3xl text-text mb-2">Terima kasih!</h3>
        <p className="font-body text-sm text-text/70">
          Konfirmasi kehadiran Anda sudah kami terima.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-white/95 rounded-2xl w-full p-6 md:p-10 space-y-6 shadow-[0_10px_30px_-10px_rgba(46,36,48,0.05)] border border-white/50">
      <div className="space-y-2">
        <label htmlFor="rsvp-name" className="block font-label text-sm font-semibold text-text">
          Nama Lengkap
        </label>
        <input
          id="rsvp-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama Anda"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary bg-white/50 text-text font-body transition-colors outline-none"
        />
      </div>

      <div className="space-y-3">
        <label className="block font-label text-sm font-semibold text-text">Status Kehadiran</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'hadir' as const, icon: 'check_circle', label: 'Hadir' },
            { value: 'tidak' as const, icon: 'cancel', label: 'Tidak Hadir' },
          ].map((opt) => (
            <label key={opt.value} className="relative cursor-pointer">
              <input
                type="radio"
                name="attendance"
                value={opt.value}
                checked={attendance === opt.value}
                onChange={() => setAttendance(opt.value)}
                className="peer sr-only"
              />
              <div className="w-full text-center px-4 py-4 rounded-lg border border-gray-200 bg-white peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:bg-gray-50">
                <span className={`material-symbols-outlined mb-2 text-3xl ${attendance === opt.value ? 'text-primary' : 'text-gray-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {opt.icon}
                </span>
                <div className={`font-body font-medium ${attendance === opt.value ? 'text-primary' : 'text-text/70'}`}>
                  {opt.label}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-label text-sm font-semibold text-text">Jumlah Tamu / Pendamping</label>
        <div className="flex items-center w-full max-w-xs border border-gray-200 rounded-lg overflow-hidden bg-white/50">
          <button
            type="button"
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            className="w-12 h-12 flex items-center justify-center text-text/60 hover:text-primary hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <input
            readOnly
            value={count}
            min={1}
            max={10}
            className="flex-grow h-12 text-center border-none focus:ring-0 font-body font-medium text-lg bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(10, c + 1))}
            className="w-12 h-12 flex items-center justify-center text-text/60 hover:text-primary hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      {state === 'error' && (
        <p className="font-label text-sm text-red-600">Gagal mengirim. Coba lagi ya.</p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full bg-primary text-white font-label font-semibold text-sm uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
      >
        {state === 'loading' ? 'Mengirim...' : 'Kirim Konfirmasi'}
      </button>
    </form>
  )
}