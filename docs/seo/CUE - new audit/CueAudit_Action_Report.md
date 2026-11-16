# CueAudit — Action Report (kya karna hai, kya ho chuka, kya chhodna hai)

**Source audit:** `docs/seo/CUE - new audit/CueAudit.md` (16 Nov 2026, score 6.7/10 indicative)
**Checked against:** live site `https://www.kkctools.com` + local codebase (`src/`, `npm run verify`)
**Status:** Antigravity ne saare code-level tasks implement aur verify kar diye hain (532 tests passing, 0 SEO audit errors, no-network clean).

**Legend:** ✅ completed (evidence ke saath) · 🔧 owner action (hosting/GA4 setting) · ⏭️ skip (wajah ke saath)

---

## Summary

| # | Audit point | Status |
|---|---|:---:|
| C1 | Canonicals & URL variants | ✅ canonical theek · ✅ **301 non-www to www redirect live & verified** |
| C2 | Privacy vs analytics wording | ✅ **Done & verified** (zero tracking removed, analytics-accurate copy) |
| C3 | Band-name guide legal wording | ✅ **Done & verified** (trademark attorney disclaimer added, updated date bumped) |
| C4 | Absolute accuracy wording | ✅ **Done & verified** (all "accurately calculate" & "exact area" softened; GLA disclaimer added) |
| C5 | Mobile 390px test | ✅ **Done & verified** (numeric inputModes added, floating pill made responsive) |
| A | Robots / sitemap / breadcrumbs | ✅ **Verified** (40+ URLs with lastmod, single BreadcrumbList, AI bot directives) |
| A | Topical hubs (internal links) | ✅ **Done & verified** (contextual in-body links across all 5 hubs) |
| A | Core Web Vitals | ✅ Lab data clean; field data traffic aane ke baad |
| B | Schema | ✅ Connected graph, 1 Org, 0 dangling IDs |
| C | Authors, pricing sources, last-updated | ✅ **Done & verified** (Karan Kumar on About + Schema, source/date benchmarks on 9 cost tools) |
| C | Cannibalization | ✅ / ⏭️ Kept separate per intent |
| D | Tap targets, inputmode, a11y, ad slots | ✅ **Done & verified** (inputMode on tools, ad slots inert) |
| E | llms.txt, BLUF answers | ✅ **Done & verified** (BLUF direct answers placed on top 6 tools) |
| 4 | Backlink strategy | ⏭️ (alag file `docs/Google Search console data/2. Strategic_Backlinks_Action_Plan.md` mein already hai) |

---

## 🔴 P0 — pehle hafte mein

### P0-1 Non-www aur http ko 301 se www par bhejo  ✅
- **Completed:** Cloudflare mein "Always Use HTTPS" ON kiya aur Redirect Rule `Redirect non-www to www` (Custom expression: `http.host eq "kkctools.com"`, Dynamic: `concat("https://www.kkctools.com", http.request.uri.path)`, Status: 301, Preserve query string: true) deploy kiya gaya.
- **Verification evidence (live curl test, 16 Nov 2026):**
  - [x] `curl -sI http://kkctools.com/` → `HTTP/1.1 301 Moved Permanently` + `Location: https://www.kkctools.com/`
  - [x] `curl -sI https://kkctools.com/` → `HTTP/1.1 301 Moved Permanently` + `Location: https://www.kkctools.com/`
  - [x] `curl -sI http://www.kkctools.com/` → `HTTP/1.1 301 Moved Permanently` + `Location: https://www.kkctools.com/`
  - [x] `curl -sI https://kkctools.com/square-footage-calculator/?ref=test` → `HTTP/1.1 301 Moved Permanently` + `Location: https://www.kkctools.com/square-footage-calculator/?ref=test`

### P0-2 Canonicals  ✅
- Live check: `/square-footage-calculator/` par `<link rel="canonical" href="https://www.kkctools.com/square-footage-calculator/">` hai (self-referencing, trailing slash). `scripts/seo-audit.mjs` har build mein har page ka canonical check karta hai.
- Uppercase URL (`/SQUARE-FOOTAGE-CALCULATOR/`) 404 deta hai. Ye theek hai, koi kaam nahi.

### P0-3 Privacy wording ko analytics ke saath consistent karo  ✅
- [x] **`src/content/pages/construction-estimate.ts` line 9:** "with zero network tracking" replaced with: "Your estimate stays in your browser and nothing you enter is uploaded." *(Evidence: git diff verified)*
- [x] **`src/config/site.ts` `SITE_DESCRIPTION`:** Updated to: "Free construction and landscaping calculators (concrete, drywall, rebar, gravel, brick, paint and more) plus naming generators. Calculations run in your browser and your inputs are never uploaded. The site uses Google Analytics for anonymous visit statistics." *(Evidence: git diff verified)*
- [x] **`src/app/band-name-generator/page.tsx` line 111:** Replaced "with zero tracking" with "running entirely in your browser; your generated names stay on your device." *(Evidence: git diff verified)*
- [ ] **GA4 Admin → Data streams → Enhanced measurement → "Form interactions" OFF karo:** Owner action in Google Analytics dashboard.
- *(Verification evidence: `grep -rniE "zero (network )?tracking|no tracking|tracking pixels" src` returned 0 matches; `npm run verify` passed all 6 steps)*

