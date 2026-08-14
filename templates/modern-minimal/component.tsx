import type { InvitationData } from '@/types'

export default function ModernMinimalTemplate({
  data,
  guestName,
}: {
  data: InvitationData
  guestName?: string
}) {
  const { wedding } = data
  const content = wedding.content

  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        {guestName && (
          <p className="text-xs text-gray-400 mb-6 tracking-[0.3em] uppercase">
            Dear {guestName}
          </p>
        )}
        <h1 className="text-5xl md:text-7xl font-light text-gray-900 tracking-tight">
          {content.couple.partner1_name}
          <br />
          <span className="text-gray-300 text-3xl">&</span>
          <br />
          {content.couple.partner2_name}
        </h1>
        <p className="text-gray-500 mt-8 max-w-md">{content.opening_text}</p>
      </section>

      <footer className="text-center py-4 text-xs text-gray-300">
        Powered by ByMean
      </footer>
    </div>
  )
}
