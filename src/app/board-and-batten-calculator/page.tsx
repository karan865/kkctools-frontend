import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import BoardBattenCalculator from '@/components/tool/board-batten-calculator';
import { EdgeModesDiagram, NominalDiagram, SidingDiagram, WallLayoutDiagram } from '@/components/tool/board-batten-calculator/BattenDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  MM_PER_IN,
  NOMINAL_BOARDS,
  calculateAccent,
  calculateSiding,
  countForGap,
  defaultAccent,
  formatFraction,
  gapForCount,
  type AccentInput,
} from '@/lib/board-batten-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.boardAndBattenCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- every number below is computed by the same engine as the tool ----------
const fr = (v: number) => formatFraction(v);
const n = (v: number, dp = 0) => v.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
const acc = (over: Partial<AccentInput> = {}) => calculateAccent(defaultAccent(over));

const ex = acc(); // 12 ft × 8 ft wall, 1×4 battens, ~16 in target, top rail 1×4
const exNone = acc({ edge: 'none' });
const exCount7 = acc({ mode: 'count', count: 7 });
const exHalf = acc({ wallHeight: 60, topRail: 3.5, baseboard: 5.5, baseExisting: true, battenWidth: 2.5, targetGap: 12, railRows: 0 });
const exGrid = acc({ railRows: 2, battenWidth: 2.5, targetGap: 18 });
const exShopping = acc({ mode: 'count', count: 8 });
const metricWall = { wallWidth: 3600 / MM_PER_IN, battenWidth: 89 / MM_PER_IN, edge: 'both' as const, inset: 0 };

const widthRows = [96, 120, 144, 168, 192].map((W) => {
  const s = { wallWidth: W, battenWidth: 3.5, edge: 'both' as const, inset: 0 };
  return [12, 16, 20].map((t) => {
    const c = countForGap(s, t);
    return { W, t, c, g: gapForCount(s, c) };
  });
});
const metricRows = [2400, 3000, 3600, 4200].map((mm) => {
  const s = { wallWidth: mm / MM_PER_IN, battenWidth: 89 / MM_PER_IN, edge: 'both' as const, inset: 0 };
  return [300, 400, 500].map((t) => {
    const c = countForGap(s, t / MM_PER_IN);
    return { mm, t, c, g: gapForCount(s, c) * MM_PER_IN };
  });
});
const mCount = countForGap(metricWall, 400 / MM_PER_IN);
const mGap = gapForCount(metricWall, mCount) * MM_PER_IN;

const siding = calculateSiding({
  wallWidth: 240,
  wallHeight: 96,
  boardWidth: 11.25,
  boardGap: 0.5,
  battenWidth: 2.5,
  battensAtEnds: false,
  openingsArea: 36 * 48,
  furringSpacing: 24,
  stockLength: 96,
  wastePercent: 10,
});

