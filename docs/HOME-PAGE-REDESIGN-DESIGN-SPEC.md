# KKC Tools — Home Page, Header & Footer Redesign (Design Spec)

> **Status:** Design only — nothing is coded yet. Build from this file in a later task.
> **Scope:** `/` home page, the global header (`Header.tsx`, `MobileMenu.tsx`) and the global footer (`Footer.tsx`).
> **Date:** 2026-11-13
> **Must follow AGENTS.md:** plain CSS + CSS Modules, no new dependencies, no third-party scripts, no network calls, no fake stats / ratings / testimonials, original copy only.

---

## 0. Summary — what changes and why

**What looks weak today**

- The hero is built around a live Band Name Generator widget, but 20 of the site's 22 tools are construction calculators. First-time visitors from Google mostly come for calculators.
- Tool cards are tall (icon + category + 3-line description + 4 chips + “Launch …” link). Ten of them in one long grid feel like a wall of text.
- Emojis are used as icons (🎸 📐 🏗️ 🧱). They render differently on every OS and look less professional than a consistent icon set.
- The warm beige page background (`#EBE4D6`) is flat; sections don't separate well.
- The tool list is typed out by hand in 5 places (home, header dropdown, mobile menu, footer, `/tools/`), and they are already out of sync. The header dropdown shows 9 tools; the site has 22.
- The footer is a long link list with no clear structure or call to action.

**What the new design does**

1. **Hero banner** with a crisp LCP-optimized headline (instant render, no opacity delay, single accent word), a **single unified search box** (`/` shortcut), quick category chips and floating “result cards” visual.
2. **Trust strip** with 4 factual points (free, no sign-up, private, formulas shown).
3. **New & updated tools** row (highlighting fresh additions without duplicating lower sections), then **category sections with exactly 4 cards each** (including a dedicated "Browse all tools" card in Business & Creative).
4. Clean **medium-size cards** with SVG icons, category colours, soft layered shadows and hover lift.
5. **Zero-CLS AdSense placeholder slot** reserved between categories, **Why KKC Tools**, **Guides**, **FAQ** and a **Suggest-a-tool** banner. (Removed redundant "How it works" steps).
6. **New header**: glass sticky bar, mega menu (capped at max 5 tools per category with "View all" links), unified search trigger (`/` shortcut).
7. **New footer**: dark, structured, with a dedicated "More Tools & Utilities" column separated from Company links, CTA band, back-to-top.
8. **One tool catalog file** that feeds home, header, mobile menu, footer and `/tools/`.
9. **Phased design rollout**: background `#F6F4EF` and heading font Bricolage Grotesque roll out first to Home, Header and Footer, keeping existing tool pages safe from unintended style collisions.

---

## 1. Inspiration (patterns only — no copying)

These are well-known tool sites whose *patterns* inform this design. Do not copy their text, icons, colours or layouts (AGENTS.md rule 8).

| Pattern | Seen on sites like | How we use it |
|---|---|---|
| Search-first hero for a big tool library | Omni Calculator, Calculator.net | Search box in the hero that filters our tool catalog in the browser |
| Coloured icon tile per tool, grid of compact cards | Smallpdf, iLovePDF | Medium cards with a category-coloured icon tile |
| Announcement pill above the headline (“New: …”) | Vercel, Linear | “New · Concrete Calculator →” pill |
| Glass sticky header, hairline borders, layered soft shadows | Linear, Vercel, Stripe | Header blur, 1px borders, two-layer shadows |
| Mesh-gradient / dot-grid hero background | Stripe, Vercel | Soft gradient blobs + faded dot grid |
| Mega menu grouped by category | Inch Calculator, Canva | Tools dropdown with all categories |
| Dense, grouped footer links | Calculator.net, Stripe | Dark footer with tools grouped by category |

---

## 2. Page structure (top to bottom)

| # | Section | Purpose | Background |
|---:|---|---|---|
| 0 | Header | Navigation, search, theme | Glass (blurred surface) |
| 1 | Hero banner | Headline (instant LCP), search, CTAs, visual | Mesh gradient + dot grid |
| 2 | Trust strip | 4 factual promises | Overlaps hero bottom (white card) |
| 3 | New & updated tools | 2–4 freshest additions / updates (no static duplicates) | Canvas |
| 4 | Category sections (×6) | 4 cards each (incl. "Browse all" & "Suggest tool") | Alternating canvas / surface band |
| 4b| Ad slot placeholder | Reserved inert space (728×90 / responsive) to prevent future CLS | Canvas (between Cat 2 & 3) |
| 5 | Why KKC Tools | 4 value cards (privacy, real formulas, speed, free) | Canvas |
| 6 | Guides | 3 article cards | Surface band |
| 7 | FAQ | 5–6 questions (+ FAQ schema) | Canvas |
| 8 | Suggest-a-tool banner | Conversion / feedback | Gradient card |
| 9 | Footer | All links, categorized tools, company, legal | Dark (`#0B1220`) |

