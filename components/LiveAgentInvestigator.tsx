"use client";

import React, { useState } from "react";
import { Guide } from "@/lib/schema";
import {
  investigateAppLive,
  ResearchTrailItem,
  LiveInvestigationResult,
} from "@/lib/agent-investigator";
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Terminal,
} from "lucide-react";
import { CapabilityBadge } from "./CapabilityBadge";

interface LiveAgentInvestigatorProps {
  onGuideGenerated: (guide: Guide) => void;
  onOpenGuide: (guide: Guide) => void;
  onAddToPlan: (guide: Guide) => void;
}

export const LiveAgentInvestigator: React.FC<LiveAgentInvestigatorProps> = ({
  onGuideGenerated,
  onOpenGuide,
  onAddToPlan,
}) => {
  const [inputQuery, setInputQuery] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [trail, setTrail] = useState<ResearchTrailItem[]>([]);
  const [result, setResult] = useState<LiveInvestigationResult | null>(null);

  const SUGGESTED_APPS = ["Salesforce", "Stripe", "Figma", "Zendesk", "Asana"];

  const handleStartInvestigation = async (appName?: string) => {
    const target = appName || inputQuery;
    if (!target.trim() || isRunning) return;

    setIsRunning(true);
    setTrail([]);
    setResult(null);

    try {
      const res = await investigateAppLive(target, (step) => {
        setTrail((prev) => [...prev, step]);
      });

      setResult(res);
      onGuideGenerated(res.guide);
    } catch (err) {
      console.error("Investigation failed:", err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-surface-card to-zinc-900 border border-emerald-500/30">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Autonomous Research Pipeline</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Investigate Any Provider App in Real-Time
          </h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Submit any software name or developer documentation URL. Our research agent queries official developer portals, extracts scope tiers, tests for capability write ceilings, validates the schema with Zod, and outputs a complete, shareable field guide with a live research trail.
          </p>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[11px] font-mono text-zinc-500">Try testing:</span>
            {SUGGESTED_APPS.map((app) => (
              <button
                key={app}
                onClick={() => {
                  setInputQuery(app);
                  handleStartInvestigation(app);
                }}
                disabled={isRunning}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-800/80 text-zinc-300 hover:text-emerald-400 hover:bg-zinc-800 border border-zinc-700 transition-colors"
              >
                {app}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStartInvestigation()}
              placeholder="e.g. Salesforce, Stripe, or https://developer.figma.com"
              disabled={isRunning}
              className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-surface-border rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
            />
          </div>

          <button
            onClick={() => handleStartInvestigation()}
            disabled={isRunning || !inputQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-emerald-500/20"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Investigating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Run Agent Investigation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Research Trail Panel */}
      {trail.length > 0 && (
        <div className="p-6 rounded-3xl bg-surface-card border border-surface-border space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold font-mono uppercase text-zinc-300">
                Live Research Trail ({trail.length} steps executed)
              </h3>
            </div>
            {isRunning && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Crawling provider documentation...
              </span>
            )}
          </div>

          <div className="space-y-3 font-mono text-xs">
            {trail.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-surface border border-surface-border flex items-start gap-3 animate-in fade-in duration-300"
              >
                <span className="text-[10px] text-zinc-500 pt-0.5 shrink-0">{item.timestamp}</span>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                        item.type === "search"
                          ? "bg-blue-500/20 text-blue-400"
                          : item.type === "fetch"
                          ? "bg-purple-500/20 text-purple-400"
                          : item.type === "validate"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="font-semibold text-zinc-200">{item.title}</span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    {item.detail}
                  </p>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:underline"
                    >
                      <span>Verified source: {item.url}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>

                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Guide Result Card */}
      {result && (
        <div className="p-6 md:p-8 rounded-3xl bg-surface-card border border-emerald-500/40 space-y-6 shadow-xl shadow-emerald-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Live Generated & Zod Validated
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Confidence Score: {result.confidenceScore}%
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{result.guide.appName}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {result.guide.verdict.oneLineSummary}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenGuide(result.guide)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-surface border border-surface-border text-zinc-200 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
              >
                <span>View Full Step Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onAddToPlan(result.guide)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add to Launch Plan</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-surface border border-surface-border text-xs">
              <span className="text-zinc-500 font-medium">Difficulty Level</span>
              <p className="font-mono font-bold text-white uppercase mt-0.5">
                {result.guide.verdict.difficulty}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-surface-border text-xs">
              <span className="text-zinc-500 font-medium">Capability Check</span>
              <div className="mt-1">
                <CapabilityBadge verdict={result.guide.capabilityCheck.verdict} />
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-surface-border text-xs">
              <span className="text-zinc-500 font-medium">Public Connection Wait</span>
              <p className="font-mono font-bold text-amber-400 mt-0.5">
                {result.guide.twoClocks.anyUserCanConnect}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
