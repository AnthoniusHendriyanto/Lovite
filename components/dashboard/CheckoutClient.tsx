'use client'

import { useState } from 'react'
import type { Wedding, Payment } from '@/types'
import { TIER_PRICES } from '@/types'
import { formatIDR } from '@/lib/utils'

type CheckoutClientProps = {
  wedding: Wedding
  onPaymentCreated?: (payment: Payment) => void
}

export default function CheckoutClient({ wedding, onPaymentCreated }: CheckoutClientProps) {
  const [method, setMethod] = useState<'manual' | 'tripay_qris' | 'tripay_ewallet'>('manual')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const amount = TIER_PRICES[wedding.tier]
  const bankAccount = {
    bank: 'BCA',
    number: '1234567890',
    name: 'ByMean Indonesia',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (method !== 'manual') {
      alert('Tripay belum tersedia. Gunakan transfer manual untuk saat ini.')
      return
    }

    setUploading(true)
    try {
      let proofUrl: string | undefined

      if (proofFile) {
        const formData = new FormData()
        formData.append('file', proofFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          proofUrl = url
        }
      }

      const paymentRes = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weddingId: wedding.id,
          proofUrl,
          channel: 'manual',
        }),
      })

      if (paymentRes.ok) {
        const { payment } = await paymentRes.json()
        setSubmitted(true)
        onPaymentCreated?.(payment)
      } else {
        alert('Gagal membuat pembayaran')
      }
    } finally {
      setUploading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-headline font-bold text-text mb-2">Pembayaran Diterima</h2>
          <p className="text-text-muted mb-6">
            Tim kami akan memverifikasi bukti pembayaran Anda dalam 24 jam. Undangan akan dipublikasikan setelah disetujui.
          </p>
          <a
            href="/publish"
            className="inline-block px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Kembali ke Publikasi
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-headline text-3xl font-bold text-text mb-2">Pilih Pembayaran</h2>
        <p className="text-text-muted">
          Bayar {formatIDR(amount)} untuk mempublikasikan undangan digital Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
          <h3 className="font-headline text-lg font-semibold text-text mb-4">Metode Pembayaran</h3>
          <div className="space-y-3">
            {/* Manual Transfer */}
            <label className="flex items-start p-4 border-2 border-primary rounded-lg cursor-pointer bg-primary/5">
              <input
                type="radio"
                name="method"
                value="manual"
                checked={method === 'manual'}
                onChange={(e) => setMethod(e.target.value as typeof method)}
                className="mt-1 w-4 h-4"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-text">Transfer Manual</p>
                <p className="text-sm text-text-muted">Transfer langsung ke rekening kami</p>
              </div>
            </label>

            {/* Tripay Methods (Disabled) */}
            <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-not-allowed opacity-50">
              <input
                type="radio"
                name="method"
                value="tripay_qris"
                disabled
                className="mt-1 w-4 h-4"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-text">QRIS</p>
                <p className="text-sm text-text-muted">Tersedia segera</p>
              </div>
            </label>

            <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-not-allowed opacity-50">
              <input
                type="radio"
                name="method"
                value="tripay_ewallet"
                disabled
                className="mt-1 w-4 h-4"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-text">E-Wallet</p>
                <p className="text-sm text-text-muted">Tersedia segera</p>
              </div>
            </label>
          </div>
        </div>

        {/* Manual Transfer Details */}
        {method === 'manual' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-headline font-semibold text-text mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">info</span>
              Instruksi Transfer
            </h4>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-text-muted mb-1">Tujuan Transfer:</p>
                <div className="bg-white rounded-lg p-3 border border-blue-100 font-mono text-text">
                  {bankAccount.bank} {bankAccount.number}
                </div>
              </div>
              <div>
                <p className="text-text-muted mb-1">Atas Nama:</p>
                <p className="font-medium text-text">{bankAccount.name}</p>
              </div>
              <div>
                <p className="text-text-muted mb-1">Jumlah Transfer:</p>
                <p className="font-headline text-xl font-bold text-text">{formatIDR(amount)}</p>
              </div>
              <div>
                <p className="text-text-muted mb-1">Catatan Transfer (Opsional):</p>
                <p className="text-xs text-text-muted italic">{wedding.slug}</p>
              </div>
            </div>
          </div>
        )}

        {/* Proof Upload */}
        {method === 'manual' && (
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <h3 className="font-headline text-lg font-semibold text-text mb-4">Bukti Pembayaran</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                className="hidden"
                id="proof-upload"
              />
              <label htmlFor="proof-upload" className="cursor-pointer block">
                {proofFile ? (
                  <>
                    <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium text-text">{proofFile.name}</p>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="font-medium text-text mb-1">Unggah bukti pembayaran</p>
                    <p className="text-sm text-text-muted">Foto atau screenshot transfer</p>
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-text">
              <span>Template {wedding.tier.charAt(0).toUpperCase() + wedding.tier.slice(1)}</span>
              <span className="font-medium">{formatIDR(amount)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-headline font-bold text-text">
              <span>Total</span>
              <span>{formatIDR(amount)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
        </button>
      </form>
    </div>
  )
}