### 2.1 Desktop wireframe (≥ 1100 px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [⚡ KKC Tools]   Home  Tools ▾  Guides  About      [🔍 Search  /] [◐] [All tools →] │  ← glass header 68px
├──────────────────────────────────────────────────────────────────────────┤
│  ( New · Concrete Calculator → )                          ┌──────────────┐│
│                                                           │ 1.36 yd³      ││ ← floating
│  Free Construction Calculators                            │ concrete      ││   result cards
│  & Everyday Tools                                         └──────────────┘│
│  Work out concrete, gravel, lumber, paint and more…        ┌─────────────┐ │
│                                                            │ 62 × 80 lb  │ │
│  ┌──────────────────────────────────────────┐             │ bags        │ │
│  │ 🔍  Search 22 tools — press / to search   │             └─────────────┘ │
│  └──────────────────────────────────────────┘          ┌──────────────┐   │
│  [Concrete] [Gravel] [Roofing] [Flooring] [Paint]       │ 4/12 = 18.4° │   │
│  [Browse all tools]  [Try Concrete Calculator →]        └──────────────┘   │
├──────────────────────────────────────────────────────────────────────────┤
│   ┌────────────────────────────────────────────────────────────────────┐ │
│   │ ✓ 22 free tools │ ✓ No sign-up │ ✓ Runs in your browser │ ✓ Formulas shown │ │ ← trust strip
│   └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  NEW & UPDATED TOOLS                                       All tools →   │
│  Fresh additions & recent improvements                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                              │
│  │ card   │ │ card   │ │ card   │ │ card   │   ← 4 cards                  │
│  └────────┘ └────────┘ └────────┘ └────────┘                              │
│                                                                          │
│  ● CONCRETE & MASONRY                                      View all 4 →   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                              │
│  … (6 category sections, exactly 4 cards each)                           │
│                                                                          │
│  [─── Reserved Ad Placement Slot (Zero-CLS Placeholder) ───]              │
│                                                                          │
│  Why KKC Tools (4) · Guides (3) · FAQ (5)                                 │
│  ┌──────────── Can't find a calculator? Suggest a tool → ─────────────┐  │
├──────────────────────────────────────────────────────────────────────────┤
│  DARK FOOTER: brand · 4 tool columns · more tools · company · bottom bar  │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Mobile wireframe (390 px)

```
┌──────────────────────────────┐
│ [⚡ KKC Tools]     [🔍] [◐] [≡] │ 60px
├──────────────────────────────┤
│ ( New · Concrete Calc → )     │
│ Free Construction             │
│ Calculators & Everyday Tools  │
│ Work out concrete, gravel…    │
│ ┌──────────────────────────┐ │
│ │ 🔍 Search tools (press /) │ │
│ └──────────────────────────┘ │
│ [Concrete][Gravel][Roofing]→  │ ← chips scroll sideways
│ [ Browse all tools        ]   │ ← full-width buttons
│ [ Try Concrete Calculator ]   │
│ (result cards hidden < 760px) │
├──────────────────────────────┤
│ ✓ 22 free  ✓ No sign-up       │ 2×2 trust grid
│ ✓ Private  ✓ Formulas shown   │
├──────────────────────────────┤
│ NEW & UPDATED        All →   │
│ ┌──────────────────────────┐ │
│ │[ic] Concrete Calculator  →│ │ ← compact row cards
│ └──────────────────────────┘ │
│ CONCRETE & MASONRY   All 4 → │
│ ┌──────────────────────────┐ │
│ │[ic] Cubic Yard Calc      →│ │
│ └──────────────────────────┘ │
│ … 4 rows per section          │
└──────────────────────────────┘
```

---

## 3. Design tokens

Add these to `src/styles/tokens.css` (light) with dark values under `:root[data-theme="dark"]`. Existing tokens stay; new ones are additive.

### 3.1 Canvas & surfaces

| Token | Light | Dark | Note |
|---|---|---|---|
| `--bg` | **`#F6F4EF`** (was `#EBE4D6`) | `#090C12` (unchanged) | Lighter warm off-white. Phased rollout — see Strategy Note below |
| `--surface` | `#FFFFFF` | `#11151F` | unchanged |
| `--surface-band` | `#FBFAF7` | `#0D1119` | alternating section bands |
| `--line` | `#E7E3DA` | `#1E2636` | warmer hairline to match new canvas |
| `--line-strong` | `#D6D0C4` | `#2D394E` | |

> **Phased Rollout Strategy (Improvement 7):** Existing tool pages currently have hardcoded color values (e.g., `#0F172A`) and custom layouts. To prevent visual regression across 22 existing calculator pages, apply `#F6F4EF` canvas background and Bricolage Grotesque heading font initially to **Home page (`/`), global Header (`Header.tsx`), and global Footer (`Footer.tsx`)**. Individual tool pages will be migrated to the new tokens in a planned follow-up phase after visual verification.

### 3.2 Category colours

Each category gets one hue, used for the icon tile, section eyebrow dot and card hover glow.

| Category | Hue | Icon tile bg (light) | Icon colour (light) | Icon tile bg (dark) | Icon colour (dark) |
|---|---|---|---|---|---|
| Concrete & Masonry | Sky | `#E0F2FE` | `#0369A1` | `rgba(56,189,248,.14)` | `#7DD3FC` |
| Gravel, Sand & Pavers | Emerald | `#D1FAE5` | `#047857` | `rgba(52,211,153,.14)` | `#6EE7B7` |
| Earthwork & Paving | Amber | `#FEF3C7` | `#B45309` | `rgba(251,191,36,.14)` | `#FCD34D` |
| Framing & Roofing | Orange | `#FFEDD5` | `#C2410C` | `rgba(249,115,22,.15)` | `#FDBA74` |
| Floors, Paint & Stain | Violet | `#EDE9FE` | `#6D28D9` | `rgba(167,139,250,.15)` | `#C4B5FD` |
| Business & Creative | Rose | `#FFE4E6` | `#BE123C` | `rgba(251,113,133,.15)` | `#FDA4AF` |

CSS pattern: each card/section sets `--cat` (main hue), `--cat-soft` (tile bg) and `--cat-ink` (icon colour) through a class like `.cat-concrete`.

### 3.3 Typography

- **Display / headings:** Bricolage Grotesque (already loaded in `layout.tsx` as `--font-heading-loaded` — no new download). Body stays Inter.
- Set `--font-heading: var(--font-heading-loaded), 'Inter', system-ui, sans-serif;` — **check all pages after the switch** (it is global).

