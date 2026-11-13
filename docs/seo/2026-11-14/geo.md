# GEO / AI Search Readiness - kkctools.com (audited 2026-11-14)

## Score: 64 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 72 | 18.0 |
| Structural Readability | 20% | 80 | 16.0 |
| Multi-Modal Content | 15% | 45 | 6.75 |
| Authority & Brand Signals | 20% | 30 | 6.0 |
| Technical Accessibility | 20% | 85 | 17.0 |
| **Total** | | | **~64** |

## AI crawler access (robots.txt)
`User-Agent: *` Allow `/` plus an explicit Allow group for GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended.
- OAI-SearchBot (ChatGPT Search): allowed via wildcard
- Claude-SearchBot (Claude search): allowed via wildcard
- PerplexityBot: allowed explicitly
- Googlebot (AI Overviews / AI Mode): allowed via wildcard
- Bingbot (Copilot): allowed via wildcard
- GPTBot, ClaudeBot (training only): allowed. They do not control search citation.
- Google-Extended (Gemini training/grounding, not AIO): allowed
- CCBot, Applebot-Extended, cohere-ai: allowed via wildcard (optional to block)
No X-Robots-Tag. Netlify static, fully SSR'd HTML (is_spa=false on all pages).

## llms.txt
Present (200), well formed. Problems:
- **Lists 3 dead URLs**: /topsoil-calculator/, /gravel-calculator/, /mulch-calculator/ all return 404.
- Leaves out the cubic-yard, paver-sand, paver-base, compost and fence-stain calculators, the 6 genre generator pages and all 3 guides.
- The positioning claim "high accuracy" has nothing to back it up.
Low priority: Google ignores llms.txt.

## Citability (page by page)
- **/brick-calculator/** (2,140 words): the strongest page. Question H2/H3s ("How Many Bricks Per Square Foot?"), explicit formulas (`144 / Nominal Face Area`; `6.857 bricks/sq ft` for modular with 3/8" joint, which checks out), a worked 20x8 wall example, 8 FAQs as H3s. There is a visible "Last updated: November 2026" line but no dateModified in the schema.
- **/square-footage-calculator/** (3,047 words): formulas for 6 shapes, a worked multi-room example, 4 conversion tables, and a clear definition in the first 60 words of "What Is Square Footage". **Two FAQPage JSON-LD blocks on one page** (duplicate entity). 8 `<details>` FAQs.
- **/band-name-generator/** (1,650 words): the intro answers directly. "What Makes a Good Band Name?" is citable. Genre sections are short and lean on navigation. One claim, "hand-picked ... by our editors", has no named editor.
- **/guides/how-to-choose-a-band-name/** (1,331 words): good step structure. The opening 3 paragraphs are rhetorical ("zero-fluff masterclass"), with no direct answer in the first 60 words. No statistics, no sources, and no outbound links to USPTO/trademark resources even though Step 5 covers trademarks. Article schema has the author as an Organization, dated 2026-11-08.
- **Sitewide:** 0 outbound citation links on all 6 sampled pages. Calculator figures (mortar per 1,000 bricks, pallet counts, GLA rules) are not attributed to sources such as BIA, ANSI Z765 or manufacturer spec sheets.

## Entity clarity / authority
- The About page says "developed and maintained by KKC Tools Team". No named person, no location, no founding date, and it does not say what "KKC" stands for.
- Organization schema has only name and url: no logo, sameAs, contactPoint or founder.
- The homepage `<title>` is "Free Online Generators & Tools" with no brand name.
- About copy is entirely about band names and text tools. It never mentions construction calculators, which are now most of the site, so the entity identity is split.
- No author or reviewer on the calculator pages. That is a YMYL-adjacent gap for cost and structural estimates (rafters, studs, rebar).

## Brand mentions
I could not verify any brand presence on Wikipedia, Reddit, YouTube or LinkedIn, and the site links to no profiles. Treat it as effectively zero. This is the biggest off-site gap: YouTube and Reddit mentions correlate most strongly with AI citation.

## Multi-modal
0 `<img>` on every sampled page. Tables are present (sqft 4, brick 2). Diagrams are inline SVG icons, apart from the rafter page, which the homepage says has a cross-section diagram. No video and no ImageObject.

## Top 5 changes (by impact)
1. **[High, ~2h]** Fix entity identity. Name a real owner or operator on /about/ (TODO(owner): needs owner facts, do not invent any). Widen About to cover construction tools. Add Organization logo, sameAs and contactPoint. Put "KKC Tools" in the homepage title.
2. **[High, 3-5h]** Cite primary sources on calculator pages (BIA Technical Notes, ANSI Z765, manufacturer coverage charts) with outbound links. Add a "Formula & sources" block to each calculator and dateModified in the WebApplication schema.
3. **[High, 30m]** Remove the 3 dead llms.txt URLs. Add the missing tools and guides. Generate llms.txt from the same route list as the sitemap.
4. **[Medium, 30m]** Merge the duplicate FAQPage JSON-LD on /square-footage-calculator/ into one block.
5. **[Medium, ongoing]** Off-site brand building: a YouTube walkthrough of the brick and sqft calculators, and genuine participation in r/DIY, r/Masonry and r/WeAreTheMusicMakers. Also tighten the guide intros to a 40-60 word direct answer, and add an annotated diagram image with alt text to each calculator.

## Platform scores (estimates)
- Google AIO: 60 (SSR, FAQ and formula blocks good; weak E-E-A-T)
- ChatGPT Search: 55 (needs brand and entity corroboration off-site)
- Perplexity: 65 (likes formula and table passages; missing sources hurt)
- Bing Copilot: 58 (no Bing-specific blockers; entity is thin)

## Structured findings (audit-data.json, AI Search Readiness)
```json
[
 {"id":"geo-entity-anon","severity":"high","title":"Operator unidentified ('KKC Tools Team'); Organization schema lacks sameAs/logo/founder","pages":["/about/","sitewide"]},
 {"id":"geo-no-citations","severity":"high","title":"Zero outbound source citations on calculator/guide pages","pages":["/brick-calculator/","/square-footage-calculator/","/guides/how-to-choose-a-band-name/"]},
 {"id":"geo-llms-404","severity":"medium","title":"llms.txt lists 3 URLs returning 404 and omits 11+ live pages","pages":["/llms.txt"]},
 {"id":"geo-dup-faqpage","severity":"medium","title":"Two FAQPage JSON-LD blocks on one page","pages":["/square-footage-calculator/"]},
 {"id":"geo-brand-offsite","severity":"medium","title":"No detectable YouTube/Reddit/Wikipedia/LinkedIn brand presence"},
 {"id":"geo-home-title","severity":"low","title":"Homepage title lacks brand name","pages":["/"]},
 {"id":"geo-no-images","severity":"low","title":"No raster images/diagrams with alt text on sampled pages"},
 {"id":"geo-guide-intro","severity":"low","title":"Guide intro is rhetorical; no direct answer in first 60 words","pages":["/guides/how-to-choose-a-band-name/"]},
 {"id":"geo-crawlers-ok","severity":"pass","title":"All AI search and training crawlers allowed; static SSR HTML"}
]
```
