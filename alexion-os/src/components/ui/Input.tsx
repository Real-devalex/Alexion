"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-os bg-white/5 border border-white/10",
              "px-4 py-3 text-sm text-white placeholder:text-white/30",
              "transition-all duration-200 outline-none",
              "focus:border-alexion-500 focus:ring-2 focus:ring-alexion-500/20",
              "hover:border-white/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              error && "border-red-500/60 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-red-400 flex items-center gap-1"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
