# Unit Price Calculator — Build Spec

> **URL:** `/unit-price-calculator/` · Batch 3 · Tier 1 · **Build order 1** (weakest SERP)
> **Read first:** `../00_BATCH3_BUILD_RULES.md`
> **Inputs used:** `05_Unit_Price_Calculator_Competitor_Analysis.md` (5 pages read, 2026-11-14), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 (Semrush SERP 2026-11-16)
> **Written:** 2026-11-18

---

## 1. Keywords

| Role | Keyword | US vol | KD |
|---|---|---:|---:|
| **Primary** | unit price calculator | 1,900 | 14 |
| Secondary | price per unit calculator | 1,300 | **0** |
| Secondary | price per ounce calculator | 1,300 | 11 |
| Secondary | calculate price per oz | 590 | 11 |
| Secondary (seller H2) | cost per unit | 590 | 7 |

**SERP:** after Omni (84) and Inch Calculator (81), six slots are held by AS 9–22 sites (unitpricecalculator.com, unitpriceapp, calctrail, calckit, sparkcalc, bangyourbuck), plus a Play Store listing. It is one of the most open SERPs in Batch 3.

**Where the keywords go:**
- Title and H1: "unit price", "price per ounce", "pound", "unit".
- H2: "How to calculate price per unit", "Price per ounce", "Cost per unit (for sellers)".
- FAQ: question phrasing from §6.

## 2. What competitors miss (our edge)

- **Almost all compare only 2 items.** Real shelves have 3–6 sizes. Only WISEPIM does 4.
- **Multi-packs** (6 × 330 ml vs 2 L) are handled only by Omni.
- **Deals** (coupon, % off, BOGO, 3-for-2): 0 competitors.
- **Total savings** on the whole purchase: 0 competitors.
- **Choosing the output unit** (per oz / lb / 100 g / kg / fl oz / 100 ml / L / item / sheet / roll / load): only WISEPIM does it fully.
- **Shrinkflation check:** 0 competitors.
- **Seller label mode** (UK/EU unit price per kg/L/100 g): only WISEPIM, and Germany only.
- All FAQs on competitor pages are 3–6 short answers.

## 3. Calculator spec

### 3.1 Tabs

1. **Compare** (default)
2. **Shrinkflation check**
3. **Seller: cost per unit & shelf label**

### 3.2 Compare tab

**Rows:** 3 rows on load, filled with a working example. Use our own example, not a competitor's, e.g. three coffee bag sizes. User can add rows up to 6 and remove them.

Each row has:
- label (optional, e.g. "Brand A 12 oz");
- price;
- pack count (default 1);
- size per item;
- unit.

**Unit groups:**

| Group | Units |
|---|---|
| Weight | oz, lb, g, kg |
| Volume | fl oz (US), cup, pt, qt, gal (US), ml, L |
| Count | item, sheet, roll, load, sq ft (for paper towels/foil, optional) |

- Show a warning if rows use different groups. Weight vs volume can't be compared: "fl oz is volume, oz is weight; compare like with like."
- **Deal per row** (optional accordion): % off, $ off, "buy X get Y free", "X for $Y". The engine computes the effective price.
- **Output unit selector:** auto picks the most common unit among the rows, and the user can override it (per oz, per lb, per 100 g, per kg, per fl oz, per 100 ml, per L, per item…).
- **Quantity to buy** (optional): "I need 64 oz". The tool shows how many packs of each option cover it and what each would cost in total.

### 3.3 Engine (`unit-price-engine.ts`, pure)

```ts
// exact conversion constants (state them in HowWeCalculate)
OZ_G = 28.349523125 ; LB_G = 453.59237 ; FLOZ_ML = 29.5735295625 ; CUP_ML = 236.5882365
PT_ML = 473.176473 ; QT_ML = 946.352946 ; GAL_ML = 3785.411784

baseQty      = packCount * sizePerItem * toBase(unit)        // base = g | ml | item
effectivePrice = applyDeal(price, deal)                      // % off, $ off, BOGO (per-unit avg), X for $Y
unitPrice    = effectivePrice / baseQty * fromBase(outputUnit)
rank         = sort by unitPrice asc (ties share rank)
cheapest     = rank 1
pctMoreThanCheapest[i] = (unitPrice[i] - cheapest) / cheapest * 100     // uses percent-engine pctChange
savingPerUnit[i] = unitPrice[i] - cheapest
// Quantity-to-buy mode
packsNeeded[i] = ceil(needQty / baseQty[i]); totalCost[i] = packsNeeded[i] * effectivePrice[i]
```

