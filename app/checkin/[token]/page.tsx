import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function CheckinPage({ params }: { params: { token: string } }) {
  const supabase = createAdminClient()

  const { data: guest } = await supabase
    .from('guests')
    .select('id, name, wedding_id, checked_in')
    .eq('link_token', params.token)
    .single()

  if (!guest) {
    return (
      <div className="min-h-screen bg-surface-alt text-text font-body flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-headline font-bold text-primary mb-2">Undangan Tidak Ditemukan</h1>
          <p className="text-stone-600">Token check-in tidak valid atau sudah kadaluarsa.</p>
        </div>
      </div>
    )
  }

  if (!guest.checked_in) {
    const res = await supabase.from('guests').update({ checked_in: true }).eq('id', guest.id)
    if (res.error) {
      return (
        <div className="min-h-screen bg-surface-alt text-text font-body flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-headline font-bold text-primary mb-2">Galat Sistem</h1>
            <p className="text-stone-600">Tidak dapat mencatat kehadiran. Coba lagi.</p>
          </div>
        </div>
      )
    }
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('slug, couple_names')
    .eq('id', guest.wedding_id)
    .single()

  return (
    <div className="min-h-screen bg-surface-alt text-text font-body flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-headline font-bold text-primary mb-2">Kehadiran Tercatat</h1>
        <p className="text-lg font-semibold mb-2">Terima kasih, {guest.name}!</p>
        <p className="text-stone-600 mb-6">Kami menanti kehadiran Anda di acara {wedding?.couple_names}.</p>
        <a
          href={`https://${wedding?.slug}.bymean.id`}
          className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Kembali ke Undangan
        </a>
      </div>
    </div>
  )
}