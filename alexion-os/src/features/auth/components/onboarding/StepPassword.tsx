"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Lock, Eye, EyeOff, CheckCircle, Circle } from "lucide-react";
import type { RegisterSchema } from "@/lib/validations/auth";

interface StepPasswordProps {
  onNext: () => void;
  onBack: () => void;
}

interface Rule {
  label: string;
  test: (v: string) => boolean;
}

const RULES: Rule[] = [
  { label: "At least 8 characters",   test: (v) => v.length >= 8 },
  { label: "One uppercase letter",    test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter",    test: (v) => /[a-z]/.test(v) },
  { label: "One number",              test: (v) => /[0-9]/.test(v) },
];

export default function StepPassword({ onNext, onBack }: StepPasswordProps) {
  const {
    register,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<RegisterSchema>();

  const [showPassword, setShowPassword]  = useState(false);
  const [showConfirm,  setShowConfirm]   = useState(false);
  const password = watch("password") ?? "";

  const handleNext = async () => {
    const valid = await trigger(["password", "confirmPassword"]);
    if (valid) onNext();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white">Create a password</h2>
        <p className="text-white/40 mt-2">Keep your account secure.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col gap-4"
      >
        {/* Password */}
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            autoComplete="new-password"
            autoFocus
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password rules */}
        <div className="grid grid-cols-2 gap-2">
          {RULES.map((rule) => {
            const met = rule.test(password);
            return (
              <div key={rule.label} className="flex items-center gap-2">
                {met
                  ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  : <Circle      className="w-3.5 h-3.5 text-white/20 shrink-0" />
                }
                <span className={`text-xs ${met ? "text-emerald-400" : "text-white/30"}`}>
                  {rule.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Confirm */}
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors"
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 w-full"
      >
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={handleNext} className="flex-1">Continue</Button>
      </motion.div>
    </div>
  );
}
