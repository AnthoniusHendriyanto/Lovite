import type { InvitationData } from '@/types'

export default function FloralSundaTemplate({
  data,
  guestName,
}: {
  data: InvitationData
  guestName?: string
}) {
  const { wedding } = data
  const content = wedding.content

  return (
    <div className="min-h-screen bg-purple-50 font-serif">
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-16">
        {guestName && (
          <p className="text-xs text-purple-400 mb-6 tracking-widest uppercase">
            Kanggo {guestName}
          </p>
        )}
        <h1 className="text-5xl md:text-7xl text-purple-900">
          {content.couple.partner1_name}
          <span className="text-purple-400 mx-4 text-3xl">✦</span>
          {content.couple.partner2_name}
        </h1>
        <p className="text-purple-700 mt-6 max-w-md">{content.opening_text}</p>
      </section>

      <footer className="text-center py-4 text-xs text-purple-300">
        Powered by ByMean
      </footer>
    </div>
  )
}
