# MASTER BUILD PROMPT — Multi-Tool Website, Tool #1: Band Name Generator

> Give this whole file to Google Antigravity. Put it in an empty project folder as `MASTER_PROMPT.md`, open that folder as the workspace, and send this message:
> **"Read MASTER_PROMPT.md fully. Execute it phase by phase exactly as written. Start with Phase 0."**

---

## 0. Owner notes (Hinglish — for the human, the agent can skip this section)

- Ye file ek hi baar padhne wali master prompt hai. Antigravity isko phase-wise execute karega aur sab kuch `docs/` folder me likhta jayega.
- Planning mode on rakhna (agar option hai). Agent pehle plan banayega, phir kaam karega.
- Do checkpoints hain: **Phase 3 ke baad** (pehla tool ready) aur **Phase 6 ke baad** (SEO audit). Wahan agent ruk ke review maangega. Tum bas "continue" bolna.
- Jo cheezein tumhe deni hain (agent guess nahi karega): site ka naam, contact email, domain, owner ka naam (About page ke liye), punk/pop keywords ka volume check.
- Jab review karna ho: `npm run verify` chalao, phir `docs/_BUNDLE_FOR_REVIEW.md` file mujhe (Claude ko) bhej do. Main usse verify karunga.
- Google ranking ki guarantee koi nahi de sakta. Ye plan technical SEO me koi galti nahi chhodta, lekin ranking content quality, backlinks aur time par bhi depend karti hai.

---

## 1. Role and non-negotiable rules

You are a senior full-stack engineer, technical SEO specialist, and UI designer. You will build a fast, beautiful, static, multi-tool website. The first tool is the **Band Name Generator**. More tools will be added later, so everything must be structured to scale.

### 1.1 Rules you must follow at all times

1. **Work phase by phase** in the order of Section 14. Do not skip ahead.
2. **Ticking rule.** A task is ticked `[x]` only if it is fully done AND verified (a command was run, a file was checked, or output was inspected). Write the evidence next to the tick (command + result, or file path). A task that is not finished or not verified stays `[ ]` with no tick. Never tick optimistically. There is no half-tick.
3. **Never fabricate.** No fake testimonials, ratings, user counts, "trusted by", awards, author bios, credentials, statistics, or legal claims. Where the owner must supply a fact, use a placeholder `TODO(owner): <what is needed>` and list it in `docs/00-PROJECT-STATUS.md` under "Open placeholders".
4. **Never copy competitors.** Do not copy text, word lists, or layouts from other sites. Competitor pages may be opened for UX inspiration only.
5. **No network calls from the tool.** The generator runs entirely in the browser. No `fetch`, no API, no AI service, no analytics events from tool code. This is a public claim on the site ("nothing you type leaves your browser"), so it must stay true. `npm run check:no-network` enforces it.
6. **No third-party scripts** (no ads, analytics, widgets) until the owner enables them in Phase 7.
7. **Ask before adding dependencies** that are not in the allowed list (Section 3.3).
8. **Commit after every phase** (`git commit`), message format: `phase-N: <summary>`.
9. **Docs are part of the product.** After every task, update the docs (Section 13). If docs and code disagree, the task is not done.
10. **Stop and ask the owner only when blocked** by missing owner input. Otherwise keep going. Hard stops: the two checkpoints in Section 14.

### 1.2 Honest expectation (put the same idea in `docs/05-DEPLOY-AND-LAUNCH.md`)

Technical SEO, fast pages, useful tools and good content give the site a fair chance. Nobody can guarantee rankings. Rankings depend on content quality, competition, backlinks and time. The keyword used here has KD 10 but seven dedicated tool pages already rank, so this tool must be genuinely better than them, not just present.

---

## 2. Product overview

- **What:** a free website with many small browser-based tools. Tool #1 = Band Name Generator, with genre-specific sub-pages.
- **Who:** English-speaking users, mostly US, UK, Canada, Australia (about 70% of global search volume for the main keyword).
- **How it makes money:** Google AdSense, later. Pages must pass AdSense review (real content, trust pages, clean navigation). Ad code is **not** added now, only an inert placeholder component.
- **How it ranks:** one focused, high-quality page per keyword intent, strong internal linking, fast pages, and unique genre content. No thin or duplicate pages.
- **Hosting:** static files on Netlify free (or Cloudflare Pages). No server, no database, no backend.

---

## 3. Tech stack

### 3.1 Required
- **Next.js** (latest stable, App Router) with **static export** (`output: 'export'`).
- **React**, **TypeScript** (strict).
- Plain **CSS** (global tokens + CSS Modules). No Tailwind, no UI kit.
- **Vitest** for unit tests.
- Node.js **20.9+** (22 LTS recommended). Confirm against the "System requirements" in the Next.js docs and record the version in `docs/00-PROJECT-STATUS.md`.

### 3.2 Static export facts (from the Next.js docs, respect them)
- `next build` writes the site to `out/`. Server Components run at build time and become static HTML.
- **Unsupported with static export:** `headers()`, `redirects()`, `rewrites()` in `next.config`, cookies, Server Actions, ISR, dynamic routes without `generateStaticParams()`, and `dynamicParams: true`. So: security/cache headers go in `public/_headers`, and every dynamic route uses `generateStaticParams()` with `export const dynamicParams = false`.
- Route handlers and metadata routes (`sitemap.ts`, `robots.ts`) must be static: add `export const dynamic = 'force-static'`.
- Default `next/image` optimisation is not available. Use `images: { unoptimized: true }` and avoid raster images where SVG or CSS works.
- Access `window`, `localStorage`, `navigator` only inside `useEffect` or event handlers.

### 3.3 Allowed dependencies (anything else: ask the owner first)
- runtime: `next`, `react`, `react-dom`, `gray-matter`, `marked`
- dev: `typescript`, `@types/*`, `eslint` (+ the config create-next-app generates), `prettier`, `vitest`, `vite-tsconfig-paths`, `cheerio`, `serve`

### 3.4 `next.config.ts` must contain
```ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,        // /band-name-generator/ -> out/band-name-generator/index.html
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
```

### 3.5 Scripts in `package.json`
`dev`, `build`, `start` (serve `out`), `lint`, `test`, `check:no-network`, `seo:audit`, `docs:bundle`, and `verify` = lint → test → check:no-network → build → seo:audit → docs:bundle. `verify` must save each step's output under `docs/evidence/` (for example `docs/evidence/build.txt`, `test.txt`, `seo-audit.txt`).

### 3.6 Environment variables (`.env.example`, all optional)
```
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_ADS_ENABLED=false
NEXT_PUBLIC_ADSENSE_CLIENT=
NEXT_PUBLIC_GA_ID=
```
`NEXT_PUBLIC_*` values are baked in at build time. `src/config/site.ts` reads them and exports `SITE_NAME` (placeholder `YourSiteName`, TODO(owner)), `SITE_URL`, `SITE_TAGLINE`, `OWNER_EMAIL` (placeholder). Site name, domain and email must be changeable in one place.

---

## 4. Project structure

