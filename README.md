# OAuth Launch Planner & Feasibility Engine
### APM Integrations Take-Home Assessment — Composio
**Candidate:** Ayush Kabra  
**Source Repository:** [https://github.com/ayushkabra/oauth-launch-planner](https://github.com/ayushkabra/oauth-launch-planner)  
**Live Production Experience:** [https://ayushkabra.github.io/oauth-launch-planner/](https://ayushkabra.github.io/oauth-launch-planner/)

---

## 1. Executive Summary & Product Thesis

> **Our Product in One Line:**  
> *"A launch-timeline planner and capability feasibility engine for AI agent builders. Tell it what tools your agent needs to connect; it sequences your critical path to 'any user can connect', warns you of fatal capability ceilings before you write code, gives junior engineers a zero-ambiguity field guide (`FILL` / `LEAVE` / `WATCH`), and shows the CTO when to skip months of delay by adopting Composio Managed Auth."*

Most OAuth guides are written as static, isolated documentation directories ("How to register an app on Provider X"). For AI agent developers, **that model is broken**:
1. An autonomous agent doesn't connect to 1 app; it connects to **5 to 15 apps simultaneously** (GitHub, Gmail, Slack, Linear, Notion, Jira).
2. The real launch date of an agent is **gated by the longest provider approval bottleneck** (e.g., Slack's 10-week App Directory review or Google's CASA security audit), not by how fast an engineer writes auth code.
3. Developers waste weeks building auth only to discover **capability ceilings** (e.g. Google Classroom write restrictions), where the API simply does not permit the programmatic actions the agent needs.

Instead of a clone directory of 100 guides, this product is an **opinionated decision and launch planning engine** with an honest escape hatch: **Composio Managed Auth**.

---

## 2. Key Product Decisions & Framework

### A. The Three Classes of Blockers
Standard documentation only addresses the "happy path." This product models the three distinct walls developers actually encounter:

| Blocker Class | Where It Hits | Real-World Cost | Handled in Product |
| :--- | :--- | :--- | :--- |
| **1. Setup Friction** | During console registration | Hours / Days of head-scratching | Field-by-field directives: `FILL`, `LEAVE` (defaults to skip), and `WATCH` (hidden traps like GitHub App's "Active" webhook toggle or Google's "No organization"). |
| **2. Approval Wait & Governance** | At launch when opening to public users | 6–12 weeks of dead time | **Critical Path Sequencer**: sorts integrations by calendar wait, calculates total delay, and flags non-code enterprise gates (CASA Tier 2 audits, Slack 5-workspace gates, Microsoft MPN partner verification). |
| **3. Capability Ceiling** | *After* building OAuth & reading docs | The entire project dies | **Step 0: Capability Feasibility Check**. Surfaced at the very top of each guide before any setup steps. |

### B. The Capability Ceiling Insight (The Agilo / PictoBlox Case Study)
* **The Scar Tissue**: While building the PictoBlox × Google Classroom integration at Agilo Research, our team completed full OAuth setup, doc reading, and Postman testing, only to discover that Google Classroom restricts programmatic writes into coursework—you can generally only modify coursework created by your own API project, and posting on a teacher's behalf requires the teacher's credentials and specific scopes.
* **Product Lesson**: If an agent cannot write to the endpoint, OAuth setup is completely irrelevant. **Our guides mandate a "Capability Check" before step 1.**
* **Strategic Composio Nuance**: Managed auth (Composio or any layer) simplifies token lifecycles and registration, but **cannot override provider business logic limitations**. Highlighting this boundary demonstrates deep developer empathy and builds institutional trust.

### C. Persona Layering: From Intern to CTO
* **For the Intern / Junior Engineer**: A tactical, zero-ambiguity navigator. No guessing what "Organization" means on a personal Gmail (select "No organization"); no getting stuck on hidden tabs (Google renamed "Scopes" to "Data Access").
* **For the Tech Lead / Senior Engineer**: Feasibility first, rate limits, token refresh expirations (Google test tokens expire in 7 days), and PKCE requirements.
* **For the CTO / VP Engineering**: The **Executive View** showing total calendar delay (e.g. 70 days), third-party audit costs ($3,000–$10,000 CASA assessment), and the immediate ROI of Composio: *"Launch today with Composio Managed Auth vs. launch in 10 weeks DIY."*

---

## 3. Evidence & Grounding Discipline

Composio explicitly grades "judgment about evidence." We reject hallucinated documentation by strictly tagging every assertion into four tiers:

1. `TESTED`: Directly executed by the candidate during hands-on registration.
   * *Example*: Directly registered GitHub OAuth App and GitHub App; encountered the Webhook "Active" trap; registered Google Cloud project, navigated the renamed "Data Access" console, and witnessed the restricted scope CASA audit warning.
   * *Example*: Google Classroom coursework write restrictions lived and validated during the PictoBlox integration.
2. `SOURCED`: Verified against official, code-controlled developer documentation.
   * *Example*: Slack's 10-week App Directory review policy and 5-workspace installation threshold ([api.slack.com/docs/distribution](https://api.slack.com/docs/distribution)).
   * *Example*: Microsoft Entra publisher verification and MPN D-U-N-S requirements ([learn.microsoft.com](https://learn.microsoft.com/en-us/entra/identity-platform/publisher-verification-overview)).
3. `INFERRED`: Reasoned by the Live Agent Investigator from related documentation during live research (not directly stated on a source page).
4. `UNVERIFIED`: Explicitly flagged when provider policies are undocumented or unconfirmed.

---

## 4. Architectural Highlights & Zero-DB Implementation

* **Next.js 14 + TypeScript + Tailwind CSS**: Clean component hierarchy with strict Zod schema validation (`lib/schema.ts`).
* **Progressive Disclosure UI**:
  * Level 1: One-Line Verdict & The Two Clocks (`Works in Dev` vs `Any User Can Connect`).
  * Level 2: Feasibility First (Capability Check + 3 Blocker Classes).
  * Level 3: Step-by-Step Field Execution Guide (`FILL` / `LEAVE` / `WATCH`).
  * Level 4: Tested Evidence Ledger + Composio Escape Hatch.
* **Multi-App Launch Planner**:
  * Real-time critical path sequencing (longest wait determines launch date).
  * Toggle between CTO View (Gantt timeline, cost, governance) and Dev View (task checklist).
  * JSON Plan export.
* **Live Agent Investigator**:
  * Multi-step autonomous research pipeline for uncataloged apps (e.g. Salesforce, Stripe, Figma).
  * Streaming **Research Trail** with verified provider domains.
  * Zod schema validation with automatic repair pass.
* **Zero-Database Persistence**: Shareable via URL state and instant JSON download; zero credential leakage.
* **Standalone Interactive Runner (`index.html`)**: Included in the repository for instant offline/online browser review without build dependencies.

---

## 5. Curated Seed Library Overview (14 Varied Apps)

| App | Difficulty | Dev Clock | Public Launch Clock | Blocker Class Highlighted |
| :--- | :--- | :--- | :--- | :--- |
| **GitHub (OAuth App)** | `trivial` | ~10 min | Same day (0 days) | `TESTED` Baseline: instant public authorization, no review. |
| **GitHub (GitHub App)** | `moderate` | ~25 min | Immediate | `TESTED` Setup Friction: Webhook "Active" checkbox trap. |
| **Google (Gmail)** | `gated` | ~60 min | 6–12 weeks + CASA | `TESTED` Approval Wall: CASA Tier 2 audit ($3k–$10k), "Data Access" scope naming. |
| **Google Classroom** | `hard` | ~90 min | 6–12 weeks | `TESTED` Capability Ceiling: Coursework write restrictions (PictoBlox story). |
| **Slack** | `gated` | ~30 min | 8–10 weeks | `SOURCED` Review Restarts: adding 1 scope restarts 10-week queue; 5-workspace gate. |
| **Microsoft Graph** | `gated` | ~45 min | 3–6 weeks | `SOURCED` Governance Gate: Azure AD multi-tenant & Enterprise Admin Consent. |
| **Spotify** | `moderate` | ~15 min | 2–4 weeks | `SOURCED` Quota Cap: 25-user whitelist dev limit until Quota Extension approval. |
| **Linear** | `trivial` | ~15 min | Same day (0 days) | `SOURCED` Modern Developer-First OAuth 2.0 baseline. |
| **Twitter (X)** | `gated` | ~30 min | Immediate with $$ | `SOURCED` Paywall Ceiling: Free tier has zero read/search; Basic tier is $100/mo. |
| **Jotform** | `trivial` | ~5 min | Immediate | `SOURCED` Honest Detection: No OAuth exists (API Key only). |
| **Notion** | `moderate` | ~15 min | 1–2 days | `SOURCED` Setup Fork: Internal vs Public integration switch. |
| **HubSpot** | `moderate` | ~20 min | 7–14 days | `SOURCED` Setup Requirement: Dedicated Developer Account + child Test Portals. |
| **Discord** | `moderate` | ~20 min | Immediate (<100 servers) | `SOURCED` Privileged Gateway Intents (Message Content Intent). |
| **Airtable** | `moderate` | ~20 min | Immediate | `SOURCED` Protocol Requirement: Strict OAuth 2.0 with PKCE SHA-256. |

---

## 6. How to Run & Verify

### Option A: Instant Browser Preview (Zero Installation)
Double-click or open [index.html](file:///c:/Users/Ayush/Composio/index.html) in any modern browser (Chrome, Edge, Safari, Firefox). All features, search filters, modal guides, planner Gantt, and the live agent investigator are fully operational.

### Option B: Next.js Development Server
```bash
# In the repository root
npm install
npm run dev

# Open http://localhost:3000
```

---

## 7. Known Limitations & Future Roadmap

1. **Two investigator modes — stated honestly**:
   * **Next.js server mode (the real agent)** — `app/api/generate/route.ts` → `lib/agent-investigator.ts` executes live **real-time web search crawling** via DuckDuckGo to retrieve official provider documentation URLs and excerpts, then feeds them to Google Gemini (`gemini-2.0-flash` or dynamic Flash auto-discovery via Google AI Studio — 100% free tier; or OpenAI API) for structured analysis. The output is validated against the strict Zod schema with an automated repair pass, returning a research trail of **actual links found** and honest evidence labels (`SOURCED` / `INFERRED`).
   * **Standalone `index.html` (offline demo)** — a zero-install single file for clicking through the UI and the static library. Its investigator is an offline demo over a curated knowledge base — generated guides there are shown as illustrative only. Use the Next.js server mode on Vercel or localhost for real, live autonomous research on any unfamiliar app.
   * Note: GitHub Pages serves only the static `index.html`; it cannot run the API route, so the live autonomous agent is available on the Next.js deployment (e.g. Vercel), not on the Pages URL.
2. **Provider Portal UI Drift**: Major providers (especially Google Cloud Console and Azure AD) redesign their consoles frequently (e.g. Google renaming "Scopes" to "Data Access"). A future version would incorporate community version-stamped screenshots.
3. **Automated CASA Pre-Auditor**: An upcoming feature for the Composio toolkit could parse an agent's required scopes and calculate the exact CASA Tier and questionnaire responses required for compliance.