| Style | Size (desktop → mobile) | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| Hero H1 | `clamp(2.2rem, 5vw, 3.6rem)` | 800 | 1.05 | −0.035em |
| Section H2 | `clamp(1.6rem, 3vw, 2.1rem)` | 750 | 1.15 | −0.025em |
| Eyebrow | 0.75rem uppercase | 700 | 1 | +0.08em |
| Card title | 1.0625rem (17px) | 650 | 1.3 | −0.01em |
| Card text | 0.875rem (14px) | 400 | 1.5 | 0 |
| Body | 1rem | 400 | 1.65 | 0 |
| Small / meta | 0.8125rem | 500 | 1.4 | 0 |

### 3.4 Radius, borders, shadows

```css
--radius-card: 16px;
--radius-tile: 12px;      /* icon tiles */
--radius-input: 14px;     /* hero search */

--border-hair: 1px solid var(--line);

/* layered shadows: tight contact shadow + soft ambient shadow */
--shadow-card:       0 1px 2px rgba(23,33,58,.04), 0 2px 8px -2px rgba(23,33,58,.06);
--shadow-card-hover: 0 2px 4px rgba(23,33,58,.05), 0 16px 32px -12px rgba(23,33,58,.18);
--shadow-pop:        0 24px 48px -16px rgba(23,33,58,.25), 0 0 0 1px rgba(23,33,58,.04);  /* menus, search results */
--shadow-glow:       0 12px 32px -14px color-mix(in srgb, var(--cat) 55%, transparent);   /* coloured hover glow */
```

Dark mode keeps the existing “rim-light” style: add `0 0 0 1px rgba(255,255,255,.06)` to each shadow.

### 3.5 Motion

```css
--ease-out:    cubic-bezier(.22, 1, .36, 1);   /* smooth settle */
--ease-spring: cubic-bezier(.34, 1.56, .64, 1); /* small overshoot for icons */
--dur-1: 120ms;  /* colour, border */
--dur-2: 200ms;  /* hover lift, menus */
--dur-3: 320ms;  /* drawers, accordions */
--dur-4: 600ms;  /* entrance fade-up */
```

**Reduced motion:** wrap every animation in `@media (prefers-reduced-motion: no-preference)`; under `reduce`, cards don't lift (only border/colour change), floating cards are static, entrance animations are off.

### 3.6 Layout

- Container: `--container: 1200px` (was 1160), side padding 24px desktop / 16px mobile.
- Section spacing: 88px desktop, 64px tablet, 48px mobile.
- Card grid gap: 20px desktop, 16px tablet, 12px mobile.

---

## 4. Section-by-section design

### 4.1 Header (global)

**Layout:** sticky, height 68px (60px mobile), full width, content in the 1200px container.

| Zone | Content |
|---|---|
| Left | Logo mark (current lightning SVG in a 34px rounded tile with brand gradient) + “KKC Tools” in Bricolage 700 |
| Centre | Home · **Tools ▾** (mega menu) · Guides · About |
| Right | Search button `🔍 Search tools  /` (pill, 200px, muted text, `/` hint) · Theme toggle · Primary pill “All tools →” |

**Look**

- Background `color-mix(in srgb, var(--surface) 78%, transparent)` + `backdrop-filter: saturate(180%) blur(12px)`.
- At page top: no border. After 8px of scroll: 1px bottom border `var(--line)` + `--shadow-card`, transition `--dur-2`. (Use a tiny scroll listener or an `IntersectionObserver` sentinel — no library).
- Nav links: 15px, weight 500, `--ink-2`; hover `--ink`. **Active link:** 2px underline bar with brand gradient, 18px wide, centred under the text; it grows to full text width on hover (`transform: scaleX`, `--dur-2`).

**Mega menu (Tools ▾)**

- Opens on hover (with 120ms intent delay) and on click / Enter / Space; closes on Esc, outside click, or leaving for 200ms.
- Panel: 820px wide, `--radius-card` 18px, `--shadow-pop`, 1px border, 20px padding, appears with `opacity 0→1` + `translateY(-6px)→0` + `scale(.98)→1` over `--dur-2`.
- Content: **3-column grid of the 6 categories**. Each category: coloured dot + name (eyebrow style), then its tools as rows (16px icon + name). Hover row: `--surface-hover` background, radius 8px.
- **Scalability Rule (Max 5 Tools):** To prevent the menu from becoming excessively long as the site scales to 40+ tools, each category displays a **maximum of 5 tools**. If a category has more than 5 tools, a compact link `"View all {N} {Category} tools →"` is displayed at the bottom of that category column.
- Bottom bar inside the panel: “**View all 22 tools directory →**” (left) and “New: Concrete Calculator” chip (right).
- Generated directly from the tool catalog (Section 6).

**Search (Single Unified Component — Shortcut `/`)**

- To eliminate duplicate code and clashing shortcuts, **one single search component** powers the experience:
  - On the home page, the search input lives prominently in the hero banner. Clicking the header's search button or pressing `/` smoothly scrolls and focuses this input.
  - On subpages (or when triggered from header outside home), it opens a lightweight modal overlay (560px, `--shadow-pop`, backdrop `rgba(15,23,42,.35)` + blur 4px).
  - Shortcut: `/` (forward slash — web standard across GitHub, Google Docs, without clashing with native browser Ctrl+K shortcuts).
- Input autofocus; results filter the catalog by name, category and keywords in real-time in the browser (zero network calls).
- Each result row: icon tile + tool name + category; ↑/↓ keys to move, Enter to open, Esc to close.
- Empty state: “No tool for ‘xyz’ yet — **Suggest it**” (mailto link).

**Mobile header (< 960px)**

- Logo · search icon button · theme toggle · hamburger.
- Drawer slides in from the right (88vw, max 360px) mounted via `createPortal(..., document.body)`, `--dur-3`, focus trapped, Esc closes.
- Drawer content: search field on top → accordion per category (closed by default, max 5 tools + "View all", chevron rotates 180°) → Guides, About, Contact → “All tools” full-width button at the bottom.

### 4.2 Hero banner

