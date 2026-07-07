"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading = false,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "relative inline-flex items-center justify-center gap-2",
          "rounded-os px-5 py-3 text-sm font-semibold",
          "transition-all duration-200 select-none outline-none",
          "focus-visible:ring-2 focus-visible:ring-alexion-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" && [
            "bg-alexion-500 text-white",
            "hover:bg-alexion-600 active:scale-[0.98]",
            "shadow-glow",
          ],
          variant === "ghost" && [
            "bg-white/5 text-white/80 border border-white/10",
            "hover:bg-white/10 hover:text-white active:scale-[0.98]",
          ],
          variant === "danger" && [
            "bg-red-500/20 text-red-400 border border-red-500/30",
            "hover:bg-red-500/30 active:scale-[0.98]",
          ],
          fullWidth && "w-full",
          className
        )}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <span
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="animate-spin h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </span>
        )}
        <span className={cn(isLoading && "invisible")}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
