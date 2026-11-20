# Card Processing Fee Calculator — Build Spec

> **URL:** `/processing-fee-calculator/` · Batch 3 **Part 3** · **Part 3 build order 3**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + 2 + Part 3 §12–13; §10.4 brand rule)
> **Inputs used:** `17_Card_Processing_Fee_Calculator_Competitor_Analysis.md` (5 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2b, Semrush exports
> **Written:** 2026-11-20

---

## 0. Strategy note

**The keyword file removed `square reader fees`** because Square's own pages hold 4 slots and fees change often.

**Two things make a page here still worth building:**
1. **No page compares providers on the same sale with editable rates.** Every page is provider-specific, and several show stale 2023 rates.
2. **Merchants need three numbers at once:** fee, net received, and what to charge to receive a set amount.

**Freshness rule (critical):**
- Provider presets (Square, PayPal, Stripe) ship **only** if their current rates have been read on each provider's **official pricing page**.
- Each preset is stored with its URL and the date checked in `src/content/processing-fee-presets.ts`.
- If a rate can't be verified, that preset is **left out**. The tool still works in **Custom** mode (% + fixed + monthly).
- `TODO(owner)`: re-check presets every 3 months. Log this in `docs/00-PROJECT-STATUS.md`.

**Brand rule:** names are used descriptively only ("Square fees", "PayPal fees"). No logos, no "official", no affiliate links.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary (now)** | square credit card processing fees | 1,600 | 10 | H2 "Square credit card processing fees" (dated preset table) + FAQ |
| Secondary | square reader fees · fees for the square · square fee calculator · square cc fee · square fee per transaction | 2,400 · 4,400 · 1,000 · 590 · 480 | 12–26 | same H2 + Square preset in the tool |
| Secondary | square pos pricing | 2,400 | 9 | FAQ: plan vs per-transaction fees (link Square's pricing page; no plan prices unless verified) |
| Natural phrases | credit card processing fee calculator · paypal fee calculator · stripe fee calculator · how to calculate credit card fees | — | — | title, H1, H2s (`TODO(owner)`: pull volumes; not in the exports) |
| Skip | calculadora paypal (Spanish) · square feet cost (wrong intent: Square Footage page) | — | — | — |

## 2. Our edge

- **Side-by-side comparison:** the same sale and monthly volume across all verified presets + Custom. The cheapest is highlighted. 0 competitors.
- **All 3 answers at once:** fee, net received, **amount to charge to receive $X** (gross-up). 3 of 5 have the gross-up, none together with comparison.
- **Monthly cost & plan break-even:** a subscription plan with a lower rate vs pay-as-you-go → the volume where the plan pays off.
- **International / currency-conversion % toggles.**
- **Surcharge helper:** the % needed to pass on the fee, with a "card-network and local rules apply" note. **No legal claims** unless cited from an official source.
- **Custom mode for any processor in any country** (USD, GBP, EUR, CAD, AUD).
- **Freshness box:** "Presets last checked <date>" with official links.

## 3. Calculator spec

### 3.1 Tabs (`TabSlider`, `?tab=`)

1. **Fee on a sale** (default)
2. **Charge to receive** (gross-up)
3. **Compare providers**
4. **Monthly cost & plans**

### 3.2 Input guide diagram (above the inputs, rules §9)

`FeeInputGuide.tsx`: a card-payment flow.

```
Customer pays [1 Sale amount] → card icon → processor box: − [2 Percentage fee %] − [3 Fixed fee per transaction] (− [4 International / conversion %]) → You receive (net)
```

- **Gross-up tab:** the arrow reverses: "[1 Amount you want to receive]" → "the customer must pay X".
- **Monthly tab:** a stack of receipts "× [5 Transactions per month]" + "[6 Monthly plan fee]".

Live values; the focused field highlights.

### 3.3 Inputs

| Field | Default |
|---|---|
| Sale amount (or target net on the gross-up tab) | $100 |
| Provider preset (verified only) or **Custom**: % + fixed + monthly fee | Custom: 2.9% + $0.30 (label: "example rate, enter your processor's") |
| Payment type (preset-dependent, e.g. in-person / online / keyed / invoice) | — |
| International card % / currency conversion % | 0 / 0 |
| Transactions per month, average sale | 200, $100 |
| Plan comparison: plan monthly fee + plan rates vs standard rates | optional |

`src/content/processing-fee-presets.ts`: `[{ provider, type, pct, fixed, currency, sourceUrl, checked }]`. Empty until verified.

### 3.4 Engine (`src/lib/processing-fee-engine.ts`)

```ts
fee = amount * (pct + intlPct + fxPct) + fixed ; net = amount - fee ; effectivePct = fee / amount
grossUp(targetNet) = (targetNet + fixed) / (1 - pct - intlPct - fxPct)      // null if pct total >= 1
monthly = fee(avgSale) * txPerMonth + monthlyFee ; annual = monthly * 12
compare(presets, inputs) -> rows sorted by monthly cost
planBreakEven = volume where (stdPct - planPct)*volume + (stdFixed - planFixed)*tx = planMonthlyFee
surchargePct = fee / amount   (display only + rules note)
```

**Worked example (custom example rate):**
- 2.9% + $0.30 on a $100 sale → fee **$3.20**, net **$96.80**, effective 3.2%.
- To receive $100, charge **$103.30**.

### 3.5 Outputs

- **Headline:** fee + net.
- **Sentence:** "At 2.9% + $0.30, a $100 card sale costs $3.20 in fees, so you receive $96.80. To receive a full $100, charge $103.30."
- Compare table (provider, type, fee, net, monthly, annual), cheapest highlighted, each row showing "checked <date>".
- Monthly card; plan break-even.
- Freshness box with sources. Share URL, Print.

### 3.6 Tests

- Fee / net / gross-up round-trip (gross-up → fee → net = target).
- Pct ≥ 100% → `null`.
- International add-on; monthly; compare sort; break-even.
- The preset file schema: every preset has `sourceUrl` + `checked`.
- Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Card Processing Fee Calculator – Square, PayPal & More` (54, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free credit card processing fee calculator. See the fee and net on any sale, what to charge to receive a set amount, and compare Square, PayPal and Stripe.` (155) |
| H1 | `Credit Card Processing Fee Calculator: Fees, Net and Charge-to-Receive` |
| BLUF | "Card fee = sale × percentage rate + fixed fee. At 2.9% + $0.30, a $100 sale costs $3.20, so you get $96.80. To receive $100 after fees, charge (100 + 0.30) ÷ (1 − 0.029) = $103.30." (engine; example rate labelled) |
| ToolShell pills | `Fee, net & charge-to-receive`, `Compare providers`, `Monthly cost & plans`, `Any processor, any currency` |
| Links out | Markup, Invoice Generator (Part 2), Discount, Percentage Change, Profit Margin |
| Links in | Invoice Generator, Markup (fees section), Tools hub "Business maths" |

**Brand-name usage in title and meta:** if the owner prefers no brand names in the title, use `Card Processing Fee Calculator – Fees & Net Amount`.

## 5. Content (~1,500–1,800 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the processing fee calculator | 4 tabs | 120 |
| 2 | How credit card processing fees are calculated | Formula + engine example | 200 |
| 3 | Square credit card processing fees | **Dated preset table with an official link**, or "see Square's pricing page" if unverified | 200 |
| 4 | PayPal and Stripe fees | Same rule | 200 |
| 5 | How much to charge to receive a set amount | Gross-up example | 150 |
| 6 | International cards and currency conversion | General + presets | 120 |
| 7 | Monthly plans vs pay-as-you-go | Break-even example | 150 |
| 8 | Passing fees to customers (surcharges) | General; rules vary by network and location; cite only verified sources | 150 |
| 9 | FAQ | §6 | 380 |

## 6. FAQ (10)

1. How are credit card processing fees calculated?
2. What are Square's credit card processing fees? (`square credit card processing fees`: dated, linked, or "see Square")
3. How much does Square charge per transaction? (`square fee per transaction`)
4. What is the fee on a $100 sale? (engine)
5. How do I work out what to charge to receive a set amount?
6. Are there extra fees for international cards?
7. Is a monthly plan worth it? (break-even)
8. Can I add a surcharge to cover card fees? (general + "check the rules")
9. Do I get the fee back on a refund? (provider-specific: link)
10. What does Square POS pricing include? (`square pos pricing`: link, no unverified prices)

## 7. Done when

- [x] `processing-fee-engine.ts` + tests (10 tests passed); `npm run verify` passes (843 tests, 95 routes, 81 HTML pages with 0 SEO errors).
- [x] Presets file holds **only** rates read on official pricing pages, with URL + date; anything unverified omitted; owner re-check cadence logged.
- [x] Input guide diagram per tab above the inputs; ToolShell + TabSlider used.
- [x] No logos, no affiliate links; registrations + docs updated; `graphify update .`.
