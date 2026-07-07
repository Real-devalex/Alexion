// ============================================================
// ALEXION OS — Auth Service
// ============================================================

import { createClient } from "@/lib/supabase/client";
import { mapUserRow } from "@/lib/utils";
import type { AlexionUser } from "@/types/auth";

const ALEXION_DOMAIN = process.env.NEXT_PUBLIC_ALEXION_DOMAIN ?? "alexion.com";

// ─────────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────────
export async function register(params: {
  username: string;
  displayName: string;
  password: string;
  country: string;
  avatarFile?: File;
}): Promise<{ user: AlexionUser | null; error: string | null }> {
  const supabase = createClient();

  // 1. Check username availability
  const { data: existing } = await supabase
    .from("users")
    .select("username")
    .eq("username", params.username.toLowerCase())
    .maybeSingle();

  if (existing) {
    return { user: null, error: "Username is already taken" };
  }

  const alexionEmail = `${params.username.toLowerCase()}@${ALEXION_DOMAIN}`;

  // 2. Create the auth user FIRST (no avatar yet — we don't have the userId)
  const { data, error } = await supabase.auth.signUp({
    email: alexionEmail,
    password: params.password,
    options: {
      data: {
        username:     params.username.toLowerCase(),
        display_name: params.displayName,
        country:      params.country,
        avatar_url:   null, // will be updated after upload
      },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (!data.user) {
    return { user: null, error: "Registration failed. Please try again." };
  }

  const userId = data.user.id;

  // 3. Upload avatar NOW that we have the userId
  //    Path: {userId}/avatar.{ext} — matches the storage RLS policy
  let avatarUrl: string | null = null;

  if (params.avatarFile) {
    const fileExt = params.avatarFile.name.split(".").pop() ?? "jpg";
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, params.avatarFile, { upsert: true });

    if (!uploadError) {
      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      avatarUrl = publicUrl.publicUrl;

      // 4. Update the users row with the avatar URL
      await supabase
        .from("users")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);
    }
    // Avatar failure is non-fatal — account is still created
  }

  // 5. Fetch the created profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    // Auth row exists but public profile not ready yet (trigger delay) — not fatal
    return { user: null, error: null };
  }

  return { user: mapUserRow(profile), error: null };
}

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
export async function login(params: {
  username: string;
  password: string;
}): Promise<{ user: AlexionUser | null; error: string | null }> {
  const supabase = createClient();

  const alexionEmail = `${params.username.toLowerCase()}@${ALEXION_DOMAIN}`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: alexionEmail,
    password: params.password,
  });

  if (error) {
    return { user: null, error: "Invalid username or password" };
  }

  if (!data.user) {
    return { user: null, error: "Login failed. Please try again." };
  }

  // Update last_login
  await supabase
    .from("users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.user.id);

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    return { user: null, error: "Could not load profile. Please try again." };
  }

  return { user: mapUserRow(profile), error: null };
}

// ─────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────
export async function logout(): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

// ─────────────────────────────────────────────────────────────
// GET CURRENT USER PROFILE
// ─────────────────────────────────────────────────────────────
export async function getCurrentUser(): Promise<AlexionUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ? mapUserRow(profile) : null;
}
