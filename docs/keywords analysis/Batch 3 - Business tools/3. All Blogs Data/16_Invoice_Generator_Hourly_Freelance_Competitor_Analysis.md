# Invoice Generator (Hourly & Freelance) — Competitor Analysis

> **Target page:** KKCTools `/invoice-generator/` (Batch 3, Tier 2 #16)
> **Primary keyword:** `hourly invoice template` — US 1,600 · KD 26 · **CPC $4.28** · ad comp 0.95 (cluster 16 keywords, 3,540 US vol)
> **SERP source:** ⚠ No Semrush SERP export for Batch 3. Competitors from live web search (2026-11-14). `TODO(owner): pull Google top 10.`
> **Pages visited:** 2026-11-14 — 4 read (InvoiceOwl, QuickBooks CA, Invoice2go, InvoiceFly). Blocked: InvoiceSimple 403, InvoiceQuick 403, Fiverr Workspace (ex-AND.CO) 403.
> **Privacy rule for our build:** an invoice holds names, addresses, tax IDs, bank details → **must stay 100% in the browser** (no upload, no server, no analytics) — matches AGENTS.md rule 4. Say so on the page.

---

## 0. How this was collected (read first)

- Read: InvoiceOwl hourly templates, QuickBooks Canada hourly template, Invoice2go hourly template, InvoiceFly freelance template.
- Skipped: a template hosted on a `certtest.bart.gov` test subdomain that appeared in search (suspicious host — not analysed).
- **Every competitor is invoicing software using free templates as a funnel** (high CPC, ad comp 0.95). Most offer static Word/Excel/PDF downloads; the “free generator” usually needs sign-up or an app.
- Meta and schema not readable. Word counts are estimates. Do not copy template layouts or text (AGENTS.md rule 8) — design our own invoice layout.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Offer | Body words (est.) |
|---:|---|---|---|---|---:|
| 1 | invoiceowl.com/invoice-template/hourly/ | Invoicing SaaS | Hourly Invoice Template | 5 static templates (Word/Excel/PDF), online = sign-up | ~1,500 |
| 2 | quickbooks.intuit.com/ca/resources/invoice-templates/time/ | Accounting giant | Free Hourly Invoice Template | Word/Excel/PDF downloads | 700–800 |
| 3 | invoice.2go.com/invoice-template/hourly/ (redirect from invoice2go.com) | Invoicing app | Hourly invoice template | Word/Excel/PDF + generator link | ~800 |
| 4 | invoicefly.com/…/freelance-invoice-template/ | Invoicing app | Free Freelance Invoice Template | ~33 designs, 5 formats, premium gated | 1,500–1,800 |
| — | invoicesimple.com, invoicequick.com, fiverr.com (AND.CO) | Invoicing SaaS | (403) | online generators | — |

**What this tells us:**
- **Users want a fillable hourly invoice** — line items with **date, description, hours, rate, amount**, subtotal, tax, total — and a **PDF**.
- **Static downloads don't calculate** (or calculate only in Excel); online generators mostly need accounts.
- **A free, no-sign-up, private, in-browser hourly invoice generator with print-to-PDF** is a clear gap.

---

## 2. Feature matrix — generator/template

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | InvoiceOwl | QuickBooks CA | Invoice2go | InvoiceFly |
|---|---|---|---|---|
| Fill online in browser | ⚠️ (sign-up) | ❌ | ⚠️ separate generator (sign-up unclear) | ⚠️ separate generator / app |
| No sign-up download | ✅ | ✅ | ✅ | ⚠️ unclear / premium |
| Formats | Word, Excel, PDF (contractor no PDF) | Word, Excel, PDF | Word, Excel, PDF | PDF, Word, Excel, Docs, Sheets |
| Hours × rate line items | ✅ | ✅ | ✅ | ✅ |
| Per-line date / time worked | ⚠️ FAQ | ❌ | ✅ example | ⚠️ |
| Time entries in h:mm → decimal | ❌ | ❌ | ❌ | ❌ |
| Different rates per task | ⚠️ | ✅ per-task | ✅ | ✅ |
| Expenses / materials lines | ⚠️ | ❌ | ❌ | ✅ copy |
| Tax line (sales tax/GST/HST/VAT) | ✅ simple | ⚠️ text | ✅ | ✅ |
| Discount | ⚠️ text | ❌ | ❌ | ❌ |
| Late fee / payment terms | ⚠️ text | ✅ terms | ✅ | ✅ |
| Logo | ✅ | ❌ | ✅ (generator) | ✅ |
| Currency | ❌ $ | CAD | ❌ | ⚠️ AU template |
| Auto invoice number / due date from terms | ❌ | ❌ | ❌ | ❌ |
| Payment details (bank, link) | ⚠️ | ✅ methods | ⚠️ | ✅ |
| Save/reuse client & rates locally | ❌ | ❌ | ❌ | ❌ |
| Print / PDF from browser | ❌ | ❌ | ❌ | ❌ |
| Privacy statement (data stays local) | ❌ | ❌ | ❌ | ❌ |

---

## 3. Feature matrix — content and trust

| Item | InvoiceOwl | QuickBooks CA | Invoice2go | InvoiceFly |
|---|---|---|---|---|
| What an hourly invoice contains | ✅ 10 elements | ✅ common + custom features | ✅ | ✅ |
| How to send an invoice | ✅ 5 steps | ✅ | ⚠️ | ✅ 4 steps |
| Who should use it | ✅ | ✅ occupations | ❌ | ⚠️ 22 industries |
| Worked example (filled invoice) | ❌ | ❌ | ⚠️ window cleaner hours | ❌ |
| Tax guidance | ⚠️ vague US | ⚠️ GST/HST mention | ⚠️ | ⚠️ “depends on location” |
| Hourly vs flat-fee | ❌ | ⚠️ pivots | ❌ | ⚠️ |
| FAQ count | 3 | 0 | 3 | 8 |
| Named author | ❌ | ❌ | ❌ | ❌ |
| Date | ❌ | ⚠️ metadata 2023/2026 | ❌ (© 2023) | ❌ |

---

## 4. Competitor-by-competitor detail

### InvoiceOwl — hourly invoice templates
- 5 templates (hourly rate, freelancer, labor, contractor, consulting) as Word/Excel/PDF/ZIP; “no sign-up” downloads; online creation requires registration; comparison table shows free templates lack every feature.
- Content: elements of an hourly invoice (title, business, customer, number, dates, line items, subtotal, tax, total, notes), what charges to include, how to send. **FAQs (3).**
- **Weak points:** title “Bill Format” vs H1; no filled example; vague tax/“FLSA compliance” claims; keyword stuffing.

### QuickBooks Canada — free hourly invoice template
- Word/Excel/PDF. Fields: company, contact, invoice #, client, service type, hourly rate, hours, per-task total, subtotal, payment methods, terms. Mentions GST/HST.
- Content: who should use it, what charges, how to send. No FAQ. “90% off” upsell banner; typos.

### Invoice2go — hourly invoice template
- Word/Excel/PDF downloads (hosted on a Kinsta CMS subdomain; PDF file named “-Word”); generator link with steps (logo, business, client, hours & rate, tax, notes).
- **Lesson:** good **daily breakdown example** (Mon 7 h ground floor, Tue 4 h first floor). **FAQs (3):** what is an hourly invoice · how to list hours worked · how to make one.

### InvoiceFly — freelance invoice template
- ~33 designs filterable by colour, style, format, 22 industries; PDF/Word/Excel/Docs/Sheets; premium gated; app push.
- Content: how to create (4 steps), which format, when to send, best practices. **FAQs (8):** invoice types · is it free · how to invoice · freelance writer · what to include · best practices · best software · journalism.

---

## 5. Patterns

- **Standard fields:** seller (name, address, email, phone, tax/VAT/GST number, logo) · client · invoice number · issue date · due date / terms (Net 7/14/30) · line items (date, description, hours or qty, rate, amount) · subtotal · discount · tax (rate, amount) · total · amount paid / balance due · payment instructions · notes / late-fee terms.
- **Hourly specifics:** time entries per day/task; minutes → decimal hours (link Time to Decimal, Batch 8); multiple rates; rounding increment (e.g., 15 min).
- **Jurisdiction notes:** UK/EU VAT invoices need specific fields (VAT number, VAT rate per line, totals ex/inc VAT); AU tax invoice wording with ABN; CA GST/HST numbers — **cite official guidance** (HMRC, ATO, CRA) or keep generic.

| Section | Pages (of 4) |
|---|:---:|
| Free in-browser fill + PDF | **0** |
| Line-item date/time | 1 |
| Discount field | **0** |
| Multi-currency | **0** |
| Local saving of profile | **0** |
| FAQ | 3 |

---

## 6. FAQ question bank

★ = asked on 2+ pages. Map to the 16 keywords (hourly invoice template, freelance invoice template, invoice for hours worked, etc.).

| # | Question | Seen on |
|---:|---|---|
| 1 | ★ What should an hourly invoice include? | InvoiceOwl, InvoiceFly |
| 2 | ★ How do I list hours worked on an invoice? | Invoice2go, InvoiceOwl (FAQ text) |
| 3 | ★ How do I make / send an hourly invoice? | Invoice2go, InvoiceFly, QuickBooks |
| 4 | Is the template free? | InvoiceFly |
| 5 | What is an hourly invoice? | Invoice2go |
| 6 | What are the different types of invoices? | InvoiceFly |
| 7 | How do I invoice as a freelance writer/designer? | InvoiceFly |
| 8 | What are invoicing best practices / payment terms? | InvoiceFly |
| 9 | Do I need to add sales tax / VAT / GST? | — (vague everywhere) |
| 10 | How do I convert minutes to decimal hours for billing? | — |
| 11 | Is my data private / stored anywhere? | — (nobody says) |
| 12 | What invoice number format should I use? | — |

---

## 7. Gaps nobody fills — our opportunities

1. **Free, no-sign-up, in-browser invoice builder** with live totals and **Print / Save as PDF** (browser print).
2. **Privacy-first:** nothing uploaded; optional save of “my business details” in localStorage only (wrapped in try/catch), clear “stored only on this device” note.
3. **Hourly time entries:** date, task, start/end or duration (h:mm) → decimal hours → amount; rounding to 6/15/30 minutes.
4. **Multiple rates, expenses, fixed-fee lines, discount, tax (single or per line), deposit/paid, balance due.**
5. **Auto due date from terms; invoice number pattern** (INV-2026-001).
6. **Currency + locale formats** (USD, GBP, EUR, CAD, AUD, INR) and VAT/GST labels.
7. **Original, clean templates** (2–3 layouts) — not copies of competitors.
8. **Content that answers real questions** (VAT invoice requirements, payment terms, late fees) with official citations.

---

## 8. Blueprint for the KKCTools Invoice Generator

### 8.1 SEO

- **URL:** `/invoice-generator/`
- **Title/H1/Meta:** from Batch 3 keyword file; include “hourly invoice template” in H1 or first sentence (“Free hourly invoice template and generator”).

### 8.2 Tool spec

| Area | Spec |
|---|---|
| Parties | from (business, address, email, phone, tax ID, logo upload → local only), bill to |
| Meta | invoice #, issue date, terms → due date, PO/reference |
| Lines | type (hours / fixed / expense); date, description, duration or hours, rate, amount; reorder, duplicate |
| Time | h:mm entry, rounding increment |
| Totals | subtotal, discount (% or $), tax (rate, label: Sales tax / VAT / GST), shipping/other, paid, balance due |
| Footer | payment instructions, notes, late-fee text |
| Output | live preview, print/save PDF, copy as text/CSV |
| Storage | optional local save of profile & last client (localStorage, try/catch), clear-data button |
| Locale | currency & number format, date format |
| UX | no network, no sign-up, mobile friendly |

### 8.3 Content outline (≈ 1,200–1,600 words, original)

1. Intro (primary keyword) + privacy note
2. How to create an hourly invoice (steps)
3. What to include on an invoice (checklist)
4. Listing hours worked (daily vs summary; decimal hours)
5. Payment terms and late fees (general)
6. Sales tax, VAT and GST on invoices (cite HMRC/ATO/CRA/IRS pages; no legal advice)
7. Invoice numbering tips
8. FAQ (10)
9. Related tools — Freelance Rate (#15), Time to Decimal Hours (Batch 8), Card Processing Fee (#17), Time Duration (Batch 8)

### 8.4 Quality checks

- Unit tests for totals, rounding, discount/tax order, due-date calc.
- Verify zero network calls (`npm run check:no-network`) and that logo/images never leave the browser.
- Original layout only; no competitor templates copied.
- `TODO(owner): pull Google top-10 SERP; check InvoiceSimple, InvoiceQuick, Fiverr Workspace by hand.`
