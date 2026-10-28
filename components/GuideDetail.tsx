"use client";

import React, { useState } from "react";
import { Guide, BlockerClass, EvidenceLabel } from "@/lib/schema";
import { CapabilityBadge, BlockerBadge } from "./CapabilityBadge";
import {
  X,
  ExternalLink,
  Clock,
  Users,
  DollarSign,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Bot,
  UserCheck,
  Zap,
  Copy,
  Check,
} from "lucide-react";

interface GuideDetailProps {
  guide: Guide;
  onClose: () => void;
  onToggleSelect: (guide: Guide) => void;
  isSelected: boolean;
}

export const GuideDetail: React.FC<GuideDetailProps> = ({
  guide,
  onClose,
  onToggleSelect,
  isSelected,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(guide, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "fill":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "leave":
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
      case "watch":
        return "bg-amber-500/15 text-amber-400 border-amber-500/40 animate-pulse";
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  };

  const getOwnerIcon = (owner: string) => {
    switch (owner) {
      case "AGENT":
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            <Bot className="h-3 w-3" /> AGENT
          </span>
        );
      case "YOU":
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            <UserCheck className="h-3 w-3" /> YOU (HUMAN)
          </span>
        );
      case "AGENT+YOU":
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Zap className="h-3 w-3" /> AGENT + YOU
          </span>
        );
      default:
        return null;
    }
  };

  const getEvidenceBadge = (label: EvidenceLabel) => {
    switch (label) {
      case "TESTED":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "SOURCED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "INFERRED":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "UNVERIFIED":
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200">
      <div className="bg-surface-card border border-surface-border rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-surface-border bg-surface flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-lg text-emerald-400">
              {guide.appName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{guide.appName}</h2>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {guide.category}
                </span>
                <span className="text-xs font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {guide.verdict.difficulty}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Auth Type: <span className="font-mono text-zinc-300 uppercase">{guide.authType}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="p-2 rounded-lg bg-surface border border-surface-border text-zinc-400 hover:text-white transition-colors"
              title="Copy Guide JSON"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onToggleSelect(guide)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                  : "bg-surface border border-surface-border text-zinc-300 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {isSelected ? "✓ In Launch Plan" : "+ Add to Plan"}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 divide-y divide-surface-border/60">
          {/* LEVEL 1: TOP SUMMARY & TWO CLOCKS */}
          <section className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                  ONE-LINE LAUNCH VERDICT
                </span>
                <p className="text-sm font-medium text-zinc-200 mt-1">
                  {guide.verdict.oneLineSummary || guide.capabilityCheck.detail}
                </p>
              </div>

              {guide.composio.managed && (
                <div className="shrink-0 bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-2 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Composio Managed Auth Ready</span>
                </div>
              )}
            </div>

            {/* The Two Clocks Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-surface border border-surface-border">
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>Clock 1: Works in Dev</span>
                </div>
                <div className="text-base font-mono font-bold text-white">
                  {guide.twoClocks.worksInDev}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Hands-on time: ~{guide.verdict.handsOnMinutes} min</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-surface-border">
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <Users className="h-4 w-4 text-amber-400" />
                  <span>Clock 2: Public Users Can Connect</span>
                </div>
                <div
                  className={`text-base font-mono font-bold ${
                    guide.verdict.approvalWaitDays > 0 ? "text-amber-400" : "text-emerald-400"
                  }`}
                >
                  {guide.twoClocks.anyUserCanConnect}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">Wait time: {guide.verdict.approvalWaitDays} days</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-surface-border">
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <DollarSign className="h-4 w-4 text-purple-400" />
                  <span>Estimated Cost / Audit</span>
                </div>
                <div className="text-sm font-mono font-semibold text-zinc-200">
                  {guide.cost}
                </div>
              </div>
            </div>
          </section>

          {/* LEVEL 2: FEASIBILITY FIRST - CAPABILITY CEILING CHECK */}
          <section className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-zinc-400 flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4 text-amber-400" />
                  Step 0: Capability Feasibility Check
                </h3>
                <p className="text-xs text-zinc-500">
                  Answer this before writing code. If the API cannot perform your action, OAuth setup is wasted effort.
                </p>
              </div>
              <CapabilityBadge verdict={guide.capabilityCheck.verdict} />
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                guide.capabilityCheck.verdict === "full"
                  ? "bg-surface border-surface-border"
                  : guide.capabilityCheck.verdict === "partial"
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-rose-500/10 border-rose-500/30"
              }`}
            >
              <h4 className="text-sm font-bold text-white mb-1">
                {guide.capabilityCheck.question}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {guide.capabilityCheck.detail}
              </p>
              {guide.capabilityCheck.warningCallout && (
                <div className="mt-3 p-3 rounded-xl bg-black/40 border border-amber-500/30 text-xs text-amber-300 font-mono">
                  ⚠️ {guide.capabilityCheck.warningCallout}
                </div>
              )}
            </div>

            {/* The 3 Classes of Blockers */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase text-zinc-400 font-semibold">
                Known Blockers & Tested Workarounds
              </h4>
              <div className="space-y-2">
                {guide.blockers.map((blocker, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface border border-surface-border text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <BlockerBadge blockerClass={blocker.class} />
                      <span className="text-[10px] font-mono uppercase text-zinc-500">
                        Severity: {blocker.severity}
                      </span>
                    </div>
                    <p className="text-zinc-200 font-medium">
                      <span className="text-rose-400 font-semibold">Issue:</span> {blocker.issue}
                    </p>
                    <p className="text-zinc-400">
                      <span className="text-emerald-400 font-semibold">Workaround:</span> {blocker.workaround}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scopes Table */}
            {guide.scopes && guide.scopes.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-mono uppercase text-zinc-400 font-semibold">
                  Permissions & Scopes Matrix
                </h4>
                <div className="overflow-x-auto rounded-xl border border-surface-border">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface text-zinc-400 font-mono text-[11px] border-b border-surface-border">
                      <tr>
                        <th className="p-2.5">Scope Name</th>
                        <th className="p-2.5">Tier</th>
                        <th className="p-2.5">Triggers Review?</th>
                        <th className="p-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border/50 text-zinc-300 font-mono">
                      {guide.scopes.map((s, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/30">
                          <td className="p-2.5 font-semibold text-emerald-400">{s.scope}</td>
                          <td className="p-2.5 text-[11px]">{s.tier || "standard"}</td>
                          <td className="p-2.5">
                            {s.triggersReview ? (
                              <span className="text-rose-400 font-bold">YES (Review Wall)</span>
                            ) : (
                              <span className="text-zinc-500">No</span>
                            )}
                          </td>
                          <td className="p-2.5 text-zinc-400 font-sans text-xs">{s.note || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* LEVEL 3: ZERO-AMBIGUITY FIELD NAVIGATOR (STEPS) */}
          <section className="pt-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-zinc-400">
                Level 3: Step-by-Step Field Execution Guide
              </h3>
              <p className="text-xs text-zinc-500">
                Exact inputs: <span className="text-emerald-400 font-semibold">FILL</span> what matters,{" "}
                <span className="text-zinc-400 font-semibold">LEAVE</span> defaults alone, and{" "}
                <span className="text-amber-400 font-semibold">WATCH</span> traps that break your launch.
              </p>
            </div>

            <div className="space-y-4">
              {guide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-surface border border-surface-border space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-zinc-300">
                        {step.stepNumber || idx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{step.text}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {getOwnerIcon(step.owner)}
                      {step.portalUrl && (
                        <a
                          href={step.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-emerald-400 px-2 py-1 rounded bg-zinc-800/80 border border-zinc-700"
                        >
                          <span>Open Console</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {step.note && (
                    <p className="text-xs text-zinc-400 pl-8 italic">{step.note}</p>
                  )}

                  {/* Micro-Field Directives */}
                  {step.fields && step.fields.length > 0 && (
                    <div className="pl-8 pt-2 space-y-2">
                      <div className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
                        Field Navigator Directives:
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {step.fields.map((f, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-2.5 rounded-xl bg-zinc-900/80 border border-surface-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getActionColor(
                                  f.action
                                )}`}
                              >
                                {f.action}
                              </span>
                              <span className="font-mono font-medium text-zinc-200">
                                {f.name}
                              </span>
                            </div>

                            <div className="text-[11px] text-zinc-400 sm:text-right font-sans">
                              {f.valueOrAdvice && (
                                <span className="font-mono text-zinc-300 mr-2">
                                  {f.valueOrAdvice}
                                </span>
                              )}
                              {f.note && <span className="text-zinc-500">{f.note}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 4: EVIDENCE & GROUNDING */}
          <section className="pt-6 space-y-3">
            <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-zinc-400">
              Evidence & Grounding (Judged by Composio)
            </h3>
            <p className="text-xs text-zinc-500">
              Every claim is tagged by provenance: hands-on tested vs officially sourced.
            </p>

            <div className="space-y-2">
              {guide.evidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-surface border border-surface-border text-xs flex items-start justify-between gap-3"
                >
                  <p className="text-zinc-300 leading-relaxed">{ev.claim}</p>
                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getEvidenceBadge(
                        ev.label
                      )}`}
                    >
                      {ev.label}
                    </span>
                    {ev.sourceUrl && (
                      <a
                        href={ev.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-zinc-300"
                        title="View Documentation Source"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* COMPOSIO ESCAPE HATCH */}
          <section className="pt-6">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-black border border-emerald-500/40 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <h4 className="text-base font-bold text-white">
                      Do It Yourself vs. Use Composio Managed Auth
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                    {guide.composio.recommendation}
                  </p>
                  {guide.composio.note && (
                    <p className="text-[11px] text-amber-300/80 font-mono mt-1">
                      ℹ️ {guide.composio.note}
                    </p>
                  )}
                </div>

                <a
                  href={guide.composio.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors shrink-0 shadow-lg shadow-emerald-500/20"
                >
                  <span>Connect with Composio</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
