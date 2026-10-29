# OAuth Launch Planner & Feasibility Engine
### APM Integrations Take-Home Assessment — Composio
**Candidate:** Ayush Kabra
**Source Repository:** https://github.com/ayushkabra/oauth-launch-planner
**Live App (Vercel):** https://oauth-launch-planner-rosy.vercel.app/ — runs the full app including the live agent
**Static demo (GitHub Pages):** https://ayushkabra.github.io/oauth-launch-planner/ — library/planner only; the live agent needs the Vercel deployment

---

## 1. Executive Summary & Product Thesis

**Our Product in One Line:**
*"A launch-timeline planner and capability feasibility engine for AI agent builders. Tell it what tools your agent needs to connect; it sequences your critical path to 'any user can connect', warns you of fatal capability ceilings before you write code, gives junior engineers a zero-ambiguity field guide (FILL / LEAVE / WATCH), and shows the CTO when to skip months of delay by adopting Composio Managed Auth."*

Most OAuth guides are written as static, isolated documentation directories ("How to register an app on Provider X"). For AI agent developers, that model is broken:

- An autonomous agent doesn't connect to 1 app; it connects to 5 to 15 apps simultaneously (GitHub, Gmail, Slack, Linear, Notion, Jira).
- The real launch date of an agent is gated by the **longest provider approval bottleneck** (e.g., Slack's 10-week App Directory review or Google's CASA security audit), not by how fast an engineer writes auth code.
- Developers waste weeks building auth only to discover **capability ceilings** (e.g. Google Classroom write restrictions), where the API simply does not permit the programmatic actions the agent needs.

Instead of a clone directory of 100 guides, this product is an **opinionated decision and launch-planning engine** with an honest escape hatch: **Composio Managed Auth**.

## 2. Key Product Decisions & Framework

### A. The Three Classes of Blockers
Standard documentation only addresses the "happy path." This product models the three distinct walls developers actually encounter:

| Blocker Class | Where It Hits | Real-World Cost | Handled in Product |
|---|---|---|---|
| **1. Setup Friction** | During console registration | Hours / days of head-scratching | Field-by-field directives: **FILL**, **LEAVE** (skip defaults), **WATCH** (hidden traps like GitHub App's "Active" webhook toggle or Google's "No organization"). |
| **2. Approval Wait & Governance** | At launch, opening to public users | 6–12 weeks of dead time | **Critical Path Sequencer**: sorts integrations by calendar wait, totals the delay, and flags non-code enterprise gates (CASA audits, Slack 5-workspace gate, Microsoft publisher verification). |
| **3. Capability Ceiling** | After building OAuth & reading docs | The entire project dies | **Step 0: Capability Feasibility Check**, surfaced at the top of each guide before any setup steps. |

### B. The Capability Ceiling Insight (The Agilo / PictoBlox Case Study)
**The scar tissue:** While building the PictoBlox × Google Classroom integration at Agilo Research, our team completed full OAuth setup, doc-reading, and Postman testing — only to find that Google Classroom restricts programmatic writes into coursework (you can generally only modify coursework your own API project created, and posting on a teacher's behalf requires the teacher's credentials and specific scopes).
**Product lesson:** If an agent cannot write to the endpoint, OAuth setup is irrelevant. Every guide mandates a **Capability Check before step 1.**
**Strategic Composio nuance:** Managed auth (Composio or any layer) simplifies token lifecycles and registration, but **cannot override a provider's capability limits**. Stating this boundary honestly builds trust.

### C. Persona Layering: From Intern to CTO
- **Intern / Junior Engineer:** a zero-ambiguity navigator — no guessing what "Organization" means on a personal Gmail (select "No organization"), no getting stuck on renamed tabs (Google moved "Scopes" to "Data Access").
- **Tech Lead:** feasibility first, rate limits, token expirations (Google test tokens expire in 7 days), PKCE requirements.
- **CTO / VP Eng:** the Executive View — total calendar delay, third-party audit costs, and the Composio ROI ("launch today with managed auth vs. 10 weeks DIY").

## 3. Evidence & Grounding Discipline

Composio explicitly grades "judgment about evidence." Every assertion is tagged into four tiers, and **TESTED is reserved for setups I performed myself**:

- **TESTED:** Directly executed by me during hands-on registration.
  - Registered a GitHub OAuth App and a GitHub App; hit the Webhook "Active" trap and the OAuth-App-vs-GitHub-App fork.
  - Configured a Google Cloud OAuth app; navigated the renamed "Data Access" console and the "No organization" field; saw the restricted-scope (Gmail) verification/CASA warning appear.
  - Google Classroom coursework write restrictions — lived during the PictoBlox integration.
