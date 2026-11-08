# 02 — Technical & On-Page SEO Specification

## 1. Page Inventory & SEO Targets

| Path | Primary Target Keyword | Min Words | Schema Types | Status |
|---|---|---|---|---|
| `/` | free online tools | 350 | WebSite, Organization | Planned |
| `/tools/` | free online generators | 150 | BreadcrumbList | Planned |
| `/band-name-generator/` | band name generator | 1,000 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/kpop/` | kpop band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/metal/` | metal band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/heavy-metal/` | heavy metal band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/rock/` | rock band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/random/` | random band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/boy-band/` | boy band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | Planned |
| `/band-name-generator/punk/` | punk band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | BLOCKED |
| `/band-name-generator/pop/` | pop band name generator | 600 | WebApplication, BreadcrumbList, FAQPage | BLOCKED |
| `/guides/` | band naming guides | 120 | BreadcrumbList | Planned |
| `/guides/how-to-choose-a-band-name/` | how to choose a band name | 1,000 | Article, BreadcrumbList | Planned |
| `/guides/band-name-ideas-by-genre/` | band name ideas by genre | 1,000 | Article, BreadcrumbList | Planned |
| `/guides/how-to-check-if-a-band-name-is-taken/` | how to check if a band name is taken | 1,000 | Article, BreadcrumbList | Planned |
| `/about/` | about our tools | 250 | Organization, BreadcrumbList | Planned |
| `/contact/` | contact us | 100 | BreadcrumbList | Planned |
| `/privacy-policy/` | privacy policy | N/A | BreadcrumbList | Planned |
| `/terms/` | terms of service | N/A | BreadcrumbList | Planned |
| `/404.html` | N/A (noindex) | N/A | None | Planned |

---

## 2. Cannibalisation Prevention Plan

### Metal vs. Heavy Metal
- `metal`: Focuses on modern sub-genres (death, black, doom, thrash, core). Dark, occult, abrasive vocabulary.
- `heavy-metal`: Focuses on classic 1970s–1980s NWOBHM and arena metal (steel, thunder, warriors, dragons).
- Jaccard similarity must stay strictly below 0.30.

---

## 3. Technical SEO Rules

- **Static Export Friendly**: All dynamic routes defined in `generateStaticParams()` with `dynamicParams = false`.
- **Self-referencing Canonical**: Absolute URLs with trailing slash.
- **Title Limits**: ≤ 65 chars hard limit. Keyword placed first.
- **Meta Description**: 70–160 chars.
- **Zero Third-Party Scripts**: No render-blocking tags, no external analytics or ad scripts until Phase 7.
- **JSON-LD**: Validated Schema.org markup matching on-page content.
