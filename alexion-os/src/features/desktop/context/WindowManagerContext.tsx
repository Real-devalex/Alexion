"use client";

// ============================================================
// ALEXION OS — Window Manager Context
// Central state for all open windows.
// ============================================================

import {
  createContext,
  useContext,
  useCallback,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { WindowInstance, WindowState } from "@/types/desktop";
import { APP_REGISTRY } from "@/features/desktop/apps/registry";

// ── State ────────────────────────────────────────────────────
interface WMState {
  windows: WindowInstance[];
  topZ: number;
}

// ── Actions ──────────────────────────────────────────────────
type WMAction =
  | { type: "OPEN";     appId: string }
  | { type: "CLOSE";    id: string }
  | { type: "FOCUS";    id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "MAXIMIZE"; id: string }
  | { type: "RESTORE";  id: string }
  | { type: "MOVE";     id: string; x: number; y: number }
  | { type: "RESIZE";   id: string; width: number; height: number; x: number; y: number };

const INITIAL_OFFSET = 80; // px gap between cascaded windows

function getInitialPosition(count: number, size: { width: number; height: number }) {
  const vw = typeof window !== "undefined" ? window.innerWidth  : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const taskbarH = 56;
  const cascade = (count % 8) * 28;
  return {
    x: Math.max(0, Math.floor((vw - size.width)  / 2) - INITIAL_OFFSET + cascade),
    y: Math.max(0, Math.floor((vh - taskbarH - size.height) / 2) - INITIAL_OFFSET + cascade),
  };
}

function wmReducer(state: WMState, action: WMAction): WMState {
  switch (action.type) {
    case "OPEN": {
      const app = APP_REGISTRY[action.appId];
      if (!app) return state;

      // If already open and minimized — restore + focus
      const existing = state.windows.find((w) => w.appId === action.appId);
      if (existing) {
        const newZ = state.topZ + 1;
        return {
          topZ: newZ,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? { ...w, state: "normal", isFocused: true, zIndex: newZ }
              : { ...w, isFocused: false }
          ),
        };
      }

      const id    = `${action.appId}-${Date.now()}`;
      const newZ  = state.topZ + 1;
      const pos   = getInitialPosition(state.windows.length, app.defaultSize);

      const newWin: WindowInstance = {
        id,
        appId:     action.appId,
        title:     app.name,
        icon:      app.icon,
        state:     "normal",
        isFocused: true,
        position:  pos,
        size:      { ...app.defaultSize },
        minSize:   { ...app.minSize },
        zIndex:    newZ,
      };

      return {
        topZ: newZ,
        windows: [
          ...state.windows.map((w) => ({ ...w, isFocused: false })),
          newWin,
        ],
      };
    }

    case "CLOSE":
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
      };

    case "FOCUS": {
      const newZ = state.topZ + 1;
      return {
        topZ: newZ,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, isFocused: true, zIndex: newZ, state: w.state === "minimized" ? "normal" : w.state }
            : { ...w, isFocused: false }
        ),
      };
    }

    case "MINIMIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, state: "minimized", isFocused: false } : w
        ),
      };

    case "MAXIMIZE": {
      const w = state.windows.find((w) => w.id === action.id);
      if (!w) return state;
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id
            ? {
                ...win,
                state: "maximized",
                prevPosition: { ...win.position },
                prevSize:     { ...win.size },
              }
            : win
        ),
      };
    }

    case "RESTORE": {
      const w = state.windows.find((win) => win.id === action.id);
      if (!w) return state;
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id
            ? {
                ...win,
                state:    "normal",
                position: win.prevPosition ?? win.position,
                size:     win.prevSize     ?? win.size,
              }
            : win
        ),
      };
    }

    case "MOVE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, position: { x: action.x, y: action.y } } : w
        ),
      };

    case "RESIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                size:     { width: action.width, height: action.height },
                position: { x: action.x,     y: action.y },
              }
            : w
        ),
      };

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────
interface WMContextValue {
  windows: WindowInstance[];
  openApp:    (appId: string) => void;
  closeWindow:(id: string)    => void;
  focusWindow:(id: string)    => void;
  minimizeWindow:(id: string) => void;
  maximizeWindow:(id: string) => void;
  restoreWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow:(id: string, width: number, height: number, x: number, y: number) => void;
}

const WMContext = createContext<WMContextValue | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wmReducer, { windows: [], topZ: 10 });

  const openApp      = useCallback((appId: string)   => dispatch({ type: "OPEN",     appId }),  []);
  const closeWindow  = useCallback((id: string)       => dispatch({ type: "CLOSE",    id }),     []);
  const focusWindow  = useCallback((id: string)       => dispatch({ type: "FOCUS",    id }),     []);
  const minimizeWindow = useCallback((id: string)     => dispatch({ type: "MINIMIZE", id }),     []);
  const maximizeWindow = useCallback((id: string)     => dispatch({ type: "MAXIMIZE", id }),     []);
  const restoreWindow  = useCallback((id: string)     => dispatch({ type: "RESTORE",  id }),     []);
  const moveWindow   = useCallback((id: string, x: number, y: number) =>
    dispatch({ type: "MOVE", id, x, y }), []);
  const resizeWindow = useCallback((id: string, w: number, h: number, x: number, y: number) =>
    dispatch({ type: "RESIZE", id, width: w, height: h, x, y }), []);

  return (
    <WMContext.Provider value={{
      windows: state.windows,
      openApp, closeWindow, focusWindow,
      minimizeWindow, maximizeWindow, restoreWindow,
      moveWindow, resizeWindow,
    }}>
      {children}
    </WMContext.Provider>
  );
}

export function useWindowManager(): WMContextValue {
  const ctx = useContext(WMContext);
  if (!ctx) throw new Error("useWindowManager must be used inside <WindowManagerProvider>");
  return ctx;
}
