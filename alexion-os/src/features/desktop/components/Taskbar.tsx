"use client";

// ============================================================
// ALEXION OS — Taskbar
// Bottom bar: start button, running apps, clock + tray.
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWindowManager } from "@/features/desktop/context/WindowManagerContext";
import { useAuth } from "@/features/auth/context/AuthContext";
import Dock from "./Dock";
import StartMenu from "./StartMenu";
import AppIcon from "./AppIcon";

function Clock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString([], { month: "short", day: "numeric" }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-end leading-none gap-0.5">
      <span className="text-white/80 text-xs font-medium tabular-nums">{time}</span>
      <span className="text-white/30 text-[10px]">{date}</span>
    </div>
  );
}

export default function Taskbar() {
  const { windows, focusWindow, minimizeWindow } = useWindowManager();
  const { user } = useAuth();
  const [startOpen, setStartOpen] = useState(false);

  const visibleWindows = windows.filter((w) => w.state !== "minimized" || true);
  // Show all windows in taskbar including minimized

  const handleTaskbarClick = (winId: string, isFocused: boolean, state: string) => {
    if (isFocused && state !== "minimized") {
      minimizeWindow(winId);
    } else {
      focusWindow(winId);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-14 z-40 flex items-end px-4 pb-2 gap-4"
      style={{ background: "linear-gradient(to top, rgba(6,6,14,0.95), rgba(6,6,14,0.6))" }}
    >
      {/* Start menu (rendered above taskbar) */}
      <AnimatePresence>
        {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
      </AnimatePresence>

      {/* Left: Start button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setStartOpen((v) => !v)}
        className={cn(
          "w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-colors",
          "border border-white/10",
          startOpen
            ? "bg-alexion-500/30 border-alexion-500/40"
            : "bg-white/[0.06] hover:bg-white/10"
        )}
        aria-label="Start menu"
        aria-expanded={startOpen}
      >
        <div className="grid grid-cols-2 gap-[3px]">
          {[0,1,2,3].map((i) => (
            <div
              key={i}
              className={cn(
                "w-[7px] h-[7px] rounded-[2px] transition-colors",
                startOpen ? "bg-alexion-400" : "bg-white/60"
              )}
            />
          ))}
        </div>
      </motion.button>

      {/* Center: Dock */}
      <div className="flex-1 flex items-end justify-center relative">
        <Dock />
      </div>

      {/* Right: Running apps + clock */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Running apps (minimized or open) */}
        {windows.length > 0 && (
          <div className="flex items-center gap-1">
            {windows.map((win) => (
              <motion.button
                key={win.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => handleTaskbarClick(win.id, win.isFocused, win.state)}
                className={cn(
                  "flex items-center gap-2 px-2.5 h-8 rounded-md text-xs transition-colors max-w-[140px]",
                  win.isFocused && win.state !== "minimized"
                    ? "bg-alexion-500/20 border border-alexion-500/30 text-white/80"
                    : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:bg-white/[0.08] hover:text-white/60"
                )}
              >
                <AppIcon name={win.icon} className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{win.title}</span>
              </motion.button>
            ))}
          </div>
        )}

        <div className="w-px h-6 bg-white/[0.08]" />

        {/* System tray */}
        <div className="flex items-center gap-2">
          {/* User avatar */}
          <div className="w-7 h-7 rounded-full bg-alexion-500/20 border border-alexion-500/30 flex items-center justify-center text-alexion-400 text-xs font-bold shrink-0">
            {user?.displayName?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <Clock />
        </div>
      </div>
    </div>
  );
}
