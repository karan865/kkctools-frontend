# Content Quality & E-E-A-T Audit: kkctools.com (2026-11-14)

Scope: all 37 URLs in /sitemap.xml fetched (raw mode, render_page.py). Three pages needed a retry after connection resets (construction-estimate-template, tons-to-cubic-yards, paver-base-calculator); all returned 200 on retry. Word counts come from trafilatura `extracted_text`. Duplication was measured as 3-word-shingle Jaccard similarity. Metadata was checked with metadata_template.py across all 37 pairs.

## Scores
- **Content Quality: 62/100**
- **On-Page SEO: 74/100**
- E-E-A-T (internal model): Experience 8/20 (40%), Expertise 13/25 (52%), Authoritativeness 8/25 (32%), Trust 20/30 (67%). Total 49/100.
- AI citation readiness: 70/100. Calculators have worked examples, tables, FAQPage schema and explicit formulas. Nothing is attributed to an author or a source.

## Word counts (extracted_text)
| Page group | Range | Floor | Status |
|---|---|---|---|
| Calculators (20) + estimate template | 1,158 to 3,047 | 800 | All pass |
| Band hub | 1,650 | 800 | Pass |
| Genre subpages (6) | 825 to 858 | 800 | Barely pass. Each includes about 20 sample names, so the prose is roughly 650 to 700 words |
| Guides (3) | 1,129 to 1,453 | 1,500 | All below the blog floor |
| /guides/ hub | 211 | n/a | Thin. Lists band guides only |
| Home | 702 | 500 | Pass |
| About | 389 | n/a | Thin for an E-E-A-T anchor |
| Contact | 186 | n/a | OK |

## Duplication
- Genre pairs: Jaccard 0.047 to 0.054. **Metal vs heavy-metal is 0.049**, and the two are clearly differentiated (extreme vs. traditional/NWOBHM). This meets the project's < 0.30 rule.
- Calculator pairs: highest is sand vs fill-dirt at 0.066. All others are 0.032 or lower.
- Hub vs genre pages: 0.010 to 0.017. Guides vs generators: 0.021 or lower.
- Shared boilerplate: "100% in-browser generation · 0ms server lag · No sign-ups required" appears on 8 pages.

## Metadata
- metadata_template.py: site_risk **low**, templated_ratio **0.0**, shared_cta_phrases **none**, no flags.
- Titles are 30 to 64 characters. Descriptions are 112 to 160 characters. Every page has exactly one H1 and a self-referencing canonical.
- Issues:
  - /tons-to-cubic-yards/ title: "Tons to Cubic Yards Converter by Material | KKCTools | KKC Tools" (brand appears twice, 64 chars).
  - Home title "Free Online Generators & Tools" has no brand and no topic signal.
  - /tools/ H1 "Practical tools for your website and everyday work." and its description ("music tools, and creative naming utilities") do not describe the site's 21 construction tools.
  - H1 style is inconsistent: "Sand Calculator" vs "Free Paint Cost Calculator: Estimate Gallons, Quarts & Total Project Costs" (75 chars).
  - BreadcrumbList schema is missing on paver-sand, paver-base, compost and fence-stain. Every other tool page has it.

## Findings (severity-ranked)

### HIGH 1. No identifiable people behind YMYL-adjacent construction advice
- Evidence: About says only "developed and maintained by KKC Tools Team ... independent software creators, musicians, and digital minimalists." Article schema uses `author: Organization "KKC Tools"`. No calculator has a byline or reviewer.
- Why it matters: cost and structural quantities (footings, retaining walls, rafters) call for named expertise.
- Fix: the owner should supply a real name, role and relevant background. Until then, leave a TODO(owner) placeholder. Do not invent a bio. Add a "Methodology and review" block per calculator.

### HIGH 2. Unverifiable trust claims
- Evidence:
  - /tons-to-cubic-yards/: "Contractor-verified material bulk densities."
  - /paint-cost-calculator/: "verified manufacturer coverage benchmarks."
  - /construction-estimate-template/: "Millions of building contractors historically relied on..."
  - About: "thousands of hand-curated vocabulary entries", "a database of hundreds of existing famous musical acts".
  - 8 pages: "0ms server lag."
  - /tile-calculator/: "Angi and industry guides report..." with no link.
- Fix: name and link the actual sources (manufacturer data sheets, ASTM, TCNA), soften the wording, or remove the claims. Check the About counts against the code.

### HIGH 3. Mixed-topic site with no unifying story
- Evidence:
  - 21 construction tools vs 7 band pages.
  - About and Contact describe only creative/naming/text tools ("transforming a string of text", "music branding calculator"). No text tools exist.
  - /guides/ is "Band Naming & Music Branding Guides", with no construction guides.
- Fix: rewrite About, Contact and /tools/ copy to describe both verticals. Add hub pages per category (Construction Calculators, Music Tools). Add construction guides.

### MEDIUM 4. AI-typical purple prose on genre pages
- Evidence: Flesch reading ease is 12.9 for metal and 21.5 for heavy-metal, vs 53 to 64 for calculators. Example phrases: "subterranean intensity", "orthographic silhouette", "ecclesiastical solemnity", "visceral threshold".
- No first-hand signals: no real band examples and no tested outcomes.
- Fix: write in plain language, aiming for Flesch 50+. Add concrete examples and real naming lessons.

### MEDIUM 5. Guides are below the 1,500-word floor; /guides/ is 211 words
- Fix: expand the guides with sourced trademark steps (the USPTO is already mentioned). Add a summary to the hub.

### MEDIUM 6. Formula transparency is uneven
- Strong: cubic-yard and asphalt (worked examples, "Last updated", disclaimers), cinder-block (ASTM C90), paver pages (ICPI, ASTM C33).
- Weaker: most calculators cite no named standard or source.
- Fix: give every calculator a standard "How we calculate" section with formula, default constants, source and date.

### LOW 7. "Last updated" is shown inconsistently
- It appears on about 8 calculators. dateModified/datePublished appear only on the guides.
- Fix: show it on every page and add dateModified to the WebApplication schema.

### LOW 8. Fix the metadata issues listed above
- Duplicated brand in the tons-to-cubic-yards title, unbranded home title, /tools/ H1, missing breadcrumbs on 4 pages.
