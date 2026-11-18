# Tool Shell Rollout — Builder Prompt (Antigravity / Gemini)

> **Goal:** give every calculator's **tool area** the gradient "hero band" design that is live on `/percentage-change-calculator/`, using **one shared template**, not 43 copies of CSS.
> **Reference page (the look to match):** `/percentage-change-calculator/`. Its current code is in
> `src/components/tool/percentage-change-calculator/PercentageChangeCalculator.tsx` + `.module.css` (bottom half of the CSS, after the comment "Gradient hero shell") and `src/app/percentage-change-calculator/page.tsx` + `page.module.css` (block "Display typography for this page").
> **Written:** 2026-11-18

---

## 0. Read first, and obey

1. Read `AGENTS.md`, `CLAUDE.md` and this whole file before touching code.
2. **graphify:** run `graphify query "<question>"` before searching code. graphify is not on PATH; run it as `$(ls ~/AppData/Roaming/Python/*/Scripts/graphify.exe | head -1)`. After code changes, run `graphify update .`.
3. **Do not change:**
   - page text, H1, title or meta;
   - JSON-LD, FAQ content;
   - engines (`src/lib/*-engine.ts`) and their tests;
   - URLs, `#hash` and `?tab=` behaviour;
   - AdSlot positions (ads stay **outside** the band).
   This is a visual change only.
4. **Do not commit or push.** The owner does that.
5. **Run tests from PowerShell or the VS Code terminal, never Git Bash.** In Git Bash the drive letter comes through as lower-case `d:/`, so vitest loads modules twice. Every test file then fails with "Cannot read properties of undefined (reading 'config')". That is an environment problem, not a code bug.
6. If something in this file doesn't match the code you find, **stop and report it**. Don't guess.

---

## 1. What the design is (match exactly)

| Part | Spec |
|---|---|
| Band | Rounded box (radius 24px, 18px on phones) around the tool. Background `linear-gradient(115deg, #3b82f6 0%, #7c3aed 52%, #ec4899 100%)` + a soft white radial highlight top-left. Shadow `0 18px 48px -18px rgba(124,58,237,.55)`. Padding `28px 24px 24px` (phones `18px 12px 16px`). |
| Dark theme (`:root[data-theme='dark']`) | Gradient `#1d4ed8 → #5b21b6 → #be185d`, shadow `0 18px 48px -18px rgba(0,0,0,.7)`. |
| Surfaces inside the band (light theme only) | No pure white. `--surface: #f8f6ff`, `--surface-2: #f2eefd`, `--surface-hover: #ece6fc`, `--line: #e4ddf7`, `--input-bg: #fdfcff`. Inputs stay a touch lighter than their card. |
| Cards | `--radius-card: 18px`, `--shadow-card: 0 12px 32px -12px rgba(30,27,75,.35)`, border `rgba(255,255,255,.7)` (dark: `rgba(255,255,255,.08)`). |
| Tabs (tools that have modes) | Glass bar: `rgba(255,255,255,.16)` background, `rgba(255,255,255,.32)` border, `backdrop-filter: blur(8px)`, radius 14px. Tab text white 88%. Active tab = `#f8f6ff` pill (white in dark), text `#5b21b6`, shadow. **Left/right round slide buttons** (38px, 32px on phones) show only when there is more to scroll. The active tab scrolls into view. **The first tab must never be clipped.** |
| Feature pills | 3–4 small pills at the bottom of the band: `rgba(30,27,75,.28)` background, white text, 0.76rem, weight 600. |
| Trust line | Pill under the features: green dot + `100% free · No sign-up · Runs in your browser, nothing is uploaded`. |
| Fonts | **Lexend** for headings (H1 800, H2 700, H3 600), tabs, card titles, pills and buttons. Body text stays Inter. H2/H3 colour `#1e3a8a` (dark: `#c7d2fe`). |
| Print | Band background, shadow, padding, tabs, arrows, pills and trust line are all removed. |
| Reduced motion | No smooth scroll and no transitions. |

