import type { InvitationData } from '@/types'
import { canUseFeature } from '@/types'
import CoverOverlay from './CoverOverlay'
import Countdown from './Countdown'
import RSVPForm from './RSVPForm'
import Guestbook from './Guestbook'
import CopyButton from './CopyButton'
import ShareButton from './ShareButton'
import MusicToggle from './MusicToggle'

const STORY_PHOTOS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDPpWEQDIG4GEi-PFizw7FzsDxEp6vsOjXNf9IKalFt6fmuyk8nJ4e4m_MyVHtT9OJFU3PSH4VXVfD2sCV0Z7A8YaR8yAqMMVo1C0277Tqdh79l5pZuGVlKPz_2C5QmNZsDpX6--yzpGblGLewoUpF6GcTtyknMHZxump4R8H-79p6SxYji0tpJmvE1cOdH05SpImRSWmZpGx9izBhMGKhXhr1A9fzJfrmPM3zbRF3gL6nYBDgwxepru0tZ7LGTJfEsPSnq0KkoFhs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBuE4ihX3mMsZ5NcYjlBifdD_mWQZhYR03dJQYFno0u6s0dGxF860u0LVfBTCPKWWo30trt5WcfqmJYg-Tvc2HDujxZYfqfyj3_y-eOsF5TJLTLIxSVwZnwzKlqa6LnfIEbYGiAgK1JP1AUPtMfgaJZVDJIbGs6bNf6pQmGaAp0imsiMzIIryFDmGCv4t6HD-gRndhIuVJR3SL1ssAJ9BUtCYEqDKMOp-EhkrFW25CtBgYUFFXHPgAf-_Wf0_0nZ4bfJoWSqQ5Q_os',
  'https://lh3.googleusercontent.com/aida/AP1WRLt9dXc-v73-NQeDVAQ77aqprUwLwLZeRSFiLc7LxLx_pTdMrgiVKiiCUROO7Jl1_Z2HAieL8kYxJEY6eoGwfaYVM3h7rHiUZN90oZkfa9rZ14xm_PdD_Rr3WbixvMhBtI2nX8baBanz7Mld6RX3KKpGGGErZTFV_G7tnH564VjvKqHiJPu6nehYF8Ad_mYZ2SzOVVFqu3rRrEynA_oml7gF2BI6gC3M0Sy3Zfkf4OptVLw3LJlBtoBBlQk',
]

