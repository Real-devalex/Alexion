"use client";

import { useState } from "react";
import {
  User, Palette, Bell, Shield, HardDrive,
  Globe, Accessibility, Monitor, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/context/AuthContext";

const SECTIONS = [
  { id: "account",       label: "Account",       icon: <User          className="w-4 h-4" /> },
  { id: "appearance",    label: "Appearance",     icon: <Palette       className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications",  icon: <Bell          className="w-4 h-4" /> },
  { id: "security",      label: "Security",       icon: <Shield        className="w-4 h-4" /> },
  { id: "storage",       label: "Storage",        icon: <HardDrive     className="w-4 h-4" /> },
  { id: "language",      label: "Language",       icon: <Globe         className="w-4 h-4" /> },
  { id: "accessibility", label: "Accessibility",  icon: <Accessibility className="w-4 h-4" /> },
  { id: "display",       label: "Display",        icon: <Monitor       className="w-4 h-4" /> },
];

function StorageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, (used / limit) * 100);
  const gb  = (n: number) => (n / 1073741824).toFixed(2);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs text-white/40">
        <span>{gb(used)} GB used</span>
        <span>{gb(limit)} GB total</span>
      </div>
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-alexion-500 to-alexion-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [section, setSection] = useState("account");

  return (
    <div className="flex h-full bg-surface text-white text-sm">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-white/[0.06] flex flex-col gap-1 p-3 overflow-y-auto">
        <p className="text-white/30 text-[10px] uppercase tracking-wider px-2 mb-1">Settings</p>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-os text-left transition-colors",
              section === s.id
                ? "bg-alexion-500/20 text-alexion-300"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className={section === s.id ? "text-alexion-400" : "text-white/30"}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {section === "account" && user && (
          <div className="flex flex-col gap-6 max-w-lg">
            <h2 className="text-lg font-semibold text-white">Account</h2>
            <div className="flex items-center gap-4 p-4 rounded-os-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="w-16 h-16 rounded-full bg-alexion-500/20 border border-alexion-500/30 flex items-center justify-center text-2xl font-bold text-alexion-400 shrink-0">
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                  : user.displayName.charAt(0).toUpperCase()
                }
              </div>
              <div>
                <p className="text-white font-semibold">{user.displayName}</p>
                <p className="text-white/40 text-xs">@{user.username}</p>
                <p className="text-alexion-400 text-xs mt-0.5">{user.alexionEmail}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Row label="Username"   value={`@${user.username}`} />
              <Row label="Email"      value={user.alexionEmail} />
              <Row label="Country"    value={user.country} />
              <Row label="Member since" value={new Date(user.createdAt).toLocaleDateString()} />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Storage</p>
              <StorageBar used={user.storageUsed} limit={user.storageLimit} />
            </div>
          </div>
        )}

        {section === "appearance" && (
          <div className="flex flex-col gap-6 max-w-lg">
            <h2 className="text-lg font-semibold text-white">Appearance</h2>
            <div className="flex flex-col gap-3">
              <p className="text-white/40 text-xs uppercase tracking-wider">Theme</p>
              <div className="flex gap-3">
                {["Dark", "Light"].map((t) => (
                  <button
                    key={t}
                    className={cn(
                      "flex-1 py-3 rounded-os border text-sm font-medium transition-colors",
                      t === "Dark"
                        ? "bg-alexion-500/20 border-alexion-500/40 text-alexion-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/8"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-white/40 text-xs uppercase tracking-wider">Accent Color</p>
              <div className="flex gap-2">
                {["#6366f1","#ec4899","#10b981","#f59e0b","#ef4444","#3b82f6"].map((c) => (
                  <button
                    key={c}
                    className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white/40 transition-all"
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {!["account","appearance"].includes(section) && (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-white capitalize">{section}</h2>
            <p className="text-white/30">This section is coming in a future update.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
      <span className="text-white/40">{label}</span>
      <span className="text-white/70">{value}</span>
    </div>
  );
}
