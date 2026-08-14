'use client'
import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // fallback for insecure contexts
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full transition-colors active:scale-95 ${
        copied ? 'bg-primary text-white' : 'bg-primary/10 hover:bg-primary/20 text-primary'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{copied ? 'check' : 'content_copy'}</span>
      <span className="font-label text-sm font-medium">{copied ? 'Tersalin' : 'Salin'}</span>
    </button>
  )
}