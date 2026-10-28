import { Guide, GuideSchema } from "./schema";

export interface ResearchTrailItem {
  id: string;
  timestamp: string;
  type: "search" | "fetch" | "analyze" | "validate" | "verdict";
  title: string;
  detail: string;
  url?: string;
  status: "pending" | "running" | "completed" | "warning";
}

export interface LiveInvestigationResult {
  guide: Guide;
  trail: ResearchTrailItem[];
  confidenceScore: number; // 0-100, derived from real sources found
}

// ---------------------------------------------------------------------------
// REAL live investigator.
// Calls an LLM with a hosted web-search tool, has it read the provider's OAuth
// docs, and returns a guide validated against our Zod schema. The research
// trail is built from the ACTUAL searches the model ran — not a scripted
// animation. Evidence is never labelled TESTED here: only a human who performs
// the setup can award TESTED. The model may use SOURCED / INFERRED / UNVERIFIED.
// ---------------------------------------------------------------------------

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o";
// Hosted web-search tool name. "web_search_preview" has the broadest
// availability; newer accounts can set OPENAI_WEBSEARCH_TOOL=web_search.
const WEBSEARCH_TOOL = process.env.OPENAI_WEBSEARCH_TOOL || "web_search_preview";

const SCHEMA_SPEC = `Return ONLY a JSON object (no markdown fences) with EXACTLY this shape:
{
  "appName": string,
  "category": string,
  "authType": "oauth2" | "oauth1" | "api_key" | "none",
  "verdict": { "difficulty": "trivial"|"moderate"|"hard"|"gated", "handsOnMinutes": number, "approvalWaitDays": number, "oneLineSummary": string },
  "twoClocks": { "worksInDev": string, "anyUserCanConnect": string },
  "cost": string,
  "capabilityCheck": { "question": string, "verdict": "full"|"partial"|"blocked"|"not_applicable", "detail": string },
  "prerequisites": string[],
  "steps": [ { "stepNumber": number, "text": string, "owner": "YOU"|"AGENT"|"AGENT+YOU", "portalUrl": string|null, "fields": [ { "name": string, "action": "fill"|"leave"|"watch", "valueOrAdvice"?: string, "note"?: string } ] } ],
  "scopes": [ { "scope": string, "triggersReview": boolean, "tier"?: "non-sensitive"|"sensitive"|"restricted"|"admin", "note"?: string } ],
  "blockers": [ { "class": "setup"|"approval"|"capability", "issue": string, "workaround": string, "severity": "low"|"medium"|"high"|"fatal" } ],
  "composio": { "managed": boolean, "recommendation": string, "savedDays": number, "link": "https://docs.composio.dev/toolkits/managed-auth", "note"?: string },
  "evidence": [ { "claim": string, "label": "SOURCED"|"INFERRED"|"UNVERIFIED", "sourceUrl": string|null } ]
}`;

const SYSTEM_PROMPT = `You are an OAuth setup investigator for developers building AI agents.
Given an app name or docs URL, use web search to read the provider's OFFICIAL developer
documentation and determine, for that provider's OAuth app:
- the registration steps (which console, which fields), and for each important field whether to FILL / LEAVE / WATCH;
- scopes and which ones trigger a review;
- the path to "any user can connect" (verification/review) and realistic timelines;
- the CAPABILITY CHECK first: can an agent actually do the needed read/write, or is the API read-only / capped / gated? If the app has no third-party OAuth (API keys only), set authType accordingly and say so plainly instead of inventing a flow;
- three classes of blocker: setup | approval | capability;
- whether Composio managed auth likely covers it.

EVIDENCE DISCIPLINE (critical): label each evidence item SOURCED only when a real doc page supports it (include the sourceUrl), INFERRED when you reasoned it from related facts, UNVERIFIED when uncertain. NEVER use the label TESTED — you did not perform the setup. Do not invent source URLs; if you don't have a real one, use null and label UNVERIFIED.

${SCHEMA_SPEC}`;

function nowISO() {
  return new Date().toISOString();
}

function push(
  trail: ResearchTrailItem[],
  item: Omit<ResearchTrailItem, "id" | "timestamp">,
  onProgress?: (i: ResearchTrailItem) => void
) {
  const full: ResearchTrailItem = { ...item, id: `t${trail.length + 1}`, timestamp: nowISO() };
  trail.push(full);
  onProgress?.(full);
  return full;
}

function stripFences(text: string): string {
  return text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
}