**Layout:** 2 columns (56% text / 44% visual) at ≥ 960px; single column below. Padding 72px top, 104px bottom (the trust strip overlaps the bottom by 40px). Min height about 540px on desktop.

**Background (pure CSS, no images)**

- Two large blurred blobs: sky `rgba(2,132,199,.14)` top-right and orange `rgba(194,65,12,.10)` bottom-left, 520px each, `filter: blur(80px)`, slowly drifting (`translate` ±20px, 18s, infinite, alternate).
- A faint dot grid: `radial-gradient(var(--line-strong) 1px, transparent 1px)` at 22px spacing, masked with `mask-image: radial-gradient(ellipse at 30% 40%, #000 30%, transparent 75%)` so it fades out.

**Left column (top to bottom)**

1. **Announcement pill** — `New` (small filled badge, brand gradient) + “Concrete Calculator — slabs, posts & bags →”. White surface, 1px border, `--shadow-card`, radius pill; on hover the arrow slides 3px right. Links to `/concrete-calculator/`.
2. **H1 (LCP-Optimized):** “Free Construction Calculators & Everyday Tools”
   - **LCP Speed Guarantee:** The H1 heading and lead paragraph **must render immediately with `opacity: 1` and 0ms delay**. Do NOT apply entrance fade-in animations to the H1 heading, as delaying the largest above-the-fold text severely damages Google Core Web Vitals (Largest Contentful Paint score).
   - **Modern Typography Styling:** Solid, authoritative dark heading in `var(--ink)`. Instead of an entire multi-word gradient (which can feel dated), keep the title crisp dark with only a single accent word highlighted in brand accent (e.g. “Calculators” in `--color-primary`).
3. **Lead (18px, `--ink-2`, max 560px):** “Work out concrete, gravel, lumber, paint and more in seconds. Every tool is free, needs no sign-up and runs right in your browser.” (Renders immediately alongside H1).
4. **Search box** (the unified search input): 56px tall, radius 14px, white, 1px border, `--shadow-card`; focus → 3px `--accent-soft` ring + border `--accent`, `--dur-1`. Placeholder: “Search {N} tools — press / to search”. Right side shows the `/` keyboard hint badge.
5. **Quick chips** (scroll sideways on mobile): Concrete · Gravel · Roofing · Flooring · Paint · Landscaping. Each chip: category dot + label, 34px tall, radius pill, 1px border; hover fills with `--cat-soft`. Clicking scrolls smoothly to that category section.
6. **Buttons:** Primary “Browse all tools” (brand blue gradient, white text, `--shadow-card`, hover lift 1px + slightly stronger shadow) and secondary “Try Concrete Calculator →” (white, 1px border). Both 48px tall; full width on mobile.

**Right column — “result cards” visual (decorative, ≥ 760px only)**

- 3 glass cards stacked at slight angles (−4°, 2°, −2°), each 220×96px: white at 85% opacity, `backdrop-filter: blur(8px)`, 1px border, `--shadow-pop`.
- Each card shows a small category icon tile, a big number and a label — for example “1.36 yd³ · Concrete for a 10×10 ft slab” and “62 × 80 lb bags”.
- **Every number must be computed at build time by the real engines** (like the Concrete Calculator page does), never typed by hand.
- Animation: slow float, `translateY(0 → −8px)`, 6s `ease-in-out` infinite alternate, with 0s / 1.2s / 2.4s delays so they move out of sync.
- `aria-hidden="true"` on the visual; it adds no information the text doesn't have.

**Micro-animations:** Subtle CSS fade-up for secondary interactive elements only (announcement pill, search box, chips, CTA buttons: `opacity 0→1`, `translateY(8px)→0`, 300ms, staggered). The H1 and lead text remain 100% static for instant LCP paint.

### 4.3 Trust strip

- One white card, overlapping the hero by −40px, radius 18px, `--shadow-card`, 1px border, padding 18px 24px.
- 4 items in a row (2×2 on mobile), separated by 1px vertical dividers. Each: 36px circle with soft accent background + check/shield/zap/book icon, then bold label + small muted line.

| Icon | Label | Small line |
|---|---|---|
| grid | **{N} free tools** | Construction, home & creative |
| user-x | **No sign-up** | No account, no paywall |
| shield | **Private by design** | Runs in your browser |
| book-open | **Formulas shown** | Worked examples on tool pages |

> **Honesty rule:** {N} comes from the catalog length. Before shipping “Formulas shown”, confirm every calculator page has a formula section; otherwise reword to “Clear explanations”. No user counts, ratings or reviews (AGENTS.md rule 3).

### 4.4 Section header pattern (used by every tool section)

```
● CONCRETE & MASONRY                                   View all 4 →
Concrete, block and brick calculators
Slabs, footings, post holes, CMU walls and brick walls.
```

- Eyebrow: 8px category-colour dot + uppercase label (0.75rem, 700, +0.08em, `--cat-ink`).
- H2 (Bricolage), then one muted line (max 600px).
- Right: “View all N →” text link (`--accent`), arrow slides 3px on hover. On mobile it moves under the description.
- Each section has an `id` (e.g. `#concrete`) so the hero chips and footer can link to it.

### 4.5 Tool card — the main component

**Size:** medium. 4 per row at ≥ 1100px (≈ 270px wide), **min-height 188px**, padding 20px. Not taller than about 210px.

**Anatomy**

```
┌──────────────────────────────────┐
│ ┌────┐                     [New] │  ← icon tile 44px · optional badge
│ │ ic │                           │
│ └────┘                           │
│ Concrete Calculator              │  ← title 17px / 650
│ Slabs, footings and post holes — │  ← 2 lines max (line-clamp)
│ cubic yards and bag counts.      │
│                                  │
│ [yd³ · m³] [Bags]            (→) │  ← 2 small tags · arrow circle
└──────────────────────────────────┘
```

