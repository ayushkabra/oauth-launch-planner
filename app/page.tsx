"use client";

import React, { useState } from "react";
import { Guide } from "@/lib/schema";
import { getAllGuides, searchGuides } from "@/lib/guides";
import { Navbar } from "@/components/Navbar";
import { GuideCard } from "@/components/GuideCard";
import { GuideDetail } from "@/components/GuideDetail";
import { LaunchPlanner } from "@/components/LaunchPlanner";
import { LiveAgentInvestigator } from "@/components/LiveAgentInvestigator";
import {
  Search,
  Filter,
  Layers,
  Sparkles,
  Calendar,
  ShieldCheck,
  Check,
  ArrowRight,
  Flame,
} from "lucide-react";

export default function Home() {
  const [guides, setGuides] = useState<Guide[]>(getAllGuides());
  const [selectedGuides, setSelectedGuides] = useState<Guide[]>([
    // Pre-populate with GitHub, Google, and Slack as an illustrative realistic stack
    guides.find((g) => g.id === "github-oauth") || guides[0],
    guides.find((g) => g.id === "google-gmail") || guides[1],
    guides.find((g) => g.id === "slack") || guides[4],
  ]);

  const [activeTab, setActiveTab] = useState<"library" | "planner" | "live-agent">("library");
  const [activeGuideDetail, setActiveGuideDetail] = useState<Guide | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const categories = [
    "all",
    "Developer Tools",
    "Email & Productivity",
    "Communication",
    "CRM & Sales",
    "Enterprise & Productivity",
  ];

  const filteredGuides = guides.filter((g) => {
    const matchesQuery =
      !searchQuery ||
      g.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.verdict.oneLineSummary?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      g.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "all" || g.verdict.difficulty === selectedDifficulty;

    return matchesQuery && matchesCategory && matchesDifficulty;
  });

  const handleToggleSelect = (guide: Guide) => {
    if (selectedGuides.some((g) => g.id === guide.id)) {
      setSelectedGuides(selectedGuides.filter((g) => g.id !== guide.id));
    } else {
      setSelectedGuides([...selectedGuides, guide]);
    }
  };

  const handleRemoveGuide = (guideId: string) => {
    setSelectedGuides(selectedGuides.filter((g) => g.id !== guideId));
  };

  const handleClearAll = () => {
    setSelectedGuides([]);
  };

  const handleGuideGenerated = (newGuide: Guide) => {
    if (!guides.some((g) => g.id === newGuide.id)) {
      setGuides((prev) => [newGuide, ...prev]);
    }
  };

  const maxWaitDays =
    selectedGuides.length > 0
      ? Math.max(...selectedGuides.map((g) => g.verdict.approvalWaitDays))
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-zinc-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCount={selectedGuides.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HERO HEADER */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Launch Timeline Planner · Zero Guesswork Field Guidance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Plan your agent's path to{" "}
            <span className="composio-gradient-text">"Any User Can Connect"</span>
          </h1>

          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Building AI agents that connect to third-party tools shouldn't take weeks of trial and error.
            Discover the critical path to public launch, flag fatal API capability ceilings before writing code, and see exactly when to bypass setup pain with <strong>Composio Managed Auth</strong>.
          </p>
        </div>

        {/* TAB 1: GUIDE LIBRARY */}
        {activeTab === "library" && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-card border border-surface-border">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 14+ guides by app name, scope, or blocker..."
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-border rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              {/* Category & Difficulty pills */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-surface border border-surface-border text-xs rounded-xl px-3 py-2 text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Difficulties</option>
                  <option value="trivial">Trivial (Same day)</option>
                  <option value="moderate">Moderate (&lt;2 wks)</option>
                  <option value="hard">Hard (Capability ceilings)</option>
                  <option value="gated">Gated (CASA / Reviews)</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-surface border border-surface-border text-xs rounded-xl px-3 py-2 text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGuides.map((guide) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  isSelected={selectedGuides.some((g) => g.id === guide.id)}
                  onToggleSelect={handleToggleSelect}
                  onOpenDetail={setActiveGuideDetail}
                />
              ))}
            </div>

            {filteredGuides.length === 0 && (
              <div className="py-16 text-center text-zinc-500 text-xs">
                No guides found matching your query. Switch to the{" "}
                <button
                  onClick={() => setActiveTab("live-agent")}
                  className="text-emerald-400 underline font-semibold"
                >
                  Live Agent Investigator
                </button>{" "}
                to generate a guide for this app live!
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LAUNCH PLANNER */}
        {activeTab === "planner" && (
          <LaunchPlanner
            selectedGuides={selectedGuides}
            onRemoveGuide={handleRemoveGuide}
            onClearAll={handleClearAll}
            onOpenGuide={setActiveGuideDetail}
          />
        )}

        {/* TAB 3: LIVE AGENT INVESTIGATOR */}
        {activeTab === "live-agent" && (
          <LiveAgentInvestigator
            onGuideGenerated={handleGuideGenerated}
            onOpenGuide={setActiveGuideDetail}
            onAddToPlan={(g) => {
              if (!selectedGuides.some((item) => item.id === g.id)) {
                setSelectedGuides([...selectedGuides, g]);
              }
              setActiveTab("planner");
            }}
          />
        )}
      </main>

      {/* Floating Launch Cart Quick Indicator */}
      {selectedGuides.length > 0 && activeTab === "library" && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={() => setActiveTab("planner")}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-900 border border-emerald-500/50 text-white shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all group"
          >
            <div className="h-8 w-8 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">
              {selectedGuides.length}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>View Launch Plan</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                Critical Path:{" "}
                <span className={maxWaitDays > 0 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                  {maxWaitDays} days wait
                </span>
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Modal: Full Progressive Disclosure Guide Detail */}
      {activeGuideDetail && (
        <GuideDetail
          guide={activeGuideDetail}
          onClose={() => setActiveGuideDetail(null)}
          onToggleSelect={handleToggleSelect}
          isSelected={selectedGuides.some((g) => g.id === activeGuideDetail.id)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-border bg-surface/50 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 OAuth Launch Planner · Built for Composio APM Assessment by Ayush Kabra</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <a
              href="https://docs.composio.dev/toolkits/managed-auth"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              Composio Managed Auth Docs
            </a>
            <span>·</span>
            <span>Zero-DB Static & Live Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
