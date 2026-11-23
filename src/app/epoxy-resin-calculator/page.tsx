import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import EpoxyResinCalculator from '@/components/tool/epoxy-resin-calculator';
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

const route = ROUTES.epoxyResinCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How much epoxy resin do I need?',
    a: 'Multiply length × width × coat thickness (all in inches) to get cubic inches. Divide by 1.8047 for US fluid ounces or by 231 for US gallons. Then add a waste allowance for what stays in the cups and runs off the edges; the calculator uses 10% by default, and you can change it.',
  },
  {
    q: 'What is the epoxy volume formula?',
    a: 'Rectangles: length × width × thickness. Circles: π × (diameter ÷ 2)² × thickness. Cylindrical molds: π × (diameter ÷ 2)² × height. One US fluid ounce is exactly 1.8046875 in³ (231 ÷ 128) and one cubic inch is exactly 16.387064 mL.',
  },
  {
    q: 'How much epoxy do I need for a river table?',
    a: 'Measure the river width at several points along its length and average them, multiply by the river length and the depth, then add any flood coat over the whole top. Our Epoxy River Table Calculator does this with multiple width readings and plans the pours.',
  },
  {
    q: 'How thick should epoxy be, and do I need a seal coat?',
    a: 'Follow your product’s label: it states the coat thickness it is made for and whether a seal coat is needed. Porous surfaces such as raw wood are often sealed first with a thin coat so air escaping from the pores doesn’t make bubbles in the main pour. Enter the thickness you plan to pour; the calculator works for any value.',
  },
  {
    q: 'How much epoxy for a 24 × 24 in table?',
    a: 'At 1/8 inch thick: 24 × 24 × 0.125 = 72 cubic inches = 39.9 US fluid ounces. With a 10% waste allowance that is 43.9 fl oz (about 1.30 liters), or about 22 fl oz each of resin and hardener for a 1:1 by-volume product.',
  },
  {
    q: 'How many pours do I need for a deep project?',
    a: 'Divide the total depth by the maximum pour depth on your resin’s technical data sheet and round up. Example: 2 inches deep with a product rated for 0.5-inch layers needs 4 pours. Don’t exceed the maker’s layer limit; thick pours of fast resin can overheat as they cure.',
  },
  {
    q: 'Can I measure epoxy by weight instead of volume?',
    a: 'Only if your product gives a weight ratio, or gives the density of each part so you can convert. Resin and hardener usually have different densities, so a 1:1 by-volume product is not 1:1 by weight. Enter both densities from the data sheet and the calculator gives the weights for you.',
  },
  {
    q: 'How much extra epoxy should I add for waste?',
    a: 'It depends on your setup: open edges that drip and lots of small mixing batches lose more than a sealed mold. The calculator starts at 10% and lets you add a separate edge-drip allowance; adjust both to match your past projects.',
  },
  {
    q: 'I know the area: how much resin do I need?',
    a: 'Multiply the area in square inches by the thickness in inches, then divide by 231 for gallons. Before waste, one US gallon covers 231 ÷ 0.125 = 1,848 square inches (about 12.8 sq ft) at 1/8 inch, or about 25.7 sq ft at 1/16 inch.',
  },
  {
    q: 'How do I calculate a 2:1 or 3:1 mix?',
    a: 'Add the ratio numbers to get the total parts. For 2:1 there are 3 parts: resin is 2/3 and hardener 1/3. For 3:1 there are 4 parts: resin 3/4, hardener 1/4. Example: 60 fl oz of a 2:1 mix is 40 fl oz of resin and 20 fl oz of hardener.',
  },
  {
    q: 'How do I measure an irregular mold?',
    a: 'Put the empty mold on a kitchen scale, zero it, fill the cavity with water to the depth you want and read the grams. One gram of water is about one milliliter, so the reading is the cavity volume in mL. Dry the mold completely before pouring resin.',
  },
  {
    q: 'How long does epoxy take to dry, and is it food safe?',
    a: 'Cure times and food-contact suitability depend entirely on the product. Check its technical data sheet for working time, the time to handle and the time to full cure, and for any food-contact statement. Don’t assume one product behaves like another.',
  },
];

