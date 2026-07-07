"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

interface Line {
  type: "input" | "output" | "error" | "system";
  text: string;
}

const HELP_TEXT = `
Available commands:
  help        Show this help message
  whoami      Display current user
  date        Show current date and time
  echo <msg>  Print a message
  clear       Clear the terminal
  ls          List files (mock)
  version     Show Alexion OS version
`.trim();

const MOCK_LS = `
Desktop/    Documents/    Downloads/    Music/
Pictures/   Videos/       trash/
`.trim();

export default function Terminal() {
  const { user } = useAuth();
  const [lines,   setLines]   = useState<Line[]>([
    { type: "system", text: "Alexion OS Terminal v0.1.0" },
    { type: "system", text: `Welcome, ${user?.username ?? "user"}. Type 'help' for available commands.` },
    { type: "system", text: "" },
  ]);
  const [input,   setInput]   = useState("");
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const prompt = `${user?.username ?? "user"}@alexion:~$ `;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    const newLines: Line[] = [...lines, { type: "input", text: `${prompt}${cmd}` }];

    if (cmd) {
      const [base, ...args] = cmd.split(" ");
      switch (base.toLowerCase()) {
        case "help":
          newLines.push({ type: "output", text: HELP_TEXT });
          break;
        case "whoami":
          newLines.push({ type: "output", text: user?.username ?? "unknown" });
          break;
        case "date":
          newLines.push({ type: "output", text: new Date().toString() });
          break;
        case "echo":
          newLines.push({ type: "output", text: args.join(" ") });
          break;
        case "clear":
          setLines([]);
          setInput("");
          return;
        case "ls":
          newLines.push({ type: "output", text: MOCK_LS });
          break;
        case "version":
          newLines.push({ type: "output", text: "Alexion OS 0.1.0 (Build 2025.1)" });
          break;
        default:
          newLines.push({ type: "error", text: `${base}: command not found` });
      }
    } else {
      newLines.push({ type: "output", text: "" });
    }

    setLines(newLines);
    setInput("");
  };

  return (
    <div
      className="h-full bg-[#0a0a0f] text-[13px] font-mono flex flex-col overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-0.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "input"  ? "text-white/90" :
              line.type === "error"  ? "text-red-400"  :
              line.type === "system" ? "text-alexion-400/70" :
              "text-white/60"
            }
            style={{ whiteSpace: "pre-wrap" }}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center px-4 pb-3">
        <span className="text-alexion-400 mr-1 shrink-0">{prompt}</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white/90 caret-alexion-400"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      </form>
    </div>
  );
}
