# Commercial Lease Calculator — Build Spec

> **URL:** `/commercial-lease-calculator/` · Batch 3 Part 2 · Tier 1 · **Build order 4**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2)
> **Inputs used:** `10_Commercial_Lease_Calculator_Competitor_Analysis.md` (4 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #6 (Semrush SERP 2026-11-16)
> **Written:** 2026-11-20

---

## 0. Strategy note

**SERP is very weak.** Several results don't even match the intent:
- a cell-tower lease page;
- a Calculator.net car-lease page;
- a NZ water-company form.

The relevant pages are AS 21–26 (q4realestate #1, Austin Tenant Advisors, Tyler Cauble).

**What this means:**
- The head term is small (390), but the lease vocabulary around it (CAM, NNN, gross lease, TI, $/SF/yr) adds **~14,000 easy searches**.
- **Depth of explanation wins here,** with a working calculator next to each concept.
- It fits contractors who lease a yard or shop.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | commercial lease calculator | 390 | 17 | title, H1, first sentence |
| Secondary | commercial property rent calculator · rent for commercial | 260 · 1,600 | 10–11 | intro + H2 "How commercial rent is calculated" |
| Secondary | net net net and triple net lease | 2,400 | 5 | H2 "Gross vs modified gross vs NNN lease" |
| Secondary | cam expenses | 1,900 | 4 | H2 "CAM expenses: how your share is worked out" |
| Secondary | sf/yr meaning | 720 | 2 | H2 "$/SF/yr explained" |
| Secondary | what is a gross lease · gross lease | 720 · 1,900 | 2 · 27 | FAQ + the lease-type table |
| Secondary | modified gross lease | 1,300 | 21 | lease-type table + FAQ |
| Secondary | rent increase calculator | 720 | 9 | the Escalation inputs + H2 "Rent escalations" |
| Secondary | tenant improvement(s) | 1,600 · 1,300 | 20–22 | TI input + H2 "TI allowance and net effective rent" |

## 2. Our edge (0 competitors do most of these)

- **Full occupancy cost:** base rent + taxes + insurance + CAM as separate lines, by lease type. Modified gross lets the user tick which costs the tenant pays.
- **Usable ↔ rentable sq ft with a load factor** inside the tool. CommercialCafe explains it in text only.
- **Escalations:** % (base only or all costs) or fixed $/SF steps, with a year-by-year schedule.
- **Free rent + TI allowance → net effective rent.** 0 of 4 competitors.
- **Compare two offers** side by side (e.g. $24 NNN vs $32 full-service gross). 0 of 4.
- **Pro-rata CAM share:** your RSF ÷ building RSF × total CAM.
- **Retail percentage rent:** % of sales above a breakpoint.
- **sq ft / m², any currency.**
- **Correct escalation maths.** Cauble's page has unit errors.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Lease cost** (default)
2. **Compare 2 offers**
3. **CAM share**
4. **Percentage rent** (retail)

### 3.2 Input guide diagram (above the inputs, rules §9)

`LeaseInputGuide.tsx`: a floor-plan sketch.

- **Inner rectangle:** "1 Usable sq ft" (your suite).
- **Outer shaded ring:** "2 Load factor %" (lobby, corridors, restrooms). Together they are "Rentable sq ft".
- **Rent receipt:** a stack beside the plan:
  - 3 Base rent $/SF/yr
  - 4 Property tax
  - 5 Insurance
  - 6 CAM
  - The "4–6" lines are greyed out when the lease type is Gross (landlord pays).
- **Timeline strip underneath:**
  - Year 1 → Year N, with "7 Escalation %" arrows between years;
  - a "8 Free months" gap at the start;
  - a "9 TI allowance" tag.

Live values on every label; the focused field highlights.

On the **CAM share** tab: a building outline with your suite shaded. Your RSF ÷ building RSF = your %.

### 3.3 Inputs (defaults = examples)

| Group | Fields | Defaults |
|---|---|---|
| Space | usable sq ft + load factor % (or enter RSF directly); sq ft / m² | 2,000 USF, 15% |
| Rent | base rent, quoted per SF per **year** or per **month** | $24/SF/yr |
| Lease type | Gross (full service) / Modified gross (tick tenant-paid items) / NNN / Absolute NNN | NNN |
| Pass-throughs (per SF/yr) | property tax, insurance, CAM | $3, $1, $4 |
| Term | years, escalation % or $/SF, applies to base only / all, free-rent months (base only / all), TI allowance $/SF | 5, 3% base only, 2 months base only, $10 |
| Compare tab | offer A and offer B, each the full set above | A = defaults; B = $32 gross, 3% |
| CAM share | your RSF, building RSF, total building CAM/yr | — |
| Percentage rent | projected annual sales, breakpoint (natural = base rent ÷ % or a fixed $), % over breakpoint | — |

### 3.4 Engine (`src/lib/commercial-lease-engine.ts`)

```ts
rsf = usf * (1 + loadFactor)
annualBase(y)  = rsf * baseRate * (1+e)^(y-1)        // or + stepPerSf*(y-1)
annualPass(y)  = rsf * (tax + ins + cam) [* (1+e)^(y-1) if escalate-all]  // per lease type: gross → 0 to tenant
freeRent       = months × (year-1 monthly base [+ pass if "all"])
totalTermCost  = Σ years (base + pass) − freeRent
avgMonthly     = totalTermCost / (years*12)
netEffectiveRentPerSfYr = (Σ base − freeRent − ti*rsf) / (rsf * years)   // base-rent basis, labelled
camShare       = yourRsf / buildingRsf * totalCam
percentageRent = max(0, sales − breakpoint) * pct
compare(A,B)   → totals, avg monthly, effective rate, cheaper offer + difference
```

**Worked example (defaults, checked 2026-11-20):**

| Item | Value |
|---|---|
| RSF | 2,300 |
| Year-1 base | $55,200 |
| Year-1 NNN | $18,400 |
| Year-1 monthly | $6,133.33 |
| 5-year base | $293,064.30 |
| NNN | $92,000 |
| Free rent | −$9,200 |
| **Total** | **$375,864.30** |
| Average monthly | $6,264.40 |
| **Net effective rent** | **$22.68/SF/yr** (after free rent and the $23,000 TI allowance) |

Computed by the engine on the page.

### 3.5 Outputs

- **Headline:** year-1 monthly rent (base + NNN) and the total lease cost.
- **Sentence:** "2,000 usable sq ft at a 15% load factor is 2,300 rentable sq ft. At $24/SF/yr NNN plus $8 of pass-throughs, year 1 costs $6,133 a month, and the 5-year lease totals $375,864."
- Year-by-year schedule table (base, pass-throughs, free rent, total, cumulative).
- Net effective rent card, with a one-line "why it's lower than the quoted rate".
- Compare tab: two columns + a "cheaper over the term by $X" banner.
- Print (tenant-friendly summary), Copy CSV, Share URL.

### 3.6 Tests

- Load factor; per-year vs per-month quoting.
- Each lease type's pass-through handling; modified gross with ticked items.
- Escalation % vs $/SF, base-only vs all.
- Free rent base-only vs all; TI → net effective rent.
- Compare winner.
- CAM share, with building RSF 0 → `null`.
- Percentage rent below the breakpoint = 0.
- The worked example. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Commercial Lease Calculator – Rent per Sq Ft & NNN` (50, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free commercial lease calculator. Convert rent per square foot per year to monthly rent, add NNN or CAM charges and escalations, and see total lease cost.` (154) |
| H1 | `Commercial Lease Calculator: Rent per Square Foot, NNN & CAM` |
| BLUF | "Commercial rent is usually quoted per rentable square foot per year. Multiply the rate by the rentable area and divide by 12 for the monthly rent, then add NNN charges if the lease passes them on. Here, 2,300 sq ft at $24 plus $8 NNN is $6,133 a month." (engine) |
| ToolShell pills | `Gross, modified gross & NNN`, `Escalations & free rent`, `Compare 2 offers`, `Print & share link` |
| Links out | Cap Rate, Square Footage (live), Commercial Mortgage (when built), Business Valuation (when built), Percentage Change (rent increase) |
| Links in | Cap Rate, Rental Property, Square Footage (add a "lease cost" link), Tools hub |

## 5. Content (~1,800–2,100 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the commercial lease calculator | 4 tabs | 120 |
| 2 | How commercial rent is calculated (per square foot) | Annual ↔ monthly formula + engine example | 200 |
| 3 | $/SF/yr explained | `sf/yr meaning`; per-month quoting in some markets | 120 |
| 4 | Gross vs modified gross vs NNN lease | Table: who pays tax, insurance, CAM, utilities, repairs (`net net net and triple net lease`, `modified gross lease`, `what is a gross lease`) | 280 |
| 5 | Rentable vs usable square feet and the load factor | Diagram reference + example | 180 |
| 6 | CAM expenses: how your share is worked out | Pro-rata formula, reconciliation, caps (general) (`cam expenses`) | 200 |
| 7 | Rent escalations | Fixed %, fixed $/SF, CPI (explain; no CPI data shown) (`rent increase calculator`) | 150 |
| 8 | Free rent, TI allowance and net effective rent | Engine example (`tenant improvement`) | 200 |
| 9 | Percentage rent for retail leases | Breakpoint example | 120 |
| 10 | Comparing two lease offers | Engine example | 130 |
| 11 | FAQ | §6 | 400 |
| — | Disclaimer | "Estimate only; your lease wording decides what you pay" | 30 |

**No market rent ranges** ("office rents in X are $…") anywhere.

## 6. FAQ (11)

1. How is commercial rent calculated per square foot?
2. How do I convert annual rent per square foot to monthly rent?
3. What does NNN (triple net) mean, and what's included?
4. What is a gross lease? (`what is a gross lease`)
5. What is a modified gross lease?
6. What are CAM expenses, and how is my share calculated? (`cam expenses`)
7. What is a load factor? Rentable vs usable sq ft?
8. What is a tenant improvement (TI) allowance?
9. What is net effective rent?
10. How do rent escalations work? (`rent increase calculator`)
11. Are utilities included in an NNN lease? (usually separate; check the lease)

## 7. Done when

- [ ] `commercial-lease-engine.ts` + tests (§3.6); `npm run verify` passes.
- [ ] Input guide diagram above the inputs (per tab); ToolShell + TabSlider used.
- [ ] Schedule prints cleanly and copies as CSV; m² mode works.
- [ ] No market rent figures; disclaimer present.
- [ ] Registrations + docs updated; `graphify update .`.
