// ============================================================
// ALEXION OS — Supabase Browser Client
// Used in Client Components only.
// ============================================================

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // These values come from your .env.local file.
  // NEXT_PUBLIC_SUPABASE_URL      → Supabase project URL
  // NEXT_PUBLIC_SUPABASE_ANON_KEY → Supabase anon/public key
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
