import React from 'react';

const label = { paintOrder: 'stroke', stroke: 'var(--surface)', strokeWidth: 3, strokeLinejoin: 'round' as const };
const T = { ...label, fill: 'var(--ink)', font: '700 12px var(--font-body), system-ui, sans-serif' };
const S = { ...label, fill: 'var(--ink-2)', font: '600 11px var(--font-body), system-ui, sans-serif' };
const A = { ...label, fill: 'var(--brand-orange-text)', font: '700 12px var(--font-body), system-ui, sans-serif' };

/** One cubic yard: a 3 × 3 × 3 ft cube split into 27 cubic-foot blocks. */
export function YardCubeDiagram() {
  const u = 26; // px per foot (iso)
  const ox = 70;
  const oy = 150;
  const dx = u * 0.6;
  const dy = u * 0.35;
  const P = (x: number, y: number, z: number) => `${ox + x * u + z * dx},${oy - y * u - z * dy}`;
  const faces: React.ReactNode[] = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      faces.push(<polygon key={`f${i}${j}`} points={[P(i, j, 0), P(i + 1, j, 0), P(i + 1, j + 1, 0), P(i, j + 1, 0)].join(' ')} fill="color-mix(in srgb, var(--cat-concrete-g1) 22%, var(--surface))" stroke="var(--cat-concrete-g2)" strokeWidth={1} />);
      faces.push(<polygon key={`s${i}${j}`} points={[P(3, i, j), P(3, i + 1, j), P(3, i + 1, j + 1), P(3, i, j + 1)].join(' ')} fill="color-mix(in srgb, var(--cat-concrete-g1) 40%, var(--surface))" stroke="var(--cat-concrete-g2)" strokeWidth={1} />);
      faces.push(<polygon key={`t${i}${j}`} points={[P(i, 3, j), P(i + 1, 3, j), P(i + 1, 3, j + 1), P(i, 3, j + 1)].join(' ')} fill="color-mix(in srgb, var(--cat-concrete-g1) 10%, var(--surface))" stroke="var(--cat-concrete-g2)" strokeWidth={1} />);
    }
  return (
    <svg viewBox="0 0 360 190" width="520" role="img" aria-label="A cubic yard is a cube 3 feet wide, 3 feet deep and 3 feet tall, made of 27 cubic feet" style={{ maxWidth: '100%', height: 'auto' }}>
      {faces}
      <text x={ox + 39} y={oy + 18} textAnchor="middle" style={T}>3 ft</text>
      <text x={ox - 8} y={oy - 39} textAnchor="end" style={T}>3 ft</text>
      <text x={ox + 3 * u + 3 * dx + 6} y={oy - 3 * u * 0.2 - 8} style={T}>3 ft</text>
      <text x={250} y={70} style={A}>1 yd³</text>
      <text x={250} y={88} style={S}>= 3 × 3 × 3</text>
      <text x={250} y={104} style={S}>= 27 ft³ (27 blocks)</text>
      <text x={250} y={120} style={S}>≈ 202 US gal</text>
    </svg>
  );
}

/** The 10 × 12 ft, 4 in patio from the worked example. */
export function SlabExampleDiagram() {
  return (
    <svg viewBox="0 0 360 200" width="520" role="img" aria-label="A 10 by 12 foot slab 4 inches thick holds 40 cubic feet, 1.48 cubic yards" style={{ maxWidth: '100%', height: 'auto' }}>
      <polygon points="50,120 230,120 290,90 110,90" fill="color-mix(in srgb, var(--cat-concrete-g1) 10%, var(--surface))" stroke="var(--cat-concrete-g2)" strokeWidth={1.8} />
      <polygon points="50,120 230,120 230,132 50,132" fill="color-mix(in srgb, var(--cat-concrete-g1) 24%, var(--surface))" stroke="var(--cat-concrete-g2)" strokeWidth={1.8} />
      <polygon points="230,120 290,90 290,102 230,132" fill="color-mix(in srgb, var(--cat-concrete-g1) 40%, var(--surface))" stroke="var(--cat-concrete-g2)" strokeWidth={1.8} />
      <line x1={50} y1={150} x2={230} y2={150} stroke="var(--ink-2)" strokeWidth={1.2} />
      <text x={140} y={168} textAnchor="middle" style={T}>12 ft</text>
      <line x1={246} y1={142} x2={306} y2={112} stroke="var(--ink-2)" strokeWidth={1.2} />
      <text x={286} y={138} style={T}>10 ft</text>
      <text x={42} y={129} textAnchor="end" style={T}>4 in</text>
      <text x={140} y={112} textAnchor="middle" style={A}>40 ft³</text>
      <text x={30} y={32} style={S}>40 ft³ ÷ 27 = 1.48 yd³</text>
      <text x={30} y={50} style={S}>+ 10% waste = 1.63 yd³</text>
    </svg>
  );
}

/** Result meter: one cube per cubic yard, the last one filled to the fraction; extra cubes show the waste allowance. */
export function YardMeter({ exact, order }: { exact: number; order: number }) {
  const MAX = 8;
  const n = Math.min(Math.ceil(order), MAX);
  const w = 44;
  const total = Math.max(n, 1) * w + 20;
  const cubes = Array.from({ length: n }, (_, i) => {
    const exactFill = Math.min(Math.max(exact - i, 0), 1);
    const orderFill = Math.min(Math.max(order - i, 0), 1);
    const x = 10 + i * w;
    const h = 34;
    return (
      <g key={i}>
        <rect x={x} y={14} width={34} height={h} rx={3} fill="var(--surface-2)" stroke="var(--cat-concrete-g2)" strokeWidth={1.4} />
        <rect x={x} y={14 + h * (1 - orderFill)} width={34} height={h * orderFill} rx={3} fill="color-mix(in srgb, var(--brand-orange) 35%, var(--surface))" />
        <rect x={x} y={14 + h * (1 - exactFill)} width={34} height={h * exactFill} rx={3} fill="var(--cat-concrete-g1)" />
        <rect x={x} y={14} width={34} height={h} rx={3} fill="none" stroke="var(--cat-concrete-g2)" strokeWidth={1.4} />
      </g>
    );
  });
  return (
    <svg viewBox={`0 0 ${total} 84`} width={total} role="img" aria-label={`${exact.toFixed(2)} cubic yards needed, ${order.toFixed(2)} with waste`} style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}>
      {cubes}
      <text x={10} y={72} style={S}>
        {order > MAX ? `1 cube = 1 yd³ (first ${MAX} of ${order.toFixed(1)} shown)` : '1 cube = 1 yd³'}
      </text>
    </svg>
  );
}
