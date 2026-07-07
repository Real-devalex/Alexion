"use client";

// ============================================================
// ALEXION OS — Window Component
// Draggable, resizable, fully animated OS window.
// ============================================================

import { useRef, useCallback, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Square, X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWindowManager } from "@/features/desktop/context/WindowManagerContext";
import type { WindowInstance } from "@/types/desktop";

const TASKBAR_H  = 56; // px — keep windows above taskbar
const SNAP_THRESHOLD = 16; // px from screen edge to snap

interface WindowProps {
  win: WindowInstance;
  children: ReactNode;
}

export default function Window({ win, children }: WindowProps) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, moveWindow, resizeWindow } =
    useWindowManager();

  const isDragging   = useRef(false);
  const isResizing   = useRef<string | null>(null); // edge: "se" | "s" | "e" | "sw" | "w" | "ne" | "n" | "nw"
  const dragStart    = useRef({ mx: 0, my: 0, wx: 0, wy: 0 });
  const resizeStart  = useRef({ mx: 0, my: 0, wx: 0, wy: 0, w: 0, h: 0 });

  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight - TASKBAR_H;

  // ── Drag (title bar) ─────────────────────────────────────
  const onTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (win.state === "maximized") return;
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      isDragging.current = true;
      dragStart.current = {
        mx: e.clientX,
        my: e.clientY,
        wx: win.position.x,
        wy: win.position.y,
      };
      focusWindow(win.id);
    },
    [win, focusWindow]
  );

  // Double-click title bar = toggle maximize
  const onTitleDblClick = useCallback(() => {
    if (win.state === "maximized") restoreWindow(win.id);
    else maximizeWindow(win.id);
  }, [win, maximizeWindow, restoreWindow]);

  // ── Resize handle ────────────────────────────────────────
  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent, edge: string) => {
      if (win.state === "maximized") return;
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = edge;
      resizeStart.current = {
        mx: e.clientX,
        my: e.clientY,
        wx: win.position.x,
        wy: win.position.y,
        w:  win.size.width,
        h:  win.size.height,
      };
      focusWindow(win.id);
    },
    [win, focusWindow]
  );

  // ── Global mouse move / up ────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const dx = e.clientX - dragStart.current.mx;
        const dy = e.clientY - dragStart.current.my;
        let nx = dragStart.current.wx + dx;
        let ny = dragStart.current.wy + dy;

        // Clamp so title bar stays on-screen
        nx = Math.max(-win.size.width + 120, Math.min(vw() - 60, nx));
        ny = Math.max(0, Math.min(vh() - 40, ny));

        moveWindow(win.id, nx, ny);
        return;
      }

      if (isResizing.current) {
        const edge = isResizing.current;
        const dx   = e.clientX - resizeStart.current.mx;
        const dy   = e.clientY - resizeStart.current.my;
        const { wx, wy, w, h } = resizeStart.current;

        let nw = w, nh = h, nx = wx, ny = wy;

        if (edge.includes("e")) nw = Math.max(win.minSize.width,  w + dx);
        if (edge.includes("s")) nh = Math.max(win.minSize.height, h + dy);
        if (edge.includes("w")) {
          nw = Math.max(win.minSize.width, w - dx);
          nx = wx + (w - nw);
        }
        if (edge.includes("n")) {
          nh = Math.max(win.minSize.height, h - dy);
          ny = wy + (h - nh);
        }

        resizeWindow(win.id, nw, nh, nx, ny);
      }
    };

    const onUp = () => {
      isDragging.current  = false;
      isResizing.current  = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [win, moveWindow, resizeWindow]);

  const isMaximized = win.state === "maximized";
  const isMinimized = win.state === "minimized";

  const windowStyle = isMaximized
    ? { left: 0, top: 0, width: "100vw", height: `calc(100vh - ${TASKBAR_H}px)`, zIndex: win.zIndex }
    : {
        left:   win.position.x,
        top:    win.position.y,
        width:  win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      };

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          key={win.id}
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={windowStyle as React.CSSProperties}
          className={cn(
            "absolute flex flex-col overflow-hidden select-none",
            "border border-white/10",
            isMaximized ? "rounded-none" : "rounded-os-lg",
            win.isFocused
              ? "shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]",
          )}
          onMouseDown={() => focusWindow(win.id)}
        >
          {/* Glass background */}
          <div className="absolute inset-0 bg-surface-elevated/90 backdrop-blur-[32px] -z-10" />

          {/* ── Title bar ───────────────────────────────── */}
          <div
            className={cn(
              "flex items-center gap-3 px-4 h-11 shrink-0 cursor-default",
              "border-b border-white/[0.06]",
              win.isFocused ? "bg-white/[0.04]" : "bg-transparent",
              win.state !== "maximized" && "cursor-grab active:cursor-grabbing"
            )}
            onMouseDown={onTitleMouseDown}
            onDoubleClick={onTitleDblClick}
          >
            {/* Traffic light controls */}
            <div className="flex items-center gap-1.5" onMouseDown={(e) => e.stopPropagation()}>
              {/* Close */}
              <button
                onClick={() => closeWindow(win.id)}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors flex items-center justify-center group"
                aria-label="Close"
              >
                <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
              </button>
              {/* Minimize */}
              <button
                onClick={() => minimizeWindow(win.id)}
                className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
                aria-label="Minimize"
              >
                <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
              </button>
              {/* Maximize / Restore */}
              <button
                onClick={() => isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
                className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors flex items-center justify-center group"
                aria-label={isMaximized ? "Restore" : "Maximize"}
              >
                {isMaximized
                  ? <Minimize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" />
                  : <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" />
                }
              </button>
            </div>

            {/* Title */}
            <span className={cn(
              "flex-1 text-center text-[13px] font-medium truncate",
              win.isFocused ? "text-white/80" : "text-white/30"
            )}>
              {win.title}
            </span>

            {/* Spacer to balance traffic lights */}
            <div className="w-14" />
          </div>

          {/* ── Content area ─────────────────────────────── */}
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>

          {/* ── Resize handles (8 edges) ─────────────────── */}
          {!isMaximized && (
            <>
              {/* Corners */}
              <div onMouseDown={(e) => onResizeMouseDown(e, "nw")} className="absolute top-0    left-0   w-3 h-3 cursor-nw-resize z-20" />
              <div onMouseDown={(e) => onResizeMouseDown(e, "ne")} className="absolute top-0    right-0  w-3 h-3 cursor-ne-resize z-20" />
              <div onMouseDown={(e) => onResizeMouseDown(e, "sw")} className="absolute bottom-0 left-0   w-3 h-3 cursor-sw-resize z-20" />
              <div onMouseDown={(e) => onResizeMouseDown(e, "se")} className="absolute bottom-0 right-0  w-3 h-3 cursor-se-resize z-20" />
              {/* Edges */}
              <div onMouseDown={(e) => onResizeMouseDown(e, "n")}  className="absolute top-0    left-3   right-3  h-1 cursor-n-resize  z-20" />
              <div onMouseDown={(e) => onResizeMouseDown(e, "s")}  className="absolute bottom-0 left-3   right-3  h-1 cursor-s-resize  z-20" />
              <div onMouseDown={(e) => onResizeMouseDown(e, "w")}  className="absolute top-3    bottom-3 left-0   w-1 cursor-w-resize  z-20" />
              <div onMouseDown={(e) => onResizeMouseDown(e, "e")}  className="absolute top-3    bottom-3 right-0  w-1 cursor-e-resize  z-20" />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
