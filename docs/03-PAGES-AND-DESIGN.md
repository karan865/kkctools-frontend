# 03 — Pages & Design System

## 1. Design Direction (current, see Decisions 04–09 in `00-PROJECT-STATUS.md`)
- Typography: **Bricolage Grotesque** (headings) + **Inter** (body), self-hosted via `next/font/google` (`src/app/layout.tsx`).
- Light theme: warm sand canvas, white cards, slate ink, sky-blue actions, terracotta-orange CTAs.
- Dark theme: "Obsidian Carbon" — near-black canvas, elevated charcoal cards, light-blue accent, orange CTAs.
- Category colour themes per tool group (`--cat-*` tokens: concrete, gravel, earthwork, …).
- No theme flash (inline script in `<head>`); theme key `kkc_theme_pref`, default Light.
- Zero layout shift target (CLS ≤ 0.1).

The original "Stage Lights" purple palette (Phase 1) has been replaced.

---

## 2. Key Tokens (`src/styles/tokens.css` — the file is the source of truth)

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#EBE4D6` | `#090C12` |
| `--surface` | `#FFFFFF` | `#11151F` |
| `--ink` | `#0F172A` | `#F1F5F9` |
| `--ink-2` | `#334155` | `#94A3B8` |
| `--muted` | `#556274` | `#8291A6` |
| `--accent` | `#0369A1` (hover `#075985`) | `#38BDF8` |
| `--accent-ink` | `#FFFFFF` | `#090C12` |
| `--brand-orange` | `#C2410C` | `#F97316` |
| `--brand-orange-text` | `#9A3412` | `#FB923C` |
| `--cat-*-deep` | darker category shade for text on tints (e.g. `#075985`) | light shade (e.g. `#BAE6FD`) |
| `--cat-*-g1` / `-g2` | fixed category gradient (same in both themes; white text ≥ 5:1) | same |

Other tokens: radii (`--radius-s` 8, `-m` 14, `-l` 18, `-card` 16, `-pill`), shadows (`-s/-m/-l/-card/-pop`), spacing `--space-1…9` (4–96 px), `--container` 1200 px, `--prose` 68ch.

---

## 3. Contrast Verification (re-measured 2026-11-15 with the WCAG 2.x formula after the AdSense-report fixes)

Target: ≥ 4.5:1 for body text, ≥ 3.0:1 for large text / UI borders. All pairs below now pass for small body text.

| Mode | Text | Background | Ratio | Body text |
|---|---|---|---|---|
| Light | `--ink` | `--bg` | 14.1:1 | PASS ✅ |
| Light | `--ink` | `--surface` | 17.9:1 | PASS ✅ |
| Light | `--ink-2` | `--surface` | 10.4:1 | PASS ✅ |
| Light | `--muted` `#556274` | `--surface` | 6.2:1 | PASS ✅ |
| Light | `--muted` `#556274` | `--bg` | 4.9:1 | PASS ✅ (was 3.8 with `#64748B`) |
| Light | `--accent-ink` (white) | `--accent` `#0369A1` | 5.9:1 | PASS ✅ (was 4.1 with `#0284C7`) |
| Light | `--accent` `#0369A1` | `--bg` | 4.7:1 | PASS ✅ |
| Light | `--success` `#166534` | `--bg` | 5.6:1 | PASS ✅ |
| Light | white | `--brand-orange` | 5.2:1 | PASS ✅ |
| Light | `--brand-orange-text` `#9A3412` | `--bg` | 6.0:1+ | PASS ✅ (use this, not `--brand-orange`, for orange text) |
| Dark | `--ink` | `--bg` | 17.9:1 | PASS ✅ |
| Dark | `--ink` | `--surface` | 16.7:1 | PASS ✅ |
| Dark | `--ink-2` | `--surface` | 7.1:1 | PASS ✅ |
| Dark | `--muted` `#8291A6` | `--bg` | 6.1:1 | PASS ✅ (was 4.1) |
| Dark | `--muted` `#8291A6` | `--surface` | 5.7:1 | PASS ✅ (was 3.8) |
| Dark | `--accent-ink` | `--accent` | 9.1:1 | PASS ✅ |
| Dark | `--bg` | `--brand-orange` | 7.0:1 | PASS ✅ |
| Footer | `.copyright` `#94A3B8` | footer `#17213A` | 6.2:1 | PASS ✅ |

