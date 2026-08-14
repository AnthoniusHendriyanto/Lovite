'use client'

import { useState } from 'react'
import type { Wedding, Guest } from '@/types'
import CheckoutClient from './CheckoutClient'

type PublishClientProps = {
  wedding: Wedding
  guests: Guest[]
  publishedUrl: string
}

const statusLabel = {
  pending: { label: 'Belum Dibuka', cls: 'bg-gray-100 text-gray-600 border border-gray-200', dot: 'bg-gray-400' },
  hadir: { label: 'Hadir', cls: 'bg-green-50 text-green-700 border border-green-200', dot: 'bg-green-500' },
  belum: { label: 'Belum Hadir', cls: 'bg-red-50 text-red-700 border border-red-200', dot: 'bg-red-500' },
}

export default function PublishClient({ wedding, guests, publishedUrl }: PublishClientProps) {
  const [copied, setCopied] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [paymentStep, setPaymentStep] = useState(false)

  async function handlePublish() {
    setPublishing(true)
    try {
      const res = await fetch(`/api/weddings/${wedding.id}/publish`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        if (data.paymentRequired) {
          setPaymentStep(true)
        } else {
          window.location.reload()
        }
      } else {
        alert('Gagal menerbitkan undangan')
      }
    } finally {
      setPublishing(false)
    }
  }

  if (paymentStep) {
    return (
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setPaymentStep(false)}
          className="mb-6 text-primary hover:text-primary-dark flex items-center gap-2 font-medium"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Kembali
        </button>
        <CheckoutClient wedding={wedding} onPaymentCreated={() => setPaymentStep(false)} />
      </div>
    )
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(publishedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Salin tautan:', publishedUrl)
    }
  }

  function shareWhatsApp() {
    const message = `Kepada Yth. tamu undangan,\n\nKami mengundang Anda ke pernikahan kami 🎊\n\n${publishedUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const isPublished = wedding.status === 'published'
  const isPending = wedding.status === 'pending_payment'

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="font-headline text-4xl text-text font-semibold mb-2">Publikasikan</h2>
          <p className="text-text-muted font-body">Kelola status dan pengiriman undangan pernikahan Anda.</p>
        </div>
        {!isPublished && (
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {publishing ? 'Memproses...' : 'Terbitkan Undangan'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-6xl text-primary">campaign</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-label font-semibold text-primary uppercase tracking-wide text-xs">Status</span>
              </div>
              <h3 className="font-headline text-2xl text-text font-bold mb-4">
                {isPublished ? 'Undangan Anda Aktif' : isPending ? 'Menunggu Pembayaran' : 'Undangan Anda Aktif'}
              </h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between border border-white">
                <div className="truncate mr-3">
                  <p className="text-xs text-text-muted mb-0.5">Tautan Publik</p>
                  {isPublished ? (
                    <a
                      href={publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-text hover:text-primary transition-colors truncate block"
                    >
                      {publishedUrl}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-text-muted">Tersedia setelah dipublikasikan</p>
                  )}
                </div>
                {isPublished && (
                  <button
                    onClick={copyUrl}
                    className="flex-shrink-0 bg-white shadow-sm border border-gray-100 hover:border-primary/30 hover:bg-primary/5 text-primary p-2 rounded-md transition-all flex items-center justify-center"
                    title="Salin"
                  >
                    <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {isPublished && (
            <>
              <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
                <h4 className="font-headline text-xl font-semibold mb-4 text-text flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">bolt</span>
                  Bagikan Cepat
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={shareWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                    Bagikan ke WhatsApp
                  </button>
                  <button
                    onClick={copyUrl}
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-text font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">link</span>
                    {copied ? 'Tautan Tersalin!' : 'Salin Tautan'}
                  </button>
                </div>
              </div>

              <div className="bg-surface-subtle rounded-lg p-4 flex items-start gap-3 border border-gray-200">
                <span className="material-symbols-outlined text-text-muted text-xl mt-0.5">auto_awesome</span>
                <div>
                  <p className="text-sm text-text font-medium mb-1">Pengiriman Otomatis</p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Undangan dikirim otomatis H-30, H-7, dan H-1 sebelum acara kepada tamu yang terdaftar.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {isPublished && (
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-headline text-2xl font-semibold text-text">Daftar Tamu</h3>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                    <input
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all"
                      placeholder="Cari nama tamu..."
                      type="text"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-text transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    <span className="hidden sm:inline">Import</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Nama Tamu</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status Undangan</th>
                      <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {guests.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-text-muted text-sm">
                          Belum ada tamu. Tambahkan tamu di halaman Tamu.
                        </td>
                      </tr>
                    ) : (
                      guests.map((g) => {
                        const st = g.checked_in ? statusLabel.hadir : statusLabel.belum
                        return (
                          <tr key={g.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-headline font-semibold text-sm">
                                  {g.name.split(' ').slice(0, 2).map((w) => w.charAt(0)).join('')}
                                </div>
                                <div className="font-medium text-text text-sm">{g.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.cls}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                                {st.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-gray-400 hover:text-primary p-1 rounded-md hover:bg-primary/5 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/30 rounded-b-xl">
                <button
                  onClick={shareWhatsApp}
                  className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm ml-auto"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  Kirim Undangan via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}