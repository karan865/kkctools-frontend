# AGENTS.md — Standing Rules for AI Coding Agents

You are working on a multi-tool website whose primary tool is the **Band Name Generator**. Follow these non-negotiable standing rules at all times:

## 1. Core Operating Rules
1. **Always read `docs/00-PROJECT-STATUS.md`** at the beginning of every session to check the current phase, completed tasks, open placeholders, and known issues.
2. **Follow the Ticking Rule strictly**:
   - Mark a task `[x]` ONLY after it is fully built AND verified with concrete evidence (command output or file path).
   - Write the verification evidence right next to the tick.
   - Never tick optimistically; unfinished tasks remain `[ ]`.
3. **Never fabricate facts or proof**:
   - No fake reviews, testimonials, ratings, statistics, social proof, author bios, or fake legal claims.
   - Use `TODO(owner): <description>` whenever human owner input is needed, and log it in `docs/00-PROJECT-STATUS.md`.
4. **Zero network calls in tool code**:
   - The generator must run entirely client-side inside the browser.
   - Do NOT use `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, or external AI/analytics APIs in `src/lib/generator` or `src/components/tool`.
   - Verified by `npm run check:no-network`.
5. **Zero third-party scripts until Phase 7**:
   - No external trackers, ads, social widgets, or remote scripts. Ads remain inert placeholders until enabled by the owner.
6. **Use only allowed dependencies**:
   - Runtime: `next`, `react`, `react-dom`, `gray-matter`, `marked`.
   - Dev: `typescript`, `@types/*`, `eslint`, `prettier`, `vitest`, `vite-tsconfig-paths`, `cheerio`, `serve`.
   - Do not add any other dependency without explicit owner approval.
7. **Tech Stack**:
   - Next.js App Router with static export (`output: 'export'`).
   - React, TypeScript (strict mode).
   - Plain CSS (CSS tokens in `tokens.css` + CSS Modules). No Tailwind, no component libraries.
   - Unit tests run with Vitest.
8. **Original, human-quality content**:
   - Never scrape or copy competitor text, word lists, or layouts.
   - Write thorough, unique copy for every page and genre (Jaccard similarity < 0.30 between genre pages).
9. **Update documentation continuously**:
   - After completing each task, update `docs/00-PROJECT-STATUS.md` and related detail documents (`docs/01-06`).
   - If code and documentation disagree, the task is considered incomplete.
10. **Run `npm run verify`** before claiming any phase is finished.
11. **Ask owner only when truly blocked** by missing owner facts or at designated checkpoints (Checkpoint 1 after Phase 3, Checkpoint 2 after Phase 6). Otherwise keep executing systematically.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
