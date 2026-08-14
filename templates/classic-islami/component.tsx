import type { InvitationData } from '@/types'

export default function ClassicIslamiTemplate({
  data,
  guestName,
}: {
  data: InvitationData
  guestName?: string
}) {
  const { wedding } = data
  const content = wedding.content

  return (
    <div className="min-h-screen bg-emerald-50 font-serif">
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-16">
        {guestName && (
          <p className="text-sm text-emerald-700 mb-4 tracking-widest uppercase">
            Kepada Yth. {guestName}
          </p>
        )}
        <p className="text-emerald-600 text-lg mb-2">Bismillahirrahmanirrahim</p>
        <h1 className="text-4xl md:text-6xl font-bold text-emerald-900 mt-4">
          {content.couple.partner1_name}
          <span className="text-emerald-500 mx-4">&</span>
          {content.couple.partner2_name}
        </h1>
        <p className="text-emerald-700 mt-6 text-lg">{content.opening_text}</p>
      </section>

      <footer className="text-center py-4 text-xs text-emerald-400">
        Powered by ByMean
      </footer>
    </div>
  )
}
