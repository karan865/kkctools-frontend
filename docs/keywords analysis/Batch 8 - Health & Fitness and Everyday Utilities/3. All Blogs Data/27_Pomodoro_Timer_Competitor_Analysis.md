# Pomodoro Timer (25 / 5 and 50 / 10) — Competitor Analysis

> **Target page:** KKCTools `/pomodoro-timer/` (Batch 8, Tool #27 🟡)
> **Primary keyword:** `pomodoro technique for focus` — US 2,400 · KD 9 · declining.
> - Secondary: `what is a pomodoro` (1,000 / KD 9), as an H2.
> - Cluster: 21 keywords, 158,110 US searches.
> - Long tail (19 phrases, 154,710): `25 minute timer` (74,000 / KD 28), `timer 25 minutes` (14,800 / KD 18), `25 min timer`, `set a timer for 25 minutes`, `50/10`.
> - The seed head `pomodoro timer` is **not in the exports**.
> **SERP source:** ⚠ No Semrush SERP export exists for Batch 8. Competitors come from a live web search on 2026-11-14 for `pomodoro timer online 25 minute`, plus the known leader Pomofocus.
> - Other results seen but not audited: zight, britetodo, 101planners, easyretro, pythonware, softaims, toolstackhub, shadcn.io, Early, Jasper Bernaers, clockzone, and pages.dev clones.
> - **Blocked or unavailable:** codeshack.io (HTTP 403); timeanddate.com/timer/pomodoro.html (404); tomato-timer.com (now redirects to Toptal, which entered a redirect loop); Francesco Cirillo's official technique page (404 on two guessed URLs).
> - `TODO(owner)`: check these manually, and find the official Cirillo page for citation.
> - `TODO(owner): pull Google top 10 for "pomodoro timer", "25 minute timer" and "pomodoro technique".`
> **Pages visited (2026-11-14):** 5 read: Pomofocus, Clockify (Pomodoro), ClickUp (free Pomodoro tool), WebWork (Pomodoro), Time.now ("set timer for 25 minutes").

---

## 0. How this was collected (read first)

- **Who ranks:**
  - **The category leader:** Pomofocus.
  - **Productivity-SaaS lead-gen tools:** Clockify, ClickUp, WebWork, Zight, Early, britetodo.
  - **Per-duration timer farms:** time.now, softaims, clockzone, set-an-alarm.pages.dev.
  - Indie developers: codeshack, Jasper Bernaers.
  - **Google's own timer box**, for many "25 minute timer" searches. The keyword file notes this, which is why this tool is 🟡.
- **The facts everyone repeats:**
  - Francesco Cirillo developed the technique in the **late 1980s**, naming it after a tomato-shaped kitchen timer ("pomodoro" is Italian for tomato).
  - The basic cycle is **25 min focus → 5 min break**, with a **longer break after 4 pomodoros**. Pages disagree on its length: 15, 15–30, 20–30 or 30 min.
  - `TODO(owner)`:
    - Cite Cirillo's own book or site for the rules and the era.
    - **Check the trademark status.** "Pomodoro Technique®" is widely reported as a registered trademark of Cirillo's company.
    - Use the name descriptively, with ® if required, and claim no affiliation.
- **Errors and issues found:**
  - **Clockify:**
    - Its long break is "20–30 minutes" in one place and "30 minutes" in another.
    - About 9 grammar errors ("Optometrist often advise", "start a new a timer").
    - An unsourced multitasking-research claim.
    - "Completely FREE" vs "7-day trial".
  - **WebWork:**
    - It says "4 sprints ≈ roughly two focused hours"; 4 × 25 = **100 minutes**.
    - It claims the timer "stays accurate in background tabs" with no caveat, although browsers throttle background timers.
    - Its schema attaches the parent product's **4.8★ / 1,875 reviews** and awards to the free timer.
    - Its product category is "employee monitoring".
    - An unsourced ADHD claim.
  - **ClickUp:**
    - Two tool cards link to the wrong calculator.
    - Its "requires no downloads" claim conflicts with "app settings".
    - An unsourced "3–5 h is the limit of deep concentration".
    - An unattributed Reddit quote.
  - **Pomofocus:**
    - No FAQ; a thin explanation of the technique.
    - The Windows app is unsigned (it asks users to bypass a warning).
    - Download versions are inconsistent.
    - Long break and auto-start aren't described in the page text.
  - **Time.now:**
    - **One page per duration** (5 seconds to 24 hours), with templated, near-duplicate text. This is a thin-content risk.
    - Step 1 tells users to enter hours, minutes and seconds on a preset page.
- **Our rule (keyword file):** one URL, with presets on the page. Don't make one page per minute value.
- **Engineering requirements:**
  - Keep accurate time in background tabs: compute from `performance.now()` or `Date.now()` deltas, not by counting `setInterval` ticks.
  - The sound must be triggered by a user gesture first (autoplay policy).
  - Show the countdown in the tab title.
  - Work offline after the first load.
  - **No network calls.**
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | pomofocus.io | Category leader (freemium) | Pomodoro Timer Online – Pomofocus / H1 An online Pomodoro Timer to boost your productivity | ~600 |
| 2 | clockify.me/pomodoro-timer | Time-tracking SaaS | Free Pomodoro timer – Clockify™ / H1 Pomodoro timer | 1,500–1,700 |
| 3 | clickup.com/free-tools/free-online-pomodoro-timer | Productivity SaaS | Free Online Pomodoro Timer \| No Login required | 650–750 |
| 4 | webwork-tracker.com/pomodoro-timer | Employee-monitoring SaaS | Free Pomodoro Timer (title ~70 chars) | 1,600–1,700 |
| 5 | time.now/timer/set-timer-for-25-minutes/ | Timer farm (per-duration pages) | Set Timer for 25 Minutes – Online Countdown / H1 Timer for 25 Minutes | ~600 |

**What this tells us:**
- **Pomofocus wins on product:**
  - custom focus and break times
  - **a task list with estimated pomodoros per task**
  - alarm and background sounds
  - templates, reports (premium), and desktop apps
  - **Weak points:** minimal content, no FAQ, premium upsells and ads on the free tier.
- **Clockify has the most content:** the technique, its problems, and Focus mode. Its long-break figures conflict and its grammar is poor. It pushes account sign-up.
- **ClickUp** is thin and promotional, with broken cross-links.
- **WebWork** has a good feature list and a matching FAQPage schema.
  - **But:** an arithmetic overclaim, an unrealistic background-accuracy promise, and **product ratings misapplied in schema**.
- **Time.now** shows the per-duration farm model the keyword file tells us **not** to copy.
- **No page offers all of these:**
  1. presets for **25/5, 50/10 and 52/17** plus custom, with the **long-break interval and length** configurable
  2. **auto-start** of the next phase, optional
  3. a **task list with pomodoro estimates**, stored in the browser only, with no account
  4. **accurate timing in background tabs** (delta-based), with a stated caveat for mobile sleep
  5. a tab-title countdown, sound and an optional notification (permission explained)
  6. a **full-screen focus view**, plus keyboard shortcuts
  7. honest content: the technique, its origin (cited), how to adapt it, and no unsourced health or ADHD claims
  8. **no sign-up, no ads, no tracking, works offline**

---

## 2. Feature matrix — tool

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Pomofocus | Clockify | ClickUp | WebWork | Time.now |
|---|---|---|---|---|---|
| 25 / 5 default | ✅ | ✅ | ✅ | ✅ | ⚠️ (25-min countdown only) |
| 50 / 10 preset | ⚠️ (custom) | ❌ | ⚠️ (custom) | ⚠️ (custom) | ❌ |
| Custom durations | ✅ | ✅ | ✅ | ✅ | ✅ (other pages) |
| Long break + interval setting | ⚠️ | ✅ (after 4) | ⚠️ (implied) | ✅ | ❌ |
| Auto-start next phase | ⚠️ | ⚠️ | ❌ | ✅ | ❌ |
| Task list | ✅ (+ estimates) | ✅ (labels) | ⚠️ (single task) | ⚠️ | ❌ |
| Sounds | ✅ (+ background) | ⚠️ | ⚠️ | ✅ | ✅ (toggle) |
| Desktop notification | ⚠️ | ✅ | ⚠️ (app settings) | ✅ (permission not explained) | ❌ |
| Tab-title countdown | ⚠️ | ? | ? | ? | ? |
| Full screen | ❌ | ✅ (Focus mode) | ❌ | ⚠️ | ✅ |
| Keyboard shortcuts | ✅ | ❌ | ❌ | ✅ | ❌ |
| Stats / report | ✅ (premium) | ✅ (account) | ⚠️ (implied) | ⚠️ | ❌ |
| No account needed | ✅ (basic) | ⚠️ (pushes account) | ✅ | ✅ | ✅ |
| Background accuracy addressed | ❌ | ❌ | ❌ | ⚠️ (**overclaimed**) | ⚠️ (session restore) |
| Works offline | ⚠️ (desktop app) | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | Pomofocus | Clockify | ClickUp | WebWork | Time.now |
|---|---|---|---|---|---|
| Technique explained | ⚠️ (6 steps) | ✅ | ⚠️ | ✅ | ⚠️ |
| Origin correct (Cirillo, late 1980s) | ✅ (via Wikipedia) | ✅ | ⚠️ | ✅ | ⚠️ |
| Long-break length consistent | — | ❌ | ⚠️ | ✅ (15) | — |
| Arithmetic correct | — | — | ✅ | ❌ (**"two hours"**) | ✅ (ms conversions) |
| Unsourced health / productivity claims | low | ✅ (research) | ✅ (3–5 h) | ✅ (ADHD, flow) | ✅ (trivia) |
| FAQ | ❌ | ⚠️ (not formatted) | 5 | ✅ (schema) | 3 |
| Schema problems | — | — | — | ❌ (**ratings misapplied**) | — |
| Promotion | premium + ads | **heavy** | **heavy** | **heavy** | premium prompts |
| Grammar / link errors | minor | **many** | **broken links** | title entity | templated text |

---

## 4. Competitor-by-competitor detail

### 1. Pomofocus
- **Features:**
  - 25-minute focus and 5-minute breaks, all customisable.
  - Alarm and background sounds.
  - Tasks with estimated pomodoros.
  - 3 free templates (unlimited on premium).
  - Reports (daily to yearly, premium).
  - Mac/Windows/Linux apps.
- **Weak points:**
  - About 600 words, with the technique explained in 2 short sections (cites Wikipedia).
  - No FAQ.
  - An unsigned Windows app (it asks users to bypass the warning).
  - Version mismatch.
  - Hidden pricing; the free tier has ads.
  - "Loading…" text in the page.
  - An unclear "SIMPLE PAGE" navigation label.

### 2. Clockify: Pomodoro Timer
- **Features:** one-click start, task labels, break notifications, a session list, Focus mode, a long break after 4, analytics, multiple platforms.
- **Errors:**
  - Long break "20–30" vs "30".
  - Its naming varies ("Pomodoro time").
  - ~9 grammar errors.
  - An unsourced research claim.
  - Free vs trial unclear.
  - "4.8/5 Capterra" unlinked.
- **Weak points:** account-driven; its Q&A isn't formatted as an FAQ.

### 3. ClickUp: Free Online Pomodoro Timer
- **Features:** custom pomodoro and break times, notifications (via "app settings"), 5 FAQs.
- **Errors:**
  - **Two cross-links point to the wrong tool.**
  - "No downloads" vs "app settings".
  - Unsourced concentration claims.
  - An unattributed Reddit quote.
  - Inconsistent capitalisation.
- **Weak points:** heavy ClickUp promotion, including inside the FAQ.

### 4. WebWork: Free Pomodoro Timer
- **Features:** a 9-item list (custom times, auto-start, sound and desktop alerts, keyboard shortcuts), FAQ + FAQPage schema.
- **Errors:**
  - **"Roughly two focused hours" for 4 × 25 min (100 min).**
  - "Accurate in background tabs" with no caveat.
  - **4.8★ / 1,875 reviews and awards attached to the timer in schema.**
  - Categorised as "employee monitoring" software.
  - An unsourced ADHD claim.
  - Deprecated HowTo markup.
  - A title entity bug; ~70-character title.
- **Weak points:** six or more sign-up CTAs and a pricing pitch.

### 5. Time.now: Set Timer for 25 Minutes
- **Features:** a preset 25-minute countdown, name, full screen, dark mode, sound toggle, session restore (local storage), and links to 5 s–24 h siblings.
- **Weak points:**
  - **A per-duration farm** with templated, keyword-stuffed text.
  - Step instructions don't fit a preset page.
  - Unsourced trivia.
  - No author or date.

---

## 5. Patterns

**Timer engine (shared with Online Timer #28 and Alarm Clock #29)**
- **State:** phase (focus / short / long), endTime (epoch ms), paused remaining.
- **Display:** remaining = endTime − Date.now(), rendered with `requestAnimationFrame` while visible.
- **When the tab is hidden:**
  - Update the title every second via `setTimeout` (throttled, so accept ±1 s).
  - On `visibilitychange`, resync from endTime.
- **Phase end:** play a sound (Web Audio, unlocked by the first click), fire a `Notification` (if permitted), flash the title, and auto-start the next phase if enabled.
- **Mobile caveat:** if the device sleeps, the alarm may be delayed until it wakes. Say so on the page.
- **Persistence:** settings and tasks in `localStorage` (try/catch). Optional, and no account needed.

**Presets**
- 25 / 5, long 15 every 4 (default).
- 50 / 10, long 30 every 2.
- 52 / 17, labelled "a popular variant" without a research claim.
- Custom.

**Tasks**
- Add a task, estimate pomodoros, tick them off, and see the total.
- Stored in the browser only. Export to the clipboard.

**Accessibility**
- Large digits; `aria-live="polite"` updates each minute (not every second).
- Keyboard: Space = start/pause, R = reset, S = skip, F = full screen.
- A reduced-motion option.

**Long tail handled on one page**
- `#25m` / `#50-10` URL hashes set presets.
- H2s for "25 minute timer" and "50/10".
- No per-minute pages.

**Coverage across the 5 competitors**

| Section | Pages (of 5) |
|---|:---:|
| 50/10 preset | **0** (custom only) |
| Task estimates | 1 |
| Background accuracy honestly addressed | **0** |
| Works offline | **0–1** (desktop app) |
| Full screen + shortcuts | 1 |
| No sign-up, no ads | 1–2 |
| Consistent, sourced technique content | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What is a pomodoro? | `what is a pomodoro`, all |
| 2 | ★ How does the Pomodoro Technique work? | `pomodoro technique for focus`, all |
| 3 | ★ How long should the long break be? | Clockify, ClickUp, WebWork (conflicting) |
| 4 | ★ Can I change 25 minutes to 50 minutes? | `50/10`, Pomofocus, ClickUp |
| 5 | ★ What if I get interrupted during a pomodoro? | ClickUp, Clockify |
| 6 | How many pomodoros should I do a day? | ClickUp |
| 7 | Does the timer keep running if I switch tabs or lock my phone? | WebWork, time.now (honest answer) |
| 8 | Why didn't I hear the alarm? | gap (autoplay, mute, notification permission) |
| 9 | Is my task list saved anywhere? | gap (browser only) |
| 10 | Who created the Pomodoro Technique? | Clockify, WebWork |

---

## 7. Gaps nobody fills — our opportunities

1. **Built-in 25/5, 50/10 and 52/17 presets**, plus custom long-break length and interval.
2. **Delta-based timing that stays accurate in the background**, with an honest mobile-sleep caveat.
3. **A task list with estimates**, with no account, stored in the browser.
4. **Full-screen focus view + shortcuts + tab-title countdown + optional notification**, with the permissions explained.
5. **Works offline, with no ads, no sign-up and no tracking.** This is our main point of difference from SaaS lead-gen pages.
6. **Accurate, sourced content** (Cirillo, cited) with no unsourced health claims, and the trademark handled correctly.
7. **One URL with hash presets.** This covers the "25 minute timer" long tail without thin duplicate pages.
8. **Links:** Online Timer (#28), Alarm Clock (#29), Time Duration (#4), Days Until Countdown (#3), Word Counter (Batch 6, for writing sprints).

---

## 8. Blueprint for the KKCTools Pomodoro Timer

### 8.1 SEO

- **URL:** `/pomodoro-timer/`
- **Title:** Pomodoro Timer – 25 Minute Focus Timer
- **H1:** Pomodoro Timer: 25-Minute Focus Sessions With Breaks
- **Meta:** as in the keyword file (147 chars).
- **H2s:**
  - "What is a pomodoro?"
  - "How the Pomodoro Technique works"
  - "25 minute timer"
  - "50/10 and other variations"
  - "Tips for focus sessions"
- **Schema:** `WebApplication` + `FAQPage`. **No ratings.**

### 8.2 Tool spec

| Area | Spec |
|---|---|
| Timer | Focus / short / long; presets 25/5, 50/10, 52/17, custom; long break every N; auto-start toggle |
| Alerts | Sound (choice + volume), tab title, optional notification, vibration where supported |
| Tasks | Add, estimate, complete, totals; stored locally; clipboard export |
| Views | Normal, full screen, minimal; dark/light; reduced motion |
| Accuracy | End-time based; resync on visibility change; mobile caveat shown |
| Offline | Static assets cached by the browser; no network calls |
| Shortcuts | Space, R, S, F |

### 8.3 Content outline (≈ 800–1,100 words, original)

1. Intro and timer
2. How to use it (presets, tasks, shortcuts)
3. What a pomodoro is, and where the technique came from (cited)
4. How the cycle works (focus, short break, long break)
5. The 25-minute timer and the 50/10 variation, and when to adjust
6. Handling interruptions
7. Practical tips (neutral; no health claims)
8. FAQ (10)
9. Related tools

### 8.4 Quality checks

- **Unit tests:**
  - Phase sequencing (4 focus → long break).
  - Time maths with a mocked clock, including hidden-tab gaps of 10 minutes.
  - Pause and resume.
  - Hash preset parsing.
  - localStorage failure fallback.
- **Manual:** sound unlock, notification permission flow, mobile background behaviour.
- No competitor wording. `npm run check:no-network` passes.
- **`TODO(owner)`:**
  - Pull Google top 10.
  - Find and cite Cirillo's official source.
  - Confirm the trademark wording.
  - Choose alarm sounds (generated by our code or licensed CC0).
  - Review codeshack and Time and Date manually.
