import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DesktopShell from "@/features/desktop/DesktopShell";

export default async function DesktopPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <DesktopShell />;
}
