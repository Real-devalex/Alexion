"use client";

// ============================================================
// ALEXION OS — Desktop Shell
// Root client component for the full desktop environment.
// ============================================================

import { motion } from "framer-motion";
import { WindowManagerProvider } from "./context/WindowManagerContext";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";

export default function DesktopShell() {
  return (
    <WindowManagerProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-0 overflow-hidden bg-[#080812]"
      >
        {/* Desktop canvas (windows render here) */}
        <div className="absolute inset-0 bottom-14">
          <Desktop />
        </div>

        {/* Taskbar — always on top */}
        <Taskbar />
      </motion.div>
    </WindowManagerProvider>
  );
}