- **Whole card is one `<a>`**; the title is an `<h3>`. No nested links or buttons.
- **Icon tile:** 44×44px, radius 12px, background `--cat-soft`, 22px SVG icon in `--cat-ink`, stroke 1.75px.
- **Badge (optional):** `New` (only for tools added in the last 30 days, from the catalog `added` date) — 11px, 700, uppercase, pill, brand gradient, white text. Never use “Popular” or “Most used” unless real analytics support it.
- **Description:** 14px, `--ink-2`, `-webkit-line-clamp: 2`. Max about 90 characters in the catalog.
- **Tags:** max 2, 12px, 600, `--surface-2` background, 1px border, radius 6px, padding 3px 8px.
- **Arrow:** 28px circle, 1px border, `→` icon 14px, bottom-right.

**States**

| State | Changes |
|---|---|
| Default | `--surface`, 1px `--line` border, `--shadow-card` |
| Hover | `translateY(-3px)`; shadow → `--shadow-card-hover` + `--shadow-glow`; border → `color-mix(in srgb, var(--cat) 35%, var(--line))`; icon tile `scale(1.06) rotate(-3deg)` with `--ease-spring`; arrow circle fills with `--cat` (white arrow) and moves 2px right. All `--dur-2 --ease-out`. |
| Focus-visible | Same as hover + `outline: 3px solid color-mix(in srgb, var(--accent) 45%, transparent); outline-offset: 3px` |
| Active (pressed) | `translateY(-1px)`, shadow back to `--shadow-card`, 80ms |
| Reduced motion | No movement; only border, shadow and arrow colour change |

**Subtle extra polish**

- A 1px top highlight inside the card: `inset 0 1px 0 rgba(255,255,255,.6)` (light mode only).
- On hover, a very faint radial wash of the category colour in the top-left corner: `background-image: radial-gradient(240px circle at 0 0, color-mix(in srgb, var(--cat) 8%, transparent), transparent 60%)`, fading in over `--dur-2`.

**Featured card variant** (Section 4.6 only): same size, plus a **gradient border** (`border: 1px solid transparent; background: linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, var(--cat), transparent 60%) border-box;`).

**Mobile card variant (< 640px):** horizontal row — icon tile left (40px), title + 1-line description right, arrow at far right; height about 84px, padding 14px 16px; cards stacked with 10px gap. No tags on mobile.

**Tablet (640–1099px):** 2 cards per row, same vertical card.

### 4.6 New & Updated Tools (replaces duplicate "Featured" row)

- **Purpose (Error 2 Fix):** In the previous draft, the "Featured" section duplicated 4 tools that repeated again directly below in the category sections, making the page unnecessarily long without offering new content. This row is now repurposed into **"New & Updated Tools"**.
- Eyebrow “NEW & UPDATED”, H2 “Recently added & updated tools”, line “Fresh calculators and major updates built for speed.”
- Cards shown: **Concrete Calculator** (`New` badge), **Rafter Calculator** (Updated with pitch charts), and future batch additions (**Drywall Calculator**, **Reinforcement Steel Calculator** as they launch).
- **Static Build Rule for `New` Badge:** Because the site is statically exported (`output: 'export'`), the `New` badge (based on `added` date ≤ 30 days) is evaluated at build time. It updates automatically on each new site build/deployment.

### 4.7 Category sections — exactly 4 cards each

All 22 current tools fit cleanly across 6 categories. Sections alternate background: canvas / `--surface-band` with a 1px top and bottom border.

| Section id | Category | 4 cards (in order) |
|---|---|---|
| `#concrete` | Concrete & Masonry | Concrete Calculator · Cubic Yard Calculator · Cinder Block Calculator · Brick Calculator |
| `#gravel` | Gravel, Sand & Pavers | Stone Calculator · Sand Calculator · Paver Base Calculator · Paver Sand Calculator |
| `#earthwork` | Earthwork & Paving | Asphalt Calculator · Fill Dirt Calculator · Compost Calculator · Tons to Cubic Yards |
| `#framing` | Framing, Roofing & Measuring | Rafter Calculator · Stud Calculator · Linear Foot Calculator · Square Footage Calculator |
| `#finishes` | Floors, Paint & Stain | Tile Calculator · Laminate Flooring Calculator · Paint Cost Calculator · Fence Stain Calculator |
| `#business` | Business & Creative | Construction Estimate Template · Band Name Generator · **Browse All Tools** · **Suggest a Tool** |

- **Business & Creative Grid Fix (Error 1 Fix):** Previously this section only had 2 tools + "Suggest a tool" = 3 cards. It now features a 4th card: **“Browse All Tools”** (links to `/tools/`, compass/grid icon tile, description “Explore all 22 construction, calculation and naming tools in one complete directory.”, tags `[Directory, All Tools]`).
- **“Suggest a tool” card:** same size, dashed 1.5px `--line-strong` border, transparent background, plus-icon tile, text “Need another calculator? Tell us what to build next.”, opens `mailto:` with subject “Tool suggestion”. Hover: border turns `--accent`, background `--accent-soft`.
- **When a category grows past 4 tools:** The section continues to display 4 priority cards (newest or most useful first), and the “View all {N} →” link routes directly to that category anchor in `/tools/#category`.

**Card copy for all tools** (catalog defaults — original wording, ≤ 90 characters)

