# 01 — Features & Tool Directory

## 1. Overview
This website is a fast, multi-tool platform hosting client-side utilities.
- **Total Tools:** 1 (Tool #1: Band Name Generator)
- **Architecture:** Pure browser execution (zero API/server dependencies)

---

## 2. Tool #1: Band Name Generator Features

| Feature ID | Feature Name | Description | Status | Code Path |
|---|---|---|---|---|
| **F1** | Genre Selector | Radio chips: Any, Rock, Metal, Heavy Metal, Punk, Pop, K-pop, Boy Band, Indie | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F2** | Name Style | Select: Any, "The ...", Two words, One word, "X of Y" | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F3** | Batch Count | Options for 5, 10 (default), 20 names per generation | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F4** | Starts With | A–Z letter filter on first significant word | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F5** | Must Include Word | Custom word injected into compatible template, sanitized & filtered | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F6** | ALL CAPS Toggle | Capitalize entire output (default ON for K-pop) | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F7** | Generate Action | Large button + Enter key triggers new batch avoiding last 50 names | Done ✅ | `src/components/tool/band-name-generator/Controls.tsx` |
| **F8** | Results List | Ordered list with large styled text, copy, save, and check buttons | Done ✅ | `src/components/tool/band-name-generator/Results.tsx` |
| **F9** | Copy Actions | One-click copy and copy-all with fallback & non-shifting "Copied" alert | Done ✅ | `src/components/tool/band-name-generator/ResultRow.tsx` |
| **F10** | Saved Names Panel | LocalStorage-backed favorites with copy-all & download .txt export | Done ✅ | `src/components/tool/band-name-generator/SavedPanel.tsx` |
| **F11** | Availability Check Menu | Google, Spotify, Bandcamp, and YouTube search links with disclaimer | Done ✅ | `src/components/tool/band-name-generator/CheckMenu.tsx` |
| **F12** | Friendly Constraint Warning | Announce "Try fewer filters" if constraints yield fewer names | Done ✅ | `src/components/tool/band-name-generator/Results.tsx` |
| **F13** | Server Starter Names | Curated starter names rendered in static HTML (no hydration mismatch) | Done ✅ | `src/components/tool/band-name-generator/BandNameGenerator.tsx` |

---

## 3. Core Engine Modules (`src/lib/generator/`)

- `types.ts`: GenreId, StyleId, GenerateOptions, GenerateResult.
- `rng.ts`: Seeded PRNG using mulberry32 algorithm.
- `pools/*.ts`: Word pools for all 9 genres (80+ words per pool).
- `patterns.ts`: Weighted template patterns per genre (8+ per genre, >5,000 combinations per genre).
- `blocklist.ts`: 260+ famous band/artist names to avoid duplicates.
- `offensive.ts`: Explicit/slur sanitization filter.
- `engine.ts`: Core name assembly and constraint validation engine.
