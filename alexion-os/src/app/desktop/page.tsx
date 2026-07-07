// ============================================================
// ALEXION OS — Desktop Page (placeholder)
// This will be built out fully in the Desktop module.
// ============================================================

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DesktopPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware handles this redirect, but double-check server-side
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Alexion OS</h1>
        <p className="text-white/40">Desktop coming soon.</p>
      </div>
    </div>
  );
}
