"use client";

// ============================================================
// ALEXION OS — Start Menu
// ============================================================

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Power, Settings, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWindowManager } from "@/features/desktop/context/WindowManagerContext";
import { useAuth } from "@/features/auth/context/AuthContext";
import { logout } from "@/features/auth/services/authService";
import { APP_REGISTRY } from "@/features/desktop/apps/registry";
import AppIcon from "./AppIcon";

interface StartMenuProps {
  onClose: () => void;
}

export default function StartMenu({ onClose }: StartMenuProps) {
  const { openApp } = useWindowManager();
  const { user }    = useAuth();
  const router      = useRouter();
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    // Delay so the click that opens it doesn't immediately close it
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [onClose]);

  const allApps = Object.values(APP_REGISTRY);
  const filtered = query
    ? allApps.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : allApps;

  const launch = (appId: string) => {
    openApp(appId);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[440px] rounded-os-xl border border-white/10 overflow-hidden"
      style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)" }}
    >
      <div className="bg-surface-elevated/90 backdrop-blur-[32px]">
        {/* Search */}
        <div className="p-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-os px-4 py-2.5 focus-within:border-alexion-500/50 transition-colors">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps…"
              className="flex-1 bg-transparent outline-none text-white/80 text-sm placeholder:text-white/25"
            />
          </div>
        </div>

        {/* Apps grid */}
        <div className="p-4">
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3">
            {query ? "Results" : "All Apps"}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {filtered.map((app) => (
              <button
                key={app.id}
                onClick={() => launch(app.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-os hover:bg-white/8 transition-colors group"
              >
                <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-alexion-500/30 transition-colors">
                  <AppIcon name={app.icon} className="w-5 h-5 text-white/70" />
                </div>
                <span className="text-white/50 text-xs group-hover:text-white/80 transition-colors text-center leading-tight">
                  {app.name}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 py-6 text-center text-white/25 text-sm">
                No apps found
              </div>
            )}
          </div>
        </div>

        {/* Footer — user + power */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-alexion-500/20 border border-alexion-500/30 flex items-center justify-center text-alexion-400 text-sm font-bold shrink-0">
              {user?.displayName.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div className="flex flex-col">
              <span className="text-white/70 text-xs font-medium">{user?.displayName}</span>
              <span className="text-white/25 text-[10px]">{user?.alexionEmail}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { launch("settings"); }}
              className="p-2 rounded-os text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-os text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