**Hardcoded colours (2026-11-15):** older tool components used fixed hex values instead of tokens. Text uses of `#64748B` were switched to `var(--muted)` (52 places). Site-wide, `#0284C7` → `#0369A1`, old `#0369A1` hover → `#075985`, and `#059669` → `#065F46` (73 files; `tokens.css` excluded). New code must use tokens, not hex values.

**Links in text (WCAG 1.4.1):** links inside paragraphs and list items in articles/prose, and unclassed links in any `main p`, are underlined (`globals.css`), so they do not rely on colour alone.

**Form labels:** every tool input must have a `<label htmlFor>` or an `aria-label`. On 2026-11-15, 54 inputs whose visible `<label>` had no `htmlFor` got a matching `aria-label`.

**Undefined variables:** many older tool CSS files used `var(--color-text-muted, #64748b)`; `--color-text-muted` is not defined, so the low-contrast fallback showed. These now use `var(--muted)`. Light-grey `#94A3B8` text and red `#EF4444` text in tool CSS were changed to `var(--muted)` and `#B91C1C`.

**Other a11y rules:** segmented buttons use `aria-pressed` (not `aria-checked` without a role, nor `role="tablist"` without tabs); headings go h1 → h2 → h3 without skips; empty table header cells get `<span className="sr-only">`; `.sr-only` lives in `globals.css`.

**Result (2026-11-15):** Lighthouse 12.6.0 accessibility = 100 on all 47 built pages.

---

## 4. Home Page Layout (redesigned 2026-11-15)

Goal: every section looks different while scrolling, and each trade has its own colour.

| # | Section | Look |
|---|---|---|
| 1 | Hero (`HomeHero`) | colourful mesh background; "Calculators" in a blue→purple→rose gradient with a hand-drawn orange underline; category chips tinted per category and wrapping to two rows; right side: `HeroScene` illustrated building site (slab, stud wall with window, truss + shingle roof with pitch marker, painted wall and roller, gravel pile, crane, tree, tape measure) in a blueprint panel, with the three result cards hanging off its corners on desktop; on phones the scene shows under the buttons |
| 2 | Trust strip | unchanged |
| 3 | `CategoryTiles` — "Pick a trade" | 6 gradient tiles (one per category, `--cat-*-g1/g2`), tool count, jump link |
| 4 | New & updated | warm orange tint; grid trimmed to full rows of 4 |
| 5 | Category bands 01–03 (`CategorySection`) | own tint + blueprint grid + glow, gradient icon badge, outlined numeral, coloured eyebrow pill and underline; layout alternates **split** (heading column + 2×2 cards, sticky heading) / **stack** (heading row + 4 across); split headings flip sides |
| 6 | Why us (`WhyUs`) | dark navy band with dot pattern; each point a different category colour |
| 7 | Category bands 04–06 | as above |
| 8 | Guides | cards with gradient covers and icons, tinted badges |
| 9 | FAQ | soft accent glow |
| 10 | Suggest banner | unchanged |

- **Tool cards (`ToolCard`)**, used on Home and `/tools/` (redesigned again 2026-11-15 after owner feedback "too simple, text too small"):
  - 172 px illustration panel with a tool-specific SVG diagram (`ToolArt.tsx`, one per tool icon, e.g. slab with dimensions, rebar grid, wire gauges, pipe OD/ID, paver layers), blueprint grid, category chip and NEW/UPDATED badge;
  - gradient icon tile + 1.25 rem title, 0.975 rem description (2 lines), tinted tag pills;
  - footer with "Open tool →" and "Free · No sign-up"; coloured ring + lift on hover;
  - grids are 3 across on desktop (split sections 2 across), 2 on tablets, 1 on phones; on phones the card is a row with a 104 px diagram thumbnail.
- Section card counts are multiples of the column count: split 4 (2×2), stack 6 (3×2), Business 3, New 9.
- `AdPlaceholder` renders nothing while `NEXT_PUBLIC_ADS_ENABLED` is false, so visitors never see an empty "advertisement" box.
- Section `overflow: clip` (not `hidden`) so the sticky heading works.
- Lighthouse after the redesign (local build, 2026-11-15): mobile 96 / 100 / 96 / 100, desktop 100 / 100 / 96 / 100 (Perf / A11y / BP / SEO); CLS 0.001; Best Practices 96 only from the local-only `__next.*.txt` 404.
