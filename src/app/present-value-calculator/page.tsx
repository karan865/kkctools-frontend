import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Container from '@/components/ui/Container';
import ToolShell from '@/components/tool/shared/ToolShell';
import AdSlot from '@/components/ads/AdSlot';
import Faq from '@/components/ui/Faq';
import PresentValueCalculator from '@/components/tool/present-value-calculator';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

const PAGE_TITLE = 'Present Value Calculator – PV Formula, NPV & PV Table';
const PAGE_DESC =
  'Free present value calculator. Use the PV formula for a lump sum or annuity, find NPV and IRR, and print a present value table for any range of rates.';
const PAGE_PATH = '/present-value-calculator/';

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESC,
  path: PAGE_PATH,
  absoluteTitle: true,
});

const FAQS = [
  {
    q: 'What is the effective annual rate (EAR) formula?',
    a: 'The Effective Annual Rate (EAR) formula converts a nominal APR with intra-year compounding into its true effective annualized rate: EAR = (1 + r/m)^m − 1, where r is nominal APR and m is compounding cycles per year. For example, 6% compounded monthly yields EAR = (1 + 0.06/12)¹² − 1 = 6.168%. To convert between APR and EAR/APY automatically, use our Compound Interest Calculator.',
  },
  {
    q: 'What is the PV formula?',
    a: 'The standard Present Value formula for a single future sum is PV = FV ÷ (1 + r)ⁿ, where PV is present value, FV is future value, r is the discount rate per period (as a decimal), and n is the total number of discounting periods. If compounding occurs m times per year, the formula becomes PV = FV ÷ (1 + r/m)^(m×t).',
  },
  {
    q: 'How do I calculate present value by hand?',
    a: 'To calculate present value manually: 1) Express your annual discount rate as a decimal (e.g. 6% = 0.06). 2) Add 1 to the discount rate (1 + 0.06 = 1.06). 3) Raise that sum to the power of the number of years (1.06¹⁰ ≈ 1.7908). 4) Divide your future cash receipt by that result ($10,000 ÷ 1.7908 = $5,583.95).',
  },
  {
    q: 'What is a present value table, and how do I use it?',
    a: 'A present value table (also known as a discount table) lists pre-calculated discount factors [1 ÷ (1 + r)ⁿ] across a grid of interest rates (columns) and time periods (rows). To find the present value of any future sum, locate the intersection of your interest rate and period, then multiply that 4-decimal factor by your future dollar amount.',
  },
  {
    q: 'How do I calculate the PV of an annuity?',
    a: 'The present value of an ordinary annuity is calculated as PV = PMT × [(1 − (1 + r)⁻ⁿ) ÷ r], where PMT is the regular periodic cash payment, r is the discount rate per period, and n is the number of payments. For an annuity due (where payments occur at the beginning of each period), multiply the final result by (1 + r).',
  },
  {
    q: 'What is the difference between an ordinary annuity and an annuity due?',
    a: 'In an ordinary annuity, payments occur at the end of each period (common for bonds, bank loans, and traditional mortgages). In an annuity due, payments occur at the start of each period (common for apartment rent, leases, and insurance premiums). Because annuity due payments are received earlier, each payment is discounted one period less, making an annuity due worth (1 + r) times more than an equivalent ordinary annuity.',
  },
  {
    q: 'How do I calculate NPV?',
    a: 'Net Present Value (NPV) is calculated by summing the discounted present values of all expected future cash inflows and subtracting the initial investment outlay: NPV = ∑ [CFₜ ÷ (1 + r)ᵗ] − Initial Outlay. A positive NPV indicates that the investment generates a return exceeding the hurdle rate, creating net economic value for the business.',
  },
  {
    q: 'PV vs NPV: what is the difference?',
    a: 'Present Value (PV) measures the current discounted worth of incoming future cash flows without accounting for what you paid to acquire them. Net Present Value (NPV) takes that PV and explicitly subtracts the initial cash cost (outlay). While PV is always positive for positive cash inflows, NPV can be positive, zero, or negative.',
  },
  {
    q: 'Can NPV be negative? What does it mean?',
    a: 'Yes, NPV is negative whenever the discounted present value of future cash inflows is less than the initial cash required to launch the project. A negative NPV does not necessarily mean the project loses money in absolute accounting terms; rather, it means the project fails to deliver your required minimum hurdle rate of return.',
  },
  {
    q: 'NPV vs IRR: which metric should I use?',
    a: 'NPV measures the absolute dollar value created by an investment, while IRR measures the percentage rate of return at which NPV equals zero. Corporate finance standards prioritize NPV when evaluating mutually exclusive projects because IRR assumes cash inflows can be reinvested at the IRR itself (which is often unrealistic) and can produce distorted rankings for projects of different sizes.',
  },
  {
    q: 'Why is my Excel NPV formula giving the wrong number?',
    a: 'The most common mistake in spreadsheets is including Year 0 (the initial outflow) inside Excel’s =NPV() function. Excel’s NPV formula treats the very first argument as Period 1, meaning it mistakenly discounts your immediate initial investment by one year. The correct formula is always: =NPV(rate, inflows_range) − initial_outlay, keeping the initial cost outside the function.',
  },
  {
    q: 'What discount rate should I choose (WACC)?',
    a: 'The discount rate should reflect the opportunity cost of capital—the return you could achieve on an alternative investment of equivalent risk. For corporate capital projects, finance teams often use their Weighted Average Cost of Capital (WACC), blending after-tax cost of debt and required equity returns. For personal finance decisions, people commonly use the risk-free Treasury yield, expected broad-market index returns, or inflation plus a personal hurdle premium.',
  },
];

