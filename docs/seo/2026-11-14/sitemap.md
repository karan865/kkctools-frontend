# Sitemap audit kkctools.com
- sitemap.xml valid urlset, 37 URLs, 0 dupes, 0 invalid, all lastmod valid. robots.txt OK, declares sitemap, no stray sitemap paths.
- All 37 URLs: 200, no redirects, self-canonical (trailing slash), no noindex. Slash style consistent.
- HIGH: live site 404s (noindex) for /concrete-calculator/, /drywall-calculator/, /rebar-calculator/ (repo has them in src/lib/routes.ts + src/app; commits c08b669 etc. not deployed). Not in sitemap, not linked from / or /tools/. Will auto-add on deploy (sitemap.ts built from INDEXABLE_ROUTES).
- LOW: sitemap includes priority/changefreq (ignored by Google).
- LOW: lastmod spread 11-08..11-11 (17 on 11-08, 46% identical), hand-set "updated" dates, plausible but not verifiable.
- LOW: homepage links omit paver-base, paver-sand, compost, fence-stain (in sitemap and /tools/). /tools/ links all 37 sitemap URLs.
- INFO: stud, tons-to-cubic-yards, paver, compost, fence-stain pages lack robots meta (default indexable; fine but inconsistent).
- No orphans: every sitemap URL linked from /tools/.
