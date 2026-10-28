"use client";

import React from "react";
import { Compass, Calendar, Sparkles, BookOpen, ExternalLink, ShieldCheck } from "lucide-react";

interface NavbarProps {
  activeTab: "library" | "planner" | "live-agent";
  setActiveTab: (tab: "library" | "planner" | "live-agent") => void;
  selectedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, selectedCount }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">OAuth Launch Planner</span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-semibold">
                APM Integrations
              </span>
            </div>
            <p className="text-xs text-zinc-400">By Ayush Kabra · Composio Assessment</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-surface-card border border-surface-border p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "library"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Guide Library</span>
          </button>

          <button
            onClick={() => setActiveTab("planner")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
              activeTab === "planner"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Launch Planner</span>
            {selectedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-emerald-500 text-black rounded-full">
                {selectedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("live-agent")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "live-agent"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/40"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Live Agent Investigator</span>
          </button>
        </nav>

        {/* Composio Managed Auth external link */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://docs.composio.dev/toolkits/managed-auth"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-emerald-400 px-3 py-1.5 rounded-lg border border-surface-border hover:border-emerald-500/40 bg-surface transition-all"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Composio Managed Auth</span>
            <ExternalLink className="h-3 w-3 text-zinc-500" />
          </a>
        </div>
      </div>
    </header>
  );
};
