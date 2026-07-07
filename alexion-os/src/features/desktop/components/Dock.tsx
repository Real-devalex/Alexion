"use client";

// ============================================================
// ALEXION OS — Dock
// App launcher, sits above the taskbar.
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWindowManager } from "@/features/desktop/context/WindowManagerContext";
import { PINNED_APPS } from "@/features/desktop/apps/registry";
import AppIcon from "./AppIcon";

export default function Dock() {
  const { windows, openApp } = useWindowManager();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex items-end justify-center pointer-events-none">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-os-xl border border-white/10 bg-white/[0.06] backdrop-blur-[32px] pointer-events-auto"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)" }}
      >
        {PINNED_APPS.map((app) => {
          const isOpen = windows.some((w) => w.appId === app.id && w.state !== "minimized");
          const isRunning = windows.some((w) => w.appId === app.id);

          return (
            <div key={app.id} className="relative flex flex-col items-center">
              {/* Tooltip */}
              <AnimatePresence>
                {hovered === app.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md bg-surface-overlay border border-white/10 text-white/80 text-xs shadow-lg pointer-events-none"
                  >
                    {app.name}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon button */}
              <motion.button
                onClick={() => openApp(app.id)}
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.2, y: -4 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={cn(
                  "w-12 h-12 rounded-[14px] flex items-center justify-center transition-colors",
                  "bg-gradient-to-br from-white/10 to-white/5",
                  "border border-white/10",
                  isOpen && "from-alexion-500/20 to-alexion-700/20 border-alexion-500/30"
                )}
                aria-label={`Open ${app.name}`}
              >
                <AppIcon name={app.icon} className="w-6 h-6 text-white/80" />
              </motion.button>

              {/* Running dot */}
              <div className={cn(
                "w-1 h-1 rounded-full mt-1 transition-all duration-300",
                isRunning ? "bg-alexion-400" : "bg-transparent"
              )} />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
