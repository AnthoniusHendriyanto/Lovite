'use client'
import { useState } from 'react'

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // ignore
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={share}
      className="inline-flex items-center justify-center gap-2 font-label text-sm uppercase tracking-widest py-3 px-8 rounded-full border border-primary/20 hover:border-primary/40 text-primary transition-colors"
    >
      <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'link'}</span>
      {copied ? 'Tersalin' : 'Bagikan'}
    </button>
  )
}