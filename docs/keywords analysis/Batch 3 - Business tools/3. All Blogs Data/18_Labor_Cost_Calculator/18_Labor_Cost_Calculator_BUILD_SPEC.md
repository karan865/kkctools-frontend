# Labor Cost Calculator — Build Spec

> **URL:** `/labor-cost-calculator/` · Batch 3 Part 2 · Tier 1 · **Build order 3**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2; §7 `us-tax-data.ts`)
> **Inputs used:** `18_Labor_Cost_Calculator_Competitor_Analysis.md` (4 pages + 2 that returned 403), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #5
> **Written:** 2026-11-20

---

## 0. Strategy note

- **SERP is weak** (avg AS 39). Indeed 100 and Gusto 60 are strong; submittallink (AS 11) holds #3; the other results are construction-software pages at AS 20–37.
- The cluster is small (2,900) but **rising**, with **CPC $6.43**: contractors and owners with budgets.
- It fits the existing construction audience. Link it hard from the Construction Estimate Template and the material calculators.

**Three different "labor cost" jobs exist, and no competitor joins them:**
1. Fully burdened hourly cost of an employee.
2. Labor cost of a job, turned into a quote price.
3. Labor cost as a % of revenue (restaurants, retail).

We do all three, as three tabs.

`TODO(owner)`: pull `labor cost calculator` and `labor burden calculator` volumes. They are not in the exports.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | labor cost | 1,900 | 14 | H1 + definition sentence + H2 "What is labor cost?" |
| Secondary | how to estimate labor costs for construction | 1,000 | 5 | H2 + the Job tab (step-by-step) |
| Natural phrases (not in exports; use in copy) | labor cost calculator · labor burden · burdened labor rate · true cost of an employee · labor cost percentage | — | — | title, H2s, FAQ |

## 2. Our edge

- **One flow:** employee burden → burdened hourly rate → crew/job labor cost → quote price (markup and margin shown). Nobody connects these.
- **Correct US payroll-tax logic with wage-base caps:** Social Security stops at the wage base; FUTA applies only to the first $X; SUTA uses the state wage base. Editable, cited, dated. **0 of 4 competitors** model caps.
- **Paid vs productive hours:** holidays, PTO, sick days, training, non-billable time. Only 1 of 4 does this.
- **Crew mix:** foreman / journeyman / helper, each with its own rate and hours.
- **Employee vs subcontractor** comparison (nobody has it).
- **Overtime 1.5×** (FLSA; link dol.gov as the Hourly page does).
- **Non-US mode:** one "employer on-costs %" field. Nothing hard-coded for UK NI, AU super, etc.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **True employee cost** (default)
2. **Job labor & quote**
3. **Labor % of revenue**

### 3.2 Input guide diagram (above the inputs, rules §9)

`LaborInputGuide.tsx`

**Tab 1:** a stacked bar, "what one worker really costs per year". The segments are:

| # | Segment |
|---:|---|
| 1 | Wages |
| 2 | Social Security + Medicare |
| 3 | FUTA + SUTA |
| 4 | Workers' comp |
| 5 | Liability insurance |
| 6 | Benefits |

To the right: a clock icon with **7 Paid hours** minus **8 Time off** = Productive hours. Below it: "Total ÷ productive hours = burdened hourly rate".

- Segments show live $ values; the focused field's segment highlights.

**Tab 2:** three worker icons (crew roles 1–3) → "× hours" → labor $ + **4 Materials** + **5 Equipment** + **6 Subs** → "+ 7 Overhead %" → "+ 8 Profit %" → Quote.

**Tab 3:** two bars side by side, labor cost vs revenue, with the % between them.

### 3.3 Inputs (defaults = examples)

**Tab 1 — True employee cost**

| # | Field | Default |
|---:|---|---|
| 1 | Pay: hourly rate **or** annual salary | $30/hr |
| 7 | Paid hours per year (or hours/week × weeks) | 2,080 |
| 8 | Time off: paid holidays h, PTO/vacation h, sick h, training/non-billable h | 80, 80, 0, 0 |
| 2 | Country mode: **US** (itemised) / **Other** (one employer on-costs % field) | US |
| 2 | US: Social Security % + wage base, Medicare % | from `us-tax-data.ts` (2026: 6.2% employer share of the 12.4%, wage base $184,500, Medicare 1.45%). The 6.2/1.45 employer split must also be read on irs.gov (Pub. 15) before shipping: `TODO(owner)` |
| 3 | FUTA rate + wage base, SUTA rate + state wage base | editable, **no default shipped until verified**. Example in the UI: FUTA 0.6% on $7,000, SUTA 2% on $10,000, labelled "example; check your state" |
| 4 | Workers' comp: rate per $100 of payroll | $5.00 (example) |
| 5 | General liability: rate per $1,000 of payroll or $/yr | $0 |
| 6 | Benefits $/yr (health, retirement match, other) | $6,000 |
| — | Overtime hours/yr + multiplier | 0, 1.5× |

**Tab 2 — Job labor & quote**
- Crew rows (add/remove): role, burdened rate (prefill from Tab 1 or type), hours, overtime hours.
- Materials, equipment, subcontractors.
- Overhead %, profit % (the toggle "markup on cost" vs "margin on price" uses `pricing-engine`).

**Tab 3 — Labor %:** total annual labor cost (prefill from Tab 1 × headcount or type) and revenue.

### 3.4 Engine (`src/lib/labor-cost-engine.ts`)

Data comes from `us-tax-data.ts`. Markup and margin come from `pricing-engine`.

