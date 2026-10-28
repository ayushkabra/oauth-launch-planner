"use client";

import React from "react";
import { Guide } from "@/lib/schema";
import { CapabilityBadge } from "./CapabilityBadge";
import { Clock, Users, ShieldAlert, ArrowRight, Check, Plus } from "lucide-react";

interface GuideCardProps {
  guide: Guide;
  isSelected: boolean;
  onToggleSelect: (guide: Guide) => void;
  onOpenDetail: (guide: Guide) => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  isSelected,
  onToggleSelect,
  onOpenDetail,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "trivial":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "moderate":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "hard":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "gated":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        isSelected
          ? "border-emerald-500/60 bg-surface shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50"
          : "border-surface-border bg-surface-card/60 hover:bg-surface-card hover:border-zinc-700"
      }`}
    >
      {/* Top Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-zinc-500 tracking-wide uppercase">
                {guide.category}
              </span>
              {guide.composio.managed && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Composio Managed
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              {guide.appName}
            </h3>
          </div>

          {/* Difficulty pill */}
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border ${getDifficultyColor(
              guide.verdict.difficulty
            )}`}
          >
            {guide.verdict.difficulty}
          </span>
        </div>

        {/* One line verdict */}
        <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
          {guide.verdict.oneLineSummary || guide.capabilityCheck.detail}
        </p>

        {/* Capability Check indicator */}
        <div className="mb-4 pt-3 border-t border-surface-border/60">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-zinc-500 font-medium">Capability Check</span>
            <CapabilityBadge verdict={guide.capabilityCheck.verdict} />
          </div>
          <p className="text-[11px] text-zinc-400 italic line-clamp-1">
            "{guide.capabilityCheck.question}"
          </p>
        </div>

        {/* The Two Clocks */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-surface border border-surface-border text-xs">
          <div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium mb-0.5">
              <Clock className="h-3 w-3 text-zinc-400" />
              <span>Dev Clock</span>
            </div>
            <span className="text-xs font-mono font-semibold text-zinc-200">
              {guide.twoClocks.worksInDev}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium mb-0.5">
              <Users className="h-3 w-3 text-zinc-400" />
              <span>Public Users</span>
            </div>
            <span
              className={`text-xs font-mono font-semibold ${
                guide.verdict.approvalWaitDays > 0 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {guide.twoClocks.anyUserCanConnect}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-surface/50 border-t border-surface-border flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetail(guide)}
          className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
        >
          <span>View Field Guide</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => onToggleSelect(guide)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            isSelected
              ? "bg-emerald-500 text-black font-semibold shadow-sm"
              : "bg-surface-border text-zinc-300 hover:text-white hover:bg-zinc-700"
          }`}
        >
          {isSelected ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>In Plan</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Plan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
