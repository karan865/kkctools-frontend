import React from 'react';
import s from './SlabCostDiagram.module.css';

/* Decorative-but-informative SVGs for the slab cost tool and page. Text labels inside are
   duplicated in the surrounding HTML, so the drawings are hidden from screen readers. */

export function SlabSectionDiagram({
  thicknessLabel,
  baseLabel,
  reinforcement,
  vapor,
  hasBase,
}: {
  thicknessLabel: string;
  baseLabel: string;
  reinforcement: 'none' | 'mesh' | 'rebar';
  vapor: boolean;
  hasBase: boolean;
}) {
  const slabTop = 38;
  const slabH = 46;
  const slabBottom = slabTop + slabH;
  const baseH = hasBase ? 30 : 0;
  const soilTop = slabBottom + (vapor ? 3 : 0) + baseH;
  return (
    <svg className={s.svg} viewBox="0 0 360 170" aria-hidden="true" focusable="false">
      {/* soil */}
      <rect className={s.soil} x={10} y={soilTop} width={300} height={170 - soilTop} />
      {[30, 70, 110, 150, 190, 230, 270].map((x) => (
        <path key={x} className={s.soilMark} d={`M${x} ${soilTop + 14} l8 -6 l8 6`} />
      ))}
      {/* gravel base */}
      {hasBase && (
        <g>
          <rect className={s.base} x={10} y={slabBottom + (vapor ? 3 : 0)} width={300} height={baseH} />
          {Array.from({ length: 34 }).map((_, i) => (
            <circle key={i} className={i % 3 ? s.stone : s.stoneDark} cx={16 + i * 8.7} cy={slabBottom + (vapor ? 3 : 0) + 8 + ((i * 7) % 16)} r={i % 2 ? 2.6 : 3.4} />
          ))}
        </g>
      )}
      {/* vapour barrier */}
      {vapor && <rect className={s.barrier} x={10} y={slabBottom} width={300} height={3} />}
      {/* slab */}
      <polygon className={s.slabTop} points={`10,${slabTop} 310,${slabTop} 330,${slabTop - 14} 30,${slabTop - 14}`} />
      <rect className={s.slab} x={10} y={slabTop} width={300} height={slabH} />
      <polygon className={s.slabSide} points={`310,${slabTop} 330,${slabTop - 14} 330,${slabBottom - 14} 310,${slabBottom}`} />
      {[40, 90, 150, 210, 260].map((x, i) => (
        <circle key={x} className={s.aggregate} cx={x} cy={slabTop + 12 + (i % 3) * 9} r={2} />
      ))}
      {reinforcement === 'mesh' && <line className={s.mesh} x1={14} y1={slabTop + slabH / 2} x2={306} y2={slabTop + slabH / 2} />}
      {reinforcement === 'rebar' &&
        Array.from({ length: 12 }).map((_, i) => <circle key={i} className={s.rebar} cx={24 + i * 25} cy={slabTop + slabH / 2 + 2} r={4} />)}
      {/* dimension: slab thickness */}
      <line className={s.dim} x1={344} y1={slabTop} x2={344} y2={slabBottom} />
      <line className={s.dim} x1={339} y1={slabTop} x2={349} y2={slabTop} />
      <line className={s.dim} x1={339} y1={slabBottom} x2={349} y2={slabBottom} />
      <text className={s.label} x={340} y={slabTop - 22} textAnchor="end">
        {thicknessLabel}
      </text>
      {/* layer labels */}
      <text className={s.labelOn} x={18} y={slabTop + 16}>
        Concrete
      </text>
      {reinforcement !== 'none' && (
        <text className={s.labelOn} x={18} y={slabTop + slabH / 2 + 15}>
          {reinforcement === 'mesh' ? 'Wire mesh' : 'Rebar grid'}
        </text>
      )}
      {hasBase && (
        <text className={s.label} x={300} y={slabBottom + (vapor ? 3 : 0) + baseH / 2 + 4} textAnchor="end">
          Gravel base {baseLabel}
        </text>
      )}
      {vapor && (
        <text className={s.labelSmall} x={300} y={slabBottom - 4} textAnchor="end">
          vapour barrier
        </text>
      )}
      <text className={s.labelSmall} x={18} y={Math.min(166, soilTop + 26)}>
        Compacted soil
      </text>
    </svg>
  );
}

export interface Segment {
  label: string;
  amount: number;
  tone: 'concrete' | 'prep' | 'labour' | 'extras';
}

/** Horizontal stacked bar with a legend (HTML, so the numbers are readable text). */
export function CostBar({ segments, format }: { segments: Segment[]; format: (n: number) => string }) {
  const total = segments.reduce((a, x) => a + x.amount, 0);
  const shown = segments.filter((x) => x.amount > 0);
  if (total <= 0) return null;
  return (
    <div className={s.costBar}>
      <div className={s.bar} aria-hidden="true">
        {shown.map((x) => (
          <span key={x.label} className={`${s.seg} ${s[x.tone]}`} style={{ width: `${(x.amount / total) * 100}%` }} />
        ))}
      </div>
      <ul className={s.legend}>
        {shown.map((x) => (
          <li key={x.label}>
            <span className={`${s.swatch} ${s[x.tone]}`} aria-hidden="true" />
            {x.label} <strong>{format(x.amount)}</strong> <span className={s.pct}>({Math.round((x.amount / total) * 100)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Mixer truck with the drum filled to the order size and a marker at the short-load threshold. */
export function TruckDiagram({ order, capacity, threshold, orderLabel, capLabel, clipId = 'slab-drum-clip' }: { order: number; capacity: number; threshold: number; orderLabel: string; capLabel: string; clipId?: string }) {
  const fill = capacity > 0 ? Math.min(1, order / capacity) : 0;
  const mark = capacity > 0 ? Math.min(1, threshold / capacity) : 0;
  const drumX = 70;
  const drumW = 170;
  return (
    <svg className={s.svg} viewBox="0 0 320 150" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <rect x={drumX} y={30} width={drumW} height={64} rx={32} />
        </clipPath>
      </defs>
      <rect className={s.drum} x={drumX} y={30} width={drumW} height={64} rx={32} />
      <rect className={s.drumFill} x={drumX} y={30} width={drumW * fill} height={64} clipPath={`url(#${clipId})`} />
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} className={s.drumTick} x1={drumX + drumW * f} y1={34} x2={drumX + drumW * f} y2={90} />
      ))}
      {mark > 0 && mark <= 1 && (
        <g>
          <line className={s.threshold} x1={drumX + drumW * mark} y1={22} x2={drumX + drumW * mark} y2={100} />
        </g>
      )}
      <rect className={s.chassis} x={50} y={98} width={220} height={10} rx={3} />
      <path className={s.cab} d="M250 60 H290 L304 82 V108 H250 Z" />
      <rect className={s.window} x={258} y={66} width={26} height={16} rx={2} />
      {[82, 128, 270].map((x) => (
        <g key={x}>
          <circle className={s.wheel} cx={x} cy={114} r={12} />
          <circle className={s.hub} cx={x} cy={114} r={4.5} />
        </g>
      ))}
      <text className={s.label} x={drumX + 6} y={18}>
        {orderLabel}
      </text>
      <text className={s.labelSmall} x={drumX + drumW} y={144} textAnchor="end">
        {capLabel}
      </text>
    </svg>
  );
}
