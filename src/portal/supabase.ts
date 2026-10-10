import { createClient } from '@supabase/supabase-js'

// Both are public by design: what a signed-in person can see is enforced by
// row-level security in the database, not by keeping these secret.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const configured = Boolean(url && key)

export const supabase = createClient(url || 'http://localhost', key || 'not-configured', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
})
