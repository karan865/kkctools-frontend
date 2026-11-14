'use client';

import React, { useState, useId } from 'react';
import styles from './PaverSandCalculator.module.css';
import {
  calculatePaverSand,
  PaverStyle,
  JointWidth,
} from '@/lib/paver-sand-engine';

export default function PaverSandCalculator() {
  const lengthId = useId();
  const widthId = useId();
  const directAreaId = useId();
  const depthId = useId();
  const paverStyleId = useId();
  const jointWidthId = useId();
  const beddingPriceId = useId();
  const jointPriceId = useId();

  const [mode, setMode] = useState<'dimensions' | 'area'>('dimensions');
  const [lengthFeet, setLengthFeet] = useState<number>(20);
  const [widthFeet, setWidthFeet] = useState<number>(15);
  const [directArea, setDirectArea] = useState<number>(300);

  const [beddingDepth, setBeddingDepth] = useState<number>(1.0);
  const [includeJointSand, setIncludeJointSand] = useState<boolean>(true);
  const [paverStyle, setPaverStyle] = useState<PaverStyle>('standard-brick');
  const [jointWidth, setJointWidth] = useState<JointWidth>('1/8');
  const [bufferPercent, setBufferPercent] = useState<number>(10);

  const [beddingCostPerTon, setBeddingCostPerTon] = useState<string>('40.00');
  const [jointCostPerBag, setJointCostPerBag] = useState<string>('28.00');

  const effectiveArea = mode === 'dimensions' ? lengthFeet * widthFeet : directArea;
  const beddingPrice = parseFloat(beddingCostPerTon);
  const jointPrice = parseFloat(jointCostPerBag);

  const results = calculatePaverSand({
    areaSqFt: effectiveArea,
    beddingDepthInches: beddingDepth,
    includeJointSand,
    paverStyle,
    jointWidth,
    bufferPercent,
    beddingCostPerTon: isNaN(beddingPrice) ? undefined : beddingPrice,
    jointCostPerBag: isNaN(jointPrice) ? undefined : jointPrice,
  });

  return (
    <div className={styles.container}>
      <div className={styles.calculatorGrid}>
        {/* Left Column: 4 Step Cards */}
        <div className={styles.leftColumn}>
          {/* Card 1: Patio / Walkway Dimensions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>1</span>
              <h2 className={styles.cardTitle}>Patio / Walkway Dimensions</h2>
            </div>

            <div className={styles.modeSwitch}>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === 'dimensions' ? styles.modeBtnActive : ''}`}
                onClick={() => setMode('dimensions')}
              >
                Dimensions (Length × Width)
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === 'area' ? styles.modeBtnActive : ''}`}
                onClick={() => setMode('area')}
              >
                Direct Area (Sq Ft)
              </button>
            </div>

            {mode === 'dimensions' ? (
              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label htmlFor={lengthId} className={styles.label}>
                    Length (Feet)
                  </label>
                  <input
                    id={lengthId}
                    type="number"
                    min="1"
                    step="any"
                    className={styles.input}
                    value={lengthFeet || ''}
                    onChange={(e) => setLengthFeet(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 20"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor={widthId} className={styles.label}>
                    Width (Feet)
                  </label>
                  <input
                    id={widthId}
                    type="number"
                    min="1"
                    step="any"
                    className={styles.input}
                    value={widthFeet || ''}
                    onChange={(e) => setWidthFeet(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 15"
                  />
                </div>
              </div>
            ) : (
              <div className={styles.inputGroup}>
                <label htmlFor={directAreaId} className={styles.label}>
                  Total Patio Area (Square Feet)
                </label>
                <input
                  id={directAreaId}
                  type="number"
                  min="1"
                  step="any"
                  className={styles.input}
                  value={directArea || ''}
                  onChange={(e) => setDirectArea(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 300"
                />
              </div>
            )}
            <span className={styles.helperText}>
              Total calculated surface coverage: {effectiveArea} sq ft
            </span>
          </div>

          {/* Card 2: Bedding Sand Layer */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>2</span>
              <h2 className={styles.cardTitle}>Bedding Sand Layer (ASTM C33)</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={depthId} className={styles.label}>
                Bedding Sand Depth
              </label>
              <select
                id={depthId}
                className={styles.select}
                value={beddingDepth}
                onChange={(e) => setBeddingDepth(parseFloat(e.target.value))}
              >
                <option value={1.0}>1.0 Inch (Industry Standard Code)</option>
                <option value={0.75}>0.75 Inch (Thin Screed)</option>
                <option value={1.25}>1.25 Inch (Deep Cushion)</option>
              </select>
              <span className={styles.helperText}>
                Sharp washed ASTM C33 concrete sand (~100 lbs/cu ft / 1.35 tons/yd³)
              </span>
            </div>
          </div>

          {/* Card 3: Polymeric Joint Sand */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>3</span>
              <h2 className={styles.cardTitle}>Polymeric Joint Sand Layer</h2>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Joint Sand Requirement</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${includeJointSand ? styles.toggleButtonActive : ''}`}
                  onClick={() => setIncludeJointSand(true)}
                >
                  Include Polymeric Sand
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${!includeJointSand ? styles.toggleButtonActive : ''}`}
                  onClick={() => setIncludeJointSand(false)}
                >
                  Bedding Sand Only
                </button>
              </div>
            </div>

            {includeJointSand && (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor={paverStyleId} className={styles.label}>
                    Paver Sizing Style
                  </label>
                  <select
                    id={paverStyleId}
                    className={styles.select}
                    value={paverStyle}
                    onChange={(e) => setPaverStyle(e.target.value as PaverStyle)}
                  >
                    <option value="standard-brick">Standard Brick Paver (4&quot; × 8&quot;, 2-3/8&quot; thick)</option>
                    <option value="modular-3piece">Cobble / 3-Piece Modular (6×6, 6×9)</option>
                    <option value="large-format">Large Format Architectural Slab (12×12 to 24×24)</option>
                    <option value="flagstone">Irregular Natural Flagstone</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor={jointWidthId} className={styles.label}>
                    Joint Gap Width
                  </label>
                  <select
                    id={jointWidthId}
                    className={styles.select}
                    value={jointWidth}
                    onChange={(e) => setJointWidth(e.target.value as JointWidth)}
                  >
                    <option value="1/8">1/8&quot; (Standard tight joint)</option>
                    <option value="1/4">1/4&quot; (Rustic / tumbled gap)</option>
                    <option value="1/2">1/2&quot; (Wide flagstone joint)</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Card 4: Buffer & Pricing */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>4</span>
              <h2 className={styles.cardTitle}>Compaction Buffer &amp; Pricing</h2>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Compaction &amp; Spillage Buffer</label>
              <div className={styles.pillsRow}>
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`${styles.pillButton} ${bufferPercent === pct ? styles.pillButtonActive : ''}`}
                    onClick={() => setBufferPercent(pct)}
                  >
                    {pct === 10 ? '10% (Recommended)' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label htmlFor={beddingPriceId} className={styles.label}>
                  Bedding Sand ($/ton)
                </label>
                <input
                  id={beddingPriceId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={beddingCostPerTon}
                  onChange={(e) => setBeddingCostPerTon(e.target.value)}
                  placeholder="e.g. 40.00"
                />
              </div>

              {includeJointSand && (
                <div className={styles.inputGroup}>
                  <label htmlFor={jointPriceId} className={styles.label}>
                    Polymeric Sand ($/bag)
                  </label>
                  <input
                    id={jointPriceId}
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.input}
                    value={jointCostPerBag}
                    onChange={(e) => setJointCostPerBag(e.target.value)}
                    placeholder="e.g. 28.00"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Output Results */}
        <div className={styles.rightColumn}>
          {/* Primary Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>Bedding Sand Required</div>
            <div className={styles.heroValue}>{results.beddingCubicYards} Cu Yds</div>
            <div className={styles.heroSubtext}>
              Equivalent to {results.beddingTons} Tons ({results.beddingCuFt} cu ft) with {bufferPercent}% buffer
            </div>
          </div>

          {/* Breakdown Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Complete Hardscaping Sand Schedule</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Patio Surface Area</span>
              <span className={styles.breakdownValue}>{results.areaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Bedding Sand Volume (1&quot; Screed)</span>
              <span className={styles.breakdownValue}>{results.beddingCuFt} cu ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Bedding Sand Bulk Volume</span>
              <span className={styles.breakdownValue} style={{ color: '#0369A1', fontWeight: 800 }}>
                {results.beddingCubicYards} Cubic Yards
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Bedding Sand Weight</span>
              <span className={styles.breakdownValue}>{results.beddingTons} US Short Tons</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Bedding 50 lb Bags (if bagged)</span>
              <span className={styles.breakdownValue}>{results.beddingBags50Lb} Bags</span>
            </div>

            {includeJointSand && (
              <div className={styles.breakdownRow} style={{ borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginTop: '8px' }}>
                <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: '#0F172A' }}>
                  Polymeric Joint Sand (50 lb Bags)
                </span>
                <span className={styles.breakdownValue} style={{ color: '#0369A1', fontWeight: 800, fontSize: '1.05rem' }}>
                  {results.jointSandBags50Lb} Bags
                </span>
              </div>
            )}

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Combined Sand Weight</span>
              <span className={styles.breakdownValue}>{results.totalSandLbs.toLocaleString()} lbs</span>
            </div>
          </div>

          {/* Pricing Summary Card */}
          {results.totalCost !== undefined && (
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>Estimated Material Investment</h3>

              {results.beddingCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>
                    Bedding Sand ({results.beddingTons} tons @ ${parseFloat(beddingCostPerTon || '0').toFixed(2)})
                  </span>
                  <span className={styles.breakdownValue}>${results.beddingCost.toFixed(2)}</span>
                </div>
              )}

              {includeJointSand && results.jointCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>
                    Polymeric Sand ({results.jointSandBags50Lb} bags @ ${parseFloat(jointCostPerBag || '0').toFixed(2)})
                  </span>
                  <span className={styles.breakdownValue}>${results.jointCost.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.breakdownRow} style={{ marginTop: '8px', paddingTop: '8px', borderTop: '2px solid #E2E8F0' }}>
                <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: '#0F172A' }}>
                  Total Sand Investment
                </span>
                <span className={styles.costHighlight}>${results.totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