---

## 2. Architecture: build the template once (Batch 0)

**Speed rules (these are why we use a template):**
- `ToolShell` is a **server component**: no `'use client'`, no JS shipped.
- Only `TabSlider` is a client component, and only tools with modes use it.
- No new npm packages, no images, no web fonts other than the one Lexend file below.
- No JS-driven animation.
- CSS lives once in the shared modules. **Never copy band/tab/pill CSS into a tool's own CSS.**

### 2.1 Font: `src/lib/fonts.ts` (new)
```ts
import { Lexend } from 'next/font/google';

// One variable-font file shared by all tool pages. next/font downloads it at
// build time and self-hosts it: no runtime request to Google.
export const toolDisplayFont = Lexend({
  subsets: ['latin'],
  variable: '--font-tool-display',
  display: 'swap',
});
```
- **Don't pass `weight`.** Without it, Lexend ships as one variable file covering every weight.
- Don't add this font to `src/app/layout.tsx`. That would preload it on the home page and blog pages, which don't use it.

### 2.2 Page typography: `src/styles/tool-typography.module.css` (new)
- Move the "Display typography for this page" block out of `src/app/percentage-change-calculator/page.module.css` into this file as a `.scope` class.
- Use `var(--font-tool-display, var(--font-heading))` everywhere the old block used `--pc-display` / `--font-pc-display`.
- It covers `:is(h1,h2,h3,h4)` family and letter-spacing, H1 800, H2 700 + navy, H3 600 + navy, `th`/`summary` in Lexend 600, and the dark-theme navy override.

Each tool page's `<main>` becomes:
```tsx
<main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
```

### 2.3 `src/components/tool/shared/ToolShell.tsx` + `ToolShell.module.css` (new, server component)
```tsx
interface ToolShellProps {
  features: string[];      // 3–4 short, TRUE statements about this tool (rules in §4)
  children: React.ReactNode;
  showTrust?: boolean;     // default true
}
```
Markup:
```tsx
<div className={styles.band}>
  {children}
  <ul className={styles.featureRow} aria-label="Calculator features">
    {features.map((f) => (
      <li key={f} className={styles.featurePill}>{f}</li>
    ))}
  </ul>
  {showTrust && (
    <p className={styles.trustPill}>
      <span className={styles.trustDot} aria-hidden="true" />
      100% free · No sign-up · Runs in your browser, nothing is uploaded
    </p>
  )}
</div>
```

`ToolShell.module.css` contains:
- the band background, padding, radius and shadow (§1);
- **the token overrides on `.band`** (light theme via `:global(:root:not([data-theme='dark'])) .band`):
  - `--surface`, `--surface-2`, `--surface-hover`, `--line`, `--input-bg`;
  - plus `--radius-card` and `--shadow-card` for both themes.
  - Because the tool components already use these tokens, this tints every card **without editing the tool's CSS**.
- the feature pills, trust line, dark theme, phone, print and reduced-motion rules;
- `.band :is(h2, h3, h4, [role='tab'], th, button) { font-family: var(--font-tool-display, var(--font-heading)); }`. Inputs keep Inter.
- `.band { min-width: 0; max-width: 100%; }`, so wide tables inside a tool still scroll inside their own box and never make the page scroll sideways.

**Page usage** (in `src/app/<slug>/page.tsx`):
```tsx
<AdSlot slotId="before-calculator" />
<section className={styles.toolSection} aria-label="…">
  <ToolShell features={['…', '…', '…']}>
    <XCalculator />
  </ToolShell>
</section>
<AdSlot slotId="after-calculator" />
```

### 2.4 `src/components/tool/shared/TabSlider.tsx` + `TabSlider.module.css` (new, `'use client'`)
```tsx
interface TabSliderProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeId: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}
```
Lift the behaviour from the Percentage Change component as it is now:
- `tabsScrollRef`; `canScrollLeft` / `canScrollRight` updated on scroll + resize (passive listener, cleaned up);
- arrow buttons use `hidden={!canScroll…}` with `aria-label` "Show previous/more modes";
- `scrollBy(±max(160, 60% of width))`;
- `useEffect` on `activeId` that scrolls the active tab to the centre;
- `role="tablist"` / `role="tab"` / `aria-selected`;
- plus: **ArrowLeft/ArrowRight keys** move to the previous/next tab and call `onChange`.

