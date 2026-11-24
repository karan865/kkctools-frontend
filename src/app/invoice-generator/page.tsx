import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import InvoiceGenerator from '@/components/tool/invoice-generator';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

export const dynamic = 'force-static';

const route = ROUTES.invoiceGenerator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'What should an hourly invoice include?',
    a: 'A professional hourly invoice must include eight essential components: (1) your business name, contact information, and tax ID (EIN or SSN); (2) the client or company name and billing address; (3) a unique sequential invoice number and issue date; (4) payment terms and explicit payment due date (e.g. Net 30); (5) itemized line items detailing the date worked, specific task description, billable hours (in decimal format), hourly rate, and line total; (6) a financial summary showing subtotal, any discounts, applicable sales tax or VAT, and shipping or pass-through fees; (7) previous deposits paid and the final net balance due; and (8) clear payment instructions specifying accepted payment methods (ACH wire, credit card, PayPal) and remittance details.',
  },
  {
    q: 'How do I list hours worked on an invoice?',
    a: 'Hours worked can be billed either as daily entries or as milestone task summaries. For daily billing, list each working date, a clear sentence summarizing deliverables completed, the exact hours, and your hourly billing rate. For project milestones, group related hours together under a single descriptive heading (e.g. "Front-End Interface Development: 24.5 hours @ $85.00/hr = $2,082.50"). Always convert time from hours and minutes into decimal hours (e.g. 2 hours 15 minutes = 2.25 hours) before multiplying by your rate so clients can easily verify the math.',
  },
  {
    q: 'How do I convert minutes to decimal hours for billing?',
    a: 'To convert minutes to decimal hours, divide the number of minutes by 60. For example: 6 minutes equals 0.10 hours (common in legal tenth-of-an-hour billing); 15 minutes equals 0.25 hours; 30 minutes equals 0.50 hours; and 45 minutes equals 0.75 hours. An entry of 2 hours and 45 minutes is billed as 2.75 hours. Our built-in timesheet helper handles this decimal conversion and professional rounding automatically.',
  },
  {
    q: 'Is this invoice generator really free? Do I need an account?',
    a: 'Yes, this invoice generator is 100% free with no hidden paywalls, subscription fees, or account creation requirements. You can create unlimited hourly, freelance, and contractor invoices, print them directly, or save them as clean PDF documents through your browser without registering or providing an email address.',
  },
  {
    q: 'Is my financial and client data stored anywhere?',
    a: 'No. We follow a strict privacy-first architecture: zero financial figures, client names, line items, or uploaded logos are ever transmitted to our servers or stored in an external database. All computations run client-side inside your browser. If you choose to save your business profile, it is persisted solely in your device&apos;s personal localStorage and can be permanently cleared at any time with one click.',
  },
  {
    q: 'How do I save the generated invoice as a PDF?',
    a: 'Click the "Print / Save as PDF" button at the top of the generator (or press Ctrl+P / Cmd+P). In your browser&apos;s print dialog, select "Save as PDF" as the Destination printer rather than a physical printer. Our dedicated print stylesheet automatically hides the website navigation, editor controls, and guides, rendering only the clean, professional invoice page formatted perfectly for standard Letter or A4 paper.',
  },
  {
    q: 'What payment terms should I use for freelance and contractor invoices?',
    a: 'Common commercial payment terms include: "Due on Receipt" (immediate payment upon delivery, standard for initial client work or rush jobs); "Net 7" or "Net 14" (payment due within 7 or 14 calendar days, popular among independent consultants and freelancers); and "Net 30" (payment due within 30 days, the standard baseline for corporate and enterprise accounts). Always state the exact calendar due date prominently on the invoice to eliminate ambiguity.',
  },
  {
    q: 'Do I need to add sales tax, VAT, or GST to my invoice?',
    a: 'Tax requirements depend on your legal jurisdiction and business registration. In the United States, pure professional services (such as freelance writing or software consulting) are generally exempt from state sales tax in most states, although exceptions exist (e.g. Hawaii, New Mexico, South Dakota). In the United Kingdom and European Union, VAT-registered businesses must charge standard VAT and display their VAT registration number. In Australia and Canada, businesses exceeding registration thresholds must include GST/HST. Always consult local tax authorities (IRS, HMRC, ATO, or CRA) to determine your registration status.',
  },
  {
    q: 'What invoice numbering format should I use?',
    a: 'Use a consistent, sequential, and professional numbering pattern. Avoid starting at #001, which signals to clients that you are a brand-new business. Popular formats include year-prefixed sequences (e.g. INV-2026-001, INV-2026-002) or client-specific codes (e.g. ACME-01, ACME-02). Maintaining a sequential numbering scheme also simplifies bookkeeping and year-end tax audits.',
  },
  {
    q: 'Can I use this as an independent contractor invoice form?',
    a: 'Yes. This tool is designed to serve as a complete independent contractor invoice template. Contractors can select the "Independent Contractor" preset to generate structured invoices containing project dates, hourly rates, milestone descriptions, reimbursable materials/expenses, and formal master service agreement (MSA) references.',
  },
  {
    q: 'Is this invoice generator a full time-tracking software?',
    a: 'No. This is a lightweight, free invoice generator with an integrated timesheet helper. It is designed for freelancers, consultants, and trade contractors who track their hours in notes, spreadsheets, or timers and need an immediate, zero-friction tool to convert logged hours into a clean, printable PDF invoice without paying for monthly SaaS subscriptions.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Invoice Generator',
  applicationCategory: 'BusinessApplication',
  path: route.path,
  description: route.description,
});

