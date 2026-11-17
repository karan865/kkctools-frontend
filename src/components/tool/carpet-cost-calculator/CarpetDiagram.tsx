'use client';

import React, { useState } from 'react';
import type { RollLayoutResult, StairsInput } from '@/lib/carpet-engine';
import styles from './CarpetDiagram.module.css';

interface CarpetDiagramProps {
  layouts: RollLayoutResult[];
  stairs: StairsInput;
  rollWidthFt: number;
}

export default function CarpetDiagram({ layouts, stairs, rollWidthFt }: CarpetDiagramProps) {
  const [activeTab, setActiveTab] = useState<'room' | 'stairs'>('room');
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);

  const activeLayout = layouts[selectedRoomIdx] || layouts[0] || {
    roomName: 'Sample Room',
    netAreaSqFt: 144,
    orientation: 'lengthwise',
    drops: 1,
    cutLengthFt: 12.5,
    boughtSqFt: 150,
    seams: 0,
    wasteSqFt: 6,
    wastePercent: 4.17,
  };

  // SVG dimensions for room view
  const viewBoxW = 560;
  const viewBoxH = 340;
  const padding = 40;

  // We map the purchased roll width & length into the SVG viewport
  // Purchased dimensions:
  // Drops * rollWidthFt (across) and cutLengthFt (along)
  const isWidthwise = activeLayout.orientation === 'widthwise';
  const totalAcrossFt = Math.max(1, activeLayout.drops * rollWidthFt);
  const totalAlongFt = Math.max(1, activeLayout.cutLengthFt);

  // Scale to fit viewport
  const drawW = viewBoxW - padding * 2 - 80;
  const drawH = viewBoxH - padding * 2 - 40;

  const scale = Math.min(drawW / totalAcrossFt, drawH / totalAlongFt);
  const rollBoxW = totalAcrossFt * scale;
  const rollBoxH = totalAlongFt * scale;

  const startX = padding + 60;
  const startY = padding + 20;

  // Actual room dimensions:
  // Room area = netAreaSqFt. If orientation is lengthwise, Room along = cutLength - 0.5. Room across = net / roomAlong.
  const roomAlongFt = Math.max(1, activeLayout.cutLengthFt - 0.5);
  const roomAcrossFt = Math.max(1, activeLayout.netAreaSqFt / roomAlongFt);

  const roomBoxW = roomAcrossFt * scale;
  const roomBoxH = roomAlongFt * scale;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Visual Takeoff Diagram</h3>
          <p className={styles.subtitle}>
            {activeTab === 'room'
              ? 'Roll width strips, seam placement & off-cut waste'
              : 'Stair runner geometry, treads & risers'}
          </p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'room' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('room')}
          >
            Roll Layout
          </button>
          {stairs.enabled && stairs.steps > 0 && (
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'stairs' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('stairs')}
            >
              Stairs Runner
            </button>
          )}

          {activeTab === 'room' && layouts.length > 1 && (
            <select
              className={styles.roomSelect}
              value={selectedRoomIdx}
              onChange={(e) => setSelectedRoomIdx(Number(e.target.value))}
              aria-label="Select room for diagram"
            >
              {layouts.map((l, i) => (
                <option key={i} value={i}>
                  {l.roomName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className={styles.svgWrap}>
        {activeTab === 'room' ? (
          <svg
            className={styles.svg}
            viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
            role="img"
            aria-label={`Carpet roll layout diagram for ${activeLayout.roomName}`}
          >
            <defs>
              <pattern
                id="wastePattern"
                width="8"
                height="8"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="8" stroke="#EF4444" strokeWidth="1.5" />
                <rect width="8" height="8" fill="#FEE2E2" fillOpacity="0.4" />
              </pattern>
            </defs>

            {/* Purchased Carpet Roll Bounding Area (Full cuts bought) */}
            <rect
              x={startX}
              y={startY}
              width={rollBoxW}
              height={rollBoxH}
              className={styles.wasteHatch}
            />

            {/* Actual Room Installed Carpet Area */}
            <rect
              x={startX}
              y={startY}
              width={roomBoxW}
              height={roomBoxH}
              className={styles.carpetStrip}
            />

            {/* Room Boundary Stroke */}
            <rect
              x={startX}
              y={startY}
              width={roomBoxW}
              height={roomBoxH}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2.5"
            />

            {/* Seam lines if multiple drops */}
            {activeLayout.drops > 1 &&
              Array.from({ length: activeLayout.drops - 1 }).map((_, i) => {
                const seamX = startX + (i + 1) * rollWidthFt * scale;
                if (seamX < startX + roomBoxW) {
                  return (
                    <g key={i}>
                      <line
                        x1={seamX}
                        y1={startY}
                        x2={seamX}
                        y2={startY + roomBoxH}
                        className={styles.seamLine}
                      />
                      <rect
                        x={seamX - 35}
                        y={startY + roomBoxH / 2 - 10}
                        width={70}
                        height={20}
                        rx={4}
                        fill="var(--surface)"
                        stroke="#C2410C"
                        strokeWidth="1"
                      />
                      <text
                        x={seamX}
                        y={startY + roomBoxH / 2 + 4}
                        className={styles.labelHighlight}
                      >
                        Seam #{i + 1}
                      </text>
                    </g>
                  );
                }
                return null;
              })}

            {/* Strip labels */}
            {Array.from({ length: activeLayout.drops }).map((_, i) => {
              const stripStartX = startX + i * rollWidthFt * scale;
              const stripW = Math.min(rollWidthFt * scale, startX + rollBoxW - stripStartX);
              return (
                <text
                  key={i}
                  x={stripStartX + stripW / 2}
                  y={startY + 20}
                  className={styles.labelMuted}
                >
                  Drop #{i + 1} ({rollWidthFt}&apos; roll)
                </text>
              );
            })}

            {/* Dimensions: Across (Width / Roll) */}
            <line
              x1={startX}
              y1={startY - 12}
              x2={startX + roomBoxW}
              y2={startY - 12}
              className={styles.dimLine}
            />
            <circle cx={startX} cy={startY - 12} r={2.5} className={styles.dimArrow} />
            <circle cx={startX + roomBoxW} cy={startY - 12} r={2.5} className={styles.dimArrow} />
            <text x={startX + roomBoxW / 2} y={startY - 16} className={styles.label}>
              Room {isWidthwise ? 'Length' : 'Width'}: {roomAcrossFt.toFixed(1)} ft
            </text>

            {/* Dimensions: Along (Length / Unroll) */}
            <line
              x1={startX - 14}
              y1={startY}
              x2={startX - 14}
              y2={startY + roomBoxH}
              className={styles.dimLine}
            />
            <circle cx={startX - 14} cy={startY} r={2.5} className={styles.dimArrow} />
            <circle cx={startX - 14} cy={startY + roomBoxH} r={2.5} className={styles.dimArrow} />
            <text
              x={startX - 22}
              y={startY + roomBoxH / 2}
              className={styles.label}
              transform={`rotate(-90 ${startX - 22} ${startY + roomBoxH / 2})`}
            >
              Room {isWidthwise ? 'Width' : 'Length'}: {roomAlongFt.toFixed(1)} ft
            </text>

            {/* Cut length dimension including 6" trim allowance */}
            <line
              x1={startX + rollBoxW + 14}
              y1={startY}
              x2={startX + rollBoxW + 14}
              y2={startY + rollBoxH}
              className={styles.dimLine}
            />
            <text
              x={startX + rollBoxW + 24}
              y={startY + rollBoxH / 2}
              className={styles.labelMuted}
              transform={`rotate(90 ${startX + rollBoxW + 24} ${startY + rollBoxH / 2})`}
            >
              Cut Length: {activeLayout.cutLengthFt.toFixed(1)} ft (+6&quot; trim)
            </text>

            {/* Off-cut / Remnant Label */}
            {activeLayout.wasteSqFt > 0 && (
              <text
                x={startX + (roomBoxW + rollBoxW) / 2}
                y={startY + roomBoxH / 2}
                className={styles.labelMuted}
              >
                Off-cut / Waste
              </text>
            )}
          </svg>
        ) : (
          /* Stairs Runner Profile Diagram */
          <svg
            className={styles.svg}
            viewBox="0 0 560 300"
            role="img"
            aria-label="Stairs carpet installation profile"
          >
            <defs>
              <linearGradient id="carpetRunnerGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C2410C" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>

            {/* Stairs Treads and Risers Steps */}
            {[0, 1, 2, 3, 4].map((step) => {
              const x = 70 + step * 70;
              const y = 240 - step * 45;
              return (
                <g key={step}>
                  {/* Riser */}
                  <rect x={x} y={y - 45} width={12} height={45} fill="#D4D4D8" stroke="#71717A" />
                  {/* Tread */}
                  <rect x={x} y={y - 50} width={82} height={12} rx={2} fill="#E4E4E7" stroke="#71717A" />
                  {/* Carpet Runner Cushion & Wrap */}
                  <path
                    d={`M${x - 2} ${y} L${x - 2} ${y - 46} Q${x} ${y - 52} ${x + 6} ${y - 52} L${x + 80} ${y - 52}`}
                    fill="none"
                    stroke="url(#carpetRunnerGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {/* Step label on tread 2 */}
                  {step === 1 && (
                    <text x={x + 40} y={y - 58} className={styles.label}>
                      Tread ({stairs.treadDepthIn}&quot;)
                    </text>
                  )}
                  {step === 2 && (
                    <text x={x - 25} y={y - 20} className={styles.label}>
                      Riser ({stairs.riserHeightIn}&quot;)
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nosing wrap callout */}
            <circle cx={216} cy={142} r={14} fill="none" stroke="#C2410C" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x={250} y={120} className={styles.labelHighlight}>
              Nosing Wrap ({stairs.nosingWrapIn}&quot;)
            </text>
            <line x1={228} y1={138} x2={245} y2={124} stroke="#C2410C" strokeWidth="1.2" />

            <text x={280} y={280} className={styles.label}>
              Total {stairs.steps} Steps · Style:{' '}
              {stairs.style === 'box' ? 'Box (Cap & Band Hand-Tailored)' : 'Waterfall (Straight Runner)'}
            </text>
          </svg>
        )}
      </div>

      {activeTab === 'room' && (
        <>
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Room Net Area</span>
              <span className={styles.statVal}>{activeLayout.netAreaSqFt} sq ft</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Carpet to Buy</span>
              <span className={styles.statVal}>{activeLayout.boughtSqFt} sq ft</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Roll Strips (Drops)</span>
              <span className={styles.statVal}>{activeLayout.drops} strip{activeLayout.drops > 1 ? 's' : ''}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Seams Required</span>
              <span className={styles.statVal}>{activeLayout.seams} seam{activeLayout.seams !== 1 ? 's' : ''}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Cutting Overage</span>
              <span className={styles.statVal}>{activeLayout.wastePercent}% ({activeLayout.wasteSqFt} sq ft)</span>
            </div>
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.legendCarpet}`} />
              <span>Installed Carpet Room Area</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.legendSeam}`} />
              <span>Seam Iron Heat-Tape Line</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.legendWaste}`} />
              <span>Off-Cut Remnant (12&apos; Roll Waste)</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
