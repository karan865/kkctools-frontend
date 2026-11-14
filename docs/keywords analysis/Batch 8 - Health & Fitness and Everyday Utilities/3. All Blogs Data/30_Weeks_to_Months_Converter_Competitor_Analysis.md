# Weeks to Months Converter — Competitor Analysis

> **Target page:** KKCTools `/weeks-to-months/` (Batch 8, Tool #30 🟡, Tier 3)
> **Primary keyword:** `16 weeks in months` — US 8,100 · KD 18 · CPC $1.10.
> - Cluster: 8 keywords, 73,100 US searches, all KD 18–29.
> - Long tail: `how many days is 6 months`, `how many months is 16 weeks`, `how many weeks in 3 months`, `26 weeks in months`, `how long is 90 days`, `how many days in 6 weeks`.
> - Many are **pregnancy-week questions**.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `16 weeks in months converter`.
> - **The SERP is full of parasite and spam pages on unrelated brand or charity domains:** db.partycity.com, db.raceface.com, warpspeed.level1techs.com, helix.nodebb.com, calculator.icnareliefcanada.ca, m.fightcancer.org, kig.pages.dev.
>   - One of these (db.partycity.com) **no longer resolves** (DNS error).
>   - These are recorded as SERP evidence, not audited as competitors. This weak SERP is an opportunity.
> - Other results: convertilo, timeduration, conversionvibes (**403**), worksheetgenius (**403**).
> - `TODO(owner): pull Google top 10 for "16 weeks in months", "26 weeks in months" and "how many days is 6 months".`
> **Pages visited (2026-11-14):** 3 read: Inch Calculator (weeks to months), Measure Atlas (16 weeks), CalculatorSoup (time conversion). Blocked or unavailable: conversionvibes (403), worksheetgenius (403), db.partycity.com (DNS).

---

## 0. How this was collected (read first)

- **Who ranks:**
  - **Spam/parasite "comprehensive guide" pages** on hijacked subdomains.
  - **Per-number converter farms:** Measure Atlas, conversionvibes, worksheetgenius, convertilo, timeduration (e.g. "16,175 weeks in months").
  - **Calculator sites:** Inch, CalculatorSoup.
- **The core maths (keyword file: show the 30.44-day rule):**
  - **Average Gregorian month** = 365.2425 ÷ 12 = **30.436875 days** = 4.348125 weeks.
  - So 1 week = 7 ÷ 30.436875 = **0.229984 months**.
  - **16 weeks** = 112 days = **3.68 months** (≈ 3 months + 20.7 days on the average month).
  - **26 weeks** = 182 days = 5.98 months.
  - **40 weeks** = 280 days = 9.20 months.
- **Three month definitions are in use.** Sites rarely say which:
  1. **Gregorian average:** 30.436875 d (Measure Atlas, and Inch implicitly).
  2. **Julian / 365.25 average:** 30.4375 d (often called "30.44"). It gives 0.229979 per week, which is negligibly different.
  3. **365 ÷ 12:** 30.4167 d (CalculatorSoup, which ignores leap years).
  - **Rule of thumb, "divide by 4":** 16 weeks = 4 months. This is **wrong by about 8%**, but spam pages state it as fact.
  - The web search also surfaced a page claiming **16 weeks = 4.32 months** using 30.44 days. That is an arithmetic error: 112 ÷ 30.44 = 3.68.
- **Calendar months are different from average months.**
  - "16 weeks from 1 March" is a real date with a real number of calendar months and days.
  - **No audited competitor offers this.** We will, by reusing the date engine from #1 and #2.
- **The pregnancy context needs care (YMYL-adjacent):**
  - Pregnancy is commonly counted as 40 weeks from the first day of the last menstrual period.
  - Trimester boundaries are often given as weeks 1–13, 14–27, and 28–40+.
  - "9 months" is a convention (40 weeks ≈ 9.2 average months).
  - `TODO(owner)`: cite ACOG or NHS for the trimester boundaries. Make no medical claims. Link to a due-date tool only if one is built.
- **Errors found:**
  - **Inch:**
    - The factor 0.229984 is unexplained.
    - Its table stops at 40 weeks.
    - Tiny rounding slips (3 wk = 0.689953 vs 0.689952).
    - The "days" link points to the hours page.
    - No FAQ.
  - **Measure Atlas:**
    - Placeholder "Reserved for a future in-article ad unit" text is live.
    - "Common abbreviation: weeks".
    - Duplicated nearby-value links.
    - An unrelated "cooking" FAQ answer.
  - **CalculatorSoup:**
    - Its month is 30.416 d, stated as "365 ÷ 12 = 30.416" (truncated).
    - Its minutes→hours shortcut "0.016" introduces a 4% error.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | inchcalculator.com/convert/week-to-month/ | Calc site | Weeks to Months Converter (wk to mo) | ~400 + table |
| 2 | measureatlas.pages.dev/time/weeks/to-months/16/ | Per-number converter farm | 16 Weeks to Months Converter | ~300 main |
| 3 | calculatorsoup.com/calculators/conversions/time.php | Calc site (general time) | Time Conversion Calculator | 1,200–1,400 incl. navigation |
| — | db.partycity.com, db.raceface.com, level1techs, nodebb, icnareliefcanada, fightcancer.org | **Parasite spam** | "How Many Months in 16 Weeks? A Comprehensive Guide" etc. | not audited |
| — | conversionvibes.com, worksheetgenius.com | Per-number farms | 16 Weeks to Months… | **403** |

**What this tells us:**
- **Inch** has the exact factor and a 1–40 week table (16 / 26 / 40 weeks ✔), plus an author.
  - **Missing:** the basis of the factor, weeks 41–52, an FAQ, and anything on pregnancy.
- **Measure Atlas** has the correct Gregorian factor and an 8-row table.
  - **Weak points:** a per-number template, a live ad placeholder, and duplicated links.
- **CalculatorSoup** is a generic converter using a 365-day year and doesn't mention calendar variation.
- **Parasite spam ranks.** The bar for quality is low, but the KD (18–29) reflects page counts, not quality.
- **No page offers all of these:**
  1. weeks ↔ months ↔ days, both ways, with **the month definition stated and switchable** (average Gregorian / 30 days / 4 weeks), and the difference shown
  2. **"X months + Y weeks + Z days"** breakdowns, not just decimals
  3. a **calendar mode**: start date + N weeks → end date, plus the exact calendar months and days between them
  4. a **1–52 week table** (and 1–24 months → weeks/days) generated by our code
  5. direct answers for the cluster questions (16, 26 and 40 weeks; 6 months in days; 3 months in weeks; 90 days)
  6. a careful, cited pregnancy section (trimesters by week)

---

## 2. Feature matrix — tool

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Inch | Measure Atlas | CalculatorSoup |
|---|---|---|---|
| Weeks → months | ✅ | ✅ (fixed 16) | ✅ |
| Months → weeks / days | ⚠️ (separate) | ⚠️ (links) | ✅ |
| Days ↔ weeks ↔ months | ⚠️ | ❌ | ✅ |
| Month definition stated | ❌ | ⚠️ (factor shown) | ✅ (30.416) |
| Switchable month definition | ❌ | ❌ | ❌ |
| Months + weeks + days breakdown | ❌ | ❌ | ❌ |
| Calendar mode (from a start date) | ❌ | ❌ | ❌ |
| Table 1–52 weeks | ⚠️ (1–40) | ⚠️ (12–19) | ❌ |
| Pregnancy section | ❌ | ⚠️ (mention) | ❌ |
| FAQ | ❌ | ✅ (one off-topic) | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Inch | Measure Atlas | CalculatorSoup |
|---|---|---|---|
| Factor correct | ✅ | ✅ | ⚠️ (365-day basis) |
| Factor explained | ❌ | ⚠️ | ✅ (truncated) |
| Calendar variation explained | ⚠️ (28–31 d) | ❌ | ❌ |
| "Divide by 4" myth addressed | ❌ | ❌ | ❌ |
| Errors | rounding, wrong link | ad placeholder, labels | truncation, 0.016 shortcut |
| Author / date | ✅ / ❌ | ❌ | ✅ / ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Inch Calculator: Weeks to Months (Joe Sexton)
- **Features:** a live result, formula, worked example, a 1–40 week table, share/cite.
- **Checked ✔:** 16 wk = 3.6797; 26 wk = 5.9796; 40 wk = 9.1994.
- **Errors:**
  - The factor basis isn't stated.
  - Tiny rounding slips.
  - The "days" link goes to hours.
  - Inconsistent precision.
- **Weak points:** no weeks 41–52, no FAQ, no calendar mode, no pregnancy context.

### 2. Measure Atlas: 16 Weeks to Months
- **Features:** a fixed answer (3.6797 / 3.68 ✔), an 8-row table, nearby-value links, an FAQ.
- **Errors:**
  - **A live "Reserved for a future in-article ad unit" placeholder.**
  - "Common abbreviation: weeks".
  - Duplicate links.
  - The "Quick answer" heading comes after the answer.
  - An off-topic "cooking" FAQ.
- **Model:** a per-number page farm, which the keyword file says to avoid.

### 3. CalculatorSoup: Time Conversion
- **Features:** a general unit converter (ns → millennium) with a factor table.
- **Errors:**
  - A month of 30.416 d (truncated 365/12), ignoring leap years.
  - The 0.016 minutes→hours shortcut (≈ 4% error).
  - A missing microsecond row.
  - An "For AI Systems" promotional block.

### Spam / parasite pages (not audited)
- Hijacked subdomains of retail, cycling, tech-forum and charity sites host "comprehensive guide" articles.
- Many give the "÷ 4 = 4 months" answer.
- `TODO(owner)`: monitor them. They may vanish (one already fails DNS), which would open up the SERP.

---

## 5. Patterns

**Formulas (default: Gregorian average)**
- months = weeks × 7 ÷ 30.436875.
- weeks = months × 30.436875 ÷ 7.
- days = weeks × 7.
- **Breakdown:** total days → whole months (× 30.436875) → remaining days → weeks + days.
  - Example: 16 wk = 112 d → 3 months (91.31 d) + 20.69 d ≈ **3 months, 2 weeks and 6.7 days** (average months).
- **Alternative definitions (toggle):**
  - 30-day month: 16 wk = 3.73 mo.
  - 4-week month: 16 wk = 4 mo, labelled "rule of thumb, not exact".
  - Julian 30.4375: same as the default to 4 dp.

**Calendar mode (reuses the date engine from #1/#2)**
- Inputs: start date + N weeks (or days).
- Outputs: end date; exact calendar difference (e.g. "3 months and 21 days"); weekday.
- Example: 1 Mar 2027 + 16 weeks = 21 Jun 2027 = **3 months and 20 days** (calendar). The average-month figure is 3.68.
- `TODO(owner)`: confirm the example in the unit test.

**Quick answers (our arithmetic)**

| Question | Answer |
|---|---|
| 16 weeks in months | 3.68 average months (112 days) |
| 26 weeks in months | 5.98 average months (182 days); often called "6 months" |
| 40 weeks in months | 9.20 average months (280 days) |
| How many days is 6 months | 182.6 days on average (181–184 calendar days depending on the months) |
| How many weeks in 3 months | 13.04 weeks on average (91.3 days) |
| How long is 90 days | 12 weeks 6 days ≈ 2.96 average months |
| How many days in 6 weeks | 42 days |

**Tables:** 1–52 weeks → months (2 dp) + days + "m / w / d". 1–24 months → weeks + days.

**Pregnancy section (cited, neutral)**
- A weeks → month-of-pregnancy note, trimester boundaries (cited), and "talk to your midwife or doctor".
- No due-date calculation unless a tool is built.

**Coverage across the audited pages**

| Section | Pages (of 3) |
|---|:---:|
| Month definition explained | 1–2 |
| Switchable definition | **0** |
| m/w/d breakdown | **0** |
| Calendar mode | **0** |
| 1–52 table | **0** (max 1–40) |
| Pregnancy context | **0–1** |
| "÷ 4" myth addressed | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How many months is 16 weeks? | `16 weeks in months`, `how many months is 16 weeks` |
| 2 | ★ How many months is 26 weeks? | `26 weeks in months` |
| 3 | ★ How many days is 6 months? | `how many days is 6 months` |
| 4 | ★ How many weeks are in 3 months? | `how many weeks in 3 months` |
| 5 | How long is 90 days? | `how long is 90 days` |
| 6 | How many days are in 6 weeks? | `how many days in 6 weeks` |
| 7 | Why isn't a month exactly 4 weeks? | gap (÷ 4 myth) |
| 8 | How many weeks pregnant is 4 months? | pregnancy intent (cited) |
| 9 | What is the average length of a month? | Inch, Measure Atlas |
| 10 | What date is 16 weeks from today? | gap (calendar mode; link #2) |

---

## 7. Gaps nobody fills — our opportunities

1. **The month definition stated and switchable**, with the "÷ 4" myth explained.
2. **Months + weeks + days breakdowns**, not just decimals.
3. **Calendar mode** (start date → exact calendar months and days). Nobody offers this.
4. **A full 1–52 week table**, plus months → weeks.
5. **Direct answers to every cluster question** on one page. No per-number pages.
6. **A careful, cited pregnancy section.**
7. **Quality versus spam.** The SERP has hijacked parasite pages; a clean, correct page should be able to compete.
8. **Links:** Days Between Dates (#1), Days From Today (#2), Days Until Countdown (#3), Time Duration (#4), Age Difference (Batch 5 #2).

---

## 8. Blueprint for the KKCTools Weeks to Months Converter

### 8.1 SEO

- **URL:** `/weeks-to-months/`
- **Title:** Weeks to Months Converter – How Many Months?
- **H1:** Weeks to Months: How Many Months Is 16, 26 or 40 Weeks?
- **Meta:** as in the keyword file (135 chars).
- **H2s:**
  - "16 weeks in months"
  - "26 and 40 weeks in months"
  - "How many days is 6 months?"
  - "Weeks to months chart (1–52)"
  - "Pregnancy weeks and months"
- **Schema:** `WebApplication` + `FAQPage`.

### 8.2 Tool spec

| Area | Spec |
|---|---|
| Inputs | Value + unit (days / weeks / months); month definition (average / 30-day / 4-week); optional start date |
| Outputs | Converted value (2 dp), m/w/d breakdown, days total; calendar end date + exact calendar months/days (if date given) |
| Tables | 1–52 weeks; 1–24 months |
| UX | Swap, copy, share URL, no network |

### 8.3 Content outline (≈ 700–1,000 words, original)

1. Intro and converter
2. How to convert weeks to months (formula, average month explained)
3. Why a month isn't 4 weeks
4. Quick answers (16, 26, 40 weeks; 6 months; 3 months; 90 days)
5. Calendar months vs average months (with an example)
6. Chart (1–52 weeks)
7. Pregnancy weeks and months (cited)
8. FAQ (10)
9. Related tools

### 8.4 Quality checks

- **Unit tests:**
  - The factor (0.229984).
  - All quick answers.
  - The m/w/d breakdown.
  - Calendar mode against date-engine fixtures, including month-end and leap-year starts.
  - Switching definitions.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - Pull Google top 10.
  - Cite ACOG/NHS for the trimesters.
  - Review conversionvibes and worksheetgenius manually (403).
