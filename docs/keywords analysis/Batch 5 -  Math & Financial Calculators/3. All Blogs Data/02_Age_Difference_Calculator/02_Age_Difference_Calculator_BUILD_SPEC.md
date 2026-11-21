# Age Difference Calculator — Build Spec

> **URL:** `/age-difference-calculator/` · Batch 5 · Tier 1 · rank chance ✅ · **Build order 2**
> **Read first:** `../00_BATCH5_BUILD_RULES.md`
> **Inputs used:**
> - `02_Age_Difference_Calculator_Competitor_Analysis.md` (6 pages read, 2026-11-14)
> - keyword file §2 #2
>
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Why this term:** `age difference calculator` is **6,600 searches at KD 0**, the easiest exact-match term in Batch 5. Pure date maths, all in the browser.

**The SERP:**
- More than 30 results.
- Mostly **thin clones** (pages.dev / vercel) and school sites, plus Omni, DQYDJ, GIGAcalculator, Inch Calculator and 101 Planners.

**What every page misses:**

| Gap | Note |
|---|---|
| Two people only | No family list (the keyword file asks for one). |
| No "born on or before" mode | `date of birth to be 21 today` has 2,900 searches. |
| Leap years and month-end borrowing barely explained | Omni assumes 30-day months, and **its Charles/Diana example is 2 days off** (correct: 12 y 7 m 17 d). |

**Relationship intent** ("half your age plus 7", census gaps) shows on 3 pages.
- GIGAcalculator's census line contradicts its own table.
- If we include it at all: a clearly labelled folk rule, and statistics only from an official source with a date. `TODO(owner)`: decide.
- `TODO(owner)`: check whether the `date of birth to be 21 today` SERP is age-verification/legal content. We do date maths only, no legal advice.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | age difference calculator | 6,600 | 0 | Title, H1, first sentence, tool heading |
| Secondary | date of birth to be 21 today | 2,900 | 21 | Tab "Born on or before" + H2 "What date of birth makes you 21 (or 18) today?" + FAQ |
| Support (irregular) | how older is | 8,100 ⚠ | 27 | The result sentence "A is X years, Y months, Z days older than B" + FAQ "How much older is…" |
| Natural | age gap calculator · how many years apart | — | — | H2 wording, intro |

## 2. Our edge (6 competitors checked)

| Gap | Competitors with it |
|---|---|
| 3+ people (family list, sorted, pairwise gaps, spread) | **0 of 6** |
| "Born on or before" for 18 / 21 / 65 / custom, as of any date | **0 of 6** |
| Ages "as of" any date | rare |
| Correct calendar maths explained with a real example | 1 of 6, and **wrong** |
| All outputs together (Y/M/D, total months, weeks, days, who is older as a sentence) | 2 of 6 partial |
| Birth-years-only quick mode | 3 of 6 |
| Date-only maths (no time-zone shift); privacy note | — |

## 3. Calculator spec

### 3.1 Tabs

1. **Two people** (default)
2. **Family list** (2–10)
3. **Born on or before**
4. **Quick: birth years or ages**

### 3.2 Input guide diagram (above the inputs)

`AgeInputGuide.tsx`: a horizontal timeline.
- Two birthday flags: "1 First date of birth" and "2 Second date of birth" (optional name tags).
- A bracket between them showing the live "X y · Y m · Z d".
- An end marker "3 As-of date" (today by default).
- **Born-on-or-before tab:** the timeline runs backwards from "As of" by "4 Age needed (18 / 21 / 65 / custom)" to a highlighted "latest date of birth".
- **Family tab:** several flags, sorted.

### 3.3 Inputs (defaults = examples)

| Field | Default |
|---|---|
| Person A | Alex, 1990-03-15 |
| Person B | Sam, 1994-07-02 |
| As-of date | today |
| Born-on-or-before | age 21, as of today |
| Family | 3 example rows |
| Quick mode | birth years 1990, 1994 |

- Date pickers **and** typed dates, with the format shown.
- Names optional.

### 3.4 Engine (`src/lib/date-diff-engine.ts`, shared; rules §3)

