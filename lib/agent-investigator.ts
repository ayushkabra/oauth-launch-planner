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
  confidenceScore: number;
}

// ---------------------------------------------------------------------------
// Live investigator — Groq (OpenAI-compatible), with Gemini as an optional path.
//
// WHY GROQ: Gemini's free tier quota (429) kept blocking the demo. Groq's free
// tier is far more generous and reliable for an interview demo. This uses an
// LLM to generate a schema-validated guide — a real agentic generation.
//
// MODEL SELECTION IS SELF-HEALING: it never hardcodes a model name (that caused
// the earlier 404 loop). It lists the provider's models and picks a strong chat
// model, so a deprecated name can't get stuck. Pin GROQ_MODEL to override.
//
// NOTE ON GROUNDING: Groq chat models answer from their training knowledge, not
// a live web crawl. So evidence here is SOURCED (model knows the doc) / INFERRED
// / UNVERIFIED — never TESTED. If you want live web grounding, use the Gemini
// path with billing enabled (set GEMINI_API_KEY and remove GROQ_API_KEY).
// ---------------------------------------------------------------------------

const GROQ_BASE = "https://api.groq.com/openai/v1";
const REQUEST_TIMEOUT_MS = 20000;

const SCHEMA_SPEC = `Return ONLY a JSON object (no markdown, no prose) with EXACTLY this shape:
{
  "appName": string, "category": string,
  "authType": "oauth2"|"oauth1"|"api_key"|"none",
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

const INSTRUCTIONS = `You are an OAuth setup investigator for developers building AI agents.
For the given app, determine its OAuth app registration path (which console, which fields, mark each FILL/LEAVE/WATCH), scopes and which trigger review, the realistic path and timeline to "any user can connect", and — FIRST — the capability check: can an agent actually do the needed read/write, or is the API read-only / capped / gated? If the app has no third-party OAuth (API keys only), set authType accordingly and say so plainly. Classify blockers as setup | approval | capability. State whether Composio managed auth likely covers it.
EVIDENCE: label SOURCED only when you are confident a real provider doc supports it (give the doc URL if you know it), INFERRED when reasoned, UNVERIFIED when uncertain. NEVER use TESTED. Do not invent source URLs — use null + UNVERIFIED if unsure.
${SCHEMA_SPEC}`;

function nowISO() { return new Date().toISOString(); }

function push(trail: ResearchTrailItem[], item: Omit<ResearchTrailItem, "id" | "timestamp">, onProgress?: (i: ResearchTrailItem) => void) {
  const full: ResearchTrailItem = { ...item, id: `t${trail.length + 1}`, timestamp: nowISO() };
  trail.push(full);
  onProgress?.(full);
  return full;
}

function stripFences(t: string): string {
  return t.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Ask Groq which models exist and pick a strong chat model — no hardcoded names.
let cachedModel: string | null = null;
async function resolveGroqModel(key: string): Promise<string> {
  if (process.env.GROQ_MODEL) return process.env.GROQ_MODEL;
  if (cachedModel) return cachedModel;
  const res = await fetchWithTimeout(`${GROQ_BASE}/models`, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Groq ListModels failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const ids: string[] = (data.data || []).map((m: any) => m.id).filter(Boolean)
    .filter((id: string) => !/whisper|guard|tts|vision|embed/i.test(id));
  // Prefer current Groq chat models. gpt-oss is the current free-tier family
  // (Llama 3.x was retired); fall back through llama/qwen/mixtral to anything usable.
  const pick =
    ids.find((id) => /gpt-oss/i.test(id)) ||
    ids.find((id) => /llama.*(70b|versatile|instruct)/i.test(id)) ||
    ids.find((id) => /llama|qwen|mixtral|gemma/i.test(id)) ||
    ids[0];
  if (!pick) throw new Error("No usable Groq chat model found for this key.");
  cachedModel = pick;
  return pick;
}

async function groqChat(key: string, model: string, prompt: string): Promise<string> {
  const res = await fetchWithTimeout(`${GROQ_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You output only valid JSON matching the user's schema. No prose." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    const err: any = new Error(`Groq ${model} failed (${res.status}): ${txt.slice(0, 220)}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

function confidenceFrom(guide: Guide): number {
  const ev = guide.evidence || [];
  if (!ev.length) return 40;
  const sourced = ev.filter((e) => e.label === "SOURCED" && e.sourceUrl).length;
  const unverified = ev.filter((e) => e.label === "UNVERIFIED").length;
  return Math.max(20, Math.min(95, 50 + sourced * 12 - unverified * 8));
}

export async function investigateAppLive(
  appNameOrUrl: string,
  onProgress?: (item: ResearchTrailItem) => void
): Promise<LiveInvestigationResult> {
  const trail: ResearchTrailItem[] = [];
  const query = appNameOrUrl.trim();
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    const msg = "GROQ_API_KEY is not set. Add it to .env.local (local) or Vercel env vars (prod). Get a free key at console.groq.com.";
    push(trail, { type: "verdict", title: "Live research unavailable", detail: msg, status: "warning" }, onProgress);
    throw new Error(msg);
  }

  push(trail, { type: "search", title: `Investigating "${query}"`, detail: "Analyzing provider OAuth setup, scopes, and capability ceiling…", status: "running" }, onProgress);

  let model: string;
  try {
    model = await resolveGroqModel(key);
    push(trail, { type: "analyze", title: "Model ready", detail: `Using ${model} (Groq)`, status: "completed" }, onProgress);
  } catch (e: any) {
    push(trail, { type: "verdict", title: "Live research unavailable", detail: e.message, status: "warning" }, onProgress);
    throw e;
  }

  const prompt = `${INSTRUCTIONS}\n\nApp to investigate: ${query}`;

  let text: string;
  try {
    text = await groqChat(key, model, prompt);
    push(trail, { type: "analyze", title: "Drafting guide", detail: "Structuring findings into the schema…", status: "completed" }, onProgress);
  } catch (e: any) {
    push(trail, { type: "verdict", title: "Live research unavailable", detail: e.message, status: "warning" }, onProgress);
    throw e;
  }

  let guide: Guide;
  try {
    guide = GuideSchema.parse(JSON.parse(stripFences(text)));
  } catch (err: any) {
    push(trail, { type: "validate", title: "Schema repair", detail: "First draft failed validation — asking the model to correct it…", status: "warning" }, onProgress);
    const repaired = await groqChat(key, model, `Fix this JSON to EXACTLY match the schema. Return ONLY JSON.\n${SCHEMA_SPEC}\n\nError: ${String(err).slice(0, 200)}\n\nJSON:\n${text.slice(0, 6000)}`);
    guide = GuideSchema.parse(JSON.parse(stripFences(repaired)));
  }

  push(trail, { type: "validate", title: "Schema validated", detail: "Guide passed Zod validation.", status: "completed" }, onProgress);

  // Safety net: the model may not award itself TESTED.
  guide.evidence = (guide.evidence || []).map((e) => (e.label === "TESTED" ? { ...e, label: "UNVERIFIED" as const } : e));
  guide.id = guide.id || `gen-${query.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const confidenceScore = confidenceFrom(guide);
  push(trail, { type: "verdict", title: "Done", detail: `Guide generated · confidence ${confidenceScore}%`, status: "completed" }, onProgress);
  return { guide, trail, confidenceScore };
}