export default function PresentValuePage() {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Business & Finance', path: '/tools/' },
    { name: 'Present Value Calculator', path: PAGE_PATH },
  ];

  const appSchema = buildWebApplicationSchema({
    name: 'Present Value & NPV Calculator',
    path: PAGE_PATH,
    description: PAGE_DESC,
    applicationCategory: 'BusinessApplication',
  });

  const faqSchema = buildFaqSchema(FAQS);

  return (
    <main className={`${styles.page} ${toolDisplayFont.variable} ${typo.scope}`}>
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      <Container>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <header className={styles.hero}>
          <h1 className={styles.title}>Present Value Calculator: PV Formula, NPV and PV Tables</h1>
          <p className={styles.bluf}>
            PV formula: <strong>PV = FV ÷ (1 + r)ⁿ</strong>. Money received in the future is worth less today due to the
            time value of money. This free calculator lets you solve lump-sum present values, recurring annuities, uneven
            cash streams, capital budgeting NPV &amp; IRR, and generates custom printable present value discount tables.
          </p>
        </header>

        <ToolShell
          features={['PV, annuity & NPV/IRR', 'Printable PV table', 'Excel formulas', 'Step-by-step working']}
        >
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading calculator...</div>}>
            <PresentValueCalculator />
          </Suspense>
        </ToolShell>

        <div className={styles.adBand}>
          <AdSlot slotId="after-tool" />
        </div>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>PV Formula: The Mathematical Foundation of Finance</h2>
            <div className={styles.prose}>
              <p>
                The <strong>Present Value formula</strong> is the core mechanism used across modern finance to quantify
                the current worth of money expected in the future. Because cash in hand today can earn interest, be
                invested in productive enterprise, or be protected against purchasing power loss caused by inflation, a dollar
                received tomorrow is inherently worth less than a dollar held today.
              </p>
              <div className={styles.formulaBox}>
                <strong>Single Sum PV Formula:</strong>
                <br />
                PV = FV ÷ (1 + r)ⁿ
                <br />
                <br />
                <strong>With Compounding Frequency (m times per year):</strong>
                <br />
                PV = FV ÷ (1 + r/m)^(m × t)
                <br />
                <br />
                <strong>Continuous Compounding:</strong>
                <br />
                PV = FV × e^(−r × t)
              </div>
              <p>
                Where:
              </p>
              <ul>
                <li><strong>PV (Present Value):</strong> The discounted current dollar amount today.</li>
                <li><strong>FV (Future Value):</strong> The nominal dollar payment to be received in the future.</li>
                <li><strong>r:</strong> The annual discount rate or required rate of return (expressed as a decimal, e.g., 6% = 0.06).</li>
                <li><strong>n:</strong> The total number of discounting periods (or years <em>t</em> multiplied by compounding cycles <em>m</em>).</li>
                <li><strong>e:</strong> Euler&apos;s mathematical constant (~2.71828).</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How to Use the Present Value Calculator</h2>
            <div className={styles.prose}>
              <p>
                This calculator provides five dedicated solve modes to handle every time-value-of-money scenario:
              </p>
              <ol>
                <li>
                  <strong>PV Lump Sum:</strong> Determine what a single future lump-sum payment (such as an inheritance, a
                  zero-coupon bond maturity, or a commercial balloon note) is worth today across different compounding frequencies.
                </li>
                <li>
                  <strong>PV Annuity:</strong> Value an ongoing series of equal periodic payments. Toggle between ordinary
                  annuities (paid at end of period), annuities due (paid at start), growing annuities, or perpetual annuities.
                </li>
                <li>
                  <strong>Uneven Cash Flows:</strong> Enter varying projected annual cash flows to calculate the net discounted sum
                  of irregular corporate earnings or multi-tenant lease agreements.
                </li>
                <li>
                  <strong>NPV &amp; IRR:</strong> Input an upfront initial investment and projected operating cash flows to solve Net
                  Present Value, Internal Rate of Return, Profitability Index, and Discounted Payback Period.
                </li>
                <li>
                  <strong>PV Table:</strong> Generate a complete matrix of 4-decimal present value discount factors across custom
                  interest rate ranges and time horizons, with instant CSV copy and print options.
                </li>
              </ol>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Present Value of a Lump Sum: Worked Example</h2>
            <div className={styles.prose}>
              <p>
                Suppose a client signs an agreement promising to pay you <strong>$10,000 in exactly 10 years</strong>.
                If your alternative investment opportunity yields <strong>6.00% annually</strong>, what is that promised
                future sum worth right now?
              </p>
              <div className={styles.formulaBox}>
                PV = $10,000 ÷ (1 + 0.06)¹⁰
                <br />
                PV = $10,000 ÷ (1.7908477)
                <br />
                PV = <strong>$5,583.95</strong>
              </div>
              <p>
                This calculation demonstrates that receiving $10,000 in ten years is economically identical to receiving
                $5,583.95 today, because investing $5,583.95 today at 6% annual compound growth would accumulate to exactly
                $10,000 at maturity. If the discount rate increases to 8%, the present value drops to $4,631.93; as interest
                rates rise, future money loses value more quickly.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>PV of an Annuity: Ordinary vs. Annuity Due</h2>
            <div className={styles.prose}>
              <p>
                An annuity represents a sequence of recurring payments made at regular intervals. The formula for the{' '}
                <strong>present value of an ordinary annuity</strong> (where cash is received at the end of each period) is:
              </p>
              <div className={styles.formulaBox}>
                PV(Ordinary Annuity) = PMT × [ (1 − (1 + r)⁻ⁿ) ÷ r ]
              </div>
              <p>
                For example, an ordinary annuity paying <strong>$1,000 per year for 10 years</strong> at a{' '}
                <strong>6% discount rate</strong>:
              </p>
              <div className={styles.formulaBox}>
                PV = $1,000 × [ (1 − (1.06)⁻¹⁰) ÷ 0.06 ]
                <br />
                PV = $1,000 × [ (1 − 0.558395) ÷ 0.06 ]
                <br />
                PV = $1,000 × 7.360087 = <strong>$7,360.09</strong>
              </div>
              <p>
                If payments are received at the beginning of each period (<strong>Annuity Due</strong>, such as equipment
                leases or commercial rent), each payment earns an extra period of interest. The formula multiplies the
                ordinary annuity by (1 + r):
              </p>
              <div className={styles.formulaBox}>
                PV(Annuity Due) = $7,360.09 × (1 + 0.06) = <strong>$7,801.70</strong>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Growing Annuities and Perpetuities</h2>
            <div className={styles.prose}>
              <p>
                In corporate valuations and dividend discount models, cash flows often increase annually to match inflation
                or sales expansion. A <strong>growing annuity</strong> incorporates an annual growth rate (<em>g</em>):
              </p>
              <div className={styles.formulaBox}>
                PV(Growing Annuity) = [ PMT ÷ (r − g) ] × [ 1 − ((1 + g) ÷ (1 + r))ⁿ ]
              </div>
              <p>
                When cash flows continue indefinitely (such as preferred stock dividends or commercial ground leases), the
                stream becomes a <strong>perpetuity</strong>:
              </p>
              <div className={styles.formulaBox}>
                PV(Perpetuity) = PMT ÷ r
                <br />
                <br />
                PV(Growing Perpetuity) = PMT ÷ (r − g)  [Valid only when r &gt; g]
              </div>
              <p>
                For instance, a perpetual endowment generating $50,000 annually with a required discount rate of 5% has a
                present value of $50,000 ÷ 0.05 = <strong>$1,000,000</strong>.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Present Value Table (Discount Factors)</h2>
            <div className={styles.prose}>
              <p>
                Before financial calculators and spreadsheets were widespread, analysts relied on printed{' '}
                <strong>present value discount tables</strong>. These tables display the factor{' '}
                <code>1 ÷ (1 + r)ⁿ</code> rounded to four decimal places.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Period (n)</th>
                      <th>4%</th>
                      <th>6%</th>
                      <th>8%</th>
                      <th>10%</th>
                      <th>12%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 Year</td>
                      <td>0.9615</td>
                      <td>0.9434</td>
                      <td>0.9259</td>
                      <td>0.9091</td>
                      <td>0.8929</td>
                    </tr>
                    <tr>
                      <td>2 Years</td>
                      <td>0.9246</td>
                      <td>0.8900</td>
                      <td>0.8573</td>
                      <td>0.8264</td>
                      <td>0.7972</td>
                    </tr>
                    <tr>
                      <td>3 Years</td>
                      <td>0.8890</td>
                      <td>0.8396</td>
                      <td>0.7938</td>
                      <td>0.7513</td>
                      <td>0.7118</td>
                    </tr>
                    <tr>
                      <td>5 Years</td>
                      <td>0.8219</td>
                      <td>0.7473</td>
                      <td>0.6806</td>
                      <td>0.6209</td>
                      <td>0.5674</td>
                    </tr>
                    <tr>
                      <td>10 Years</td>
                      <td>0.6756</td>
                      <td>0.5584</td>
                      <td>0.4632</td>
                      <td>0.3855</td>
                      <td>0.3220</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Using Tab 5 of this calculator, you can generate and print an interactive, customized table for any interest
                rate increments and period limits required for your coursework or financial analysis.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How to Calculate Net Present Value (NPV)</h2>
            <div className={styles.prose}>
              <p>
                <strong>Net Present Value (NPV)</strong> is the gold standard capital budgeting metric used to determine
                whether an investment project will create or destroy enterprise value. The decision rule is straightforward:
              </p>
              <ul>
                <li><strong>NPV &gt; 0:</strong> Accept the project. The investment yields more than the cost of capital, expanding shareholder wealth.</li>
                <li><strong>NPV = 0:</strong> Indifferent. The project earns exactly the hurdle rate.</li>
                <li><strong>NPV &lt; 0:</strong> Reject the project. The expected returns fail to compensate for the cost of capital.</li>
              </ul>
              <div className={styles.formulaBox}>
                <strong>NPV Worked Example:</strong>
                <br />
                Initial Outlay: −$10,000 (Year 0)
                <br />
                Inflows: $3,000 per year for 5 years
                <br />
                Discount Rate: 8.00%
                <br />
                <br />
                PV of Inflows = $3,000 × [ (1 − (1.08)⁻⁵) ÷ 0.08 ] = $11,978.13
                <br />
                Net Present Value = $11,978.13 − $10,000 = <strong>+$1,978.13</strong>
                <br />
                Internal Rate of Return (IRR) = <strong>15.24%</strong>
                <br />
                Profitability Index (PI) = $11,978.13 ÷ $10,000 = <strong>1.20</strong>
                <br />
                Discounted Payback = <strong>4.03 Years</strong>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>NPV vs. IRR and the NPV Profile Curve</h2>
            <div className={styles.prose}>
              <p>
                While NPV measures the total dollar value added, the <strong>Internal Rate of Return (IRR)</strong> is the
                specific discount rate that drives the project&apos;s NPV to exactly zero. If you plot NPV on the vertical axis
                against various discount rates on the horizontal axis, the resulting downward-sloping curve is known as the{' '}
                <strong>NPV Profile</strong>.
              </p>
              <p>
                The point where the curve intersects the horizontal axis ($0 NPV) is the IRR. Whenever the project&apos;s
                hurdle rate is lower than the IRR, the project yields a positive NPV and should be accepted.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>PV and NPV in Excel and Google Sheets: Avoiding the Period-0 Mistake</h2>
            <div className={styles.prose}>
              <p>
                Spreadsheet applications like Microsoft Excel and Google Sheets feature built-in TVM functions, but they
                frequently trip up analysts due to unexpected design conventions:
              </p>
              <div className={styles.formulaBox}>
                <strong>Lump Sum PV:</strong>
                <br />
                <code>=PV(rate, nper, pmt, [fv], [type])</code>
                <br />
                Example: <code>=PV(6%, 10, 0, -10000)</code> returns <strong>$5,583.95</strong>.
                <br />
                <em>Note: Excel expects a negative sign on FV so that the calculated PV returns as a positive cash flow.</em>
              </div>
              <div className={styles.formulaBox}>
                <strong>The Classic Excel NPV Trap:</strong>
                <br />
                Excel&apos;s <code>=NPV(rate, value1, [value2], ...)</code> function assumes <code>value1</code> occurs at the{' '}
                <strong>end of Year 1</strong>. If you place your initial Year 0 cash outlay inside the NPV range, Excel will
                improperly discount your initial investment by one year!
                <br />
                <br />
                <strong>Correct Syntax:</strong>
                <br />
                <code>=NPV(rate, B2:B6) − Initial_Outlay</code>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Choosing an Appropriate Discount Rate</h2>
            <div className={styles.prose}>
              <p>
                The discount rate is the most sensitive variable in any present value analysis. Small adjustments in
                discount rates compound significantly over long time horizons. Common benchmarks include:
              </p>
              <ul>
                <li>
                  <strong>Risk-Free Rate:</strong> US Treasury yields (e.g., 10-year Treasury note) are used for guaranteed or
                  sovereign cash receipts.
                </li>
                <li>
                  <strong>Weighted Average Cost of Capital (WACC):</strong> Corporate finance teams blend their cost of equity
                  and after-tax cost of debt to evaluate internal capital investments.
                </li>
                <li>
                  <strong>Real Estate Hurdle Rates:</strong> Property investors frequently reference local capitalization rates
                  plus capital expenditure reserves to underwrite acquisitions.
                </li>
                <li>
                  <strong>Inflation Hurdle:</strong> Some people use expected inflation plus the extra return they want for
                  taking risk as their personal discount rate.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Related Valuation &amp; Financial Calculators</h2>
            <div className={styles.linksList}>
              <Link href="/compound-interest-calculator/" className={styles.relatedLink}>
                Compound Interest &amp; Future Value Calculator →
              </Link>
              <Link href="/business-valuation-calculator/" className={styles.relatedLink}>
                Business Valuation (SDE &amp; EBITDA) →
              </Link>
              <Link href="/cap-rate-calculator/" className={styles.relatedLink}>
                Cap Rate &amp; Property Value Calculator →
              </Link>
              <Link href="/percentage-change-calculator/" className={styles.relatedLink}>
                Percentage Change &amp; Growth Calculator →
              </Link>
              <Link href="/construction-estimate-template/" className={styles.relatedLink}>
                Construction Cost &amp; Estimate Template →
              </Link>
            </div>
          </section>

          <HowWeCalculate slug="present-value-calculator" />

          <div className={styles.faqWrap}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <Faq items={FAQS} withSchema={false} />
          </div>
        </article>
      </Container>
    </main>
  );
}
