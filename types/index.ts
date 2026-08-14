// ByMean — Database & Domain Types
// Keep in sync with supabase/migrations/0001_initial_schema.sql

export type WeddingTier = 'free' | 'paid' | 'premium'
export type WeddingStatus = 'draft' | 'pending_payment' | 'published'
export type UserRole = 'couple' | 'admin'
export type AttendanceStatus = 'hadir' | 'tidak' | 'ragu'
export type GiftType = 'bank' | 'ewallet' | 'qris'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type PaymentChannel = 'manual' | 'tripay_qris' | 'tripay_va' | 'tripay_ewallet'

// ─── DB Row Types ────────────────────────────────────────────────────────────

export type Profile = {
  id: string
  display_name: string | null
  email: string | null
  role: UserRole
  created_at: string
}

export type Template = {
  id: string
  name: string
  category: string
  tier: WeddingTier
  preview_url: string | null
  default_theme: ThemeData
  active: boolean
  created_at: string
}

export type Wedding = {
  id: string
  user_id: string
  slug: string
  template_id: string
  tier: WeddingTier
  content: InvitationContent
  theme: ThemeData
  status: WeddingStatus
  couple_names: string | null
  wedding_date: string | null
  custom_domain: string | null
  domain_verified: boolean
  created_at: string
  updated_at: string
}

export type Guest = {
  id: string
  wedding_id: string
  name: string
  phone: string | null
  link_token: string
  checked_in: boolean
  created_at: string
}

export type Rsvp = {
  id: string
  wedding_id: string
  guest_name: string
  attendance: AttendanceStatus
  guest_count: number
  created_at: string
}

export type Message = {
  id: string
  wedding_id: string
  name: string
  message: string
  approved: boolean
  created_at: string
}

export type GiftAccount = {
  id: string
  wedding_id: string
  type: GiftType
  label: string
  account_number: string | null
  qris_url: string | null
  created_at: string
}

export type Payment = {
  id: string
  wedding_id: string
  amount: number
  channel: PaymentChannel
  status: PaymentStatus
  proof_url: string | null
  tripay_ref: string | null
  paid_at: string | null
  created_at: string
}

// ─── Invitation Content (weddings.content JSONB) ─────────────────────────────

export type WeddingEvent = {
  name: string         // 'Akad Nikah' | 'Resepsi' | custom
  date: string         // ISO date string
  time: string         // e.g. '08:00 WIB'
  venue: string
  address: string
  maps_url: string | null
}

export type LoveStoryItem = {
  year: string
  title: string
  body: string
}

export type InvitationContent = {
  couple: {
    partner1_name: string
    partner1_full_name: string
    partner1_parents: string
    partner2_name: string
    partner2_full_name: string
    partner2_parents: string
    photo_url: string | null        // Supabase Storage URL
  }
  events: WeddingEvent[]
  love_story: LoveStoryItem[]
  gallery: string[]                 // Supabase Storage URLs
  music_url: string | null          // Supabase Storage URL — Paid+
  streaming_url: string | null
  opening_text: string
  closing_text: string
}

// ─── Theme Data (weddings.theme JSONB) ───────────────────────────────────────

export type ThemeData = {
  primary_color: string             // hex e.g. '#2d6a4f'
  secondary_color?: string
  font_heading: string              // Google Font name
  font_body: string
  background_color?: string
}

// ─── Invitation Page Props ───────────────────────────────────────────────────

export type InvitationData = {
  wedding: Wedding
  template: Template
  gift_accounts: GiftAccount[]
  messages: Message[]              // approved only
  rsvp_count: {
    hadir: number
    tidak: number
    ragu: number
    total: number
  }
}

// ─── Feature Gating ──────────────────────────────────────────────────────────

export const TIER_FEATURES = {
  music: ['paid', 'premium'] as WeddingTier[],
  theme_customization: ['paid', 'premium'] as WeddingTier[],
  full_analytics: ['paid', 'premium'] as WeddingTier[],
  premium_templates: ['premium'] as WeddingTier[],
  paid_templates: ['paid', 'premium'] as WeddingTier[],
  custom_domain: ['premium'] as WeddingTier[],
  badge_removal: ['premium'] as WeddingTier[],
} as const

export const GUEST_LIMITS: Record<WeddingTier, number> = {
  free: 50,
  paid: 300,
  premium: Infinity,
}

export function canUseFeature(
  tier: WeddingTier,
  feature: keyof typeof TIER_FEATURES
): boolean {
  return (TIER_FEATURES[feature] as readonly WeddingTier[]).includes(tier)
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

export const TIER_PRICES: Record<WeddingTier, number> = {
  free: 0,
  paid: 99000,
  premium: 199000,
}