```ts
wages = rate * paidHours + otHours * rate * otMult          // or salary
ss    = min(wages, ssWageBase) * ssEmployerRate
med   = wages * medicareRate            // no cap (additional Medicare is employee-side; note it)
futa  = min(wages, futaBase) * futaRate ; suta = min(wages, sutaBase) * sutaRate
wc    = wages / 100 * wcPer100 ; gl = wages / 1000 * glPer1000 (or flat)
total = wages + ss + med + futa + suta + wc + gl + benefits
burdenPct = (total - wages) / wages
productiveHours = paidHours - holidays - pto - sick - training      // null if <= 0
burdenedPerPaidHour = total / paidHours ; burdenedPerProductiveHour = total / productiveHours
jobLabor = Σ (hours*rate + otHours*rate*otMult)
quote = (jobLabor + materials + equipment + subs) * (1 + overhead) * (1 + profit)   // or margin mode via pricing-engine
laborPct = laborCost / revenue
subVsEmployee: compare burdened productive rate with a sub's quoted hourly rate
```

**Worked example (engine defaults, checked 2026-11-20):**

| Line | Amount |
|---|---|
| Wages ($30 × 2,080) | $62,400 |
| Social Security | $3,868.80 |
| Medicare | $904.80 |
| FUTA (example) | $42 |
| SUTA (example) | $200 |
| Workers' comp | $3,120 |
| Benefits | $6,000 |
| **Total** | **$76,535.60** |

- Burden 22.65%.
- $36.80 per paid hour; **$39.86 per productive hour** (1,920 h).
- Job: 3 workers × 40 h = $4,783.48 labor; with 15% overhead and 10% profit = **$6,051.10**.

The page computes these from the engine, not as text.

### 3.5 Outputs

- **Headline:** burdened hourly rate (productive) + burden %.
- **Sentence:** "A $30/hour employee really costs about $39.86 per productive hour, 22.65% more than their wage once payroll taxes, insurance, benefits and time off are counted."
- Breakdown table (annual, % of wages); paid vs productive hours.
- **Job tab:** labor subtotal, quote, with markup % and margin % side by side.
- **Labor %:** a number plus the plain meaning. **No "good %" benchmarks** unless cited.
- Share URL, Copy, Print (quote-friendly print).

### 3.6 Tests

- Social Security cap: wages above the wage base stop growing SS. FUTA/SUTA caps likewise.
- Zero productive hours → `null`.
- Overtime adds correctly.
- Quote in markup mode vs margin mode (via `pricing-engine`).
- The worked example above. Snapshot of page numbers.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Labor Cost Calculator – Burdened Hourly Labor Rate` (50, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free labor cost calculator. Add wages, payroll taxes, insurance and benefits to get the burdened hourly cost of a worker or crew, and the price per job.` (152) |
| H1 | `Labor Cost Calculator: True Hourly Cost of a Worker or Crew` |
| BLUF | "Labor cost is everything you pay for an hour of work, not just the wage: payroll taxes, insurance, benefits and paid time off. A $30-an-hour worker in this example costs $39.86 per productive hour." (engine) |
| ToolShell pills | `Payroll-tax caps built in`, `Crew & job quote`, `Paid vs productive hours`, `Print & share link` |
| Links out | Construction Estimate Template (live), Markup, Profit Margin, Hourly to Salary, Concrete / Drywall / Stud (live) |
| Links in | Construction Estimate Template (add a "Price your labor" link), Markup, Hourly to Salary, Tools hub |

## 5. Content (~1,700–2,000 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | What is labor cost? | Direct vs indirect; definition (primary) | 150 |
| 2 | How to use the labor cost calculator | 3 tabs | 120 |
| 3 | Fully burdened labor rate: formula and example | Engine table | 250 |
| 4 | Employer payroll taxes and insurance (US) | SS, Medicare, FUTA, SUTA, workers' comp; cited, dated; "other countries: use the on-costs field" | 250 |
| 5 | Paid hours vs productive hours | Why the per-productive-hour rate is what you price with | 150 |
| 6 | How to estimate labor costs for construction | Step-by-step crew example → quote (secondary keyword) | 250 |
| 7 | Overhead, profit, markup vs margin | Link Markup / Profit Margin | 150 |
| 8 | Labor cost as a percentage of revenue | Formula; no unsourced "good %" | 120 |
| 9 | Employee vs subcontractor: which costs less? | Engine comparison, non-legal | 150 |
| 10 | FAQ | §6 | 350 |

## 6. FAQ (10)

1. What is labor burden? / What is a burdened labor rate?
2. How do I calculate the true hourly cost of an employee?
3. What payroll taxes does an employer pay in the US? (cited)
4. How do I estimate labor costs for construction? (`how to estimate labor costs for construction`)
5. How much should I charge per hour for labor? (burdened rate + overhead + profit, from the engine)
6. Is labor a fixed or variable cost?
7. How do overtime hours change labor cost? (FLSA 1.5×, dol.gov link)
8. Employee vs subcontractor: which is cheaper?
9. How do I work out labor cost as a % of sales?
10. Does this work outside the US? (on-costs % mode)

## 7. Done when

- [ ] `us-tax-data.ts` created with only verified figures (rules §7); unverified = `null` + `TODO(owner)`.
- [ ] `labor-cost-engine.ts` + tests; `pricing-engine` reused for markup/margin; `npm run verify` passes.
- [ ] Input guide diagram per tab, above the inputs; ToolShell + TabSlider used.
- [ ] Every tax rate on the page has an irs.gov / ssa.gov / dol.gov link + year.
- [ ] Construction Estimate Template links to this page; registrations + docs updated; `graphify update .`.
