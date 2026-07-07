// ============================================================
// ALEXION OS — Auth Validation Schemas (Zod)
// ============================================================

import { z } from "zod";

// Reserved usernames that cannot be registered
const RESERVED_USERNAMES = [
  "admin", "alexion", "support", "help", "root", "system",
  "mail", "noreply", "no-reply", "postmaster", "webmaster",
  "abuse", "security", "info", "contact", "api",
];

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(24, "Username must be 24 characters or less")
      .regex(
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores"
      )
      .refine(
        (val) => !RESERVED_USERNAMES.includes(val.toLowerCase()),
        "This username is reserved"
      ),

    displayName: z
      .string()
      .min(2, "Display name must be at least 2 characters")
      .max(48, "Display name must be 48 characters or less")
      .regex(/^[^\s].*[^\s]$|^[^\s]$/, "Display name cannot start or end with a space"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be 72 characters or less")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),

    country: z
      .string()
      .min(1, "Please select your country"),

    avatar: z
      .any()
      .optional()
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          return files[0].size <= 5 * 1024 * 1024; // 5 MB
        },
        "Avatar must be smaller than 5 MB"
      )
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          return ["image/jpeg", "image/png", "image/webp"].includes(files[0].type);
        },
        "Avatar must be a JPEG, PNG, or WebP image"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(24, "Invalid username"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
