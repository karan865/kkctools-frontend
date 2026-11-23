import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PrintCostCalculator from '@/components/tool/3d-print-cost-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
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

const route = ROUTES.printCostCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const faqs = [
  {
    q: 'How do you calculate 3D printing cost?',
    a: 'Add four parts: 1) material (grams used ÷ spool weight × spool price, or mL used ÷ bottle size × bottle price); 2) electricity (printer watts ÷ 1,000 × print hours × your price per kWh); 3) machine wear (printer price ÷ the hours you expect it to last, × print hours); 4) your hands-on labor. Then add a failure allowance for prints that don’t succeed. The calculator does all of this with your own numbers.',
  },
  {
    q: 'How much does 3D printer filament cost per gram?',
    a: 'Divide the spool price by its weight in grams. A $20 spool of 1,000 g is 2¢ per gram; a $30 spool of 750 g is 4¢ per gram. Prices vary by brand, material and where you buy, so enter the price you actually paid rather than an average.',
  },
  {
    q: 'How much electricity does a 3D printer use?',
    a: 'It depends on the printer, the bed and nozzle temperatures, the room and whether it has an enclosure. The most accurate way is a plug-in power meter over a whole print: it gives kWh directly. Otherwise use the average watts from your printer’s spec sheet. Example: 120 W for 5 hours = 0.6 kWh; at $0.15 per kWh that is $0.09.',
  },
  {
    q: 'How much should I charge for 3D printing services?',
    a: 'Start from your full cost (material, power, machine wear, failures, labor, packaging), then add the markup your market will bear. There’s no single correct markup; check what comparable sellers charge for similar parts and lead times. The calculator shows your cost and the price at any markup you choose.',
  },
  {
    q: 'How do I calculate cost per hour for a 3D printer?',
    a: 'Divide the printer’s price by the hours you expect it to run before it needs replacing, then add any regular maintenance cost per hour. Example: a $300 printer expected to run 2,000 hours is $0.15 per hour; add your own figure for nozzles, belts and build plates.',
  },
  {
    q: 'What markup should I use for 3D prints?',
    a: 'It depends on your costs, your customers and your competition. Batch work for one client usually carries a lower markup than one-off custom parts that need design or finishing time. Use the calculator to see the price and profit at different markups, and remember markup is not margin: a 50% markup is a 33.3% margin.',
  },
  {
    q: 'Is resin 3D printing more expensive than filament?',
    a: 'Compare them per part with your own prices. Resin printing adds costs filament doesn’t have: wash liquid (for example isopropyl alcohol), vat film replacements, gloves and curing. Enter a wash-and-cure cost per print in Resin mode so the comparison is fair.',
  },
  {
    q: 'How do I factor failed prints into pricing?',
    a: 'Enter your own failure rate (the share of prints that fail). The calculator divides consumables by (1 − failure rate), so successful prints pay for the failed ones. Example: $1.50 of consumables with a 5% failure rate becomes $1.50 ÷ 0.95 = $1.58.',
  },
  {
    q: 'How much does 1 kg of filament make?',
    a: 'Divide the spool weight by the weight of one part as reported by your slicer, then allow for supports, purge and failed prints. Example: parts of 50 g each give at most 20 parts from 1,000 g, before any waste.',
  },
  {
    q: 'How do I convert filament length in meters to grams?',
    a: 'Grams = length × cross-section area × density. For 1.75 mm filament the area is π × (1.75 ÷ 2)² = 2.405 mm², so 1 meter is 2.405 cm³. Multiply by your filament’s density from the spool label or data sheet. Example: at 1.24 g/cm³ that is about 2.98 g per meter.',
  },
  {
    q: 'Should I charge for labor when 3D printing?',
    a: 'Yes. Slicing, bed preparation, removing parts and supports, finishing and packing all take your time. Time a few typical jobs and enter that labor time with your hourly rate.',
  },
  {
    q: 'What are the operating costs of running a 3D print farm?',
    a: 'Beyond per-print costs, a farm has fixed costs: space, ventilation, spare parts, software and the time to keep printers running. Use Batch & Print Farm mode to see daily and monthly output and profit with your own printer count, plates per day and parts per plate.',
  },
];