**The clipping fix (must keep):** the scroller is `justify-content: flex-start`; the inner bar is centred with `margin-inline: auto`.
- **Never** put `justify-content: center` on the scrolling element.
- Reason: when the bar overflows, centring pushes the first tabs off the left edge, where they can't be scrolled to.
- Also: `.tabArrow[hidden] { display: none; }`.

The tool keeps owning its state. It only swaps its own tab-bar markup for:
```tsx
<TabSlider
  tabs={TABS}
  activeId={activeTab}
  onChange={handleTabChange}
  ariaLabel="… modes"
/>
```

### 2.5 Migrate Percentage Change to the template (no visual change)

**Component** (`PercentageChangeCalculator`):
- Remove the inline tab bar, the arrow buttons, the scroll state/effects, the feature `<ul>` and the trust `<p>`, and use `TabSlider` instead.
- Delete the now-unused CSS rules from its module:
  - band / `.wrap` gradient;
  - glass tabs, `.tabsShell`, `.tabArrow*`;
  - `.featureRow` / `.featurePill`, `.trustPill` / `.trustDot`;
  - the surface-token tint block;
  - the font rules that ToolShell now covers.
- Keep its own extras: indigo `.wrap .hero`, `.wrap .card` border, input focus colour.

**Page:**
- Wrap the component in `ToolShell` with its features:
  - `8 calculators in one`
  - `Step-by-step working`
  - `Excel & Sheets formula`
  - `Phone, tablet & PC`
- Switch `<main>` to `toolDisplayFont.variable` + `typo.scope`.
- Delete the page-local `Lexend(...)` call and the old typography block.

The pills now sit at the bottom of the band, above the trust line, like the reference screenshot. That move is intended.

**Check:** the page must look the same as before (apart from the pill position) in light and dark at 390px, 768px and 1280px.

**➡ STOP after Batch 0. Report back to the owner, with screenshots if you can, and wait for an OK before Batch 1.**

---

## 3. Rollout batches (after the owner OKs Batch 0)

For every tool in every batch:
1. **Page:** wrap the calculator in `ToolShell` (features per §4) and add the font + typography classes to `<main>`.
2. **Tabs:** if the tool has a mode/tab bar (`role="tablist"`, or a row of mode buttons that switches the whole form), replace that bar with `TabSlider`.
   - Small in-card toggles stay as they are, e.g. ft/m, a single on/off switch, or "Area vs Dimensions" inside one card.
   - If a tool's tabs drive `#hash` or `?tab=`, keep that logic in the tool's `onChange`.
3. **Contrast check:** nothing may sit directly on the gradient with dark text. If the tool has headings, labels, notes or buttons outside any card, either move them into a card or make the tool's root a single card.
4. **Hard-coded white:** replace `background: #fff | #ffffff | white` in the tool's CSS with `var(--surface)` (or `var(--input-bg)` for inputs) so the tint applies. Also replace hard-coded `#f8fafc` / `#f1f5f9` panels with `var(--surface-2)`.
5. **Remove clashes:** delete a tool's own outer page-width background, border or shadow on its root if it now doubles up with the band.

