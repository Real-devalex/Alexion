"use client";

// ============================================================
// ALEXION OS — Boot Entry
// Always plays the boot sequence when visiting the root URL.
// After boot completes, redirects based on auth state.
// ============================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BootSequence from "./BootSequence";

export default function BootEntry() {
  const router = useRouter();
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    // Resolve auth destination in the background while boot plays
    const resolve = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setDestination(user ? "/desktop" : "/login");
    };
    resolve();
  }, []);

  const handleBootComplete = () => {
    // If auth hasn't resolved yet, default to login
    router.replace(destination ?? "/login");
  };

  // Always show the boot sequence — no skipping
  return <BootSequence onComplete={handleBootComplete} />;
}
