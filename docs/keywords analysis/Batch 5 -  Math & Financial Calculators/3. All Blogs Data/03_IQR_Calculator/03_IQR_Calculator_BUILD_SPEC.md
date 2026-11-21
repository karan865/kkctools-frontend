# IQR Calculator — Build Spec

> **URL:** `/iqr-calculator/` · Batch 5 · Tier 1 · rank chance ✅ · **Build order 3**
> **Read first:** `../00_BATCH5_BUILD_RULES.md` (§3 stats-engine)
> **Inputs used:** `03_IQR_Calculator_Competitor_Analysis.md` (5 pages read + Scribbr blocked, 2026-11-14), keyword file §2 #3
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Keywords:**

| Keyword | US vol | KD | Note |
|---|---:|---:|---|
| `iqr calculator` | 2,400 | **0** | exact tool term |
| `work out average calculator` | 1,000 | 0 | the summary also shows the mean |

**Who ranks:**
- Omni;
- **Pearson** (the benchmark: method selector, box plot, steps, all-method comparison);
- Calculate.co.nz;
- Inch Calculator (PhD reviewer);
- Social Science Statistics;
- Scribbr (likely top 3, blocked for us). `TODO(owner)`: check it in a browser.

**The hook:** competitors **disagree on quartile values** because they use different methods.
- **Omni contradicts itself:** it describes "median of halves" but computes with n+1 interpolation. For 5, 7, 8, 9 those give IQR 2.5 vs 3.25.
- Only Pearson and SocSciStats let users pick the method, and **no page explains why answers differ**.
- That H2 is our biggest content edge.

**Full summary in one view:** no page shows the five-number summary + mean + fences + outlier list + a theme-aware box plot + a method toggle together.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | iqr calculator | 2,400 | 0 | Title, H1, first sentence, tool heading |
| Secondary | work out average calculator | 1,000 | 0 | Summary card shows the mean; FAQ "How do I work out the average?" |
| Natural | interquartile range · how to find IQR · quartile calculator · Q1 Q3 · box plot · outliers | — | — | H2s and FAQ (`TODO(owner)`: pull volumes) |

## 2. Our edge (5 competitors checked)

| Feature | Competitors with it |
|---|---|
| Full summary (count, sum, mean, min, Q1, median, Q3, max, range, IQR) | IQR 5/5 · Q1–Q3 4/5 · **mean 0/5** |
| Inner + outer fences, outliers listed (mild vs extreme) | fences 2/5 · list 1/5 |
| Theme-aware SVG box plot (whiskers at the last values inside the fences; outliers as dots) | 1/5 |
| **4 named methods** + a "compare all" table + a plain explanation of why they differ | choice 2/5 · explanation 1/5 |
| Software labels (Excel INC/EXC, Google Sheets, R type 6/7, TI-84). **Owner/builder-verified** against official docs before publishing | 0 |
| Steps: sorted list, quartile positions highlighted, interpolation arithmetic | 2/5 |
| Robust paste (commas, spaces, tabs, new lines, spreadsheet columns) + clear errors | partial |
| Copy as text/CSV; share URL (small data only) | rare |

## 3. Calculator spec

### 3.1 Tabs

1. **IQR & box plot** (default)
2. **Compare quartile methods**

### 3.2 Input guide diagram (above the inputs)

`IqrInputGuide.tsx`: a horizontal box-plot sketch.
- "1 Your data (paste)" feeds a sorted dot strip.
- Under it, the box with Q1, median and Q3 marked; the box width is labelled "IQR = Q3 − Q1".
- Whiskers run to the "1.5 × IQR fences"; dots beyond them are labelled "outliers".
- A badge "2 Quartile method" switches the marked positions live.

### 3.3 Inputs

| Field | Default / notes |
|---|---|
| Data | `1, 3, 5, 7, 9, 11, 13, 15` (example); up to ~10,000 values |
| Method | **Tukey (median excluded)** = TI-84/textbook style. `TODO(owner)`: confirm the default (or Excel INC) |
| Fence multiplier | 1.5 (outer fences 3.0, optional) |
| Decimals | 2 |

**The four methods:**

| Method | Rule | Labelled as matching (after verification) |
|---|---|---|
| Tukey, median excluded | Q1 = median of the lower half (odd n: median left out) | TI-83/84, many US textbooks |
| Tukey, median included | odd n: the median is in both halves | some textbooks |
| Exclusive interpolation | rank = p(n+1) | Excel QUARTILE.EXC, R type 6 |
| Inclusive interpolation | rank = p(n−1)+1 | Excel QUARTILE.INC, Google Sheets QUARTILE, R type 7 (default) |

