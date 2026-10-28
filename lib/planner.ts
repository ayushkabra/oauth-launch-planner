import { Guide, PlanSummary, BlockerItem } from "./schema";

export function generateLaunchPlan(selectedGuides: Guide[]): PlanSummary {
  if (selectedGuides.length === 0) {
    return {
      selectedGuides: [],
      criticalPathDays: 0,
      criticalPathAppName: "None",
      totalHandsOnHours: 0,
      totalCostEstimate: "$0",
      approvalGatedCount: 0,
      orgLevelBlockers: [],
      capabilityWarnings: [],
      composioSavedDays: 0,
      allAppsManagedByComposio: true,
    };
  }

  // Sort by approvalWaitDays descending to identify the critical path bottleneck
  const sorted = [...selectedGuides].sort(
    (a, b) => b.verdict.approvalWaitDays - a.verdict.approvalWaitDays
  );

  const criticalPathGuide = sorted[0];
  const criticalPathDays = criticalPathGuide.verdict.approvalWaitDays;
  const criticalPathAppName = criticalPathGuide.appName;

  // Sum hands-on engineering time in minutes
  const totalHandsOnMinutes = selectedGuides.reduce(
    (acc, g) => acc + g.verdict.handsOnMinutes,
    0
  );
  const totalHandsOnHours = Math.round((totalHandsOnMinutes / 60) * 10) / 10;

  // Calculate estimated compliance and platform costs
  let costEstimateText = "$0";
  const hasGmail = selectedGuides.some((g) => g.id === "google-gmail");
  const hasTwitter = selectedGuides.some((g) => g.id === "twitter-x");

  if (hasGmail && hasTwitter) {
    costEstimateText = "$3,100 – $10,100+ (CASA Assessment + X API)";
  } else if (hasGmail) {
    costEstimateText = "$3,000 – $10,000 (CASA Tier 2 Security Audit)";
  } else if (hasTwitter) {
    costEstimateText = "$100/mo – $5,000/mo (X API Subscription)";
  }

  // Count approval-gated apps
  const approvalGatedCount = selectedGuides.filter(
    (g) => g.verdict.difficulty === "gated" || g.verdict.approvalWaitDays > 0
  ).length;

  // Aggregate organizational, legal, and IT blockers
  const orgLevelBlockers: { appName: string; blocker: string; class: BlockerItem["class"] }[] = [];
  selectedGuides.forEach((g) => {
    g.blockers.forEach((b) => {
      if (b.class === "approval" || b.severity === "fatal" || b.severity === "high") {
        orgLevelBlockers.push({
          appName: g.appName,
          blocker: b.issue,
          class: b.class,
        });
      }
    });
  });

  // Aggregate capability warnings (partial or blocked)
  const capabilityWarnings = selectedGuides
    .filter((g) => g.capabilityCheck.verdict === "partial" || g.capabilityCheck.verdict === "blocked")
    .map((g) => ({
      appName: g.appName,
      verdict: g.capabilityCheck.verdict,
      detail: g.capabilityCheck.detail,
    }));

  // Calculate total days saved by using Composio Managed Auth
  const composioSavedDays = criticalPathDays;
  const allAppsManagedByComposio = selectedGuides.every((g) => g.composio.managed);

  return {
    selectedGuides: sorted,
    criticalPathDays,
    criticalPathAppName,
    totalHandsOnHours,
    totalCostEstimate: costEstimateText,
    approvalGatedCount,
    orgLevelBlockers,
    capabilityWarnings,
    composioSavedDays,
    allAppsManagedByComposio,
  };
}
