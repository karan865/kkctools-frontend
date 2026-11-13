# Agentic audit kkctools.com (2026-11-14)
- Lighthouse Agentic Browsing: unavailable (PSI HTTP 429 daily quota, mobile and desktop). No X/N.
- Agent-UX heuristic: unavailable (Playwright chromium spawn failed on this machine). Static HTML inspection used instead.
- Server-rendered: pass (1228 words without JS). robots.txt: pass; AI groups GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended all Allow /. Content-Signal absent (draft, checked 2026-09-23).
- llms.txt: 200, passes Lighthouse rules; hygiene: "Website:" line not a [name](url) link, empty H2. llms-full 404.
- Markdown: none (opportunity). .well-known api-catalog/oauth/agent-card/ucp/ai-catalog.json: 404 (opportunity). WebMCP: none, 0 forms (draft).
- Access: training allowed (GPTBot/ClaudeBot/Google-Extended); search allowed (*, PerplexityBot); user-triggered allowed (ChatGPT-User; Claude-User honours robots).
## Forms (static HTML)
- Band generator: labels with for/id on select/input; genre chips are role=radio buttons with aria-label; results have per-item aria-labels (Copy X, Save X); aria-live count. Genre label lacks for (group labelled via id "genre-label" - verify aria-labelledby).
- Square footage: label for/id on inputs/selects; tabs role=tab aria-selected; results aria-live. Gaps: Waste Allowance label has no control association; waste chips are plain buttons (text "0","5","10") with no aria-pressed/aria-label, selected state only via CSS class; tab buttons lack aria-controls; ids are React-generated (unstable but fine). Calculator likely operable by an agent.
