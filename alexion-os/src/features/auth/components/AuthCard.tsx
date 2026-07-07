"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export default function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-alexion-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-alexion-800/10 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative w-full max-w-md",
          "rounded-os-xl border border-white/8",
          "bg-surface-elevated/80 backdrop-blur-os",
          "shadow-glass p-8",
          className
        )}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-os-lg bg-alexion-500/20 border border-alexion-500/30 flex items-center justify-center mb-4">
            <span className="text-alexion-400 font-bold text-xl tracking-tight">A</span>
          </div>
          <span className="text-white/40 text-xs tracking-widest uppercase">
            Alexion OS
          </span>
        </div>

        {children}
      </motion.div>
    </div>
  );
}
