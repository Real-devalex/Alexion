"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-white/70">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-os bg-white/5 border border-white/10",
            "px-4 py-3 text-sm text-white",
            "transition-all duration-200 outline-none appearance-none",
            "focus:border-alexion-500 focus:ring-2 focus:ring-alexion-500/20",
            "hover:border-white/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500/60 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-elevated text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
