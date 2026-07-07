"use client";

// ============================================================
// ALEXION OS — Login Form
// ============================================================

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

import { loginSchema, type LoginSchema } from "@/lib/validations/auth";
import { login } from "@/features/auth/services/authService";
import { useAuth } from "@/features/auth/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const { refreshUser }               = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError]   = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const { error } = await login({
        username: values.username,
        password: values.password,
      });

      if (error) {
        setServerError(error);
        return;
      }

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-white/40 mt-1">Sign in to your Alexion account</p>
      </div>

      {/* Server error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-os bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Username */}
      <Input
        id="username"
        label="Username"
        placeholder="yourname"
        icon={<User className="w-4 h-4" />}
        error={errors.username?.message}
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        {...field("username")}
      />

      {/* Password */}
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

      <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-1">
        Sign In
      </Button>

      <p className="text-center text-sm text-white/30">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-alexion-400 hover:text-alexion-300 font-medium transition-colors"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