const faqSchema = buildFaqSchema(faqs);

export default function InvoiceGeneratorPage() {
  const breadcrumbItems = [
    { name: 'Calculators', path: ROUTES.tools.path },
    { name: 'Invoice Generator', path: route.path },
  ];

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={faqSchema} />

      <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
        <Breadcrumbs items={breadcrumbItems} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Invoice Generator: Make an Hourly or Freelance Invoice</h1>
          <p className={styles.lead}>
            Create, calculate, and print professional hourly, freelance, and contractor invoices in seconds.
            Enter hours, rates, discounts, and taxes—all rendered client-side with 100% privacy and zero account sign-up.
          </p>
          <div className={styles.meta}>
            <span>Client-side execution</span>
            <span>·</span>
            <span>Zero cloud uploads</span>
            <span>·</span>
            <span>Print &amp; PDF ready</span>
            <span>·</span>
            <span>Updated November 2026</span>
          </div>
        </header>

        <div className={styles.blufBox}>
          <strong>Bottom Line Up Front:</strong> This free hourly invoice template turns your hours and rates into a finished invoice you can print or save as a PDF, and nothing you type leaves your browser.
          For instance, logging three tasks of <strong>2:30</strong>, <strong>1:45</strong>, and <strong>3:10</strong> with standard 15-minute round-up converts to <strong>2.50h</strong>, <strong>1.75h</strong>, and <strong>3.25h</strong> (7.50 total billable hours), producing an exact <strong>$562.50 balance due</strong> at $75.00/hour.
        </div>

        <section className={styles.toolSection}>
          <InvoiceGenerator />
        </section>

        <AdSlot slotId="after-tool" />

        <article className={styles.article}>
          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Free Hourly Invoice Template and Generator</h2>
            <p className={styles.p}>
              Independent professionals, freelancers, and specialty trade contractors face a frustrating dilemma when billing clients:
              downloading static spreadsheet templates (Excel, Word, or Google Docs) forces you to manually calculate tax, totals, and layout formatting,
              while cloud invoicing software platforms demand monthly recurring subscriptions, mandatory account sign-ups, and store your sensitive client records on third-party servers.
            </p>
            <p className={styles.p}>
              Our free hourly invoice generator bridges that gap. It provides the fluid speed and precision of an automated financial engine with the absolute privacy of an offline template.
              Every line item calculation, duration conversion, and tax adjustment executes directly inside your web browser. No financial records, personal tax identification numbers, or uploaded logos are ever transmitted across the internet.
            </p>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>How to Make an Hourly Invoice in 5 Simple Steps</h2>
            <p className={styles.p}>
              Creating a polished, compliant hourly invoice takes under two minutes following this structured workflow:
            </p>
            <ol className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Enter Your Business Credentials:</strong> Add your trading name, legal address, direct contact email, and official business identifier (such as an Employer Identification Number in the US, VAT registration in Europe, or Australian Business Number).
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Add Client Details:</strong> Specify the company name, primary accounts payable contact, and physical or billing email address.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Set Terms and Issue Dates:</strong> Select your invoicing date and standard payment terms (e.g. Net 14 or Net 30). The engine automatically calculates and displays the exact calendar due date.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Log Billable Line Items:</strong> Add individual entries for hours worked, fixed deliverables, or reimbursable project expenses. You can type durations directly in either clock time (<code>2:45</code>) or decimal notation (<code>2.75</code>).
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Print or Save as PDF:</strong> Review the live sheet preview, apply any customer discounts or tax rates, and click &ldquo;Print / Save as PDF&rdquo; to deliver a pristine billing statement to your client.
              </li>
            </ol>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>What to Include on a Professional Hourly Invoice</h2>
            <p className={styles.p}>
              Omitting key administrative data is the number one cause of commercial payment delays. Accounting departments require specific audit documentation before issuing remittances:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Invoice Element</th>
                    <th>Required Information</th>
                    <th>Commercial Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Seller Header</strong></td>
                    <td>Legal name, business address, email, phone, Tax ID / EIN</td>
                    <td>Identifies tax liability and payee identity for Form 1099 reporting</td>
                  </tr>
                  <tr>
                    <td><strong>Client Details</strong></td>
                    <td>Company name, accounts payable contact, billing address</td>
                    <td>Ensures invoice reaches the authorized payment approval authority</td>
                  </tr>
                  <tr>
                    <td><strong>Invoice Number</strong></td>
                    <td>Unique, non-repeating sequential code (e.g. <code>INV-2026-042</code>)</td>
                    <td>Essential for accounting reconciliations, audits, and tracking past dues</td>
                  </tr>
                  <tr>
                    <td><strong>Dates &amp; Terms</strong></td>
                    <td>Invoice date, formal due date, explicit terms (Net 30)</td>
                    <td>Establishes legal maturity date before late payment penalties apply</td>
                  </tr>
                  <tr>
                    <td><strong>Itemized Tasks</strong></td>
                    <td>Work dates, concise descriptions, decimal hours, hourly rates</td>
                    <td>Provides transparency so clients understand exactly what they are paying for</td>
                  </tr>
                  <tr>
                    <td><strong>Totals Waterfall</strong></td>
                    <td>Subtotal, discounts, sales tax/VAT, deposit credits, balance due</td>
                    <td>Displays exact net amount payable without manual math</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Details</strong></td>
                    <td>Bank ACH routing, SWIFT/IBAN, PayPal, or payment portal link</td>
                    <td>Eliminates friction so the client can pay immediately</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Listing Hours Worked: Daily Entries vs. Summary Batches</h2>
            <p className={styles.p}>
              When billing by the hour, choosing between daily itemization and milestone grouping depends on your client relationship and contract scope:
            </p>
            <p className={styles.p}>
              <strong>Daily Granular Entries:</strong> Essential for time-and-materials contracts, legal services, engineering audits, and technical contracting. Each row lists the calendar date, the specific milestone completed, and the fractional hours dedicated. This eliminates client pushback because every billable increment is transparently documented.
            </p>
            <p className={styles.p}>
              <strong>Summary Task Grouping:</strong> Common for retainers, creative design, and advisory consulting. Rather than documenting forty micro-entries, you group billable time into functional deliverables (e.g. &ldquo;Phase 2 UI Architecture: 18.0 billable hours @ $95.00/hr = $1,710.00&rdquo;).
            </p>
            <div className={styles.formulaBox}>
              Decimal Hours = Whole Hours + (Minutes ÷ 60)
              <br />
              Line Total ($) = Decimal Hours × Hourly Billing Rate ($/hr)
            </div>
            <p className={styles.p}>
              Common decimal conversions to remember: 15 minutes = 0.25h, 30 minutes = 0.50h, 45 minutes = 0.75h, and 6 minutes = 0.10h.
            </p>
          </section>

          {/* Section 5 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Using a Timesheet for Independent Contractor Invoicing</h2>
            <p className={styles.p}>
              Contractors who record sporadic daily sessions often struggle to calculate net totals across multiple projects. Our built-in <strong>Timesheet Helper</strong> allows you to log start-and-end times or raw minute durations across the week, apply standardized rounding rules, and roll the entire batch into clean invoice lines with one click.
            </p>
            <p className={styles.p}>
              Standard professional rounding increments include:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>15-Minute Increment (Quarter-Hour):</strong> The standard convention across creative, consulting, and trade industries. A session lasting 1 hour and 7 minutes rounds up to 1.25 hours.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>6-Minute Increment (Tenth-of-an-Hour):</strong> The strict standard used by legal counsel, accounting firms, and institutional management consultancies (0.1h = 6 min, 0.2h = 12 min).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Exact Minutes (No Rounding):</strong> Decimal conversion without bracket adjustments (e.g. 50 minutes = 0.83 hours).
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Freelance Invoice Templates by Discipline</h2>
            <p className={styles.p}>
              Our generator provides tailored industry presets to match common freelance billing patterns:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Freelance Writer / Editor:</strong> Combines hourly research interviews with per-word or fixed-fee article deliverables. Automatically includes copyright transfer language upon receipt of payment.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Freelance Translator:</strong> Tailored for per-source-word translation rates (e.g. $0.12/word for 3,500 words = $420.00), terminology glossary reviews, and notarized translation certification fees.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Independent Software Contractor:</strong> Designed for technical consultants billing high-tier hourly rates alongside pass-through hardware or cloud infrastructure staging fees.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>General Consulting:</strong> Balances discovery workshops, strategy advisory sessions, and reimbursable travel or software licensing expenses.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Payment Terms, Due Dates, and Late Fee Policies</h2>
            <p className={styles.p}>
              Clearly stating payment terms sets legal expectations and protects cash flow:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Due on Receipt:</strong> Payment is expected immediately upon email delivery. Best for new clients, digital deliverables, and one-off consultations.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Net 14:</strong> Payment is due two weeks from invoice issue date. A balanced middle ground popular among modern digital service providers.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Net 30:</strong> Payment is due 30 calendar days from issue. Standard for mid-market corporations and government agencies.
              </li>
            </ul>
            <p className={styles.p}>
              If your client agreement permits late fees, include a polite reminder in the notes field: e.g., <em>&ldquo;In accordance with our contract, invoices unpaid after 30 days are subject to a 1.5% monthly late finance fee (18% per annum).&rdquo;</em>
            </p>
          </section>

          {/* Section 8 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Sales Tax, VAT, and GST on Invoices: Regulatory Guidelines</h2>
            <p className={styles.p}>
              Tax regulations vary significantly across jurisdictions:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>United States (IRS &amp; State Sales Tax):</strong> Most states do not levy sales tax on pure professional and intellectual services (e.g. freelance writing, software development, consulting), though physical deliverables (like printed brochures) may be taxable. State laws vary, so check your state department of revenue.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>United Kingdom (HMRC VAT Rules):</strong> If your business turnover exceeds the statutory VAT registration threshold (£90,000 as of 2024–2026), you must issue a formal VAT invoice displaying your 9-digit VAT registration number, the tax date, the rate of VAT per item, and the total VAT payable.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Australia (ATO Tax Invoices):</strong> Businesses registered for Goods and Services Tax (GST) must issue a compliant &ldquo;Tax Invoice&rdquo; displaying their 11-digit Australian Business Number (ABN), itemized taxable amounts, and whether totals include or exclude 10% GST.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Canada (CRA GST/HST):</strong> Businesses exceeding $30,000 in gross revenue must register for a CRA business number and collect federal GST (5%) or harmonized sales tax (HST, up to 15% depending on the recipient province).
              </li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className={styles.section}>
            <h2 className={styles.h2}>Invoice Numbering Best Practices</h2>
            <p className={styles.p}>
              Maintain clean accounting records with these numbering conventions:
            </p>
            <ul className={styles.p} style={{ paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Year-Prefixed Sequence:</strong> <code>INV-2026-001</code>, <code>INV-2026-002</code>. Automatically groups your records by financial year and makes past tax returns easy to navigate.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Client-Specific Prefixes:</strong> <code>ACME-01</code>, <code>NIKE-01</code>. Keeps ongoing accounts organized if you invoice the same enterprise client multiple times per month.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Never Start at #1:</strong> Begin your series at <code>INV-1001</code> or <code>INV-2026-001</code> to project an established commercial track record to corporate clients.
              </li>
            </ul>
          </section>

          {/* Section 10: FAQ Accordion */}
          <section className={styles.faqSection}>
            <h2 className={styles.h2}>Frequently Asked Questions About Hourly Invoicing</h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <details>
                  <summary>{faq.q}</summary>
                  <div className={styles.faqAnswer}>{faq.a}</div>
                </details>
              </div>
            ))}
          </section>

          {/* Verification & Method Block */}
          <HowWeCalculate slug="invoice-generator" />

          {/* Related Tools Cross-Links */}
          <section className={styles.relatedSection}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>
              Related Business &amp; Hourly Tools
            </h2>
            <div className={styles.relatedGrid}>
              <Link href={ROUTES.processingFeeCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Processing Fee Calculator</div>
                <div className={styles.relatedDesc}>
                  Calculate merchant card processing fees, net settlement, and gross-up amount to charge clients.
                </div>
              </Link>
              <Link href={ROUTES.freelanceRateCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Freelance Rate Calculator</div>
                <div className={styles.relatedDesc}>
                  Determine the exact billable hourly rate needed to reach your target annual take-home pay.
                </div>
              </Link>
              <Link href={ROUTES.seTaxCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>1099 Tax Calculator</div>
                <div className={styles.relatedDesc}>
                  Estimate self-employment tax (FICA), 50% above-the-line deduction, and quarterly estimated payments.
                </div>
              </Link>
              <Link href={ROUTES.hourlyToSalaryCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Hourly to Salary Calculator</div>
                <div className={styles.relatedDesc}>
                  Convert hourly wages to annual salaries across 8 different pay frequencies and paid time-off days.
                </div>
              </Link>
              <Link href={ROUTES.constructionEstimateTemplate.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Construction Estimate Template</div>
                <div className={styles.relatedDesc}>
                  Build detailed contractor project estimates with labor, material costs, markup, and print PDF.
                </div>
              </Link>
              <Link href={ROUTES.profitMarginCalculator.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Profit Margin Calculator</div>
                <div className={styles.relatedDesc}>
                  Analyze gross, operating, and net margins across service and product revenue streams.
                </div>
              </Link>
              <Link href={ROUTES.numbersToWords.path} className={styles.relatedCard}>
                <div className={styles.relatedTitle}>Numbers to Words Converter</div>
                <div className={styles.relatedDesc}>
                  Write invoice totals and check amounts in words, with cents as a fraction over 100.
                </div>
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
