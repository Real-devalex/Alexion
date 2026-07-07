"use client";

import { useState } from "react";
import {
  Folder, FolderOpen, File, Image, Music, Video,
  Download, Trash2, Star, Clock, HardDrive, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { id: "desktop",   label: "Desktop",   icon: <HardDrive  className="w-4 h-4" /> },
  { id: "documents", label: "Documents", icon: <Folder     className="w-4 h-4" /> },
  { id: "downloads", label: "Downloads", icon: <Download   className="w-4 h-4" /> },
  { id: "pictures",  label: "Pictures",  icon: <Image      className="w-4 h-4" /> },
  { id: "music",     label: "Music",     icon: <Music      className="w-4 h-4" /> },
  { id: "videos",    label: "Videos",    icon: <Video      className="w-4 h-4" /> },
  { id: "trash",     label: "Trash",     icon: <Trash2     className="w-4 h-4" /> },
  { id: "recent",    label: "Recent",    icon: <Clock      className="w-4 h-4" /> },
  { id: "favorites", label: "Favorites", icon: <Star       className="w-4 h-4" /> },
];

const MOCK_FILES = [
  { name: "Projects",    type: "folder", size: "—",       modified: "Today" },
  { name: "Resume.pdf",  type: "file",   size: "1.2 MB",  modified: "Yesterday" },
  { name: "Notes.txt",   type: "file",   size: "4 KB",    modified: "3 days ago" },
  { name: "Photos",      type: "folder", size: "—",       modified: "Last week" },
  { name: "Music",       type: "folder", size: "—",       modified: "Last week" },
  { name: "archive.zip", type: "file",   size: "48.7 MB", modified: "2 weeks ago" },
];

export default function FileExplorer() {
  const [selected, setSelected] = useState("documents");
  const [view,     setView]     = useState<"grid" | "list">("list");

  return (
    <div className="flex h-full bg-surface text-white text-sm">
      {/* Sidebar */}
      <aside className="w-48 shrink-0 border-r border-white/[0.06] flex flex-col gap-1 p-3 overflow-y-auto">
        <p className="text-white/30 text-[10px] uppercase tracking-wider px-2 mb-1">Locations</p>
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-os text-left transition-colors",
              selected === item.id
                ? "bg-alexion-500/20 text-alexion-300"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className={selected === item.id ? "text-alexion-400" : "text-white/30"}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-white/[0.06] shrink-0">
          <ChevronRight className="w-3.5 h-3.5 text-white/20" />
          <span className="text-white/50 capitalize">{selected}</span>
        </div>

        {/* Files */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-1">
            {/* Header */}
            <div className="grid grid-cols-[1fr_80px_100px] text-white/25 text-xs px-3 py-1 mb-1">
              <span>Name</span>
              <span className="text-right">Size</span>
              <span className="text-right">Modified</span>
            </div>
            {MOCK_FILES.map((file) => (
              <div
                key={file.name}
                className="grid grid-cols-[1fr_80px_100px] items-center px-3 py-2 rounded-os hover:bg-white/5 cursor-default transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  {file.type === "folder"
                    ? <Folder className="w-4 h-4 text-alexion-400 shrink-0" />
                    : <File   className="w-4 h-4 text-white/30 shrink-0" />
                  }
                  <span className="text-white/80 group-hover:text-white transition-colors truncate">
                    {file.name}
                  </span>
                </div>
                <span className="text-white/30 text-right text-xs">{file.size}</span>
                <span className="text-white/30 text-right text-xs">{file.modified}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div className="px-4 h-8 border-t border-white/[0.06] flex items-center text-white/25 text-xs shrink-0">
          {MOCK_FILES.length} items
        </div>
      </div>
    </div>
  );
}