const GALLERY_PHOTOS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBybcDu9ezERKNDivDwdT7UeFJTk0fqIJZoFQn40DbUBuiv2oSUdDpgF0wqoOwH2HTNApvSiMdSynWQAutBId5lo3PmFrYJyly8n_777oIqEXyx7H1RihUshVOd-GIxxnm21qYsg_g2nP8TH4JtM6E_djZi6YYaJzAONuaFZItt-Olwa5MKq1CJYbzO_5ita1I3qCc3JOuKsCU__h9zdMQ4_bKaJTrhVvxxDdZ5U9Lhpg6HoPyb1yc4xJ6xF-cr6H80u8GZVQHlWMA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA9OEiRuBGuwQMI7MwZr9Vy0cs8XaP2c0aOKkulyjtw7JWbd4ISTOEIzvhFi8VoTpB2-RVLVLCnCXa6_Bzjj5GELjJxXX5RselQaBL2MHVOg7qKrCwkaaJ9ah4mtsfRaW5nd3hJK-QLdINNz4SVg1-2SduVpqC2RpS2D7-b68_GAavYjDeDxfrU1Dwm_0rbw9309NXn0np1TtzktTyzAEBMz2zbZlwavl1B3m842ptFsDQMe1kVS6ODncsO5vagFDze8g79RX3iYx8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCCuGykM1yQMFPqTc2vsQHp0S4NN4PhzWuOk3Z-gHUfvgLhY9JvfEy8bzdrTYg3EYkVuTMua-nO-yYfafMMPhtTzJIzRaRyBT6_NGQ9me6lZb36StSsL9yAKX2bo6YfF3E5EvPonCBKUoebkqdSEHUWlWlfGrMdE6fP5wVLNguNeKQX_UXYT6u7rZvcfPil7SrcZGbsQN8j-ZCEzIcU-2HgTzVOBtiSEbj90Tbtr2PlZViKp3dcS6iPN34HaQj2tKAcCzDSXPueZgs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBmdxzU9WdrjqhuSaMJzlOW64A0s-FQtZ3OlHXjZqnhQV7tEyDJkxJG8qyQwPvZUq5yxKbipWHYtf9xpv2qc9n3esFFGRR0Za0-fET39UfcGtlPeD-0EhwuwwVB53jslRwZ0lVb8nBAFIlpKfkWEWCWStpH5jWsYf0q1_aW7LYhrvRoWVmF1EwbtpA3IqlGzP35YuMK9rhqezYln6pdoKlavH1lbjv_Z5BIP9RBXR0OwNrIWyMSZrM9hMYCD27MFlzNWwtgfM978ss',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDuT3viPzcLF-mkH7rwB0nxPrOab2aTIQb4BeGgNZz0VgT6hZEdfYvyxUMHWqTqvQlEkNMpNMev6CUcRNS4DDzOlTsYj2MVB03PhcrYHEK_aSZOoU1y5uqEaHjVYWncWsFi-CAXyIVjtMOEUVhdQlJ8QI3pm2WhegHvXplYFReSGAZlul55B4QbuCvt4YRNCDfiQgahfq8vlFbZbkNgGnJ-uep_k72Ubf4uYfXE4oPQKjaCIW80YMIFdNz4_4IiRgxQT0x66TJFUmg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB7PwHupo4hXf3u0grFxbUAqXsKk_dB8Wty8tUBNRiLePGB9_uTmAoy7OVQs6fWHcN0rWQzLUV7Y11RkIGlPb7hukbC5FIUW7vJwbKr2hYZDVy0bq4RziBqcVPzGvvkGWmZe6jKH6_lpQMg4MEjcMaVg_UstqHOCyAIVLUg1Tq1JpW5kn5R5k7SnxD37Dno4FnFurywiDALhcOHJjJgogXso1mUiMOT6TU-DBoxMszIgnKcvWI7QhWIGtq6TlooNvWDMJpmtxV9i9c',
]

const BISMILLAH_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBMnoV9DHBi5z4uy0dhNaUUZ4iDIxB8_3Q0EBoy4xEAejtaE9qo4xtS4IoObxCW0lfpER3PO2z-bWI4RyzlgtQkdAN1GboWiY9DCnYkopmVgjkRoDvzl45pNlYGkOytPs2pZIDiI7wlZ8qGSlXefTuKiY2GrY-Hu5xFu9dYe9Plpn1wXZPW7qHU3k6alC22iFGVzjxCH9hqwVY4uPRwdmrSgcTDz5fXRpofyvJ0XM_88pR4wSmcIIBMTtZY8F2-tuvuBLM0YTHjemc'

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

function monogram(content: InvitationData['wedding']['content']): string {
  const a = content.couple.partner1_name?.trim().charAt(0) || ''
  const b = content.couple.partner2_name?.trim().charAt(0) || ''
  return `${a} & ${b}`
}

