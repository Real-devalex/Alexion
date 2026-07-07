"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BrowserApp() {
  const [url, setUrl] = useState("alexion://home");
  const [input, setInput] = useState("alexion://home");

  const navigate = (to: string) => {
    setUrl(to);
    setInput(to);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(input);
  };

  const isAlexionHome = url === "alexion://home";

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Nav bar */}
      <div className="flex items-center gap-2 px-3 h-11 border-b border-white/[0.06] bg-surface-elevated/60 shrink-0">
        <button className="p-1.5 rounded text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors disabled:opacity-20" disabled>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors disabled:opacity-20" disabled>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={() => navigate(url)} className="p-1.5 rounded text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors">
          <RotateCw className="w-4 h-4" />
        </button>
        <button onClick={() => navigate("alexion://home")} className="p-1.5 rounded text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors">
          <Home className="w-4 h-4" />
        </button>

        {/* Address bar */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-os px-3 py-1.5 hover:border-white/20 focus-within:border-alexion-500/50 transition-colors">
            <Lock className="w-3 h-3 text-white/20 shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white/70 text-sm"
              spellCheck={false}
            />
          </div>
        </form>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-hidden">
        {isAlexionHome ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="w-14 h-14 rounded-[16px] bg-gradient-to-br from-alexion-400 to-alexion-700 flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-white text-xl font-bold">Alexion Browser</h2>
              <p className="text-white/30 text-sm mt-1">Your private, fast browser</p>
            </div>
            <div className="flex gap-3">
              {["Google","GitHub","YouTube","Twitter"].map((s) => (
                <button key={s} className="px-4 py-2 rounded-os bg-white/5 border border-white/8 text-white/50 text-sm hover:bg-white/8 hover:text-white transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-white/30">
            <Globe className="w-10 h-10" />
            <p className="text-sm">External browsing coming in a future update.</p>
            <p className="text-xs opacity-60">{url}</p>
          </div>
        )}
      </div>
    </div>
  );
}
