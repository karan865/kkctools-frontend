# Reading & Speaking Time Calculator — Build Spec

> **URL:** `/reading-time-calculator/` · Batch 6 · Tier 1 · **Build order 6**
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§2.2 `verified` flags, §3 reading-rate status, §4 `reading-rates.ts`)
> **Inputs:** `07_Reading_Speaking_Time_Calculator_Competitor_Analysis.md`, keyword file §2 #7
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**About 10,500 searches** in 13 keywords:
- `reading time calculation` 2,400 / KD 26 (rising) is the primary;
- the "how long is X words" rows are KD 10–22: `how long is 500 words` 2,400, `how long is 300 words` 1,000, `how long is 100 words` 480, `how long is 2000 words` 480, `how long is 50 words` 320, `how long does it take to read 500 words` 260;
- speech rows are KD 0–14: `how many words for a 4 minute speech` 590, `… 7 minute speech` 320, `how many pages is a 5 minute speech` 260, `speech time calc` 260 / KD 0;
- `speech timer` 1,000 / KD 28: some people want a stopwatch, so we add a practice timer.

**The minutes → words table is the linkable asset** (speakers, students, YouTubers, teachers): 1–60 minutes at four paces, printable.

**No competitor cites its words-per-minute figures.** Snippets give silent reading as 200–250, 225, 230, 238 or 250–300 and speaking as 110–170. Our page:
- uses a named source where one exists (Brysbaert 2019 for reading, pending the owner's confirmation of the exact figures, §3);
- labels the speaking paces as **example paces** (no official figure was found);
- makes every pace editable;
- lets people **measure their own pace**.

### Research notes from the competitor analysis

- **Pages read:** Omni (speaking time), MiniWebtool (speaking time), Calculate.co.nz (reading time), Content Harmony (reading time). BigVU 404.
- **Omni:** 5 presets (100/120/140/160/180) + custom; reverse mode; both tables correct (45 min at 140 → 6,300 words ✔). No sources, default preset not stated, pauses ignored.
- **MiniWebtool:** pasted script, 3 paces (110/140/170), pause buffer 0–20%, slide range, per-paragraph timing. 700 words at 140 = 5:00, +10% = 5:30 ✔. No reverse; slide method not explained; a manual word count silently overrides pasted text.
- **Calculate.co.nz:** 230 silent (editable), 140 aloud (fixed); 5,000 words → 22 / 36 min ✔. Lists tax agencies (IRD/RBNZ) as its review basis.
- **Content Harmony:** 150/225/300 + custom, ±20% range, "X min read", bulk mode. Claims it "accounts for images and code" with no input for them; says "even we can't see your text" while running analytics.
- **Fixture correction:** the analysis listed 5,000 words at 238 wpm as 21:00; node gives **21:01** (21.008 min). Use 21:01.
- **0 of 4** cite wpm, offer a practice timer or an own-pace test.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | reading time calculation | 2,400 | 26 | intro sentence, H2 "Reading time calculation: the formula", HowWeCalculate |
| Head (not in exports) | reading time calculator · words per minute calculator | — | — | title, H1 (`TODO(owner)`: pull volume) |
| Secondary | how long is 500 / 300 / 100 / 2000 / 50 words | 2,400 · 1,000 · 480 · 480 · 320 | 10–22 | H2 "How long is 100, 500, 1,000 or 2,000 words?" + words → time table; "time **and** pages" answers linking #1 |
| Secondary | how long does it take to read 500 words | 260 | 13 | FAQ 1 |
| Secondary | how many words for a 4 minute speech · … 7 minute speech | 590 · 320 | 9–10 | **minutes → words table** + H2 "How many words for a 3, 4, 5, 7 or 10-minute speech?" |
| Secondary | how many pages is a 5 minute speech | 260 | 14 | FAQ (words → pages via #1 settings) |
| Secondary | speech time calc | 260 | 0 | Speech tab label, ToolShell heading |
| Support | speech timer · text to speech timer | 1,000 · 720 | 28–29 | **Practice timer** tab + H2 "Practise with a speech timer" (`text to speech` intent is mixed: one FAQ line, no TTS feature) |

## 2. Our edge

- **Four paces at once:** silent reading, reading aloud, presentation, slow/careful speech, each editable, each with its source status shown.
- **Reverse:** minutes → words needed, plus the **1–60 minute table** at all four paces (printable).
- **Paste the script:** live word count (shared engine) → all four times.
- **Pause and slide buffer** with the method shown: `total = base × (1 + pause%) + slides × seconds per slide`.
- **Practice timer** pre-set to the target from the result; count-up with a progress ring; colour change near the end; no sound by default.
- **Measure your own pace:** read our sample passage silently or aloud, press Start and Stop, and the page sets your personal wpm for every estimate.
- **A ±15% range** with the reason (difficulty, audience, familiarity, language).
- **"How long is X words" answered for time *and* pages** (link #1), because that query is ambiguous.

## 3. Calculator spec

### 3.1 Tabs

1. **Words → time** (default)
2. **Speech length** (minutes → words)
3. **Paste text**
4. **Practice timer**
5. **Measure my pace**

### 3.2 Input guide diagram (above the inputs)

`ReadingTimeInputGuide.tsx`: a document icon → arrows to four pace lanes.

- "1 Word count" on the document.
- Four lanes with a speedometer each: "2 Silent reading", "3 Reading aloud", "4 Presentation", "5 Slow speech", each showing its wpm and the time result.
- A small "+ pauses / slides" chip labelled "6 Buffer".
- **Speech tab:** a clock → "Minutes" → "Words needed".
- **Timer tab:** the ring with "Target" and "Elapsed".
- **Measure tab:** a stopwatch over the sample passage.

Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Words | 1,000 |
| Silent reading wpm | 238 (`reading-rates.ts`: Brysbaert 2019, non-fiction; `verified:false` until the owner confirms) |
| Silent reading, fiction | 260 (same source, optional row) |
| Reading aloud wpm | 183 (same source; pending) |
| Presentation wpm | 130 (**example pace, no source**; edit) |
| Slow / careful speech wpm | 110 (**example pace**; edit) |
| Conversational wpm | 150 (**example pace**; optional row) |
| Pause buffer | 0% (0–30%) |
| Slides × seconds per slide | 0 × 5 s |
| Minutes (speech tab) | 5 |
| Timer target | from the current result (editable) |

**Source rule for the UI:** while an entry is `verified:false`, its label reads "≈ 238 wpm (published estimate, being verified)", and the BLUF uses the formula, not the number. When verified, it reads "238 wpm (Brysbaert, 2019)" with the link and checked date.

### 3.4 Engine (`text-engine.ts` minutes helpers + `src/lib/reading-time-engine.ts`)

```ts
minutes = words / wpm ; total = minutes * (1 + pause) + slides * secPerSlide / 60
wordsNeeded = minutes * wpm                          // reverse
range = [total * 0.85, total * 1.15]
format: mm:ss (round to the nearest second) ; "X min read" = ceil(minutes)
speechTable(mins = [1,2,3,4,5,7,10,15,20,30,45,60], paces) → words per pace
measure: wpm = sampleWords / (elapsedMs / 60000)      // guard elapsed < 5 s → ask to retry
timer: pure reducer (start/pause/reset/tick) with an injectable clock for tests
```

**Worked examples (checked with node, 2026-11-22):**

| Words | Silent 238 | Fiction 260 | Aloud 183 | Slow 110 | Presentation 130 | Conversational 150 |
|---:|---|---|---|---|---|---|
| 50 | 0:13 | 0:12 | 0:16 | 0:27 | 0:23 | 0:20 |
| 100 | 0:25 | 0:23 | 0:33 | 0:55 | 0:46 | 0:40 |
| 300 | 1:16 | 1:09 | 1:38 | 2:44 | 2:18 | 2:00 |
| 500 | 2:06 | 1:55 | 2:44 | 4:33 | 3:51 | 3:20 |
| **1,000** | **4:12** | 3:51 | 5:28 | 9:05 | 7:42 | 6:40 |
| 2,000 | 8:24 | 7:42 | 10:56 | 18:11 | 15:23 | 13:20 |
| 5,000 | 21:01 | 19:14 | 27:19 | 45:27 | 38:28 | 33:20 |

- 1,000 words at 238, ±15% range: **3:34–4:50**.
- 1,400 words at 140 wpm = **10:00**; 700 words at 140 + 10% buffer = **5:30** (matches MiniWebtool ✔).
- 650 words at 130 + 10 slides × 5 s = **5:50**.

**Speech table (words needed), checked with node:**

| Minutes | Slow 110 | Presentation 130 | Conversational 150 | Aloud 183 |
|---:|---:|---:|---:|---:|
| 1 | 110 | 130 | 150 | 183 |
| 2 | 220 | 260 | 300 | 366 |
| 3 | 330 | 390 | 450 | 549 |
| **4** | 440 | **520** | 600 | 732 |
| **5** | 550 | **650** | 750 | 915 |
| **7** | 770 | **910** | 1,050 | 1,281 |
| 10 | 1,100 | 1,300 | 1,500 | 1,830 |
| 15 | 1,650 | 1,950 | 2,250 | 2,745 |
| 20 | 2,200 | 2,600 | 3,000 | 3,660 |
| 30 | 3,300 | 3,900 | 4,500 | 5,490 |
| 45 | 4,950 | 5,850 | 6,750 | 8,235 |
| 60 | 6,600 | 7,800 | 9,000 | 10,980 |

- A 5-minute speech at 130 wpm (650 words) is **1.3 pages single-spaced or 2.6 double-spaced** at the #1 defaults.

### 3.5 Outputs

- **Headline:** the four times as tiles (mm:ss), the chosen one highlighted; "X min read" badge for blog use.
- **Sentence:** "1,000 words takes about 4 minutes 12 seconds to read silently and about 7 minutes 42 seconds to deliver as a presentation."
- Range line; source line for each pace.
- Speech tab: words needed + the table (printable), "≈ 1.3 pages" link to #1.
- Paste tab: live count → times; per-paragraph timing list.
- Timer: ring, elapsed / target, Start/Pause/Reset, keyboard (Space, R), `prefers-reduced-motion` respected.
- Measure: your wpm → "Use my pace" applies it everywhere (kept in memory only; optional localStorage with try/catch).
- Share URL (numbers and paces only), Copy.

### 3.6 Tests

- Time maths; rounding to seconds; "min read" ceiling.
- Reverse; table rows equal single calls.
- Buffer and slides.
- Range.
- Measure: wpm from a fake elapsed time; < 5 s guard.
- Timer reducer with a fake clock (start, pause, resume, reset, overrun).
- `verified:false` paces never appear as plain facts in the BLUF.
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Reading Time Calculator – Words to Minutes` (42; 54 with the suffix: OK) |
| Meta | `Free reading time calculator. Turn a word count into reading and speaking time, or find how many words you need for a 3, 5 or 10 minute speech.` (143) |
| H1 | `Reading Time Calculator: How Long to Read or Say Any Text` |
| BLUF | **While the reading rate is unverified:** "Reading time = words ÷ words per minute. Enter a word count or paste your text to see how long it takes to read silently, read aloud or give as a speech, or switch to Speech length to find how many words fit 3, 5 or 10 minutes. A 5-minute talk at 130 words per minute is 650 words." **Once verified:** add "At the average silent reading rate of 238 words per minute (Brysbaert, 2019), 1,000 words takes about 4 minutes 12 seconds." |
| ToolShell pills | `Silent, aloud & speech times`, `Words for any speech length`, `Practice timer`, `Measure your own pace` |
| Links out | Word Counter (#6), Words to Pages (#1), Sentence Counter (#9); Online Timer / Pomodoro (Batch 8, when live) |
| Links in | #1, #2, #6, #9, Tools hub "Text & Writing" |

## 5. Content (~1,400–1,700 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the reading time calculator | 5 tabs | 110 |
| 2 | Reading time calculation: the formula | words ÷ wpm; worked example; "X min read" | 130 |
| 3 | Average reading speed | The source (with status), fiction vs non-fiction, what slows reading; ±15% | 170 |
| 4 | Average speaking rate | No single official figure; example paces; why presentations run slower; measure your own | 150 |
| 5 | How long is 100, 500, 1,000 or 2,000 words? | Words → time table + pages link (`how long is 500 words` ambiguity) | 130 + table |
| 6 | How many words for a 3, 4, 5, 7 or 10-minute speech? | Speech table | 100 + table |
| 7 | Pauses, slides and audience questions | Buffer method + example (5:50) | 120 |
| 8 | Practise with a speech timer | Timer tab; rehearsal routine (our own) | 120 |
| 9 | Measure your own reading speed | Measure tab; why it beats averages | 100 |
| 10 | FAQ | §6 | 350 |

## 6. FAQ (11, from the competitor question bank + cluster keywords)

1. How long does it take to read 500 / 1,000 / 2,000 words?
2. How many words is a 4, 5 or 7-minute speech?
3. What is the average reading speed?
4. What is the average speaking rate?
5. How long is 500 words? (time and pages)
6. How many pages is a 5-minute speech?
7. How long is 50, 100 or 300 words?
8. Reading silently vs aloud: what's the difference?
9. How do I time my own speech?
10. How do pauses and slides change the length?
11. Can it read my text aloud? (no text-to-speech; it estimates time and gives you a practice timer)

## 7. Done when

- [ ] `reading-time-engine.ts` + timer reducer + tests; `npm run verify` passes.
- [ ] `reading-rates.ts` with citation fields; the BLUF switches wording on `verified`.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Sample passage for "Measure my pace" written by us (`TODO(owner)`: approve), word count tested.
- [ ] Registrations + docs; `graphify update .`.