async function callOpenAI(input: any[], useWebSearch: boolean): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. The live investigator needs a real LLM key. Set it in .env.local (local) or the Vercel project settings (production)."
    );
  }
  const body: any = { model: MODEL, input };
  if (useWebSearch) body.tools = [{ type: WEBSEARCH_TOOL }];

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM request failed (${res.status}): ${errText.slice(0, 300)}`);
  }
  return res.json();
}

// Pull the assistant's text and the real web-search calls out of a Responses API payload.
function parseResponse(data: any): { text: string; searches: { query: string; url?: string }[] } {
  let text = "";
  const searches: { query: string; url?: string }[] = [];
  const output = Array.isArray(data?.output) ? data.output : [];
  for (const item of output) {
    if (item?.type === "web_search_call") {
      const q = item?.action?.query || item?.query || "web search";
      searches.push({ query: typeof q === "string" ? q : "web search" });
    }
    if (item?.type === "message" && Array.isArray(item.content)) {
      for (const c of item.content) {
        if (c?.type === "output_text" && typeof c.text === "string") text += c.text;
      }
    }
  }
  if (!text && typeof data?.output_text === "string") text = data.output_text;
  return { text, searches };
}

function confidenceFrom(guide: Guide): number {
  const ev = guide.evidence || [];
  if (ev.length === 0) return 40;
  const sourced = ev.filter((e) => e.label === "SOURCED" && e.sourceUrl).length;
  const unverified = ev.filter((e) => e.label === "UNVERIFIED").length;
  const base = 50 + sourced * 12 - unverified * 8;
  return Math.max(20, Math.min(95, base));
}

export async function investigateAppLive(
  appNameOrUrl: string,
  onProgress?: (item: ResearchTrailItem) => void
): Promise<LiveInvestigationResult> {
  const trail: ResearchTrailItem[] = [];
  const query = appNameOrUrl.trim();

  push(trail, { type: "search", title: `Investigating "${query}"`, detail: "Searching the provider's official OAuth/developer documentation…", status: "running" }, onProgress);

  // 1) Research + draft with real web search.
  let data: any;
  try {
    data = await callOpenAI(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Investigate OAuth app setup and approval for: ${query}. Research its official docs, then output the JSON guide.` },
      ],
      true
    );
  } catch (err: any) {
    push(trail, { type: "verdict", title: "Live research unavailable", detail: err.message, status: "warning" }, onProgress);
    throw err;
  }

  const { text, searches } = parseResponse(data);

  // Build a REAL trail from the searches the model actually ran.
  for (const s of searches) {
    push(trail, { type: "fetch", title: "Read documentation", detail: s.query, url: s.url, status: "completed" }, onProgress);
  }
  push(trail, { type: "analyze", title: "Drafting guide", detail: "Structuring findings into the guide schema…", status: "completed" }, onProgress);

  // 2) Validate against our Zod schema; one repair pass on failure.
  let guide: Guide | null = null;
  let parsed: any = null;
  try {
    parsed = JSON.parse(stripFences(text));
    guide = GuideSchema.parse(parsed);
  } catch (e: any) {
    push(trail, { type: "validate", title: "Schema repair", detail: "First draft failed validation — asking the model to correct it…", status: "warning" }, onProgress);
    const repair = await callOpenAI(
      [
        { role: "system", content: `Fix this JSON so it EXACTLY matches the schema. Return ONLY JSON.\n\n${SCHEMA_SPEC}` },
        { role: "user", content: `Validation error: ${String(e).slice(0, 300)}\n\nJSON to fix:\n${text.slice(0, 6000)}` },
      ],
      false
    );
    const repaired = parseResponse(repair);
    parsed = JSON.parse(stripFences(repaired.text));
    guide = GuideSchema.parse(parsed); // throws if still broken — surfaced to the user honestly
  }

  push(trail, { type: "validate", title: "Schema validated", detail: "Guide passed Zod validation.", status: "completed" }, onProgress);

  // 3) Safety net: strip any TESTED label the model may have produced.
  guide.evidence = (guide.evidence || []).map((e) =>
    e.label === "TESTED" ? { ...e, label: "UNVERIFIED" as const } : e
  );
  guide.id = guide.id || `gen-${query.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const confidenceScore = confidenceFrom(guide);
  push(trail, { type: "verdict", title: "Done", detail: `Guide generated · confidence ${confidenceScore}% · ${searches.length} live searches`, status: "completed" }, onProgress);

  return { guide, trail, confidenceScore };
}