| Tool | Description | Tags |
|---|---|---|
| Concrete Calculator | Slabs, footings, Sonotubes and post holes — cubic yards, m³ and bag counts. | yd³ · m³ / Bags |
| Cubic Yard Calculator | Cubic yards of soil, gravel, mulch or concrete from length, width and depth. | Volume / Weight |
| Cinder Block Calculator | Blocks, mortar bags and core fill for CMU walls, minus doors and windows. | CMU / Mortar |
| Brick Calculator | Bricks and mortar for any wall size, joint width and brick type. | Bricks / Mortar |
| Stone Calculator | Crushed stone, gravel and river rock in tons, cubic yards and bags. | Tons / Yards |
| Sand Calculator | Sand for bedding, fill and sandboxes in cubic yards, tons and bags. | Tons / Bags |
| Paver Base Calculator | Crushed-stone base under patios and driveways, with compaction. | Base / Tons |
| Paver Sand Calculator | Bedding sand and polymeric joint sand for patios and walkways. | Bedding / Joints |
| Asphalt Calculator | Asphalt tons, cubic yards and cost for driveways and paths. | Tons / Cost |
| Fill Dirt Calculator | Fill dirt and topsoil for holes, grading and lawn levelling. | Yards / Trucks |
| Compost Calculator | Compost for garden beds and lawns in cubic yards and bags. | Beds / Bags |
| Tons to Cubic Yards | Convert tons ↔ cubic yards for gravel, sand, soil and more. | Converter |
| Rafter Calculator | Rafter length, roof pitch and cut angles with a live diagram. | Pitch / Cuts |
| Stud Calculator | Studs, plates and headers for walls at 16 in or 24 in spacing. | Framing / Lumber |
| Linear Foot Calculator | Add lengths in mixed units and convert sq ft ↔ linear ft. | Lengths / Cost |
| Square Footage Calculator | Area of rooms and odd shapes in sq ft, m² and sq yd. | Area / Rooms |
| Tile Calculator | Tiles and boxes for floors and walls, with grout gap and waste. | Tiles / Boxes |
| Laminate Flooring Calculator | Boxes of laminate for one or more rooms, with waste and cost. | Boxes / Cost |
| Paint Cost Calculator | Gallons of paint and total cost for walls and ceilings. | Gallons / Cost |
| Fence Stain Calculator | Gallons of stain for privacy, board-on-board and picket fences. | Gallons / Coats |
| Construction Estimate Template | Build an estimate with materials, labour, tax and markup — print to PDF. | PDF / CSV |
| Band Name Generator | Original band name ideas by genre and style, with quick availability checks. | Music / Ideas |
| Browse All Tools | Explore the full library of calculators, converters and creative tools. | Directory / All |

> Before shipping, check each description against what the tool really does today.

**Icons** — replace every emoji with inline SVG line icons (24×24 viewBox, stroke 1.75, round caps), drawn in-house in one `Icons.tsx` file. One icon per tool: slab block, cube, block wall, brick wall, stone pile, sand dunes, layered base, paver grid, road, shovel, leaf, scale, roof truss, stud wall, ruler, square-area, tile grid, floor planks, paint roller, fence, clipboard, guitar, grid-search, plus.

### 4.8 AdSense Reserved Placement Slot (Zero-CLS Layout Reservation)

- **Purpose (Improvement 5 & 8):** The previous "How it works" section ("pick tool, enter sizes, get results") was redundant for utility calculators and has been removed. In its place between the 2nd and 3rd category sections (or right above Why KKC Tools), a dedicated **AdSense layout reservation container** is established.
- **Why Now:** When AdSense is enabled in Phase 7, introducing new ad banners without pre-reserved dimensions causes Cumulative Layout Shift (CLS), which penalizes Google Core Web Vitals rankings.
- **Specification:**
  - Responsive banner slot with reserved height: `min-height: 90px` (desktop 728×90 / 970×90) and `min-height: 250px` (mobile 300×250).
  - Background: clean matching canvas with subtle dotted border or transparent placeholder wrapper.
  - Inert placeholder state: Contains zero external scripts or tracker calls until the owner explicitly enables ads in Phase 7 (compliant with AGENTS.md Rule 5).

### 4.9 Why KKC Tools

- 4 cards in a 2×2 grid (1 column mobile), each with a 40px soft icon tile, title and two-line text:
  - **Private** — Your numbers never leave your browser. No account, no tracking pixels.
  - **Built on real formulas** — Calculations use published product data and standard conversions, with sources listed on tool pages.
  - **Fast on any device** — Lightweight pages that work on phones at the job site.
  - **Free, with no catch** — No paywall, no sign-up and no limits on use.
- Card style: like tool cards but no hover lift (they are not links).
- Every claim must stay true: if ads are enabled later, reword “no tracking pixels”.

### 4.10 Guides

- Surface band. Eyebrow “GUIDES”, H2 “Learn before you build”, “All guides →” link.
- 3 article cards (current guides are band-naming guides): 16:9 top area with a soft gradient + large SVG icon (no stock photos), category label, title, 2-line excerpt, “Read guide →”.
- Same hover behaviour as tool cards.

### 4.11 FAQ

- Container 760px, accordion with `<details>`/`<summary>` (works without JS), plus-icon that rotates 45° when open, smooth height via `grid-template-rows: 0fr → 1fr` (`--dur-3`).
- Keep FAQ schema (`Faq` component with `withSchema`).
- Suggested questions (rewrite answers to match today's tools; no promises we can't keep):
  1. Are the tools really free?
  2. Do I need to create an account?
  3. Is anything I enter stored or sent anywhere?
  4. How accurate are the calculators? (answer: planning estimates; check with suppliers and local code)
  5. Can I use metric units? (answer honestly per tool)
  6. Can I suggest a new tool?

### 4.12 Suggest-a-tool banner

- Full-width card inside the container, radius 24px, padding 40px, background brand-blue gradient with a soft orange glow bottom-right and the dot-grid texture at 10% opacity.
- Left: H2 (white) “Can't find the calculator you need?” + line “Tell us what you're building — we add new tools every week.” *(only keep “every week” if it stays true; otherwise “regularly”)*.
- Right: white button “Suggest a tool →” (mailto) with hover lift.
- Mobile: stacked, button full width.

### 4.13 Footer (global)

**Style:** dark in both themes for a strong, professional anchor — background `#0B1220`, top border 1px `rgba(255,255,255,.06)`, text `#94A3B8`, headings `#F1F5F9`.

