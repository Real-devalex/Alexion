// ============================================================
// ALEXION OS — Desktop & Window Manager Types
// ============================================================

export type WindowState = "normal" | "minimized" | "maximized";

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  icon: string; // lucide icon name or emoji fallback
  state: WindowState;
  isFocused: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  zIndex: number;
  // snapshot of position/size before maximizing so we can restore
  prevPosition?: { x: number; y: number };
  prevSize?: { width: number; height: number };
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  pinned: boolean; // pinned to dock
}

export interface DesktopIcon {
  id: string;
  appId: string;
  label: string;
  icon: string;
  position: { x: number; y: number };
}
