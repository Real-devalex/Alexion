// ============================================================
// ALEXION OS — Auth Service
// All authentication operations go through this service.
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

  // Check username availability before attempting signup
  const { data: existing } = await supabase
    .from("users")
    .select("username")
    .eq("username", params.username.toLowerCase())
    .maybeSingle();

  if (existing) {
    return { user: null, error: "Username is already taken" };
  }

  // The Alexion email is auto-generated — the user never chooses it.
  const alexionEmail = `${params.username.toLowerCase()}@${ALEXION_DOMAIN}`;

  let avatarUrl: string | null = null;

  // Upload avatar to Supabase Storage if provided
  if (params.avatarFile) {
    const fileExt = params.avatarFile.name.split(".").pop();
    const filePath = `${params.username.toLowerCase()}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars") // Bucket name — create this in Supabase Storage
      .upload(filePath, params.avatarFile, { upsert: true });

    if (!uploadError) {
      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      avatarUrl = publicUrl.publicUrl;
    }
    // If upload fails, we continue without an avatar rather than blocking signup
  }

  // Create the Supabase Auth user
  // The handle_new_user() database trigger will create the public.users row
  const { data, error } = await supabase.auth.signUp({
    email: alexionEmail,
    password: params.password,
    options: {
      data: {
        username:     params.username.toLowerCase(),
        display_name: params.displayName,
        country:      params.country,
        avatar_url:   avatarUrl,
      },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (!data.user) {
    return { user: null, error: "Registration failed. Please try again." };
  }

  // Fetch the newly created profile
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    // Auth succeeded but profile fetch failed — not a blocker
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
    // Return a generic message to avoid username enumeration
    return { user: null, error: "Invalid username or password" };
  }

  if (!data.user) {
    return { user: null, error: "Login failed. Please try again." };
  }

  // Update last_login timestamp
  await supabase
    .from("users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.user.id);

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return mapUserRow(profile);
}
