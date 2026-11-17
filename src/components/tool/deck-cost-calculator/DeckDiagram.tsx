'use client';

import React, { useState } from 'react';
import styles from './DeckDiagram.module.css';
import type { DeckCostResult, DeckCostInput } from '@/lib/deck-cost-engine';

interface DeckDiagramProps {
  input: DeckCostInput;
  result: DeckCostResult;
}

export function DeckDiagram({ input, result }: DeckDiagramProps) {
  const [view, setView] = useState<'framing' | 'decking'>('decking');

  const s = input.sections[0] || { lengthFt: 16, widthFt: 12, isAttached: true, houseEdge: 'length' as const };
  const lengthFt = Math.max(4, s.lengthFt || 16);
  const widthFt = Math.max(4, s.widthFt || 12);

  // SVG dimensions
  const svgWidth = 500;
  const svgHeight = 320;
  const padding = 50;

  const availW = svgWidth - padding * 2;
  const availH = svgHeight - padding * 2;

  // Scale based on aspect ratio
  const scale = Math.min(availW / lengthFt, availH / widthFt);
  const deckW = lengthFt * scale;
  const deckH = widthFt * scale;

  const deckX = padding + (availW - deckW) / 2;
  const deckY = padding + (availH - deckH) / 2;

  // Framing calculations
  const joistSpacingFt = (input.framing.joistSpacingIn || 16) / 12;
  const joistStep = joistSpacingFt * scale;
  const joistCount = Math.floor(deckW / joistStep);

  // Post / Beam positions
  const beamY = deckY + deckH * 0.75;
  const postCount = Math.max(2, Math.ceil(lengthFt / (input.framing.postSpacingFt || 8)) + 1);
  const postStep = deckW / (postCount - 1);

  // Board lines for decking view
  const boardPitchFt = (input.boardWidthIn + (input.gapIn || 0.1875)) / 12;
  const boardStep = Math.max(3, boardPitchFt * scale);
  const boardCount = Math.floor(deckH / boardStep);

  // House edge
  const isHouseTop = s.isAttached && s.houseEdge === 'length';

  return (
    <div className={styles.diagramCard}>
      <div className={styles.diagramHead}>
        <h3 className={styles.diagramTitle}>Visual Plan & Framing Layout</h3>
        <div className={styles.tabGroup}>
          <button
            type="button"
            className={`${styles.tabBtn} ${view === 'decking' ? styles.tabBtnActive : ''}`}
            onClick={() => setView('decking')}
          >
            Decking & Railing
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${view === 'framing' ? styles.tabBtnActive : ''}`}
            onClick={() => setView('framing')}
          >
            Joists & Footings
          </button>
        </div>
      </div>

      <div className={styles.svgWrap}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.svg} role="img" aria-label="Deck layout diagram">
          <defs>
            <pattern id="woodGrain" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0,5 Q 10,2 20,5 M 0,15 Q 10,18 20,15" stroke="#cbd5e1" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width={svgWidth} height={svgHeight} fill="#f8fafc" />

          {/* House Wall / Ledger */}
          {s.isAttached && (
            <g>
              <line
                x1={deckX - 20}
                y1={deckY}
                x2={deckX + deckW + 20}
                y2={deckY}
                stroke="#334155"
                strokeWidth="6"
                strokeDasharray="8 4"
              />
              <text
                x={deckX + deckW / 2}
                y={deckY - 10}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#475569"
              >
                HOUSE WALL / LEDGER BOARD ({lengthFt}&apos;)
              </text>
            </g>
          )}

          {/* Main Deck Outline */}
          <rect
            x={deckX}
            y={deckY}
            width={deckW}
            height={deckH}
            fill={view === 'decking' ? '#e2e8f0' : '#f1f5f9'}
            stroke="#0284c7"
            strokeWidth="2.5"
            rx="2"
          />

          {view === 'framing' ? (
            /* Framing View */
            <g>
              {/* Rim Joists */}
              <rect x={deckX} y={deckY} width={deckW} height={deckH} fill="none" stroke="#64748b" strokeWidth="3" />

              {/* Joists */}
              {Array.from({ length: joistCount + 1 }).map((_, idx) => {
                const jx = deckX + idx * joistStep;
                if (jx > deckX + deckW) return null;
                return (
                  <line
                    key={`joist-${idx}`}
                    x1={jx}
                    y1={deckY}
                    x2={jx}
                    y2={deckY + deckH}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Beam line */}
              <line
                x1={deckX}
                y1={beamY}
                x2={deckX + deckW}
                y2={beamY}
                stroke="#0369a1"
                strokeWidth="4"
              />

              {/* Posts / Footings */}
              {Array.from({ length: postCount }).map((_, idx) => {
                const px = deckX + idx * postStep;
                return (
                  <g key={`post-${idx}`}>
                    {/* Concrete Footing Circle */}
                    <circle cx={px} cy={beamY} r="9" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                    {/* Post Square */}
                    <rect x={px - 4} y={beamY - 4} width="8" height="8" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                  </g>
                );
              })}

              <text x={deckX + deckW / 2} y={beamY + 22} textAnchor="middle" fontSize="10" fontWeight="600" fill="#0369a1">
                Drop Beam &amp; {result.framing.footingCount} Pier Footings
              </text>
            </g>
          ) : (
            /* Decking View */
            <g>
              {/* Pattern lines */}
              {input.pattern === 'diagonal' ? (
                // Diagonal stripes
                Array.from({ length: 24 }).map((_, idx) => {
                  const offset = idx * 24 - 150;
                  return (
                    <line
                      key={`diag-${idx}`}
                      x1={deckX + offset}
                      y1={deckY}
                      x2={deckX + offset + deckH}
                      y2={deckY + deckH}
                      stroke="#cbd5e1"
                      strokeWidth="1.2"
                      clipPath="url(#deckClip)"
                    />
                  );
                })
              ) : (
                // Straight lines
                Array.from({ length: boardCount }).map((_, idx) => {
                  const by = deckY + idx * boardStep;
                  return (
                    <line
                      key={`board-${idx}`}
                      x1={deckX}
                      y1={by}
                      x2={deckX + deckW}
                      y2={by}
                      stroke="#94a3b8"
                      strokeWidth="1.2"
                    />
                  );
                })
              )}

              {/* Picture Frame Border */}
              {input.pictureFrame && (
                <rect
                  x={deckX + 4}
                  y={deckY + 4}
                  width={deckW - 8}
                  height={deckH - 8}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3"
                />
              )}

              {/* Railing line along exposed perimeter */}
              {input.railing.include && (
                <g>
                  {/* Left Railing */}
                  <line x1={deckX} y1={deckY} x2={deckX} y2={deckY + deckH} stroke="#0ea5e9" strokeWidth="4" />
                  {/* Right Railing */}
                  <line x1={deckX + deckW} y1={deckY} x2={deckX + deckW} y2={deckY + deckH} stroke="#0ea5e9" strokeWidth="4" />
                  {/* Outer bottom Railing (minus stair gap) */}
                  <line
                    x1={deckX}
                    y1={deckY + deckH}
                    x2={deckX + deckW * 0.65}
                    y2={deckY + deckH}
                    stroke="#0ea5e9"
                    strokeWidth="4"
                  />
                  {!isHouseTop && (
                    <line x1={deckX} y1={deckY} x2={deckX + deckW} y2={deckY} stroke="#0ea5e9" strokeWidth="4" />
                  )}
                </g>
              )}

              {/* Stairs attached to bottom */}
              {input.stairs.include && (
                <g>
                  <rect
                    x={deckX + deckW * 0.68}
                    y={deckY + deckH}
                    width={deckW * 0.28}
                    height="24"
                    fill="#cbd5e1"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={deckX + deckW * 0.68}
                    y1={deckY + deckH + 8}
                    x2={deckX + deckW * 0.96}
                    y2={deckY + deckH + 8}
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                  <line
                    x1={deckX + deckW * 0.68}
                    y1={deckY + deckH + 16}
                    x2={deckX + deckW * 0.96}
                    y2={deckY + deckH + 16}
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                  <text
                    x={deckX + deckW * 0.82}
                    y={deckY + deckH + 36}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="#334155"
                  >
                    Stairs ({result.stairs.riserCount} steps)
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Dimension annotations */}
          {/* Width */}
          <text
            x={deckX - 12}
            y={deckY + deckH / 2}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="#64748b"
            transform={`rotate(-90, ${deckX - 12}, ${deckY + deckH / 2})`}
          >
            {widthFt} FT
          </text>
          {/* Length */}
          <text
            x={deckX + deckW / 2}
            y={deckY + deckH + 18}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="#64748b"
          >
            {lengthFt} FT
          </text>
        </svg>
      </div>

      <div className={styles.legend}>
        {view === 'decking' ? (
          <>
            <span className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#94a3b8' }} />
              Deck Boards ({input.boardWidthIn}&quot; {input.pattern})
            </span>
            {input.railing.include && (
              <span className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#0ea5e9' }} />
                Railing ({result.railing.lengthLf} LF)
              </span>
            )}
            {input.pictureFrame && (
              <span className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#0284c7' }} />
                Picture Frame Border
              </span>
            )}
          </>
        ) : (
          <>
            <span className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#94a3b8' }} />
              Joists ({input.framing.joistSpacingIn}&quot; o.c.)
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#0369a1' }} />
              Beam ({result.framing.beamCount} rows)
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendColor} style={{ background: '#0284c7' }} />
              Posts &amp; Pier Footings ({result.framing.footingCount})
            </span>
          </>
        )}
      </div>
    </div>
  );
}
