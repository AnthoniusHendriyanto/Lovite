'use client'

type AnalyticsClientProps = {
  guestCount: number
  rsvpCount: number
  messageCount: number
  hadir: number
  tidak: number
}

export default function AnalyticsClient({ guestCount, rsvpCount, messageCount, hadir, tidak }: AnalyticsClientProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold text-text mb-2 tracking-tight">Analitik</h1>
          <p className="text-text-muted font-body">Pantau performa undangan digital Anda.</p>
        </div>
        <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-sm hover:border-primary transition-all text-sm font-medium">
          <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
          <span>Semua Waktu</span>
          <span className="material-symbols-outlined text-text-muted text-[18px]">expand_more</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="group" label="Total Tamu" value={String(guestCount)} sub="Terdaftar dalam daftar tamu" />
        <StatCard icon="drafts" label="Buka Undangan" value="—" sub="Butuh pelacakan kunjungan" muted />
        <StatCard icon="how_to_reg" label="RSVP" value={String(rsvpCount)} sub={`Hadir: ${hadir}, Tidak: ${tidak}`} />
        <StatCard icon="chat_bubble_outline" label="Ucapan" value={String(messageCount)} sub="Total pesan & doa" />
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline text-xl font-semibold text-text">Kunjungan Semua Waktu</h3>
          <span className="text-text-muted text-sm font-body">Grafik tersedia setelah pelacakan kunjungan aktif</span>
        </div>
        <div className="relative h-72 w-full bg-[repeating-linear-gradient(0deg,#F4F0E8_0px,#F4F0E8_1px,transparent_1px,transparent_40px),repeating-linear-gradient(90deg,#F4F0E8_0px,#F4F0E8_1px,transparent_1px,transparent_40px)] border-b border-l border-stone-200 rounded-bl-lg">
          <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-xs text-text-muted py-2 h-full">
            <span>150</span><span>100</span><span>50</span><span>0</span>
          </div>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="roseGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#A4506B" stopOpacity="0.15"></stop>
                <stop offset="100%" stopColor="#A4506B" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0,80 L100,80 L100,100 L0,100 Z" fill="url(#roseGradient)"></path>
            <path d="M0,80 L100,80" fill="none" stroke="#A4506B" strokeDasharray="4 4" strokeWidth="1.5" strokeLinecap="round"></path>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-text-muted text-sm font-body bg-white/80 px-4 py-2 rounded-lg border border-stone-100 shadow-sm">
              Belum ada data kunjungan
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col h-full">
          <h3 className="font-headline text-xl font-semibold text-text mb-6">Sumber Kunjungan</h3>
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            <SourceBar color="#25D366" label="WhatsApp" pct={0} placeholder />
            <SourceBar color="#A4506B" label="Langsung" pct={0} placeholder />
            <SourceBar color="#4267B2" label="Media Sosial" pct={0} placeholder />
            <SourceBar color="#9E989E" label="Lainnya" pct={0} placeholder />
          </div>
        </div>

        <div className="space-y-8 flex flex-col h-full">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="font-headline text-xl font-semibold text-text mb-6">Perangkat</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F4F0E8" strokeWidth="4" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">devices</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-text-muted font-body">Data perangkat tersedia setelah pelacakan aktif.</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-xl font-semibold text-text">Demografi Kota</h3>
              <span className="text-xs text-text-muted px-2 py-1 bg-stone-50 rounded-md">Top 3</span>
            </div>
            <p className="text-sm text-text-muted font-body">Data lokasi tamu tersedia setelah pelacakan aktif.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, muted }: { icon: string; label: string; value: string; sub: string; muted?: boolean }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-text-muted text-sm font-medium mb-1">{label}</p>
          <h3 className={`font-headline text-3xl font-bold ${muted ? 'text-text-muted' : 'text-text'}`}>{value}</h3>
        </div>
        <div className="p-2.5 bg-stone-50 rounded-xl text-primary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-text-muted font-body relative z-10">{sub}</p>
    </div>
  )
}

function SourceBar({ color, label, pct, placeholder }: { color: string; label: string; pct: number; placeholder?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-1.5">
        <span className="flex items-center text-text">
          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
          {label}
        </span>
        <span className="text-text-muted">{placeholder ? '—' : `${pct}%`}</span>
      </div>
      <div className="w-full bg-stone-50 rounded-full h-2.5 overflow-hidden">
        <div className="h-2.5 rounded-full" style={{ backgroundColor: color, width: placeholder ? '0%' : `${pct}%` }}></div>
      </div>
    </div>
  )
}