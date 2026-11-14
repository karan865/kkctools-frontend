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
| `--muted` | `#64748B` | `#64748B` |
| `--accent` | `#0284C7` | `#38BDF8` |
| `--accent-ink` | `#FFFFFF` | `#090C12` |
| `--brand-orange` | `#C2410C` | `#F97316` |

Other tokens: radii (`--radius-s` 8, `-m` 14, `-l` 18, `-card` 16, `-pill`), shadows (`-s/-m/-l/-card/-pop`), spacing `--space-1…9` (4–96 px), `--container` 1200 px, `--prose` 68ch.

---

## 3. Contrast Verification (measured 2026-11-14 with the WCAG 2.x formula on the values above)

Target: ≥ 4.5:1 for body text, ≥ 3.0:1 for large text / UI borders.

| Mode | Text | Background | Ratio | Body text |
|---|---|---|---|---|
| Light | `--ink` | `--bg` | 14.1:1 | PASS ✅ |
| Light | `--ink` | `--surface` | 17.9:1 | PASS ✅ |
| Light | `--ink-2` | `--surface` | 10.4:1 | PASS ✅ |
| Light | `--muted` | `--surface` | 4.8:1 | PASS ✅ |
| Light | `--muted` | `--bg` | 3.8:1 | ⚠️ large text only |
| Light | `--accent-ink` | `--accent` | 4.1:1 | ⚠️ large/bold text only |
| Light | white | `--brand-orange` | 5.2:1 | PASS ✅ |
| Dark | `--ink` | `--bg` | 17.9:1 | PASS ✅ |
| Dark | `--ink` | `--surface` | 16.7:1 | PASS ✅ |
| Dark | `--ink-2` | `--surface` | 7.1:1 | PASS ✅ |
| Dark | `--muted` | `--bg` | 4.1:1 | ⚠️ large text only |
| Dark | `--muted` | `--surface` | 3.8:1 | ⚠️ large text only |
| Dark | `--accent-ink` | `--accent` | 9.1:1 | PASS ✅ |
| Dark | `--bg` | `--brand-orange` | 7.0:1 | PASS ✅ |

**Open issue:** four pairs are below 4.5:1. They are fine for large or bold text but not for small body text. Either use them only for large/bold text, or darken `--muted` (light on `--bg`, and dark mode) and `--accent` (light). Logged in `00-PROJECT-STATUS.md` §5. Not yet changed in code.
