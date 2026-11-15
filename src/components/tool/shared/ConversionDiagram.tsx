import React from 'react';
import s from './AreaDepthDiagram.module.css';
import { MATERIAL_PALETTE, StepFrame, type CalcStep, type DiagramMaterial } from './AreaDepthDiagram';

interface Props {
  direction: 'weight-to-volume' | 'volume-to-weight';
  volume: string; // e.g. "8.57 yd³"
  weight: string; // e.g. "12 tons"
  density: string; // e.g. "1.40 tons per yd³"
  material: DiagramMaterial;
  materialName: string;
  steps: CalcStep[];
}

/** Volume cube ⇄ weight block with the density in the middle, plus the steps. */
export default function ConversionDiagram({ direction, volume, weight, density, material, materialName, steps }: Props) {
  const p = MATERIAL_PALETTE[material];
  const toVol = direction === 'weight-to-volume';
  // positions: left item at x≈80, right item at x≈255
  const cube = (cx: number, suffix: string) => (
    <g>
      <defs>
        <pattern id={`conv-tex${suffix}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill={p.top} />
          <circle cx="3" cy="3" r="1.4" fill={p.dot} opacity="0.8" />
          <circle cx="9" cy="8" r="1.8" fill={p.dot} opacity="0.6" />
        </pattern>
      </defs>
      <polygon points={`${cx - 44},${100} ${cx + 4},${100} ${cx + 30},${82} ${cx - 18},${82}`} fill={`url(#conv-tex${suffix})`} stroke={p.dark} strokeWidth={1.4} />
      <polygon points={`${cx - 44},${100} ${cx + 4},${100} ${cx + 4},${148} ${cx - 44},${148}`} fill={p.side} stroke={p.dark} strokeWidth={1.4} />
      <polygon points={`${cx + 4},${100} ${cx + 30},${82} ${cx + 30},${130} ${cx + 4},${148}`} fill={p.dark} stroke={p.dark} strokeWidth={1.4} />
      <text className={s.label} x={cx - 7} y={172} textAnchor="middle">
        {volume}
      </text>
      <text className={s.small} x={cx - 7} y={188} textAnchor="middle">
        volume (what you spread)
      </text>
    </g>
  );
  const weightBlock = (cx: number) => (
    <g>
      {/* scale platform */}
      <rect x={cx - 46} y={146} width={92} height={8} rx={2} fill="#64748B" />
      <rect x={cx - 6} y={154} width={12} height={10} fill="#64748B" />
      <rect x={cx - 30} y={164} width={60} height={6} rx={2} fill="#475569" />
      {/* weight */}
      <path d={`M${cx - 34} ${146} L${cx - 24} ${96} H${cx + 24} L${cx + 34} ${146} Z`} fill="#334155" stroke="#1E293B" strokeWidth={1.4} />
      <path d={`M${cx - 12} ${96} Q${cx} ${76} ${cx + 12} ${96}`} fill="none" stroke="#334155" strokeWidth={5} />
      <text x={cx} y={128} textAnchor="middle" fill="#fff" style={{ font: '700 11px var(--font-body), system-ui, sans-serif' }}>
        tons
      </text>
      <text className={s.label} x={cx} y={190} textAnchor="middle">
        {weight}
      </text>
      <text className={s.small} x={cx} y={206} textAnchor="middle">
        weight (how it is sold)
      </text>
    </g>
  );
  const art = (suffix: string) => (
    <g>
      <text className={s.small} x={20} y={40}>
        {materialName}
      </text>
      {toVol ? weightBlock(80) : cube(86, suffix)}
      {toVol ? cube(258, suffix) : weightBlock(250)}
      {/* arrow with the density */}
      <path d="M128 118 H200" className={s.dimAccent} />
      <path d="M192 110 L202 118 L192 126" fill="none" className={s.dimAccent} />
      <text className={s.labelAccent} x={165} y={102} textAnchor="middle">
        {toVol ? '÷' : '×'} density
      </text>
      {density.split(' · ').map((line, i) => (
        <text key={i} className={s.small} x={165} y={142 + i * 14} textAnchor="middle">
          {line}
        </text>
      ))}
    </g>
  );
  return <StepFrame art={art} steps={steps} artTop={20} />;
}
