import { z } from "zod";

export const BlockerClassSchema = z.enum(["setup", "approval", "capability"]);
export type BlockerClass = z.infer<typeof BlockerClassSchema>;

export const EvidenceLabelSchema = z.enum(["TESTED", "SOURCED", "INFERRED", "UNVERIFIED"]);
export type EvidenceLabel = z.infer<typeof EvidenceLabelSchema>;

export const DifficultyLevelSchema = z.enum(["trivial", "moderate", "hard", "gated"]);
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;

export const StepOwnerSchema = z.enum(["AGENT", "YOU", "AGENT+YOU"]);
export type StepOwner = z.infer<typeof StepOwnerSchema>;

export const FieldActionSchema = z.enum(["fill", "leave", "watch"]);
export type FieldAction = z.infer<typeof FieldActionSchema>;

export const CapabilityVerdictSchema = z.enum(["full", "partial", "blocked", "not_applicable"]);
export type CapabilityVerdict = z.infer<typeof CapabilityVerdictSchema>;

export const FieldInstructionSchema = z.object({
  name: z.string(),
  action: FieldActionSchema,
  valueOrAdvice: z.string().optional(),
  note: z.string().optional(),
});
export type FieldInstruction = z.infer<typeof FieldInstructionSchema>;

export const StepSchema = z.object({
  stepNumber: z.number().optional(),
  text: z.string(),
  owner: StepOwnerSchema,
  portalUrl: z.string().nullable().optional(),
  note: z.string().optional(),
  fields: z.array(FieldInstructionSchema).optional(),
});
export type Step = z.infer<typeof StepSchema>;

export const ScopeItemSchema = z.object({
  scope: z.string(),
  description: z.string().optional(),
  triggersReview: z.boolean(),
  tier: z.enum(["non-sensitive", "sensitive", "restricted", "admin"]).optional(),
  note: z.string().optional(),
});
export type ScopeItem = z.infer<typeof ScopeItemSchema>;

export const BlockerItemSchema = z.object({
  class: BlockerClassSchema,
  issue: z.string(),
  workaround: z.string(),
  severity: z.enum(["low", "medium", "high", "fatal"]).optional().default("medium"),
});
export type BlockerItem = z.infer<typeof BlockerItemSchema>;

export const EvidenceItemSchema = z.object({
  claim: z.string(),
  label: EvidenceLabelSchema,
  sourceUrl: z.string().nullable().optional(),
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const CapabilityCheckSchema = z.object({
  question: z.string(),
  verdict: CapabilityVerdictSchema,
  detail: z.string(),
  warningCallout: z.string().optional(),
});
export type CapabilityCheck = z.infer<typeof CapabilityCheckSchema>;

export const ComposioBlockSchema = z.object({
  managed: z.boolean(),
  recommendation: z.string(),
  savedDays: z.number().optional().default(0),
  link: z.string().default("https://docs.composio.dev/toolkits/managed-auth"),
  note: z.string().optional(),
});
export type ComposioBlock = z.infer<typeof ComposioBlockSchema>;

export const GuideSchema = z.object({
  id: z.string().optional(),
  appName: z.string(),
  category: z.string(),
  authType: z.enum(["oauth2", "oauth1", "api_key", "none"]).default("oauth2"),
  icon: z.string().optional().default("Globe"),
  verdict: z.object({
    difficulty: DifficultyLevelSchema,
    handsOnMinutes: z.number(),
    approvalWaitDays: z.number(),
    oneLineSummary: z.string().optional(),
  }),
  twoClocks: z.object({
    worksInDev: z.string(),
    anyUserCanConnect: z.string(),
  }),
  cost: z.string(),
  capabilityCheck: CapabilityCheckSchema,
  prerequisites: z.array(z.string()),
  steps: z.array(StepSchema),
  scopes: z.array(ScopeItemSchema).optional().default([]),
  blockers: z.array(BlockerItemSchema),
  composio: ComposioBlockSchema,
  evidence: z.array(EvidenceItemSchema),
});
export type Guide = z.infer<typeof GuideSchema>;

export interface PlanSummary {
  selectedGuides: Guide[];
  criticalPathDays: number;
  criticalPathAppName: string;
  totalHandsOnHours: number;
  totalCostEstimate: string;
  approvalGatedCount: number;
  orgLevelBlockers: { appName: string; blocker: string; class: BlockerClass }[];
  capabilityWarnings: { appName: string; verdict: CapabilityVerdict; detail: string }[];
  composioSavedDays: number;
  allAppsManagedByComposio: boolean;
}
