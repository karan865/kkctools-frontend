import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import DrywallCalculator from '@/components/tool/drywall-calculator';
import {
  JointFinishDiagram,
  SheetLayoutDiagram,
  SheetSizesDiagram,
  SurfaceDiagram,
} from '@/components/tool/drywall-calculator/DrywallDiagram';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  BOARDS,
  COMPOUND_GAL_PER_SQFT,
  M2_PER_FT2,
  M_PER_FT,
  M_PER_IN,
  PAIL_GAL,
  SHEETS,
  TAPE_FT_PER_SQFT,
  calculateDrywall,
  defaultScrewSpacingM,
  defaultSurface,
  framingSpacingM,
  kgToLb,
  m2ToFt2,
  mToFt,
  screwsPerSheet,
  sheetAreaM2,
  sheetById,
  type DrywallInput,
  type SurfaceItem,
} from '@/lib/drywall-engine';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.drywallCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

// ---------- numbers used in the article: all computed by the same engine as the tool ----------
const ft = (v: number) => v * M_PER_FT;
const inch = (v: number) => v * M_PER_IN;
const n = (v: number, max = 0) => v.toLocaleString('en-US', { maximumFractionDigits: max });

function room(l: number, w: number, h: number, opts: { doors?: number; windows?: number; ceiling?: boolean } = {}): SurfaceItem {
  const base = defaultSurface('room', `r${l}x${w}`);
  return {
    ...base,
    length: ft(l),
    width: ft(w),
    height: ft(h),
    includeCeiling: opts.ceiling ?? true,
    doors: { ...base.doors, count: opts.doors ?? 0 },
    windows: { ...base.windows, count: opts.windows ?? 0 },
  };
}

function job(items: SurfaceItem[], over: Partial<DrywallInput> = {}) {
  return calculateDrywall({
    items,
    sheetId: 'ft4x8',
    wastePercent: 10,
    framingM: framingSpacingM('narrow', 'imperial'),
    wallScrewSpacingM: defaultScrewSpacingM('wall', 'narrow', 'imperial'),
    ceilingScrewSpacingM: defaultScrewSpacingM('ceiling', 'narrow', 'imperial'),
    tapeRollM: ft(250),
    cornerBeadM: 0,
    beadPieceM: ft(8),
    boardLbPerSqFt: 1.6,
    ...over,
  });
}

const sqft = (m2: number) => n(m2ToFt2(m2));
const bySize = (r: ReturnType<typeof job>, id: string) => r.sheetsBySize.find((s) => s.id === id)?.sheets ?? 0;

// Worked examples
const exBed = job([room(12, 12, 8, { doors: 1, windows: 1 })]);
const exBath = job([room(8, 10, 8, { doors: 1 })]);
const exLiving = job([room(16, 20, 9, { doors: 1, windows: 2, ceiling: false })]);
const exLiving49 = job([room(16, 20, 9, { doors: 1, windows: 2, ceiling: false })], { sheetId: 'ft4x9' });
const exGarage = job([room(12, 22, 10, { doors: 1 })], { sheetId: 'ft4x12', boardLbPerSqFt: 2.2 });
const metricRoom: SurfaceItem = {
  ...defaultSurface('room', 'metric'),
  length: 4,
  width: 3,
  height: 2.4,
  doors: { count: 1, width: 0.9, height: 2.1 },
  windows: { count: 0, width: 1.2, height: 1.2 },
};
const exMetric = job([metricRoom], {
  sheetId: 'mm1200x2400',
  framingM: framingSpacingM('narrow', 'metric'),
  wallScrewSpacingM: defaultScrewSpacingM('wall', 'narrow', 'metric'),
  ceilingScrewSpacingM: defaultScrewSpacingM('ceiling', 'narrow', 'metric'),
});

// 12×12 without openings — the most searched example
const bed12WallsOnly = job([room(12, 12, 8, { ceiling: false })]);
const bed12WithCeiling = job([room(12, 12, 8)]);

