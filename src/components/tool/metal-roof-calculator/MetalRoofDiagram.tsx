import React from 'react';
import s from './MetalRoofDiagram.module.css';

/* One roof plane covered in panels, and a metal-vs-asphalt bar comparison.
   The plane drawing repeats values shown as text, so it is hidden from assistive tech. */

export function PanelDiagram({ kind, countLabel, lengthLabel, widthLabel }: { kind: 'standingSeam' | 'corrugated' | 'metalShingle'; countLabel: string; lengthLabel: string; widthLabel: string }) {
  // trapezoid-free: a rectangular plane seen square-on, eave at the bottom, ridge at the top
  const x0 = 40;
  const x1 = 280;
  const y0 = 40;
  const y1 = 170;
  const lines: React.ReactNode[] = [];
  if (kind === 'standingSeam') {
    for (let x = x0 + 20; x < x1; x += 20) lines.push(<line key={x} className={s.seam} x1={x} y1={y0} x2={x} y2={y1} />);
  } else if (kind === 'corrugated') {
    for (let x = x0; x < x1; x += 8) lines.push(<line key={x} className={s.rib} x1={x} y1={y0} x2={x} y2={y1} />);
    for (let x = x0 + 48; x < x1; x += 48) lines.push(<line key={`lap${x}`} className={s.lap} x1={x} y1={y0} x2={x} y2={y1} />);
    for (let y = y0 + 20; y < y1; y += 32) for (let x = x0 + 8; x < x1; x += 16) lines.push(<circle key={`sc${x}-${y}`} className={s.screw} cx={x} cy={y} r={1.4} />);
  } else {
    for (let y = y0; y < y1; y += 14) {
      const off = ((y - y0) / 14) % 2 ? 15 : 0;
      for (let x = x0 - off; x < x1; x += 30) lines.push(<path key={`t${x}-${y}`} className={s.tile} d={`M${Math.max(x0, x)} ${y + 14} V${y + 4} Q${Math.max(x0, x) + 15} ${y - 2} ${Math.min(x1, x + 30)} ${y + 4} V${y + 14}`} />);
    }
  }
  return (
    <svg className={s.svg} viewBox="0 0 330 220" aria-hidden="true" focusable="false">
      <rect className={s.plane} x={x0} y={y0} width={x1 - x0} height={y1 - y0} />
      {lines}
      <rect className={s.ridge} x={x0 - 4} y={y0 - 8} width={x1 - x0 + 8} height={9} rx={2} />
      <rect className={s.eave} x={x0 - 4} y={y1} width={x1 - x0 + 8} height={5} rx={1} />
      <text className={s.small} x={(x0 + x1) / 2} y={y0 - 14} textAnchor="middle">
        ridge cap
      </text>
      <text className={s.small} x={(x0 + x1) / 2} y={y1 + 20} textAnchor="middle">
        eave trim
      </text>
      {kind !== 'metalShingle' && (
        <>
          <line className={s.dim} x1={x1 + 16} y1={y0} x2={x1 + 16} y2={y1} />
          <line className={s.dim} x1={x1 + 10} y1={y0} x2={x1 + 22} y2={y0} />
          <line className={s.dim} x1={x1 + 10} y1={y1} x2={x1 + 22} y2={y1} />
          <text className={s.label} x={x1 + 20} y={(y0 + y1) / 2 + 4} textAnchor="start">
            <tspan x={x1 + 22}>{lengthLabel}</tspan>
          </text>
          <line className={s.dimAccent} x1={x0 + 20} y1={y1 + 30} x2={x0 + (kind === 'standingSeam' ? 40 : 68)} y2={y1 + 30} />
          <text className={s.labelAccent} x={x0 + (kind === 'standingSeam' ? 46 : 74)} y={y1 + 34}>
            {widthLabel}
          </text>
        </>
      )}
      <text className={s.label} x={(x0 + x1) / 2} y={(y0 + y1) / 2 + 4} textAnchor="middle">
        {countLabel}
      </text>
    </svg>
  );
}

export function CompareBars({ rows, format }: { rows: { label: string; metal: number; asphalt: number }[]; format: (n: number) => string }) {
  return (
    <div className={s.compare}>
      {rows.map((r) => {
        const max = Math.max(r.metal, r.asphalt, 1);
        return (
          <div key={r.label} className={s.group}>
            <p className={s.groupLabel}>{r.label}</p>
            <div className={s.barRow}>
              <span className={s.barName}>Metal</span>
              <span className={s.track}>
                <span className={`${s.fill} ${s.metal}`} style={{ width: `${(r.metal / max) * 100}%` }} />
              </span>
              <strong className={s.barValue}>{format(r.metal)}</strong>
            </div>
            <div className={s.barRow}>
              <span className={s.barName}>Asphalt</span>
              <span className={s.track}>
                <span className={`${s.fill} ${s.asphalt}`} style={{ width: `${(r.asphalt / max) * 100}%` }} />
              </span>
              <strong className={s.barValue}>{format(r.asphalt)}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}