// ---------- FAQ ----------
const faqs = [
  {
    q: 'How do you calculate board and batten spacing?',
    a: `Subtract the total width of all the battens from the wall width, then divide by the number of gaps. With a batten at both ends there is one gap fewer than battens. A 12 ft (144 in) wall with 8 battens 3½ in wide: (144 − 8 × 3½) ÷ 7 = ${fr(ex.gap)} per gap.`,
  },
  {
    q: 'How far apart should board and batten be?',
    a: 'There is no rule — it is a style choice. Gaps of roughly 12–24 in are common on accent walls: narrower gaps look busier and more traditional, wider gaps look calmer and more modern. Use the comparison table in the calculator to see a few counts side by side, and choose the one that looks right for your wall.',
  },
  {
    q: 'How many battens do I need?',
    a: `Pick a gap you like and the calculator finds the nearest count that spaces evenly. For a 12 ft wall with 1×4 battens and a 16 in target, that is ${ex.count} battens with ${fr(ex.gap)} gaps.`,
  },
  {
    q: 'What size boards are used for board and batten?',
    a: 'Interior accent walls usually use 1×3 or 1×4 boards (2½ or 3½ in actual) or MDF strips of a similar width; 1×2 suits small walls and fine grids. Exterior siding uses wide 1×8 to 1×12 boards with 1×2 to 1×3 battens over the joints.',
  },
  {
    q: 'Why is a 1×4 only 3½ inches wide?',
    a: 'Lumber is named by its rough size before it is dried and planed. Under the American Softwood Lumber Standard, a nominal 1-inch board is ¾ in thick, and 2–7 in nominal widths lose ½ in (a 1×4 is 3½ in); 8 in and wider lose ¾ in (a 1×8 is 7¼ in).',
  },
  {
    q: 'Should the end battens touch the corners of the wall?',
    a: `Usually yes — a batten at each end frames the wall and hides uneven corners. If you prefer an equal gap at the corners too, choose “Gaps at both edges”: on the same 12 ft wall that gives ${exNone.count} battens with ${fr(exNone.gap)} gaps.`,
  },
  {
    q: 'Do I measure to the edge or the center of each batten?',
    a: 'Either works if you are consistent. The calculator gives the left-edge mark for every batten (and its center). An easier way: cut a spacer block exactly the width of the gap and use it to set each batten against the last one.',
  },
  {
    q: 'Do I need plywood behind board and batten?',
    a: 'Not on a smooth drywall wall — battens can be glued and nailed straight on, into studs where possible. Some people add a thin panel behind for a smoother look or when the wall is damaged. Exterior siding is a different system: follow the siding maker’s instructions for sheathing, barrier and furring.',
  },
  {
    q: 'Is board and batten the same as wainscoting?',
    a: 'They are related. Wainscoting is any paneling on the lower part of a wall; board and batten is one style of it, made with vertical battens (often with a top rail). Board and batten can also run floor to ceiling, and as exterior siding.',
  },
  {
    q: 'How do I handle outlets and switches?',
    a: 'Mark them in the calculator to see if a batten lands on one — moving one batten more or fewer often solves it. If a batten must cross an outlet, notch it and fit a box extender so the outlet sits flush with the new surface.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Board and Batten Calculator',
  path: route.path,
  description:
    'Free board and batten calculator. Equal batten spacing in inches with fractions or millimetres, layout marks, grid rails, outlet clashes and a lumber shopping list for accent walls — plus an exterior siding mode.',
});
const faqSchema = buildFaqSchema(faqs);

