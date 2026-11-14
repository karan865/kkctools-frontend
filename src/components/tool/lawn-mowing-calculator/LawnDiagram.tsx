import React from 'react';
import styles from './LawnDiagram.module.css';

/**
 * SVG diagrams for the lawn mowing cost calculator. Pure (no hooks), so they render
 * on the server and inside the client calculator. Colours follow the light/dark theme.
 */

const v = (name: string) => `var(--dg-${name})`;
const FONT = 'system-ui, -apple-system, Segoe UI, sans-serif';

function Svg({ label, children, viewBox }: { label: string; children: React.ReactNode; viewBox: string }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={styles.svg}>
      {children}
    </svg>
  );
}

function Txt({ x, y, children, anchor = 'start', size = 11, weight = 400, color = 'text' }: { x: number; y: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; weight?: number; color?: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fontFamily={FONT} style={{ fill: v(color) }}>
      {children}
    </text>
  );
}

function Tag({ x, y, label }: { x: number; y: number; label: string }) {
  const w = Math.max(26, label.length * 6.4 + 12);
  return (
    <g>
      <rect x={x - w / 2} y={y - 11} width={w} height={20} rx={5} style={{ fill: v('label-bg'), stroke: v('dim') }} strokeWidth={1} />
      <Txt x={x} y={y + 3.5} anchor="middle" size={11} weight={700} color="dim">
        {label}
      </Txt>
    </g>
  );
}

/** A typical lot from above: the mowable lawn is split into rectangles; the house and driveway are left out. */
export function MeasureDiagram() {
  return (
    <Svg label="A lot seen from above. Front lawn A, back lawn B and side strip C are measured as rectangles; the house and driveway are not lawn." viewBox="0 0 340 250">
      <rect x={20} y={14} width={300} height={222} rx={4} style={{ fill: 'none', stroke: v('faint'), strokeDasharray: '4 3' }} strokeWidth={1.2} />
      {/* back lawn B */}
      <rect x={28} y={22} width={284} height={78} style={{ fill: v('grass'), stroke: v('grass-dark') }} strokeWidth={1.2} />
      {/* house */}
      <rect x={70} y={106} width={150} height={62} style={{ fill: v('house'), stroke: v('edge') }} strokeWidth={1.4} />
      <Txt x={145} y={142} anchor="middle" size={12} weight={700}>
        House
      </Txt>
      {/* side strip C */}
      <rect x={228} y={106} width={84} height={62} style={{ fill: v('grass-2'), stroke: v('grass-dark') }} strokeWidth={1.2} />
      <rect x={28} y={106} width={36} height={62} style={{ fill: v('grass-2'), stroke: v('grass-dark') }} strokeWidth={1.2} />
      {/* front lawn A + driveway */}
      <rect x={28} y={174} width={200} height={56} style={{ fill: v('grass'), stroke: v('grass-dark') }} strokeWidth={1.2} />
      <rect x={232} y={174} width={80} height={56} style={{ fill: v('drive'), stroke: v('edge') }} strokeWidth={1.2} />
      <Txt x={272} y={206} anchor="middle" size={11}>
        Driveway
      </Txt>
      <Tag x={170} y={60} label="B = length × width" />
      <Tag x={270} y={137} label="C" />
      <Tag x={46} y={137} label="C" />
      <Tag x={128} y={203} label="A = length × width" />
      <Txt x={170} y={248} anchor="middle" size={10.5}>
        Lawn area = A + B + C (leave out house, drive, beds)
      </Txt>
    </Svg>
  );
}

