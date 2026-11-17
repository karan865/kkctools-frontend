import React from 'react';
import styles from './RoofDiagram.module.css';

const v = (name: string) => `var(--rd-${name})`;
const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

interface PitchDiagramProps {
  rise: number;
  pitchFactor: number;
}

export function RoofPitchDiagram({ rise, pitchFactor }: PitchDiagramProps) {
  const safeRise = Math.max(1, Math.min(24, rise));
  const run = 220;
  // Scaled height: maximum 140px
  const h = Math.min(140, (safeRise / 12) * 110);
  const x0 = 45;
  const yb = 165;
  const angle = Math.round((Math.atan(safeRise / 12) * (180 / Math.PI)) * 10) / 10;
  const factorStr = pitchFactor.toFixed(3);

  return (
    <svg
      viewBox="0 0 340 200"
      role="img"
      aria-label={`Roof pitch ${safeRise} in 12. Run = 12 inches, Rise = ${safeRise} inches. Pitch multiplier = ${factorStr}. Angle = ${angle} degrees.`}
      className={styles.svg}
    >
      {/* Triangle fill */}
      <polygon
        points={`${x0},${yb} ${x0 + run},${yb} ${x0 + run},${yb - h}`}
        style={{ fill: v('roof'), stroke: v('edge') }}
        strokeWidth={1.5}
      />
      {/* Sloped Rafter line */}
      <line
        x1={x0}
        y1={yb}
        x2={x0 + run}
        y2={yb - h}
        style={{ stroke: v('accent') }}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      {/* Right angle marker */}
      <path
        d={`M${x0 + run - 14} ${yb} V${yb - 14} H${x0 + run}`}
        style={{ fill: 'none', stroke: v('edge') }}
        strokeWidth={1.2}
      />

      {/* Tags */}
      {/* Run tag */}
      <g>
        <rect
          x={x0 + run / 2 - 38}
          y={yb + 10}
          width={76}
          height={20}
          rx={5}
          style={{ fill: v('label-bg'), stroke: v('edge') }}
          strokeWidth={1}
        />
        <text
          x={x0 + run / 2}
          y={yb + 24}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fontFamily={FONT}
          style={{ fill: v('text') }}
        >
          Run: 12&quot;
        </text>
      </g>

      {/* Rise tag */}
      <g>
        <rect
          x={x0 + run + 8}
          y={yb - h / 2 - 10}
          width={58}
          height={20}
          rx={5}
          style={{ fill: v('label-bg'), stroke: v('dim') }}
          strokeWidth={1.2}
        />
        <text
          x={x0 + run + 37}
          y={yb - h / 2 + 4}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fontFamily={FONT}
          style={{ fill: v('dim') }}
        >
          {safeRise}&quot; rise
        </text>
      </g>

      {/* Sloped Factor / Angle tag */}
      <g>
        <rect
          x={x0 + run / 2 - 58}
          y={yb - h / 2 - 28}
          width={116}
          height={22}
          rx={5}
          style={{ fill: v('label-bg'), stroke: v('accent') }}
          strokeWidth={1.5}
        />
        <text
          x={x0 + run / 2}
          y={yb - h / 2 - 13}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fontFamily={FONT}
          style={{ fill: v('accent') }}
        >
          {factorStr}× slope ({angle}°)
        </text>
      </g>
    </svg>
  );
}

export function RoofCrossSectionDiagram() {
  const layers = [
    { name: 'Ridge Vent & Cap Shingles', color: 'ridge' },
    { name: 'Field Shingles / Roofing Panels', color: 'shingle' },
    { name: 'Synthetic / Felt Underlayment', color: 'under' },
    { name: 'Ice & Water Shield (eaves/valleys)', color: 'ice' },
    { name: 'Drip Edge Metal Flashing', color: 'eave' },
    { name: 'Roof Decking (Plywood / OSB 7/16")', color: 'deck' },
  ];

  return (
    <svg
      viewBox="0 0 340 210"
      role="img"
      aria-label="Cross-section diagram of roof assembly layers: Roof deck, Ice & Water shield, Drip edge, Underlayment, Field shingles, and Ridge vent."
      className={styles.svg}
    >
      {layers.map((layer, idx) => {
        const y = 28 + idx * 28;
        return (
          <g key={layer.name}>
            <rect
              x={20}
              y={y}
              width={100}
              height={18}
              rx={3}
              style={{ fill: v(layer.color) }}
            />
            <text
              x={130}
              y={y + 13}
              fontSize={11.5}
              fontWeight={500}
              fontFamily={FONT}
              style={{ fill: v('text') }}
            >
              {layer.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

interface CompareVisualProps {
  repairTotal: number;
  overlayTotal: number;
  overlayAllowed: boolean;
  replaceTotal: number;
  formatMoney: (n: number) => string;
}

export function CompareVisualBars({
  repairTotal,
  overlayTotal,
  overlayAllowed,
  replaceTotal,
  formatMoney,
}: CompareVisualProps) {
  const max = Math.max(replaceTotal, overlayAllowed ? overlayTotal : 0, repairTotal, 1);

  return (
    <div className={styles.compareBars} aria-label="Visual cost comparison of Repair vs Overlay vs Full Replacement">
      {/* Repair Bar */}
      <div className={styles.barRow}>
        <div className={styles.barMeta}>
          <span>Spot Repair (1-2 squares)</span>
          <span>{formatMoney(repairTotal)}</span>
        </div>
        <div className={styles.barTrack}>
          <div
            className={`${styles.barFill} ${styles.fillRepair}`}
            style={{ width: `${Math.min(100, Math.max(3, (repairTotal / max) * 100))}%` }}
          />
        </div>
      </div>

      {/* Overlay Bar */}
      <div className={styles.barRow}>
        <div className={styles.barMeta}>
          <span>Reroof / Overlay {overlayAllowed ? '(No Tear-Off)' : '(Prohibited by IRC Code)'}</span>
          <span>{overlayAllowed ? formatMoney(overlayTotal) : 'Not Allowed (≥ 2 layers)'}</span>
        </div>
        <div className={styles.barTrack}>
          <div
            className={`${styles.barFill} ${overlayAllowed ? styles.fillOverlay : styles.fillDisabled}`}
            style={{ width: overlayAllowed ? `${Math.min(100, Math.max(3, (overlayTotal / max) * 100))}%` : '100%' }}
          />
        </div>
      </div>

      {/* Full Replace Bar */}
      <div className={styles.barRow}>
        <div className={styles.barMeta}>
          <span>Full Replacement (Tear-off + Deck inspect + New roof)</span>
          <span>{formatMoney(replaceTotal)}</span>
        </div>
        <div className={styles.barTrack}>
          <div
            className={`${styles.barFill} ${styles.fillReplace}`}
            style={{ width: `${Math.min(100, Math.max(3, (replaceTotal / max) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
