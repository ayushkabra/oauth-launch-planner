import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { CapabilityVerdict, BlockerClass } from "@/lib/schema";

interface CapabilityBadgeProps {
  verdict: CapabilityVerdict;
  className?: string;
  showText?: boolean;
}

export const CapabilityBadge: React.FC<CapabilityBadgeProps> = ({
  verdict,
  className = "",
  showText = true,
}) => {
  switch (verdict) {
    case "full":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {showText && "Full Capability"}
        </span>
      );
    case "partial":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 ${className}`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {showText && "Partial / Ceiling Warning"}
        </span>
      );
    case "blocked":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 ${className}`}
        >
          <XCircle className="h-3.5 w-3.5" />
          {showText && "Capability Blocked / Paywall"}
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-400 border border-zinc-700 ${className}`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          {showText && "N/A"}
        </span>
      );
  }
};

interface BlockerBadgeProps {
  blockerClass: BlockerClass;
}

export const BlockerBadge: React.FC<BlockerBadgeProps> = ({ blockerClass }) => {
  switch (blockerClass) {
    case "setup":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          Setup Friction
        </span>
      );
    case "approval":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
          Approval Wait
        </span>
      );
    case "capability":
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
          Capability Ceiling
        </span>
      );
  }
};
