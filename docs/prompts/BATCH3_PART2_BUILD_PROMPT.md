# Batch 3 Part 2 + Part 3 — Builder Prompt (Antigravity / Gemini)

> **Goal:** build the 21 pending Batch 3 tool pages (14 in Part 2 + 7 in Part 3), one at a time, from their build specs.
> **Spec folder:** `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/`
> **Written:** 2026-11-20

---

## 0. Read first, and obey

1. **Before touching code, read in full:**
   - `AGENTS.md`;
   - `CLAUDE.md`;
   - `00_BATCH3_BUILD_RULES.md`, **Part 1 and Part 2** (§6–§11);
   - the spec of the tool you are building.
2. **graphify:** run `graphify query "<question>"` before searching code. It is not on PATH, so use `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`. After code changes, run `graphify update .`.
3. **Run tests from PowerShell or the VS Code terminal, never Git Bash.** Git Bash passes a lower-case `d:/` and vitest then fails every file with "reading 'config'".
4. **Never:**
   - commit or push;
   - make network calls in tool code;
   - invent facts or numbers (market averages, rates, multiples, tax figures);
   - copy competitor text;
   - add `aggregateRating`, star ratings or review counts.
5. **If the spec and the code disagree,** or a figure the spec marks `TODO(owner)` is needed, **stop and report.** Don't guess.

## 1. Order of work

Follow `00_BATCH3_BUILD_RULES.md` §6.

| Step | Spec folder | Note |
|---:|---|---|
| A | — | **Shared code first:** `src/lib/real-estate-engine.ts` + test (before #1). `src/lib/loan-engine.ts` + test (before #2). `src/content/us-tax-data.ts` (before #3), containing **only** the verified figures listed in rules §7, with URLs and check dates; everything else `null` + `TODO(owner)`. |
| 1 | `06_Cap_Rate_Commercial_Property_Value_Calculator` | |
| 2 | `07_Rental_Property_Calculator` | |
| 3 | `18_Labor_Cost_Calculator` | |
| 4 | `10_Commercial_Lease_Calculator` | |
| 5 | `14_Airbnb_Short_Term_Rental_Profit_Calculator` | |
| 6 | `15_Freelance_Hourly_Rate_Calculator` | |
| 7 | `22_Contribution_Margin_Break_Even_Calculator` | |
| 8 | `08_Commercial_Mortgage_LTV_Calculator` | |
| 9 | `13_Equipment_Business_Loan_Calculator` | |
| 10 | `11_Business_Valuation_Calculator` | |
| 11 | `16_Invoice_Generator_Hourly_Freelance` | **STOP after #11 and report.** |
| 12–14 | `20_How_Long…`, `12_SBA…`, `25_Self_Employment…` | **Tier 3 (YMYL):** build only if `docs/00-PROJECT-STATUS.md` contains the owner's yearly-review note for that tool. Otherwise skip them and say so. |
| **P3-A** | — | **Part 3 shared code:** `src/lib/tvm-engine.ts` + test (rules §13). Reuse `real-estate-engine.npv/irr` and `loan-engine`; don't duplicate them. |
| P3-1 | `26_Present_Value_NPV_Calculator` | Part 3 starts here, after tool #11. It may run while the Tier 3 tools wait for the owner. |
| P3-2 | `21_Compound_Interest_Calculator` | |
| P3-3 | `17_Card_Processing_Fee_Calculator` | Presets **only** from official pricing pages read by you (URL + date); otherwise Custom mode only. |
| P3-4 | `24_Credit_Card_Payoff_APR_Calculator` | YMYL box, no card ads. |
| P3-5 | `19_Net_Worth_Calculator` | SCF benchmarks only if read on federalreserve.gov; otherwise none. |
| P3-6 | `23_HELOC_Home_Equity_Calculator` | YMYL box; Pub 936 line only if verified. |
| P3-7 | `27_Investment_Return_Calculator_SP500` | No Historical tab unless the owner approved a licensed dataset. **STOP after P3-7 and report.** |

**Part 3 note:** these 7 tools were removed in the SERP check and are built on the owner's request. Each spec targets its long-tail keywords first (rules §12). Don't change the specs' keyword targets toward the head terms.

**Checkpoint:** after **tool #1 (Cap Rate)**, stop and report so the owner can review the pattern (input guide diagram, ToolShell, page). Continue only after the owner's OK. Then build #2–#11 one after another, running verify after each.

## 2. For every tool

1. **Engine first** (`src/lib/<tool>-engine.ts`): pure functions, `null` for undefined cases, -0 → 0, full precision. Tests cover the spec's §3.x "Tests" list.
   - **Each spec has a "Worked example" checked by hand. Make it a unit test.** If your engine disagrees, find out why before going on.
2. **Component** (`src/components/tool/<slug>/`):
   - the calculator;
   - **`<Name>InputGuide.tsx` above the inputs**, following rules §9: numbered callouts match the numbered field labels, live values, focus highlight, `role="img"` + title/desc, tokens only, mobile `<details>`, one diagram per tab;
   - any results diagram the spec asks for (waterfall, chart, schedule).
3. **Shared UI:**
   - `TabSlider` for tabs (`?tab=` in the URL; except Invoice, which never puts data in URLs);
   - the page wraps the calculator in `ToolShell` with the spec's 4 pills;
   - `<main>` gets `toolDisplayFont.variable` + `typo.scope`.
4. **Page** (`src/app/<slug>/page.tsx`):
   - title/meta/H1 **exactly** as the spec (`absoluteTitle` where the spec says);
   - the BLUF in the first 60 words, with **numbers from the engine**, not typed text;
   - H2 outline and FAQ as the spec (FAQ visible once + FAQPage schema once);
   - `HowWeCalculate` with formulas and every source (URL + date);
   - disclaimer;
   - AdSlots outside the ToolShell band, as on live pages.
5. **Trust (rules §10):**
   - no uncited market numbers;
   - every default labelled "example — change to your numbers";
   - YMYL pages get the dated "Sources & assumptions" box + "Last reviewed".
6. **Register:**
   - `routes.ts`, `tools-catalog.ts` (category `business`) + the count test;
   - `calculation-methods.ts`, `ToolArt.tsx`, `Icons.tsx`, `Footer.tsx`;
   - the internal links the spec lists ("Links in": add links on those live pages too).
7. **Docs:**
   - `docs/00-PROJECT-STATUS.md`, `01-FEATURES.md`, `02-SEO.md`, `04-KEYWORDS.md`, `06-CHANGELOG.md`;
   - tick the tool in `KKCTools_Batch3_Final_Tool_Keywords.md` **only after verify passes**.
8. **Verify:**
   - `npm run verify` (PowerShell): all 6 steps pass;
   - `graphify update .`;
   - check by hand at 390 / 768 / 1280 px, light and dark: no page-level horizontal scroll, the first tab visible, the diagram readable, tables scrolling inside their box, print clean.

## 3. Report after each checkpoint

- Files created/changed (grouped by tool).
- `npm run verify` output (the 6 step lines).
- Each tool's worked example: the spec value vs the engine value.
- The 4 ToolShell pills used per tool.
- Every `TODO(owner)` you hit, and what you did instead.
- Anything in a spec that didn't match the code.