**Top band:** a slim strip, 1px bottom border, with “Free calculators for builders, DIYers and creators” on the left and two small buttons on the right: “All tools” and “Suggest a tool”.

**Main grid (desktop 7 columns / 2 + 1 + 1 + 1 + 1 + 1):**

| Column | Content |
|---|---|
| Brand (2 cols) | Logo + “KKC Tools”, 2-line description, 3 tick items (Free · No sign-up · Runs in your browser), small “Back to top ↑” button |
| Concrete & Masonry | its tools (Concrete, Block, Brick, Cubic Yard) |
| Gravel, Earth & Paving | Stone, Sand, Paver Base, Paver Sand, Asphalt, Fill Dirt, Compost, Tons to Yards |
| Framing & Finishes | Rafter, Stud, Linear Foot, Square Footage, Tile, Flooring, Paint, Stain |
| More Tools & Utilities | Construction Estimate Template · Band Name Generator · All Tools Directory · Suggest a Tool |
| Company | About Us · Guides & Articles · Contact & Feedback · Privacy Policy · Terms of Service |

- **Column Structure Rule (Chhoti Cheez 2 Fix):** The "Company" column strictly contains corporate, editorial, and legal links. Tool links (Band Name Generator, Construction Estimate Template) belong in the dedicated **More Tools & Utilities** column.
- Links: 14px, `#94A3B8`; hover `#FFFFFF` with an underline that grows from the left (`background-size 0% → 100%`, `--dur-2`).
- Column titles: 12px uppercase, 700, +0.08em, white.
- All tool links come from the catalog.
- **Bottom bar:** © {year} KKC Tools · short disclaimer (“Estimates for planning only — confirm with suppliers and local building codes.”) · Privacy · Terms · Contact. On mobile: centred, stacked.
- **Mobile:** brand block first, then each link column as an accordion (closed by default), then bottom bar.
- No social icons until the owner gives real profile links (`TODO(owner)`). No newsletter form (it would need a backend or a third-party script).

### 4.14 Recently Used Tools Row (Optional Post-V1 Idea)

- A compact, horizontal quick-access row of the user's recently launched tools (stored purely in client-side `localStorage`, zero cookies/tracking).
- Shows up only on repeat visits (≥ 2 visits) at the top of the tools list.
- Kept as an optional polish item post-launch.

---

## 5. Animation & interaction checklist

> **Scroll Performance Rule (Improvement 6):** Removed viewport-triggered scroll fade-in animations on sections. Scroll-triggered entrance animations feel cheap, add unnecessary JavaScript execution, and can delay reading. Content sections render statically and cleanly. Animations are strictly limited to purposeful micro-interactions (card hover, drawer open, search focus, and floating decorative hero cards).

| Element | Animation | Duration / easing | Trigger |
|---|---|---|---|
| Hero H1 & lead paragraph | **Instant render (0ms, `opacity: 1`)** — no delay | 0ms | Immediate (LCP protected) |
| Hero secondary elements | Subtle fade-up 8px (pill, search, buttons) | 300ms `--ease-out`, staggered | Page load (CSS only) |
| Hero blobs | Slow drift ±20px | 18s alternate infinite | Always (off for reduced motion) |
| Floating result cards | Float −8px | 6s ease-in-out infinite, staggered | Always (off for reduced motion) |
| Announcement pill arrow | Slide 3px | 200ms | Hover |
| Search box | Ring + border colour | 120ms | Focus |
| Tool card | Lift −3px, shadow, glow, icon tilt, arrow fill | 200ms `--ease-out`; icon `--ease-spring` | Hover / focus |
| Header | Border + shadow appear | 200ms | After 8px scroll |
| Mega menu | Fade + slide + scale | 200ms | Open / close |
| Mobile drawer | Slide from right + overlay fade | 320ms | Open / close |
| FAQ | Height + icon rotate | 320ms | Toggle |
| Footer links | Underline grow | 200ms | Hover |

**Rules**

- Animate only `transform` and `opacity` (plus colour/shadow on hover) — no layout properties.
- No animation blocks reading or clicking. Nothing auto-plays sound or video.
- Everything respects `prefers-reduced-motion: reduce`.
- No animation blocks reading or clicking. Nothing auto-plays sound or video.
- Everything respects `prefers-reduced-motion: reduce`.

---

## 6. One tool catalog (single source of truth)

Create `src/lib/tools-catalog.ts`. Home, header mega menu, mobile drawer, footer and `/tools/` all read from it.

```ts
export type CategoryId = 'concrete' | 'gravel' | 'earthwork' | 'framing' | 'finishes' | 'business';

export interface CatalogCategory {
  id: CategoryId;
  name: string;          // "Concrete & Masonry"
  headline: string;      // section H2
  blurb: string;         // one muted line
  order: number;
}

export interface CatalogTool {
  slug: string;          // '/concrete-calculator/'
  name: string;          // 'Concrete Calculator'
  category: CategoryId;
  description: string;   // ≤ 90 chars, used on cards
  tags: [string, string?];
  icon: IconName;        // key into Icons.tsx
  keywords: string[];    // extra search terms: ['cement', 'slab', 'yard', 'bags']
  added: string;         // ISO date → drives the "New" badge (≤ 30 days)
  featured?: boolean;
}
```

- Route titles/descriptions stay in `src/lib/routes.ts`; the catalog only adds card data. A unit test should check that every catalog `slug` exists in `ROUTES` and every indexable tool route is in the catalog.
- The trust strip count and search placeholder use `CATALOG.length`.

---

## 7. Accessibility

- Text contrast ≥ 4.5:1 in light and dark (check the new `--line`, category ink colours and footer greys).
- One `<h1>` (hero). Section H2s; card titles H3.
- Cards: one link each, visible focus ring, minimum 44px touch targets on mobile.
- Mega menu and drawer: `aria-expanded`, `aria-controls`, Esc to close, focus returns to the trigger, focus trapped in the drawer.
- Search modal: `role="dialog"`, `aria-modal`, labelled input, results as a `listbox` with `aria-activedescendant`.
- Decorative visuals (`blobs`, result cards, dot grid): `aria-hidden="true"`.
- Chips scroll sideways with visible scroll hints; never hide content behind hover only.

