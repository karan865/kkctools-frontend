# 06 — Changelog

All notable changes to this project will be documented in this file, sorted newest first.

---

### [Phase 2 Complete] — 2026-11-08
- **Tasks Completed:** P2-01, P2-02, P2-03, P2-04, P2-05, P2-06, P2-07.
- **Details:**
  - Implemented core pure TypeScript generator engine (`src/lib/generator/`): Mulberry32 seeded RNG, safeStorage helper.
  - Curated 9 genre word pools with 80+ distinct words per pool.
  - Implemented 8+ weighted patterns per genre supporting 'the', 'two-word', 'one-word', and 'of-phrase' styles (>5,000 combinations per genre).
  - Built blocklist of 260+ famous bands with normalized checking and explicit slur/offensive filter.
  - Built `generateNames()` with constraint validation, loop guards (500 max attempts), and friendly warnings.
  - Passed all 9 Vitest unit tests in `src/lib/generator/engine.test.ts`.
  - Verified zero network calls via `check:no-network`.

### [Phase 1 Complete] — 2026-11-08
- **Tasks Completed:** P1-01, P1-02, P1-03, P1-04, P1-05, P1-06, P1-07, P1-08, P1-09, P1-10, P1-11.
- **Details:**
  - Implemented design tokens with Stage Lights theme in `src/styles/tokens.css` with dark/light mode and verified WCAG contrast ≥ 4.5:1.
  - Loaded Google Fonts (Bricolage Grotesque & Inter) self-hosted via `next/font/google`.
  - Built Header with soundwave SVG, accessible desktop dropdown, mobile drawer with escape key and focus trap, and no-flash ThemeToggle.
  - Built 4-column SEO-optimized Footer with legal disclaimers.
  - Implemented UI primitives: Button, Chip, Card, Container, Section, Faq (details/summary), and Toast (polite live region).
  - Implemented Breadcrumbs with BreadcrumbList JSON-LD and single source of truth route registry `src/lib/routes.ts`.
  - Created inert `AdSlot` and custom `not-found.tsx` generating `out/404.html` with noindex.

### [Phase 0 Complete] — 2026-11-08
- **Tasks Completed:** P0-01, P0-02, P0-03, P0-04, P0-05, P0-06, P0-07, P0-08.
- **Details:**
  - Initialized Next.js App Router project with TypeScript strict mode, static export configuration (`output: 'export'`), and trailing slashes.
  - Installed allowed dependencies: `gray-matter`, `marked`, `vitest`, `vite-tsconfig-paths`, `cheerio`, `serve`, `prettier`.
  - Added operational scripts for building, testing, auditing, and checking zero-network usage.
  - Created `AGENTS.md` and complete `docs/` documentation system.
  - Initialized git repository.