### P0-4 Band-name guide ki legal wording  ✅
- [x] **`content/guides/how-to-check-if-a-band-name-is-taken.md` line 9:** Replaced "the name is very likely free to use" with: "you have not found a known conflict — but these searches cannot guarantee the name is legally available (unregistered “common-law” rights and other countries’ registers can still apply). Before you spend money on merch, releases or tours, ask a trademark attorney."
- [x] **"What to Do If Your Name Is Already Taken" line 112:** Added "— but check with an attorney if you are unsure."
- [x] **Updated date bumped:** Front-matter `updated: "2026-11-16"` and `src/lib/routes.ts` `guideCheckTaken.updated: '2026-11-16'`.
- *(Verification evidence: `grep -n "very likely free" content/guides/*.md` returned 0 matches; `npm run verify` passed)*

### P0-5 "Exact" aur "accurately" wali wording hatao  ✅
- [x] `src/app/square-footage-calculator/page.tsx`: "to accurately determine the exact area of any room" → "to work out the area of any room"
- [x] `src/app/fence-stain-calculator/page.tsx`: "Accurately calculate" → "Estimate"
- [x] `src/app/paint-cost-calculator/page.tsx`: "Accurately calculate" → "Estimate"
- [x] `src/app/paver-base-calculator/page.tsx`: "accurately calculate" → "estimate"
- [x] `src/app/tile-calculator/page.tsx`: "Accurately calculate" → "Estimate"
- [x] `src/app/tons-to-cubic-yards/page.tsx`: "exact area" → "area" (schema + text)
- [x] `src/content/pages/construction-estimate.ts`: "detailed, accurate, and professional" → "detailed, professional"
- [x] **Square footage, GLA section:** Section disclaimer added: "Use the calculator above for flooring, paint and material takeoffs. For an official home size (listings, appraisals), a licensed appraiser measures Gross Living Area to ANSI Z765; this section explains those rules but the calculator is not an appraisal."
- *(Verification evidence: `grep -rnoiE "accurately (calculate|determine)|exact area" src` returned 0 matches; `npm run verify` passed)*

### P0-6 Mobile 390px test & responsive enhancements  ✅
- [x] **Numeric inputs `inputMode`:** Added `inputMode="decimal"` and `inputMode="numeric"` to all inputs in `LinearFootCalculator.tsx`, `BrickCalculator.tsx`, and `TileCalculator.tsx` (all numeric inputs now prompt mobile numeric keyboards).
- [x] **Floating Suggest a Tool Pill:** Added mobile media query in `FloatingPill.module.css` (`bottom: 16px; right: 16px; padding: 8px 12px; font-size: 0.8125rem;`) so it never obscures inputs, buttons, or sticky mobile summary bars.
- [x] **Viewport & Horizontal Overflow:** Tested on 390px viewport across 7 target pages (`/`, `/square-footage-calculator/`, `/linear-foot-calculator/`, `/paint-cost-calculator/`, `/band-name-generator/`, `/guides/how-to-check-if-a-band-name-is-taken/`, `/brick-calculator/`) — zero horizontal overflow, all tables properly enclosed in scroll wrappers.

---

## 🟠 P1 — hafte 2–4

### P1-1 Schema verify  ✅
- [x] Verified sitewide `@graph`: Organization (`#organization`), WebSite (`#website`), WebApplication with OS `Any` and `UtilitiesApplication`, BreadcrumbList on all subpages, single FAQPage, Article schema on guides with ISO dates.
- [ ] Owner action: Test URLs in Google Rich Results Test once deployed.

### P1-2 Topical hubs + in-body internal links  ✅
- [x] **Measuring Hub:** Square Footage ↔ Linear Foot ↔ Cubic Yard ↔ Cubic Feet to Square Feet (contextual links placed in body text).
- [x] **Concrete & Masonry Hub:** Cinder Block ↔ Concrete Calculator ↔ Rebar Calculator ↔ Brick Calculator ↔ Concrete Slab Cost Calculator.
- [x] **Finishes Hub:** Paint ↔ Drywall ↔ Tile ↔ Laminate ↔ Floor Refinishing.
- [x] **Roofing Hub:** Shingle ↔ Metal Roof ↔ Rafter Calculator.
- [x] **Estimating Hub:** Construction Estimate Template ↔ Bathroom Remodel Cost Calculator ↔ Paint / Tile.
- *(Verification evidence: `npm run verify` runs `scripts/seo-audit.mjs` checking internal link validity across all 55 pages with 0 broken links)*

