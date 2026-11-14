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