export default function BoardAndBattenCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Tools', path: '/tools/' }, { name: 'Board and Batten Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Board and Batten Calculator: Batten Spacing &amp; Materials</h1>
          <p className={styles.lead}>
            This free <strong>board and batten calculator</strong> spaces your battens evenly across any wall and shows the result on a drawing to
            scale. Enter the wall size and batten width, then either pick a gap you like or the number of battens you want — you get the exact gap
            to the nearest 1/16 in (or mm), a mark for every batten, a table of other counts to compare, and a shopping list of boards, nails,
            adhesive, caulk and paint. There is an exterior siding mode too.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Board and batten calculator tool">
          <BoardBattenCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="board-and-batten-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use the board and batten calculator</h2>
          <ol>
            <li>
              <strong>Measure the wall</strong> — width corner to corner and height floor to ceiling (or to the top of a half-wall). Inches with
              fractions, feet like <code>12&apos;</code>, or millimetres all work.
            </li>
            <li>
              <strong>Pick the batten width.</strong> Tap a lumber size or type what your tape says — MDF strips are often not a standard size.
            </li>
            <li>
              <strong>Choose a gap or a count.</strong> Give a rough gap and the tool picks the nearest even layout, or set the exact number of
              battens.
            </li>
            <li>
              <strong>Add a top rail, baseboard or grid rows</strong>, and mark outlets or windows to check that no batten lands on them.
            </li>
            <li>
              <strong>Compare counts, copy the marks and buy from the shopping list.</strong> Print the layout to take to the store.
            </li>
          </ol>

          <h2>Board and batten spacing formula</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <WallLayoutDiagram
                wallWidth={144}
                wallHeight={96}
                battenWidth={3.5}
                positions={ex.positions}
                topRail={3.5}
                gapLabel={fr(ex.gap)}
                widthLabel={'144" (12 ft)'}
              />
              <figcaption>
                A 12 ft wall with {ex.count} 1×4 battens and a 1×4 top rail: every gap is {fr(ex.gap)}.
              </figcaption>
            </figure>
            <div>
              <p>Equal spacing comes down to one idea: whatever wall is not covered by battens is shared equally between the gaps.</p>
              <code className={styles.formula}>
                Gap = (wall width − battens × batten width) ÷ number of gaps
                <br />
                Battens at both ends: gaps = battens − 1
                <br />
                Gaps at both ends: gaps = battens + 1
              </code>
              <p>
                <strong>Worked example:</strong> a 144 in wall with 1×4 battens (3½ in actual) and a target gap of about 16 in. The nearest even
                layout is {ex.count} battens: 144 − {ex.count} × 3½ = {n(144 - ex.count * 3.5, 1)} in of open wall, ÷ {ex.count - 1} gaps ={' '}
                <strong>{fr(ex.gap)}</strong> ({n(ex.gap, 3)} in). On center that is {fr(ex.onCenter)}. With 7 battens instead, the gap grows to{' '}
                {fr(exCount7.gap)}.
              </p>
            </div>
          </div>
          <h3>Where the layout starts</h3>
          <figure className={styles.figureBox}>
            <EdgeModesDiagram />
            <figcaption>Battens at the corners is the usual choice; gaps at the corners or a set margin are options in the calculator.</figcaption>
          </figure>

          <h2>How far apart should battens be?</h2>
          <p>
            Spacing is a matter of taste, not a building rule. Many accent walls land between about 12 and 24 in between battens. Closer spacing
            reads as busier and more traditional; wider spacing is calmer and more modern, and uses less lumber. Tall walls and big rooms can carry
            wider gaps. The fastest way to decide is to try a few counts — the calculator’s comparison table and drawing update instantly.
          </p>
          <h3>Spacing for common wall widths (1×4 battens at both ends)</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Wall width</th>
                  <th scope="col">Aim ~12 in</th>
                  <th scope="col">Aim ~16 in</th>
                  <th scope="col">Aim ~20 in</th>
                </tr>
              </thead>
              <tbody>
                {widthRows.map((row) => (
                  <tr key={row[0].W}>
                    <td>
                      {row[0].W / 12} ft ({row[0].W} in)
                    </td>
                    {row.map((c) => (
                      <td key={c.t}>
                        {c.c} battens · {fr(c.g)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>Metric walls (89 mm battens at both ends)</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Wall width</th>
                  <th scope="col">Aim ~300 mm</th>
                  <th scope="col">Aim ~400 mm</th>
                  <th scope="col">Aim ~500 mm</th>
                </tr>
              </thead>
              <tbody>
                {metricRows.map((row) => (
                  <tr key={row[0].mm}>
                    <td>{n(row[0].mm)} mm</td>
                    {row.map((c) => (
                      <td key={c.t}>
                        {c.c} battens · {n(c.g)} mm
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>
            Example: a 3.6 m wall with 89 mm battens aiming for 400 mm gets {mCount} battens and {n(mGap, 1)} mm gaps.
          </p>

          <h2>Lumber sizes: nominal vs actual</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <NominalDiagram />
              <figcaption>A “1×4” is named for its rough size; after drying and planing it is ¾ × 3½ in.</figcaption>
            </figure>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Nominal</th>
                    <th scope="col">Actual width</th>
                    <th scope="col">In mm</th>
                  </tr>
                </thead>
                <tbody>
                  {NOMINAL_BOARDS.map((b) => (
                    <tr key={b.id}>
                      <td>{b.label}</td>
                      <td>{fr(b.actualWidthIn)}</td>
                      <td>{n(b.actualWidthIn * MM_PER_IN)} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p>
            Always enter the width you measure. Primed MDF strips, ripped plywood and metric timber rarely match these sizes exactly, and a ⅛ in
            difference adds up across ten battens.
          </p>

          <h2>Half walls, top rails and grid patterns</h2>
          <div className={styles.figGrid}>
            <figure className={styles.figureBox}>
              <WallLayoutDiagram wallWidth={144} wallHeight={60} battenWidth={2.5} positions={exHalf.positions} topRail={3.5} baseboard={5.5} gapLabel={fr(exHalf.gap)} widthLabel={'144"'} />
              <figcaption>
                Half wall, 60 in tall: 1×3 battens between a 1×4 top rail and the existing baseboard — {exHalf.count} battens, {fr(exHalf.gap)} gaps,
                each {fr(exHalf.battenLength)} long.
              </figcaption>
            </figure>
            <figure className={styles.figureBox}>
              <WallLayoutDiagram wallWidth={144} wallHeight={96} battenWidth={2.5} positions={exGrid.positions} topRail={3.5} railRows={2} railWidth={2.5} gapLabel={fr(exGrid.gap)} widthLabel={'144"'} />
              <figcaption>
                Grid: 2 rows of horizontal rails split the height into {fr(exGrid.rowGap)} panels — {exGrid.pieces.find((p) => p.label === 'Grid rails')?.qty} short rails
                at {fr(exGrid.gap)}.
              </figcaption>
            </figure>
          </div>
          <p>
            A top rail caps the battens and gives the wall a finished line; on a half wall it is often set around a third to half of the wall height.
            Grid rails turn the battens into squares or rectangles — the calculator spaces the rows evenly and counts every short rail for the cut list.
          </p>

          <h2>What to buy for an accent wall</h2>
          <p>
            For a 12 × 8 ft wall with 8 1×4 battens and a top rail, keeping the existing baseboard, the calculator’s shopping list is:
          </p>
          <ul>
            {exShopping.pieces.map((p) => (
              <li key={p.label}>
                {p.label}: {p.qty} × {fr(p.length)}
              </li>
            ))}
            <li>
              <strong>{exShopping.boards} boards of 8 ft</strong> ({n(exShopping.linearFeet, 1)} linear ft with 10% waste)
            </li>
            <li>
              {n(exShopping.nails)} brad nails, {exShopping.adhesiveTubes} tubes of construction adhesive, {exShopping.caulkTubes} tubes of caulk
            </li>
            <li>
              {n(exShopping.paintGallons, 1)} gallons of paint for 2 coats over {n(exShopping.paintSqFt)} sq ft (wall plus board edges)
            </li>
          </ul>

          <h2>Installation tips</h2>
          <ul>
            <li>
              <strong>Find the studs</strong> and mark them; nail into them where you can and use construction adhesive everywhere else.
            </li>
            <li>
              <strong>Check for level, not the ceiling.</strong> Ceilings and floors are rarely straight — set the top rail level and scribe if needed.
            </li>
            <li>
              <strong>Use a spacer block</strong> cut to the gap. It is faster and more accurate than measuring every batten.
            </li>
            <li>
              <strong>Plan outlets first.</strong> Shift the layout by one batten, or notch around and add a box extender.
            </li>
            <li>
              <strong>Fill, caulk, then paint.</strong> Fill nail holes, caulk every seam where wood meets wall, and paint the wall and boards the
              same color for the classic look.
            </li>
          </ul>

          <h2>Board and batten vs wainscoting vs shiplap</h2>
          <p>
            <strong>Board and batten</strong> uses vertical battens over a flat wall (or over wide boards outside). <strong>Wainscoting</strong> is
            paneling on the lower part of a wall — board and batten is one style of it, raised panels and beadboard are others.{' '}
            <strong>Shiplap</strong> is horizontal boards that overlap at the edges, covering the whole wall, so it takes far more lumber than battens.
          </p>

          <h2>Exterior board and batten siding</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <SidingDiagram />
              <figcaption>Wide boards with a small gap, a batten over every gap, and furring strips behind.</figcaption>
            </figure>
            <div>
              <p>
                Outside, board and batten is a siding system: wide vertical boards (often 1×10 or 1×12) with a small gap between them, and a narrow
                batten nailed over each gap. Vertical boards need something to nail into across the studs, which is why horizontal furring strips
                are common.
              </p>
              <p>
                <strong>Example:</strong> a 20 × 8 ft wall with one 36 × 48 in window, 1×12 boards with ½ in gaps and 1×3 battens needs{' '}
                {siding.boards} boards across and {siding.battens} battens — {n(siding.boardLinearFt)} linear ft of boards, {n(siding.battenLinearFt)}{' '}
                of battens and {n(siding.furringLinearFt)} of furring with 10% waste. Switch the calculator to <em>Exterior siding</em> for your wall.
                Follow the siding maker’s instructions for barriers, flashing and fasteners.
              </p>
            </div>
          </div>

          <h2>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {faqs.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>

          <HowWeCalculate slug="board-and-batten-calculator" />

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/linear-foot-calculator/">
                Linear Foot Calculator<span>Convert boards and trim to linear feet</span>
              </Link>
            </li>
            <li>
              <Link href="/stud-calculator/">
                Stud Calculator<span>Studs behind the wall</span>
              </Link>
            </li>
            <li>
              <Link href="/paint-cost-calculator/">
                Paint Cost Calculator<span>Gallons and cost for the finish</span>
              </Link>
            </li>
            <li>
              <Link href="/drywall-calculator/">
                Drywall Calculator<span>Sheets and mud for new walls</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Wall and room areas</span>
              </Link>
            </li>
            <li>
              <Link href="/fence-stain-calculator/">
                Fence Stain Calculator<span>Stain for outdoor wood</span>
              </Link>
            </li>
          </ul>

          <p className={styles.note}>
            Layouts and quantities are planning estimates. Measure your wall and boards before cutting, and follow product instructions and local
            code for exterior siding.
          </p>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="board-and-batten-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
