import type { WeddingTier } from '@/types'
import { TIER_PRICES } from '@/types'

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getTierPrice(tier: WeddingTier): string {
  const price = TIER_PRICES[tier]
  return price === 0 ? 'Gratis' : formatIDR(price)
}

export function buildWAShareLink(slug: string, baseDomain: string, guestName?: string): string {
  const url = `https://${slug}.${baseDomain}${guestName ? `?to=${encodeURIComponent(guestName)}` : ''}`
  const message = guestName
    ? `Kepada Yth. ${guestName},\n\nKami mengundang kamu ke pernikahan kami 🎊\n\n${url}`
    : `Kami mengundang kamu ke pernikahan kami 💍\n\n${url}`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export function buildWAGuestLink(
  slug: string,
  baseDomain: string,
  phone: string,
  guestName: string
): string {
  const url = `https://${slug}.${baseDomain}?to=${encodeURIComponent(guestName)}`
  const message = `Kepada Yth. ${guestName},\n\nKami mengundang kamu ke pernikahan kami 🎊\n\n${url}`
  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '62')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 60)
}
