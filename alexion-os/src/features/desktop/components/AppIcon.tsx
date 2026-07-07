"use client";

// Renders a lucide icon by string name
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

interface AppIconProps extends LucideProps {
  name: string;
}

export default function AppIcon({ name, ...props }: AppIconProps) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Icon) return <LucideIcons.Box {...props} />;
  return <Icon {...props} />;
}