```ts
order dates (older = A)
// Month-stepping (updated 2026-11-22, shared with Batch 8 #1): the plain "borrow" rule gives
// 2026-01-31 → 2026-03-01 = 0 m −2 d. Instead:
k = largest whole months such that addMonthsClamped(A, k) ≤ B   // clamp: Jan 31 + 1 month = Feb 28/29
y = floor(k / 12) ; m = k mod 12 ; d = utcDayNumber(B) − utcDayNumber(addMonthsClamped(A, k))
// 2026-01-31 → 2026-03-01 = 0 y 1 m 1 d ; both fixtures below are unchanged by this rule
totalDays = utcDayNumber(B) − utcDayNumber(A) ; weeks = floor(totalDays/7) + remainder days ; totalMonths = y*12 + m
latestDob(age, asOf) = asOf minus age years (Feb 29 → Feb 28 in non-leap target year)
feb29 rule: owner-chosen (Feb 28 or Mar 1) and labelled in the UI
family: sort ascending by DOB, pairwise gaps, spread = youngest − oldest
quick: year difference ± 1 note ("exact gap needs full dates")
```

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| 1990-03-15 vs 1994-07-02 | **4 years, 3 months, 17 days**; 1,570 days; Alex is older |
| Fixture (public dates from Omni's example): 1948-11-14 vs 1961-07-01 | **12 y 7 m 17 d** (Omni prints a 2-day error) |
| Born on or before, age 21, as of 2026-11-22 | **2005-11-22** |

### 3.5 Outputs

- **Headline:** the gap in Y/M/D.
- **Sentence:** "Alex is 4 years, 3 months and 17 days older than Sam (1,570 days)."
- Totals: months, weeks + days, days.
- Each person's age as of the chosen date.
- Family table (sorted, gap to the next person, overall spread).
- Born-on-or-before result as a date + a sentence.
- Copy, Share URL. Privacy line: "Dates stay in your browser."

### 3.6 Tests

- Month-end borrow (Jan 31 → Mar 1); leap years; Feb 29 both conventions.
- Same date; order swap.
- Born-on-or-before across a leap year.
- The fixtures above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Age Difference Calculator – Years, Months & Days` (48; 60 with the suffix: OK) |
| Meta | `Free age difference calculator. Enter two birth dates to see the exact gap in years, months and days, who is older, and the date someone turns 18 or 21.` (152) |
| H1 | `Age Difference Calculator: How Much Older Is One Person?` |
| BLUF | "Enter two dates of birth to see the exact age difference. Someone born on 15 March 1990 is 4 years, 3 months and 17 days older than someone born on 2 July 1994: 1,570 days in total." (engine) |
| ToolShell pills | `Years, months & days`, `Family list sorted by age`, `Born-on-or-before dates`, `Leap-year correct` |
| Links out | Final Grade (#14), Percentage Change (live), Metric Conversion (#20), Days Between Dates (Batch 8, when built) |
| Links in | Tools hub "Everyday" |

## 5. Content (~1,100–1,400 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the age difference calculator | 4 tabs | 100 |
| 2 | How age difference is calculated | The borrow rule, step by step with real dates (engine example) | 220 |
| 3 | Leap years and February 29 birthdays | The convention we use and why answers can differ by a day | 150 |
| 4 | Comparing ages in a whole family | Family tab example | 130 |
| 5 | What date of birth makes you 21 (or 18) today? | Born-on-or-before example; "date maths only, check local rules for ID or legal age" | 180 |
| 6 | Age gap from birth years only | Why it can be off by up to a year | 100 |
| 7 | *(Optional, owner decision)* Age gaps in relationships | The folk "half your age + 7" rule labelled as a heuristic; no unsourced statistics | 120 |
| 8 | FAQ | §6 | 350 |

## 6. FAQ (10, from the question bank + keywords)

1. How do I calculate the age difference between two people?
2. How much older is one person than another? (`how older is`)
3. What date of birth do you need to be 21 (or 18) today?
4. How are leap years and February 29 birthdays handled?
5. How many days or weeks apart are two birthdays?
6. Can I find the age gap from birth years only?
7. Does the order of the dates matter?
8. Can I compare more than two people, like siblings?
9. Why do some calculators give a different number of days? (30-day-month shortcuts)
10. *(If the owner approves the section)* What is the "half your age plus seven" rule?

## 7. Done when

- [ ] `date-diff-engine.ts` + tests (fixtures above); `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Feb 29 convention chosen by the owner and labelled; relationship section decided.
- [ ] Registrations + docs; `graphify update .`.
