import React from 'react';
import s from './AreaDepthDiagram.module.css';

export type DiagramShape = 'rectangle' | 'circle' | 'triangle' | 'area';
export type DiagramMaterial = 'asphalt' | 'gravel' | 'stone' | 'sand' | 'soil' | 'compost' | 'base' | 'concrete' | 'block' | 'paver';

export interface CalcStep {
  /** short heading, e.g. "Area" */
  title: string;
  /** the user's numbers, e.g. "40 × 20 = 800 ft²" */
  value: string;
}

export interface Layer {
  label: string;
  material: DiagramMaterial;
  /** drawn thickness weight (relative) */
  weight?: number;
}

interface Props {
  shape: DiagramShape;
  /** length / diameter / triangle base label */
  a: string;
  /** width / triangle height label (unused for circle) */
  b?: string;
  /** depth label, e.g. "2 in" */
  depth: string;
  /** length ÷ width ratio for drawing (clamped) */
  ratio?: number;
  material: DiagramMaterial;
  /** optional stacked layers (top first); overrides `material` for the side faces */
  layers?: Layer[];
  steps: CalcStep[];
  /** small note under the drawing, e.g. "Section 1 of 3" */
  note?: string;
  idPrefix: string;
}

const PALETTE: Record<DiagramMaterial, { top: string; side: string; dark: string; dot: string; name: string }> = {
  asphalt: { top: '#4B5563', side: '#374151', dark: '#1F2937', dot: '#9CA3AF', name: 'asphalt' },
  gravel: { top: '#A8A29E', side: '#78716C', dark: '#57534E', dot: '#E7E5E4', name: 'gravel' },
  stone: { top: '#94A3B8', side: '#64748B', dark: '#475569', dot: '#E2E8F0', name: 'stone' },
  sand: { top: '#E9C97F', side: '#D4A84F', dark: '#A87F2C', dot: '#FFF3D1', name: 'sand' },
  soil: { top: '#A0703F', side: '#7C5230', dark: '#5C3B20', dot: '#C89B6A', name: 'soil' },
  compost: { top: '#6B4A2B', side: '#4E341D', dark: '#33220F', dot: '#9C7A4E', name: 'compost' },
  base: { top: '#B8B2A7', side: '#8F887C', dark: '#6B655B', dot: '#ECE8E1', name: 'crushed base' },
  concrete: { top: '#CBD5E1', side: '#94A3B8', dark: '#64748B', dot: '#F1F5F9', name: 'concrete' },
  block: { top: '#D6D3D1', side: '#A8A29E', dark: '#78716C', dot: '#F5F5F4', name: 'block' },
  paver: { top: '#C2703D', side: '#A35A2E', dark: '#7A4221', dot: '#E3A57A', name: 'pavers' },
};

/**
 * Isometric drawing of the user's area with its depth, plus the calculation steps beside it.
 * Everything shown is also in the results as text, so the SVG is decorative for assistive tech.
 */
