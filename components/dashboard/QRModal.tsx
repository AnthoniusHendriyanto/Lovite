'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import type { Guest } from '@/types'

type QRModalProps = {
  guest: Guest
  slug: string
  onClose: () => void
}

export default function QRModal({ guest, slug, onClose }: QRModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('')

  useEffect(() => {
    const checkinUrl = `https://${slug}.bymean.id?to=${encodeURIComponent(guest.name)}&checkin=${guest.link_token}`
    QRCode.toDataURL(checkinUrl, { width: 300, margin: 2, color: { dark: '#A4506B', light: '#FAF7F2' } })
      .then((url) => setQrUrl(url))
      .catch(console.error)
  }, [guest, slug])

  const checkinUrl = `https://${slug}.bymean.id?to=${encodeURIComponent(guest.name)}&checkin=${guest.link_token}`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-lg font-semibold text-text">QR Check-in</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-text-muted mb-3 font-body">
              Bagikan atau cetak QR untuk tamu <span className="font-semibold text-text">{guest.name}</span>
            </p>
            {qrUrl && (
              <div className="inline-flex items-center justify-center bg-white p-4 rounded-lg border border-gray-200">
                <img src={qrUrl} alt="QR Check-in" className="w-48 h-48" />
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <p className="text-xs text-text-muted font-semibold uppercase tracking-wide">Tautan Check-in</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={checkinUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-xs text-text font-mono"
              />
              <button
                onClick={() => navigator.clipboard.writeText(checkinUrl)}
                className="px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded transition-colors text-xs font-medium"
              >
                Salin
              </button>
            </div>
          </div>

          {qrUrl && (
            <a
              href={qrUrl}
              download={`qr-${guest.name.replace(/\s+/g, '-')}.png`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-text font-medium rounded-lg transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Unduh QR
            </a>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}