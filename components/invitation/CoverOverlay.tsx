'use client'
import { useEffect, useState } from 'react'
import type { InvitationData } from '@/types'

const HERO_PHOTO =
  'https://lh3.googleusercontent.com/aida/AP1WRLt9dXc-v73-NQeDVAQ77aqprUwLwLZeRSFiLc7LxLx_pTdMrgiVKiiCUROO7Jl1_Z2HAieL8kYxJEY6eoGwfaYVM3h7rHiUZN90oZkfa9rZ14xm_PdD_Rr3WbixvMhBtI2nX8baBanz7Mld6RX3KKpGGGErZTFV_G7tnH564VjvKqHiJPu6nehYF8Ad_mYZ2SzOVVFqu3rRrEynA_oml7gF2BI6gC3M0Sy3Zfkf4OptVLw3LJlBtoBBlQk'

function daysUntil(dateStr: string | null): number {
  if (!dateStr) return 0
  const target = new Date(`${dateStr}T00:00:00`)
  return Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86400000))
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function CoverOverlay({
  data,
  children,
}: {
  data: InvitationData
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { wedding } = data
  const content = wedding.content

  useEffect(() => {
    document.body.style.overflow = open ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const photo = content.couple.photo_url || HERO_PHOTO

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-surface-alt overflow-hidden transition-all duration-700 ${
          open ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="h-[45vh] relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-alt z-10 pointer-events-none" />
          <img src={photo} alt="Mempelai" className="w-full h-full object-cover object-top" />
        </div>
        <div className="flex flex-col items-center justify-center px-6 -mt-12 z-20 relative text-center">
          <div className="mb-4 text-primary/60">
            <span className="material-symbols-outlined text-[32px] font-light">auto_awesome</span>
          </div>
          <p className="font-label text-xs uppercase tracking-[0.3em] text-text/70 mb-3">The Wedding Of</p>
          <h1 className="font-headline text-6xl leading-none text-text mb-4 italic font-medium">
            {content.couple.partner1_name}
            <br />
            <span className="text-5xl">&amp;</span> {content.couple.partner2_name}
          </h1>
          <p className="font-headline text-lg text-text mb-6">{formatDate(wedding.wedding_date)}</p>
          <p className="font-headline italic text-text/80 text-lg max-w-sm mx-auto mb-8">
            {content.opening_text}
          </p>
          <div className="flex items-center gap-2 text-primary font-label text-xs uppercase tracking-widest pulse-slow mb-8">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>{daysUntil(wedding.wedding_date)} hari lagi</span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-primary text-white font-label uppercase text-sm tracking-widest py-4 px-10 rounded-full hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
            Buka Undangan
          </button>
        </div>
      </div>

      {open && children}
    </>
  )
}