```
/
├─ AGENTS.md                      standing rules for you (Section 13.5)
├─ MASTER_PROMPT.md               this file
├─ package.json  next.config.ts  tsconfig.json  vitest.config.ts  .nvmrc  .env.example  .gitignore
├─ public/
│  ├─ _headers                    security + cache headers (Appendix A)
│  ├─ icon.svg  favicon.ico  apple-touch-icon.png
│  └─ (ads.txt is NOT created now; see Phase 7)
├─ content/guides/*.md            guide articles with frontmatter
├─ scripts/                       seo-audit.mjs  bundle-docs.mjs  check-no-network.mjs
├─ docs/                          see Section 13
└─ src/
   ├─ app/
   │  ├─ layout.tsx  page.tsx  not-found.tsx  sitemap.ts  robots.ts  globals.css  opengraph-image.tsx
   │  ├─ tools/page.tsx
   │  ├─ band-name-generator/page.tsx
   │  ├─ band-name-generator/[genre]/page.tsx
   │  ├─ guides/page.tsx   guides/[slug]/page.tsx
   │  └─ about/  contact/  privacy-policy/  terms/   (each page.tsx)
   ├─ components/
   │  ├─ layout/   Header, Footer, MobileMenu, ThemeToggle, SkipLink, Breadcrumbs
   │  ├─ ui/       Button, Chip, Card, Container, Section, Faq, Prose, Toast
   │  ├─ seo/      JsonLd, buildMetadata helper
   │  ├─ ads/      AdSlot (inert unless enabled)
   │  └─ tool/band-name-generator/   BandNameGenerator, Controls, Results, ResultRow, SavedPanel, CheckMenu
   ├─ config/site.ts
   ├─ content/genres/*.ts  content/pages/*.ts   (all page copy lives here, typed)
   ├─ lib/
   │  ├─ generator/  types.ts  rng.ts  pools/*.ts  patterns.ts  blocklist.ts  offensive.ts  engine.ts  engine.test.ts
   │  ├─ routes.ts   single source of truth for every page (path, title, description, updated, type)
   │  ├─ guides.ts   storage.ts (safe localStorage)
   └─ styles/tokens.css
```

---

## 5. Keyword data (source of truth)

Source: SEMrush, **United States database, Desktop, 8 Nov 2026**. Treat as estimates. Cluster: 939 keywords, total volume 20,880, average KD 13%.

### 5.1 Main keyword
| Metric | Value |
|---|---|
| Keyword | band name generator |
| US volume / KD | 8,100 / 10% ("Very easy") |
| Global volume | 18.4K (US 8.1K, UK 2.9K, CA 1.0K, AU 880, IN 390, PH 390, Other 4.7K) |
| Intent / CPC / Competitive density | Informational / $0.82 / 0.03 |
| Trend (read from bars, approximate) | first bar highest, then roughly flat to slightly down |

### 5.2 Top keywords from the Keyword Magic Tool
| Keyword | Vol | KD | CPC | Intent | Target page |
|---|---|---|---|---|---|
| band name generator | 8,100 | 10 | 0.82 | I | `/band-name-generator/` |
| band name generator kpop | 880 | 16 | 0.00 | C | `/band-name-generator/kpop/` |
| band names generator | 590 | 16 | 0.52 | C | `/band-name-generator/` (plural variant) |
| kpop band name generator | 590 | 7 | 0.00 | I | `/band-name-generator/kpop/` |
| metal band name generator | 590 | 9 | 0.00 | C | `/band-name-generator/metal/` |
| k pop band name generator | 480 | 10 | 0.00 | C | `/band-name-generator/kpop/` |
| random band name generator | 480 | 23 | 0.11 | C | `/band-name-generator/random/` |
| boy band name generator | 390 | 18 | 0.00 | I | `/band-name-generator/boy-band/` |
| heavy metal band name generator | 390 | 4 | 0.02 | C | `/band-name-generator/heavy-metal/` |
| rock band name generator | 390 | 8 | 0.21 | C | `/band-name-generator/rock/` |

Related topics from the Keyword Strategy panel: band name maker, good band names, rock band name maker, cool band names, cool band names that aren't taken. Use these naturally as H2/H3 phrases and body text on the main page.

Keyword groups seen in the Magic Tool sidebar (count of keywords containing the term, **volumes not seen**): metal 99, rock 87, random 40, word 27, india 23, pop 23, punk 22, ai 21, end 15, boy 13.

Questions: only 4 question keywords with total volume 20, so an FAQ will not bring traffic by itself. Use the FAQ for page depth and clarity.

### 5.3 Not yet verified (owner must check volume/KD in SEMrush before the page is built)
- punk band name generator
- pop band name generator
- "ai band name generator" (21 keywords in group; the tool itself must stay non-AI, see Section 9)
- India-related variants (23 keywords in group)
- "band name generator from words" style keywords (27 keywords in group)

Those pages are in the checklist but marked **BLOCKED (owner input)**. Do not build them until the owner confirms. Leave them unticked.

### 5.4 What the current top 10 looks like (US, KD 10)
1 indiesound.com, 2 bandnamemaker.com, 3 inclassics.com (AI tools for musicians), 4 fantasynamegenerators.com, 5 reddit.com (thread), 6 viewmaniac.com (with sitelinks), 7 vistaprint.com, 8 suno.bi, 9 wikihow.com (article), 10 basschat.co.uk (forum thread). So: 7 dedicated tool pages, 1 article, 2 forum threads. An AI Overview with 5 links also appears. Page authority and backlink data was hidden ("Get metrics"), so competitor strength is unknown.

**Ignore** the "Outranking Competitors' SEO" panel. It showed identical numbers on different keywords, so it is not keyword-specific data.

### 5.5 How to win (design the product around this)
1. Genre-specific word lists and patterns that produce better names than generic random mixers.
2. A cleaner, faster, ad-free-feeling UX (instant results, large readable names, keyboard friendly).
3. Useful extras: save favourites, copy all, download as text, and **availability check links** (Google, Spotify, Bandcamp, YouTube) that never claim a name is "available".
4. Real depth: a long, useful, original page below the tool plus guides.
5. A hub-and-spoke structure: the main page links to genre pages and genre pages link back.

### 5.6 Cannibalisation risk (record this in `docs/02-SEO.md`)
`metal` and `heavy-metal` have similar intent. Make them clearly different: metal = modern and sub-genres (death, black, doom, thrash), heavy-metal = classic 80s style. Different word pools, different examples, different copy. After launch, watch Search Console; if one page does not rank, consider merging with a 301 redirect.

---

## 6. Information architecture

| Path | Page | Index? | Min. words (main content) |
|---|---|---|---|
| `/` | Home | yes | 350 |
| `/tools/` | All tools index | yes | 150 |
| `/band-name-generator/` | Main tool | yes | 1,000 |
| `/band-name-generator/kpop/` | K-pop genre | yes | 600 unique |
| `/band-name-generator/metal/` | Metal genre | yes | 600 unique |
| `/band-name-generator/heavy-metal/` | Heavy metal genre | yes | 600 unique |
| `/band-name-generator/rock/` | Rock genre | yes | 600 unique |
| `/band-name-generator/random/` | Random | yes | 600 unique |
| `/band-name-generator/boy-band/` | Boy band | yes | 600 unique |
| `/band-name-generator/punk/` | Punk (BLOCKED) | yes | 600 unique |
| `/band-name-generator/pop/` | Pop (BLOCKED) | yes | 600 unique |
| `/guides/` | Guides index | yes | 120 |
| `/guides/how-to-choose-a-band-name/` | Guide 1 | yes | 1,000 |
| `/guides/band-name-ideas-by-genre/` | Guide 2 | yes | 1,000 |
| `/guides/how-to-check-if-a-band-name-is-taken/` | Guide 3 | yes | 1,000 |
| `/about/` | About | yes | 250 |
| `/contact/` | Contact | yes | 100 |
| `/privacy-policy/` | Privacy | yes | n/a |
| `/terms/` | Terms | yes | n/a |
| `/404.html` | Not found | **noindex** | n/a |

