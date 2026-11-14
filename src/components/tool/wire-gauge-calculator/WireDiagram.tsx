import React from 'react';
import styles from './WireDiagram.module.css';

/** SVG diagrams for the wire gauge calculator. Pure (no hooks); colours follow the theme. */

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
function Tag({ x, y, label, color = 'dim' }: { x: number; y: number; label: string; color?: string }) {
  const w = Math.max(24, label.length * 6.2 + 12);
  return (
    <g>
      <rect x={x - w / 2} y={y - 10} width={w} height={19} rx={5} style={{ fill: v('label-bg'), stroke: v(color) }} strokeWidth={1.1} />
      <Txt x={x} y={y + 4} anchor="middle" size={10.5} weight={700} color={color}>
        {label}
      </Txt>
    </g>
  );
}

/** Source → out and return conductors → load. Live labels for length, current and voltage at the load. */
export function CircuitDiagram({
  three = false,
  lengthLabel = 'L (one way)',
  ampsLabel = 'I',
  sourceLabel = 'V',
  loadLabel,
  dropLabel,
}: {
  three?: boolean;
  lengthLabel?: string;
  ampsLabel?: string;
  sourceLabel?: string;
  loadLabel?: string;
  dropLabel?: string;
}) {
  const wires = three ? [62, 84, 106] : [70, 104];
  return (
    <Svg
      label={`Circuit: source ${sourceLabel}, ${three ? 'three line conductors' : 'an outgoing and a return conductor'} of length ${lengthLabel} to the load, carrying ${ampsLabel}${dropLabel ? `, voltage drop ${dropLabel}` : ''}${loadLabel ? `, ${loadLabel} at the load` : ''}`}
      viewBox="0 0 340 170"
    >
      <rect x={14} y={48} width={62} height={70} rx={6} style={{ fill: v('box'), stroke: v('edge') }} strokeWidth={1.4} />
      <Txt x={45} y={80} anchor="middle" size={11} weight={700}>
        Source
      </Txt>
      <Txt x={45} y={96} anchor="middle" size={10.5}>
        {sourceLabel}
      </Txt>
      <rect x={264} y={48} width={62} height={70} rx={6} style={{ fill: v('box'), stroke: v('edge') }} strokeWidth={1.4} />
      <Txt x={295} y={80} anchor="middle" size={11} weight={700}>
        Load
      </Txt>
      {loadLabel && (
        <Txt x={295} y={96} anchor="middle" size={10.5}>
          {loadLabel}
        </Txt>
      )}
      {wires.map((y, i) => (
        <line key={y} x1={76} y1={y} x2={264} y2={y} style={{ stroke: i === wires.length - 1 && !three ? v('wire-2') : v('wire') }} strokeWidth={3} />
      ))}
      {!three && (
        <>
          <Txt x={170} y={64} anchor="middle" size={10}>
            out →
          </Txt>
          <Txt x={170} y={118} anchor="middle" size={10}>
            ← return
          </Txt>
        </>
      )}
      <line x1={76} y1={140} x2={264} y2={140} style={{ stroke: v('dim') }} strokeWidth={1.2} />
      <line x1={76} y1={135} x2={76} y2={145} style={{ stroke: v('dim') }} strokeWidth={1.2} />
      <line x1={264} y1={135} x2={264} y2={145} style={{ stroke: v('dim') }} strokeWidth={1.2} />
      <Tag x={170} y={140} label={lengthLabel} />
      <Tag x={170} y={24} label={dropLabel ? `${ampsLabel} · drop ${dropLabel}` : ampsLabel} color="wire" />
    </Svg>
  );
}

/** Common wires drawn to scale, with the nearest metric size. */
export function GaugeScaleDiagram() {
  const sizes: { awg: string; dIn: number; mm2: string }[] = [
    { awg: '14', dIn: 0.0641, mm2: '2.08' },
    { awg: '12', dIn: 0.0808, mm2: '3.31' },
    { awg: '10', dIn: 0.1019, mm2: '5.26' },
    { awg: '8', dIn: 0.1285, mm2: '8.37' },
    { awg: '6', dIn: 0.162, mm2: '13.3' },
    { awg: '4', dIn: 0.2043, mm2: '21.2' },
  ];
  const k = 230; // px per inch
  let x = 20;
  return (
    <Svg label="Copper conductors 14, 12, 10, 8, 6 and 4 AWG drawn to scale with their areas in square millimetres: a smaller gauge number is a thicker wire" viewBox="0 0 340 150">
      {sizes.map((s) => {
        const r = (s.dIn * k) / 2;
        const cx = x + r;
        x += 2 * r + 14;
        return (
          <g key={s.awg}>
            <circle cx={cx} cy={64} r={r} style={{ fill: v('copper'), stroke: v('edge') }} strokeWidth={1} />
            <Txt x={cx} y={112} anchor="middle" size={10.5} weight={700}>
              {s.awg} AWG
            </Txt>
            <Txt x={cx} y={127} anchor="middle" size={9.5}>
              {s.mm2} mm²
            </Txt>
          </g>
        );
      })}
      <Txt x={170} y={145} anchor="middle" size={9.5}>
        Smaller gauge number = thicker wire · every 3 gauges ≈ double the area
      </Txt>
    </Svg>
  );
}

/** Ladder of sizes with the voltage-drop pick and the ampacity pick marked; the larger one is chosen. */
export function TwoChecksDiagram({ sizes, dropIndex, ampIndex, chosenIndex }: { sizes: string[]; dropIndex: number; ampIndex: number; chosenIndex: number }) {
  const show = sizes.slice(0, Math.min(sizes.length, 9));
  const step = 300 / show.length;
  const xAt = (i: number) => 20 + step * i + step / 2;
  return (
    <Svg label={`Wire sizes from small to large. Voltage drop needs ${sizes[dropIndex] || 'none'}, ampacity needs ${sizes[ampIndex] || 'none'}; the larger, ${sizes[chosenIndex] || 'none'}, is chosen.`} viewBox="0 0 340 120">
      {show.map((s, i) => (
        <g key={s}>
          <rect x={20 + step * i + 2} y={46} width={step - 4} height={22} rx={4} style={{ fill: i === chosenIndex ? v('ok') : v('box'), stroke: v('edge') }} strokeWidth={1} />
          <Txt x={xAt(i)} y={61} anchor="middle" size={9.5} weight={i === chosenIndex ? 700 : 400} color={i === chosenIndex ? 'label-bg' : 'text'}>
            {s.replace(' AWG', '').replace(' kcmil', 'k').replace(' mm²', '')}
          </Txt>
        </g>
      ))}
      {dropIndex >= 0 && dropIndex < show.length && <Tag x={xAt(dropIndex)} y={24} label="drop" color="wire-2" />}
      {ampIndex >= 0 && ampIndex < show.length && <Tag x={xAt(ampIndex)} y={92} label="amps" color="wire" />}
      <Txt x={170} y={116} anchor="middle" size={9.5}>
        Smaller ← sizes → larger · the larger of the two checks wins (green)
      </Txt>
    </Svg>
  );
}
