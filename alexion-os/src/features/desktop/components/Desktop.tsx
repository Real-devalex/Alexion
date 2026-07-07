"use client";

// ============================================================
// ALEXION OS — Desktop Canvas
// Renders wallpaper, desktop icons, and all open windows.
// ============================================================

import { useWindowManager } from "@/features/desktop/context/WindowManagerContext";
import Window from "./Window";
import AppRenderer from "@/features/desktop/apps/AppRenderer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/context/AuthContext";

// Default wallpaper — deep space gradient, feel of booting into something premium
const DEFAULT_WALLPAPER = `
  radial-gradient(ellipse 80% 60% at 20% 30%, rgba(99,102,241,0.18) 0%, transparent 60%),
  radial-gradient(ellipse 60% 40% at 80% 70%, rgba(79,70,229,0.12) 0%, transparent 55%),
  radial-gradient(ellipse 100% 100% at 50% 50%, #080812 40%, #0d0d1a 100%)
`.trim();

export default function Desktop() {
  const { windows, focusWindow } = useWindowManager();
  const { user } = useAuth();

  const wallpaper = user?.wallpaper ?? null;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: wallpaper ? `url(${wallpaper}) center/cover no-repeat` : DEFAULT_WALLPAPER,
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Click desktop to unfocus all windows */}
      <div
        className="absolute inset-0"
        onMouseDown={() => {
          // Clicking bare desktop doesn't steal focus from windows
        }}
      />

      {/* Windows layer */}
      {windows.map((win) => (
        <Window key={win.id} win={win}>
          <AppRenderer appId={win.appId} />
        </Window>
      ))}
    </div>
  );
}
