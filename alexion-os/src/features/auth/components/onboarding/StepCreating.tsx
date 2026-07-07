"use client";

// ============================================================
// ALEXION OS — Creating Account Step
// Shows while the registration API call is in-flight,
// then transitions to the Done step on success.
// ============================================================

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface StepCreatingProps {
  onSuccess: (alexionEmail: string) => void;
  onError: (message: string) => void;
  execute: () => Promise<{ alexionEmail: string | null; error: string | null }>;
}

const MESSAGES = [
  "Creating your identity…",
  "Generating your Alexion email…",
  "Securing your account…",
  "Almost there…",
];

export default function StepCreating({ onSuccess, onError, execute }: StepCreatingProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    // Cycle through messages every 900ms for feel
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 900);

    // Kick off the actual registration
    execute().then(({ alexionEmail, error }) => {
      clearInterval(interval);
      if (error || !alexionEmail) {
        onError(error ?? "Something went wrong.");
      } else {
        onSuccess(alexionEmail);
      }
    });

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Spinning logo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-alexion-400 to-alexion-700 flex items-center justify-center"
      >
        <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
          <path d="M20 6 L34 34 H26 L20 20 L14 34 H6 Z" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="11" y1="25" x2="29" y2="25" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.p
        key={msgIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
        className="text-white/60 text-lg"
      >
        {MESSAGES[msgIndex]}
      </motion.p>
    </div>
  );
}
