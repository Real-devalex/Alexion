"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User, CheckCircle, XCircle, Loader } from "lucide-react";
import type { RegisterSchema } from "@/lib/validations/auth";

interface StepUsernameProps {
  onNext: () => void;
  onBack: () => void;
}

type AvailStatus = "idle" | "checking" | "available" | "taken";

export default function StepUsername({ onNext, onBack }: StepUsernameProps) {
  const {
    register,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<RegisterSchema>();

  const username = watch("username") ?? "";
  const [availStatus, setAvailStatus] = useState<AvailStatus>("idle");

  // Debounced username availability check
  useEffect(() => {
    if (!username || username.length < 3) {
      setAvailStatus("idle");
      return;
    }
    // Don't check if zod already rejects the value
    if (errors.username) {
      setAvailStatus("idle");
      return;
    }

    setAvailStatus("checking");
    const timer = setTimeout(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("users")
        .select("username")
        .eq("username", username.toLowerCase())
        .maybeSingle();

      setAvailStatus(data ? "taken" : "available");
    }, 500);

    return () => clearTimeout(timer);
  }, [username, errors.username]);

  const handleNext = async () => {
    const valid = await trigger("username");
    if (!valid) return;
    if (availStatus === "taken" || availStatus === "checking") return;
    onNext();
  };

  const availLabel = {
    idle: null,
    checking: (
      <span className="flex items-center gap-1.5 text-white/40">
        <Loader className="w-3.5 h-3.5 animate-spin" /> Checking…
      </span>
    ),
    available: (
      <span className="flex items-center gap-1.5 text-emerald-400">
        <CheckCircle className="w-3.5 h-3.5" /> Available
      </span>
    ),
    taken: (
      <span className="flex items-center gap-1.5 text-red-400">
        <XCircle className="w-3.5 h-3.5" /> Already taken
      </span>
    ),
  }[availStatus];

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white">Choose your username</h2>
        <p className="text-white/40 mt-2">
          This becomes your permanent Alexion identity.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col gap-3"
      >
        <Input
          id="username"
          placeholder="yourname"
          icon={<User className="w-4 h-4" />}
          error={errors.username?.message}
          autoComplete="username"
          autoCapitalize="none"
          autoFocus
          spellCheck={false}
          {...register("username")}
        />

        {/* Availability status */}
        <div className="text-xs pl-1 h-4">{availLabel}</div>

        {/* Live identity preview */}
        {username && !errors.username && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-os bg-alexion-500/10 border border-alexion-500/20 px-4 py-3 text-center"
          >
            <span className="text-white/40 text-sm">Your Alexion identity will be</span>
            <p className="text-alexion-300 font-semibold text-lg mt-0.5 break-all">
              {username.toLowerCase()}@alexion.com
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 w-full"
      >
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1"
          disabled={availStatus === "taken" || availStatus === "checking"}
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
