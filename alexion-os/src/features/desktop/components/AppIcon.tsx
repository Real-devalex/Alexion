"use client";

// Renders a lucide icon by string name
import * as LucideIcons from "lucide-react";

interface AppIconProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export default function AppIcon({ name, className, size, strokeWidth }: AppIconProps) {
  // Cast through unknown to avoid lucide's internal IconComponentProps mismatch
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>>;
  const Icon  = icons[name] ?? icons["Box"];
  return <Icon className={className} size={size} strokeWidth={strokeWidth} />;
}