- Total: 17 pages without punk/pop, 19 with them. All URLs lowercase, hyphenated, trailing slash.
- Every page is reachable within 3 clicks from Home and has at least 3 internal links pointing to it (legal pages: at least 1, from the footer).
- Navigation (header): **Tools** (dropdown on desktop, section in mobile menu), **Guides**, **About**. Theme toggle on the right.
- Tools live in three places: the Home "Tools" section, the `/tools/` index, and the header and footer. The tools index is grouped by category (Generators now; Developer tools and Templates later) so new tools plug in without redesign.
- English only for now. Do not add language folders yet.

---

## 7. Design system

**Direction:** "stage lights". Clean and modern with a music feel, not a template. Confident headings, generous whitespace, one strong accent, one warm highlight. It must look good in both light and dark mode. No stock photos. Visuals are CSS, inline SVG and typography only.

### 7.1 Tokens (`src/styles/tokens.css`) — implement exactly, then verify contrast
```css
:root {
  --bg: #FAF8F5;  --surface: #FFFFFF;  --surface-2: #F3F0EA;
  --ink: #14121A; --ink-2: #4A4757;   --muted: #6B6780;
  --line: #E7E3EC;
  --accent: #6D28D9;  --accent-ink: #FFFFFF;  --accent-soft: #EFE7FD;
  --highlight: #F59E0B;
  --success: #15803D; --danger: #B91C1C;
  --radius-s: 8px; --radius-m: 14px; --radius-pill: 999px;
  --shadow-s: 0 1px 2px rgb(20 18 26 / 6%);
  --shadow-m: 0 8px 24px rgb(20 18 26 / 8%);
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px; --space-9: 96px;
  --container: 1120px; --prose: 68ch;
}
:root[data-theme="dark"] {
  --bg: #0E0C14;  --surface: #17141F;  --surface-2: #1F1B2A;
  --ink: #F4F1FA; --ink-2: #C4BFD3;   --muted: #9690A8;
  --line: #2A2536;
  --accent: #A78BFA;  --accent-ink: #0E0C14;  --accent-soft: #261D3D;
  --highlight: #FBBF24;
  --shadow-s: none; --shadow-m: 0 8px 24px rgb(0 0 0 / 40%);
}
```
Default theme follows `prefers-color-scheme`. The toggle stores the choice in localStorage (wrapped in try/catch). Apply the theme with a tiny inline script in `<head>` so there is **no flash of wrong theme**. Verify that every text/background pair has contrast of at least **4.5:1** (3:1 for large text and UI borders); fix tokens if any pair fails and record the checked pairs in `docs/03-PAGES-AND-DESIGN.md`.

### 7.2 Typography
- Headings: **Bricolage Grotesque** (600–800). Body: **Inter** (400–600). Load both with `next/font/google` (self-hosted at build time), `display: 'swap'`, `subsets: ['latin']`.
- Fluid sizes: `h1: clamp(2rem, 1.2rem + 3.2vw, 3.5rem)`, `h2: clamp(1.5rem, 1.1rem + 1.6vw, 2.25rem)`, `h3: 1.25rem`, body `1.0625rem / 1.65`. Prose max width `68ch`.
- Names in the generator results use the heading font at 1.375–1.75rem so they feel like band logos.

### 7.3 Layout and components
- Container max width 1120px, side gutter 16px (mobile) and 24px (desktop). Breakpoints: 640, 900, 1200.
- Header: sticky, blurred surface, text wordmark (site name) with a small inline-SVG mark (4 vertical bars like a sound wave, accent colour), nav links, theme toggle. Mobile: hamburger opens a full-width menu (keyboard accessible, focus trapped, Esc closes).
- Footer: 4 columns (Tools, Genres, Guides, Company) + a one-line disclaimer + copyright with the current year computed at build time. All links real, descriptive anchor text.
- Cards: 1px `--line` border, `--radius-m`, hover lifts 2px with `--shadow-m`.
- Chips (genre selector): pill, 1px border, selected = accent background. They are a **radio group** (`role="radiogroup"`, arrow-key navigation).
- Buttons: primary (accent), secondary (outline), ghost. Min target 44×44px. Visible focus ring: `outline: 3px solid var(--accent); outline-offset: 2px`.
- FAQ: native `<details><summary>` (works without JS, good for SEO), styled.
- Motion: result rows fade/slide in with a 30ms stagger, 180ms duration. Honour `prefers-reduced-motion` (no animation).
- Hero background: soft radial gradient glow behind the headline using `--accent-soft` and `--highlight` at low opacity. CSS only.

### 7.4 Accessibility (applies to every page)
- One `<h1>` per page, logical heading order, landmarks (`header`, `nav`, `main`, `footer`), skip link, `lang="en"`.
- All interactive controls have labels. Results container is `aria-live="polite"` and announces "10 names generated". Copy actions announce "Copied".
- Colour is never the only signal. Keyboard-only use must be possible for the whole tool.
- Lighthouse Accessibility ≥ 95.

---

## 8. Page specifications

### 8.1 Home `/`
Goal: explain the site in 5 seconds and get the visitor into a tool. Be honest: only one tool exists today.

Sections, top to bottom:
1. **Hero.** H1 such as "Free online tools that just work" (final copy by you, natural, no hype). One short supporting sentence. Primary button "Try the Band Name Generator". Beside it (desktop) or below it (mobile): a compact live generator card (`<BandNameGenerator compact />`, 5 names, genre chips limited to 4, Generate button).
2. **Tools** (`id="tools"`). Section title "Tools". A card grid. Today one featured card: Band Name Generator (inline SVG icon, one-line description, button "Open tool", and a row of genre links: K-pop, Metal, Rock...). Below the grid, one line: "More tools are on the way." with a `mailto:` link "Suggest a tool". No fake "coming soon" cards and no links to pages that do not exist.
3. **Popular genres.** Chips linking to the live genre pages.
4. **How it works** (3 steps with simple SVG icons): choose options, generate, save and check.
5. **Why use these tools** (3–4 short honest points: runs in your browser, no sign-up, fast, no clutter). Only claims that are true and verifiable in the code.
6. **From the guides.** 3 cards linking to the guides.
7. **FAQ** (4 short questions about the site).
8. Footer.

Target at least 350 words of real content. Title example: `YourSiteName – Free Online Generators & Tools`.

### 8.2 Tools index `/tools/`
Category sections ("Generators" now). Each tool = card (name, description, link). Intro paragraph (at least 150 words in total). Breadcrumbs.

### 8.3 Main tool page `/band-name-generator/`
Layout, top to bottom:
1. Breadcrumbs (Home › Tools › Band Name Generator).
2. `<h1>Band Name Generator</h1>` + a one or two line intro that contains the main keyword naturally.
3. **The tool** (Section 9) immediately, so it is above the fold on mobile.
4. A short "Names you might like" static list (12 hand-written examples, plain HTML).
5. Content (at least 1,000 words in total on the page), H2 sections:
   - How to use the band name generator (3–5 numbered steps)
   - What makes a good band name (memorable, easy to spell, searchable, fits the genre, available)
   - Band name ideas by genre (a card grid linking to each live genre page with descriptive anchors, for example "Metal band name generator"; 3 sample names each)
   - How to pick your final name (shortlist, say it out loud, search test, check streaming platforms and social handles, domain, trademark note: "this is not legal advice; check your country's trademark register or ask a professional")
   - How this generator works (word lists and patterns, runs in your browser, nothing is sent anywhere, no AI)
   - FAQ (8 questions, answers 40–80 words each; see 8.3.1)
   - Related guides (2–3 links)