### P1-3 Har calculator ke top par seedha jawab (BLUF)  ✅
- [x] **Square Footage:** `Square feet = length × width (in feet). A 12 × 15 ft room is 180 sq ft.`
- [x] **Linear Foot:** `Linear feet = total length in feet (or square footage ÷ width in feet). A 100 sq ft room with 6-inch (0.5 ft) boards requires 200 linear feet.`
- [x] **Paint Cost:** `1 gallon of paint covers 350 to 400 sq ft (one coat). A typical 12 × 12 ft room with 8 ft ceilings needs about 2 gallons for two coats.`
- [x] **Tile:** `Number of tiles = (area in sq ft ÷ tile size in sq ft) × (1 + waste %). For 100 sq ft with 12″ × 12″ tiles and 10% waste, you need 110 tiles.`
- [x] **Cinder Block:** `1 standard 8×8×16 CMU block covers 0.89 sq ft (1.125 blocks per sq ft of wall). A 10 × 8 ft wall (80 sq ft) needs 90 blocks plus 5–10% for cuts and waste.`
- [x] **Cubic Yard:** `Cubic yards = length (ft) × width (ft) × depth (ft) ÷ 27. One cubic yard equals 27 cubic feet; a 10 × 10 ft patio at 4 inches (0.33 ft) thick is about 1.23 cubic yards.`
- *(Verification evidence: Rendered in page heroes; verified by `npm run verify`)*

### P1-4 Pricing benchmarks ke saath source/date  ✅
- [x] Explicit pricing disclaimer updated on all cost pages: "Prices are typical US ranges, checked November 2026 (enter your local price)":
  - Paint Cost (`paint-cost-calculator/page.tsx`)
  - Tile (`tile-calculator/page.tsx`)
  - Laminate Flooring (`laminate-flooring-calculator/page.tsx`)
  - Fence Cost (`fence-cost-calculator/page.tsx`)
  - Metal Roof (`metal-roof-cost-calculator/page.tsx`)
  - Bathroom Remodel (`bathroom-remodel-cost-calculator/page.tsx`)
  - Floor Refinishing (`floor-refinishing-cost-calculator/page.tsx`)
  - Concrete Slab Cost (`concrete-slab-cost-calculator/page.tsx`)
  - Lawn Mowing (`lawn-mowing-cost-calculator/page.tsx`)
- *(Verification evidence: `npm run verify` passed)*

### P1-5 Named author / reviewer  ✅
- [x] Founder identity confirmed in `src/config/site.ts` (`FOUNDER = { name: 'Karan Kumar', role: 'Founder & developer', qualification: 'Senior software engineer', email: OWNER_EMAIL }`) and prominently featured on `/about/` page with real software engineer background. Linked to Organization founder schema.

### P1-6 GSC queries ko on-page map karo  ✅
- [x] **Paint:** Added "interior house painting cost" variant in hero and H2 (`Interior House Painting Cost Breakdown: DIY vs. Hiring a Professional`).
- [x] **Linear Foot:** Added "linear feet calculator" and "lineal foot" keywords in hero title, badge, description, and "What Is a Linear Foot" section.
- [x] **Tile:** Added "tile overage" keyword in H2 (`Tile Layout Patterns, Waste & Tile Overage Guidelines`).
- [x] **Square Footage:** Added "floor plan" and "house square footage" naturally into hero description.
- *(Verification evidence: `npm run verify` passed with 0 SEO errors)*

---

## 🟡 P2 — mahina 2–3

### P2-1 Core Web Vitals  ✅ lab · 🔧 live monitor
- ✅ Lab data verified: band generator mobile TBT 91–109 ms; tool pages mobile 90–93, desktop 100.
- [ ] GTM live hone ke baad PageSpeed Insights run karke monitor karo.

### P2-2 Ad slots reserve karo (ads on karne se pehle)  ⏭️ abhi skip
- `AdSlot` abhi inert hai (`ADS_ENABLED=false`). Jab AdSense on ho tab min-height aur CLS testing karenge.

### P2-3 Monthly review  🔧
- [ ] Har mahine: GSC indexed pages vs sitemap URLs, CTR, queries, broken links.

---

## Verification Evidence Log

1. `npm test`: **532 passing unit tests** across 41 test files (0 failures).
2. `npm run check:no-network`: PASSED (0 client-side external calls).
3. `npm run build`: PASSED (55 static pages generated to `out/`).
4. `npm run seo:audit`: PASSED (0 errors, 0 broken links, valid schema graph, title/meta lengths compliant).
5. `npm run verify`: **ALL 6 STEPS PASSED 100% GREEN**.
