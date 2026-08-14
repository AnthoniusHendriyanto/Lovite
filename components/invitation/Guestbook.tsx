'use client'
import { useState } from 'react'
import type { Message } from '@/types'

type State = 'idle' | 'loading' | 'done' | 'error'

export default function Guestbook({
  weddingId,
  initialMessages,
}: {
  weddingId: string
  initialMessages: Message[]
}) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [state, setState] = useState<State>('idle')
  const [pending, setPending] = useState<Message[]>([])

  const all = [...pending, ...initialMessages]

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wedding_id: weddingId, name, message: text }),
    })
    if (res.ok) {
      setPending((p) => [
        {
          id: `pending-${Date.now()}`,
          wedding_id: weddingId,
          name,
          message: text,
          approved: false,
          created_at: new Date().toISOString(),
        },
        ...p,
      ])
      setName('')
      setText('')
      setState('done')
    } else {
      setState('error')
    }
  }

  function initialOf(n: string) {
    return n.trim().charAt(0).toUpperCase() || '?'
  }

  return (
    <>
      <section className="w-full bg-surface rounded-xl shadow-[0_8px_30px_rgba(46,36,48,0.04)] p-6 md:p-8 mb-12 border border-primary/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-16 h-16 opacity-10 pointer-events-none text-primary">
          <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0C40 0 100 60 100 100L0 100L0 0Z" fill="currentColor" />
          </svg>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-5 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="guestbook-name" className="font-label text-xs font-semibold uppercase tracking-wider text-text/80 pl-1">
              Nama
            </label>
            <input
              id="guestbook-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              className="w-full bg-surface-alt/50 border border-text/10 rounded-lg px-4 py-3 font-body text-sm text-text placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="guestbook-message" className="font-label text-xs font-semibold uppercase tracking-wider text-text/80 pl-1">
              Pesan
            </label>
            <textarea
              id="guestbook-message"
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tulis ucapan dan doa..."
              className="w-full bg-surface-alt/50 border border-text/10 rounded-lg px-4 py-3 font-body text-sm text-text placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none"
            />
          </div>
          {state === 'error' && (
            <p className="font-label text-sm text-red-600 pl-1">Gagal mengirim. Coba lagi ya.</p>
          )}
          <button
            type="submit"
            disabled={state === 'loading'}
            className="mt-2 w-full bg-primary hover:bg-primary/90 text-white font-label font-medium py-3.5 px-6 rounded-lg shadow-[0_4px_14px_rgba(164,80,107,0.3)] transition-all duration-300 transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50"
          >
            <span>{state === 'loading' ? 'Mengirim...' : 'Kirim'}</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </section>

      <section className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-end mb-2 px-1">
          <h3 className="font-headline text-2xl text-text">Daftar Ucapan</h3>
          <span className="font-label text-xs text-text/50 bg-text/5 px-2 py-1 rounded-full">{all.length} Pesan</span>
        </div>

        {all.length === 0 && (
          <p className="text-center font-body text-sm text-text/50 py-8">Belum ada ucapan. Jadilah yang pertama!</p>
        )}

        {all.map((m) => (
          <div key={m.id} className="bg-surface rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-text/5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-primary font-headline text-xl shrink-0">
                  {initialOf(m.name)}
                </div>
                <div>
                  <h4 className="font-body font-semibold text-text text-sm">{m.name}</h4>
                  {!m.approved && (
                    <span className="font-label text-[10px] text-amber-600">Menunggu moderasi</span>
                  )}
                </div>
              </div>
            </div>
            <p className="font-body text-sm text-text/80 leading-relaxed">{m.message}</p>
          </div>
        ))}
      </section>
    </>
  )
}