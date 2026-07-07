"use client";

// ============================================================
// ALEXION OS — Registration Form
// ============================================================

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User, Lock, Globe, Camera, Eye, EyeOff, AtSign, AlertCircle,
} from "lucide-react";

import { registerSchema, type RegisterSchema } from "@/lib/validations/auth";
import { register } from "@/features/auth/services/authService";
import { COUNTRIES } from "@/lib/constants/countries";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword]        = useState(false);
  const [showConfirm, setShowConfirm]          = useState(false);
  const [avatarPreview, setAvatarPreview]      = useState<string | null>(null);
  const [serverError, setServerError]          = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting]        = useState(false);
  const fileInputRef                           = useRef<HTMLInputElement>(null);

  const {
    register: field,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", displayName: "", password: "", confirmPassword: "", country: "" },
  });

  const username = watch("username");

  // Show avatar preview when a file is selected
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const onSubmit = async (values: RegisterSchema) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const avatarFile = values.avatar?.[0] as File | undefined;

      const { error } = await register({
        username:     values.username,
        displayName:  values.displayName,
        password:     values.password,
        country:      values.country,
        avatarFile,
      });

      if (error) {
        setServerError(error);
        return;
      }

      // Registration successful — redirect to desktop
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
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-sm text-white/40 mt-1">
          You'll receive a free{" "}
          <span className="text-alexion-400">@alexion.com</span> identity
        </p>
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

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "w-20 h-20 rounded-full border-2 border-dashed border-white/20",
            "flex items-center justify-center overflow-hidden",
            "hover:border-alexion-500/50 transition-colors duration-200",
            "focus-visible:ring-2 focus-visible:ring-alexion-500 outline-none"
          )}
          aria-label="Upload profile picture"
        >
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-6 h-6 text-white/30" />
          )}
        </button>
        <span className="text-xs text-white/30">
          Profile picture{" "}
          <span className="text-white/20">(optional)</span>
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          aria-label="Profile picture file input"
          {...field("avatar")}
          onChange={(e) => {
            field("avatar").onChange(e);
            handleAvatarChange(e);
          }}
        />
        {errors.avatar && (
          <p className="text-xs text-red-400">{errors.avatar.message as string}</p>
        )}
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1">
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
        {username && !errors.username && (
          <p className="text-xs text-alexion-400 pl-1">
            Your Alexion identity: <strong>{username.toLowerCase()}@alexion.com</strong>
          </p>
        )}
      </div>

      {/* Display Name */}
      <Input
        id="displayName"
        label="Display Name"
        placeholder="Your Name"
        icon={<AtSign className="w-4 h-4" />}
        error={errors.displayName?.message}
        autoComplete="name"
        {...field("displayName")}
      />

      {/* Country */}
      <Select
        id="country"
        label="Country"
        placeholder="Select your country"
        options={COUNTRIES}
        error={errors.country?.message}
        {...field("country")}
      />

      {/* Password */}
      <div className="relative">
        <Input
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Min. 8 characters"
          icon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          autoComplete="new-password"
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

      {/* Confirm Password */}
      <div className="relative">
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          placeholder="Repeat your password"
          icon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...field("confirmPassword")}
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          className="absolute right-3 top-9 text-white/30 hover:text-white/60 transition-colors"
          aria-label={showConfirm ? "Hide password" : "Show password"}
        >
          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-1">
        Create Account
      </Button>

      <p className="text-center text-sm text-white/30">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-alexion-400 hover:text-alexion-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