## 8. Performance & SEO

- Cards, sections, header shell and footer render on the server. Only the search, header scroll state, mega menu and drawer are client components.
- No images in the hero; icons are inline SVG. Target: LCP < 1.8s, CLS 0, total home JS no larger than today.
- Remove the Band Name Generator live widget from the home hero — it ships the generator's JavaScript and word lists to every visitor.
- Keep FAQ schema. Keep at least 350 words in `<main>` (current SEO audit rule).
- Every tool is linked from the home page (crawlable internal links).
- Suggested home title/description (update `ROUTES.home`, must pass the audit: title ≤ 65 incl. “ | KKC Tools”, description 70–160):
  - Title: **“Free Construction Calculators & Online Tools”**
  - Description: **“Free calculators for concrete, gravel, lumber, roofing, flooring and paint, plus creative tools. No sign-up — everything runs in your browser.”**

## 9. Dark mode

- Same layout; tokens switch. Cards use `--surface` with rim-light shadow; category tiles use the dark rgba values from 3.2.
- Hero blobs at lower opacity (`.10` / `.08`); dot grid colour `#1E2636`.
- Glass header: `color-mix(in srgb, #11151F 72%, transparent)`.
- Footer stays dark (slightly lighter `#0D1320` so it separates from the `#090C12` page).

## 10. Owner decisions & design updates

| # | Item / Decision | Status & Resolution |
|---|---|---|
| D1 | Page background change (`#EBE4D6` → `#F6F4EF`) | **Phased Rollout:** Apply to Home (`/`), global Header, and global Footer first. Migrate individual tool pages in a planned follow-up phase after visual audit. |
| D2 | Move Band Name Generator out of hero? | **Yes** — Construction tools dominate search traffic. Band Name Generator is given prime placement in "More Tools & Utilities", Business & Creative, and Tools Directory. |
| D3 | Switch headings to Bricolage Grotesque? | **Phased Rollout:** Activated for Home, Header, Footer first; then extended across tool pages. |
| D4 | Footer dark in both themes? | **Yes** (`#0B1220`) with dedicated "More Tools & Utilities" column. |
| D5 | Social links in the footer? | Deferred until the owner provides verified profile URLs (`TODO(owner)`). |
| D6 | Business & Creative 4-card grid | **Resolved:** Added "Browse All Tools" card to complete the 4-card grid alongside "Suggest a Tool". |
| D7 | Repurpose "Featured" row | **Resolved:** Converted to "New & Updated Tools" to eliminate duplicate cards. |
| D8 | LCP speed protection | **Resolved:** Hero H1 & lead text render immediately (0ms delay, no `opacity: 0` start). Single clean accent word instead of dated multi-word gradient. |
| D9 | Single unified search | **Resolved:** Hero search input is primary; `/` is the global shortcut; header button focuses it. |
| D10| Remove "How It Works" & Scroll Animations | **Resolved:** Removed redundant 3-step section and scroll-triggered fade-up observers. |
| D11| Zero-CLS AdSense placeholder | **Resolved:** Pre-reserved slot (728×90 / 300×250) placed between Category 2 & 3. |

## 11. Build plan (for the coding task)

1. `src/lib/tools-catalog.ts` + test (catalog ↔ routes consistency).
2. `src/components/icons/Icons.tsx` — SVG line icon set (no emojis).
3. Tokens: add Section 3 tokens to `tokens.css` (phased scoped rollout for Home, Header, Footer).
4. Components in `src/components/home/`: `HomeHero`, `ToolSearch` (single unified component), `TrustStrip`, `SectionHeader`, `ToolCard` (+ mobile variant via CSS), `CategorySection`, `AdPlaceholder`, `WhyUs`, `GuidesStrip`, `SuggestBanner`.
5. Rewrite `src/app/page.tsx` + `page.module.css` (clean semantic HTML, zero inline styling).
6. Header: glass bar, mega menu from catalog (max 5 tools per category), `/` search trigger; `MobileMenu` portal drawer with accordions.
7. Footer: dark layout from catalog with dedicated "More Tools & Utilities" and "Company" columns.
8. Update `/tools/` (`ToolsDirectory.tsx`) to use the same catalog and `ToolCard`.
9. Verify: `npm run verify`, screenshots at 390 / 768 / 1280 px in light and dark, keyboard pass (`/` search, Esc, Tab), reduced-motion pass, update `docs/00-PROJECT-STATUS.md` and `docs/03-PAGES-AND-DESIGN.md`.

## 12. Acceptance checklist

- [ ] Hero shows headline with single accent word, instant LCP render (0ms delay), unified search (`/` shortcut), chips, two CTAs; result-card numbers computed from engines.
- [ ] New & Updated row highlights fresh additions; no duplicated category cards.
- [ ] Every category section shows exactly 4 medium cards (Business & Creative includes "Browse All Tools" + "Suggest a Tool").
- [ ] Pre-reserved AdSense placeholder slot established without external scripts (zero CLS).
- [ ] Cards: min-height 188px, 4 per row ≥ 1100px, 2 per row tablet, compact rows on mobile.
- [ ] Header mega menu caps at max 5 tools per category with "View all" links.
- [ ] Footer dark (`#0B1220`), structured into distinct tool, utility, and company columns.
- [ ] No scroll-triggered section entrance animations; micro-interactions only.
- [ ] No emojis used as icons; one cohesive SVG icon set.
- [ ] No fake numbers, ratings, testimonials or “popular” claims.
- [ ] `npm run verify` passes (lint, tests, no-network, build, SEO audit).
- [ ] Light and dark screenshots reviewed at 390, 768 and 1280 px.
