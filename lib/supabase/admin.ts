import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service role client — server-side only, never exposed to browser
// Use for: admin operations, webhook handlers, payment verification
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