| Batch | Tools (`src/components/tool/<dir>`) | Notes |
|---|---|---|
| **1 · Business (have tabs)** | markup-calculator, profit-margin-calculator, unit-price-calculator, hourly-to-salary-calculator, discount-calculator | All use tokens; replace each tab bar with `TabSlider`. |
| **2 · Other tabbed** | carpet-cost-calculator, roof-replacement-cost-calculator, linear-foot-calculator, sand-calculator, square-footage-calculator | square-footage also has 7 hard-coded white backgrounds (step 4). |
| **3 · Token-based, no tab bar** | asphalt, bathroom-remodel, board-batten, cubic-inch, cubic-square-converter, cubic-yard, deck-cost, deck-stain, drywall, fence-cost, fill-dirt, floor-refinishing, lawn-mowing, metal-roof, pipe-volume, rafter, rebar, shingle, slab-cost, wire-gauge (each `-calculator`) | Usually a page wrap only. Check for a mode toggle that should become `TabSlider`. |
| **4 · Hard-coded white** | brick, cinder-block, compost, concrete, fence-stain, laminate, paint, paver-base, paver-sand, stone, stud, tile (each `-calculator`), tons-yards-converter | Step 4 needed on all of them. |
| **Not in this rollout** | band-name-generator (different section), construction-estimate (document editor), shared/ | Ask the owner before touching. |

Total: 43 tools + the reference page.

After **each** batch, run:
- `npm run verify` (PowerShell) → all 6 steps pass;
- `graphify update .`;
- the visual checklist (§5) for every tool in the batch.

Fix anything that fails before starting the next batch.

---

## 4. Feature pill rules (no mistakes here: it's a trust/SEO issue)

- **3–4 pills per tool, each ≤ 24 characters, each provably true from that tool's code.** Read the component before writing them.
  - Good: `Imperial & metric`, `Waste factor included`, `Material cost estimate`, `Step-by-step working`, `Print & share link`, `Phone, tablet & PC`.
- **Forbidden:**
  - star ratings, review or user counts ("4.9/5", "14,820 reviews", "1M users");
  - "#1", "best", "most accurate", "certified", "engineer-verified", "AI";
  - any feature the tool doesn't have.
  - Adding a fake rating to the page or to JSON-LD is a Google policy violation. **Never add `aggregateRating`.**
- The trust line text is fixed (§2.3). It is true for every tool here because `check:no-network` passes. If a tool ever makes a network request, set `showTrust={false}` and tell the owner.
- **Put the pills you chose in a table in your report.**

---

## 5. Visual checklist (each tool, record the result)

Check light **and** dark, at **390px, 768px and 1280px**:
- [ ] No horizontal page scroll. Wide tables scroll inside their own box.
- [ ] First tab fully visible. Arrows appear and disappear correctly. The active tab scrolls into view. ArrowLeft/Right keys work.
- [ ] No pure-white card in light mode. Inputs readable and a little lighter than their card.
- [ ] No dark text directly on the gradient. Pills and trust line readable.
- [ ] Results, diagrams and SVGs still readable on the tinted surface. If a diagram hard-codes white fills, switch them to `var(--surface)`.
- [ ] Print preview: no gradient, no tabs, no pills.
- [ ] Ads still outside the band. The page H1, intro and article are unchanged.

Record one row per tool in `docs/evidence/tool-shell-rollout.md`:

| Tool | Batch | Pills | Tabs → TabSlider? | White fixes | 390/768/1280 light | dark | Notes |
|---|---|---|---|---|---|---|---|

---

## 6. Docs (end of every batch)

- `docs/06-CHANGELOG.md`: a new top entry per batch (what changed, which tools, verify result).
- `docs/00-PROJECT-STATUS.md`: the rollout status line (Batch N of 4 done).
- **Don't tick anything without evidence** (a verify pass and checklist rows).

## 7. Definition of done

- [ ] `ToolShell`, `TabSlider`, `fonts.ts` and `tool-typography.module.css` exist and are used by all 44 tool pages.
- [ ] No tool CSS module contains band, glass-tab, pill or trust CSS (grep `linear-gradient(115deg` and `trustPill`: only the shared files should match).
- [ ] Lexend is loaded once (from `src/lib/fonts.ts`) and not in `layout.tsx`. No page has its own `Lexend(` call.
- [ ] `npm run verify` passes from PowerShell; `graphify update .` run.
- [ ] `docs/evidence/tool-shell-rollout.md` has a row for every tool.
- [ ] Nothing committed or pushed.