export default function AreaDepthDiagram({ shape, a, b, depth, ratio = 2, material, layers, steps, note, idPrefix }: Props) {
  const r = Math.min(Math.max(Number.isFinite(ratio) && ratio > 0 ? ratio : 2, 0.45), 3);
  // fit the footprint: length along x, width going back (oblique)
  const maxW = 206;
  const kx = 0.62; // how far "back" moves right
  const ky = 0.36; // how far "back" moves up
  let L = 190;
  let W = L / r;
  const span = () => L + W * kx;
  if (span() > maxW) {
    const f = maxW / span();
    L *= f;
    W *= f;
  }
  if (W * ky > 70) {
    const f = 70 / (W * ky);
    L *= f;
    W *= f;
  }
  const stack: Layer[] = layers && layers.length ? layers : [{ label: PALETTE[material].name, material, weight: 1 }];
  const totalT = 30 + (stack.length - 1) * 10; // drawn thickness, not to scale
  const wsum = stack.reduce((x, l) => x + (l.weight ?? 1), 0);
  const ox = 84 + (maxW - (L + W * kx)) / 2;
  const oy = Math.round(150 + (W * ky + totalT) / 2);
  const P = (x: number, y: number, z: number) => [ox + x + y * kx, oy - y * ky - z] as const;
  const pts = (...p: (readonly [number, number])[]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const topMat = stack[0].material;
  const pid = (m: DiagramMaterial) => `${idPrefix}-tex-${m}`;
  const used = Array.from(new Set(stack.map((l) => l.material)));

  // layer boundaries (z from bottom)
  const bounds: { z0: number; z1: number; m: DiagramMaterial; label: string }[] = [];
  {
    let z = totalT;
    for (const l of stack) {
      const t = (totalT * (l.weight ?? 1)) / wsum;
      bounds.push({ z0: z - t, z1: z, m: l.material, label: l.label });
      z -= t;
    }
  }

  let drawing: React.ReactNode;
  let dims: React.ReactNode;
  if (shape === 'circle') {
    const R = 105;
    const cx = 84 + maxW / 2;
    const cy = 150 + totalT / 2 + 10;
    const ry = R * 0.42;
    drawing = (
      <g>
        {bounds
          .slice()
          .reverse()
          .map((bd, i) => (
            <path
              key={i}
              d={`M${cx - R} ${cy - bd.z0} L${cx - R} ${cy - bd.z1} A${R} ${ry} 0 0 0 ${cx + R} ${cy - bd.z1} L${cx + R} ${cy - bd.z0} A${R} ${ry} 0 0 1 ${cx - R} ${cy - bd.z0} Z`}
              fill={PALETTE[bd.m].side}
              stroke={PALETTE[bd.m].dark}
              strokeWidth={1.2}
            />
          ))}
        <ellipse cx={cx} cy={cy - totalT} rx={R} ry={ry} fill={`url(#${pid(topMat)})`} stroke={PALETTE[topMat].dark} strokeWidth={1.6} />
      </g>
    );
    dims = (
      <g>
        <line className={s.dimAccent} x1={cx - R} y1={cy - totalT} x2={cx + R} y2={cy - totalT} />
        <text className={s.label} x={cx} y={cy - totalT - 8} textAnchor="middle">
          ⌀ {a}
        </text>
        <line className={s.dim} x1={cx + R + 14} y1={cy - totalT} x2={cx + R + 14} y2={cy} />
        <text className={s.labelAccent} x={cx + R + 20} y={cy - totalT / 2 + 4}>
          {depth}
        </text>
      </g>
    );
  } else if (shape === 'triangle') {
    const At = P(0, 0, totalT);
    const Bt = P(L, 0, totalT);
    const Ct = P(L / 2, W, totalT);
    drawing = (
      <g>
        {bounds.map((bd, i) => (
          <g key={i}>
            <polygon points={pts(P(0, 0, bd.z0), P(L, 0, bd.z0), P(L, 0, bd.z1), P(0, 0, bd.z1))} fill={PALETTE[bd.m].side} stroke={PALETTE[bd.m].dark} strokeWidth={1.2} />
            <polygon points={pts(P(L, 0, bd.z0), P(L / 2, W, bd.z0), P(L / 2, W, bd.z1), P(L, 0, bd.z1))} fill={PALETTE[bd.m].dark} stroke={PALETTE[bd.m].dark} strokeWidth={1.2} opacity={0.9} />
          </g>
        ))}
        <polygon points={pts(At, Bt, Ct)} fill={`url(#${pid(topMat)})`} stroke={PALETTE[topMat].dark} strokeWidth={1.6} />
      </g>
    );
    dims = (
      <g>
        <line className={s.dim} x1={At[0]} y1={oy + 16} x2={Bt[0]} y2={oy + 16} />
        <text className={s.label} x={(At[0] + Bt[0]) / 2} y={oy + 32} textAnchor="middle">
          base {a}
        </text>
        <line className={s.dimAccent} x1={(At[0] + Bt[0]) / 2} y1={At[1]} x2={Ct[0]} y2={Ct[1]} strokeDasharray="4 3" />
        <text className={s.label} x={Ct[0] + 10} y={Ct[1] - 6}>
          height {b}
        </text>
        <line className={s.dim} x1={At[0] - 14} y1={oy - totalT} x2={At[0] - 14} y2={oy} />
        <text className={s.labelAccent} x={At[0] - 20} y={oy - totalT / 2 + 4} textAnchor="end">
          {depth}
        </text>
      </g>
    );
  } else {
    const At = P(0, 0, totalT);
    const Bt = P(L, 0, totalT);
    const Ct = P(L, W, totalT);
    const Dt = P(0, W, totalT);
    drawing = (
      <g>
        {bounds.map((bd, i) => (
          <g key={i}>
            <polygon points={pts(P(0, 0, bd.z0), P(L, 0, bd.z0), P(L, 0, bd.z1), P(0, 0, bd.z1))} fill={PALETTE[bd.m].side} stroke={PALETTE[bd.m].dark} strokeWidth={1.2} />
            <polygon points={pts(P(L, 0, bd.z0), P(L, W, bd.z0), P(L, W, bd.z1), P(L, 0, bd.z1))} fill={PALETTE[bd.m].dark} stroke={PALETTE[bd.m].dark} strokeWidth={1.2} />
          </g>
        ))}
        <polygon points={pts(At, Bt, Ct, Dt)} fill={`url(#${pid(topMat)})`} stroke={PALETTE[topMat].dark} strokeWidth={1.6} />
        {shape === 'area' && (
          <text className={s.onTop} x={(At[0] + Ct[0]) / 2} y={(At[1] + Ct[1]) / 2 + 4} textAnchor="middle">
            {a}
          </text>
        )}
      </g>
    );
    dims =
      shape === 'area' ? (
        <g>
          <line className={s.dim} x1={Bt[0] + 14} y1={oy - totalT} x2={Bt[0] + 14} y2={oy} />
          <text className={s.labelAccent} x={Bt[0] + 20} y={oy - totalT / 2 + 4}>
            {depth}
          </text>
        </g>
      ) : (
        <g>
          <line className={s.dim} x1={At[0]} y1={oy + 16} x2={Bt[0]} y2={oy + 16} />
          <text className={s.label} x={(At[0] + Bt[0]) / 2} y={oy + 32} textAnchor="middle">
            length {a}
          </text>
          <line className={s.dim} x1={At[0] - 12} y1={At[1] - 6} x2={Dt[0] - 12} y2={Dt[1] - 6} />
          <text className={s.label} x={(At[0] + Dt[0]) / 2 - 18} y={(At[1] + Dt[1]) / 2 - 8} textAnchor="end">
            width {b}
          </text>
          <line className={s.dim} x1={At[0] - 14} y1={oy - totalT} x2={At[0] - 14} y2={oy} />
          <text className={s.labelAccent} x={At[0] - 20} y={oy - totalT / 2 + 4} textAnchor="end">
            {depth}
          </text>
        </g>
      );
  }

  // layer legend for stacked builds
  const legend =
    stack.length > 1 ? (
      <g>
        {stack.map((l, i) => (
          <g key={i} transform={`translate(${34 + i * 96}, 18)`}>
            <rect width={12} height={12} rx={2} fill={PALETTE[l.material].side} stroke={PALETTE[l.material].dark} />
            <text className={s.small} x={17} y={10}>
              {l.label}
            </text>
          </g>
        ))}
      </g>
    ) : null;

  // top of the drawing, so the stacked layout does not start with empty space
  const artTop = stack.length > 1 ? 4 : Math.max(0, Math.floor(shape === 'circle' ? 160 - 105 * 0.42 - 40 : oy - W * ky - totalT - 34));
  const shown = steps.slice(0, 4);
  const sy0 = Math.max(14, (260 - shown.length * 46 - (shown.length - 1) * 18) / 2);
  const art = (suffix: string) => (
    <>
      <defs>
        {used.map((m) => (
          <pattern key={m} id={pid(m) + suffix} width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill={PALETTE[m].top} />
            <circle cx="3" cy="4" r={m === 'stone' || m === 'gravel' ? 2 : 1} fill={PALETTE[m].dot} opacity={0.75} />
            <circle cx="10" cy="9" r={m === 'stone' ? 2.4 : m === 'gravel' ? 1.6 : 0.9} fill={PALETTE[m].dot} opacity={0.6} />
            <circle cx="7" cy="12.5" r={0.8} fill={PALETTE[m].dark} opacity={0.5} />
          </pattern>
        ))}
      </defs>
      {legend}
      {suffix ? withSuffix(drawing, suffix) : drawing}
      {dims}
      <text className={s.small} x={34} y={262}>
        {note ? `${note} · ` : ''}depth not to scale
      </text>
    </>
  );

  return (
    <>
      <svg className={`${s.svg} ${s.wide}`} viewBox="0 0 560 270" aria-hidden="true" focusable="false">
        {art('')}
        <StepsList steps={shown} x={318} y0={sy0} width={234} />
      </svg>
      <svg className={`${s.svg} ${s.stacked}`} viewBox={`14 ${artTop} 330 ${282 + shown.length * 64 - artTop}`} aria-hidden="true" focusable="false">
        {art('-s')}
        <StepsList steps={shown} x={24} y0={282} width={310} />
      </svg>
    </>
  );
}

/** Re-points pattern fills inside a drawing to the suffixed pattern ids. */
function withSuffix(node: React.ReactNode, suffix: string): React.ReactNode {
  return React.Children.map(node, (child) => {
    if (!React.isValidElement(child)) return child;
    const props = child.props as { fill?: string; children?: React.ReactNode };
    const next: { fill?: string; children?: React.ReactNode } = {};
    if (typeof props.fill === 'string' && props.fill.startsWith('url(#')) next.fill = props.fill.replace(/\)$/, `${suffix})`);
    if (props.children) next.children = withSuffix(props.children, suffix);
    return Object.keys(next).length ? React.cloneElement(child, next) : child;
  });
}