### 3.4 Engine (`src/lib/stats-engine.ts`, shared)

```ts
parseNumbers(text) → numbers[] (any separator; report rejected tokens)
sort ; quartiles(sorted, method) ; iqr = q3 − q1 ; range = max − min
fences: lo = q1 − k·iqr, hi = q3 + k·iqr ; outer with 3·iqr ; outliers = values outside (mild / extreme)
whiskers = most extreme values inside the fences
mean, sum, count ; compareAll(sorted) → table of q1/q3/iqr per method
```

**Worked examples (checked 2026-11-22):**

| Data / method | Q1 | Q3 | IQR |
|---|---:|---:|---:|
| 1,3,5,7,9,11,13,15 · Tukey (even n: halves) | 4 | 12 | **8** |
| same · inclusive (Excel INC) | 4.5 | 11.5 | 7 |
| same · exclusive (Excel EXC) | 3.5 | 12.5 | 9 |
| 5,7,8,9 · Tukey | 6 | 8.5 | **2.5** |
| 5,7,8,9 · exclusive n+1 | 5.5 | 8.75 | **3.25** |
| 5,7,8,9 · inclusive | 6.5 | 8.25 | 1.75 |

Mean of 1…15 (odd numbers) = 8.

`TODO(owner)`: generate R/Excel outputs as fixtures for these.

### 3.5 Outputs

- **Summary card:** n, sum, mean, min, Q1, median, Q3, max, range, IQR, fences, outliers.
- **Sentence:** "The middle half of your data spans 8 (Q1 = 4, Q3 = 12); no values fall outside the 1.5 × IQR fences of −8 and 24."
- Box plot (SVG, light/dark).
- **Steps:** the sorted list with the halves and positions highlighted.
- **Compare tab:** the 4-method table + a one-line "why they differ" note.
- Copy text/CSV; Share URL.

### 3.6 Tests

- Each method on odd and even n; ties; constant data (IQR 0); n < 4 messages.
- Fences and outliers (mild/extreme); whisker placement.
- Parsing with mixed separators and junk tokens.
- The table above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `IQR Calculator – Quartiles, Outliers & Box Plot` (47; 59 with the suffix: OK) |
| Meta | `Free IQR calculator. Paste a data set to get Q1, median, Q3, the interquartile range, outlier fences and a box plot, with every step shown.` (139) |
| H1 | `IQR Calculator: Interquartile Range, Quartiles and Outliers` |
| BLUF | "IQR = Q3 − Q1, the spread of the middle half of your data. For 1, 3, 5, 7, 9, 11, 13, 15 the lower half's median is 4 and the upper half's is 12, so the IQR is 8. Other quartile methods can give slightly different answers, and the calculator shows all of them." (engine) |
| ToolShell pills | `Q1, median, Q3 & IQR`, `Outlier fences`, `Box plot`, `Compare quartile methods` |
| Links out | Standard Deviation (#11), T-Test (#13), Final Grade (#14), Ratio (#1) |
| Links in | Standard Deviation, T-Test, Binomial, Tools hub "Math & Finance → Stats" |

## 5. Content (~1,400–1,700 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the IQR calculator | paste, method, outputs | 100 |
| 2 | What the interquartile range tells you | spread of the middle 50%, robust to outliers | 150 |
| 3 | How to find Q1, Q3 and the IQR | step-by-step, odd and even n examples | 250 |
| 4 | Why calculators give different quartiles | the 4-method table + an example where answers differ (the key H2) | 250 |
| 5 | Finding outliers with the 1.5 × IQR rule | fences example; mild vs extreme | 150 |
| 6 | How to read a box plot | whiskers, outliers | 130 |
| 7 | IQR vs range vs standard deviation | when to use each; link #11 | 120 |
| 8 | Working out the average (mean) too | `work out average calculator` | 80 |
| 9 | FAQ | §6 | 380 |

## 6. FAQ (10, from the question bank)

1. What is the interquartile range?
2. How do you calculate the IQR step by step?
3. How do you find outliers with the IQR (1.5 rule)?
4. Range vs IQR: what's the difference?
5. Why do different calculators give different quartiles?
6. Which method do Excel, Google Sheets, R and a TI-84 use? (verified labels only)
7. How do I read a box plot, and where do the whiskers end?
8. What changes with an even vs odd number of values?
9. How do I work out the average (mean) of a data set?
10. Can the IQR be zero or negative?

## 7. Done when

- [ ] `stats-engine.ts` quartile functions + tests (fixtures above + R/Excel); `npm run verify` passes.
- [ ] InputGuide above the inputs; box plot theme-aware; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Default method chosen by the owner; software labels verified or removed.
- [ ] Registrations + docs; `graphify update .`.