export default function EpoxyResinCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: '3D Printing & CNC', path: '/tools/#engineering' },
            { name: 'Epoxy Resin Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Epoxy Resin Calculator: How Much Resin and Hardener to Mix</h1>
          <p className={styles.subtitle}>
            Accurate epoxy coverage for table tops, bar tops, river tables, and silicone molds. Calculate total volume in fluid ounces, gallons, or liters, split into exact Part A and Part B mix batches by volume or weight.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front (BLUF):</strong> Multiply length × width × coat thickness to get cubic inches, then divide by 1.805 for fluid ounces or 231 for US gallons, and add 10% for waste. A 48 × 24 in table top at 1/8 in needs about 88 fl oz (about 44 fl oz resin and 44 fl oz hardener for a 1:1 mix).
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Every shape & deep pours',
              'Mix by volume or weight',
              'Kit planner',
              'Inches or cm',
            ]}
          >
            <EpoxyResinCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="epoxy-calc-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Epoxy Calculator</h2>
            <p>
              Whether you are sealing a reclaimed timber dining table, pouring an epoxy river slab, or casting resin dice in silicone molds, measuring your resin and hardener accurately prevents sticky spots, soft curing, and expensive waste. Our calculator provides four dedicated calculation modes:
            </p>
            <ul>
              <li>
                <strong>Coating (Table / Bar Top):</strong> Enter the length and width of your rectangular or circular surface. Select from standard flood coat presets (1/8 in / 3.2 mm) or enter a custom thickness.
              </li>
              <li>
                <strong>Deep Pour / River:</strong> Designed for castings thicker than 1/2 inch. Enter your depth and your product&apos;s maximum recommended layer thickness to generate a step-by-step pour schedule that prevents heat buildup.
              </li>
              <li>
                <strong>Silicone Mold &amp; Casting:</strong> Enter cylinder diameter and height, or rectangular box mold dimensions, to determine exact pour volumes for figurines, pen blanks, or tumblers.
              </li>
              <li>
                <strong>Known Volume &amp; Mix:</strong> If you already know your container size or measured your mold cavity with water, enter the liquid volume directly to calculate Part A and Part B splits by volume or weight.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How Much Epoxy Do I Need? The Exact Formula</h2>
            <p>
              Epoxy resin calculations rely on simple geometry converted into liquid capacity units. First, calculate the solid physical volume in cubic inches (in³) or cubic centimeters (cm³):
            </p>
            <ul>
              <li><strong>Rectangular Slab:</strong> Volume (in³) = Length (in) × Width (in) × Thickness (in)</li>
              <li><strong>Circular Top / Disc:</strong> Volume (in³) = π × (Diameter ÷ 2)² × Thickness (in)</li>
              <li><strong>Cylinder Mold:</strong> Volume (in³) = π × (Diameter ÷ 2)² × Height (in)</li>
              <li><strong>Rectangular Mold:</strong> Volume (in³) = Length (in) × Width (in) × Height (in)</li>
            </ul>
            <p>
              Once your total cubic inches are established, convert to liquid volume using standard statutory factors:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Unit Conversion</th>
                    <th>Exact Factor</th>
                    <th>Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cubic Inches to US Fluid Ounces</td>
                    <td>1 fl oz = 1.804688 in³</td>
                    <td>Fluid Ounces = in³ ÷ 1.804688</td>
                  </tr>
                  <tr>
                    <td>Cubic Inches to US Gallons</td>
                    <td>1 US gal = 231.000 in³</td>
                    <td>US Gallons = in³ ÷ 231.000</td>
                  </tr>
                  <tr>
                    <td>Cubic Inches to Milliliters (mL)</td>
                    <td>1 in³ = 16.387064 mL</td>
                    <td>Milliliters = in³ × 16.387064</td>
                  </tr>
                  <tr>
                    <td>Milliliters to Liters (L)</td>
                    <td>1,000 mL = 1.000 L</td>
                    <td>Liters = mL ÷ 1,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>Worked Calculation Example:</strong> A standard coffee table measuring 48 inches long by 24 inches wide with a 1/8-inch (0.125 in) self-leveling flood coat requires:
              <br />
              <code>48 in × 24 in × 0.125 in = 144.0 in³</code>
              <br />
              Dividing by 1.804688 yields <strong>79.79 fl oz</strong> (0.623 US gallons or 2,360 mL). Adding a standard 10% waste allowance (79.79 × 1.10) results in <strong>87.77 fl oz (2,596 mL)</strong>. For a standard 1:1 mix ratio product, you will mix 43.89 fl oz of Resin (Part A) and 43.89 fl oz of Hardener (Part B).
            </p>
          </section>

          <section className={styles.section}>
            <h2>Seal Coat vs. Flood Coat vs. Deep Pour</h2>
            <p>
              Applying epoxy successfully to wood furniture requires understanding the distinct functional roles of seal coats, flood coats, and deep casting pours:
            </p>
            <ul>
              <li>
                <strong>Seal Coat (1/16 in / 1.6 mm):</strong> A thin initial coat brushed or rolled over bare wood. Porous end-grain and softwoods contain millions of microscopic air pockets. When warm epoxy is applied, the air expands and off-gases into the liquid. A seal coat seals these pores so air cannot escape. Once it reaches a tacky &ldquo;fingerprint without transfer&rdquo; cure, the surface is ready for the flood coat.
              </li>
              <li>
                <strong>Flood Coat (1/8 in / 3.2 mm):</strong> The primary self-leveling surface layer. Poured directly down the center of the piece and spread outward with a notched squeegee or foam spreader, a flood coat flows to a glass-smooth finish and naturally levels itself across flat tables and countertops.
              </li>
              <li>
                <strong>Deep Pour (1/2 in to 2+ inches):</strong> Specialized casting resins formulated with low exothermic reactivity and extended gel times. Poured in thick sections for river tables, live-edge voids, and deep encasements where standard tabletop resins would overheat and boil.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Mixing Resin and Hardener: Getting the Mix Ratio Right</h2>
            <p>
              Thermosetting epoxy polymers cure through an exact stoichiometric reaction: molecules of epoxide resin cross-link with molecules of polyamine hardener. Adding extra hardener does not make epoxy cure faster; instead, unreacted hardener molecules remain trapped in the matrix, causing permanent cloudiness, tackiness, or structural softness.
            </p>
            <p>
              <strong>Volume vs. weight:</strong> a ratio stated by volume (for example 1:1 by volume) is not the same ratio by weight, because resin and hardener usually have different densities. If your product gives a weight ratio, use it. If it only gives a volume ratio, enter the density of each part from the technical data sheet and the calculator converts the split to grams for you.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Deep Pour Epoxy: How Many Pours Do You Need?</h2>
            <p>
              Epoxy curing is an <strong>exothermic chemical reaction</strong>—as polymers link together, they generate heat. In thin coats, this heat dissipates rapidly into the surrounding air. In deep pours, heat becomes trapped inside the core of the mass.
            </p>
            <p>
              If the core temperature rises too quickly, the reaction accelerates uncontrollably (thermal runaway). The resin can smoke, turn yellow, crack, or bubble violently. To avoid thermal runaway:
            </p>
            <ol>
              <li>Check the maximum pour depth on your product&apos;s label or data sheet; it varies a lot between coating resins and deep-pour casting resins.</li>
              <li>Divide your total casting depth by this maximum rating to find the required number of pours. For example, a 1.75-inch river slab poured with resin rated for 0.5 inches per layer requires 4 separate pours.</li>
              <li>Wait between layers as long as the data sheet says (it gives the recoat window), so heat doesn&apos;t build up and the layers bond.</li>
            </ol>
            <p>
              For complete multi-step river table planning, explore our dedicated <Link href="/epoxy-table-calculator/">Epoxy River Table Calculator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Casting Resin in Silicone Molds</h2>
            <p>
              When casting jewelry, dice, coasters, or turners in silicone molds, measuring exact cavity volumes prevents over-pouring and messy mold cleanups.
            </p>
            <p>
              For cylindrical shapes, volume equals <code>π × r² × h</code>. For rectangular casting boxes, volume is <code>length × width × depth</code>. For complex geometric molds (such as polyhedral dice or faceted figurines), use the <strong>water displacement method</strong>: tare the empty mold on a digital scale, fill it with water to the brim, and record the mass in grams. Because 1 gram of water equals exactly 1 mL (1 cm³), the mass in grams directly gives your mold volume in milliliters. Ensure the mold is bone-dry before pouring resin, as moisture inhibits amine hardeners.
            </p>
            <p>
              If you also work with resin 3D printers, you can calculate combined photopolymer resin costs and machine wear with our <Link href="/3d-print-cost-calculator/">3D Print Cost Calculator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Many Epoxy Kits Should You Buy?</h2>
            <p>
              Epoxy is packaged in paired sets (Resin + Hardener) in standard retail capacities:
            </p>
            <ul>
              <li><strong>16 fl oz Kit (1 Pint):</strong> 8 oz A + 8 oz B (ideal for small tumblers, jewelry, and seal coats).</li>
              <li><strong>32 fl oz Kit (1 Quart):</strong> 16 oz A + 16 oz B (covers ~3.2 sq ft at 1/8 in).</li>
              <li><strong>1/2 Gallon Kit (64 fl oz):</strong> 32 oz A + 32 oz B (covers ~6.4 sq ft at 1/8 in).</li>
              <li><strong>1 Gallon Kit (128 fl oz):</strong> 64 oz A + 64 oz B (covers ~12.8 sq ft at 1/8 in).</li>
              <li><strong>1.5 Gallon Kit:</strong> 1 gal A + 0.5 gal B (how some 2:1 products are packaged).</li>
              <li><strong>2 Gallon / 3 Gallon / 5 Gallon Kits:</strong> Bulk contractor buckets for river tables and bar installations.</li>
            </ul>
            <p>
              Our Kit Planner automatically analyzes your total project volume with waste allowances and suggests the most economical combination of standard kits to minimize unused resin.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What Is Epoxy Resin and How Does It Cure?</h2>
            <p>
              Epoxy resin is a two-component thermosetting copolymer formed by mixing an epoxide resin base (most commonly synthesized from bisphenol-A and epichlorohydrin) with a polyamine curing agent. Unlike solvent-based finishes that dry as the solvent evaporates, epoxy hardens by a chemical reaction between the two parts, which is why the mix ratio matters so much.
            </p>
            <p>
              The curing process progresses through three distinct physical stages:
            </p>
            <ul>
              <li><strong>Liquid Working Time (Pot Life):</strong> The window during which the mixed resin remains fluid and can be poured, spread, and degassed. The data sheet calls this working time or pot life.</li>
              <li><strong>Gel State:</strong> The cross-linking reaction advances to a soft, rubbery state. Do not disturb or torch the resin during this stage. Subsequent coats can be poured onto tacky gel without sanding.</li>
              <li><strong>Solid Cure:</strong> The epoxy becomes hard enough to handle, then keeps hardening until it reaches full cure. Both times are on the data sheet and depend on temperature.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Using the Result: Mixing and Pouring Best Practices</h2>
            <p>
              To achieve a crystal-clear, bubble-free, and rock-hard finish on your woodworking project, these general tips help (your product&apos;s instructions come first):
            </p>
            <ul>
              <li><strong>Maintain Workshop Temperature:</strong> Work within the temperature range on your product label. Cold resin is thicker and holds more bubbles.</li>
              <li><strong>The Two-Cup Mixing Method:</strong> Mix for the time your product states, scraping the sides and bottom, then pour into a clean second cup and mix again. This ensures no unmixed, raw resin from the container walls ends up on your project.</li>
              <li><strong>Bubble Removal:</strong> Many makers use a quick pass of a heat gun or torch over the surface to pop bubbles; follow your product&apos;s guidance and never hold heat in one spot.</li>
              <li><strong>Substrate Surface Prep:</strong> Calculate total surface area using our <Link href="/square-footage-calculator/">Square Footage Calculator</Link> to ensure adequate material planning. For painting projects, compare finishes with our <Link href="/paint-cost-calculator/">Paint Gallon Calculator</Link>.</li>
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

        <HowWeCalculate slug="epoxy-resin-calculator" />
      </div>

      <JsonLd data={buildWebApplicationSchema({ name: route.title, path: route.path, description: route.description })} />
      <JsonLd data={buildFaqSchema(faqs)} />
    </main>
  );
}
