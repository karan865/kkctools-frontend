# Reading & Speaking Time Calculator — Competitor Analysis

> **Target page:** KKCTools `/reading-time-calculator/` (Batch 6, Tool #7 🟡)
> **Primary keyword:** `reading time calculation` — US 2,400 · KD 26 · rising (cluster: 13 keywords, 10,490 US vol). The cluster includes speech-length rows such as `how many words for a 4 minute speech` and "how long is X words" rows such as `how long is 500 words` (2,400).
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 6. Competitors come from a live web search on 2026-11-14 for `reading time calculator words per minute speech time calculator`. `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 4 read (Omni speaking time, MiniWebtool speaking time, Calculate.co.nz reading time, Content Harmony reading time). BigVU words-to-minutes returned 404.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Calculator sites: Omni (speaking time, words per minute, reading speed), MiniWebtool, Calculate.co.nz, CharacterCalculator, Rows.
  - Content and SEO tools: Content Harmony, Originality.ai.
  - Teleprompter and voice brands: BigVU, voices.com.
  - Language sites: 7ESL.
  - Many AI-startup "tools" pages: sozai, flowshorts, paperguide, collabpals, rapidtoolset, howmanywords.
- **Keyword-file rule:** the default words-per-minute (wpm) figures **must cite a source**, and users must be able to edit them.
  - No page we read cites a source.
  - Content Harmony says "research-backed" but names no study.
  - The usual references are **Brysbaert (2019)**, a meta-analysis that puts silent reading at about 238 wpm for non-fiction and 260 wpm for fiction, and published speech-rate norms. `TODO(owner)`: confirm the citations and their exact figures.
- **The search snippets disagree on figures:**
  - Silent reading: 200–250, 230, 238, 225 and 250–300 wpm.
  - Speaking: 130, 140, and 110/140/170 wpm.
  - We show the range and explain why.
- **Intent note:** `speech timer` (1,000) is partly people who want a stopwatch. The keyword file asks for a **simple practice timer**.
- Arithmetic was re-checked. No competitor text was copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | omnicalculator.com/everyday-life/speaking-time | Giant | Speaking Time Calculator | ~850 |
| 2 | miniwebtool.com/speaking-time-calculator/ | Utility site | Speaking Time Calculator | ~900 |
| 3 | calculate.co.nz/reading-time-calculator.php | NZ calc site | Reading Time Calculator NZ | 450–500 |
| 4 | contentharmony.com/tools/reading-time-calculator/ | SEO tool vendor | Reading Time Calculator | ~1,000 |
| — | bigvu.tv/teleprompter/convert-words-to-minutes… | Teleprompter brand | Words to Minutes | **404** |

**What this tells us:**
- **Speaking time:**
  - **Omni** offers 5 pace presets (100/120/140/160/180 wpm) plus custom, and a **reverse mode** (minutes → words). Its tables for words → time and minutes → words are both correct.
  - **MiniWebtool** offers pasted script input, 3 paces (110/140/170), a **pause buffer** (0–20 %), a suggested slide count, and a timing map per paragraph. It has no reverse mode.
- **Reading time:**
  - **Content Harmony** has slow/average/fast presets (150/225/300), custom wpm, a ±20 % range, "X min read" formatting, and bulk mode.
  - **Calculate.co.nz** uses 230 silent and 140 aloud (fixed).
- **No competitor cites its wpm figures.** Calculate.co.nz even lists tax sources (IRD/RBNZ) as its review basis.
- **No single page covers all of these:**
  - silent reading, reading aloud, presentation, and slow speech
  - editable wpm with cited defaults
  - a reverse table of words needed for 1–60 minutes
  - paste mode
  - adjustments for pauses and slides
  - a **practice timer** with a target time

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Omni speaking | MiniWebtool | Calc.co.nz | Content Harmony |
|---|---|---|---|---|
| Words → time | ✅ | ✅ | ✅ | ✅ |
| Paste text | ❌ | ✅ | ❌ | ✅ |
| Silent reading time | ❌ | ❌ | ✅ (230) | ✅ (150/225/300) |
| Reading aloud / speaking | ✅ | ✅ | ✅ (140, fixed) | ❌ |
| Several paces side by side | ❌ | ✅ (slow/normal/fast) | ❌ | ⚠️ (range ±20 %) |
| Custom wpm | ✅ | ❌ | ✅ (silent only) | ✅ |
| **Reverse: minutes → words needed** | ✅ | ❌ | ❌ | ❌ |
| 1–60 min speech table | ⚠️ (minutes table) | ❌ | ❌ | ❌ |
| Pause buffer | ❌ | ✅ | ❌ | ❌ |
| Slides estimate | ❌ | ⚠️ (method unexplained) | ❌ | ❌ |
| Per-paragraph timing | ❌ | ✅ | ❌ | ❌ |
| "X min read" format | ❌ | ❌ | ❌ | ✅ |
| Bulk (many articles) | ❌ | ❌ | ❌ | ✅ (`---` separator) |
| **Practice timer / stopwatch** | ❌ | ❌ | ❌ | ❌ |
| Measure *your own* wpm (read a sample, time it) | ❌ (separate reading-speed tool) | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Omni | MiniWebtool | Calc.co.nz | Content Harmony |
|---|---|---|---|---|
| wpm defaults cited | ❌ | ❌ | ❌ (tax sources listed) | ❌ ("research-backed") |
| Worked examples (checked) | ✅ (1,400/140 = 10 min; 20 × 140 = 2,800) | ✅ (700/140 = 5:00 + 10 % = 5:30) | ✅ (5,000/230 = 21.7 min) | ✅ (24 cells correct) |
| Factors (difficulty, audience, pauses) | ⚠️ (unsourced) | ✅ (buffer) | ❌ | ⚠️ |
| Unsourced claims | speed records 655/637 wpm | pace "common" | — | "7-minute sweet spot", "studies show" |
| FAQ count | 0 (question headings) | 5 | yes (repeats intro) | 0 |
| Named author | ✅ (PhD + reviewer) | ❌ (team) | ⚠️ (reviewer) | ❌ |
| Date | ❌ | ✅ (Apr 2026; video date conflicts) | ✅ (Nov 2026) | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. Omni — Speaking Time Calculator (Anna Szczepanek PhD; reviewer Steven Wooding)
- **Presets:** Slow 100, Lecture 120, Presentation 140, Lively 160, Fast 180, plus custom wpm.
- **Reverse:** words = minutes × wpm.
- **Tables (140 wpm):** both correct. Example: 45 min → 6,300 words.
- **Weak points:**
  - Presets and the speed-record figures have no source.
  - The default preset isn't stated.
  - Pauses are ignored.
  - "Speech timer" and "speaking time" are used interchangeably.
  - No date.

### 2. MiniWebtool — Speaking Time Calculator (updated Apr 2026)
- **Inputs:** paste text or a word count; 3 paces (110/140/170); pause buffer (0, 5, 10, 15, 20 %).
- **Outputs:** base time, total time, slide range, pace comparison, per-paragraph timing, a timing brief.
- **Example:** 700 words at 140 wpm = 5:00; with a 10 % buffer = 5:30 ✔.
- **FAQs:** 5.
- **Weak points:**
  - No reverse mode.
  - Neither the slide-count method nor the paragraph-split rule is explained.
  - Paces have no source.
  - The manual word count silently overrides pasted text.
  - Video date conflicts with the page date.

### 3. Calculate.co.nz — Reading Time Calculator NZ
- **Defaults:** 230 wpm silent (editable); aloud fixed at 140.
- **Example:** 5,000 words → 22 min silent, 36 min aloud ✔.
- **Weak points:**
  - No citation.
  - The review basis (IRD/RBNZ/Stats NZ) has nothing to do with reading.
  - Partner banner.
  - FAQ repeats the intro.

### 4. Content Harmony — Reading Time Calculator
- **Presets:** 150/225/300 wpm or custom (50–1,000).
- **Outputs:** detailed time, "X min read", a ±20 % range, plus word, character, sentence and paragraph counts. Bulk mode splits articles at `---`.
- **Table:** words ÷ wpm, all 24 cells ✔.
- **Weak points:**
  - Claims it "accounts for images and code" but has no input for them.
  - No speaking rate, despite pitching teleprompter use.
  - Statistics have no source.
  - Says "even we can't see your text" while also running Google Analytics.
  - No FAQ, author or date.

---

## 5. Patterns

**Maths**
- time = words ÷ wpm
- words needed = minutes × wpm
- Add a pause or slide buffer: total = base × (1 + b), or base + slides × s seconds.

**Defaults (to cite and keep editable)**

| Mode | Proposed default | Source to confirm (`TODO(owner)`) |
|---|---|---|
| Silent reading, non-fiction | ~238 wpm | Brysbaert (2019), *Journal of Memory and Language* meta-analysis |
| Silent reading, fiction | ~260 wpm | same |
| Reading aloud | ~183 wpm | same paper (oral reading) |
| Presentation / speech | ~130–150 wpm | published speech-rate norms (e.g. NCVS or broadcast guidelines), to verify |
| Slow / careful speech | ~110 wpm | label as an approximation |

**Range:** show ±15–20 % and say why: difficulty, audience, non-native language.

**Paste mode:** reuse the Word Counter engine (#6).

**Practice timer**
- Start, pause and reset, with a target time from the result.
- A visual cue as the end approaches.
- No sound by default (accessibility).

**Personal wpm test**
- Read a sample paragraph (written by us) and time it to get your own wpm.
- Use that wpm for every estimate on the page.

**Coverage across the 4 competitors**

| Section | Pages (of 4) |
|---|:---:|
| Words → time | 4 |
| Reverse | 1 |
| Silent + aloud together | 1 |
| Cited wpm | **0** |
| Pause buffer | 1 |
| Practice timer | **0** |
| Own-wpm test | **0** |

---

## 6. FAQ question bank

★ = asked on 2 or more pages, or a cluster keyword. These map to the 13-keyword cluster.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How long does it take to read 500 / 1,000 / 2,000 words? | all · `how long does it take to read 500 words`, `how long is 2000 words` |
| 2 | ★ How many words is a 5-minute speech (4, 7, 10 minutes)? | Omni · `how many words for a 4 minute speech`, `…7 minute speech` |
| 3 | ★ What is the average reading speed? | Calc.co.nz, Content Harmony (uncited) |
| 4 | ★ What is the average speaking rate? | Omni, MiniWebtool (uncited) |
| 5 | How long is 500 words (time or pages)? | `how long is 500 words` (answer both; link #1) |
| 6 | How many pages is a 5-minute speech? | `how many pages is a 5 minute speech` (link #1) |
| 7 | How long is 50 / 100 / 300 words? | `how long is 100 words` etc. |
| 8 | Reading silently vs aloud: what is the difference? | Calc.co.nz |
| 9 | How do I time my own speech? | `speech timer` (practice timer) |
| 10 | How do pauses and slides change the length? | MiniWebtool |

---

## 7. Gaps nobody fills — our opportunities

1. **Four modes at once:** silent reading, reading aloud, presentation, slow speech. Each uses editable wpm with a **cited default**.
2. **Reverse table:** words needed for a 1–60 minute speech at each pace. This is a linkable asset, as the keyword file notes.
3. **Paste text** for a live count and all four times, shared with #6.
4. **Pause and slide buffer**, with a clear method.
5. **Practice timer** that starts with the target time already set. Covers `speech timer`.
6. **Measure your own wpm** with a timed sample paragraph.
7. **Range and an honest note** on why estimates vary.
8. **"How long is X words" answers** for both time and pages, linking to Words to Pages (#1).
9. **Links:** Word Counter (#6), Words to Pages (#1), Pomodoro and Online Timer (Batch 8).

---

## 8. Blueprint for the KKCTools Reading & Speaking Time Calculator

### 8.1 SEO

- **URL:** `/reading-time-calculator/`
- **Title:** Reading Time Calculator – Words to Minutes
- **H1:** Reading Time Calculator: How Long to Read or Say Any Text
- **Meta:** as in the keyword file (143 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Input | Word count or pasted text |
| Modes | Silent, aloud, presentation, slow — editable wpm, cited defaults |
| Outputs | Times (mm:ss and "X min read"), range ±% |
| Reverse | Minutes → words for each pace; 1–60 min table (printable) |
| Buffer | Pause % and/or slides × seconds |
| Timer | Practice timer with target, pause/reset |
| Own wpm | Timed sample paragraph → personal wpm |
| UX | Share URL, no network |

### 8.3 Content outline (≈ 1,200–1,500 words, original)

1. Intro (primary keyword)
2. How to use
3. Average reading speed (cited) and what changes it
4. Average speaking rate (cited)
5. How long is 100, 500, 1,000 or 2,000 words?
6. How many words for a 3, 5, 10 or 20-minute speech (table)
7. Pauses, slides and audience time
8. Measure and practise your own pace (test and timer)
9. FAQ (10)
10. Related tools: Word Counter (#6), Words to Pages (#1), Online Timer (Batch 8)

### 8.4 Quality checks

- **Unit tests:** time maths, reverse mode, buffer, table generation, timer state (a fake clock for tests).
- **Fixtures:** 1,400 words at 140 wpm = 10:00; 700 words at 140 wpm + 10 % = 5:30; 5,000 words at 238 wpm = 21:00.
- **Data:** wpm defaults live in a data file with a citation field. No network calls.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:** pull the Google top 10; **confirm the wpm citations** (Brysbaert 2019 and a speech-rate source); approve the sample paragraph.
