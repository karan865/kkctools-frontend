'use client';

import React, { useState, useId } from 'react';
import styles from './StudCalculator.module.css';
import { calculateStudFraming } from '@/lib/stud-engine';

export default function StudCalculator() {
  const lengthId = useId();
  const heightId = useId();
  const cornersId = useId();
  const tJunctionsId = useId();
  const doorsId = useId();
  const windowsId = useId();
  const studCostId = useId();
  const plateCostId = useId();

  // Inputs
  const [wallLength, setWallLength] = useState<number>(24);
  const [wallHeight, setWallHeight] = useState<number>(8);
  const [spacing, setSpacing] = useState<16 | 24>(16);
  const [lumberSize, setLumberSize] = useState<'2x4' | '2x6'>('2x4');
  const [corners, setCorners] = useState<number>(2);
  const [tJunctions, setTJunctions] = useState<number>(1);
  const [doors, setDoors] = useState<number>(1);
  const [windows, setWindows] = useState<number>(1);
  const [plateType, setPlateType] = useState<'double-top' | 'single-top'>('double-top');
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [costPerStud, setCostPerStud] = useState<string>('4.50');
  const [costPerPlateBoard, setCostPerPlateBoard] = useState<string>('9.50');

  const studPrice = parseFloat(costPerStud);
  const platePrice = parseFloat(costPerPlateBoard);

  const results = calculateStudFraming({
    wallLengthFeet: wallLength,
    wallHeightFeet: wallHeight,
    onCenterSpacingInches: spacing,
    lumberSize,
    cornersCount: corners,
    tJunctionsCount: tJunctions,
    doorsCount: doors,
    windowsCount: windows,
    plateType,
    wastePercent,
    costPerStud: isNaN(studPrice) ? undefined : studPrice,
    costPerPlateBoard: isNaN(platePrice) ? undefined : platePrice,
  });

  return (
    <div className={styles.container}>
      <div className={styles.calculatorGrid}>
        {/* Left Column: 4 Modular Step Cards */}
        <div className={styles.leftColumn}>
          {/* Card 1: Wall Dimensions & Stud Spacing */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>1</span>
              <h2 className={styles.cardTitle}>Wall Dimensions &amp; Stud Spacing</h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={lengthId} className={styles.label}>
                Wall Run Length (Linear Feet)
              </label>
              <input
                id={lengthId}
                type="number"
                min="1"
                step="any"
                className={styles.input}
                value={wallLength || ''}
                onChange={(e) => setWallLength(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 24"
              />
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor={heightId} className={styles.label}>
                  Wall Height
                </label>
                <select
                  id={heightId}
                  className={styles.select}
                  value={wallHeight}
                  onChange={(e) => setWallHeight(parseFloat(e.target.value))}
                >
                  <option value={8}>8 Feet (Standard)</option>
                  <option value={9}>9 Feet</option>
                  <option value={10}>10 Feet</option>
                  <option value={12}>12 Feet</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Lumber Size</label>
                <div className={styles.toggleRow}>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${lumberSize === '2x4' ? styles.toggleButtonActive : ''}`}
                    onClick={() => setLumberSize('2x4')}
                  >
                    2x4
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${lumberSize === '2x6' ? styles.toggleButtonActive : ''}`}
                    onClick={() => setLumberSize('2x6')}
                  >
                    2x6
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>On-Center Stud Spacing</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${spacing === 16 ? styles.toggleButtonActive : ''}`}
                  onClick={() => setSpacing(16)}
                >
                  16&quot; OC (Standard Load-Bearing)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${spacing === 24 ? styles.toggleButtonActive : ''}`}
                  onClick={() => setSpacing(24)}
                >
                  24&quot; OC (Utility / Partition)
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Corners & Intersecting Walls */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>2</span>
              <h2 className={styles.cardTitle}>Corners &amp; Intersecting Walls</h2>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor={cornersId} className={styles.label}>
                  90° Corners (+3 studs each)
                </label>
                <input
                  id={cornersId}
                  type="number"
                  min="0"
                  step="1"
                  className={styles.input}
                  value={corners}
                  onChange={(e) => setCorners(parseInt(e.target.value, 10) || 0)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={tJunctionsId} className={styles.label}>
                  T-Wall Partitions (+2 studs)
                </label>
                <input
                  id={tJunctionsId}
                  type="number"
                  min="0"
                  step="1"
                  className={styles.input}
                  value={tJunctions}
                  onChange={(e) => setTJunctions(parseInt(e.target.value, 10) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Rough Openings (Doors & Windows) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>3</span>
              <h2 className={styles.cardTitle}>Doors &amp; Window Rough Openings</h2>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor={doorsId} className={styles.label}>
                  Door Openings (+4 studs each)
                </label>
                <input
                  id={doorsId}
                  type="number"
                  min="0"
                  step="1"
                  className={styles.input}
                  value={doors}
                  onChange={(e) => setDoors(parseInt(e.target.value, 10) || 0)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={windowsId} className={styles.label}>
                  Window Openings (+4 studs each)
                </label>
                <input
                  id={windowsId}
                  type="number"
                  min="0"
                  step="1"
                  className={styles.input}
                  value={windows}
                  onChange={(e) => setWindows(parseInt(e.target.value, 10) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Plates, Waste & Pricing */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>4</span>
              <h2 className={styles.cardTitle}>Plates, Waste Buffer &amp; Pricing</h2>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Plate Configuration</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${plateType === 'double-top' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setPlateType('double-top')}
                >
                  Double Top Plate (3 Plates)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${plateType === 'single-top' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setPlateType('single-top')}
                >
                  Single Top Plate (2 Plates)
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Lumber Waste &amp; Defect Margin</label>
              <div className={styles.pillsRow}>
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`${styles.pillButton} ${wastePercent === pct ? styles.pillButtonActive : ''}`}
                    onClick={() => setWastePercent(pct)}
                  >
                    {pct === 10 ? '10% (Recommended)' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor={studCostId} className={styles.label}>
                  Cost per Stud ($)
                </label>
                <input
                  id={studCostId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={costPerStud}
                  onChange={(e) => setCostPerStud(e.target.value)}
                  placeholder="e.g. 4.50"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={plateCostId} className={styles.label}>
                  Cost per 16&apos; Plate ($)
                </label>
                <input
                  id={plateCostId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={costPerPlateBoard}
                  onChange={(e) => setCostPerPlateBoard(e.target.value)}
                  placeholder="e.g. 9.50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Results */}
        <div className={styles.rightColumn}>
          {/* Primary Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>Total Studs to Order</div>
            <div className={styles.heroValue}>{results.totalStudsToOrder} Studs</div>
            <div className={styles.heroSubtext}>
              Includes {results.baseFieldStuds} field studs, {results.cornerStuds + results.tJunctionStuds} corners/T-walls,{' '}
              {results.roughOpeningStuds} opening trimmers + {results.wasteStuds} waste margin
            </div>
          </div>

          {/* Breakdown Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Framing Lumber Material Schedule</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Base Field Studs ({spacing}&quot; OC)</span>
              <span className={styles.breakdownValue}>{results.baseFieldStuds} Studs</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Corner Assemblies ({corners} @ 3 studs)</span>
              <span className={styles.breakdownValue}>{results.cornerStuds} Studs</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>T-Wall Partitions ({tJunctions} @ 2 studs)</span>
              <span className={styles.breakdownValue}>{results.tJunctionStuds} Studs</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Door &amp; Window Trimmers (King/Jack)</span>
              <span className={styles.breakdownValue}>{results.roughOpeningStuds} Studs</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Lumber Defect / Waste Buffer ({wastePercent}%)</span>
              <span className={styles.breakdownValue}>+{results.wasteStuds} Studs</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Plates Linear Run</span>
              <span className={styles.breakdownValue}>{results.totalPlatesLinearFeet} Linear Feet</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>16-Foot Stock Plate Boards Needed</span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.plateBoards16Ft} Boards
              </span>
            </div>
          </div>

          {/* Cost Card (if pricing entered) */}
          {results.totalLumberCost !== undefined && (
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>Framing Lumber Cost Estimate</h3>

              {results.studsCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>
                    Vertical Studs ({results.totalStudsToOrder} @ ${parseFloat(costPerStud || '0').toFixed(2)})
                  </span>
                  <span className={styles.breakdownValue}>${results.studsCost.toFixed(2)}</span>
                </div>
              )}

              {results.platesCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>
                    Horizontal Plates ({results.plateBoards16Ft} boards @ ${parseFloat(costPerPlateBoard || '0').toFixed(2)})
                  </span>
                  <span className={styles.breakdownValue}>${results.platesCost.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.breakdownRow} style={{ marginTop: '8px', paddingTop: '8px', borderTop: '2px solid #E2E8F0' }}>
                <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: '#0F172A' }}>
                  Total Estimated Framing Lumber
                </span>
                <span className={styles.costHighlight}>${results.totalLumberCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

