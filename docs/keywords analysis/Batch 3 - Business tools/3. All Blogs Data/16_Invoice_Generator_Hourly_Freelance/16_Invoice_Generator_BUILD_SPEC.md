# Invoice Generator (Hourly & Freelance) — Build Spec

> **URL:** `/invoice-generator/` · Batch 3 Part 2 · Tier 2 · **Build order 11**
> **Read first:** `../00_BATCH3_BUILD_RULES.md` (Part 1 + Part 2)
> **Inputs used:** `16_Invoice_Generator_Hourly_Freelance_Competitor_Analysis.md` (4 pages), `KKCTools_Batch3_Final_Tool_Keywords.md` §2 #15
> **Reference code (reuse patterns, don't copy-paste blindly):** `src/components/tool/construction-estimate/` (`calculations.ts`, `formatter.ts` CSV/TXT, `ActionBar.tsx` print, `SavedEstimates.tsx` + `src/lib/storage.ts` safe localStorage)
> **Written:** 2026-11-20

---

## 0. Strategy note

**SERP:**
- 2 strong relevant pages: eForms 62 and Vertex42 62.
- Partial matches (open slots): QuickBooks freelance 86, Adobe general 100, Harvest glossary 54, InvoiceQuick general.
- Small relevant sites: Portant 38, InvoiceMaker 29.

**Value:** ad competition is **0.9–1.0** and CPC $4–17: very high commercial value for AdSense.

**What searchers expect:** a fillable or printable **template**.
- Static downloads don't calculate.
- Online generators mostly need an account.

**Our angle:** free, no sign-up, **nothing leaves your browser**, live totals, print / save as PDF via the browser.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | hourly invoice template | 1,600 | 26 | H1 wording or first sentence ("free hourly invoice template and generator"), title-adjacent, H2 |
| Secondary | hourly invoice · hourly rate invoice template | 70 · 50 | 9–11 | H2 "How to make an hourly invoice" |
| Secondary | invoice for freelance · invoice sample freelance · freelance writer invoice template · freelance journalist invoice · freelance translation invoice template | 70 · 170 · 390 · 50 · 40 | 4–28 | template presets (Freelance, Writer, Translator) + H2 "Freelance invoice templates" |
| Secondary | independent contractor invoice form | 50 | 12 | Contractor preset + FAQ |
| Secondary | contractor timesheet (template) · contractor time sheet · freelance timesheet | 90 · 70 · 70 · 50 | 9–14 | Timesheet tab (entries roll into invoice lines) + H2 |
| FAQ only | time tracking for freelancer · time tracking and invoicing for freelancers · freelancer tracking | 140 · 590 · 40 | 11–20 | software intent: FAQ says this is a free generator, not a time-tracking app |
| Natural phrase | free invoice generator | — | — | title |

## 2. Our edge (0 of 4 competitors do these)

- **Free in-browser fill + print/save PDF**, no account.
- **Privacy-first:** "My business details" can be saved on this device only (localStorage via `src/lib/storage.ts`, try/catch). A clear-data button. A visible "stored only in this browser" note.
- **Timesheet entries:** date, task, start–end **or** h:mm → decimal hours → amount. Rounding increment (none / 6 / 15 / 30 min, round up or nearest).
- **Line types:** hours, fixed fee, expense. Multiple rates. Discount (% or $). Tax (single rate, label: Sales tax / VAT / GST). Shipping/other. Deposit paid. **Balance due.**
- **Due date from terms** (Due on receipt / Net 7 / 14 / 30 / 60 / custom). Invoice number pattern (e.g. `INV-2026-001`, auto-increment kept locally).
- **Currency + locale formats** (USD, GBP, EUR, CAD, AUD, INR) and a VAT/GST label switch.
- **2–3 original layouts** (Classic, Minimal, Compact). Not copies of competitor designs.

## 3. Tool spec

### 3.1 Tabs (`TabSlider`, `?tab=` for the tab only; **never put client data in the URL**)

1. **Invoice** (default): the editable invoice with live preview
2. **Timesheet**: time entries → "Add to invoice"
3. **My details**: saved business profile (local only)

**Share URL is disabled for this tool** (client data must not be put in links). Instead: Print / Save as PDF, Copy as text, Download CSV.

### 3.2 Input guide diagram (above the inputs, rules §9)

`InvoiceInputGuide.tsx`: a miniature invoice page (paper outline) with numbered zones.

- **1 Your business** (top-left) · **2 Bill to** (top-right) · **3 Invoice # / dates / terms** (right column)
- **4 Line items** table: date | description | hours | rate | amount (one sample row)
- **5 Discount** · **6 Tax** · **7 Paid** → **Balance due** (bottom-right, bold)
- **8 Payment instructions & notes** (footer)

Focusing a field highlights its zone on the mini page. The guide doubles as a "what goes on an invoice" checklist.

**Timesheet tab:** a small clock + list: "start → end = hours", with the rounding badge.

### 3.3 Fields

| Zone | Fields |
|---|---|
| 1 From | business name, your name, address, email, phone, tax ID (label adapts: EIN / VAT no. / ABN / GST no.), logo (file input → object URL, **never uploaded**) |
| 2 Bill to | client name, company, address, email |
| 3 Meta | invoice number (pattern + next number), issue date, terms → due date (auto), PO / reference |
| 4 Lines | type (Hours / Fixed / Expense), date, description, hours (decimal or h:mm) or qty, rate/price, amount (computed); reorder ↑↓, duplicate, delete |
| 5–7 Totals | discount % or $, tax rate % + label + "tax on discounted subtotal" (default on), shipping/other, amount paid/deposit → balance due |
| 8 Footer | payment instructions, notes, late-fee wording (free text; no legal advice) |
| Settings | currency, date format, layout, rounding increment + mode |

**Template presets** (fill the description placeholders and notes only): Freelance (general), Writer, Translator, Contractor.

### 3.4 Engine (`src/lib/invoice-engine.ts`)

Mirror the tested patterns in `construction-estimate/calculations.ts`. Cents-safe rounding.

```ts
parseDuration("2:30") = 2.5 ; parseDuration("2.5") = 2.5 ; parseDuration("2h 30m") = 2.5   // null on garbage
roundHours(h, incrementMin, mode: 'none'|'up'|'nearest')
lineAmount = hours*rate | qty*price | expense
subtotal = Σ lines ; discount = pct ? subtotal*pct : fixed (≤ subtotal)
taxBase = taxOnDiscounted ? subtotal - discount : subtotal ; tax = taxBase * rate
total = subtotal - discount + tax + shipping ; balanceDue = total - paid
dueDate(issue, terms) ; nextInvoiceNumber(pattern, last)
toCSV(invoice), toText(invoice)
```

**Example:** entries 2:30, 1:45, 3:10 with "15 min, round up" → 2.5 + 1.75 + 3.25 = 7.5 h × $75 = **$562.50**.

### 3.5 Output

- **Live preview** (right column on desktop, below on mobile) in the chosen layout.
- **Print / Save as PDF:** `window.print()` with a print stylesheet that shows **only the invoice** (hides the site chrome, ToolShell, ads and guide), A4/Letter, page-break safe line rows.
- Copy as text, Download CSV (Blob + object URL; no network).
- "Saved on this device" toast; "Clear my saved data" button.

### 3.6 Tests

- `parseDuration` formats + invalid input.
- Rounding modes.
- Discount % and $ (capped at the subtotal).
- Tax on discounted vs full subtotal.
- Paid > total → negative balance labelled "credit".
- Due-date terms incl. month ends.
- Invoice-number increment.
- CSV escaping (commas, quotes, newlines).
- `check:no-network` passes; the logo never leaves the browser (object URL only).

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Free Invoice Generator – Hourly & Freelance Invoices` (52, over 60 with the suffix → `absoluteTitle`) |
| Meta | `Free invoice generator. Add hours, rates, items, tax and discounts, then print or save a clean PDF invoice. Nothing you type ever leaves your browser.` (150) |
| H1 | `Invoice Generator: Make an Hourly or Freelance Invoice` |
| First sentence | "This free hourly invoice template turns your hours and rates into a finished invoice you can print or save as a PDF, and nothing you type leaves your browser." |
| Schema | WebApplication + FAQPage + BreadcrumbList (as live pages; `applicationCategory: 'BusinessApplication'`) |
| ToolShell pills | `Hours & h:mm entry`, `Print or save as PDF`, `Saved only on this device`, `Tax, discount & deposit` |
| Links out | Freelance Rate, Hourly to Salary (live), Construction Estimate Template (live), Self-Employment Tax (when built) |
| Links in | Freelance Rate, Construction Estimate Template (add "need an invoice?"), Tools hub |

## 5. Content (~1,400–1,700 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | Free hourly invoice template and generator | What it does, privacy note (primary) | 120 |
| 2 | How to make an hourly invoice | Steps (`hourly invoice`) | 180 |
| 3 | What to include on an invoice | Checklist (matches the guide diagram) | 180 |
| 4 | Listing hours worked: daily entries vs a summary | Decimal hours, rounding | 160 |
| 5 | Using a timesheet for contractor billing | Timesheet tab (`contractor timesheet`) | 150 |
| 6 | Freelance invoice templates (writer, translator, contractor) | Presets explained | 150 |
| 7 | Payment terms and late fees | General: Net 30 etc. No legal advice | 140 |
| 8 | Sales tax, VAT and GST on invoices | General + links to official guidance (IRS / HMRC VAT invoices / ATO tax invoices / CRA): **the builder reads each linked page and cites only what it says** | 180 |
| 9 | Invoice numbering tips | Patterns, sequence | 90 |
| 10 | FAQ | §6 | 380 |

## 6. FAQ (11)

1. What should an hourly invoice include?
2. How do I list hours worked on an invoice?
3. How do I convert minutes to decimal hours? (15 min = 0.25 h, from the engine)
4. Is this invoice generator really free? Do I need an account? (free; no)
5. Is my data stored anywhere? (only in this browser, if you choose to save)
6. How do I save the invoice as a PDF? (Print → Save as PDF)
7. What payment terms should I use?
8. Do I need to add sales tax, VAT or GST? (depends on where you and the client are; links)
9. What invoice number format should I use?
10. Can I use it as an independent contractor invoice form?
11. Is this a time-tracking app? (no: a free generator with a timesheet helper)

## 7. Done when

- [x] `invoice-engine.ts` + tests (§3.6); `npm run verify` passes; `check:no-network` passes.
- [x] Input guide (mini invoice) above the form; live preview; print shows only the invoice.
- [x] No client data in URLs; local save is opt-in and clearable.
- [x] Original layouts; tax wording cites only what the linked official pages say.
- [x] Registrations + docs updated; `graphify update .`.
