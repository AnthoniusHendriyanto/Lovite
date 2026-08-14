'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Template } from '@/types'
import { getTierPrice } from '@/lib/utils'

const FILTERS = ['Semua', 'Minimalis', 'Klasik', 'Modern', 'Sunda', 'Islami'] as const

const PREVIEW_IMAGES: Record<string, string> = {
  'classic-islami': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt7KZp8knZIix77drv14Qit6kcrEvad-MJ8TO_wAqGM28JvatIEjNVFu-DNIbs-tWEnAvOBV-qYOL0PuADuRi0qDpUOZmaN2OQCqYlM2-igiSOVLnjd2RIjy1Amz46ZUr_d_7rHndR39wbNWdkHiBHOCCoJ1IplJhgzlJzY_c-SQ-uKasDiSseH4jrmx63WVFJHxkD2JMJqpmR3tMuBu6ri-u7YdNikF2uQ-D-ydVAaRYK6MWgRKGiCAay4hYLgv64njXQXeYHKT8',
  'modern-minimal': 'https://lh3.googleusercontent.com/aida-public/AB6AXuADyaAb2YlCJrjopSHGKyFVNYSW0lTKtenPM6ojR2ovjc4YxXUieEx-jkwkYR0WFvRJxWRE0kUQGa95Bwou6inNLFHGji5BVXIpG2SgPXt3n_4cqf6EqJTWjJILu1pHVBntu3ZbblMqU_va8w2e6mcapPEwGcgtLgdrp0jYePKYEcEBYwU6XFHgReaz7Kwn1Ek5BdIuyfvXeh1O6qLCAcAud3yg-NRQJSxR2DcvY8b3vqgJxuskv8r_XmOf28-I5_8Qb89vDZ3MStw',
  'floral-sunda': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxdfbkq1YgmVkrrC6tgmjO3sG4JWeT90c7OQbBRcnSSySF7sWrU1fcaJsT4-hJ2Wxk6CL4bkJxshXiajaQ7yPjdCt2L2ecD_i2AX41S0zPiyS0yTV5OKfFA8KVrAQmNRmEqyOoXgL1-bE_RHHcjJ_aLjqxNOavJxI4OpYUwvmUqxWePTUpZGfdCzmTI-635TMOi85yfr_UCkUhOxVguEX8OS_zWRGngpZ-dBwfoQTaK0poyYYVuux2z4XoY0HVKjhWGbh9qUA2Ix4',
}

const CATEGORY_TO_FILTER: Record<string, string> = {
  Islami: 'Islami',
  Modern: 'Modern',
  Sunda: 'Sunda',
  Klasik: 'Klasik',
  Minimalis: 'Minimalis',
  Floral: 'Klasik',
}

export default function GalleryClient({
  templates,
  activeTemplateId,
}: {
  templates: Template[]
  activeTemplateId: string | null
}) {
  const router = useRouter()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Semua')
  const [busy, setBusy] = useState<string | null>(null)

  const filtered =
    filter === 'Semua'
      ? templates
      : templates.filter((t) => CATEGORY_TO_FILTER[t.category] === filter)

  async function selectTemplate(template: Template) {
    setBusy(template.id)
    const res = await fetch('/api/weddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: template.id }),
    })
    const data = await res.json()
    if (data.wedding) router.push(`/builder/${data.wedding.id}`)
    else setBusy(null)
  }

  return (
    <>
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              filter === f ? 'text-primary border-b-2 border-primary -mb-[1px]' : 'text-text-muted hover:text-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map((t) => {
          const isActive = t.id === activeTemplateId
          return (
            <div
              key={t.id}
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col relative group ${
                isActive ? 'border-2 border-primary' : 'border border-gray-100'
              }`}
            >
              {isActive && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm border border-primary/20">
                    Sedang Digunakan
                  </span>
                </div>
              )}
              {!isActive && t.tier === 'paid' && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gray-900/10 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm border border-gray-900/10">
                    Populer
                  </span>
                </div>
              )}
              <div className="aspect-[3/4] relative bg-surface-alt overflow-hidden">
                <img
                  src={PREVIEW_IMAGES[t.id] ?? t.preview_url ?? undefined}
                  alt={t.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col flex-1 bg-white">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-headline text-2xl text-text">{t.name}</h3>
                </div>
                <p className="text-sm text-text-muted mb-6 flex-1">{t.category} · {getTierPrice(t.tier)}</p>
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button
                    className="px-4 py-2 border border-gray-200 text-text rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    disabled={busy === t.id}
                  >
                    Pratinjau
                  </button>
                  {isActive ? (
                    <button
                      onClick={() => router.push('/builder/' + (activeTemplateId ?? ''))}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      Sesuaikan
                    </button>
                  ) : (
                    <button
                      onClick={() => selectTemplate(t)}
                      disabled={busy === t.id}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
                    >
                      {busy === t.id ? 'Membuat…' : 'Gunakan'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