/** Numbered calculation steps joined by arrows. */
export function StepsList({ steps, x, y0, width }: { steps: CalcStep[]; x: number; y0: number; width: number }) {
  const boxH = 46;
  const gap = 18;
  return (
    <g>
      {steps.map((st, i) => {
        const y = y0 + i * (boxH + gap);
        return (
          <g key={i}>
            <rect className={s.stepBox} x={x} y={y} width={width} height={boxH} rx={10} />
            <circle className={s.stepDot} cx={x + 18} cy={y + boxH / 2} r={10} />
            <text className={s.stepNum} x={x + 18} y={y + boxH / 2 + 4} textAnchor="middle">
              {i + 1}
            </text>
            <text className={s.stepTitle} x={x + 36} y={y + 18}>
              {st.title}
            </text>
            <text className={s.stepValue} x={x + 36} y={y + 35}>
              {st.value}
            </text>
            {i < steps.length - 1 && <path className={s.arrow} d={`M${x + 18} ${y + boxH + 3} v${gap - 7} m-4 -5 l4 5 l4 -5`} />}
          </g>
        );
      })}
    </g>
  );
}

/** Framed diagram with a caption, for use inside a calculator's results column. */
export function DiagramPanel({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <figure className={s.wrap}>
      {children}
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  );
}

