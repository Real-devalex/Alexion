"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface StepWelcomeProps {
  onNext: () => void;
}

export default function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-lg gap-8">
      {/* Animated logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-alexion-400 to-alexion-700 flex items-center justify-center shadow-glow"
      >
        <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
          <path
            d="M20 6 L34 34 H26 L20 20 L14 34 H6 Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line x1="11" y1="25" x2="29" y2="25" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-3"
      >
        <h1 className="text-4xl font-bold text-white leading-tight">
          Welcome to Alexion
        </h1>
        <p className="text-white/50 text-lg leading-relaxed">
          Let&apos;s set up your permanent Alexion identity.
          <br />
          This only takes a minute.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-3 w-full max-w-xs"
      >
        <Button fullWidth onClick={onNext} className="py-4 text-base">
          Get started
        </Button>
        <p className="text-white/25 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-alexion-400 hover:text-alexion-300 transition-colors">
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
