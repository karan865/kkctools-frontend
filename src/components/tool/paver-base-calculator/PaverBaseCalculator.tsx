'use client';

import React, { useState, useId } from 'react';
import styles from './PaverBaseCalculator.module.css';
import { calculatePaverBase } from '@/lib/paver-base-engine';

export default function PaverBaseCalculator() {
  const lengthId = useId();
  const widthId = useId();
  const directAreaId = useId();
  const depthId = useId();
  const customDepthId = useId();
  const costId = useId();
  const deliveryId = useId();

  const [mode, setMode] = useState<'dimensions' | 'area'>('dimensions');
  const [lengthFeet, setLengthFeet] = useState<number>(24);
  const [widthFeet, setWidthFeet] = useState<number>(16);
  const [directArea, setDirectArea] = useState<number>(384);

  const [depthOption, setDepthOption] = useState<string>('4');
  const [customDepth, setCustomDepth] = useState<number>(4);
  const [compactionPercent, setCompactionPercent] = useState<number>(15);

  const [costPerTon, setCostPerTon] = useState<string>('42.00');
  const [deliveryFee, setDeliveryFee] = useState<string>('60.00');

  const effectiveArea = mode === 'dimensions' ? lengthFeet * widthFeet : directArea;
  const effectiveDepth = depthOption === 'custom' ? customDepth : parseFloat(depthOption);

  const priceNum = parseFloat(costPerTon);
  const deliveryNum = parseFloat(deliveryFee);

  const results = calculatePaverBase({
    areaSqFt: effectiveArea,
    baseDepthInches: effectiveDepth,
    compactionPercent,
    costPerTon: isNaN(priceNum) ? undefined : priceNum,
    deliveryFee: isNaN(deliveryNum) ? undefined : deliveryNum,
  });

  return (
    <div className={styles.container}>
      <div className={styles.calculatorGrid}>
        {/* Left Column: 4 Step Cards */}
        <div className={styles.leftColumn}>
          {/* Card 1: Project Surface Area */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>1</span>
              <h2 className={styles.cardTitle}>Excavation / Patio Dimensions</h2>
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
                    placeholder="e.g. 24"
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
                    placeholder="e.g. 16"
                  />
                </div>
              </div>
            ) : (
              <div className={styles.inputGroup}>
                <label htmlFor={directAreaId} className={styles.label}>
                  Excavated Surface Area (Square Feet)
                </label>
                <input
                  id={directAreaId}
                  type="number"
                  min="1"
                  step="any"
                  className={styles.input}
                  value={directArea || ''}
                  onChange={(e) => setDirectArea(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 384"
                />
              </div>
            )}
            <span className={styles.helperText}>
              Total excavated base footprint: {effectiveArea} sq ft (Tip: add 6&quot; perimeter overdig)
            </span>
          </div>

          {/* Card 2: Application Type & Finished Base Depth */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>2</span>
              <h2 className={styles.cardTitle}>Application &amp; Compacted Depth</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={depthId} className={styles.label}>
                Project Type / Finished Base Thickness
              </label>
              <select
                id={depthId}
                className={styles.select}
                value={depthOption}
                onChange={(e) => setDepthOption(e.target.value)}
              >
                <option value="4">Walkway / Residential Patio (4&quot; Compacted Base)</option>
                <option value="6">Heavy Patio / Hot Tub / Fireplace (6&quot; Compacted Base)</option>
                <option value="8">Vehicular Driveway / Parking Pad (8&quot; Compacted Base)</option>
                <option value="10">Heavy Commercial / RV Pad (10&quot; Compacted Base)</option>
                <option value="custom">Custom Depth (Inches)</option>
              </select>
            </div>

            {depthOption === 'custom' && (
              <div className={styles.inputGroup}>
                <label htmlFor={customDepthId} className={styles.label}>
                  Custom Base Depth (Inches)
                </label>
                <input
                  id={customDepthId}
                  type="number"
                  min="1"
                  step="0.5"
                  className={styles.input}
                  value={customDepth}
                  onChange={(e) => setCustomDepth(parseFloat(e.target.value) || 4)}
                />
              </div>
            )}
            <span className={styles.helperText}>
              Material: Dense-graded aggregate (crusher run / #21A / ABC stone ~1.40 tons/yd³)
            </span>
          </div>

          {/* Card 3: Mechanical Compaction Factor */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>3</span>
              <h2 className={styles.cardTitle}>Compaction Shrinkage Loss</h2>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Plate Compactor Volume Shrinkage</label>
              <div className={styles.pillsRow}>
                {[
                  { pct: 15, label: '15% Standard (Plate Compactor)' },
                  { pct: 20, label: '20% Heavy (Clay / Driveway)' },
                  { pct: 10, label: '10% Hand Tamper' },
                  { pct: 0, label: '0% Raw Loose' },
                ].map((item) => (
                  <button
                    key={item.pct}
                    type="button"
                    className={`${styles.pillButton} ${
                      compactionPercent === item.pct ? styles.pillButtonActive : ''
                    }`}
                    onClick={() => setCompactionPercent(item.pct)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <span className={styles.helperText}>
                Loose aggregate volume shrinks by 15-20% when compacted under vibration.
              </span>
            </div>
          </div>

          {/* Card 4: Pricing & Delivery */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>4</span>
              <h2 className={styles.cardTitle}>Pricing &amp; Delivery (Optional)</h2>
            </div>

            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label htmlFor={costId} className={styles.label}>
                  Base Cost ($/ton)
                </label>
                <input
                  id={costId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={costPerTon}
                  onChange={(e) => setCostPerTon(e.target.value)}
                  placeholder="e.g. 42.00"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={deliveryId} className={styles.label}>
                  Dump Truck Fee ($)
                </label>
                <input
                  id={deliveryId}
                  type="number"
                  min="0"
                  step="1"
                  className={styles.input}
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  placeholder="e.g. 60.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results Display */}
        <div className={styles.rightColumn}>
          {/* Primary Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>Total Paver Base to Order</div>
            <div className={styles.heroValue}>{results.looseTons} Tons</div>
            <div className={styles.heroSubtext}>
              Equivalent to {results.looseCubicYards} Cubic Yards ({results.looseCuFt} cu ft) with{' '}
              {compactionPercent}% compaction loss
            </div>
          </div>

          {/* Breakdown Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Complete Excavation &amp; Subbase Schedule</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Excavation Footprint</span>
              <span className={styles.breakdownValue}>{results.areaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Finished Base Thickness</span>
              <span className={styles.breakdownValue}>{effectiveDepth} Inches</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Compacted In-Place Volume</span>
              <span className={styles.breakdownValue}>
                {results.compactedCuFt} ft³ ({results.compactedCubicYards} yd³)
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Compaction Shrinkage Factor</span>
              <span className={styles.breakdownValue}>+{compactionPercent}%</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Loose Volume to Order (at Quarry)</span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.looseCubicYards} Cubic Yards
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Loose Weight (US Short Tons)</span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.looseTons} Tons
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Weight in Total Pounds</span>
              <span className={styles.breakdownValue}>{results.loosePounds.toLocaleString()} lbs</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Retail 0.5 Cu Ft Bags Equivalent</span>
              <span className={styles.breakdownValue}>{results.bags05CuFtCount} Bags</span>
            </div>
          </div>

          {/* Pricing Summary Card */}
          {results.totalCost !== undefined && (
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>Estimated Subbase Investment</h3>

              {results.materialCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>
                    Base Aggregate ({results.looseTons} tons @ ${parseFloat(costPerTon || '0').toFixed(2)})
                  </span>
                  <span className={styles.breakdownValue}>${results.materialCost.toFixed(2)}</span>
                </div>
              )}

              {results.deliveryFee !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Dump Truck Delivery Fee</span>
                  <span className={styles.breakdownValue}>${results.deliveryFee.toFixed(2)}</span>
                </div>
              )}

              <div
                className={styles.breakdownRow}
                style={{ marginTop: '8px', paddingTop: '8px', borderTop: '2px solid #E2E8F0' }}
              >
                <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: '#0F172A' }}>
                  Total Delivered Investment
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

