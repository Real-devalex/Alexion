"use client";

import dynamic from "next/dynamic";

const FileExplorer = dynamic(() => import("./FileExplorer"), { ssr: false });
const Settings     = dynamic(() => import("./Settings"),     { ssr: false });
const Terminal     = dynamic(() => import("./Terminal"),     { ssr: false });
const BrowserApp   = dynamic(() => import("./BrowserApp"),   { ssr: false });

export default function AppRenderer({ appId }: { appId: string }) {
  switch (appId) {
    case "file-explorer": return <FileExplorer />;
    case "settings":      return <Settings />;
    case "terminal":      return <Terminal />;
    case "browser":       return <BrowserApp />;
    case "mail":
      return (
        <div className="flex items-center justify-center h-full text-white/30 text-sm">
          Mail — coming soon
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-full text-white/30 text-sm">
          App not found: {appId}
        </div>
      );
  }
}