- **SOURCED:** Verified against official provider documentation (e.g. Slack's App Directory review policy; Microsoft Entra publisher verification).
- **INFERRED:** Reasoned by the Live Agent Investigator from its knowledge of related documentation.
- **UNVERIFIED:** Explicitly flagged when provider policy is undocumented or unconfirmed.

## 4. Architecture

- **Next.js 14 + TypeScript + Tailwind CSS**, with strict **Zod** schema validation (`lib/schema.ts`).
- **Progressive Disclosure UI:** Level 1 — one-line verdict + the Two Clocks (Works in Dev vs Any User Can Connect); Level 2 — Capability Check + 3 blocker classes; Level 3 — field-by-field steps (FILL / LEAVE / WATCH); Level 4 — evidence ledger + Composio escape hatch.
- **Multi-App Launch Planner:** critical-path sequencing (longest wait sets the launch date), CTO View (timeline, cost, governance) vs Dev View (task checklist), JSON export.
- **Live Agent Investigator:** submit any app → a **Groq-hosted LLM (`openai/gpt-oss-20b`, chosen via model auto-discovery so a deprecated model name can never break it)** generates a guide, validated against the Zod schema with an automatic repair pass, with a research trail and honest provenance labels (SOURCED / INFERRED / UNVERIFIED — never TESTED). It reasons from the model's knowledge of provider documentation; **it is not a live web crawler.** A grounded web-search variant is available on the Gemini path with billing enabled.
- **Zero-database:** state is shared via URL and JSON download; no credentials stored.
- **Standalone `index.html`:** a zero-install browser version for reviewing the UI and static library offline. Its investigator is an **offline demo over a curated knowledge base** (illustrative only) — use the Vercel deployment for real LLM generation.

## 5. Curated Seed Library (14 Varied Apps)

| App | Difficulty | Dev Clock | Public Launch Clock | Blocker Highlighted |
|---|---|---|---|---|
| GitHub (OAuth App) | trivial | ~10 min | Same day | **TESTED** baseline: instant public auth, no review |
| GitHub (GitHub App) | moderate | ~25 min | Immediate | **TESTED** setup friction: Webhook "Active" trap |
| Google (Gmail) | gated | ~60 min | 6–12 weeks + CASA | **TESTED** approval wall: CASA audit, "Data Access" naming |
| Google Classroom | hard | ~90 min | 6–12 weeks | **TESTED** capability ceiling: coursework write limits |
| Slack | gated | ~30 min | 8–10 weeks | **SOURCED** review restarts; 5-workspace gate |
| Microsoft Graph | gated | ~45 min | 3–6 weeks | **SOURCED** governance gate: admin consent |
| Spotify | moderate | ~15 min | 2–4 weeks | **SOURCED** quota cap: dev-mode user whitelist |
| Linear | trivial | ~15 min | Same day | **SOURCED** modern OAuth 2.0 baseline |
| Twitter (X) | gated | ~30 min | Immediate (paid) | **SOURCED** paywall ceiling: free tier limits |
| Jotform | trivial | ~5 min | Immediate | **SOURCED** honest detection: no OAuth (API key only) |
| Notion | moderate | ~15 min | 1–2 days | **SOURCED** setup fork: internal vs public integration |
| HubSpot | moderate | ~20 min | 7–14 days | **SOURCED** dedicated developer account + test portals |
| Discord | moderate | ~20 min | Immediate | **SOURCED** privileged gateway intents |
| Airtable | moderate | ~20 min | Immediate | **SOURCED** OAuth 2.0 with PKCE SHA-256 |

## 6. How to Run

**Live:** open the Vercel URL above. For the live agent to run, the deployment has `GROQ_API_KEY` (and optionally `GROQ_MODEL=openai/gpt-oss-20b`) set in its environment.

**Local:**
```bash
npm install
# create .env.local with:  GROQ_API_KEY=your_key   (free key at console.groq.com)
npm run dev
# open http://localhost:3000
```

**Static demo:** open `index.html` directly in a browser (library + planner; the live agent is an offline demo in this mode).

## 7. Known Limitations & Roadmap

- **Live agent is LLM-reasoned, not web-grounded.** The server agent (`app/api/generate/route.ts` → `lib/agent-investigator.ts`) sends the app to a Groq LLM (`gpt-oss`) which returns a Zod-validated guide with provenance labels. It uses the model's knowledge of provider docs, not a live crawl, so generated claims are SOURCED / INFERRED / UNVERIFIED — never TESTED. A grounded web-search variant exists on the Gemini path with billing enabled. Runs on Vercel/localhost, not on GitHub Pages (which can't run the API route).
- **Provider portal UI drift:** major consoles (Google, Azure) redesign often (e.g. Google renaming "Scopes" to "Data Access"); version-stamped screenshots would help.
- **Curated, not exhaustive:** the library is a focused slice; the point is the planner and capability framing, not breadth. A few Composio managed-auth flags are best-effort and worth verifying against the live directory.
- **Automated CASA pre-auditor:** a future feature could map an agent's scopes to the exact CASA tier and questionnaire.