// Common rooms table (8 ft walls, no openings, 10% extra)
const roomSizes: [number, number][] = [[10, 10], [10, 12], [12, 12], [12, 14], [14, 16], [16, 20]];
const roomRows = roomSizes.map(([l, w]) => {
  const wallsOnly = job([room(l, w, 8, { ceiling: false })]);
  const full = job([room(l, w, 8)]);
  return { l, w, wallsOnly: wallsOnly.sheets, full4x8: full.sheets, full4x12: bySize(full, 'ft4x12'), area: m2ToFt2(full.netM2) };
});

// Sheet size table
const sheetRows = SHEETS.map((s) => {
  const area = sheetAreaM2(s);
  return {
    id: s.id,
    label: s.label,
    metric: s.system === 'metric',
    areaText: s.system === 'metric' ? `${n(area, 2)} m²` : `${n(m2ToFt2(area))} sq ft`,
    perUnit: s.system === 'metric' ? Math.ceil(100 / area - 1e-9) : Math.ceil(1000 / m2ToFt2(area) - 1e-9),
    weights: BOARDS.map((b) => (s.system === 'metric' ? `${n(b.lbPerSqFt * m2ToFt2(area) * 0.45359237, 1)} kg` : `${n(b.lbPerSqFt * m2ToFt2(area))} lb`)),
  };
});

// Screws per sheet table
const s48 = sheetById('ft4x8');
const s412 = sheetById('ft4x12');
const screwTable = [s48, s412].map((s) => ({
  label: s.label,
  wall16: screwsPerSheet(s, inch(16), inch(16)),
  wall24: screwsPerSheet(s, inch(24), inch(12)),
  ceil16: screwsPerSheet(s, inch(16), inch(12)),
  ceil24: screwsPerSheet(s, inch(24), inch(12)),
}));
const wallScrewsPer1000 = Math.round((screwTable[0].wall16 / 32) * 1000);
const ceilScrewsPer1000 = Math.round((screwTable[0].ceil16 / 32) * 1000);

const weight48 = (id: string) => n(BOARDS.find((b) => b.id === id)!.lbPerSqFt * 32);
const sqftPerPail = n(PAIL_GAL / COMPOUND_GAL_PER_SQFT);

