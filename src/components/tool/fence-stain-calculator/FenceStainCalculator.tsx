'use client';

import React, { useState, useId } from 'react';
import styles from './FenceStainCalculator.module.css';
import {
  calculateFenceStain,
  PicketStyle,
  WoodPorosity,
} from '@/lib/fence-stain-engine';

export default function FenceStainCalculator() {
  const lengthId = useId();
  const heightId = useId();
  const customHeightId = useId();
  const styleId = useId();
  const porosityId = useId();
  const price1GalId = useId();
  const price5GalId = useId();

  const [lengthFeet, setLengthFeet] = useState<number>(150);
  const [heightOption, setHeightOption] = useState<string>('6');
  const [customHeight, setCustomHeight] = useState<number>(6);
  const [bothSides, setBothSides] = useState<boolean>(true);
  const [picketStyle, setPicketStyle] = useState<PicketStyle>('flat-privacy');
  const [woodPorosity, setWoodPorosity] = useState<WoodPorosity>('rough-sawn');
  const [coatsCount, setCoatsCount] = useState<1 | 2>(2);
  const [applicationMethod, setApplicationMethod] = useState<'brush-roller' | 'sprayer'>('brush-roller');

  const [cost1Gal, setCost1Gal] = useState<string>('42.00');
  const [cost5Gal, setCost5Gal] = useState<string>('165.00');

  const effectiveHeight = heightOption === 'custom' ? customHeight : parseFloat(heightOption);
  const price1Num = parseFloat(cost1Gal);
  const price5Num = parseFloat(cost5Gal);

  const results = calculateFenceStain({
    fenceLengthFeet: lengthFeet,
    fenceHeightFeet: effectiveHeight,
    bothSides,
    picketStyle,
    woodPorosity,
    coatsCount,
    applicationMethod,
    costPer1GalCan: isNaN(price1Num) ? undefined : price1Num,
    costPer5GalPail: isNaN(price5Num) ? undefined : price5Num,
  });

  return (
    <div className={styles.container}>
      <div className={styles.calculatorGrid}>
        {/* Left Column: 4 Step Cards */}
        <div className={styles.leftColumn}>
          {/* Card 1: Fence Dimensions & Scope */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>1</span>
              <h2 className={styles.cardTitle}>Fence Dimensions &amp; Staining Scope</h2>
            </div>

            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label htmlFor={lengthId} className={styles.label}>
                  Fence Run Length (Linear Feet)
                </label>
                <input
                  id={lengthId}
                  type="number"
                  min="1"
                  step="any"
                  className={styles.input}
                  value={lengthFeet || ''}
                  onChange={(e) => setLengthFeet(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 150"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={heightId} className={styles.label}>
                  Fence Height
                </label>
                <select
                  id={heightId}
                  className={styles.select}
                  value={heightOption}
                  onChange={(e) => setHeightOption(e.target.value)}
                >
                  <option value="6">6 Feet (Standard Privacy)</option>
                  <option value="8">8 Feet (Tall Privacy)</option>
                  <option value="4">4 Feet (Garden / Picket)</option>
                  <option value="custom">Custom Height</option>
                </select>
              </div>
            </div>

            {heightOption === 'custom' && (
              <div className={styles.inputGroup}>
                <label htmlFor={customHeightId} className={styles.label}>
                  Custom Height (Feet)
                </label>
                <input
                  id={customHeightId}
                  type="number"
                  min="1"
                  step="0.5"
                  className={styles.input}
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 6)}
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Staining Scope</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${bothSides ? styles.toggleButtonActive : ''}`}
                  onClick={() => setBothSides(true)}
                >
                  Both Sides (Inside &amp; Outside)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} !${bothSides} ? styles.toggleButtonActive : ''`}
                  style={{
                    backgroundColor: !bothSides ? '#E0F2FE' : '#F8FAFC',
                    color: !bothSides ? '#0369A1' : '#475569',
                    borderColor: !bothSides ? '#0284C7' : '#CBD5E1',
                  }}
                  onClick={() => setBothSides(false)}
                >
                  One Side Only
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Picket Style & Overlap */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>2</span>
              <h2 className={styles.cardTitle}>Picket Style &amp; Board Overlap</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={styleId} className={styles.label}>
                Fence Construction Style
              </label>
              <select
                id={styleId}
                className={styles.select}
                value={picketStyle}
                onChange={(e) => setPicketStyle(e.target.value as PicketStyle)}
              >
                <option value="flat-privacy">Standard Flat Privacy (Edge-to-edge — 1.0× Area)</option>
                <option value="board-on-board">Board-on-Board (Overlapping pickets — 1.30× Area)</option>
                <option value="shadowbox">Shadowbox (Alternating side pickets — 1.25× Area)</option>
                <option value="spaced-picket">Spaced Picket / Dog Ear (Gapped pickets — 0.80× Area)</option>
                <option value="split-rail">Split Rail / Ranch Fence (2-3 rails — 0.40× Area)</option>
              </select>
              <span className={styles.helperText}>
                Overlapping styles add 25% to 30% more wood surface area from board edges.
              </span>
            </div>
          </div>

          {/* Card 3: Wood Texture & Coats */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>3</span>
              <h2 className={styles.cardTitle}>Wood Texture &amp; Number of Coats</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={porosityId} className={styles.label}>
                Wood Condition &amp; Porosity
              </label>
              <select
                id={porosityId}
                className={styles.select}
                value={woodPorosity}
                onChange={(e) => setWoodPorosity(e.target.value as WoodPorosity)}
              >
                <option value="rough-sawn">Rough-Sawn Cedar / Unfinished Pine (~175 sq ft / gal)</option>
                <option value="weathered">Aged / Very Weathered Porous Wood (~150 sq ft / gal)</option>
                <option value="smooth-planed">Smooth Planed / Previously Sealed Wood (~225 sq ft / gal)</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Number of Coats</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${coatsCount === 2 ? styles.toggleButtonActive : ''}`}
                  onClick={() => setCoatsCount(2)}
                >
                  2 Coats (Recommended for Bare Wood)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${coatsCount === 1 ? styles.toggleButtonActive : ''}`}
                  onClick={() => setCoatsCount(1)}
                >
                  1 Coat (Maintenance Refresh)
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Application & Pricing */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>4</span>
              <h2 className={styles.cardTitle}>Application Method &amp; Pricing</h2>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Application Method</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${applicationMethod === 'brush-roller' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setApplicationMethod('brush-roller')}
                >
                  Brush &amp; Roller (10% Buffer)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${applicationMethod === 'sprayer' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setApplicationMethod('sprayer')}
                >
                  Airless Sprayer (15% Overspray)
                </button>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label htmlFor={price5GalId} className={styles.label}>
                  5-Gallon Pail ($)
                </label>
                <input
                  id={price5GalId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={cost5Gal}
                  onChange={(e) => setCost5Gal(e.target.value)}
                  placeholder="e.g. 165.00"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={price1GalId} className={styles.label}>
                  1-Gallon Can ($)
                </label>
                <input
                  id={price1GalId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={cost1Gal}
                  onChange={(e) => setCost1Gal(e.target.value)}
                  placeholder="e.g. 42.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Results */}
        <div className={styles.rightColumn}>
          {/* Primary Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>Total Stain to Order</div>
            <div className={styles.heroValue}>{results.totalOrderGallons} Gallons</div>
            <div className={styles.heroSubtext}>
              Buy: {results.pails5GalCount} × 5-Gallon Pails + {results.cans1GalCount} × 1-Gallon Cans (includes{' '}
              {results.bufferPercent}% buffer)
            </div>
          </div>

          {/* Staining Schedule Breakdown */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Complete Staining Schedule Breakdown</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Fence Run Length</span>
              <span className={styles.breakdownValue}>{lengthFeet} Linear Feet</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Single-Side Flat Area</span>
              <span className={styles.breakdownValue}>{results.baseFlatAreaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Effective Stained Area ({bothSides ? 'Both Sides' : 'One Side'})</span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.effectiveStainedAreaSqFt} sq ft
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>First Coat Stain Required</span>
              <span className={styles.breakdownValue}>{results.coat1Gallons} Gallons</span>
            </div>

            {coatsCount === 2 && (
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Second Coat Stain Required</span>
                <span className={styles.breakdownValue}>{results.coat2Gallons} Gallons</span>
              </div>
            )}

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Net Raw Stain Consumption</span>
              <span className={styles.breakdownValue}>{results.totalRawGallons} Gallons</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>
                Application Buffer ({results.bufferPercent}% {applicationMethod === 'sprayer' ? 'overspray' : 'waste'})
              </span>
              <span className={styles.breakdownValue}>
                +{(results.totalOrderGallons - results.totalRawGallons).toFixed(2)} Gallons
              </span>
            </div>

            <div className={styles.breakdownRow} style={{ borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginTop: '8px' }}>
              <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: '#0F172A' }}>
                Recommended 5-Gal Pails
              </span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.pails5GalCount} Pails
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: '#0F172A' }}>
                Recommended 1-Gal Cans
              </span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.cans1GalCount} Cans
              </span>
            </div>
          </div>

          {/* Pricing Summary Card */}
          {results.totalCost !== undefined && (
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>Estimated Wood Stain Investment</h3>

              {results.pailsCost !== undefined && results.pails5GalCount > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>
                    5-Gallon Pails ({results.pails5GalCount} @ ${parseFloat(cost5Gal || '0').toFixed(2)})
                  </span>
                  <span className={styles.breakdownValue}>${results.pailsCost.toFixed(2)}</span>
                </div>
              )}

              {results.cansCost !== undefined && results.cans1GalCount > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>
                    1-Gallon Cans ({results.cans1GalCount} @ ${parseFloat(cost1Gal || '0').toFixed(2)})
                  </span>
                  <span className={styles.breakdownValue}>${results.cansCost.toFixed(2)}</span>
                </div>
              )}

              <div
                className={styles.breakdownRow}
                style={{ marginTop: '8px', paddingTop: '8px', borderTop: '2px solid #E2E8F0' }}
              >
                <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: '#0F172A' }}>
                  Total Estimated Stain Investment
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

