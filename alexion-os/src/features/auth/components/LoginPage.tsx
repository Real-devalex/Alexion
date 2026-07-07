"use client";

// ============================================================
// ALEXION OS — Login Page
// Full-screen premium login with animated logo entrance.
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

import { loginSchema, type LoginSchema } from "@/lib/validations/auth";
import { login } from "@/features/auth/services/authService";
import { useAuth } from "@/features/auth/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router                              = useRouter();
  const { refreshUser }                    = useAuth();
  const [showPassword, setShowPassword]    = useState(false);
  const [serverError, setServerError]      = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting]    = useState(false);

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: LoginSchema) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const { error } = await login({ username: values.username, password: values.password });
      if (error) { setServerError(error); return; }
      await refreshUser();
      router.push("/desktop");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-alexion-600/8 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm flex flex-col items-center gap-8"
      >
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-alexion-400 to-alexion-700 flex items-center justify-center shadow-glow">
            <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
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
          </div>
          <div className="text-center">
            <p className="text-white font-semibold tracking-tight">Alexion OS</p>
            <p className="text-white/30 text-xs tracking-widest uppercase mt-0.5">Sign in</p>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-os-xl border border-white/8 bg-surface-elevated/80 backdrop-blur-os shadow-glass p-7"
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <div className="text-center mb-1">
              <h1 className="text-xl font-bold text-white">Welcome back</h1>
              <p className="text-white/35 text-sm mt-1">Sign in with your Alexion identity</p>
            </div>

            {/* Server error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 rounded-os bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {serverError}
              </motion.div>
            )}

            <Input
              id="username"
              label="Username"
              placeholder="yourname"
              icon={<User className="w-4 h-4" />}
              error={errors.username?.message}
              autoComplete="username"
              autoCapitalize="none"
              autoFocus
              spellCheck={false}
              {...field("username")}
            />

            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                autoComplete="current-password"
                {...field("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-9 text-white/30 hover:text-white/60 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-1 py-3.5">
              Sign In
            </Button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/25 text-sm"
        >
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-alexion-400 hover:text-alexion-300 font-medium transition-colors">
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