/** Mowing stripes: deck width × speed sets acres per hour; turns and overlap lower the efficiency. */
export function MowerPathDiagram({ deckLabel = 'deck width', rateLabel }: { deckLabel?: string; rateLabel?: string }) {
  const stripes = 6;
  const x0 = 30, x1 = 290, y0 = 30, h = 26;
  return (
    <Svg label="Mowing stripes seen from above. Each pass cuts one deck width; turns at the ends and a small overlap between passes are not new grass." viewBox="0 0 340 250">
      {Array.from({ length: stripes }, (_, i) => (
        <rect key={i} x={x0} y={y0 + i * h} width={x1 - x0} height={h} style={{ fill: i % 2 ? v('grass') : v('grass-2') }} />
      ))}
      {Array.from({ length: stripes - 1 }, (_, i) => {
        const y = y0 + i * h + h / 2;
        const right = i % 2 === 0;
        const cx = right ? x1 : x0;
        const dir = right ? 1 : -1;
        return <path key={i} d={`M ${cx} ${y} q ${dir * 22} ${h / 2} 0 ${h}`} style={{ fill: 'none', stroke: v('edge') }} strokeWidth={1.4} strokeDasharray="3 3" />;
      })}
      {Array.from({ length: stripes }, (_, i) => {
        const y = y0 + i * h + h / 2;
        const right = i % 2 === 0;
        return (
          <g key={`a${i}`}>
            <line x1={right ? x0 + 20 : x1 - 20} y1={y} x2={right ? x1 - 30 : x0 + 30} y2={y} style={{ stroke: v('grass-dark') }} strokeWidth={1.6} />
            <path d={right ? `M ${x1 - 30} ${y} l -7 -4 v 8 z` : `M ${x0 + 30} ${y} l 7 -4 v 8 z`} style={{ fill: v('grass-dark') }} />
          </g>
        );
      })}
      <line x1={18} y1={y0} x2={18} y2={y0 + h} style={{ stroke: v('dim') }} strokeWidth={1.4} />
      <line x1={13} y1={y0} x2={23} y2={y0} style={{ stroke: v('dim') }} strokeWidth={1.4} />
      <line x1={13} y1={y0 + h} x2={23} y2={y0 + h} style={{ stroke: v('dim') }} strokeWidth={1.4} />
      <Tag x={92} y={y0 + h / 2} label={deckLabel} />
      <Txt x={316} y={y0 + 2 * h} anchor="middle" size={10}>
        turn
      </Txt>
      <Txt x={170} y={206} anchor="middle" size={11} weight={700}>
        Acres per hour = width × speed × efficiency ÷ 43,560
      </Txt>
      {rateLabel && <Tag x={170} y={230} label={rateLabel} />}
    </Svg>
  );
}

/** Grass grows between cuts: the longer the gap, the longer each cut takes. */
export function GrowthDiagram() {
  const cols = [
    { label: 'Weekly', h: 46, pct: 'base time' },
    { label: 'Every 10 days', h: 62, pct: '+10%' },
    { label: 'Every 2 weeks', h: 82, pct: '+20%' },
    { label: 'Monthly', h: 120, pct: '+40%' },
  ];
  const base = 190;
  return (
    <Svg label="Grass height before each cut: weekly is shortest, monthly is tallest. The calculator adds mowing time for longer gaps: weekly base, 10 days +10%, 2 weeks +20%, monthly +40%." viewBox="0 0 340 240">
      <line x1={20} y1={base} x2={320} y2={base} style={{ stroke: v('edge') }} strokeWidth={1.4} />
      <line x1={20} y1={base - 34} x2={320} y2={base - 34} style={{ stroke: v('faint'), strokeDasharray: '4 3' }} strokeWidth={1} />
      <Txt x={322} y={base - 38} anchor="end" size={9.5}>
        cut height
      </Txt>
      {cols.map((c, i) => {
        const cx = 58 + i * 75;
        const blades = [-14, -7, 0, 7, 14];
        return (
          <g key={c.label}>
            {blades.map((dx, j) => (
              <path key={j} d={`M ${cx + dx} ${base} q ${dx / 3 + 3} ${-c.h / 2} ${dx / 4} ${-c.h + (j % 2) * 6}`} style={{ fill: 'none', stroke: v('grass-dark') }} strokeWidth={2.2} strokeLinecap="round" />
            ))}
            <Txt x={cx} y={base + 18} anchor="middle" size={10.5} weight={700}>
              {c.label}
            </Txt>
            <Txt x={cx} y={base + 34} anchor="middle" size={10.5} color="dim">
              {c.pct}
            </Txt>
          </g>
        );
      })}
    </Svg>
  );
}

/** Stacked bar of minutes per visit (mowing, extras, setup, travel). Live in the calculator. */
export function TimeBar({ mow, extras, setup, travel }: { mow: number; extras: number; setup: number; travel: number }) {
  const parts = [
    { key: 'mow', label: 'Mowing', min: mow },
    { key: 'extra', label: 'Extras', min: extras },
    { key: 'setup', label: 'Setup', min: setup },
    { key: 'travel', label: 'Travel', min: travel },
  ];
  const total = parts.reduce((s, p) => s + p.min, 0);
  const W = 320;
  let x = 10;
  const summary = parts.map((p) => `${p.label} ${Math.round(p.min)} min`).join(', ');
  return (
    <Svg label={`Time per visit: ${summary}`} viewBox="0 0 340 74">
      <rect x={10} y={8} width={W} height={22} rx={6} style={{ fill: v('house') }} />
      {total > 0 &&
        parts.map((p) => {
          const w = (p.min / total) * W;
          const r = <rect key={p.key} x={x} y={8} width={Math.max(0, w)} height={22} style={{ fill: v(p.key) }} />;
          x += w;
          return r;
        })}
      {parts.map((p, i) => (
        <g key={`l${p.key}`}>
          <rect x={10 + i * 82} y={44} width={10} height={10} rx={2} style={{ fill: v(p.key) }} />
          <Txt x={24 + i * 82} y={53} size={10.5}>
            {p.label} {Math.round(p.min)}m
          </Txt>
        </g>
      ))}
    </Svg>
  );
}
