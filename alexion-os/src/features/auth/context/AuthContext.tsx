"use client";

// ============================================================
// ALEXION OS — Auth Context
// Provides the authenticated user to the entire app.
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { mapUserRow } from "@/lib/utils";
import type { AlexionUser, AuthState } from "@/types/auth";

interface AuthContextValue extends AuthState {
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchUserProfile = useCallback(
    async (userId: string): Promise<AlexionUser | null> => {
      const supabase = createClient();
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      return data ? mapUserRow(data) : null;
    },
    []
  );

  const refreshUser = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }

    const profile = await fetchUserProfile(user.id);
    setState({
      user: profile,
      isLoading: false,
      isAuthenticated: !!profile,
    });
  }, [fetchUserProfile]);

  useEffect(() => {
    const supabase = createClient();

    // Load initial session
    refreshUser();

    // Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setState({ user: profile, isLoading: false, isAuthenticated: !!profile });
      } else if (event === "SIGNED_OUT") {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Silently refresh — don't re-fetch profile on every token refresh
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, refreshUser]);

  return (
    <AuthContext.Provider value={{ ...state, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
