'use client'

import { useMemo, useState } from 'react'
import type { Wedding, InvitationContent } from '@/types'

type BuilderClientProps = {
  wedding: Wedding
}

function daysUntil(date: string | null): number {
  if (!date) return 0
  const target = new Date(`${date}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000))
}

export default function BuilderClient({ wedding }: BuilderClientProps) {
  const [content, setContent] = useState<InvitationContent>(wedding.content)
  const [saved, setSaved] = useState(true)
  const [saving, setSaving] = useState(false)

  const [musicOn, setMusicOn] = useState(true)
  const [guestbookOn, setGuestbookOn] = useState(true)

  const partner1 = content.couple.partner1_name || 'Raka'
  const partner2 = content.couple.partner2_name || 'Nadia'
  const date = content.events[0]?.date || wedding.wedding_date || '2026-11-21'
  const venue = content.events[0]?.venue || 'The Glasshouse, Ritz Carlton Jakarta'
  const days = daysUntil(date)

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(`${date}T00:00:00`)),
    [date]
  )

  function patch(p: Partial<InvitationContent>) {
    setContent({ ...content, ...p })
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    const res = await fetch(`/api/weddings/${wedding.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        couple_names: `${partner1} & ${partner2}`,
        wedding_date: date,
      }),
    })
    if (res.ok) setSaved(true)
    setSaving(false)
  }

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="font-headline text-4xl text-text mb-2">Kustomisasi Undangan</h1>
          <p className="font-body text-neutral-500 text-sm">Atur detail, konten, dan tampilan undangan digital Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => save()}
            className="px-5 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 font-label text-sm font-semibold hover:bg-neutral-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Pratinjau
          </button>
          <button
            onClick={() => save()}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-primary text-white font-label text-sm font-semibold shadow-sm hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {saving ? 'Menyimpan…' : saved ? 'Tersimpan' : 'Simpan'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 pb-8">
          <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-light text-primary rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">event</span>
                </div>
                <h3 className="font-label font-semibold text-text">Info Acara</h3>
              </div>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label htmlFor="p1" className="block font-label text-xs font-semibold text-neutral-600 mb-1.5">
                  Nama Mempelai Pria
                </label>
                <input
                  id="p1"
                  value={content.couple.partner1_name}
                  onChange={(e) => patch({ couple: { ...content.couple, partner1_name: e.target.value } })}
                  className="w-full rounded-lg border-neutral-200 focus:border-primary focus:ring-primary font-body text-sm px-3 py-2 text-text bg-neutral-50/50"
                  placeholder="Raka"
                />
              </div>
              <div>
                <label htmlFor="p2" className="block font-label text-xs font-semibold text-neutral-600 mb-1.5">
                  Nama Mempelai Wanita
                </label>
                <input
                  id="p2"
                  value={content.couple.partner2_name}
                  onChange={(e) => patch({ couple: { ...content.couple, partner2_name: e.target.value } })}
                  className="w-full rounded-lg border-neutral-200 focus:border-primary focus:ring-primary font-body text-sm px-3 py-2 text-text bg-neutral-50/50"
                  placeholder="Nadia"
                />
              </div>
              <div>
                <label htmlFor="date" className="block font-label text-xs font-semibold text-neutral-600 mb-1.5">
                  Tanggal Pernikahan
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => patch({ events: [{ ...content.events[0], date: e.target.value }] })}
                  className="w-full rounded-lg border-neutral-200 focus:border-primary focus:ring-primary font-body text-sm px-3 py-2 text-text bg-neutral-50/50"
                />
              </div>
              <div>
                <label htmlFor="venue" className="block font-label text-xs font-semibold text-neutral-600 mb-1.5">
                  Lokasi Utama
                </label>
                <textarea
                  id="venue"
                  rows={3}
                  value={content.events[0]?.venue}
                  onChange={(e) => patch({ events: [{ ...content.events[0], venue: e.target.value }] })}
                  className="w-full rounded-lg border-neutral-200 focus:border-primary focus:ring-primary font-body text-sm px-3 py-2 text-text bg-neutral-50/50 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-100 text-neutral-600 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">edit_document</span>
                </div>
                <h3 className="font-label font-semibold text-text">Konten &amp; Teks</h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-neutral-500 font-body mb-4">Kelola bagian-bagian dalam undangan Anda.</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 hover:border-neutral-200 bg-neutral-50/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-400 text-[18px]">format_quote</span>
                    <span className="font-label text-sm text-neutral-700">Salam Pembuka</span>
                  </div>
                  <span className="material-symbols-outlined text-neutral-300 text-[16px]">chevron_right</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 hover:border-neutral-200 bg-neutral-50/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-400 text-[18px]">favorite</span>
                    <span className="font-label text-sm text-neutral-700">Kisah Cinta</span>
                  </div>
                  <span className="material-symbols-outlined text-neutral-300 text-[16px]">chevron_right</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 hover:border-neutral-200 bg-neutral-50/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-400 text-[18px]">photo_library</span>
                    <span className="font-label text-sm text-neutral-700">Galeri Foto</span>
                  </div>
                  <span className="material-symbols-outlined text-neutral-300 text-[16px]">chevron_right</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-100 text-neutral-600 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </div>
                <h3 className="font-label font-semibold text-text">Fitur &amp; Pengaturan</h3>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-label text-sm font-semibold text-text">Musik Latar</h4>
                  <p className="font-body text-xs text-neutral-500 mt-0.5">Tampilkan pemutar musik otomatis</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={musicOn} onChange={() => setMusicOn(!musicOn)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="h-px w-full bg-neutral-100"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-label text-sm font-semibold text-text">Buku Tamu</h4>
                  <p className="font-body text-xs text-neutral-500 mt-0.5">Izinkan tamu meninggalkan ucapan</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={guestbookOn} onChange={() => setGuestbookOn(!guestbookOn)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8 flex justify-center items-center bg-neutral-100/50 rounded-2xl border border-neutral-200/50 p-8 min-h-[600px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2E2430 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative w-[320px] sm:w-[375px] h-[700px] sm:h-[812px] bg-white rounded-[40px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1),0_0_0_12px_#ffffff,0_0_0_13px_#e5e5e5] overflow-hidden z-10 flex flex-col border-[6px] border-neutral-900">
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
              <div className="w-32 h-6 bg-neutral-900 rounded-b-3xl"></div>
            </div>
            <div className="flex-1 overflow-y-auto preview-scroll relative bg-surface-alt">
              <div className="relative min-h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-surface-alt"></div>
                <div className="relative z-10 flex flex-col items-center pt-24 pb-16 px-6 h-full flex-1">
                  <div className="text-center mt-auto pb-12 w-full">
                    <p className="font-body text-xs tracking-[0.3em] uppercase text-neutral-800 mb-4 drop-shadow-sm">
                      The Wedding Of
                    </p>
                    <h1
                      className="font-headline text-5xl sm:text-6xl text-neutral-900 mb-8 drop-shadow-md leading-none"
                      style={{ textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}
                    >
                      {partner1} <span className="block text-3xl my-2 italic font-light">&amp;</span> {partner2}
                    </h1>
                    <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50 shadow-sm mt-8">
                      <div className="flex flex-col items-center">
                        <span className="font-headline text-xl text-primary font-medium leading-none">{days}</span>
                        <span className="font-label text-[9px] uppercase tracking-wider text-neutral-500 mt-1">Hari</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-alt py-16 px-8 flex flex-col items-center text-center relative z-20">
                <p className="font-headline text-3xl text-text mb-2 italic">Save the Date</p>
                <div className="w-12 h-px bg-primary/40 my-4"></div>
                <p className="font-body text-neutral-600 tracking-widest uppercase text-sm font-medium">{formattedDate}</p>
                <p className="font-body text-neutral-500 text-sm mt-2">{venue || 'Lokasi belum diatur'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