6. Optional ad slots: inert placeholders (Section 12).

#### 8.3.1 FAQ for the main page (write unique answers)
1. Is the band name generator free? 2. Are the generated names unique? (Honest answer: they are combinations from curated lists and may match an existing band; always check.) 3. How do I check if a band name is taken? 4. Can I use the names for my band? (Your responsibility to check; not legal advice.) 5. Does it use AI? (No, curated word lists and patterns.) 6. Can I save the names? (Yes, in your browser only.) 7. Can I generate names for a specific genre? 8. How many names can I generate at once?

### 8.4 Genre pages `/band-name-generator/[genre]/`
Same tool component, pre-set to the genre (still changeable). Built from `src/content/genres/<slug>.ts` through `generateStaticParams()` (`dynamicParams = false`).
Each page must have **unique** text, not a template with the genre word swapped:
- H1 using the primary keyword (for example "K-pop Band Name Generator").
- Intro (2–3 sentences, unique).
- Tool.
- 12 hand-written example names (static HTML).
- 3–4 genre-specific H2 sections with real naming advice for that genre (conventions, what works, what to avoid, how names in that scene usually sound, without naming or copying real bands' trademarks as examples).
- FAQ (4–5 genre-specific questions).
- "Related generators": link up to the main page (anchor "band name generator"), 3 sibling genres, and 1–2 guides.
- Minimum 600 words of unique main content. `npm run seo:audit` checks similarity between genre pages and must pass (Section 10.9).

### 8.5 Guides `/guides/` and `/guides/[slug]/`
- Markdown files in `content/guides/` with frontmatter: `title`, `description`, `slug`, `date`, `updated`.
- Rendered at build time (`gray-matter` + `marked`). Article layout: breadcrumbs, H1, "Last updated" date, auto table of contents from H2s, prose, a call-to-action card linking to the tool, and related links.
- Three guides, each at least 1,000 words, practical, original, no filler, no unverifiable claims:
  1. How to Choose a Band Name
  2. Band Name Ideas by Genre
  3. How to Check If a Band Name Is Already Taken (Google exact match, Spotify, Bandcamp, YouTube, social handles, domain, trademark register. Say clearly that none of this is legal advice.)
- Each guide links to the relevant tool and genre pages in context.

### 8.6 About, Contact, Privacy, Terms
- **About:** what the site is, why it exists, how the tools work (transparent), who runs it (`TODO(owner)`: name or brand statement, do not invent a person), how to reach the owner.
- **Contact:** a `mailto:` link to `OWNER_EMAIL` (`TODO(owner)`), expected response time left as TODO. No form, no backend.
- **Privacy Policy:** the tool does not send your input anywhere; favourites are stored only in your browser (localStorage); hosting providers may keep standard server logs; analytics and advertising sections are included as clearly marked "applies only if enabled" blocks (cookies, Google AdSense and personalised ads, how to opt out). Add a line saying it is a draft for the owner to review and is not legal advice (put that note in `docs/`, not on the page).
- **Terms:** simple terms of use: free tool, provided "as is", generated names are not checked for trademarks or availability, external links, changes to terms.
- Legal pages have no ads.

### 8.7 404 page
Friendly message, search-free, links to Home, Tools, Guides. `noindex`. Output must be `out/404.html`.

---

## 9. Tool specification — Band Name Generator

### 9.1 Features
**Must have (v1):**
- F1 **Genre selector** (radio chips): Any (random mix), Rock, Metal, Heavy Metal, Punk, Pop, K-pop, Boy Band, Indie. Pages for punk/pop are blocked, but the genres exist in the tool.
- F2 **Name style** (select): Any, "The ..." names, Two words, One word, "X of Y" phrases. Options that a genre cannot produce are disabled, not hidden.
- F3 **Number of names:** 5, 10 (default), 20.
- F4 **Starts with letter** (optional, A–Z).
- F5 **Must include word** (optional, max 20 chars, letters/numbers/space/hyphen/apostrophe only, sanitised, offensive-filtered).
- F6 **ALL CAPS** toggle (on by default only for K-pop).
- F7 **Generate** button (large). Pressing Enter in any field also generates. Each click produces new names and avoids repeating the last 50 results in the session.
- F8 **Results list:** ordered list; each row shows the name (large), and buttons: **Copy**, **Save** (heart), **Check** (opens a small menu).
- F9 **Copy all** and **Copy** use `navigator.clipboard` with a fallback; show inline "Copied" without shifting layout.
- F10 **Saved names panel:** stored in localStorage (`safeStorage` wrapper with try/catch, must work when storage is blocked), list, remove, **Copy all**, **Download .txt**.
- F11 **Check availability menu** per name (rendered only on click): links that open in a new tab with `rel="noopener noreferrer nofollow"`: Google (`https://www.google.com/search?q="NAME"+band`), Spotify (`https://open.spotify.com/search/NAME`), Bandcamp (`https://bandcamp.com/search?q=NAME`), YouTube (`https://www.youtube.com/results?search_query=NAME+band`). URL-encode the name. Label the menu "Search for this name" and add the note "A search is not a guarantee. Always do your own check." Never display words like "available" or "free to use".
- F12 Friendly message if filters are too strict ("Try fewer filters"), announced via `aria-live`.
- F13 Initial render (server/static HTML) shows the curated **starter names** for the genre (no randomness at build time, so no hydration mismatch). Random generation happens only after user action.

**Nice to have (leave unticked until done, Phase 8):** metal umlaut flair toggle; shareable state via URL hash; per-genre OG images.

### 9.2 UI layout (wireframes)
Desktop (≥ 900px): two columns, controls left (≈ 38%), results right (≈ 62%).
```
┌───────────────────────────────┬──────────────────────────────────────┐
│ Genre:  (Any)(Rock)(Metal)... │  10 names                [Copy all]  │
│ Style:  [ Any            ▾ ]  │  1  Crimson Throne        ♡ ⧉ ⌕      │
│ Names:  ( 5 )( 10 )( 20 )     │  2  Wretched Legion       ♡ ⧉ ⌕      │
│ Starts with: [ A ]            │  3  The Iron Plague       ♡ ⧉ ⌕      │
│ Must include: [ _________ ]   │  ...                                 │
│ [ ] ALL CAPS                  │                                      │
│ [   Generate band names   ]   │  Saved (3)  ▸                        │
└───────────────────────────────┴──────────────────────────────────────┘
```
Mobile (390×844): stacked. Genre chips scroll horizontally (snap). **The Generate button must be visible without scrolling** on a 390×844 viewport, below the H1 and chips. Extra options (style, letter, must include, caps) sit in a collapsible "More options" block, closed by default. Results appear directly under the button.

### 9.3 Generator engine (`src/lib/generator/`) — pure TypeScript, no DOM, no network
```ts
export type GenreId = 'any'|'rock'|'metal'|'heavy-metal'|'punk'|'pop'|'kpop'|'boy-band'|'indie';
export type StyleId = 'any'|'the'|'two-word'|'one-word'|'of-phrase';
export interface GenerateOptions {
  genre: GenreId; style: StyleId; count: 5|10|20;
  startsWith?: string; mustInclude?: string; uppercase?: boolean;
  seed?: number;                 // tests pass a seed; the UI uses a random one
  avoid?: Set<string>;           // names already shown this session
}
export interface GenerateResult { names: string[]; warning?: string }
export function generateNames(opts: GenerateOptions): GenerateResult;
```
Design:
- `rng.ts`: seeded PRNG (mulberry32). The UI seed comes from `crypto.getRandomValues`.
- `pools/<genre>.ts`: named pools per genre: `adjectives`, `nouns`, `plurals`, `verbsIng`, `places`, `colors`, `numberWords`, `suffixes`, `conceptWords` (K-pop). **Each pool must contain at least 80 distinct, curated, clean, original-feeling entries.** Use the seed lists in 9.4 to set the tone, then expand yourself. No entries that are existing famous band names.
- `patterns.ts`: weighted patterns per genre, each tagged with a style. Minimum **8 patterns per genre**, and at least 2 patterns for every style a genre claims to support (otherwise mark the style unsupported for that genre). A pattern is a template such as `"The {adj} {plural}"`, `"{noun} of {noun}"`, `"{adj}{noun}"` (fused, for K-pop).
- Title Case output (except the ALL CAPS option). Trim, collapse spaces, max length 40.
- **Constraints:** `startsWith` filters slots so the first significant word (ignoring a leading "The") starts with the letter; fall back to rejection sampling. `mustInclude` is injected into one noun/adjective slot of a compatible pattern, sanitised and run through the offensive filter. Up to 500 attempts; return fewer names plus a `warning` if constraints are too tight.
- **Quality filters:** no duplicates in a batch (case-insensitive), skip anything in `avoid`, skip words repeated inside one name ("Fire Fire"), skip blocklisted names, skip offensive combinations.
- `blocklist.ts`: at least **250 well-known real band/artist names** (rock, metal, punk, pop, K-pop, boy bands). Normalise (lowercase, strip punctuation, drop a leading "the") before comparing. Purpose: never output a famous existing name. Add a comment explaining this does not guarantee uniqueness.
- `offensive.ts`: a conservative list of slurs and explicit terms. Applied to user input and to final names.
- Combination count per genre must be at least **5,000** distinct names (computed from pool sizes and pattern slots in a test).

### 9.4 Seed word lists (tone guide only; expand every pool to 80+ unique entries)
- **Rock** — adj: Electric, Rusty, Midnight, Wild, Velvet, Broken, Neon, Burning, Silver, Restless, Dusty, Reckless, Hollow, Golden. nouns: Highway, Thunder, Riot, Engine, Wolves, Echo, Static, Diesel, Rebels, Voltage, Sparks, Anthem, Jackals, Roadhouse. patterns: `{adj} {noun}`, `The {adj} {plural}`, `{noun} & {noun}`, `{place} {noun}`, `{noun} Club`, `Last {noun}`.
- **Metal** — adj: Crimson, Obsidian, Funeral, Iron, Black, Wretched, Infernal, Cursed, Hollow, Bleeding, Eternal, Shattered, Frozen, Ashen. nouns: Abyss, Throne, Blade, Ritual, Plague, Reaper, Legion, Tomb, Inferno, Scourge, Wraith, Altar, Carrion, Dominion. patterns: `{noun} of {noun}`, `{adj} {noun}`, `{verbIng} {noun}`, `The {adj} {noun}`. Sub-genre flavour words (death, black, doom, thrash) are mixed in but kept clean.
- **Heavy Metal** (classic, 80s feel) — adj: Steel, Chrome, Savage, Raging, Iron, Mighty, Wicked, Thunderous, Leather, Armored. nouns: Hammer, Dragon, Warrior, Dungeon, Fury, Titan, Axe, Stallion, Knight, Beast, Forge, Warlord. patterns: `{adj} {noun}`, `{noun} {noun}`, `{noun} Force`, `{adj} {plural}`.
- **Punk** (short, snappy) — adj: Rotten, Dead, Cheap, Rebel, Greasy, Angry, Nervous, Feral, Rude, Loud. nouns: Kids, Riot, Gutter, Static, Pins, Vandals, Strays, Bruise, Graffiti, Brats, Zero, Bootlegs. patterns: `The {adj} {plural}`, `{adj} {noun}`, `{noun} Kids`, `No {noun}`, `Anti-{noun}`.
- **Pop** (bright, catchy) — adj: Neon, Honey, Velvet, Pastel, Sugar, Golden, Electric, Daydream, Cherry, Cosmic. nouns: Echo, Skyline, Confetti, Heartbeat, Starlight, Mirage, Parade, Carousel, Glitter. patterns: `{adj} {noun}`, `{noun} Club`, `The {plural}`, `{color} {noun}`, `Midnight {noun}`, `{noun} Season`.
- **K-pop** (stylised, short, concept words, often ALL CAPS) — concept words: NOVA, ZENITH, LUMEN, AURA, STELLA, ORBIT, PRISM, HALO, ECLIPSE, VELA, ARC, MIRA, SOLIS, LUNA, AXIS. suffixes: -X, -IZ, -ST, -EN, ONE, NINE, SEVEN, ZERO. patterns: one word; `{word} {numberWord}`; `{word}{suffix}` fused; `{adj}{noun}` fused. Do not use real Korean words you cannot verify. The blocklist must include major real K-pop groups.
- **Boy Band** — adj: Midnight, Golden, Sunday, Velvet, Late, Electric, Summer, Starlit. nouns: Street, Avenue, Heartbreak, Radio, Parade, Harbor, Skyline, Letters, Drivers, Dreamers. patterns: `{adj} {noun}`, `The {adj} {plural}`, `{noun} Street`, `{word} {numberWord}`, `{place} {plural}`. The blocklist must include the famous real boy bands.
- **Indie** — adj: Quiet, Paper, Faded, Gentle, Wandering, Pale, Soft, Hushed. nouns: Lighthouse, Orchard, Postcards, Cardigan, Tides, Meadow, Moths, Lanterns. patterns: `{adj} {plural}`, `The {noun} {plural}`, `{noun} Season`, `{noun} and the {plural}`.
- **Any** mixes all genre pools and patterns.

### 9.5 Tests (`engine.test.ts`) — all must pass
- Same seed gives the same output; different seeds give different output.
- A batch of 20 has no duplicates (case-insensitive).
- Respects `count`, `startsWith`, `mustInclude`, `uppercase`, and every supported `style`.
- Never outputs a blocklisted name (run 2,000 generations per genre).
- Never outputs an offensive term (run 2,000 generations per genre).
- Every pool has at least 80 entries, no empty strings, no duplicates inside a pool.
- Every genre has at least 8 patterns and at least 5,000 possible combinations.
- Output length is at most 40 characters; no double spaces; no leading or trailing spaces.
- Too-strict constraints return fewer names plus a `warning` and do not hang (guard against infinite loops).

---

## 10. SEO specification (most important)

### 10.1 Page metadata (Next.js Metadata API via one `buildMetadata()` helper)
Every page sets: `title`, `description`, `alternates.canonical` (absolute, self-referencing, built from `SITE_URL` + path with trailing slash), `openGraph` (type, url, title, description, image, siteName, locale `en_US`), `twitter` (`summary_large_image`), `robots: { index, follow }` (the 404 page is `noindex`). Set `metadataBase` in the root layout.
- Title: at most 60 characters ideally, **65 hard limit** (enforced by the audit). Put the primary keyword first. Brand suffix only if it fits.
- Description: **70–160 characters**, includes the primary keyword naturally, written for humans, unique per page.
- Suggested titles: Main "Band Name Generator – Free Random Band Names" · K-pop "K-pop Band Name Generator – Group Name Ideas" · Metal "Metal Band Name Generator – Dark & Heavy Names" · Heavy metal "Heavy Metal Band Name Generator – Classic Names" · Rock "Rock Band Name Generator – Free Name Ideas" · Random "Random Band Name Generator – Instant Ideas" · Boy band "Boy Band Name Generator – Catchy Group Names". Write the descriptions yourself.

### 10.2 On-page rules
- Exactly one `<h1>`, containing the primary keyword. Logical H2/H3 structure. Primary keyword also appears in the first 100 words, one H2, the title and the meta description. Use natural variants ("band names generator", "band name maker", "cool band names"). **No keyword stuffing.**
- Descriptive internal anchor text (never "click here").
- Every image has meaningful `alt` text (decorative SVG gets `aria-hidden="true"`).
- Visible "Last updated" date on guides and on the main tool page (from the content file, not the build time).

### 10.3 Structured data (JSON-LD, only what is true and visible; examples in Appendix B)
- Site-wide: `WebSite`, `Organization` (name, url; no fake address, phone or social profiles).
- Tool pages: `WebApplication` (free, `isAccessibleForFree: true`, **no** `aggregateRating` and no reviews) + `BreadcrumbList`.
- Pages with a visible FAQ: `FAQPage` matching the on-page text exactly. Note in the docs that Google limits FAQ rich results for most sites, so this is for clarity, not a traffic promise.
- Guides: `Article` (headline, datePublished, dateModified, author as the site/organisation unless the owner supplies a real person).
- Validate: every JSON-LD block parses as JSON and has `@context` and `@type` (the audit checks this).

### 10.4 Technical files
- `src/app/sitemap.ts` (`force-static`): all indexable URLs from `lib/routes.ts`, with `lastModified` taken from each page's content date. Do not list the 404 page, do not list blocked pages that are not built.
- `src/app/robots.ts` (`force-static`): allow all, `Sitemap: {SITE_URL}/sitemap.xml`.
- Canonical host: one version only (apex, no `www`). Redirect `www` to the apex and force HTTPS in the hosting/domain settings (document in `docs/05`).
- `public/_headers` (Appendix A) for security headers and long-term caching of `/_next/static/*`.
- Favicon set (`icon.svg`, `favicon.ico`, `apple-touch-icon.png`), and a default OG image 1200×630. Prefer `src/app/opengraph-image.tsx` (ImageResponse); if it does not work in static export, create a PNG by another method or list it as a TODO for the owner.
- No `ads.txt` yet.

### 10.5 Internal linking (hub and spoke)
- Home → tool, all live genre pages, guides.
- Main tool page → every live genre page (grid with descriptive anchors) and 2–3 guides.
- Each genre page → main page (anchor "band name generator"), 3 sibling genre pages, 1–2 guides.
- Each guide → the main tool and the relevant genre pages, inside the text.
- Footer on every page → tools, genres, guides, legal pages.
- Breadcrumbs on every inner page.
- No orphan pages. The audit computes inbound internal links per page.

### 10.6 Performance budgets (mobile)
- LCP ≤ 2.5s (target 2.0s), CLS ≤ 0.1 (target 0.05), INP ≤ 200ms.
- First Load JS reported by `next build` for tool pages ≤ 130 kB (target lower). Keep non-tool pages mostly static with minimal client JS.
- No render-blocking third-party requests. Fonts self-hosted via `next/font`. No layout shift from fonts, results, toasts or (later) ads: reserve space where needed.
- Lighthouse (mobile) targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100. Run it against `npm run start` output if Chrome is available; otherwise leave the item unticked and list "Owner to run PageSpeed Insights".

### 10.7 Content quality rules (this is what AdSense and Google both look for)
- Original, helpful, human-sounding English. Short paragraphs. Concrete advice. No filler openings such as "In today's fast-paced world".
- Every page has a clear purpose and does not repeat another page.
- Every page has substantial unique text (minimums in Section 6).
- No auto-generated near-duplicate pages. Genre pages must differ in word lists, examples and advice.
- No unverifiable claims, no fake social proof, no medical/legal/financial advice.

### 10.8 Trust signals (AdSense readiness)
About, Contact, Privacy Policy, Terms, visible navigation, working footer, no broken links, no "under construction" pages, no placeholder text left in production (`TODO(owner)` and `YourSiteName` are allowed during development but `seo:audit --strict` must fail on them before deployment).

### 10.9 `npm run seo:audit` — implement `scripts/seo-audit.mjs` (uses `cheerio`)
Scans `out/**/*.html` after `next build`. For each page it checks:
- `<html lang="en">`, viewport meta, one `<title>` (≤ 65 chars), meta description (70–160 chars), exactly one `<h1>`, at least 2 `<h2>` on content pages.
- Canonical present, absolute, equals `SITE_URL` + route. OG tags (title, description, image, url) and Twitter card present.
- Every JSON-LD block parses and has `@context` and `@type`.
- All `<img>` have `alt`.
- Main-content word count (inside `<main>`, excluding nav and footer) meets the minimum for the page type (config table at the top of the script).
- Titles and descriptions are unique across pages.
- Every internal `href` resolves to a file in `out/` (with or without trailing slash) or a static asset. Report broken links.
- Inbound internal link counts: at least 3 per content page, at least 1 for legal pages; every page reachable within 3 clicks from `/`.
- Genre pages: shingle-based similarity (5-word shingles, Jaccard) between the main text of any two genre pages must be below **0.30**. (This is a heuristic threshold, adjust only with a note in the docs.)
- `404.html` has `noindex`. No indexable page has `noindex`.
- `sitemap.xml` contains exactly the indexable pages; `robots.txt` contains the `Sitemap:` line.
- No `<script src="http...">` or other third-party origin while `NEXT_PUBLIC_ADS_ENABLED` is not `true`.
- With `--strict`: fail if `TODO(owner)`, `YourSiteName` or `example.com` appear in any output page.
It prints a table, writes `docs/seo-audit-report.md`, and exits with code 1 on any failure.

---

## 11. Copywriting rules

- Voice: friendly, clear, practical, second person ("you"). Short sentences. No hype words ("revolutionary", "ultimate").
- Describe only what the tool really does. If a feature is not built, it is not mentioned on the site.
- Spelling: American English.
- Each guide and genre page gets a human-quality, original draft. After writing, re-read it once for accuracy and repetition.
- Placeholders for the owner are `TODO(owner): ...`. List them all in `docs/00-PROJECT-STATUS.md`.

---

## 12. AdSense readiness (code only, ads stay OFF)

- `AdSlot` component: renders nothing (and reserves no space) unless `NEXT_PUBLIC_ADS_ENABLED === 'true'`. When enabled later it renders a fixed-height container (to avoid layout shift) and loads the AdSense script once.
- Planned slot positions (documented, not active): below the tool results, between content sections on the main page and guides, and a sticky sidebar slot on wide screens for guides. **Never** in the hero, above the tool, on legal pages, or on the 404 page. Maximum 3 slots per page.
- The privacy page already contains the "applies only if enabled" advertising section.
- For visitors in the EEA and UK, AdSense requires a Google-certified consent management platform (CMP) that supports the IAB TCF. Do **not** build a custom consent banner for ad purposes. Add a Phase 7 task: after AdSense approval, enable Google's own consent message in the AdSense account (or another certified CMP) before turning ads on.
- No `ads.txt` until the owner has the publisher ID.

---

## 13. Documentation system (`docs/`)

Purpose: the owner can read these files and fully understand the project, and can hand the bundle to a reviewer. Everything here must be accurate and current.

### 13.1 Files
| File | Contents |
|---|---|
| `docs/00-PROJECT-STATUS.md` | **Master file.** Progress summary (counts and percent per phase), the full master checklist (Section 14, copied exactly with tick states), "Open placeholders" table, "Needs owner input" list, "Known issues", decisions log, tool and Node versions. |
| `docs/01-FEATURES.md` | Every tool and feature, what it does, status (done / not done), and where the code lives (paths). Total tools count. |
| `docs/02-SEO.md` | SEO implementation status. Per-page table: URL, title, description, H1, target keyword, schema types, inbound links count, status. Technical SEO checklist status. Cannibalisation notes. Off-site plan. |
| `docs/03-PAGES-AND-DESIGN.md` | Page inventory with status, design tokens, typography, component list, responsive behaviour, contrast results, screenshots list. |
| `docs/04-KEYWORDS.md` | Keyword data from Section 5, mapping to pages, items still to verify. |
| `docs/05-DEPLOY-AND-LAUNCH.md` | Exact deployment steps (Netlify and Cloudflare Pages), domain steps, Search Console steps, AdSense steps, post-launch plan. |
| `docs/06-CHANGELOG.md` | Dated log, newest first: what changed, which files, which task IDs. |
| `docs/seo-audit-report.md` | Generated by `npm run seo:audit`. Do not edit by hand. |
| `docs/evidence/` | Saved outputs of build, test, lint, audit, and optional screenshots/Lighthouse results. |
| `docs/_BUNDLE_FOR_REVIEW.md` | Generated by `npm run docs:bundle`: all docs concatenated in order, plus route list from `out/`, dependency list, last 20 git commits, and the contents of `docs/evidence/*.txt`. This single file is what the owner sends for verification. |

### 13.2 Tick rules (repeat)
- `[x]` only when finished and verified, with evidence text. `[ ]` for everything else. No other symbols.
- Phase headings show the count, for example `Phase 2 — 5/6 done`.
- The summary at the top of `docs/00` must be recalculated after every task.
- If something was done differently from this prompt, record it in the decisions log with the reason.

### 13.3 Update routine (after every task)
1. Tick the item in `docs/00` (with evidence). 2. Update the matching detail file (01–04). 3. Add a line to `docs/06-CHANGELOG.md`. 4. At the end of each phase run `npm run verify` and commit.

### 13.4 `scripts/bundle-docs.mjs`
Concatenates `docs/00` → `06`, `seo-audit-report.md`, then appends: route list from `out/`, the dependency list from `package.json`, `git log -n 20 --oneline` (skip gracefully if git is unavailable), and each file in `docs/evidence/`. Output: `docs/_BUNDLE_FOR_REVIEW.md`. Use only Node built-ins.

### 13.5 `AGENTS.md` (create in Phase 0, at most 6 KB; Antigravity reads it automatically)
It must contain these standing rules in short form: read `docs/00-PROJECT-STATUS.md` at the start of every session; follow the ticking rules; never fabricate; no network calls in tool code; no third-party scripts until Phase 7; use only allowed dependencies; update docs after every task; run `npm run verify` before claiming a phase is done; stack = Next.js static export + TypeScript + plain CSS; content must be original; ask the owner only when blocked by missing owner input.

---

## 14. Execution plan and master checklist

Copy this checklist into `docs/00-PROJECT-STATUS.md` exactly (IDs included) and keep it up to date. All boxes start unticked.

### Phase 0 — Setup and rules
- [ ] P0-01 Check `node -v` (≥ 20.9) and `npm -v`; record versions.
- [ ] P0-02 Scaffold the project with `npx create-next-app@latest` in the workspace (answers if prompted: TypeScript yes, ESLint yes, Tailwind **no**, `src/` directory yes, App Router yes, import alias `@/*`). If the folder is not empty, scaffold in a temp folder and move the files up.
- [ ] P0-03 `git init`, correct `.gitignore` (`node_modules`, `.next`, `out`, `.env*.local`), first commit.
- [ ] P0-04 `next.config.ts` as in Section 3.4; `.nvmrc`; `.env.example`; `src/config/site.ts`.
- [ ] P0-05 Install only the allowed dependencies; add all scripts from Section 3.6.
- [ ] P0-06 Create `AGENTS.md` (Section 13.5).
- [ ] P0-07 Create the full `docs/` skeleton and copy this checklist into `docs/00`.
- [ ] P0-08 `npm run build` succeeds and produces `out/index.html`; `npm run start` serves it.

### Phase 1 — Design system and layout shell
- [ ] P1-01 `tokens.css` (light and dark) + fonts via `next/font` + global reset and typography.
- [ ] P1-02 Prose styles for long-form content.
- [ ] P1-03 Header with nav, mobile menu (accessible), theme toggle without flash, skip link.
- [ ] P1-04 Footer (4 columns, real links).
- [ ] P1-05 UI primitives: Button, Chip, Card, Container, Section, Faq, Toast.
- [ ] P1-06 Breadcrumbs (with BreadcrumbList JSON-LD).
- [ ] P1-07 `buildMetadata()` helper and `JsonLd` component; `lib/routes.ts` registry.
- [ ] P1-08 `AdSlot` inert component.
- [ ] P1-09 Custom 404 page that exports `out/404.html` with noindex.
- [ ] P1-10 Contrast check of all token pairs recorded in `docs/03`.
- [ ] P1-11 Visual check at 390, 768 and 1280 px widths, light and dark (screenshots in `docs/evidence/screens/` if browser tooling is available).

### Phase 2 — Generator engine (no UI)
- [ ] P2-01 Types, seeded RNG, safe storage helper.
- [ ] P2-02 Pools for all 9 genre ids, each pool ≥ 80 unique entries.
- [ ] P2-03 Patterns: ≥ 8 per genre, style coverage rules respected.
- [ ] P2-04 `blocklist.ts` with ≥ 250 real names; `offensive.ts`.
- [ ] P2-05 `generateNames()` with all constraints and the loop guard.
- [ ] P2-06 All tests in Section 9.5 pass (`npm test`).
- [ ] P2-07 `npm run check:no-network` passes (no `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket` in `src/lib/generator` and `src/components/tool`).

### Phase 3 — Tool UI and main tool page  ⟵ **CHECKPOINT 1**
- [ ] P3-01 `BandNameGenerator` component with controls F1–F7 and results F8.
- [ ] P3-02 Copy, Copy all, Save, Saved panel, Download .txt (F9, F10).
- [ ] P3-03 Check availability menu with the four links and the disclaimer (F11).
- [ ] P3-04 Friendly "too strict" message (F12) and starter names in static HTML (F13).
- [ ] P3-05 Mobile layout: Generate button visible without scrolling at 390×844 (verified).
- [ ] P3-06 Keyboard-only run-through and screen-reader semantics (aria-live, radiogroup, labels) verified.
- [ ] P3-07 `/band-name-generator/` page with all content sections (≥ 1,000 words) and FAQ (8 Qs).
- [ ] P3-08 Metadata, canonical, OG, JSON-LD (WebApplication, BreadcrumbList, FAQPage) on the main page.
- [ ] P3-09 `npm run verify` green for this phase. **STOP and give the owner a walkthrough** (what was built, how to run it, screenshots, open placeholders). Wait for "continue".

### Phase 4 — Home, tools index and genre pages
- [ ] P4-01 Home page with all sections in 8.1 (≥ 350 words).
- [ ] P4-02 `/tools/` index (≥ 150 words).
- [ ] P4-03 Genre config type and the `[genre]` route with `generateStaticParams`, `dynamicParams = false`.
- [ ] P4-04 `/band-name-generator/kpop/` complete, unique content ≥ 600 words.
- [ ] P4-05 `/band-name-generator/metal/` complete.
- [ ] P4-06 `/band-name-generator/heavy-metal/` complete and clearly different from metal.
- [ ] P4-07 `/band-name-generator/rock/` complete.
- [ ] P4-08 `/band-name-generator/random/` complete.
- [ ] P4-09 `/band-name-generator/boy-band/` complete.
- [ ] P4-10 Hub-and-spoke links in place (10.5).
- [ ] P4-11 `/band-name-generator/punk/` — **BLOCKED until the owner confirms volume/KD**.
- [ ] P4-12 `/band-name-generator/pop/` — **BLOCKED until the owner confirms volume/KD**.

### Phase 5 — Trust pages and guides
- [ ] P5-01 About page.
- [ ] P5-02 Contact page.
- [ ] P5-03 Privacy Policy (draft for owner review).
- [ ] P5-04 Terms.
- [ ] P5-05 Markdown guide pipeline (`content/guides`, `gray-matter`, `marked`, TOC, last-updated).
- [ ] P5-06 Guide 1: How to Choose a Band Name (≥ 1,000 words).
- [ ] P5-07 Guide 2: Band Name Ideas by Genre (≥ 1,000 words).
- [ ] P5-08 Guide 3: How to Check If a Band Name Is Already Taken (≥ 1,000 words).
- [ ] P5-09 `/guides/` index.

### Phase 6 — SEO infrastructure and audit  ⟵ **CHECKPOINT 2**
- [ ] P6-01 `sitemap.ts` and `robots.ts` (static) produce `out/sitemap.xml` and `out/robots.txt` correctly.
- [ ] P6-02 `public/_headers` in place and copied to `out/_headers`.
- [ ] P6-03 Favicon set and default OG image.
- [ ] P6-04 JSON-LD present on all page types and valid.
- [ ] P6-05 `scripts/seo-audit.mjs` implemented as in 10.9.
- [ ] P6-06 `npm run seo:audit` passes with zero failures (non-strict).
- [ ] P6-07 Genre page similarity check passes (< 0.30).
- [ ] P6-08 No broken internal links; no orphan pages (from the audit).
- [ ] P6-09 `npm run build` shows First Load JS ≤ 130 kB on tool pages (record the numbers).
- [ ] P6-10 Lighthouse mobile scores recorded (or listed as "Owner to run").
- [ ] P6-11 No console errors; no third-party requests (verified by running the built site).
- [ ] P6-12 `npm run verify` green and `docs/_BUNDLE_FOR_REVIEW.md` generated. **STOP and report** to the owner with the bundle.

### Phase 7 — Deployment and launch (needs the owner)
- [ ] P7-01 Owner supplies: site name, domain, contact email, owner/brand statement. Replace all `TODO(owner)` placeholders. `npm run seo:audit -- --strict` passes.
- [ ] P7-02 Code pushed to a GitHub repository.
- [ ] P7-03 Site connected to Netlify (or Cloudflare Pages): build command `npm run build`, publish directory `out`, Node version from `.nvmrc`.
- [ ] P7-04 Custom domain connected, HTTPS on, `www` redirects to the apex.
- [ ] P7-05 `NEXT_PUBLIC_SITE_URL` set to the real domain and the site redeployed.
- [ ] P7-06 Google Search Console domain property verified, sitemap submitted.
- [ ] P7-07 Bing Webmaster Tools set up (import from Search Console).
- [ ] P7-08 URL Inspection → request indexing for Home, main tool page, and each genre page.
- [ ] P7-09 PageSpeed Insights run on the live URL; results recorded in `docs/evidence/`.
- [ ] P7-10 Wait until the pages are indexed and the site has been live for a few weeks, then apply for AdSense (owner).
- [ ] P7-11 After approval: add `ads.txt` with the publisher ID, enable Google's consent message (certified CMP) for EEA/UK traffic, set `NEXT_PUBLIC_ADS_ENABLED=true`, place the AdSlots, re-run `verify` and check layout shift.

### Phase 8 — Optional improvements (leave unticked until done)
- [ ] P8-01 Metal umlaut flair toggle.
- [ ] P8-02 Per-genre OG images.
- [ ] P8-03 Shareable result state via URL hash.
- [ ] P8-04 Indie genre page (after the owner verifies keyword data).
- [ ] P8-05 Additional pages from verified keyword groups (AI, India, word-based).
- [ ] P8-06 Tool #2 (the owner picks from the keyword research; for example `yaml to json`).
- [ ] P8-07 Off-site work by the owner: genuinely useful posts and answers in music communities where self-promotion is allowed, a short outreach list of music/producer blogs. No bought links, no link schemes.

---

## 15. Definition of done and final report

The project phase is done only if:
1. `npm run verify` passes (lint, tests, no-network check, build, SEO audit, docs bundle).
2. Every ticked item has evidence next to it; every unfinished item is unticked.
3. Docs match the code.
4. No `TODO(owner)` is hidden: all are listed in `docs/00`.

**Final report format** (post in chat at each checkpoint and at the end):
- What was completed (list of task IDs).
- What is not completed and why (list of task IDs).
- Commands to run locally (`npm install`, `npm run dev`, `npm run verify`).
- Metrics: page count, build First Load JS, audit result, Lighthouse scores if available.
- Open placeholders and needed owner inputs.
- Location of `docs/_BUNDLE_FOR_REVIEW.md`.

---

## Appendix A — `public/_headers`
```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```
(No Content-Security-Policy yet: it must be designed together with AdSense in Phase 7.)

## Appendix B — JSON-LD examples (fill with real values from `site.ts` and the page content)
WebApplication (tool page):
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Band Name Generator",
  "url": "{SITE_URL}/band-name-generator/",
  "description": "Generate original band names by genre and style. Runs in your browser.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any (web browser)",
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
```
BreadcrumbList (example):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "{SITE_URL}/" },
    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "{SITE_URL}/tools/" },
    { "@type": "ListItem", "position": 3, "name": "Band Name Generator", "item": "{SITE_URL}/band-name-generator/" }
  ]
}
```
FAQPage: one `Question` per visible FAQ item with the exact visible answer text. Article (guides): `headline`, `datePublished`, `dateModified`, `author` (organisation unless the owner provides a real person), `mainEntityOfPage`.

## Appendix C — Genre content type (`src/content/genres/*.ts`)
```ts
export interface GenreContent {
  slug: 'kpop'|'metal'|'heavy-metal'|'rock'|'random'|'boy-band'|'punk'|'pop';
  genreId: GenreId;                  // preset used by the tool
  label: string;                     // "K-pop"
  primaryKeyword: string;            // "kpop band name generator"
  secondaryKeywords: string[];
  seo: { title: string; description: string };
  h1: string;
  intro: string;                     // 2-3 unique sentences
  examples: string[];                // 12 hand-written names (static HTML)
  sections: { heading: string; paragraphs: string[] }[];   // 3-4 unique sections
  faqs: { q: string; a: string }[];  // 4-5 genre-specific
  related: string[];                 // sibling genre slugs
  guides: string[];                  // guide slugs
  updated: string;                   // ISO date, used for lastModified
  status: 'live' | 'blocked-owner-input';
}
```

## Appendix D — Start now
Begin with **Phase 0**. Before writing code, post a short implementation plan (phases, folder structure, anything in this file you think is unclear or risky). Then execute. At **CHECKPOINT 1** (end of Phase 3) and **CHECKPOINT 2** (end of Phase 6), stop and report as described in Section 15.
