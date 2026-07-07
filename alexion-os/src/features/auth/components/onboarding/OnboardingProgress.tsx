"use client";

// ============================================================
// ALEXION OS — Onboarding Progress Bar
// Thin glowing bar at the top of the screen.
// ============================================================

import { motion } from "framer-motion";

interface OnboardingProgressProps {
  current: number; // 0-indexed
  total: number;
}

export default function OnboardingProgress({
  current,
  total,
}: OnboardingProgressProps) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-[3px] bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-alexion-500 to-alexion-400 rounded-full"
        style={{ boxShadow: "0 0 12px rgba(99,102,241,0.7)" }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