**Shrinkflation tab:** old price + old size vs new price + new size.
- Outputs: unit price change % (percent-engine), and the "hidden price rise" = new unit price ÷ old unit price − 1.
- Plain sentence: "The pack is 10% smaller at the same price, which is an 11.1% price rise per ounce." Generate this from the engine. The 11.1% figure is correct maths (1/0.9 − 1).

**Seller tab:**
- Batch cost + units made gives cost per unit (keyword `cost per unit`).
- Add an optional link to the Markup Calculator, passing the cost in the URL query.
- **Shelf-label output:** price per kg / L (and per 100 g / 100 ml) for a given pack.
- Note on legal rules: **only cite official texts**: UK Price Marking Order 2004 (legislation.gov.uk) and EU Directive 98/6/EC (eur-lex.europa.eu). If you can't open them, keep the label maths and drop any legal claims.

### 3.4 Outputs (Compare)

- Ranked table: rank, label, effective price, total quantity, unit price, "+X% vs cheapest", saving per unit. Cheapest row gets a ✅ badge.
- Plain sentence: "Option B is the best deal at $0.31/oz, 18% cheaper than Option A."
- Horizontal bar visual of unit prices (CSS only, no chart library).
- Step-by-step for the cheapest row: price ÷ quantity = unit price, with the conversion shown.
- Copy table, Share URL, Print.

### 3.5 Tests

- Conversions round-trip (1 lb = 16 oz = 453.59237 g; 1 gal = 128 fl oz).
- 6 × 330 ml vs 2 L ranks correctly.
- Deals: 20% off; $1 off; buy 1 get 1 free halves the effective price per unit; "3 for $5".
- Weight vs volume rows give a warning, not a number.
- Price 0 or size 0 returns `null` with a message, no NaN or Infinity.
- Shrinkflation: 10% smaller at the same price gives 11.11%.
- Quantity-to-buy pack counts and totals are correct.
- Every page example and FAQ number equals the engine output (snapshot).

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Unit Price Calculator – Price per Ounce, Pound & Item` (53; use `absoluteTitle`, since the suffix would make it 65) |
| Meta | `Free unit price calculator. Compare two or more products by price per ounce, pound, litre or item and see which one is the better deal and by how much.` |
| H1 | `Unit Price Calculator: Compare Price per Ounce, Pound or Unit` |
| BLUF intro | "Unit price = price ÷ quantity. Enter each pack's price and size and the calculator converts the units, ranks every option and shows how much cheaper the best one is." Then one engine example. |
| Links out | Markup, Discount (when built), Percentage Change, Cooking Measurement Converter (when built) |
| Links in | Markup (seller tab), Percentage Change (shrinkflation), Tools hub |

## 5. Content (~1,300–1,600 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the unit price calculator | 4 steps | 120 |
| 2 | How to calculate price per unit | Formula + 3 engine examples: bottles, multi-pack vs big bottle, bulk by weight | 250 |
| 3 | Price per ounce, pound and 100 g | Conversion table (engine constants), oz vs fl oz trap | 200 |
| 4 | When the bigger pack isn't cheaper | Engine example where the bigger size loses | 150 |
| 5 | Coupons, sales and multi-buy deals | How BOGO and "3 for $5" change the unit price | 150 |
| 6 | How to read unit prices on shelf tags | US vs UK/EU shelf labels, in general terms; no store-specific claims | 150 |
| 7 | Shrinkflation: spotting a hidden price rise | Engine example | 150 |
| 8 | Cost per unit for sellers | Batch cost ÷ units → link to Markup; label per kg/L | 150 |
| 9 | FAQ | §6 | 350 |

## 6. FAQ (10)

1. How do you calculate unit price?
2. How do I calculate price per ounce? (`calculate price per oz`)
3. Is the bigger size always cheaper?
4. How do I compare a multi-pack with a single big bottle?
5. How do I compare products sold in grams and ounces?
6. Are fluid ounces and ounces the same thing?
7. How do coupons and BOGO deals change the unit price?
8. What is shrinkflation and how can I spot it?
9. How do I work out cost per unit for my products? (`cost per unit`)
10. Why do stores show a unit price on the shelf tag?

## 7. Done when

- [ ] `npm run verify` passes. Engine tests cover §3.5.
- [ ] Compare works with 2–6 rows, mixed units, deals and output unit choice.
- [ ] Legal statements only with linked official sources, otherwise removed.
- [ ] Mobile 390 px: each row stacks into a card; the results table scrolls inside its box.
- [ ] Routes, catalog (`business`), hub, internal links, docs updated.
