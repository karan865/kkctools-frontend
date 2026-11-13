# Performance (Lighthouse 13.6.0 lab, single run each, throttled; PSI keyless was rate-limited, no CrUX)
| Page | Mob score | LCP | TBT | CLS | Desk score | LCP | TBT |
| / | 84 | 1.8s | 390ms | 0.004 | 91 | 0.5s | 10ms |
| /band-name-generator/ | 71 | 1.8s | 980ms | 0.004 | 82 | 0.7s | 350ms |
| /square-footage-calculator/ | 80 | 1.5s | 710ms | 0.004 | 94 | 0.6s | 170ms |
Transfer ~305-330KiB/page: JS ~172KB (two shared chunks 61.6KB+63.4KB), fonts 90KB (2 woff2), CSS 3 files 14.6KB. Brotli on. HTML cache max-age=0 must-revalidate; hashed assets immutable 1yr. TTFB 200-600ms. A "hud?variant=public" 11KB script loads (likely Netlify, not site code).
Findings: Medium - high mobile TBT / 20 long tasks (3794 chunk 315ms) on band generator; Medium - 23KiB unused JS; Low - 3 render-blocking CSS files (~14KB); Low - 90KB fonts; Low - doc TTFB up to 600ms. INP not measurable in lab (TBT proxy).
