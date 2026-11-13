# Schema audit: kkctools.com (2026-11-14)
Score: 62/100. All JSON-LD, no microdata/RDFa. Sitewide WebSite+Organization present on all 8 pages (raw HTML, server-rendered).

## Findings
HIGH
1. No @id anywhere; graph is disconnected. WebSite/Organization/WebApplication/Article are repeated as unlinked inline stubs (publisher duplicated as a bare Organization). Add @id + @graph.
2. Organization lacks logo, sameAs, description (no logo = no knowledge panel eligibility). Don't invent sameAs; TODO(owner).
3. WebSite has no publisher link, no inLanguage. (No SearchAction needed; there is no site search.)
4. /about/ emits a second Organization (duplicate of sitewide one) and no AboutPage.
MEDIUM
5. Article: no image (required for Google Article rich results recommended), no author Person (author is Organization; OK but weak E-E-A-T), mainEntityOfPage is a bare string instead of WebPage @id, dates are date-only (use full ISO 8601 with timezone). Date 2026-11-08 ok.
6. WebApplication inconsistency: /band-name-generator/metal/ missing description, browserRequirements, publisher; uses "Any" vs "All" and MultimediaApplication vs UtilitiesApplication. Band generator has isAccessibleForFree, square-footage/brick lack it. Fix to a consistent template. No aggregateRating anywhere (good).
7. Square-footage page emits FAQPage twice (duplicate blocks); brick page uses one array-style block while others use separate scripts (valid but inconsistent). Dedupe.
8. Breadcrumb names inconsistent: calculators use "Calculators" -> /tools/, but /tools/ itself says "All Tools", band generator says "Tools". Breadcrumb for /guides/ parent should be verified to exist (200).
LOW / INFO
9. FAQPage present on /, band-name-generator, metal, square-footage, brick: Info only; no Google SERP feature since May 7 2026. No action.
10. Home/tools pages: no CollectionPage/ItemList for tools hub; /tools/ and / have no WebPage node. Optional.
11. Home breadcrumb absent (fine).

## Ready-to-use JSON-LD
### Sitewide (replace the two stubs, in layout)
```json
{"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":"https://www.kkctools.com/#organization","name":"KKC Tools","url":"https://www.kkctools.com/","logo":{"@type":"ImageObject","url":"https://www.kkctools.com/TODO-logo-512.png","width":512,"height":512}},
{"@type":"WebSite","@id":"https://www.kkctools.com/#website","name":"KKC Tools","url":"https://www.kkctools.com/","description":"Free Online Generators & Creative Tools","inLanguage":"en-US","publisher":{"@id":"https://www.kkctools.com/#organization"}}
]}
```
(logo URL: TODO(owner) supply a real file; add sameAs only with real profiles.)

### Tool page (example brick; template for all tools)
```json
{"@context":"https://schema.org","@graph":[
{"@type":"WebPage","@id":"https://www.kkctools.com/brick-calculator/#webpage","url":"https://www.kkctools.com/brick-calculator/","name":"Brick Calculator","isPartOf":{"@id":"https://www.kkctools.com/#website"},"breadcrumb":{"@id":"https://www.kkctools.com/brick-calculator/#breadcrumb"},"mainEntity":{"@id":"https://www.kkctools.com/brick-calculator/#app"}},
{"@type":"WebApplication","@id":"https://www.kkctools.com/brick-calculator/#app","name":"Brick Calculator","url":"https://www.kkctools.com/brick-calculator/","description":"Free brick calculator to estimate bricks, mortar bags, and pallets for any wall.","applicationCategory":"UtilitiesApplication","operatingSystem":"Any","browserRequirements":"Requires JavaScript. Requires HTML5.","isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"publisher":{"@id":"https://www.kkctools.com/#organization"}},
{"@type":"BreadcrumbList","@id":"https://www.kkctools.com/brick-calculator/#breadcrumb","itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"https://www.kkctools.com/"},
{"@type":"ListItem","position":2,"name":"Tools","item":"https://www.kkctools.com/tools/"},
{"@type":"ListItem","position":3,"name":"Brick Calculator","item":"https://www.kkctools.com/brick-calculator/"}]}
]}
```
### Guide
```json
{"@context":"https://schema.org","@type":"Article","@id":"https://www.kkctools.com/guides/how-to-choose-a-band-name/#article","headline":"How to Choose a Band Name: The Complete Practical Guide","description":"A step-by-step masterclass on brainstorming, testing phonetics, verifying trademark clearance, and finalizing an unforgettable band name.","image":["https://www.kkctools.com/TODO-guide-image.jpg"],"datePublished":"2026-11-08T00:00:00+00:00","dateModified":"2026-11-08T00:00:00+00:00","mainEntityOfPage":{"@type":"WebPage","@id":"https://www.kkctools.com/guides/how-to-choose-a-band-name/"},"author":{"@id":"https://www.kkctools.com/#organization"},"publisher":{"@id":"https://www.kkctools.com/#organization"},"isPartOf":{"@id":"https://www.kkctools.com/#website"}}
```
### /about/
```json
{"@context":"https://schema.org","@type":"AboutPage","@id":"https://www.kkctools.com/about/#webpage","url":"https://www.kkctools.com/about/","name":"About KKC Tools","isPartOf":{"@id":"https://www.kkctools.com/#website"},"about":{"@id":"https://www.kkctools.com/#organization"}}
```
Remove the duplicate Organization block from /about/.
