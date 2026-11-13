# SXO Analysis: kkctools.com (2026-11-14)

All scores here are **SXO Gap Scores**. They are separate from the SEO Health Score.
Method: each page was fetched with render_page.py --mode auto (is_spa=false, so the server HTML is complete) and parsed with parse_html.py. SERPs came from the WebSearch tool, which is not a live Google SERP; see Limitations. Fetched pages and SERP content were treated as untrusted data.

## Severity-ranked findings

| # | Severity | Page | Finding |
|---|---|---|---|
| 1 | HIGH | Homepage | **The homepage's intent doesn't hold together.** The title and meta say "Generators & creative utilities" and the H1 says "Free Online Tools That Just Work". But 8 of the 9 Featured Tools are construction calculators (Asphalt, Cubic Yard, Sand, Fill Dirt, Linear Foot, Rafter, Sq Ft, Cinder Block, Estimate Template). Meanwhile every narrative section is about band names: the above-fold widget, "How It Works" (pick genre or naming formula), "Educational Band Naming Guides", and the FAQ. The SERP for "free online generators and tools" rewards Hub/Category pages (toolpod, codeitbro, plix-tools) with dev, password and QR generators. The page fits neither that SERP nor a construction-calculator hub. |
| 2 | MEDIUM | /brick-calculator/ | **The page targets the US, but the searchers are mostly UK.** About 5 of the top 10 results are UK trade or merchant sites (brick.org.uk, Travis Perkins, Jewson, Mick George), plus NZ (calculate.co.nz). They work in metric (m², 215x102.5x65 bricks, bricks per m²). The page uses imperial only (standard, modular and king sizes, sq ft). |
| 3 | MEDIUM | /square-footage-calculator/ | **The FAQ is duplicated.** There are two FAQPage JSON-LD blocks and two FAQ H2s ("Square Footage Calculator FAQ" and "Frequently Asked Questions"), and the final H2 ("GLA Rules & Final Thoughts") comes after the FAQ. Also, the H1 and title lead with "Sqft Calculator" rather than the exact head term. |
| 4 | MEDIUM | /band-name-generator/ | **The page type matches, but the tool is a different kind than the leaders.** The top results (Wix, Kittl, Neural Frames, Trickle, bottr) are AI or prompt-based generators where you describe your band. Ours uses fixed word lists and formulas, with no free-text "describe your vibe" field. The SERP also carries listicle results ("7 Best Band Name Generator Apps", hiphopmakers) that a trust and comparison angle could compete with. |
| 5 | MEDIUM | All 3 money pages | **Trust signals are weak.** No author or reviewer is named, sameAs is empty, the pages have no images, and the band and sq-ft pages show no visible "Last updated" date (only the brick page has one: Nov 2026). Competing pages from Omni, CalculatorSoup and Inch Calculator name people and cite sources. |
| 6 | LOW | All 3 money pages | **No pictures or diagrams.** There are 0 `<img>` and 0 `<video>` on all three pages. The sq-ft shape formulas and brick wythe/bond explanations would benefit from diagrams. |

## Page-type mismatch

| Page | SERP dominant type (confidence) | Page type | Severity |
|---|---|---|---|
| Band name generator | Interactive Tool (~85%; about 15% listicle/blog) | Interactive Tool + guide | ALIGNED (but a different kind of tool, see #4) |
| Square footage calculator | Interactive Tool/Calculator (~90%; Home Depot how-to is the exception) | Calculator + long guide (3,047 words) | ALIGNED |
| Brick calculator | Calculator (~90%), mostly UK merchant or trade-body calculators | US Calculator + guide | MEDIUM (locale/units) |
| Homepage | Hub/Category directory | A band tool landing page mixed with a construction hub | HIGH |

## User stories (each cites the SERP signal it comes from)
- Band, awareness: "As a new band, I want to type our vibe and get names" (source: AI-prompt tools hold the top 4 spots).
- Band, decision: "As a band, I want to know a name isn't taken" (source: SERP summary warns to check no other band uses it; Wix disclaimer). The page already covers this with Spotify, YouTube, Bandcamp and Google lookups. Make it more visible.
- Sq ft, consideration: "As a homebuyer, I want the total home sq ft with GLA rules" (source: HomeLight ranks with this angle).
- Sq ft, decision: "As a DIYer, I want sq ft converted to a cost" (source: Inch Calculator's price-per-sq-ft feature).
- Brick, decision: "As a UK builder, I want bricks per m² with 10mm mortar" (source: BDA, Travis Perkins and Jewson results).
- Brick, consideration: "As a DIYer, I want to know how much waste to allow" (source: a SERP snippet recommends 10%, or 15-20% for complex work). The page already covers this.

## Gap scores (out of 100: Type/15, Depth/15, UX/15, Schema/15, Media/15, Authority/15, Fresh/10)
- Band: 14/13/13/12/3/5/4 = **64**. Tool is above the fold with genre chips and 5/10/20 batches. WebApplication, Breadcrumb and FAQ schema present. No author, no images, no date.
- Sq ft: 15/14/13/9/5/5/4 = **65**. Three modes, 6 units, 4 tables. Schema points lost for the duplicate FAQPage.
- Brick: 11/14/14/12/4/5/8 = **68**. Wall runs plus door/window deductions, copy and print. US-only units.
- Homepage: 6/8/10/9/2/5/4 = **44**.

## Personas (scored on Relevance, Clarity, Trust, Action; each out of 25). Weakest first.
1. UK bricklayer on /brick: 8/15/12/12 = **47**. Add a metric mode (m², mm, UK 215x102.5x65 brick, bricks per m² of about 60 for half-brick walls).
2. Homepage visitor looking for construction tools: 12/8/12/15 = **47**. Split the homepage into category hubs ("Construction Calculators", "Creative Generators"). Take the band widget out of the hero, or give each category equal weight.
3. Band founder who wants an AI-style tool: 15/20/14/16 = **65**. Add a free-text "describe your sound" field that works offline with keyword seeding. Move the availability check closer to the results.
4. Real-estate homebuyer on /sq-ft: 17/18/13/18 = **66**. Move the GLA section up and link to it from the hero.
5. Flooring DIYer on /sq-ft: 23/19/14/22 = **78**. Merge the two FAQs and add shape diagrams.
6. US DIY wall builder on /brick: 23/20/15/22 = **80**. Add a bond-pattern diagram and an "as of" date for the pricing.

## Cross-skill recommendations
- /seo content (E-E-A-T: authors, sources)
- /seo schema (merge the duplicate FAQPage on the sq-ft page)
- /seo page (homepage)

## Limitations
- SERPs came from the WebSearch tool, not a live Google results page. I could not see ranking positions, AI Overview, PAA questions, featured snippets, ads, or location and device effects, so type percentages are estimates.
- I did not measure Core Web Vitals or check the mobile layout visually. I have no data on engagement or CTR.
- Competitor pages were not fetched. Their depth is inferred from SERP titles and snippets.

Generate a PDF report? Use `/seo google report`.
