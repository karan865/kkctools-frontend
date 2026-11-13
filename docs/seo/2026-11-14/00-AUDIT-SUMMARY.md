# SEO Audit — https://www.kkctools.com/ — 2026-11-14

Business type: free browser-based tools site (utility/publisher hybrid). Not local, not e-commerce.
Sources: 10 parallel sub-audits (detail files in this folder). No Google Search Console/CrUX, Moz, or drift baseline available.

## SEO Health Score: 72 / 100

| Category | Weight | Score | Source |
|---|---|---|---|
| Technical SEO | 22% | 82 | technical.md |
| Content Quality | 23% | 62 | content.md |
| On-Page SEO | 20% | 74 | content.md |
| Schema | 10% | 62 | schema.md |
| Performance (lab) | 10% | 80 | performance.md |
| AI Search Readiness | 10% | 64 | geo.md |
| Images | 5% | 90 (provisional, no screenshots) | visual.md |

Weighted: 18.0 + 14.3 + 14.8 + 6.2 + 8.0 + 6.4 + 4.5 = 72.2

## Synthesis

Crawl and index foundations are solid: static HTML, self-canonicals, real 404s, a clean sitemap, HSTS, and LCP/CLS passing in lab. The losses come from three root causes rather than many separate bugs:

1. **Deploy drift.** The repo is ahead of production. Concrete, drywall and rebar calculators 404 on the live site. llms.txt links 3 calculators that never existed live (topsoil, gravel, mulch).
2. **Identity mismatch.** About 75% of the catalogue is construction calculators. The homepage, /tools/, About, Contact and /guides/ still describe a band-name / "creative utilities" / text-tools site. Nobody is named as running the site, and several claims on live pages can't be verified. That conflicts with AGENTS.md rule 3.
3. **Authority vacuum.** The domain is absent from the Common Crawl web graph. There are no sameAs links, no named author, and no outbound sources on calculators.

## Findings

### Critical
None. Nothing blocks indexing.

### High
| # | Finding | Evidence | Fix |
|---|---|---|---|
| H1 | 3 calculators not deployed | /concrete-calculator/, /drywall-calculator/, /rebar-calculator/ return 404; they exist in src/app and routes.ts; sitemap lists 37 URLs, not 40 | Deploy latest build; confirm sitemap = 40 URLs; update llms.txt |
| H2 | Claims that can't be verified (also breaks AGENTS.md rule 3) | "Millions of building contractors…" (estimate template); "contractor-verified material bulk densities" (tons-to-cubic-yards); "verified manufacturer coverage benchmarks" (paint); About: "thousands of hand-curated vocabulary entries", "database of hundreds of… famous musical acts"; "0ms server lag" (8 pages); unlinked "Angi… report" (tile) | Remove, soften, or cite with real links; check About counts against the code |
| H3 | Homepage, hub and About pages describe the wrong site | Title "Free Online Generators & Tools" (no brand); 8/9 featured tools are calculators but the hero, How It Works and FAQ are band-only; About/Contact mention non-existent text tools; SXO gap score 44 | Re-position as calculators + generators; split category hubs (Construction Calculators / Name Generators) |
| H4 | No named owner/author; Organization schema is bare | About says "KKC Tools Team"; Organization has no logo/sameAs/description; Article author = Organization | TODO(owner): real name/background, logo, real profile URLs. Then add Person + sameAs |
| H5 | Schema graph disconnected | No @id anywhere; /about/ emits a duplicate Organization; WebSite has no publisher | Single @graph with #organization/#website/#webpage refs (templates in schema.md) |

