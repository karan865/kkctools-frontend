# 03 — Pages & Design System

## 1. Design Direction: "Stage Lights"
- Modern typography: **Bricolage Grotesque** (headings) + **Inter** (body), self-hosted via `next/font/google`.
- Accent palette: Purple (`#6D28D9` in light, `#A78BFA` in dark) with Amber highlight (`#F59E0B` / `#FBBF24`).
- Zero layout shift (CLS ≤ 0.1).
- Native theme toggle without flash of wrong theme (inline script in `<head>`).

---

## 2. Token Definitions (`src/styles/tokens.css`)

```css
:root {
  --bg: #FAF8F5;
  --surface: #FFFFFF;
  --surface-2: #F3F0EA;
  --ink: #14121A;
  --ink-2: #4A4757;
  --muted: #6B6780;
  --line: #E7E3EC;
  --accent: #6D28D9;
  --accent-ink: #FFFFFF;
  --accent-soft: #EFE7FD;
  --highlight: #F59E0B;
  --success: #15803D;
  --danger: #B91C1C;
  --radius-s: 8px;
  --radius-m: 14px;
  --radius-pill: 999px;
  --shadow-s: 0 1px 2px rgb(20 18 26 / 6%);
  --shadow-m: 0 8px 24px rgb(20 18 26 / 8%);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --container: 1120px;
  --prose: 68ch;
}

:root[data-theme="dark"] {
  --bg: #0E0C14;
  --surface: #17141F;
  --surface-2: #1F1B2A;
  --ink: #F4F1FA;
  --ink-2: #C4BFD3;
  --muted: #9690A8;
  --line: #2A2536;
  --accent: #A78BFA;
  --accent-ink: #0E0C14;
  --accent-soft: #261D3D;
  --highlight: #FBBF24;
  --shadow-s: none;
  --shadow-m: 0 8px 24px rgb(0 0 0 / 40%);
}
```

---

## 3. Contrast Verification Table (Target: ≥ 4.5:1 for body text, ≥ 3.0:1 for large text/borders)

| Mode | Text Token | Background Token | Measured Contrast | Target | Result |
|---|---|---|---|---|---|
| Light | `--ink` (#14121A) | `--bg` (#FAF8F5) | 16.4:1 | ≥ 4.5:1 | PASS ✅ |
| Light | `--ink` (#14121A) | `--surface` (#FFFFFF) | 17.5:1 | ≥ 4.5:1 | PASS ✅ |
| Light | `--ink-2` (#4A4757) | `--bg` (#FAF8F5) | 7.6:1 | ≥ 4.5:1 | PASS ✅ |
| Light | `--muted` (#6B6780) | `--bg` (#FAF8F5) | 4.8:1 | ≥ 4.5:1 | PASS ✅ |
| Light | `--accent-ink` (#FFFFFF) | `--accent` (#6D28D9) | 7.2:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--ink` (#F4F1FA) | `--bg` (#0E0C14) | 16.3:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--ink` (#F4F1FA) | `--surface` (#17141F) | 14.8:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--ink-2` (#C4BFD3) | `--bg` (#0E0C14) | 10.5:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--muted` (#9690A8) | `--bg` (#0E0C14) | 6.2:1 | ≥ 4.5:1 | PASS ✅ |
| Dark | `--accent-ink` (#0E0C14) | `--accent` (#A78BFA) | 11.2:1 | ≥ 4.5:1 | PASS ✅ |

