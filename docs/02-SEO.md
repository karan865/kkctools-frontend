# 02 — Technical & On-Page SEO Specification

## 1. Page Inventory & SEO Targets

Source of truth: `src/lib/routes.ts` (43 routes) and `src/app/`. All pages below are **Live** in the static build (`npm run verify` 2026-11-14: 0 SEO audit errors). Per-page titles and descriptions live in `routes.ts`; this table lists the page groups.

| Group | Paths | Schema (JSON-LD graph) | Status |
|---|---|---|---|
| Home | `/` | WebSite, Organization, WebPage | Live |
| Tools index | `/tools/` | CollectionPage, BreadcrumbList | Live |
| Band Name Generator | `/band-name-generator/` | WebApplication, BreadcrumbList, FAQPage | Live |
| Genre pages (6) | `/band-name-generator/{kpop,metal,heavy-metal,rock,random,boy-band}/` | WebApplication, BreadcrumbList, FAQPage | Live |
| Genre pages (2) | `/band-name-generator/{punk,pop}/` | — | BLOCKED (owner keyword data) |
| Estimate template | `/construction-estimate-template/` | WebApplication, BreadcrumbList, FAQPage | Live |
| Calculators (25) | see `01-FEATURES.md` §2 | WebApplication, BreadcrumbList, FAQPage (one per page) | Live |
| Guides index | `/guides/` | CollectionPage, BreadcrumbList | Live |
| Guides (3) | `/guides/how-to-choose-a-band-name/`, `/guides/band-name-ideas-by-genre/`, `/guides/how-to-check-if-a-band-name-is-taken/` | Article, BreadcrumbList | Live (1,686–1,888 words each) |
| Trust | `/about/`, `/contact/`, `/privacy-policy/`, `/terms/` | AboutPage / ContactPage / WebPage, BreadcrumbList | Live |
| System | `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/opengraph-image.png`, `/apple-touch-icon.png`, `/404.html` (noindex) | — | Live |

Primary keywords for the Batch 2 calculators are recorded in `00-PROJECT-STATUS.md` (per-tool phase sections) and in `docs/keywords analysis/Batch 2/`.

---|---|---|---|---|
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
- **One connected JSON-LD graph**: Organization + WebSite `@id`s in the layout; page schema normalized by `normalizeSchema.ts`; only one FAQPage per page.
- **Sitemap**: `loc` + `lastmod` only; generated from the route list. `llms.txt` is generated from the same list.
- **robots.txt**: allows AI search bots explicitly.
- **Hosting headers**: `public/_headers` (CSP, HSTS, nosniff, immutable cache for `/_next/static/*`) — served by Cloudflare Static Assets.
- **JSON-LD**: Validated Schema.org markup matching on-page content.

