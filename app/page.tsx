import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Button from '@/components/ui/Button'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-surface-alt">
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center text-primary mb-6">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </div>
        <p className="font-label text-primary text-sm font-semibold tracking-widest uppercase mb-4">
          Me + An + Ing = Meaning
        </p>
        <h1 className="font-headline text-5xl md:text-7xl text-text tracking-tight">
          Undangan indah,
          <br />
          <span className="text-primary italic">selesai dalam menit.</span>
        </h1>
        <p className="mt-6 text-lg text-stone-500 max-w-xl mx-auto font-body">
          Buat undangan pernikahan digital dengan template cantik, RSVP, amplop digital, dan musik — bayar sekali.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Button size="lg" className="px-8 rounded-full"><a href="/register">Mulai Gratis</a></Button>
          <Button size="lg" variant="secondary" className="px-8 rounded-full"><a href="/login">Masuk</a></Button>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { title: 'Pilih Template', desc: 'Classic Islami, Modern Minimal, Floral Sunda — mulai gratis.' },
            { title: 'Edit Sendiri', desc: 'Isi nama, tanggal, cerita, galeri — preview langsung.' },
            { title: 'Bagikan', desc: 'Link unik + QR, RSVP & ucapan dari tamu otomatis masuk.' },
          ].map((f) => (
            <div key={f.title} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <h3 className="font-headline text-xl text-text">{f.title}</h3>
              <p className="text-sm text-stone-500 mt-2 font-body">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
