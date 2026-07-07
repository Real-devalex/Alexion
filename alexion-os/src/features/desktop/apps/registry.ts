// ============================================================
// ALEXION OS — App Registry
// All available apps are defined here.
// ============================================================

import type { AppDefinition } from "@/types/desktop";

export const APP_REGISTRY: Record<string, AppDefinition> = {
  "file-explorer": {
    id: "file-explorer",
    name: "Files",
    icon: "Folder",
    description: "Browse and manage your files",
    defaultSize: { width: 860, height: 560 },
    minSize: { width: 500, height: 360 },
    pinned: true,
  },
  "settings": {
    id: "settings",
    name: "Settings",
    icon: "Settings",
    description: "System preferences",
    defaultSize: { width: 720, height: 520 },
    minSize: { width: 560, height: 400 },
    pinned: true,
  },
  "terminal": {
    id: "terminal",
    name: "Terminal",
    icon: "Terminal",
    description: "Command line interface",
    defaultSize: { width: 700, height: 460 },
    minSize: { width: 420, height: 300 },
    pinned: true,
  },
  "browser": {
    id: "browser",
    name: "Browser",
    icon: "Globe",
    description: "Alexion Browser",
    defaultSize: { width: 1000, height: 680 },
    minSize: { width: 600, height: 400 },
    pinned: true,
  },
  "mail": {
    id: "mail",
    name: "Mail",
    icon: "Mail",
    description: "Alexion Mail",
    defaultSize: { width: 900, height: 620 },
    minSize: { width: 600, height: 400 },
    pinned: true,
  },
};

export const PINNED_APPS = Object.values(APP_REGISTRY).filter((a) => a.pinned);
