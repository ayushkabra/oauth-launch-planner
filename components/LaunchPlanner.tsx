"use client";

import React, { useState } from "react";
import { Guide } from "@/lib/schema";
import { generateLaunchPlan } from "@/lib/planner";
import {
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Download,
  Layers,
  ArrowRight,
  Flame,
} from "lucide-react";

interface LaunchPlannerProps {
  selectedGuides: Guide[];
  onRemoveGuide: (guideId: string) => void;
  onClearAll: () => void;
  onOpenGuide: (guide: Guide) => void;
}

export const LaunchPlanner: React.FC<LaunchPlannerProps> = ({
  selectedGuides,
  onRemoveGuide,
  onClearAll,
  onOpenGuide,
}) => {
  const [activeView, setActiveView] = useState<"cto" | "dev">("cto");
  const plan = generateLaunchPlan(selectedGuides);

  if (selectedGuides.length === 0) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto">
        <div className="h-16 w-16 rounded-3xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto mb-4 text-zinc-500">
          <Calendar className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Apps Selected for Launch Plan</h3>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Select apps from the Guide Library to calculate your agent’s critical path to "any user can connect", aggregate organizational approval gates, and see how much time Composio Managed Auth saves.
        </p>
      </div>
    );
  }

  const exportPlanAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `oauth-launch-plan-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Critical Path Callout */}
      {plan.criticalPathDays > 0 ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-surface-card to-zinc-900 border border-amber-500/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Critical Path Bottleneck
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Start <span className="text-amber-400">{plan.criticalPathAppName}</span> Today
              </h3>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                Your launch is gated by <strong>{plan.criticalPathAppName}</strong> ({plan.criticalPathDays} days approval queue). Even if your engineering takes 1 day, public users cannot connect until this review finishes.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <a
                href="https://docs.composio.dev/toolkits/managed-auth"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Bypass with Composio (0 Days)</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-surface-card to-zinc-900 border border-emerald-500/40">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Zero-Wait Launch Path!</h3>
              <p className="text-xs text-zinc-400">
                None of your selected apps have mandatory provider approval gates. You can launch to public users immediately upon completing setup.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>Calendar Delay</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {plan.criticalPathDays} <span className="text-xs font-sans text-zinc-400">days</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Gated by {plan.criticalPathAppName}</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>Hands-on Engineering</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            ~{plan.totalHandsOnHours} <span className="text-xs font-sans text-zinc-400">hours</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Across {selectedGuides.length} integrations</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <DollarSign className="h-4 w-4 text-purple-400" />
            <span>Estimated Audits & Costs</span>
          </div>
          <div className="text-base font-mono font-bold text-zinc-200 truncate">
            {plan.totalCostEstimate}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Third-party compliance assessments</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Composio Savings</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {plan.composioSavedDays} <span className="text-xs font-sans text-emerald-500">days saved</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Zero-wait managed auth deployment</p>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("cto")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeView === "cto"
                ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            CTO & Executive View (Critical Path & Risk)
          </button>
          <button
            onClick={() => setActiveView("dev")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeView === "dev"
                ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Dev & Engineering View (Step Execution List)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportPlanAsJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-card border border-surface-border text-zinc-300 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Plan JSON</span>
          </button>

          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Plan</span>
          </button>
        </div>
      </div>

      {/* CTO VIEW */}
      {activeView === "cto" && (
        <div className="space-y-8">
          {/* Critical Path Sequencing Gantt / Timeline */}
          <div className="p-6 rounded-3xl bg-surface-card border border-surface-border space-y-4">
            <h4 className="text-sm font-bold font-mono uppercase text-zinc-300 flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              Critical Path Timeline (Sequenced by Approval Wait)
            </h4>
            <p className="text-xs text-zinc-400">
              Apps are sequenced by calendar delay. The longest approval wait determines your actual go-to-market date.
            </p>

            <div className="space-y-3 pt-2">
              {plan.selectedGuides.map((guide, idx) => {
                const maxDays = Math.max(...plan.selectedGuides.map((g) => g.verdict.approvalWaitDays), 1);
                const percent = Math.max((guide.verdict.approvalWaitDays / maxDays) * 100, 4);

                return (
                  <div
                    key={guide.id || idx}
                    className="p-3.5 rounded-2xl bg-surface border border-surface-border space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{guide.appName}</span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          ({guide.category})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-400">
                          Dev: ~{guide.verdict.handsOnMinutes}m
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            guide.verdict.approvalWaitDays > 0 ? "text-amber-400" : "text-emerald-400"
                          }`}
                        >
                          Wait: {guide.verdict.approvalWaitDays} days
                        </span>
                        <button
                          onClick={() => onOpenGuide(guide)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onRemoveGuide(guide.id || "")}
                          className="text-zinc-600 hover:text-rose-400"
                          title="Remove from plan"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Timeline bar */}
                    <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          guide.verdict.approvalWaitDays > 40
                            ? "bg-rose-500"
                            : guide.verdict.approvalWaitDays > 0
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Org-Level & Legal Blockers Checklist */}
          {plan.orgLevelBlockers.length > 0 && (
            <div className="p-6 rounded-3xl bg-surface-card border border-surface-border space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-purple-400" />
                <h4 className="text-sm font-bold font-mono uppercase text-zinc-300">
                  Non-Engineering & Governance Blockers ({plan.orgLevelBlockers.length})
                </h4>
              </div>
              <p className="text-xs text-zinc-400">
                These require legal, security, or enterprise IT action before public launch. Engineers cannot unblock these with code alone.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {plan.orgLevelBlockers.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface border border-surface-border text-xs space-y-1"
                  >
                    <span className="font-mono text-[10px] uppercase text-purple-400 font-bold">
                      {b.appName} · {b.class.toUpperCase()}
                    </span>
                    <p className="text-zinc-300">{b.blocker}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capability Ceiling Warnings */}
          {plan.capabilityWarnings.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h4 className="text-sm font-bold font-mono uppercase text-amber-300">
                  Critical Capability Warnings ({plan.capabilityWarnings.length})
                </h4>
              </div>
              <p className="text-xs text-zinc-300">
                These apps impose functional API limitations (e.g., write ceilings or paywalls) that managed auth cannot resolve. Validate architecture before building.
              </p>

              <div className="space-y-2 pt-2">
                {plan.capabilityWarnings.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs space-y-1"
                  >
                    <span className="font-mono text-[11px] font-bold text-amber-400">
                      {w.appName} ({w.verdict.toUpperCase()})
                    </span>
                    <p className="text-zinc-300">{w.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEV VIEW */}
      {activeView === "dev" && (
        <div className="space-y-6">
          <p className="text-xs text-zinc-400">
            Sequential task list across all {selectedGuides.length} integrations. Filtered for engineering execution.
          </p>

          <div className="space-y-4">
            {plan.selectedGuides.map((guide) => (
              <div
                key={guide.id}
                className="p-5 rounded-3xl bg-surface-card border border-surface-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{guide.appName}</span>
                    <span className="text-xs font-mono text-zinc-500">
                      (~{guide.verdict.handsOnMinutes}m)
                    </span>
                  </h4>
                  <button
                    onClick={() => onOpenGuide(guide)}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Step Inputs</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {guide.steps.map((s, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-xl bg-surface border border-surface-border text-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-zinc-800 text-[10px] font-mono font-bold flex items-center justify-center text-zinc-400">
                          {sIdx + 1}
                        </span>
                        <span className="text-zinc-300">{s.text}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0 uppercase">
                        {s.owner}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
