'use client'
import { useEffect, useState } from 'react'

function getRemaining(target: number) {
  const d = target - Date.now()
  if (d < 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' }
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    days: pad(Math.floor(d / 86400000)),
    hours: pad(Math.floor(d / 3600000) % 24),
    minutes: pad(Math.floor(d / 60000) % 60),
    seconds: pad(Math.floor(d / 1000) % 60),
  }
}

export default function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime()
  const [t, setT] = useState(() => getRemaining(targetMs))

  useEffect(() => {
    const id = setInterval(() => setT(getRemaining(targetMs)), 1000)
    return () => clearInterval(id)
  }, [targetMs])

  return (
    <div className="grid grid-cols-4 gap-3 w-full">
      {[
        ['Hari', t.days],
        ['Jam', t.hours],
        ['Menit', t.minutes],
        ['Detik', t.seconds],
      ].map(([label, value]) => (
        <div
          key={label}
          className="bg-white/40 backdrop-blur-sm border border-primary/10 rounded-xl py-6 px-2 flex flex-col items-center justify-center shadow-sm"
        >
          <span className="font-headline text-3xl font-medium text-primary leading-none mb-2">{value}</span>
          <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary/80">{label}</span>
        </div>
      ))}
    </div>
  )
}