export default function InvitationShell({
  data,
  guestName,
}: {
  data: InvitationData
  guestName?: string
}) {
  const { wedding, gift_accounts, messages } = data
  const content = wedding.content
  const { couple, events, love_story, gallery, music_url, streaming_url } = content

  const musicEnabled = canUseFeature(wedding.tier, 'music') && Boolean(music_url)
  const countdownTarget = wedding.wedding_date ? `${wedding.wedding_date}T00:00:00` : null

  const banks = gift_accounts.filter((g) => g.type === 'bank')
  const ewallets = gift_accounts.filter((g) => g.type === 'ewallet')
  const qris = gift_accounts.find((g) => g.type === 'qris')

  const galleryPhotos = gallery?.length ? gallery : GALLERY_PHOTOS

  return (
    <>
      <CoverOverlay data={data}>
        <div className="min-h-screen bg-surface-alt text-text font-body antialiased">
          {/* Top App Bar */}
          <header className="fixed top-0 w-full z-40 bg-surface-alt/90 backdrop-blur-md flex justify-between items-center px-6 py-4">
            {musicEnabled ? (
              <MusicToggle src={music_url!} />
            ) : (
              <span className="w-10" />
            )}
            <div className="font-headline text-3xl font-bold text-primary tracking-wide">{monogram(content)}</div>
            <ShareButton title={`Undangan ${wedding.couple_names}`} />
          </header>

          {/* ── Greeting & Countdown ── */}
          <section className="pt-28 pb-12 px-6 flex flex-col items-center text-center relative">
            <div className="flex flex-col items-center space-y-2 mb-10">
              <p className="text-sm tracking-wide text-text/70 uppercase font-label">
                Kepada Yth. Bpk/Ibu/Sdr.
              </p>
              <h1 className="font-headline text-5xl font-medium mt-2 text-primary">
                {guestName || 'Tamu Undangan'}
              </h1>
            </div>

            <div className="flex flex-col items-center space-y-6 mb-10">
              <p className="font-headline italic text-2xl text-primary">Bismillahirrahmanirrahim</p>
              <img
                src={BISMILLAH_IMG}
                alt="Kaligrafi Bismillah"
                className="w-48 h-auto object-contain drop-shadow-sm opacity-90"
              />
            </div>

            <div className="max-w-sm mx-auto mb-14">
              <p className="text-base leading-relaxed text-text/80">
                {content.opening_text}
                <span className="font-headline text-xl italic text-primary block mt-4">
                  {couple.partner1_name} &amp; {couple.partner2_name}.
                </span>
              </p>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="h-px w-12 bg-primary/30" />
                <h2 className="font-label text-xs uppercase tracking-[0.2em] text-primary">Save the Date</h2>
                <div className="h-px w-12 bg-primary/30" />
              </div>
              <p className="font-headline text-2xl mb-8 text-text">{formatDate(wedding.wedding_date)}</p>
              {countdownTarget && <Countdown target={countdownTarget} />}
            </div>
          </section>

          {/* ── Love Story ── */}
          {love_story && love_story.length > 0 && (
            <section className="max-w-md mx-auto px-6 pt-12 pb-16 flex flex-col items-center">
              <div className="text-center w-full mb-12">
                <h2 className="font-headline text-4xl text-primary mb-6">Our Love Story</h2>
                <div className="flex items-center justify-center gap-4 w-full max-w-[200px] mx-auto">
                  <div className="h-[1px] w-full bg-primary/30" />
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <div className="h-[1px] w-full bg-primary/30" />
                </div>
              </div>

              <div className="relative w-full max-w-sm mx-auto flex flex-col gap-12">
                {love_story.map((m, i) => (
                  <div key={i} className="relative flex flex-col items-center text-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-surface-alt shadow-lg mb-6 z-10 bg-surface-alt">
                      <img
                        src={STORY_PHOTOS[i % STORY_PHOTOS.length]}
                        alt={m.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-primary/10 w-full">
                      <div className="text-primary font-label text-sm uppercase tracking-widest font-semibold mb-2">
                        {m.year}
                      </div>
                      <h3 className="font-headline text-2xl mb-3">{m.title}</h3>
                      <p className="text-text/80 text-sm leading-relaxed">{m.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Events ── */}
          {events && events.length > 0 && (
            <section className="container mx-auto px-4 sm:px-6 max-w-3xl flex flex-col items-center pt-8 pb-16">
              <div className="text-center w-full mb-8">
                <h2 className="font-headline text-4xl text-primary font-medium tracking-wide mb-2">
                  Rangkaian Acara
                </h2>
                <div className="flex items-center justify-center gap-4 mb-6 opacity-80">
                  <div className="h-px bg-primary/40 w-12" />
                  <span className="material-symbols-outlined text-primary text-lg">spa</span>
                  <div className="h-px bg-primary/40 w-12" />
                </div>
                <p className="font-body text-text/60 text-sm max-w-lg mx-auto leading-relaxed">
                  Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada
                  acara pernikahan kami.
                </p>
              </div>

              <div className="w-full space-y-10">
                {events.map((ev, i) => (
                  <article
                    key={i}
                    className="bg-surface rounded-xl p-8 md:p-10 shadow-sm border border-primary/10 relative overflow-hidden flex flex-col items-center text-center"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                    <div className="mb-6 bg-surface-alt p-4 rounded-full inline-flex text-primary shadow-sm border border-primary/5">
                      <span className="material-symbols-outlined text-3xl">
                        {ev.name.toLowerCase().includes('akad') ? 'favorite' : 'celebration'}
                      </span>
                    </div>
                    <h3 className="font-headline text-3xl text-text mb-6 font-medium">{ev.name}</h3>
                    <div className="space-y-4 font-body text-text/60 mb-8 w-full max-w-sm">
                      <div className="flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                        <p className="text-base font-medium">{formatDate(ev.date)}</p>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                        <p className="text-base font-medium">{ev.time}</p>
                      </div>
                      <div className="flex items-start justify-center gap-3 pt-2">
                        <span className="material-symbols-outlined text-primary text-xl mt-1">location_on</span>
                        <p className="text-base leading-relaxed text-left">
                          <strong className="block text-text font-medium mb-1">{ev.venue}</strong>
                          {ev.address}
                        </p>
                      </div>
                    </div>
                    {ev.maps_url && (
                      <a
                        href={ev.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white font-label text-sm uppercase tracking-wider py-3 px-8 rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">map</span>
                        Google Maps
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── Gallery ── */}
          <section className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="font-headline text-4xl text-text mb-4 tracking-wide">Pre-Wedding Gallery</h2>
              <div className="flex items-center justify-center gap-4 mb-6 opacity-80">
                <div className="h-px bg-primary/40 w-12" />
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                <div className="h-px bg-primary/40 w-12" />
              </div>
              <p className="font-headline italic text-xl text-text/70">
                A glimpse into our timeless love story.
              </p>
            </div>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {galleryPhotos.map((src, i) => (
                <div key={i} className="break-inside-avoid rounded-xl overflow-hidden bg-surface shadow-sm">
                  <img src={src} alt={`Galeri ${i + 1}`} className="w-full h-auto object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </section>

          {/* ── Live Streaming ── */}
          {streaming_url && (
            <section className="max-w-md mx-auto px-6 py-12 space-y-10">
              <div className="text-center space-y-4 pt-6">
                <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-2">
                  <span className="material-symbols-outlined text-primary text-3xl">videocam</span>
                </div>
                <h1 className="font-headline text-4xl text-text font-medium leading-tight">Live Streaming</h1>
                <p className="font-body text-text/60 text-sm px-4">
                  Tonton prosesi akad dan resepsi kami secara langsung dari tempat Anda.
                </p>
              </div>
              <div className="bg-surface rounded-2xl p-8 shadow-sm border border-primary/5 text-center flex flex-col items-center">
                <div className="w-full aspect-video rounded-xl bg-surface-alt border border-primary/10 mb-6 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
                  <span className="relative z-10 material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_circle
                  </span>
                </div>
                <a
                  href={streaming_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-primary text-surface rounded-full font-body font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Tonton Live Streaming
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </section>
          )}

          {/* ── Amplop Digital ── */}
          {gift_accounts.length > 0 && (
            <section className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 flex flex-col items-center">
              <div className="text-center mb-10">
                <h2 className="font-headline text-4xl md:text-5xl text-primary mb-4 font-medium tracking-tight">
                  Amplop Digital
                </h2>
                <p className="font-body text-text/60 text-sm md:text-base max-w-xs mx-auto leading-relaxed">
                  Tanda kasih Anda adalah doa terbaik untuk kami
                </p>
                <div className="w-16 h-px bg-primary/30 mx-auto mt-6" />
              </div>

              <div className="w-full space-y-6">
                {banks.map((bank) => (
                  <div
                    key={bank.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-primary/5 relative overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div>
                        <p className="font-label text-xs uppercase tracking-widest text-text/60 mb-1">
                          Transfer Bank
                        </p>
                        <h3 className="font-headline text-2xl text-text font-medium mb-4">{bank.label}</h3>
                        <div className="space-y-1">
                          <p className="font-body text-xl font-medium tracking-wider text-text">
                            {bank.account_number}
                          </p>
                        </div>
                      </div>
                      <CopyButton text={bank.account_number ?? ''} />
                    </div>
                  </div>
                ))}

                {qris && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/5 text-center relative overflow-hidden">
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                    <div className="relative">
                      <p className="font-label text-xs uppercase tracking-widest text-text/60 mb-2">Scan QR</p>
                      <h3 className="font-headline text-2xl text-text font-medium mb-6">QRIS</h3>
                      <div className="bg-surface-alt inline-block p-4 rounded-xl mb-6 shadow-sm border border-primary/10">
                        <img src={qris.qris_url ?? ''} alt="QRIS" className="w-48 h-48 object-cover rounded-md" />
                      </div>
                      <p className="font-body text-sm text-text/60">Scan untuk kirim hadiah</p>
                    </div>
                  </div>
                )}

                {ewallets.length > 0 && (
                  <div className="pt-4 pb-2 text-center">
                    <p className="font-label text-xs uppercase tracking-widest text-text/60 mb-4">
                      E-Wallet Lainnya
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {ewallets.map((ew) => (
                        <span
                          key={ew.id}
                          className="px-4 py-2 bg-white border border-primary/10 rounded-full font-label text-sm text-text shadow-sm"
                        >
                          {ew.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── RSVP ── */}
          <section className="flex-grow flex flex-col items-center px-4 py-12 w-full max-w-2xl mx-auto">
            <div className="text-center mb-8 w-full">
              <h1 className="font-headline text-4xl text-primary mb-3">RSVP</h1>
              <h2 className="font-headline text-2xl text-text mb-4">Konfirmasi Kehadiran</h2>
              <div className="w-16 h-[1px] bg-primary/30 mx-auto mb-4" />
              <p className="font-body text-sm text-text/70">
                Mohon konfirmasi kehadiran Anda
              </p>
            </div>
            <RSVPForm weddingId={wedding.id} />
          </section>

          {/* ── Ucapan & Doa ── */}
          <section className="w-full max-w-2xl px-6 pt-12 pb-8 mx-auto flex flex-col items-center">
            <div className="text-center mb-10 w-full">
              <div className="inline-flex justify-center mb-4 text-primary/40">
                <svg fill="none" height="12" viewBox="0 0 40 12" width="40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 0C20 0 25 12 40 12M20 0C20 0 15 12 0 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                  <circle cx="20" cy="6" fill="currentColor" r="2" />
                </svg>
              </div>
              <h2 className="font-headline text-4xl text-text mb-3 leading-tight">Ucapan &amp; Doa</h2>
              <p className="font-body text-text/70 text-sm max-w-sm mx-auto">
                Kirim doa dan harapan terbaik untuk kami
              </p>
            </div>
            <Guestbook weddingId={wedding.id} initialMessages={messages} />
          </section>

          {/* ── Closing ── */}
          <section className="text-center px-6 py-16 space-y-6">
            <div className="w-12 h-[1px] bg-primary/30 mx-auto" />
            <p className="font-body text-text/60 leading-relaxed text-sm">
              {content.closing_text}
            </p>
            <div className="w-12 h-[1px] bg-primary/30 mx-auto" />
            <p className="font-headline italic text-lg text-text">
              Wassalamualaikum Warahmatullahi Wabarakatuh
            </p>
            <div className="pt-6">
              <p className="font-headline italic text-lg text-text">
                {couple.partner1_full_name} &amp; {couple.partner2_full_name}
              </p>
            </div>
          </section>

          <footer className="text-center py-6 pb-24 text-xs text-text/40">
            Powered by <span className="text-primary font-semibold">ByMean</span>
          </footer>

          {/* Bottom Nav (Mobile) */}
          <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-3 bg-surface-alt/90 backdrop-blur-md rounded-t-xl border-t border-primary/10 shadow-sm">
            {[
              { href: '#', icon: 'favorite', label: 'Undangan' },
              { href: '#', icon: 'calendar_today', label: 'Acara' },
              { href: '#', icon: 'chat_bubble', label: 'Ucapan' },
              { href: '#', icon: 'event_available', label: 'RSVP' },
            ].map((tab, i) => (
              <a
                key={i}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-16 group ${
                  i === 0 ? 'text-primary font-bold scale-110' : 'text-text/60 hover:text-primary'
                } transition-all duration-200`}
              >
                <span className="material-symbols-outlined mb-1 text-2xl" style={{ fontVariationSettings: i === 0 ? "'FILL' 1" : "'FILL' 0" }}>
                  {tab.icon}
                </span>
                <span className="font-label text-[10px] uppercase tracking-widest">{tab.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </CoverOverlay>
    </>
  )
}