### Medium
| # | Finding | Fix |
|---|---|---|
| M1 | Mobile TBT high: band generator 980 ms, sq-ft 710 ms (INP risk) | Defer/split hydration of tool components; break long tasks in the shared chunk |
| M2 | Netlify injects `/.netlify/scripts/hud?variant=public` (confirmed in served HTML) — against the zero-third-party-script rule | Disable Netlify Drawer / collaboration toolbar for production in Netlify site settings |
| M3 | llms.txt: 3 dead links, missing 5 live calculators, 6 genre pages and 3 guides | Generate llms.txt from INDEXABLE_ROUTES at build |
| M4 | Duplicate FAQPage block on /square-footage-calculator/; inconsistent WebApplication fields (metal page, square-footage, brick); breadcrumb parent labelled 3 ways; no BreadcrumbList on paver-sand, paver-base, compost, fence-stain | One shared tool-page schema template |
| M5 | Formula sourcing uneven; "Last updated" on only ~8 calculators | Standard "How we calculate" block: formula, defaults, source link, date |
| M6 | Brick calculator is imperial-only, but about half the top results are UK/metric | Add a metric mode (bricks per m²) |
| M7 | Genre-page prose is overwritten (Flesch 12.9–21.5) | Rewrite in plain language |
| M8 | Guides are 1,129–1,453 words; /guides/ is 211 words; no construction guides | Expand; add calculator guides (Concrete blog already in git history) |
| M9 | No CSP header; HSTS has no includeSubDomains/preload | Add to Netlify `_headers` (no third-party scripts, so a strict CSP is feasible) |

### Low
- The tons-to-cubic-yards title shows the brand twice ("| KKCTools | KKC Tools").
- Inconsistent H1 style; sq-ft H1 leads with "Sqft" rather than "Square Footage".
- Every page uses the same OG image.
- No IndexNow key.
- Sitemap has priority/changefreq tags (Google ignores them).
- 6 pages lack an explicit robots meta tag.
- The square-footage waste chips lack aria-pressed/radiogroup, and the "Waste Allowance" label isn't linked to them.
- Homepage doesn't link 4 tools.
- 3 render-blocking CSS files; 90 KB of fonts.

### Info
- FAQPage on 5 pages: Google retired FAQ rich results on 2026-05-07, so there's no SERP benefit. Leave as is.
- Duplication passes easily: metal vs heavy-metal Jaccard 0.049; every pair is under 0.07 against the 0.30 limit.
- Bing site verification meta is present. Search Console status unknown.

## Action plan (dependency order)

| Step | Action | Depends on | How we'd know it failed | Leading indicator |
|---|---|---|---|---|
| 1 | Deploy latest build (H1), fix the llms.txt generator (M3) | — | Any of the 3 URLs still returns 404; sitemap ≠ 40 | URLs appear as Discovered/Indexed in GSC/Bing within 1–2 weeks |
| 2 | Remove or cite unverifiable claims (H2) | — | `grep` for the quoted phrases still matches | — (compliance) |
| 3 | Owner supplies identity facts (H4) → Organization @graph (H5) | Owner input | Rich Results Test still shows a separate Organization; no sameAs | Brand query shows a knowledge panel or sitelinks |
| 4 | Reposition homepage, /tools/, About, Contact; add category hubs (H3) | 2, 3 | Homepage impressions stay concentrated on band queries | GSC impressions for "calculator" queries on the homepage and hubs |
| 5 | Shared tool-page schema + "How we calculate" template (M4, M5) | 3 | Schema validator errors; duplicate FAQ persists | Fewer Search Console enhancement warnings |
| 6 | Disable Netlify HUD (M2); reduce hydration cost (M1) | — | `curl … | grep hud` still matches; mobile TBT > 600 ms | Lighthouse mobile TBT; CrUX INP once traffic exists |
| 7 | Content expansion: metric brick mode, construction guides, plain-language genre pages (M6–M8) | 4 | No ranking movement after 8 weeks | Average position for "brick calculator" / UK queries |
| 8 | Register GSC, add a Moz key, begin link acquisition | 1 | Still absent from the next Common Crawl release | Referring domains in GSC Links report |

## Coverage gaps
- Screenshots and Lighthouse Agentic Browsing didn't run: Chromium failed to launch from the subagent ("spawn UNKNOWN"), and the keyless PSI API hit its daily limit (HTTP 429).
- Performance is one local Lighthouse CLI run per page, lab only, with no field INP.
- SERP analysis used the web search tool rather than live Google results, so page-type shares are estimates.
- Backlink data: insufficient. The domain isn't in Common Crawl cc-main-2026-aug-sep-oct.
