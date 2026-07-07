"use client";

// ============================================================
// ALEXION OS — Onboarding Step Wrapper
// Handles slide-in / slide-out animation between steps.
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface OnboardingStepProps {
  stepKey: string | number;
  direction: 1 | -1; // 1 = forward, -1 = back
  children: ReactNode;
}

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export default function OnboardingStep({
  stepKey,
  direction,
  children,
}: OnboardingStepProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center w-full min-h-screen px-6 py-12"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
