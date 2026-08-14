import type { InvitationData, WeddingTier } from '@/types'
import type { ComponentType } from 'react'

export type TemplateComponent = ComponentType<{ data: InvitationData; guestName?: string }>

type TemplateEntry = {
  component: TemplateComponent
  tier: WeddingTier
  category: string
  name: string
}

// Dynamic imports — templates are loaded only when needed
const registry: Record<string, TemplateEntry> = {}

export async function getTemplateComponent(templateId: string): Promise<TemplateComponent | null> {
  const entry = registry[templateId]
  if (entry) return entry.component

  try {
    const mod = await import(`./${templateId}/component`)
    return mod.default as TemplateComponent
  } catch {
    return null
  }
}

export const TEMPLATE_META: Record<string, Omit<TemplateEntry, 'component'>> = {
  'classic-islami': { tier: 'free',    category: 'Islami', name: 'Classic Islami'  },
  'modern-minimal': { tier: 'paid',    category: 'Modern', name: 'Modern Minimal'  },
  'floral-sunda':   { tier: 'premium', category: 'Sunda',  name: 'Floral Sunda'    },
}
