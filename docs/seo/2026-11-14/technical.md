# Technical SEO - kkctools.com - Score 82/100
Pass: HTTPS/redirects (http->https->www, 301), canonicals self-referencing w/ trailing slash, robots meta index,follow, 404 returns real 404, sitemap 37 URLs valid, robots.txt valid, JSON-LD on all pages, SSR/static HTML, viewport present, no external scripts, no imgs missing alt.
Issues:
- HIGH: concrete-calculator, drywall-calculator, rebar-calculator exist in src/app but live URLs return 404 and are absent from sitemap. Deploy them (and confirm sitemap.ts includes them).
- MEDIUM: Homepage/ /tools/ title+description describe "generators / music tools" only; ~21 calculators not reflected. Rewrite.
- MEDIUM: No Content-Security-Policy header; HSTS lacks includeSubDomains/preload. Add in public/_headers.
- MEDIUM: Cache-Control max-age=0,must-revalidate on HTML (Netlify default); verify /_next/static has immutable caching.
- LOW: No IndexNow key file (/indexnow.txt 404); optional (Bing/Yandex) - add key file + ping on deploy.
- LOW: /tools -> /tools/ redirect is 301 (good); all OG images share one generic opengraph-image.png; per-page OG would help.
- LOW: robots.txt Disallow /404.html and /404/ fine; consider also allowing OAI-SearchBot, Applebot-Extended explicitly.
- LOW: llms.txt present (200); keep in sync with new calculators.
