'use client';

import React, { useState, useId } from 'react';
import styles from './StudCalculator.module.css';
import {
  calculateStuds,
  HeightChoice,
  SpacingChoice,
  LumberSize,
  PlateConfig,
  WastePercent,
} from '@/lib/stud-engine';

export default function StudCalculator() {
  const lengthFtId = useId();
  const lengthInId = useId();
  const heightId = useId();
  const customHeightId = useId();
  const cornersId = useId();
  const tJunctionsId = useId();
  const doorsId = useId();
  const windowsId = useId();
  const studCostId = useId();
  const bottomPlateCostId = useId();
  const topPlateCostId = useId();
  const laborCostId = useId();

  // Inputs
  const [lengthFt, setLengthFt] = useState<number>(24);
  const [lengthIn, setLengthIn] = useState<number>(0);
  const [heightChoice, setHeightChoice] = useState<HeightChoice>('8');
  const [customHeightIn, setCustomHeightIn] = useState<number>(96);
  const [spacing, setSpacing] = useState<SpacingChoice>(16);
  const [lumber, setLumber] = useState<LumberSize>('2x4');
  const [corners, setCorners] = useState<number>(2);
  const [tJunctions, setTJunctions] = useState<number>(1);
  const [doors, setDoors] = useState<number>(1);
  const [windows, setWindows] = useState<number>(1);
  const [plateConfig, setPlateConfig] = useState<PlateConfig>('double');
  const [wastePct, setWastePct] = useState<WastePercent>(10);

  // Pricing inputs (defaults from T1: $4.50 stud, $14.00 bottom plate, $9.50 top plate)
  const [costPerStud, setCostPerStud] = useState<string>('4.50');
  const [costPerBottomPlate, setCostPerBottomPlate] = useState<string>('14.00');
  const [costPerTopPlate, setCostPerTopPlate] = useState<string>('9.50');
  const [laborPerLf, setLaborPerLf] = useState<string>('');

  const parsedStudPrice = parseFloat(costPerStud);
  const parsedBottomPrice = parseFloat(costPerBottomPlate);
  const parsedTopPrice = parseFloat(costPerTopPlate);
  const parsedLaborPrice = parseFloat(laborPerLf);

  const results = calculateStuds({
    lengthFt,
    lengthIn,
    heightChoice,
    customHeightIn,
    spacing,
    lumber,
    corners,
    tJunctions,
    doors,
    windows,
    plateConfig,
    wastePct,
    studPrice: isNaN(parsedStudPrice) ? undefined : parsedStudPrice,
    bottomPlatePrice: isNaN(parsedBottomPrice) ? undefined : parsedBottomPrice,
    topPlatePrice: isNaN(parsedTopPrice) ? undefined : parsedTopPrice,
    laborPerLf: isNaN(parsedLaborPrice) ? undefined : parsedLaborPrice,
  });

  return (
    <div className={styles.container}>
      <div className={styles.calculatorGrid}>
        {/* Left Column: 4 Modular Cards */}
        <div className={styles.leftColumn}>
          {/* Card 1: Wall Dimensions & Stud Spacing */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>1</span>
              <h2 className={styles.cardTitle}>Wall Dimensions &amp; Stud Spacing</h2>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Total Wall Length Run
              </label>
              <div className={styles.rowInputs}>
                <div>
                  <label htmlFor={lengthFtId} className={styles.helperText}>Feet</label>
                  <input
                    id={lengthFtId}
                    type="number"
                    min="0"
                    max="1000"
                    step="1"
                    className={styles.input}
                    value={lengthFt === 0 ? '' : lengthFt}
                    onChange={(e) => setLengthFt(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    placeholder="e.g. 24"
                  />
                </div>
                <div>
                  <label htmlFor={lengthInId} className={styles.helperText}>Inches</label>
                  <input
                    id={lengthInId}
                    type="number"
                    min="0"
                    max="11"
                    step="1"
                    className={styles.input}
                    value={lengthIn === 0 ? '' : lengthIn}
                    onChange={(e) => setLengthIn(Math.min(11, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                    placeholder="e.g. 0"
                  />
                </div>
              </div>
              <p className={styles.helperText}>
                Add all wall segments together, including partition walls.
              </p>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor={heightId} className={styles.label}>
                  Ceiling / Wall Height
                </label>
                <select
                  id={heightId}
                  className={styles.select}
                  value={heightChoice}
                  onChange={(e) => setHeightChoice(e.target.value as HeightChoice)}
                >
                  <option value="8">8 Feet (Standard)</option>
                  <option value="9">9 Feet</option>
                  <option value="10">10 Feet</option>
                  <option value="12">12 Feet</option>
                  <option value="custom">Custom Height</option>
                </select>
              </div>

              {heightChoice === 'custom' ? (
                <div className={styles.inputGroup}>
                  <label htmlFor={customHeightId} className={styles.label}>
                    Custom Height (Inches)
                  </label>
                  <input
                    id={customHeightId}
                    type="number"
                    min="12"
                    max="300"
                    className={styles.input}
                    value={customHeightIn || ''}
                    onChange={(e) => setCustomHeightIn(Math.max(12, parseInt(e.target.value, 10) || 96))}
                    placeholder="e.g. 108"
                  />
                </div>
              ) : (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Stud Length Needed</label>
                  <input
                    type="text"
                    readOnly
                    className={styles.input}
                    value={results.studLengthOutput}
                    style={{ backgroundColor: '#F8FAFC', color: '#0369A1', fontWeight: 600 }}
                  />
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Stud Spacing (On-Center)</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${spacing === 16 ? styles.toggleButtonActive : ''}`}
                  onClick={() => setSpacing(16)}
                >
                  16 inches OC (Standard)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${spacing === 24 ? styles.toggleButtonActive : ''}`}
                  onClick={() => setSpacing(24)}
                >
                  24 inches OC (Advanced framing / non-bearing)
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Lumber Size</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${lumber === '2x4' ? styles.toggleButtonActive : ''}`}
                  onClick={() => {
                    setLumber('2x4');
                    if (costPerStud === '7.50') setCostPerStud('4.50');
                  }}
                >
                  2x4 Framing (3.5&quot; wall)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${lumber === '2x6' ? styles.toggleButtonActive : ''}`}
                  onClick={() => {
                    setLumber('2x6');
                    if (costPerStud === '4.50') setCostPerStud('7.50');
                  }}
                >
                  2x6 Framing (5.5&quot; wall)
                </button>
              </div>
              <p className={styles.helperText}>
                {lumber === '2x4'
                  ? 'Standard interior partitions & 2x4 exterior framing (3.5" finished cavity depth).'
                  : 'Exterior walls for deep insulation or heavy load-bearing headers (5.5" finished cavity depth).'}
              </p>
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
                  Wall Corners (L-Corners)
                </label>
                <input
                  id={cornersId}
                  type="number"
                  min="0"
                  max="100"
                  className={styles.input}
                  value={corners}
                  onChange={(e) => setCorners(Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
                <p className={styles.helperText}>
                  Each corner is a 3-stud assembly; the calculator adds 2 extra because one is already in the field count.
                </p>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={tJunctionsId} className={styles.label}>
                  T-Walls / Partition Tie-Ins
                </label>
                <input
                  id={tJunctionsId}
                  type="number"
                  min="0"
                  max="100"
                  className={styles.input}
                  value={tJunctions}
                  onChange={(e) => setTJunctions(Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
                <p className={styles.helperText}>
                  Adds 2 studs per T-junction for partition wall backing.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Doors & Windows (Rough Openings) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>3</span>
              <h2 className={styles.cardTitle}>Doors &amp; Windows (Rough Openings)</h2>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor={doorsId} className={styles.label}>
                  Door Openings
                </label>
                <input
                  id={doorsId}
                  type="number"
                  min="0"
                  max="50"
                  className={styles.input}
                  value={doors}
                  onChange={(e) => setDoors(Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={windowsId} className={styles.label}>
                  Window Openings
                </label>
                <input
                  id={windowsId}
                  type="number"
                  min="0"
                  max="50"
                  className={styles.input}
                  value={windows}
                  onChange={(e) => setWindows(Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
              </div>
            </div>
            <p className={styles.helperText}>
              4 studs each (2 king + 2 jack). Header boards are listed separately; header size depends on span and load, so follow local code / IRC span tables.
            </p>
          </div>

          {/* Card 4: Plates, Waste & Pricing (Optional) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>4</span>
              <h2 className={styles.cardTitle}>Plates, Waste &amp; Pricing (Optional)</h2>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Top Plate Configuration</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${plateConfig === 'double' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setPlateConfig('double')}
                >
                  Double Top Plate (Standard)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${plateConfig === 'single' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setPlateConfig('single')}
                >
                  Single Top Plate (Partition)
                </button>
              </div>
              <p className={styles.helperText}>
                {plateConfig === 'double'
                  ? 'Double top plate interlocks wall junctions and distributes roof/floor joist loads (3 total plates).'
                  : 'Typical for non-load-bearing partitions. Load-bearing walls usually need a double top plate unless in-line framing with approved plate ties is used. Check local code.'}
              </p>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Waste Allowance</label>
              <div className={styles.pillsRow}>
                {[5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`${styles.pillButton} ${wastePct === pct ? styles.pillButtonActive : ''}`}
                    onClick={() => setWastePct(pct as WastePercent)}
                  >
                    {pct}% {pct === 10 ? '(Recommended)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor={studCostId} className={styles.label}>
                  Cost per Stud ($) <span style={{ fontWeight: 400, color: '#64748B' }}>(example)</span>
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
                <label htmlFor={bottomPlateCostId} className={styles.label}>
                  16-ft Bottom Plate ($) <span style={{ fontWeight: 400, color: '#64748B' }}>(example PT)</span>
                </label>
                <input
                  id={bottomPlateCostId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={costPerBottomPlate}
                  onChange={(e) => setCostPerBottomPlate(e.target.value)}
                  placeholder="e.g. 14.00"
                />
              </div>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor={topPlateCostId} className={styles.label}>
                  16-ft Top Plate ($) <span style={{ fontWeight: 400, color: '#64748B' }}>(example)</span>
                </label>
                <input
                  id={topPlateCostId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={costPerTopPlate}
                  onChange={(e) => setCostPerTopPlate(e.target.value)}
                  placeholder="e.g. 9.50"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={laborCostId} className={styles.label}>
                  Labor per Linear Foot ($) <span style={{ fontWeight: 400, color: '#64748B' }}>(optional)</span>
                </label>
                <input
                  id={laborCostId}
                  type="number"
                  min="0"
                  step="0.50"
                  className={styles.input}
                  value={laborPerLf}
                  onChange={(e) => setLaborPerLf(e.target.value)}
                  placeholder="e.g. 7.50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero & Breakdown Results */}
        <div className={styles.rightColumn}>
          {/* Hero Result Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>TOTAL STUDS TO ORDER</div>
            <div className={styles.heroValue}>
              {results.totalStuds} Studs
            </div>
            <div className={styles.heroSubtext}>
              Includes {results.fieldStuds} field studs, {results.cornerStuds + results.tStuds} corner &amp; T-wall studs, {results.openingStuds} opening studs + {results.wasteStuds} waste studs
            </div>
          </div>

          {/* Breakdown Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Framing Lumber Breakdown</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Field Studs ({spacing}&quot; OC)</span>
              <span className={styles.breakdownValue}>{results.fieldStuds}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Corner &amp; T-Wall Studs</span>
              <span className={styles.breakdownValue}>{results.cornerStuds + results.tStuds} ({results.cornerStuds} corner, {results.tStuds} T)</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Rough Opening Studs (Doors &amp; Windows)</span>
              <span className={styles.breakdownValue}>{results.openingStuds} (King &amp; Jack)</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Subtotal Vertical Studs</span>
              <span className={styles.breakdownValue}>{results.subtotal}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Waste Allowance ({wastePct}%)</span>
              <span className={styles.breakdownValue}>+{results.wasteStuds} studs</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Stud Length to Buy</span>
              <span className={styles.breakdownValue} style={{ color: '#0369A1' }}>{results.studLengthOutput}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Header Boards (2 per opening)</span>
              <span className={styles.breakdownValue}>{results.headerBoards} boards</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Horizontal Plates Linear Feet</span>
              <span className={styles.breakdownValue}>{results.totalPlateLf} LF ({results.plateLayers} plates)</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Bottom Plate Boards (16-ft)</span>
              <span className={styles.breakdownValue}>{results.bottomBoards} boards</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Top Plate Boards (16-ft)</span>
              <span className={styles.breakdownValue}>{results.topBoards} boards ({plateConfig === 'double' ? 'double' : 'single'})</span>
            </div>
            <div className={styles.breakdownRow} style={{ borderTop: '2px solid #E2E8F0', marginTop: '6px', paddingTop: '10px' }}>
              <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: '#0F172A' }}>Total 16-ft Plate Boards</span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontSize: '1.05rem' }}>{results.totalPlateBoards} boards</span>
            </div>
          </div>

          {/* Cost Card (only when prices are entered) */}
          {results.grandTotalCost !== undefined && (
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>Estimated Framing Cost</h3>

              {results.studsCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Vertical Studs ({results.totalStuds} @ ${parsedStudPrice.toFixed(2)})</span>
                  <span className={styles.breakdownValue}>${results.studsCost.toFixed(2)}</span>
                </div>
              )}
              {results.bottomPlatesCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Bottom Plates ({results.bottomBoards} @ ${parsedBottomPrice.toFixed(2)})</span>
                  <span className={styles.breakdownValue}>${results.bottomPlatesCost.toFixed(2)}</span>
                </div>
              )}
              {results.topPlatesCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Top Plates ({results.topBoards} @ ${parsedTopPrice.toFixed(2)})</span>
                  <span className={styles.breakdownValue}>${results.topPlatesCost.toFixed(2)}</span>
                </div>
              )}
              {results.laborCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Framing Labor ({results.totalLengthFt.toFixed(1)} LF @ ${parsedLaborPrice.toFixed(2)})</span>
                  <span className={styles.breakdownValue}>${results.laborCost.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.breakdownRow} style={{ borderTop: '2px solid #CBD5E1', marginTop: '6px', paddingTop: '10px' }}>
                <span className={styles.breakdownLabel} style={{ fontWeight: 800, color: '#0F172A' }}>Grand Total Cost</span>
                <span className={styles.costHighlight}>${results.grandTotalCost.toFixed(2)}</span>
              </div>
              {results.costPerSqFt !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Cost per Sq Ft of Wall Area ({results.wallAreaSqFt} sq ft)</span>
                  <span className={styles.breakdownValue}>${results.costPerSqFt.toFixed(2)} / sq ft</span>
                </div>
              )}
            </div>
          )}

          <p className={styles.disclaimerNote}>
            Estimate only. Verify with your local building code and a licensed professional for load-bearing walls.
          </p>
        </div>
      </div>
    </div>
  );
}