export default function PrintCostCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: '3D Printing & CNC', path: '/tools/#engineering' },
            { name: '3D Print Cost Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>3D Print Cost Calculator: Filament, Electricity, Time and Price to Charge</h1>
          <p className={styles.subtitle}>
            Accurate production cost and pricing tool for FDM filament and SLA resin 3D printers. Calculate exact material grams, power consumption, machine depreciation, failed print buffers, and profit markup to price 3D prints to sell.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> To calculate 3D print cost, sum material (weight in grams × price per gram) + electricity (printer watts × print hours × kWh rate) + machine depreciation, then add labor and your markup. A 50 g PLA print taking 3 hours costs about $1.58 in consumables, or $6.58 with labor; at a 50% markup, charge about $9.87.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'FDM & resin',
              'Price to charge',
              'Batch / print farm',
              'Power, wear & failure %',
            ]}
          >
            <PrintCostCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="print-cost-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the 3D Print Cost Calculator</h2>
            <p>
              It is easy to price a print on filament alone and forget electricity, nozzle and belt wear, saving for a replacement printer, slicing time and failed prints. Our calculator breaks down every hidden manufacturing expense across four specialized modes:
            </p>
            <ul>
              <li>
                <strong>Filament (FDM):</strong> For fused deposition modeling printers (Bambu Lab, Prusa, Creality, Voron). Calculate exact filament weight in grams or wire length in meters, accounting for material density.
              </li>
              <li>
                <strong>Resin (SLA/MSLA):</strong> For stereolithography and photopolymer resin printers (Elegoo, Anycubic, Formlabs). Accounts for resin volume in mL and secondary wash-and-cure consumables (IPA, disposable gloves, vat release films).
              </li>
              <li>
                <strong>Price Quote &amp; Markup:</strong> Set your target markup percentage, sales tax, packaging expenses, and technician labor time to produce a professional client-ready price quote.
              </li>
              <li>
                <strong>Batch &amp; Print Farm:</strong> Analyze mass-production economics: parts per plate, daily farm throughput, and monthly net profit across multiple networked 3D printers.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How to Calculate 3D Print Cost: The Full Formula</h2>
            <p>
              A professional Cost of Goods Sold (COGS) model for additive manufacturing combines four expense categories:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Cost Element</th>
                    <th>Exact Mathematical Formula</th>
                    <th>Worked Example (50g PLA / 3h Print)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Material Cost</td>
                    <td>(Grams Used ÷ Spool Weight) × Spool Price</td>
                    <td>(50 g ÷ 1,000 g) × $20.00 = <strong>$1.000</strong></td>
                  </tr>
                  <tr>
                    <td>Electrical Power</td>
                    <td>(Printer Watts ÷ 1,000) × Hours × Utility Rate ($/kWh)</td>
                    <td>(120 W ÷ 1,000) × 3 hrs × $0.15/kWh = <strong>$0.054</strong></td>
                  </tr>
                  <tr>
                    <td>Machine Depreciation</td>
                    <td>(Printer Purchase Price ÷ Lifetime Hours) × Print Hours</td>
                    <td>($300.00 ÷ 2,000 hrs) × 3 hrs = <strong>$0.450</strong></td>
                  </tr>
                  <tr>
                    <td>Base Consumables</td>
                    <td>Material + Electricity + Depreciation</td>
                    <td>$1.000 + $0.054 + $0.450 = <strong>$1.504</strong></td>
                  </tr>
                  <tr>
                    <td>Failure Contingency (5%)</td>
                    <td>Base Consumables ÷ (1 − Failure Rate)</td>
                    <td>$1.504 ÷ (1 − 0.05) = <strong>$1.583 (~$1.58)</strong></td>
                  </tr>
                  <tr>
                    <td>Hands-on Labor</td>
                    <td>Labor Hours × Shop Hourly Rate</td>
                    <td>0.25 hrs (15 min) × $20.00/hr = <strong>$5.000</strong></td>
                  </tr>
                  <tr>
                    <td>Total Production Cost</td>
                    <td>Consumables with Failure + Labor</td>
                    <td>$1.583 + $5.000 = <strong>$6.583 (~$6.58)</strong></td>
                  </tr>
                  <tr>
                    <td>Selling Price (50% Markup)</td>
                    <td>Total Cost × (1 + Markup %)</td>
                    <td>$6.583 × 1.50 = <strong>$9.875 (~$9.87)</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Filament Cost Calculation (Grams and Meters)</h2>
            <p>
              Most modern 3D slicers (Bambu Studio, PrusaSlicer, OrcaSlicer, Cura) report both the anticipated filament weight in grams and the length in meters upon slicing your 3D model.
            </p>
            <p>
              If your slicer only provides the length in meters, you can calculate the exact mass using the cylindrical volume formula:
              <br />
              <code>Volume (cm³) = Length (m) × 100 × π × (Filament Diameter ÷ 2)² ÷ 100</code>
              <br />
              <code>Grams = Volume (cm³) × Polymer Density (g/cm³)</code>
            </p>
            <p>
              Standard 1.75 mm filament holds about 2.405 cm³ of plastic per meter. Multiply that by the density printed on your spool or the maker&apos;s data sheet (it differs between brands and blends). For example, at 1.24 g/cm³:
            </p>
            <ul>
              <li><strong>Example:</strong> 2.405 cm³ × 1.24 g/cm³ = <strong>2.98 g per meter</strong>, so a 100 g part uses about 33.5 m.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Electricity Consumption of a 3D Printer</h2>
            <p>
              Power use depends on your printer, the bed and nozzle temperatures, the room and whether the printer is enclosed. Two ways to get a real number:
            </p>
            <ul>
              <li><strong>Measure it:</strong> a plug-in power meter over a whole print shows the kWh used, which is the most accurate input.</li>
              <li><strong>Estimate it:</strong> use the average watts from your printer&apos;s specification. Heating the bed and nozzle draws more at the start than holding temperature later.</li>
              <li><strong>Example:</strong> 120 W for 10 hours is 1.2 kWh; at $0.15 per kWh that is $0.18.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Machine Wear and Depreciation per Hour</h2>
            <p>
              Every hour your printer operates brings it closer to component fatigue: brass nozzles erode, GT2 timing belts stretch, linear bearings wear, and cooling fans degrade. If you do not include machine wear in your pricing, you will be forced to pay for printer repairs out of your own pocket.
            </p>
            <p>
              To calculate machine depreciation:
              <br />
              <code>Hourly Depreciation = Initial Machine Purchase Price ÷ Expected Service Lifespan (Hours)</code>
            </p>
            <p>
              Example: a $300 printer you expect to run for 2,000 hours costs <strong>$0.15 per hour</strong> in depreciation. Use your own purchase price and the hours you expect to get from it, and add your own per-hour figure for nozzles, belts and build plates.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Pricing 3D Prints to Sell: Markup vs. Margin</h2>
            <p>
              Setting your client price requires choosing between cost-plus markup and target profit margin:
            </p>
            <ul>
              <li>
                <strong>Markup:</strong> The percentage added directly on top of production cost: <code>Price = Cost × (1 + Markup %)</code>. A $10 cost with a 50% markup sells for $15 ($5 profit).
              </li>
              <li>
                <strong>Profit Margin:</strong> The percentage of final selling price that represents profit: <code>Margin % = (Profit ÷ Selling Price) × 100</code>. A $5 profit on a $15 sale is a 33.3% profit margin.
              </li>
            </ul>
            <p>
              To explore comprehensive freelance business models, utilize our connected tools:
            </p>
            <ul>
              <li>
                <Link href="/profit-margin-calculator/">Profit Margin Calculator</Link> — Convert between gross markup and net margin percentages effortlessly.
              </li>
              <li>
                <Link href="/freelance-rate-calculator/">Freelance Hourly Rate Calculator</Link> — Determine your true shop labor rate factoring unpaid administration, health insurance, and taxes.
              </li>
              <li>
                <Link href="/commercial-lease-calculator/">Commercial Lease Calculator</Link> — Plan facility rental overhead for commercial print farm spaces.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Accounting for Failed Prints and Support Waste</h2>
            <p>
              In additive manufacturing, failed prints are inevitable. Warping, layer shifts, bed adhesion loss, power flickers, and partial nozzle clogs can ruin a print 18 hours into a job.
            </p>
            <p>
              Track how many of your prints fail and enter that rate. By calculating consumables with a failure multiplier (<code>Base ÷ (1 − Failure Rate)</code>), every successful client order contributes a few pennies to cover the raw plastic and electricity lost during failed runs.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Resin 3D Printing Costs: Wash and Cure Consumables</h2>
            <p>
              Stereolithography (SLA/MSLA) resin printing delivers incredible surface resolution for miniatures, dental models, and jewelry casting, but involves significant secondary chemical handling expenses:
            </p>
            <ul>
              <li><strong>Resin:</strong> bottle price ÷ bottle volume gives your cost per mL; use the price you paid.</li>
              <li><strong>Wash liquid:</strong> isopropyl alcohol or another wash fluid has to be refreshed as it saturates with resin.</li>
              <li><strong>Vat film:</strong> the release film at the bottom of the vat wears out and needs replacing.</li>
              <li><strong>Gloves and curing:</strong> disposable gloves, filters and the curing station add a little to every plate.</li>
              <li><strong>How to include them:</strong> add up a month of these costs, divide by the plates you printed, and enter the result as the wash-and-cure cost per print.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Print Farm Economics and Batch Production</h2>
            <p>
              As your 3D printing business grows from a single desktop printer into a multi-machine print farm, the unit economics change fundamentally:
            </p>
            <ul>
              <li><strong>Multiplying Parts per Plate:</strong> Slicing 4 brackets on a single build plate amortizes warm-up power and bed leveling time across all 4 units, lowering the per-part cost significantly.</li>
              <li><strong>Unattended Overnight Operation:</strong> Printers can run unattended overnight, so labor per part drops; time your own plate changes to get a real figure.</li>
              <li><strong>Farm Scalability:</strong> Our Batch &amp; Print Farm mode projects daily throughput and monthly revenues. For example, 4 printers running 3 plates per day with 2 parts per plate produces 24 parts daily. At a $10 quote price and $3 manufacturing cost, the farm yields $240 in daily revenue ($168 daily net profit / $5,040 monthly profit).</li>
            </ul>
          </section>

          <section className={styles.faqSection}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqGrid}>
              {faqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <HowWeCalculate slug="3d-print-cost-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