// ---------- FAQ (answers built from the engine numbers above) ----------
const faqs = [
  {
    q: 'How many sheets of drywall do I need for a 12×12 room?',
    a: `With 8 ft walls and 10% extra, a 12×12 room needs ${bed12WallsOnly.sheets} sheets of 4×8 drywall for the walls only, or ${bed12WithCeiling.sheets} sheets if you also cover the ceiling. Subtracting one standard door and one window brings the walls-and-ceiling figure to ${exBed.sheets} sheets. With 4×12 sheets the same room needs ${bySize(exBed, 'ft4x12')}.`,
  },
  {
    q: 'How do I calculate drywall square footage?',
    a: 'Add the walls and the ceiling. Wall area = 2 × (length + width) × wall height; ceiling area = length × width. Then subtract doors and windows. A 12×12 room with 8 ft walls has 384 sq ft of walls and 144 sq ft of ceiling — 528 sq ft before openings.',
  },
  {
    q: 'How many square feet does a sheet of drywall cover?',
    a: 'Multiply the sheet’s width by its length: a 4×8 sheet covers 32 sq ft, 4×9 covers 36, 4×10 covers 40, 4×12 covers 48 and 4×16 covers 64 sq ft. A metric 1200×2400 mm board covers 2.88 m².',
  },
  {
    q: 'How much joint compound do I need?',
    a: `USG lists its Sheetrock All Purpose joint compound at about 10 gallons per 1,000 sq ft of board for the usual three coats, so one 4.5 gallon pail covers roughly ${sqftPerPail} sq ft. A 12×12 bedroom with a ceiling, one door and one window needs about ${n(exBed.compoundGal, 1)} gallons with 10% extra — ${exBed.pails} pails.`,
  },
  {
    q: 'How much drywall tape do I need?',
    a: `Georgia-Pacific puts typical use at about 350 linear feet of paper tape per 1,000 sq ft of board. The same 12×12 bedroom needs about ${n(mToFt(exBed.tapeM))} ft with 10% extra, so one 250 ft roll is enough.`,
  },
  {
    q: 'How many screws per sheet of drywall?',
    a: `On studs 16 in on center with screws every 16 in, a 4×8 sheet hung across the studs takes ${screwTable[0].wall16} screws on a wall. On a ceiling, where screws go every 12 in, it takes ${screwTable[0].ceil16}. That works out to roughly ${n(wallScrewsPer1000)} screws per 1,000 sq ft of walls and ${n(ceilScrewsPer1000)} per 1,000 sq ft of ceilings.`,
  },
  {
    q: 'Should I subtract doors and windows from my drywall estimate?',
    a: 'Yes — subtract them to get the true area to cover. A standard 36 × 80 in door is 20 sq ft and a 36 × 48 in window is 12 sq ft. Keep your waste allowance, though: the pieces you cut out around openings are often too small to reuse.',
  },
  {
    q: 'How much extra drywall should I buy?',
    a: 'Georgia-Pacific recommends allowing 10% to 15% extra for cutting and piecing. Use the top of that range — or more — for rooms with many corners, short walls, angled ceilings or lots of openings.',
  },
  {
    q: 'Should drywall be hung horizontally or vertically?',
    a: 'Ceiling boards go across (perpendicular to) the joists. On walls, Georgia-Pacific’s installation guide allows boards to be hung either horizontally or vertically. Hang the ceiling before the walls, and use longer sheets where you can to avoid end joints.',
  },
  {
    q: 'Should I use ½ inch or ⅝ inch drywall?',
    a: '½ in board is the normal choice for walls and ceilings in homes. ⅝ in fire-rated (Type X) board is used where codes call for extra fire resistance — for example the US residential code requires it on the ceiling of a garage that has living space above — and it also resists sagging better on ceilings. Check what your local code requires.',
  },
  {
    q: 'How heavy is a sheet of drywall?',
    a: `Using USG’s nominal weights, a 4×8 sheet weighs about ${weight48('regular12')} lb in regular ½ in board, ${weight48('light12')} lb in lightweight ½ in board and ${weight48('typeX58')} lb in ⅝ in Type X. Weight goes up in proportion to the sheet size.`,
  },
  {
    q: 'Is Sheetrock the same as drywall or plasterboard?',
    a: 'Mostly, yes. Drywall is the general US name for gypsum wallboard; Sheetrock is USG’s brand name for its gypsum panels, often used as a generic word; plasterboard is the name used in the UK, Ireland and Australia, where boards are usually sold in metric sizes such as 1200 × 2400 mm. The calculator handles all of them.',
  },
];

const webAppSchema = buildWebApplicationSchema({
  name: 'Drywall Calculator',
  path: route.path,
  description:
    'Free drywall (sheetrock) calculator for whole rooms, single walls, ceilings, gable ends and known areas. Subtracts doors and windows and estimates sheets, joint compound, tape, screws, corner bead, weight and cost in US or metric units.',
});
const faqSchema = buildFaqSchema(faqs);

