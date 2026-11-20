# Card Processing Fee Calculator (Square / PayPal) — Competitor Analysis

> **Target page:** KKCTools `/processing-fee-calculator/` (Batch 3, Tier 2 #17)
> **Primary keyword:** `square reader fees` — US 2,400 · KD 12 · **CPC $4.40** (cluster 8 keywords, 16,470 US vol). `paypal fee calculator` (KD > 30) missing from the export — `TODO(owner)`.
> **SERP source:** ⚠ No Semrush SERP export for Batch 3. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10 for square reader fees, square fee calculator, paypal fee calculator.`
> **Pages visited:** 2026-11-14 — 5 read (Square official, Checkout Page, Novo, Chargeflow, Ecommerce-Platforms). NerdWallet PayPal fees: navigation only captured.
> **Brand & data rules:** Square, PayPal, Stripe are trademarks — use names descriptively only, no logos, no implied affiliation. **Fees change often** → every preset must show “as of <date>, source: provider's official pricing page” and stay editable. Keyword file already flags this tool as “fees that change” (Tier 2 caveat).

---

## 0. How this was collected (read first)

- Read: squareup.com official fee calculator, Checkout Page (PayPal), Novo (bank — Square), Chargeflow (chargeback SaaS — Square), Ecommerce-Platforms (Square).
- Competitor rate tables disagree (e.g., Square in-person fixed fee $0.10 vs $0.15; invoice rates three different ways on one page) — **never copy competitor rates; read the provider's official page on build day.**
- Meta and schema not readable. Word counts are estimates. Do not copy text or tables (AGENTS.md rule 8).

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | squareup.com/us/en/payments/fee-calculator | **Official** | Calculate your Square processing fees | 150–250 tool text |
| 2 | checkoutpage.com/tools/paypal-fee-calculator | Checkout SaaS | PayPal fee calculator | ~2,000 |
| 3 | chargeflow.io/calculators/square-fee-calculator | Chargeback SaaS | Square Fee Calculator | 1,200–1,400 |
| 4 | novo.co/blog/square-fee-calculator | Business bank | Square Fee Calculator | 850–900 |
| 5 | ecommerce-platforms.com/square-fee-calculator | Review/affiliate site | Square Fee Calculator | 700–800 |

**What this tells us:**
- **Merchants want 3 numbers:** fee on a sale, net received, and **“what to charge to receive X”** (gross-up). Checkout Page, Chargeflow and Ecommerce-Platforms offer the reverse mode.
- **Best pages are provider-specific** (Square-only or PayPal-only) with plans, payment types, international surcharges and ACH caps. **No page compares Square vs PayPal vs Stripe on the same sale with editable rates.**
- **Data freshness is the biggest weakness** — Novo (2023 rates, table broken), Ecommerce-Platforms (2023, conflicting invoice rates).

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Square official | Checkout Page | Chargeflow | Novo | Ecommerce-Platforms |
|---|---|---|---|---|---|
| Fee on a sale + net | ❌ (no visible output) | ✅ | ✅ | ⚠️ (tool not visible) | ✅ |
| Reverse: amount to charge for target net | ❌ | ✅ | ✅ | ❌ | ✅ |
| Payment type (in-person, online, keyed, invoice, ACH, API) | ✅ rates table | ✅ 7 PayPal types | ✅ 8 types | ⚠️ text | ❌ |
| Plan tier (Free / Plus / Premium) | ⚠️ unlabeled columns | — | ✅ | ⚠️ text | ❌ |
| International card / currency conversion | ❌ | ✅ +1.5% / +3% | ✅ +1.5% | ❌ | ❌ |
| ACH min / cap | ✅ | — | ✅ | ⚠️ | ❌ |
| Monthly volume → monthly/annual fees | ⚠️ inputs | ✅ | ✅ (+ plan cost) | ❌ | ❌ |
| Plan break-even volume | ❌ | ❌ | ✅ | ❌ | ❌ |
| Refunds / chargebacks | ❌ | ❌ | ✅ refund & loss share | ❌ | ❌ |
| Compare providers (Square vs PayPal vs Stripe) | ❌ | ⚠️ text table | ❌ | ❌ | ❌ |
| Surcharge / pass fee to customer | ❌ | ❌ | ❌ | ⚠️ text | ❌ |
| Custom rate (any processor) | ❌ | ❌ | ❌ | ❌ | ❌ |
| US + UK/EU | US | US + UK table (UK not modelled) | US | US | US |
| Rates dated | ❌ | ✅ Jun 2026 | ✅ Nov 2026 | ⚠️ Mar 2023 | ❌ (“2023”) |

---

## 3. Feature matrix — content and trust

| Item | Square official | Checkout Page | Chargeflow | Novo | Ecommerce-Platforms |
|---|---|---|---|---|---|
| Fee formula | ❌ | ✅ + gross-up formula | ✅ | ✅ | ❌ |
| Worked examples | ❌ | ✅ $100, $1,000, gross-up $1,031.33 | ✅ 4 | ✅ 1 | ❌ |
| Fee types table | ✅ | ✅ US + UK | ✅ | ❌ (embed broken) | ⚠️ (conflicting) |
| Hardware / subscription costs | ❌ | ❌ | ✅ plans | ✅ | ⚠️ |
| How to reduce fees | ❌ | ⚠️ FAQ | ✅ | ✅ | ❌ |
| Friends & family vs goods & services | — | ✅ | — | — | — |
| FAQ count | 0 visible | 8 | 7 | 0 | 0 |
| Named author | ❌ | ❌ | ❌ | ⚠️ brand | ❌ |
| Sources | official | ⚠️ | ✅ sources & method section | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### Square official fee calculator
- Inputs: monthly sales, average transaction, how customers pay (in-person / online / custom). Rates table by payment type across 3 unlabeled plan columns (tap/dip/swipe, online, online API, ACH invoice, ACH API). No visible output in capture; browser-update modal.
- **Lesson:** official source for our presets — but its own calculator gives little explanation. Cite it, don't scrape it (no network calls; owner updates presets by hand).

### Checkout Page — PayPal fee calculator — **best PayPal page**
- Sale amount (presets), US/UK, 7 fee types (goods & services, checkout, invoicing, QR, micropayments, charity, Venmo business), international (+1.5%) and currency conversion (+3%) toggles, monthly volume, **reverse “what to charge”**. Outputs: % fee, fixed fee, total, effective %, received, copy link.
- Content: how fees work, by type, US + UK tables, **PayPal vs Stripe vs Square**, worked examples ($100 → $96.52; $1,000 → $969.61; gross-up $1,000 → $1,031.33 — checked correct).
- **FAQs (8):** fee per $100 · avoid 3% fee · fee for $1,000 · does PayPal have a 3% fee · F&F vs G&S · who pays · invoice for a set amount · tax deductible?
- **Weak points:** UK not modelled in tool; no author.

### Chargeflow — Square fee calculator — **best Square page**
- Plan (Free/Plus/Premium) × locations, 8 payment methods (in-person, online, API, keyed/card-on-file, Afterpay, EBT SNAP, ACH invoice, ACH API), sale amount, non-US card, refund & loss share, reverse target net, monthly ledger.
- Content: rates table (“fact-checked Nov 4, 2026”), net from a sale, ACH min/caps, costs outside the headline rate, **plan break-even volumes**, sources & method.
- **FAQs (7):** fee on $100 · includes Plus/Premium? · online vs API · international cards · chargeback fee · refund fees returned? · does target include subscription?
- **Weak points:** widget not visible in capture; no author; heavy disclaimers.

### Novo — Square fee calculator (bank)
- Formula (amount × % + fixed); example $50 in-person = $1.40 (using $0.10 fixed); ACH 1% min $1; hardware prices; subscription plans; how to reduce fees (avoid keyed, surcharge, fee-free invoicing).
- **Weak points:** rates “as of March 1, 2023”; rate table embed broken; no FAQ.

### Ecommerce-Platforms — Square fee calculator (affiliate)
- Invoice amount → total fees, you receive, **you should ask for**. Text lists several Square rates but **contradicts itself** on invoice rates; “0.30 cents”; mentions Stripe/PayPal by copy-paste mistake; 2023 rates.

---

## 5. Patterns

- **Formulas:** fee = amount × p + f · net = amount − fee · gross-up (charge needed for target net) = (net + f) ÷ (1 − p) · international: + extra % · effective rate = fee ÷ amount · monthly = per-transaction fee × transactions (+ subscription) · surcharge to pass fee = fee ÷ amount (cap rules vary by network/state — cite).
- **Variable:** provider, plan, payment method, card origin, currency conversion, ACH caps, refunds/chargebacks.

| Section | Pages (of 5) |
|---|:---:|
| Reverse/gross-up | 3 |
| International | 2 |
| Monthly projection | 2 |
| Provider comparison | 1 (text) |
| Custom processor rates | **0** |
| Dated rates | 2 |
| FAQ | 2 |

---

## 6. FAQ question bank

★ = asked on 2+ pages. Map to the 8 keywords (square reader fees, square fees, paypal fees etc.).

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ What is the fee on a $100 sale? | Checkout Page, Chargeflow |
| 2 | ★ Are there extra fees for international cards / currency conversion? | Checkout Page, Chargeflow |
| 3 | ★ How do I calculate what to charge to receive a set amount? | Checkout Page, (Chargeflow/Ecommerce tools) |
| 4 | How much are Square reader (in-person) fees? | Square, Novo |
| 5 | Who pays the fee — buyer or seller? | Checkout Page |
| 6 | Friends & family vs goods & services (PayPal)? | Checkout Page |
| 7 | Online vs API vs keyed-in rates? | Chargeflow |
| 8 | Do I get fees back on refunds? / chargeback fees? | Chargeflow |
| 9 | Is a paid plan worth it? (break-even volume) | Chargeflow |
| 10 | Can I add a surcharge to cover card fees? | Novo (text) |
| 11 | Are processing fees tax deductible? | Checkout Page |
| 12 | How much is the fee on $1,000? | Checkout Page |

---

## 7. Gaps nobody fills — our opportunities

1. **Side-by-side comparison:** same sale (and monthly volume) across Square, PayPal, Stripe and a **custom processor** — each with dated, editable presets.
2. **All 3 answers at once:** fee, net received, amount to charge for a target net.
3. **Monthly cost & plan break-even** (subscription vs lower rate).
4. **International / currency toggles** per provider.
5. **Surcharge helper:** % needed to pass on fee, with a “check card-network and local rules” note (cited).
6. **Custom rate mode** for any processor (% + fixed + monthly) — useful outside US/UK.
7. **Currency** (USD, GBP, EUR, CAD, AUD).
8. **Freshness box:** “Presets last checked <date>” with official links — owner updates; `TODO(owner)` to schedule checks.

---

## 8. Blueprint for the KKCTools Processing Fee Calculator

### 8.1 SEO

- **URL:** `/processing-fee-calculator/`
- **Title/H1/Meta:** from Batch 3 keyword file; include “Square reader fees” (primary) in H1 or an H2, plus “PayPal fee calculator”.

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Inputs | sale amount or target net; transactions/month; provider preset (Square in-person/online/keyed/invoice; PayPal types; Stripe standard) or custom (% + fixed); international %; conversion %; monthly subscription |
| Outputs | fee, net, effective %, charge-to-receive, monthly & annual fees |
| Compare | table of all presets for the same inputs, cheapest highlighted |
| Extras | surcharge % to pass cost; plan break-even volume |
| Data | presets in one JSON file with `asOf` date + source URL (static, no network) |
| UX | currency, share URL, no network |

### 8.3 Content outline (≈ 1,400–1,800 words, original)

1. Intro (primary keyword)
2. How to use
3. How card processing fees are calculated (formula + engine examples)
4. Square fees by payment type (dated table, official link)
5. PayPal fees by transaction type (dated table, official link)
6. Charging enough to receive a set amount (gross-up)
7. International and currency conversion fees
8. Monthly plans vs pay-as-you-go
9. Surcharging and passing fees to customers (general, cite rules)
10. FAQ (10)
11. Related tools — Invoice Generator (#16), Markup (#2), Discount (#9), Percentage Change (#1)

### 8.4 Quality checks

- Unit tests for fee, net, gross-up, monthly, compare.
- Every preset traced to official pricing page with date; `TODO(owner)` review cadence logged in `docs/00-PROJECT-STATUS.md`.
- No competitor wording or rate tables copied; no brand logos. `npm run check:no-network` passes.
- `TODO(owner): pull Google top-10 SERPs; get the missing paypal fee calculator keyword data.`