/** Plain-words formula for the area of a shape. */
export function shapeFormula(shape: DiagramShape): string {
  return shape === 'rectangle' ? 'L × W' : shape === 'circle' ? 'π/4 × D²' : shape === 'triangle' ? '½ × base × height' : 'area entered';
}

const nf = (v: number, dp = 1) => (Number.isFinite(v) ? v : 0).toLocaleString('en-US', { maximumFractionDigits: dp });
export { nf as fmtNum };

/**
 * Generic frame: a drawing (drawn in a 14–320 × artTop–270 box) with the calculation steps beside it on wide
 * containers and below it on narrow ones. `art` is a function so each copy can use its own pattern ids.
 */
export function StepFrame({ art, steps, artTop = 0, label }: { art: (suffix: string) => React.ReactNode; steps: CalcStep[]; artTop?: number; label?: string }) {
  const shown = steps.slice(0, 4);
  const sy0 = Math.max(10, (270 - shown.length * 46 - (shown.length - 1) * 18) / 2);
  return (
    <>
      <svg className={`${s.svg} ${s.wide}`} viewBox="0 0 560 280" aria-hidden={label ? undefined : 'true'} role={label ? 'img' : undefined} aria-label={label} focusable="false">
        {art('')}
        <StepsList steps={shown} x={322} y0={sy0} width={230} />
      </svg>
      <svg className={`${s.svg} ${s.stacked}`} viewBox={`10 ${artTop} 320 ${284 + shown.length * 64 - artTop}`} aria-hidden="true" focusable="false">
        {art('-s')}
        <StepsList steps={shown} x={18} y0={284} width={306} />
      </svg>
    </>
  );
}

export { PALETTE as MATERIAL_PALETTE };