export default function DrywallCalculatorPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, faqSchema]} />
      <main id="main-content" className={styles.main}>
        <Breadcrumbs items={[{ name: 'Calculators', path: '/tools/' }, { name: 'Drywall Calculator', path: route.path }]} />

        <header className={styles.header}>
          <h1 className={styles.h1}>Drywall Calculator: Sheets, Joint Compound, Tape &amp; Screws</h1>
          <p className={styles.lead}>
            This free <strong>drywall calculator</strong> — it works just as well as a <strong>sheetrock calculator</strong> or a
            plasterboard calculator — tells you how many sheets to buy for a whole room, a single wall, a ceiling or a gable end. Add every
            room in your project, take out doors and windows, and it also works out joint compound, paper tape, screws, corner bead, the weight
            you will be hauling and, if you add prices, the cost.
          </p>
          <p className={styles.meta}>
            Last updated: {new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ·
            Runs in your browser — nothing you enter is sent anywhere.
          </p>
        </header>

        <section aria-label="Drywall calculator tool">
          <DrywallCalculator />
        </section>

        <div className={styles.adBlock}>
          <AdSlot slotId="drywall-calculator-middle" />
        </div>

        <article className={styles.article}>
          <h2>How to use this drywall calculator</h2>
          <ol>
            <li>
              <strong>Pick feet and inches or metres.</strong> Switching later converts what you have already typed.
            </li>
            <li>
              <strong>Describe what you are covering.</strong> Choose <em>Room</em> for four walls plus an optional ceiling, or <em>Wall</em>,{' '}
              <em>Ceiling</em>, <em>Gable</em> or <em>Area</em> for odd jobs. The diagram shows exactly which measurement goes in which box.
            </li>
            <li>
              <strong>Take out doors and windows.</strong> Change their size if yours are not standard.
            </li>
            <li>
              <strong>Add every other room.</strong> A bedroom, a bathroom ceiling and a garage wall can all go in one estimate.
            </li>
            <li>
              <strong>Choose a sheet size and your stud spacing,</strong> then read the sheets, compound, tape and screws on the right. Tap
              any sheet size in the results to compare.
            </li>
          </ol>

          <h2>How to measure walls and ceilings for drywall</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <SurfaceDiagram kind="room" doors={1} windows={1} />
              <figcaption>Measure the room’s length (L), width (W) and wall height (H).</figcaption>
            </figure>
            <div>
              <p>
                Measure each wall from corner to corner and the wall height from floor to ceiling. Round up to the next inch — a little extra
                is easier to deal with than a gap. Then work out the area:
              </p>
              <code className={styles.formula}>
                Walls = 2 × (L + W) × H
                <br />
                Ceiling = L × W
                <br />
                Area to cover = walls + ceiling − doors − windows
              </code>
              <p>
                A 12×12 ft room with 8 ft walls has 384 sq ft of walls and 144 sq ft of ceiling. Take off one door (20 sq ft) and one window
                (12 sq ft) and there are {sqft(exBed.netM2)} sq ft to cover.
              </p>
            </div>
          </div>
          <div className={styles.figGrid}>
            <figure className={styles.figureBox}>
              <SurfaceDiagram kind="ceiling" />
              <figcaption>Ceilings: length × width. Sheets run across the joists.</figcaption>
            </figure>
            <figure className={styles.figureBox}>
              <SurfaceDiagram kind="gable" />
              <figcaption>Gable ends: base × rise ÷ 2, then add the wall below separately.</figcaption>
            </figure>
          </div>

          <h2>The drywall sheet formula</h2>
          <code className={styles.formula}>Sheets = (area to cover × (1 + extra %)) ÷ area of one sheet → round up</code>
          <p>
            For the 12×12 room above: {sqft(exBed.netM2)} sq ft × 1.10 = {sqft(exBed.orderM2)} sq ft, divided by 32 sq ft per 4×8 sheet,
            rounds up to <strong>{exBed.sheets} sheets</strong>. The calculator always rounds up, because you cannot buy part of a sheet.
          </p>

          <h2>Worked examples</h2>
          <p>All examples use 10% extra and 16 in stud spacing. They come from the same code that runs the calculator above.</p>
          <div className={styles.examples}>
            <div className={styles.exampleCard}>
              <h3>12×12 bedroom with ceiling</h3>
              <p className={styles.exampleMeta}>8 ft walls · 1 door · 1 window</p>
              <ul>
                <li>Area: {sqft(exBed.netM2)} sq ft</li>
                <li>
                  Sheets: <strong>{exBed.sheets} × 4×8</strong> or {bySize(exBed, 'ft4x12')} × 4×12
                </li>
                <li>
                  Compound: {n(exBed.compoundGal, 1)} gal ({exBed.pails} pails)
                </li>
                <li>
                  Tape: {n(mToFt(exBed.tapeM))} ft · Screws: {n(exBed.screws)}
                </li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>8×10 bathroom with ceiling</h3>
              <p className={styles.exampleMeta}>8 ft walls · 1 door</p>
              <ul>
                <li>Area: {sqft(exBath.netM2)} sq ft</li>
                <li>
                  Sheets: <strong>{exBath.sheets} × 4×8</strong>
                </li>
                <li>
                  Compound: {n(exBath.compoundGal, 1)} gal ({exBath.pails} pail{exBath.pails === 1 ? '' : 's'})
                </li>
                <li>
                  Tape: {n(mToFt(exBath.tapeM))} ft · Screws: {n(exBath.screws)}
                </li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>16×20 living room, walls only</h3>
              <p className={styles.exampleMeta}>9 ft walls · 1 door · 2 windows</p>
              <ul>
                <li>Area: {sqft(exLiving.netM2)} sq ft</li>
                <li>
                  Sheets: <strong>{bySize(exLiving, 'ft4x12')} × 4×12</strong> or {exLiving49.sheets} × 4×9
                </li>
                <li>4×9 sheets stood upright fit a 9 ft wall with no horizontal seam</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>12×22 garage with ceiling</h3>
              <p className={styles.exampleMeta}>10 ft walls · 1 door · ⅝ in Type X</p>
              <ul>
                <li>Area: {sqft(exGarage.netM2)} sq ft</li>
                <li>
                  Sheets: <strong>{exGarage.sheets} × 4×12</strong>
                </li>
                <li>Weight: about {n(kgToLb(exGarage.weightKg))} lb — plan more than one trip</li>
              </ul>
            </div>
            <div className={styles.exampleCard}>
              <h3>4 × 3 m room with ceiling</h3>
              <p className={styles.exampleMeta}>2.4 m walls · 1 door 0.9 × 2.1 m · metric</p>
              <ul>
                <li>Area: {n(exMetric.netM2, 1)} m²</li>
                <li>
                  Sheets: <strong>{exMetric.sheets} × 1200×2400 mm</strong>
                </li>
                <li>Compound: {n(exMetric.compoundL, 1)} litres</li>
              </ul>
            </div>
          </div>

          <h2>Drywall sheet sizes and coverage</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <SheetSizesDiagram />
              <figcaption>Common 4 ft wide sheets drawn to the same scale.</figcaption>
            </figure>
            <p>
              Almost all drywall is 4 ft wide; the length changes. Longer sheets cost more each but leave fewer joints to tape, which saves
              compound and finishing time. A good rule is to pick the length that matches your wall: 4×8 for 8 ft walls hung horizontally or
              stood upright, 4×9 for 9 ft walls, and 12 ft or longer sheets for long walls and ceilings. In the UK and other metric markets,
              plasterboard usually comes 1200 mm wide in 2400, 2700 and 3000 mm lengths.
            </p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Sheet</th>
                  <th scope="col">Covers</th>
                  <th scope="col">Sheets per 1,000 sq ft / 100 m²</th>
                  <th scope="col">Regular ½″</th>
                  <th scope="col">Lightweight ½″</th>
                  <th scope="col">Type X ⅝″</th>
                </tr>
              </thead>
              <tbody>
                {sheetRows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.label}</td>
                    <td>{r.areaText}</td>
                    <td>
                      {r.perUnit} {r.metric ? 'per 100 m²' : 'per 1,000 sq ft'}
                    </td>
                    {r.weights.map((w, i) => (
                      <td key={i}>{w}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Weights are per sheet, from USG’s nominal board weights; sheet counts have no waste added.</p>

          <h2>Sheets needed for common rooms</h2>
          <p>8 ft walls, no doors or windows taken off, 10% extra. Use the calculator for your exact room.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Room</th>
                  <th scope="col">Walls + ceiling area</th>
                  <th scope="col">4×8 sheets, walls only</th>
                  <th scope="col">4×8 sheets, walls + ceiling</th>
                  <th scope="col">4×12 sheets, walls + ceiling</th>
                </tr>
              </thead>
              <tbody>
                {roomRows.map((r) => (
                  <tr key={`${r.l}x${r.w}`}>
                    <td>
                      {r.l} × {r.w} ft
                    </td>
                    <td>{n(r.area)} sq ft</td>
                    <td>{r.wallsOnly}</td>
                    <td>{r.full4x8}</td>
                    <td>{r.full4x12}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>How many drywall screws you need</h2>
          <div className={styles.figGrid}>
            <figure className={styles.figureBox}>
              <SheetLayoutDiagram />
              <figcaption>Wall: 4×8 sheet across studs 16 in on center, screws every 16 in.</figcaption>
            </figure>
            <figure className={styles.figureBox}>
              <SheetLayoutDiagram ceiling screwLabel="12 in" />
              <figcaption>Ceiling: same sheet across joists, screws every 12 in.</figcaption>
            </figure>
          </div>
          <p>
            Hang each sheet across the framing, then drive a row of screws down every stud or joist it crosses, about ⅜ in in from the edges.
            The number of screws per sheet is simply the framing members it crosses times the screws along each one. The defaults follow the
            screw spacing in the US residential code (IRC Table R702.3.5): 12 in on ceilings, and on walls 16 in where studs are 16 in apart or
            12 in where they are 24 in apart. Board makers in other countries often ask for closer spacing — enter theirs in the calculator’s
            advanced settings.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Sheet</th>
                  <th scope="col">Wall, studs 16 in o.c.</th>
                  <th scope="col">Wall, studs 24 in o.c.</th>
                  <th scope="col">Ceiling, joists 16 in o.c.</th>
                  <th scope="col">Ceiling, joists 24 in o.c.</th>
                </tr>
              </thead>
              <tbody>
                {screwTable.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td>{r.wall16}</td>
                    <td>{r.wall24}</td>
                    <td>{r.ceil16}</td>
                    <td>{r.ceil24}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Joint compound and tape</h2>
          <div className={styles.split}>
            <figure className={styles.figureBox}>
              <JointFinishDiagram />
              <figcaption>A finished joint: tape bedded in the first coat, then two wider coats.</figcaption>
            </figure>
            <div>
              <p>
                Every seam, inside corner and screw head gets compound, and the usual finish is three coats: one to bed the paper tape, then a
                fill coat and a finish coat, each feathered out wider than the last. That is why compound is estimated per square foot of board
                rather than per joint.
              </p>
              <code className={styles.formula}>
                Compound ≈ {COMPOUND_GAL_PER_SQFT * 1000} gal per 1,000 sq ft
                <br />
                Tape ≈ {TAPE_FT_PER_SQFT * 1000} ft per 1,000 sq ft
              </code>
            </div>
          </div>
          <p>
            The compound rate comes from USG’s data sheet for its Sheetrock All Purpose joint compound; Georgia-Pacific gives a similar figure
            of two 61 lb pails per 1,000 sq ft for its ready-mix. The tape rate is Georgia-Pacific’s typical usage figure. A smooth “Level 5”
            finish adds a thin skim coat over the whole surface and needs extra compound on top of these numbers. Setting-type powder
            compounds are mixed from bags, so check the coverage printed on the bag.
          </p>

          <h2>How much extra to allow</h2>
          <ul>
            <li>
              <strong>10%</strong> — simple rectangular rooms with few openings. This is the calculator’s default.
            </li>
            <li>
              <strong>15%</strong> — rooms with several doors and windows, closets, or lots of short walls.
            </li>
            <li>
              <strong>20% or more</strong> — angled ceilings, stairwells, dormers and first-time jobs.
            </li>
          </ul>
          <p>
            Georgia-Pacific recommends 10–15% for cutting and piecing. A spare sheet or two also covers a cracked corner or a mis-cut, and it
            is cheaper than a second trip to the store.
          </p>

          <h2>Drywall, sheetrock or plasterboard?</h2>
          <p>
            They are names for the same kind of product: a gypsum core between two paper faces. <em>Drywall</em> is the common US term,{' '}
            <em>Sheetrock</em> is USG’s brand name that many people use for any board, and <em>plasterboard</em> is used in the UK, Ireland and
            Australia. US boards are sold in feet (4×8 and up); metric boards are usually 1200 mm wide. Pick metric units in the calculator to
            get 1200×2400, 1200×2700 and 1200×3000 mm sheets.
          </p>

          <h2>Common drywall estimating mistakes</h2>
          <ul>
            <li>
              <strong>Forgetting the ceiling.</strong> In a 12×12 bedroom with 8 ft walls the ceiling adds 144 sq ft — more than a third on top
              of the walls.
            </li>
            <li>
              <strong>Not subtracting openings — or keeping no extra.</strong> Do both: subtract doors and windows, then add 10–15%.
            </li>
            <li>
              <strong>Ignoring sheet length.</strong> The same room can need far fewer 4×12 sheets than 4×8 sheets, with fewer joints to finish.
            </li>
            <li>
              <strong>Using the wall screw spacing on the ceiling.</strong> Ceilings need closer screws, so they use more per sheet.
            </li>
            <li>
              <strong>Buying compound by the joint.</strong> Plan on three coats over the whole job, not just enough to bed the tape.
            </li>
          </ul>

          <h2>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {faqs.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>

          <h2>Related calculators</h2>
          <ul className={styles.related}>
            <li>
              <Link href="/stud-calculator/">
                Stud Framing Calculator<span>Studs and plates before the drywall goes up</span>
              </Link>
            </li>
            <li>
              <Link href="/paint-cost-calculator/">
                Paint Cost Calculator<span>Primer and paint for your new walls</span>
              </Link>
            </li>
            <li>
              <Link href="/square-footage-calculator/">
                Square Footage Calculator<span>Floor and room areas for odd shapes</span>
              </Link>
            </li>
            <li>
              <Link href="/tile-calculator/">
                Tile Calculator<span>Tiles for bathroom walls and floors</span>
              </Link>
            </li>
            <li>
              <Link href="/linear-foot-calculator/">
                Linear Foot Calculator<span>Trim, baseboard and corner bead lengths</span>
              </Link>
            </li>
            <li>
              <Link href="/laminate-flooring-calculator/">
                Laminate Flooring Calculator<span>Boxes of flooring once the walls are done</span>
              </Link>
            </li>
          </ul>

          <h2>Sources and how we calculate</h2>
          <div className={styles.sources}>
            <ul>
              <li>
                Joint compound coverage (about 10 gal per 1,000 sq ft), 4.5 gal pail and 3.5 gal carton sizes, and the three-coat method: USG
                Sheetrock® Brand All Purpose Joint Compound submittal sheet J1969 (rev. 10-16).
              </li>
              <li>
                Paper tape (about 350 linear ft per 1,000 sq ft), 10–15% overage for cutting, hanging boards across the framing, ceilings
                before walls, 12 in ceiling screw spacing and 75/250/500 ft tape rolls: Georgia-Pacific Gypsum, DensArmor Plus® “WallWorks
                Guide” (2011).
              </li>
              <li>
                Default screw spacing: IRC Table R702.3.5, as summarised in local building-department drywall inspection guides. Check the code
                edition your area has adopted.
              </li>
              <li>
                Board weights are USG nominal figures: regular ½ in about 1.6 lb/sq ft, lightweight ½ in about 1.25 lb/sq ft, Firecode X ⅝ in
                about 2.2 lb/sq ft. Your board may differ — check the label.
              </li>
              <li>
                Screws per sheet = framing members crossed × screws along each member, for a sheet hung across the framing. Compound, tape and
                screws get the same extra % as the sheets.
              </li>
              <li>
                Conversions: 1 ft = 0.3048 m; 1 sq ft = {n(M2_PER_FT2, 4)} m²; 1 US gal = 3.785 L.
              </li>
              <li>
                Results are planning estimates. They do not replace your board manufacturer’s instructions, local building code or a
                professional’s advice.
              </li>
            </ul>
          </div>
        </article>

        <div className={styles.adBlock}>
          <AdSlot slotId="drywall-calculator-bottom" />
        </div>
      </main>
    </>
  );
}
