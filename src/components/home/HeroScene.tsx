import React from 'react';
import s from './HeroScene.module.css';

/**
 * Decorative hero illustration: a small building site that touches every tool category —
 * concrete slab, stud framing, roof with truss and shingles, painted wall, gravel pile,
 * crane and a tape measure. Inline SVG only (no image requests), hidden from assistive tech.
 */

const k = (...names: string[]) => names.map((n) => s[n]).join(' ');

// Roof geometry (gable): eaves at y=182 from x=122 to x=428, apex at (275, 84)
const SHINGLE_ROWS = Array.from({ length: 8 }, (_, r) => 90 + r * 12);

export default function HeroScene() {
  return (
    <svg className={s.svg} viewBox="0 12 520 362" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="hero-roof-right">
          <polygon points="275,84 428,182 275,182" />
        </clipPath>
      </defs>

      {/* Sky: sun and clouds */}
      <circle className={s.sunGlow} cx={446} cy={70} r={46} />
      <circle className={s.sun} cx={446} cy={70} r={28} />
      <g className={s.cloud}>
        <circle cx={350} cy={46} r={14} />
        <circle cx={368} cy={38} r={18} />
        <circle cx={388} cy={48} r={12} />
        <rect x={340} y={46} width={58} height={14} rx={7} />
      </g>
      <g className={s.cloud} opacity={0.8}>
        <circle cx={128} cy={106} r={10} />
        <circle cx={142} cy={98} r={13} />
        <circle cx={157} cy={107} r={9} />
        <rect x={120} y={104} width={44} height={11} rx={5.5} />
      </g>

      {/* Crane lifting a beam */}
      <g className={s.crane}>
        <line x1={52} y1={42} x2={52} y2={352} strokeWidth={4} />
        <line x1={66} y1={42} x2={66} y2={352} strokeWidth={4} />
        <polyline className={s.fn} points="52,60 66,80 52,100 66,120 52,140 66,160 52,180 66,200 52,220 66,240 52,260 66,280 52,300 66,320 52,340" strokeWidth={2} />
        <line x1={24} y1={40} x2={244} y2={40} strokeWidth={4} />
        <line x1={24} y1={52} x2={200} y2={52} strokeWidth={2} />
        <polyline className={s.fn} points="70,40 80,52 90,40 100,52 110,40 120,52 130,40 140,52 150,40 160,52 170,40 180,52 190,40" strokeWidth={1.6} />
        <line x1={59} y1={20} x2={24} y2={40} strokeWidth={2} />
        <line x1={59} y1={20} x2={244} y2={40} strokeWidth={2} />
      </g>
      <rect className={s.ew2} x={22} y={36} width={22} height={18} rx={2} />
      <line className={s.cable} x1={186} y1={40} x2={186} y2={68} />
      <rect className={s.fr1} x={158} y={68} width={56} height={9} rx={2} />
      <rect className={s.fr2} x={158} y={74} width={56} height={3} rx={1} />

      {/* Ground shadow */}
      <ellipse className={s.shadow} cx={270} cy={354} rx={250} ry={26} />

      {/* Concrete slab */}
      <polygon className={k('concL', 'conc2Stroke')} points="100,316 420,316 452,296 132,296" />
      <rect className={s.conc1} x={100} y={316} width={320} height={20} />
      <polygon className={s.conc2} points="420,316 452,296 452,316 420,336" />

      {/* Stud wall (framing) with a window */}
      <rect className={s.fr2} x={140} y={179} width={150} height={7} rx={1} opacity={0.8} />
      <rect className={s.fr2} x={140} y={186} width={150} height={7} rx={1} />
      <rect className={s.fr2} x={140} y={300} width={150} height={7} rx={1} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} className={s.fr1} x={142 + i * 20.5} y={193} width={6} height={107} />
      ))}
      <rect className={s.fr2} x={214} y={220} width={60} height={8} rx={1} />
      <rect className={k('glass', 'fr2Stroke')} x={218} y={229} width={52} height={38} rx={2} />
      <line className={s.fr2Stroke} x1={244} y1={229} x2={244} y2={267} />
      <rect className={s.fr2} x={214} y={267} width={60} height={5} rx={1} />

      {/* Painted wall with roller (finishes) */}
      <rect className={k('finL', 'fin2Stroke')} x={290} y={179} width={122} height={128} />
      <path className={s.fin1} d="M290 179 H358 Q348 240 364 307 H290 Z" />
      <rect className={s.fin2} x={350} y={202} width={42} height={16} rx={7} />
      <path className={k('fn', 'fin2Stroke')} d="M392 210 H401 V236 H373 V256" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <rect className={s.fin2} x={368.5} y={254} width={9} height={28} rx={3} />

      {/* Roof: truss on the left half, shingles on the right half */}
      <polygon className={s.frL} points="122,182 275,84 275,182" />
      <line className={s.fr2Stroke} x1={275} y1={86} x2={275} y2={182} strokeWidth={4} />
      <line className={s.fr2Stroke} x1={275} y1={182} x2={198} y2={133} strokeWidth={3} />
      <line className={s.fr2Stroke} x1={236} y1={157} x2={236} y2={182} strokeWidth={2.5} />
      <g clipPath="url(#hero-roof-right)">
        <rect className={s.fr2} x={275} y={84} width={160} height={100} />
        {SHINGLE_ROWS.map((y, r) =>
          Array.from({ length: 12 }).map((_, i) => (
            <rect key={`${r}-${i}`} className={(r + i) % 5 === 0 ? s.fr2 : s.fr1} x={276 + i * 14 + (r % 2 ? 7 : 0)} y={y} width={12.5} height={10.5} rx={1} />
          )),
        )}
      </g>
      <line className={s.fr2Stroke} x1={110} y1={190} x2={275} y2={80} strokeWidth={8} strokeLinecap="round" />
      <line className={s.fr2Stroke} x1={440} y1={190} x2={275} y2={80} strokeWidth={8} strokeLinecap="round" />
      <line className={s.fr2Stroke} x1={122} y1={182} x2={428} y2={182} strokeWidth={5} />

      {/* Roof pitch marker */}
      <polyline className={k('fn', 'mark')} points="150,170 186,170 186,147" strokeWidth={1.6} />
      <text className={s.label} x={168} y={164} textAnchor="middle">
        12
      </text>
      <text className={s.label} x={190} y={162}>
        8
      </text>

      {/* Tree */}
      <rect className={s.ew2} x={478} y={286} width={8} height={62} rx={3} />
      <circle className={s.gr1} cx={482} cy={270} r={26} />
      <circle className={s.grM} cx={470} cy={258} r={14} />
      <circle className={s.gr2} cx={494} cy={282} r={12} />

      {/* Gravel pile */}
      <path className={s.grL} d="M6 362 Q50 300 98 362 Z" />
      {[[30, 350, 5], [46, 338, 6], [62, 352, 5], [52, 326, 4.5], [76, 356, 4], [40, 358, 3.5], [66, 340, 4], [24, 358, 3.5]].map(([x, y, r], i) => (
        <circle key={i} className={i % 3 === 0 ? s.gr2 : i % 3 === 1 ? s.gr1 : s.grM} cx={x} cy={y} r={r} />
      ))}

      {/* Tape measure under the slab */}
      <rect className={s.tape} x={122} y={348} width={298} height={13} rx={2} />
      {Array.from({ length: 30 }).map((_, i) => (
        <line key={i} className={s.tick} x1={128 + i * 10} y1={348} x2={128 + i * 10} y2={i % 5 === 0 ? 356 : 352} />
      ))}
      <rect className={s.ew1} x={100} y={342} width={28} height={25} rx={6} />
      <circle className={s.tapeHub} cx={114} cy={354.5} r={6} />
      <text className={s.tapeText} x={414} y={358} textAnchor="end">
        24 ft
      </text>
    </svg>
  );
}
