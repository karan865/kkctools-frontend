# Age Difference Calculator — Competitor Analysis

> **Target page:** KKCTools `/age-difference-calculator/` (Batch 5, Tool #2 ✅)
> **Primary keyword:** `age difference calculator` — US 6,600 · **KD 0** (cluster: 3 keywords, 17,600 US vol)
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from a live web search for `age difference calculator` on 2026-11-14. `TODO(owner): pull Google top 10.`
> **Pages visited:** 6 read on 2026-11-14: Omni, DQYDJ, GIGAcalculator, Inch Calculator, 101 Planners, CalcPlanet.

---

## 0. How this was collected (read first)

- The SERP is **crowded with thin clones**. More than 30 results appeared, many on pages.dev or vercel subdomains, plus school and university sites (Jain University, Orchids, Vedantu).
- **Pages read:** the established players (Omni, DQYDJ, GIGAcalculator, Inch Calculator), a planner blog (101 Planners) and one thin "half your age + 7" page (CalcPlanet).
- **Second keyword mode:** `date of birth to be 21 today` (2,900), meaning "born on or before" a date. **None of the pages read offers this mode.** `TODO(owner)`: check whether the SERP for that phrase is age-verification or legal content. Our tool only does date maths and gives no legal advice.
- **Date arithmetic re-checked:** Omni's Charles/Diana example is off by two days (§4).
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/everyday-life/age-difference | Giant | Age Difference Calculator | 900–1,000 |
| 2 | dqydj.com/age-difference-calculator/ | Finance/calc site | Age Difference Calculator: Compute the Age Gap | ~250 |
| 3 | gigacalculator.com/calculators/age-difference-calculator.php | Calc site | Age Difference Calculator (Age Gap Calculator) | ~1,000 |
| 4 | inchcalculator.com/age-difference-calculator/ | Calc site | Age Difference Calculator | ~450 method |
| 5 | 101planners.com/age-difference-calculator/ | Planner blog | Age Difference Calculator: Exact Gap Between Two Birthdays | ~800 |
| 6 | calcplanet.com/daily-life/age-difference-calculator/ | Thin calc | Age Difference Calculator – Age Gap Between Two People | ~80 |

**What this tells us:**
- **Every page compares exactly two people.** None supports a family list sorted by age, which the keyword file requires.
- **No page offers the "born on or before" mode** for a chosen age (18/21/65), even though the keyword has 2,900 searches.
- **Leap years and month-end borrowing are barely explained.** Omni's manual method assumes 30-day months. Inch Calculator's day-borrow rule is vague. DQYDJ explains its counting rule but gives no example.
- **Relationship content** ("half your age + 7", census age gaps) appears on GIGAcalculator, 101 Planners and CalcPlanet. This is the `how older is` / dating intent.
  - GIGAcalculator's census summary has an error: the table says 1.7 %, the text says 1 %.

---

## 2. Feature matrix: calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni | DQYDJ | GIGA | Inch | 101 Planners | CalcPlanet |
|---|---|---|---|---|---|---|
| Two birth dates → years, months, days | ✅ | ✅ | ✅ | ✅ | ✅ | ? |
| Birth years only / ages only modes | ✅ years | ❌ | ✅ both | ✅ both | ❌ | ❌ |
| Total days / weeks / months | ⚠️ unit switch (hours) | ❌ | ✅ months, weeks, days | ❌ | ✅ total days (weeks in FAQ) | ❌ |
| Who is older (named) | ⚠️ implied | ⚠️ each age shown | ❌ | ❌ | ✅ | ❌ |
| Each person's current age | ❌ | ✅ | ❌ | ❌ | ? | ❌ |
| **3+ people sorted by age** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **"Born on or before" for age N today** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Age difference as of a chosen date | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Leap-year handling stated | ⚠️ (manual ignores) | ✅ | ⚠️ "requires adjustment" | ❌ | ⚠️ claimed | ❌ |
| Feb 29 birthdays | ❌ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Counting rule explained (start/end day) | ❌ | ✅ | ❌ | ⚠️ | ⚠️ borrowing | ❌ |
| Half-your-age-plus-seven | ❌ | ❌ | ✅ (both bounds) | ❌ | ✅ (hedged) | ✅ (unsourced) |
| "Today" button | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Share result | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix: content and trust

| Item | Omni | DQYDJ | GIGA | Inch | 101 Planners | CalcPlanet |
|---|---|---|---|---|---|---|
| Manual method | ⚠️ 30-day months, steps muddled | ⚠️ counting rule | ⚠️ | ✅ 4 steps (vague borrow) | ✅ borrowing | ❌ |
| Worked example with real dates | ⚠️ (Charles/Diana **off by 2 days**) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Age-gap statistics / research | ❌ | ❌ | ✅ US census 2021 (one figure wrong) + Buunk 2001 | ❌ | ❌ | ❌ |
| Rule of 7 sourced / hedged | n/a | n/a | ⚠️ | n/a | ✅ hedged | ❌ |
| FAQ count | 4 | 0 (2 Q&A headings) | 0 | 0 | 6 (repeats body) | 1 |
| Named author | ✅ + reviewer | ✅ PK | ✅ G. Georgiev | ✅ Joe Sexton | ✅ Nicole | ❌ |
| Date | ❌ | ❌ | ✅ Feb 2026 | ❌ | ✅ Jun 2026 | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Omni — Age Difference Calculator (Rita Rain; reviewed by Dominik Czernia PhD)
- **Modes:** from dates of birth or from years of birth. Output can be shown in different units.
- **Examples checked:**
  - **Charles (14 Nov 1948) and Diana (1 Jul 1961):** the page says 12 y 7 m **15 d**. The correct gap is 12 y 7 m **17 d**. ❌
  - 03/05/2001 vs 17/09/1978 = 22 y 7 m 16 d ✔. The steps shown use the wrong dates.
  - 01/01/1990 vs 30/06/1995 = 5 y 5 m 29 d ✔.
- **FAQs (4):** age difference from ages, from birth years, a date-pair example, and a numeric pair.
- **Weak points:**
  - The manual method assumes 30-day months and ignores leap years.
  - The DD/MM vs MM/DD format is ambiguous.
  - Two people only.

### 2. DQYDJ — Age Difference Calculator (PK)
- **Inputs:** two birth dates (order doesn't matter), a Today button, live recalculation.
- **Outputs:** the gap in years, months and days, plus each person's current age.
- **Counting rule:** counting starts on the older person's birthday. Leap days are included.
- **Weak points:**
  - No totals, no example, no date.
  - The "within one day" wording is ambiguous.
  - Thin page (about 250 words).

### 3. GIGAcalculator — Age Difference Calculator (Georgi Georgiev, Feb 2026)
- **Modes:** ages, dates of birth, years of birth. Outputs years plus months, weeks and days.
- **Content:**
  - Rule of seven: age 30 gives a minimum of 22 and a maximum of 46 ✔.
  - US census 2021 table of spouse age gaps.
  - Buunk et al. 2001 study.
- **Error:** the text says wives 10+ years older make up "1 %", but the table rows sum to 1.7 %.
- **Weak points:**
  - Leap-year and month-end rules aren't documented.
  - No worked example with dates.
  - No FAQ.

### 4. Inch Calculator — Age Difference Calculator (Joe Sexton)
- **Modes:** birth dates, birth years, ages.
- **Method:** a 4-step borrow method. It doesn't say which month's length to use when borrowing.
- **Weak points:**
  - No example, no FAQ, no date.
  - Three result blocks without labels.

### 5. 101 Planners — Age Difference Calculator (Nicole, updated Jun 2026)
- **Outputs (as described):** years, months and days, total days, and who is older.
- **Content:** a hedged "half your age + 7" section. The reverse formula is mentioned but not given.
- **FAQs (6):** these largely repeat the body.
- **Weak points:** no worked example with dates; leap-day handling is claimed but not shown.

### 6. CalcPlanet — Age Difference Calculator
- About 80 words. Gives the rule "minimum partner = age ÷ 2 + 7" as a social norm with no source. One FAQ.
- No inputs or outputs are described.

---

## 5. Patterns

- **Correct maths (calendar, not 30-day months):**
  1. Order the dates (older = A, younger = B). Years = B.year − A.year. Months = B.month − A.month. Days = B.day − A.day.
  2. If days < 0: borrow 1 month and add the number of days in **the month before B's month**.
  3. If months < 0: borrow 1 year and add 12.
  4. Total days = date difference in days, computed in UTC date-only so there are no time-zone shifts.
- **Feb 29 birthdays:** state the convention used. In non-leap years we treat the birthday as Feb 28 or Mar 1, and the choice is owner-approved and labelled. `TODO(owner)`: pick the convention.
- **"Born on or before":** latest DOB to be N years old on date D = D minus N years. If D is Feb 29 and the target year is not a leap year, use Feb 28.
- **Rule of 7 (social heuristic only):** minimum = age ÷ 2 + 7; maximum = (age − 7) × 2. Label it as a folk rule with no scientific basis, or leave it out. `TODO(owner)`: decide.

| Section | Pages (of 6) |
|---|:---:|
| Y/M/D gap | 5 |
| Alt modes (years/ages) | 3 |
| Totals | 2 |
| Who is older | 1 |
| Leap rule explained | 1 |
| Example with dates | 1 (wrong) |
| 3+ people | **0** |
| Born on or before | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to: age difference calculator, date of birth to be 21 today, how older is.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do I calculate the age difference between two people? | Omni, Inch, 101P, GIGA |
| 2 | ★ How do I find the age gap from birth years only? | Omni, GIGA, Inch |
| 3 | ★ What is the "half your age plus seven" rule? | GIGA, 101P, CalcPlanet |
| 4 | How much older is person A than person B? | `how older is` |
| 5 | What date of birth do you need to be 21 (or 18) today? | `date of birth to be 21 today` |
| 6 | How are leap years and Feb 29 birthdays handled? | DQYDJ, GIGA |
| 7 | How many days/weeks apart are two birthdays? | 101P, GIGA |
| 8 | Does the order of dates matter? | DQYDJ, GIGA |
| 9 | Can I compare more than two people (siblings, family)? | — |
| 10 | What is a typical age gap for couples? | GIGA (census) — cite only official data |

---

## 7. Gaps nobody fills — our opportunities

1. **Multi-person list:** add 2–10 people (names optional), sort by age, and show the gap between each pair and the oldest-to-youngest spread.
2. **"Born on or before" mode:** the latest DOB to be 18, 21, 65 or any custom age today or on a chosen date (2,900 keyword).
3. **"As of" date:** each person's age on any date, not only today.
4. **Correct calendar maths** with a worked example using real dates. Explain the borrow rule and Feb 29.
5. **All outputs at once:** Y/M/D, total months, weeks, days, and a plain sentence: "Alex is 3 years, 2 months, 5 days older."
6. **No time-zone shift:** dates are handled as date-only values.
7. **Optional relationship section,** clearly labelled as a heuristic, owner decision. If statistics are used, take them only from official sources (US Census) with a date.
8. **Privacy note:** nothing leaves the browser.

---

## 8. Blueprint for the KKCTools Age Difference Calculator

### 8.1 SEO

- **URL:** `/age-difference-calculator/`
- **Title:** Age Difference Calculator – Years, Months & Days
- **H1:** Age Difference Calculator: How Much Older Is One Person?
- **Meta:** as in the keyword file (152 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | 2–10 people (name optional, DOB); or birth years / ages quick mode |
| Outputs | Gap Y/M/D, total months/weeks/days, who is older (sentence), each age as of a chosen date |
| Born-on-or-before | Age N (18/21/65/custom) + as-of date → latest DOB |
| Family view | Sorted list, pairwise gaps |
| Rules | Date-only UTC maths, Feb 29 convention labelled |
| UX | Date picker and typed dates (format shown), share URL, no network |

### 8.3 Content outline (≈ 900–1,200 words, original)

1. Intro (primary keyword)
2. How to use
3. How age difference is calculated (borrow rule), with a worked example using real dates
4. Leap years and Feb 29 birthdays
5. Comparing a whole family
6. What date of birth makes someone 18 or 21 today
7. (Optional) Age gaps in relationships: heuristic note
8. FAQ (8–10)
9. Related tools: Days Between Dates (Batch 8), Date From Today (Batch 8), Age calculator (future)

### 8.4 Quality checks

- Unit tests:
  - borrow cases (month-end, Jan 31 → Mar 1)
  - leap years and Feb 29
  - same date
  - order swap
  - born-on-or-before across leap years
  - Charles/Diana fixture = 12 y 7 m 17 d
- No competitor wording copied. `npm run check:no-network` passes.
- `TODO(owner)`:
  - pull Google top 10
  - choose the Feb 29 convention
  - decide on the rule-of-7 section
