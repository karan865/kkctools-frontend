# 04 — Keyword Strategy & Intelligence

## 1. Where the keyword data lives

| Scope | Source |
|---|---|
| Band Name Generator cluster (Batch 1) | §2 below — SEMrush US, Desktop, Nov 2026 (939 keywords, 20,880 volume, avg KD 13%) |
| Construction calculators (Batch 2) | `docs/keywords analysis/Batch 2/1. master filtered file/KKCTools_Batch2_Final_Tool_Keywords.md` |
| Planned tools (Batches 3–8) | `docs/keywords analysis/Batch N …/2. … filtered master keywords/` (one final-keywords file per batch) |
| Competitor analysis per tool | `docs/keywords analysis/Batch N …/` "All Blogs Data" folders (121 files across Batches 2–8) |

Recorded primary keywords for built Batch 2 tools (from `00-PROJECT-STATUS.md`):
- Concrete Calculator — `concrete volume calculator`, US 3,600 / KD 5.
- Drywall Calculator — `drywall calculator`, US 12,100 / KD 41.
- Lawn Mowing Cost Calculator — `lawn mowing cost calculator`, US 1,000 / KD 3 (secondaries: `free lawn mowing cost calculator` 140/0, `lawn mowing cost calculation` 50/1, `lawn mowing cost calculator per acre` 70/20).
- Shingle Roof Calculator — `shingle roof calculator`, US 1,300 / KD 10; real traffic in the bundle questions (`how many shingles in a bundle` 2,900/10, `how many bundles of shingles in a square` 2,400/6 + variants 1,900 and 1,300), all answered as H2s/FAQs.
- Board and Batten Calculator — `board and batten calculator`, US 4,400 / KD 22 / CPC $5.55. No secondary keywords in the export — `TODO(owner)`: export `batten spacing calculator`, `board and batten spacing`, `accent wall calculator`, `wainscoting calculator`.
- Pipe & Tube Volume Calculator — `tube volume calculator`, US 1,600 / Global 4,800 / KD 12 (in the first paragraph and an H2); support `pipe volume calculator` 3,600 / KD 25 (title + H1).
- Wire Gauge Calculator — `wire gauge calculator`, US 5,400 / Global 8,600 / KD 11; secondaries `size electrical wire calculator` 5,400/13, `wire gauge length calculator` 1,600/14 ("Wire gauge by length" H2), `wire size calculator` 5,400/24.
- Concrete Slab Cost Calculator — `concrete slab cost calculator`, US 8,100 / Global 10,100 / KD 16 / CPC $2.36; H2/FAQ targets `how much is a yard of concrete` 8,100/12, `concrete slab cost per sq ft` 1,300/10, `how much is a 10 yard truck of concrete` 1,000/7, `concrete patio cost` 2,400/7. Cost lives here; quantity stays on `/concrete-calculator/` (pages link to each other).
- Deck Stain Calculator — `deck stain calculator`, US 720 / Global 860 / KD 14; secondaries `stain calculator deck` 1,300/20, `deck staining cost calculator` 390/20 (DIY vs pro cost block), `deck stain coverage calculator` 90/18 (coverage H2). Cross-linked with Fence Stain.
- Fence Cost Calculator — `fence cost calculator`, US 1,600 / Global 2,100 / KD 21 / CPC $1.83; H2/FAQ targets `fence prices chain link` 9,900/16, `cyclone fence cost` 8,100/11, `cost to replace a fence` 3,600/11, `privacy fence cost` 2,400/10, `vinyl fence cost` 2,400/12, `how much does a fence cost` 2,400/10.
- Cubic Feet ↔ Square Feet Converter — `cubic feet to square feet`, US 3,600 / Global 9,100 / KD 23; Indian wording `cft to square feet` 2,400/20 and `square feet to cft` 2,400/23 answered in a cft section and FAQ (cft, brass = 100 cft).
- Metal Roof Cost Calculator — `metal roof cost calculator`, US 1,900 / KD 24 / CPC $4.11; H2/FAQ targets `standing seam metal roof cost` 2,900/7, `roofing cost metal vs shingle` 2,900/13, `how much does a metal roof cost` 2,400/20, `metal roof cost per square foot` 1,300/13.
- Bathroom Remodel Cost Calculator — `cost to remodel bathroom calculator`, US 2,900 / KD 7 / CPC $5.68; `cost of bathroom renovations calculator` 4,400/19 ("renovation" H2), `small bathroom remodel cost calculator` 320/2 (FAQ).
- Floor Refinishing Cost Calculator — `hardwood floor resurfacing cost`, US 6,600 / KD 24 / CPC $4.35 (H1 + H2; irregular trend); `cost to refinish hardwood floors` 3,600/23 (intro + H2).
- Cubic Inch Calculator — `cubic inch calculator`, US 3,600 / KD 9 (title, H1, intro); `engine displacement calculator` 3,600/18 (H2 + first sentence of the engine section). Blueprint title (56 chars) shortened to 52 so it fits 65 with the brand.
- Roof Replacement Cost Calculator — `roof replacement cost calculator`, US 2,900 / KD 4 / CPC $7.42 (title, H1, BLUF); secondaries `how much is a new roof` 4,400 / KD 9, `roofing cost per square` 1,900 / KD 7, `roofing labor cost per square` 1,600 / KD 5, `cost to tear off and replace roof` 480 / KD 14. Target page `/roof-replacement-cost-calculator/`.
- Carpet Cost Calculator — `carpet cost per square foot`, US 4,400 / KD 27 / CPC $1.63 (title, H1, BLUF); secondaries `carpet replacement cost` 4,400 / KD 18 / CPC $8.09 (H2, FAQ), `cost per sq ft for carpet` 3,600 / KD 27, `carpet flooring installation cost` 1,600 / KD 21, `carpet removal prices` 1,300 / KD 24, `berber carpet cost` 1,000 / KD 23, `carpet tile installation cost` 590 / KD 11, `cost to replace carpet on stairs` 590 / KD 12. Target page `/carpet-cost-calculator/`.
- Percentage Change Calculator — primary for now `how to find percent change` US 8,100 / KD 10; `percentage change formula` 6,600/12, `percentage difference between two numbers` 2,900/7, Excel cluster (~20K, KD 24–29). Head term `percentage increase calculator` 74K is long-term only (strong SERP). Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/1. …/01_…_BUILD_SPEC.md`.
- Markup Calculator — `markup calculator` US 14,800 / KD 24 / CPC $5.16 (title, H1, BLUF); `figuring markup` 2,400/12, `what is retail price` 2,400/7, `retail math` 1,900/16, `markup vs margin` 2,400/25.
- Profit Margin Calculator — `gross margin calculator` US 8,100 / KD 8 (first sentence, H2); `gross profit margin formula` 8,100/9, `calculate profit margin` 4,400/11, `net profit margin formula` 3,600/11. SERP hard (Omni, CalculatorSoup, Xero…); realistic target bottom of page 1.
- Unit Price Calculator — see Batch 3 spec `05_Unit_Price_Calculator_BUILD_SPEC.md` (weakest SERP in Batch 3; build order 1).
- Hourly to Salary Calculator — `yearly wage calculator` US 6,600 / KD 0 (primary), `calculate annual salary` 6,600/10, `monthly gross income calculator` 3,600/9, `how to calculate annual income biweekly` 1,300/0. `wage calculator` 18.1K is paycheck/tax intent: natural mention only.
- Discount Calculator — receives the percent-off terms kept off the Percentage Change page (`off percent calculator` 6,600 and "X percent off Y" long tail). `TODO(owner)`: confirm primary keyword and KD from Semrush.
- Cap Rate Calculator — primary `cap rate calculator` US 33,100 / KD 12 / CPC $2.84; secondaries `how to calculate cap rate` 22,200 / KD 18, `what is a good cap rate` 2,400 / KD 24, `what is cap rate` 1,900 / KD 24, `cap rate equation` 1,600 / KD 7, `capitalization rate calculator` 1,600 / KD 8, `what does a 7 cap rate mean` 480 / KD 3. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/06_Cap_Rate_Commercial_Property_Value_Calculator/06_Cap_Rate_Calculator_BUILD_SPEC.md`. Target page `/cap-rate-calculator/`.
- Rental Property Calculator — primary `cash on cash return calculator` US 1,300 / KD 17 / CPC $0.81; secondaries `cash on cash return` 3,600 / KD 7, `calculate rental property` 2,900 / KD 8, `investment property calculator` 1,300 / KD 2, `cash on cash roi` 880 / KD 1, `rental cash flow calculator` 480 / KD 14, `real estate pro forma` 480 / KD 18, `property value to rent ratio` 390 / KD 12. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/07_Rental_Property_Calculator/07_Rental_Property_Calculator_BUILD_SPEC.md`. Target page `/rental-property-calculator/`.
- Labor Cost Calculator — primary `labor cost` US 1,900 / KD 14 / CPC $6.43; secondary `how to estimate labor costs for construction` 1,000 / KD 5. Natural phrases: `burdened labor rate`, `labor burden calculator`, `true cost of an employee`, `labor cost percentage`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/18_Labor_Cost_Calculator/18_Labor_Cost_Calculator_BUILD_SPEC.md`. Target page `/labor-cost-calculator/`.
- Commercial Lease Calculator — primary `commercial lease calculator` US 390 / KD 17 / CPC $2.46; secondary `triple net lease calculator` 480 / KD 12, `cam expenses` 260 / KD 8, `rent increase calculator` 1,600 / KD 15. Natural phrases: `rentable vs usable square feet`, `gross vs nnn lease`, `net effective rent calculator`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/10_Commercial_Lease_Calculator/10_Commercial_Lease_Calculator_BUILD_SPEC.md`. Target page `/commercial-lease-calculator/`.
- Airbnb Profit Calculator — primary `airbnb profit calculator` US 880 / KD 19 / CPC $2.94; secondary `free airbnb calculator` 480 / KD 0, `vacation rental investment calculator` 320 / KD 5, `airbnb arbitrage calculator` 260 / KD 4, `vrbo calculator` 390 / KD 12. Natural phrases: `how much can i make on airbnb`, `break even occupancy airbnb`, `short term rental cash flow`, `str vs long term rental`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/14_Airbnb_Short_Term_Rental_Profit_Calculator/14_Airbnb_Calculator_BUILD_SPEC.md`. Target page `/airbnb-calculator/`.
- Freelance Rate Calculator — primary `freelance rate calculator` US 320 / KD 19; secondaries `why is seo expensive` 480 / KD 14, `how much do copywriters charge` 70 / KD 9, `how much is copywriting` 70 / KD 6, `seo consultant hourly rate` 590 / KD 20, `freelance cost calculator` 260 / KD 24. Natural phrases: `what to charge as a freelancer`, `freelance day rate formula`, `billable hours per year`, `freelance tax set aside`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/15_Freelance_Hourly_Rate_Calculator/15_Freelance_Rate_Calculator_BUILD_SPEC.md`. Target page `/freelance-rate-calculator/`.
- Contribution Margin Calculator — primary `contribution margin and contribution margin ratio` US 2,400 / KD 4; secondaries `contribution margin equation` 1,900 / KD 17, `contribution margin ratio formula` 1,900 / KD 22, `define contribution margin` 1,300 / KD 6. Natural phrases: `contribution margin calculator`, `calculate contribution margin`, `how to calculate contribution margin`, `break-even calculator`, `cvp analysis`, `margin of safety calculator`. Spec: `docs/keywords analysis/Batch 3 - Business tools/3. All Blogs Data/22_Contribution_Margin_Break_Even_Calculator/22_Contribution_Margin_Calculator_BUILD_SPEC.md`. Target page `/contribution-margin-calculator/`. Note: `TODO(owner)`: pull `break even calculator` Semrush volume/KD to consider dedicated tab/H2 expansion.

⚠ Batches 3–8 have no Semrush SERP export yet; their competitor lists come from web searches. `TODO(owner)`: pull Google top 10 per primary keyword (Phase KR-9).

---

## 2. Band Name Generator — Verified Keyword Targets

| Keyword | US Volume | KD % | Intent | Target Page |
|---|---|---|---|---|
| band name generator | 8,100 | 10% | Informational | `/band-name-generator/` |
| band name generator kpop | 880 | 16% | Commercial | `/band-name-generator/kpop/` |
| band names generator | 590 | 16% | Commercial | `/band-name-generator/` (plural variant) |
| kpop band name generator | 590 | 7% | Informational | `/band-name-generator/kpop/` |
| metal band name generator | 590 | 9% | Commercial | `/band-name-generator/metal/` |
| k pop band name generator | 480 | 10% | Commercial | `/band-name-generator/kpop/` |
| random band name generator | 480 | 23% | Commercial | `/band-name-generator/random/` |
| boy band name generator | 390 | 18% | Informational | `/band-name-generator/boy-band/` |
| heavy metal band name generator | 390 | 4% | Commercial | `/band-name-generator/heavy-metal/` |
| rock band name generator | 390 | 8% | Commercial | `/band-name-generator/rock/` |

### Unverified / pending owner input
- `punk band name generator`, `pop band name generator` — pages blocked until owner provides Semrush data.
- `ai band name generator` — the generator stays pure browser logic, no AI.
- India-related and word-based variants ("band name generator from words").
