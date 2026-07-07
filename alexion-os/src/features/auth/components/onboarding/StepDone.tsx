"use client";

// ============================================================
// ALEXION OS — Done Step
// Identity card reveal + auto-redirect countdown.
// ============================================================

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import type { RegisterSchema } from "@/lib/validations/auth";

interface StepDoneProps {
  alexionEmail: string;
  avatarPreview: string | null;
}

export default function StepDone({ alexionEmail, avatarPreview }: StepDoneProps) {
  const router                  = useRouter();
  const { watch }               = useFormContext<RegisterSchema>();
  const displayName             = watch("displayName");
  const username                = watch("username");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/desktop");
      router.refresh();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center gap-10 text-center">
      {/* Checkmark burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
      >
        <motion.svg
          viewBox="0 0 40 40"
          className="w-10 h-10"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.path
            d="M8 20 L17 29 L32 12"
            stroke="#34d399"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-3xl font-bold text-white">You&apos;re all set</h2>
        <p className="text-white/40">Your Alexion identity is ready.</p>
      </motion.div>

      {/* Identity card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-os-xl border border-white/8 bg-surface-elevated/80 backdrop-blur-os p-6 flex items-center gap-5 shadow-glass"
      >
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-alexion-500/20 border border-alexion-500/30 shrink-0 flex items-center justify-center">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Your avatar"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-alexion-400 font-bold text-2xl">
              {displayName?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-white font-semibold text-lg truncate">{displayName}</span>
          <span className="text-white/40 text-sm truncate">@{username}</span>
          <span className="text-alexion-400 text-sm font-medium truncate">{alexionEmail}</span>
        </div>
      </motion.div>

      {/* Countdown */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/30 text-sm"
      >
        Entering Alexion OS in{" "}
        <span className="text-white/60 font-semibold tabular-nums">{countdown}</span>…
      </motion.p>
    </div>
  );
}
