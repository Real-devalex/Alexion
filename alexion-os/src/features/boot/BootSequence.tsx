"use client";

// ============================================================
// ALEXION OS — Boot Sequence
// A full OS-style power-on animation.
//
// Phases:
//  0  black         — dead screen
//  1  flicker       — brief screen flicker like a monitor waking
//  2  logo          — Alexion mark draws in
//  3  loading       — progress bar fills (with intentional stall)
//  4  ready         — "Press any key" or auto-advance
//  5  fadeout       — everything fades to black before handoff
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "black" | "flicker" | "logo" | "loading" | "ready" | "fadeout";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase,    setPhase]    = useState<Phase>("black");
  const [barWidth, setBarWidth] = useState(0);
  const [ready,    setReady]    = useState(false);

  // Advance to next phase
  const next = useCallback((p: Phase) => setPhase(p), []);

  // ── Phase sequencer ───────────────────────────────────────
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const at = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms));
    };

    // 0.0s  — black (already default)
    // 0.4s  — flicker
    at(400,  () => next("flicker"));
    // 1.1s  — logo draws in
    at(1100, () => next("logo"));
    // 2.8s  — loading bar starts
    at(2800, () => next("loading"));
    // 9.5s  — ready state (bar should be full by now)
    // No auto-advance — user MUST press a key or click to continue
    at(9500, () => { next("ready"); setReady(true); });

    return () => timers.forEach(clearTimeout);
  }, [next, onComplete]);

  // ── Loading bar animation ─────────────────────────────────
  // Simulates realistic hardware load: fast start, stalls, then finishes
  useEffect(() => {
    if (phase !== "loading") return;

    const steps: { target: number; duration: number }[] = [
      { target: 28,  duration: 600  }, // quick initial burst
      { target: 55,  duration: 900  }, // steady
      { target: 62,  duration: 2000 }, // stall — feels real
      { target: 75,  duration: 700  }, // resume
      { target: 83,  duration: 1500 }, // another stall
      { target: 100, duration: 800  }, // complete
    ];

    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach(({ target, duration }) => {
      timers.push(
        setTimeout(() => setBarWidth(target), elapsed)
      );
      elapsed += duration;
    });

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (!ready) return;
    const handler = () => {
      next("fadeout");
      setTimeout(() => onComplete(), 700);
    };
    window.addEventListener("keydown", handler);
    window.addEventListener("click",   handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click",   handler);
    };
  }, [ready, next, onComplete]);

  // ── Flicker frames ────────────────────────────────────────
  const flickerOpacity =
    phase === "flicker"
      ? [0, 0.4, 0.1, 0.6, 0.2, 0.8, 1]
      : phase === "black"
      ? 0
      : 1;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#06060e] overflow-hidden select-none"
      animate={phase === "fadeout" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Scanline overlay — subtle CRT feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)",
        }}
        aria-hidden
      />

      {/* Ambient radial glow — only visible from logo phase onward */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "logo" || phase === "loading" || phase === "ready" ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_50%,rgba(99,102,241,0.12),transparent)]" />
      </motion.div>

      {/* ── FLICKER ── */}
      <AnimatePresence>
        {phase === "flicker" && (
          <motion.div
            key="flicker"
            className="absolute inset-0 bg-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: flickerOpacity }}
            transition={{ duration: 0.6, times: [0, 0.1, 0.25, 0.4, 0.6, 0.8, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT (logo onwards) ── */}
      <motion.div
        className="flex flex-col items-center gap-8"
        initial={{ opacity: 0 }}
        animate={{
          opacity: ["black", "flicker"].includes(phase) ? 0 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo container */}
        <motion.div
          initial={{ scale: 0.55, opacity: 0 }}
          animate={
            phase === "black" || phase === "flicker"
              ? { scale: 0.55, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-5"
        >
          {/* Logo mark with glow pulse */}
          <motion.div
            animate={
              phase === "loading" || phase === "ready"
                ? {
                    boxShadow: [
                      "0 0 20px rgba(99,102,241,0.2)",
                      "0 0 60px rgba(99,102,241,0.45)",
                      "0 0 30px rgba(99,102,241,0.25)",
                    ],
                  }
                : { boxShadow: "0 0 0px rgba(99,102,241,0)" }
            }
            transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            className="w-24 h-24 rounded-[26px] bg-gradient-to-br from-alexion-400 via-alexion-500 to-alexion-700 flex items-center justify-center"
          >
            <svg viewBox="0 0 40 40" className="w-12 h-12" fill="none">
              <motion.path
                d="M20 5 L35 35 H26 L20 19 L14 35 H5 Z"
                stroke="white"
                strokeWidth="1.8"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  phase !== "black" && phase !== "flicker"
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
              />
              <motion.line
                x1="10" y1="25" x2="30" y2="25"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  phase !== "black" && phase !== "flicker"
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
              />
            </svg>
          </motion.div>

          {/* Wordmark */}
          <motion.div
            className="flex flex-col items-center gap-1.5"
            initial={{ opacity: 0, y: 10 }}
            animate={
              phase !== "black" && phase !== "flicker"
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-white text-3xl font-bold tracking-tight">
              Alexion
            </span>
            <span className="text-white/25 text-[11px] tracking-[0.35em] uppercase">
              Operating System
            </span>
          </motion.div>
        </motion.div>

        {/* ── Loading bar ── */}
        <AnimatePresence>
          {(phase === "loading" || phase === "ready") && (
            <motion.div
              key="bar"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Track */}
              <div className="w-48 h-[3px] bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-alexion-500 to-alexion-400"
                  style={{
                    width: `${barWidth}%`,
                    boxShadow: "0 0 10px rgba(99,102,241,0.8)",
                    transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>

              {/* Status text */}
              <motion.p
                key={barWidth}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/25 text-[11px] tracking-widest uppercase"
              >
                {barWidth < 30  && "Initializing…"}
                {barWidth >= 30 && barWidth < 56  && "Loading components…"}
                {barWidth >= 56 && barWidth < 76  && "Preparing environment…"}
                {barWidth >= 76 && barWidth < 100 && "Starting services…"}
                {barWidth === 100 && "Ready"}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Press any key ── */}
        <AnimatePresence>
          {phase === "ready" && (
            <motion.p
              key="anykey"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/35 text-sm tracking-widest uppercase mt-2"
            >
              Press any key to continue
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom version tag */}
      <motion.p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/15 text-[10px] tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "loading" || phase === "ready" ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        Alexion OS · Build 0.1.0
      </motion.p>
    </motion.div>
  );
}
