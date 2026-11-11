'use client';

import React, { useState, useId } from 'react';
import styles from './BrickCalculator.module.css';
import {
  BRICK_PRESETS,
  WallRow,
  WallOpening,
  MortarType,
  calculateBricks,
} from '@/lib/brick-engine';

export function BrickCalculator() {
  const presetSelectId = useId();
  const mortarJointId = useId();
  const mortarTypeId = useId();
  const palletsInputId = useId();
  const priceBrickId = useId();
  const priceMortarId = useId();

  // State: Wall Rows (Single flow, no tabs)
  const [walls, setWalls] = useState<WallRow[]>([
    { id: '1', name: 'Main Wall', lengthFeet: 20, heightFeet: 8, quantity: 1 },
  ]);

  // State: Openings (doors, windows, custom)
  const [openings, setOpenings] = useState<WallOpening[]>([]);

  // State: Brick & Mortar Configuration
  const [presetId, setPresetId] = useState<string>('modular');
  const [customLength, setCustomLength] = useState<string>('7.625');
  const [customHeight, setCustomHeight] = useState<string>('2.25');
  const [customWidth, setCustomWidth] = useState<string>('3.625');
  const [customWeight, setCustomWeight] = useState<string>('');
  const [mortarJoint, setMortarJoint] = useState<number>(0.375); // 3/8"
  const [mortarType, setMortarType] = useState<MortarType>('preblended');

  // State: Wall Structure
  const [isDoubleWythe, setIsDoubleWythe] = useState<boolean>(false);
  const [fillCollarJoint, setFillCollarJoint] = useState<boolean>(false);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [bricksPerPallet, setBricksPerPallet] = useState<string>('500');

  // State: Pricing
  const [pricePerBrick, setPricePerBrick] = useState<string>('');
  const [pricePerMortarBag, setPricePerMortarBag] = useState<string>('');

  // UI helpers
  const [copied, setCopied] = useState<boolean>(false);

  // Helper to parse localized numeric inputs (supports commas)
  const parseNum = (val: string) => {
    if (!val) return 0;
    const clean = val.replace(/,/g, '.');
    const n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  };

  // Calculation
  const results = calculateBricks({
    walls,
    openings,
    brickPresetId: presetId,
    customLengthInches: parseNum(customLength),
    customHeightInches: parseNum(customHeight),
    customWidthInches: parseNum(customWidth),
    customWeightLbs: parseNum(customWeight) > 0 ? parseNum(customWeight) : undefined,
    mortarJointInches: mortarJoint,
    isDoubleWythe,
    fillCollarJoint,
    wastePercentage: wastePercent,
    mortarType,
    bricksPerPallet: parseNum(bricksPerPallet) > 0 ? parseNum(bricksPerPallet) : 500,
    pricePerBrick: parseNum(pricePerBrick),
    pricePerMortarBag: parseNum(pricePerMortarBag),
  });

  // Handlers for Wall Rows
  const handleAddWall = () => {
    setWalls([
      ...walls,
      {
        id: Math.random().toString(),
        name: `Wall #${walls.length + 1}`,
        lengthFeet: 10,
        heightFeet: 8,
        quantity: 1,
      },
    ]);
  };

  const handleRemoveWall = (id: string) => {
    if (walls.length > 1) {
      setWalls(walls.filter((w) => w.id !== id));
    }
  };

  const handleUpdateWall = (id: string, field: keyof WallRow, value: string | number) => {
    setWalls(
      walls.map((w) => {
        if (w.id === id) {
          return { ...w, [field]: value };
        }
        return w;
      })
    );
  };

  // Handlers for Openings
  const handleAddDoor = () => {
    setOpenings([
      ...openings,
      {
        id: Math.random().toString(),
        name: 'Exterior Door',
        widthFeet: 3,
        heightFeet: 6.667, // exactly 20.0 sq ft
        quantity: 1,
      },
    ]);
  };

  const handleAddWindow = () => {
    setOpenings([
      ...openings,
      {
        id: Math.random().toString(),
        name: 'Standard Window',
        widthFeet: 3,
        heightFeet: 4, // 12.0 sq ft
        quantity: 1,
      },
    ]);
  };

  const handleAddCustomOpening = () => {
    setOpenings([
      ...openings,
      {
        id: Math.random().toString(),
        name: 'Custom Opening',
        widthFeet: 4,
        heightFeet: 5,
        quantity: 1,
      },
    ]);
  };

  const handleRemoveOpening = (id: string) => {
    setOpenings(openings.filter((op) => op.id !== id));
  };

  const handleUpdateOpening = (id: string, field: keyof WallOpening, value: string | number) => {
    setOpenings(
      openings.map((op) => {
        if (op.id === id) {
          return { ...op, [field]: value };
        }
        return op;
      })
    );
  };

  // Toolbar Actions
  const handleReset = () => {
    setWalls([{ id: '1', name: 'Main Wall', lengthFeet: 20, heightFeet: 8, quantity: 1 }]);
    setOpenings([]);
    setPresetId('modular');
    setMortarJoint(0.375);
    setMortarType('preblended');
    setIsDoubleWythe(false);
    setFillCollarJoint(false);
    setWastePercent(10);
    setBricksPerPallet('500');
    setPricePerBrick('');
    setPricePerMortarBag('');
  };

  const handleScrollToResults = () => {
    const el = document.getElementById('brick-results-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopySummary = () => {
    const summary = `Brick Calculator Estimate:
- Wall Net Area: ${results.netWallAreaSqFt} sq ft (Gross: ${results.grossWallAreaSqFt} sq ft, Openings: ${results.openingsAreaSqFt} sq ft)
- Brick Type: ${BRICK_PRESETS[presetId]?.name || 'Custom'} (${results.bricksPerSqFt.toFixed(2)} bricks/sq ft)
- Wythe: ${isDoubleWythe ? 'Double Wythe' : 'Single Wythe (Veneer)'}
- Bricks to Order: ${results.totalBricksNeeded.toLocaleString()} bricks (Base: ${results.baseBricksNeeded.toLocaleString()} + ${results.wasteBricks} waste @ ${wastePercent}%)
- Mortar Needed: ${results.mortarBags80lb} bags (80 lb pre-blended) OR ${results.mortarBags60lb} bags (60 lb)
- Site-Mixed Alternative: ${results.masonryCementBags70lb} bags masonry cement + ${results.sandCubicYards} cu yd sand
- Pallets (~${bricksPerPallet}/pallet): about ${results.palletsExact} pallets (${results.palletsRounded} rounded)
- Approx Weight: ${results.totalWeightLbs.toLocaleString()} lbs (${results.totalWeightTons} tons)
${results.totalCost > 0 ? `- Estimated Cost: $${results.totalCost.toFixed(2)} (Bricks: $${results.brickCost.toFixed(2)}, Mortar: $${results.mortarCost.toFixed(2)})` : ''}
Calculated at KKCTools.com`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const activePreset = BRICK_PRESETS[presetId];

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.twoColumnGrid}>
        {/* Left Column: Flow of Sections (Walls -> Openings -> Brick & Mortar -> Wall Structure) */}
        <div className={styles.inputColumn}>
          {/* Section 1: Walls */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>1</span>
                Brick Wall Dimensions
              </h2>
              <button type="button" className={styles.addBtn} onClick={handleAddWall}>
                + Add Wall Run
              </button>
            </div>

            <p className={styles.helperText} style={{ marginBottom: '12px' }}>
              Enter each wall section length and height. Use &quot;Add Wall Run&quot; for multi-sided or perimeter walls.
            </p>

            {walls.map((wall) => (
              <div key={wall.id} className={styles.wallRowCard}>
                <div className={styles.wallRowGrid}>
                  <div>
                    <label className={styles.inputLabel}>Wall Name</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={wall.name}
                      onChange={(e) => handleUpdateWall(wall.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>Length (ft)</label>
                    <input
                      type="number"
                      min="0.5"
                      step="any"
                      inputMode="decimal"
                      className={styles.textInput}
                      value={wall.lengthFeet || ''}
                      onChange={(e) => handleUpdateWall(wall.id, 'lengthFeet', parseNum(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>Height (ft)</label>
                    <input
                      type="number"
                      min="0.5"
                      step="any"
                      inputMode="decimal"
                      className={styles.textInput}
                      value={wall.heightFeet || ''}
                      onChange={(e) => handleUpdateWall(wall.id, 'heightFeet', parseNum(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>Qty</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className={styles.textInput}
                      value={wall.quantity || 1}
                      onChange={(e) => handleUpdateWall(wall.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                    />
                  </div>
                  <div>
                    {walls.length > 1 && (
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => handleRemoveWall(wall.id)}
                        title="Remove Wall"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2: Openings */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>2</span>
                Doors &amp; Windows (Deductions)
              </h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="button" className={styles.addBtn} onClick={handleAddDoor}>
                  + Door (20 sq ft)
                </button>
                <button type="button" className={styles.addBtn} onClick={handleAddWindow}>
                  + Window (12 sq ft)
                </button>
                <button type="button" className={styles.addBtn} onClick={handleAddCustomOpening}>
                  + Custom
                </button>
              </div>
            </div>

            {results.isOpeningExceeded && (
              <div className={styles.errorBanner} role="alert">
                Warning: Total openings area ({results.openingsAreaSqFt} sq ft) exceeds gross wall area ({results.grossWallAreaSqFt} sq ft). Net wall area set to 0.
              </div>
            )}

            {openings.length === 0 ? (
              <p className={styles.helperText}>
                No doors or windows added. Add openings to accurately deduct brick and mortar quantities.
              </p>
            ) : (
              openings.map((op) => (
                <div key={op.id} className={styles.wallRowCard}>
                  <div className={styles.wallRowGrid}>
                    <div>
                      <label className={styles.inputLabel}>Opening</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={op.name}
                        onChange={(e) => handleUpdateOpening(op.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={styles.inputLabel}>Width (ft)</label>
                      <input
                        type="number"
                        min="0.5"
                        step="any"
                        inputMode="decimal"
                        className={styles.textInput}
                        value={op.widthFeet || ''}
                        onChange={(e) => handleUpdateOpening(op.id, 'widthFeet', parseNum(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className={styles.inputLabel}>Height (ft)</label>
                      <input
                        type="number"
                        min="0.5"
                        step="any"
                        inputMode="decimal"
                        className={styles.textInput}
                        value={op.heightFeet || ''}
                        onChange={(e) => handleUpdateOpening(op.id, 'heightFeet', parseNum(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className={styles.inputLabel}>Qty</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className={styles.textInput}
                        value={op.quantity || 1}
                        onChange={(e) => handleUpdateOpening(op.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => handleRemoveOpening(op.id)}
                        title="Remove Opening"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section 3: Brick & Mortar Selection */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>3</span>
                Brick &amp; Mortar Specifications
              </h2>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={presetSelectId} className={styles.inputLabel}>
                Brick Type &amp; Size
                <span>{activePreset?.fractionLabel}</span>
              </label>
              <select
                id={presetSelectId}
                className={styles.selectInput}
                value={presetId}
                onChange={(e) => setPresetId(e.target.value)}
              >
                {Object.values(BRICK_PRESETS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.fractionLabel})
                  </option>
                ))}
                <option value="custom">Custom Size...</option>
              </select>
              <span className={styles.helperText}>
                {activePreset?.helperText || 'Sizes vary by manufacturer; confirm with your supplier.'}
              </span>
            </div>

            {presetId === 'custom' && (
              <div className={styles.inputRow} style={{ marginTop: '10px' }}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Length (in)</label>
                  <input
                    type="number"
                    step="0.125"
                    className={styles.textInput}
                    value={customLength}
                    onChange={(e) => setCustomLength(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Height (in)</label>
                  <input
                    type="number"
                    step="0.125"
                    className={styles.textInput}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Width / Bed (in)</label>
                  <input
                    type="number"
                    step="0.125"
                    className={styles.textInput}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Weight (lb)</label>
                  <input
                    type="number"
                    step="0.1"
                    className={styles.textInput}
                    value={customWeight}
                    onChange={(e) => setCustomWeight(e.target.value)}
                    placeholder="approx 4.5"
                  />
                </div>
              </div>
            )}

            <div className={styles.inputRow} style={{ marginTop: '12px' }}>
              <div className={styles.inputGroup}>
                <label htmlFor={mortarJointId} className={styles.inputLabel}>
                  Mortar Joint Thickness
                </label>
                <select
                  id={mortarJointId}
                  className={styles.selectInput}
                  value={mortarJoint}
                  onChange={(e) => setMortarJoint(parseFloat(e.target.value))}
                >
                  <option value={0.375}>3/8 inch (Standard 0.375&quot;)</option>
                  <option value={0.5}>1/2 inch (Thick 0.50&quot;)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={mortarTypeId} className={styles.inputLabel}>
                  Mortar Estimation Type
                </label>
                <select
                  id={mortarTypeId}
                  className={styles.selectInput}
                  value={mortarType}
                  onChange={(e) => setMortarType(e.target.value as MortarType)}
                >
                  <option value="preblended">Pre-Blended Mix (Sand Included)</option>
                  <option value="site-mixed">Masonry Cement + Mason Sand</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Wall Structure & Waste */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>4</span>
                Wall Structure &amp; Pricing
              </h2>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Wall Thickness / Wythe</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  className={`${styles.quickPill} ${!isDoubleWythe ? styles.quickPillActive : ''}`}
                  onClick={() => setIsDoubleWythe(false)}
                >
                  Single Wythe (Veneer)
                </button>
                <button
                  type="button"
                  className={`${styles.quickPill} ${isDoubleWythe ? styles.quickPillActive : ''}`}
                  onClick={() => setIsDoubleWythe(true)}
                >
                  Double Wythe (Solid Wall)
                </button>
              </div>
              <span className={styles.helperText}>
                {isDoubleWythe
                  ? 'Double wythe uses about twice the bricks and mortar for solid structural walls.'
                  : 'Single wythe is standard 4-inch exterior brick veneer tied to stud or CMU backup walls.'}
              </span>
            </div>

            {isDoubleWythe && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={fillCollarJoint}
                    onChange={(e) => setFillCollarJoint(e.target.checked)}
                  />
                  Fill 3/4-inch collar joint between wythes with mortar
                </label>
                <span className={styles.helperText}>
                  Adds net area × 0.0625 cu ft of mortar (+10% waste) to bond the two brick layers.
                </span>
              </div>
            )}

            <div className={styles.inputGroup} style={{ marginTop: '14px' }}>
              <label className={styles.inputLabel}>Cutting &amp; Breakage Waste</label>
              <div className={styles.quickPillsRow}>
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`${styles.quickPill} ${wastePercent === pct ? styles.quickPillActive : ''}`}
                    onClick={() => setWastePercent(pct)}
                  >
                    {pct}% {pct === 10 ? '(Recommended)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor={palletsInputId} className={styles.inputLabel}>
                  Bricks per Pallet
                </label>
                <input
                  id={palletsInputId}
                  type="number"
                  min="100"
                  step="25"
                  className={styles.textInput}
                  value={bricksPerPallet}
                  onChange={(e) => setBricksPerPallet(e.target.value)}
                />
                <span className={styles.helperText}>
                  Varies by brick type and manufacturer; ask your supplier.
                </span>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={priceBrickId} className={styles.inputLabel}>
                  Price per Brick ($) <span>(optional)</span>
                </label>
                <input
                  id={priceBrickId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.textInput}
                  value={pricePerBrick}
                  onChange={(e) => setPricePerBrick(e.target.value)}
                  placeholder="e.g. 0.85"
                />
              </div>
            </div>

            <div className={styles.inputGroup} style={{ marginTop: '12px' }}>
              <label htmlFor={priceMortarId} className={styles.inputLabel}>
                Price per 80 lb Mortar Bag ($) <span>(optional)</span>
              </label>
              <input
                id={priceMortarId}
                type="number"
                min="0"
                step="0.01"
                className={styles.textInput}
                value={pricePerMortarBag}
                onChange={(e) => setPricePerMortarBag(e.target.value)}
                placeholder="e.g. 11.50"
              />
            </div>
          </div>

          {/* Action Toolbar */}
          <div className={styles.toolbarRow}>
            <button type="button" className={styles.primaryButton} onClick={handleScrollToResults}>
              Calculate Bricks
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleReset}>
              Reset
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleCopySummary}>
              {copied ? '✓ Copied!' : 'Copy Summary'}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handlePrint}>
              Print
            </button>
          </div>
        </div>

        {/* Right Column: Live Results */}
        <div id="brick-results-panel" className={styles.resultsColumn} aria-live="polite">
          {/* Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>TOTAL BRICKS TO ORDER</div>
            <div className={styles.heroValue}>
              {results.totalBricksNeeded.toLocaleString()} Bricks
            </div>
            <div className={styles.heroSubtext}>
              {results.baseBricksNeeded.toLocaleString()} Base Bricks + {results.wasteBricks.toLocaleString()} Waste ({wastePercent}%)
            </div>
          </div>

          {/* Wall & Brick Breakdown Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Wall &amp; Brick Breakdown</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Gross Wall Area</span>
              <span className={styles.breakdownValue}>{results.grossWallAreaSqFt.toFixed(1)} sq ft</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Openings Deducted</span>
              <span className={styles.breakdownValue}>-{results.openingsAreaSqFt.toFixed(1)} sq ft</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Net Wall Area</span>
              <span className={styles.breakdownValue} style={{ color: '#0284C7', fontWeight: 800 }}>
                {results.netWallAreaSqFt.toFixed(1)} sq ft
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Coverage Rate</span>
              <span className={styles.breakdownValue}>{results.bricksPerSqFt.toFixed(3)} bricks / sq ft</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Nominal Dimensions</span>
              <span className={styles.breakdownValue}>
                {results.nominalLengthInches}&quot; × {results.nominalHeightInches}&quot; (with {mortarJoint}&quot; joint)
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Pallets Needed (~{bricksPerPallet}/pallet)</span>
              <span className={styles.breakdownValue}>
                about {results.palletsExact} pallets ({results.palletsRounded} rounded)
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Approximate Total Weight</span>
              <span className={styles.breakdownValue}>
                {results.totalWeightLbs.toLocaleString()} lbs ({results.totalWeightTons} tons)
              </span>
            </div>
          </div>

          {/* Mortar Breakdown Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Mortar Requirements</h3>

            {mortarType === 'preblended' ? (
              <>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>80 lb Pre-Blended Bags</span>
                  <span className={styles.breakdownValue} style={{ color: '#0369A1', fontSize: '1.05rem' }}>
                    {results.mortarBags80lb} bags
                  </span>
                </div>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>60 lb Pre-Blended Bags</span>
                  <span className={styles.breakdownValue}>{results.mortarBags60lb} bags</span>
                </div>
                {fillCollarJoint && isDoubleWythe && results.collarJointMortarBags80lb > 0 && (
                  <div className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>Collar Joint Share</span>
                    <span className={styles.breakdownValue}>+{results.collarJointMortarBags80lb} bags (80 lb)</span>
                  </div>
                )}
                <p className={styles.helperText} style={{ marginTop: '8px' }}>
                  Typical yield: ~35 modular bricks per 80 lb bag at 3/8&quot; joint. Varies by product and mason; follow product label.
                </p>
              </>
            ) : (
              <>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>70 lb Masonry Cement</span>
                  <span className={styles.breakdownValue} style={{ color: '#0369A1', fontSize: '1.05rem' }}>
                    {results.masonryCementBags70lb} bags
                  </span>
                </div>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Mason Sand</span>
                  <span className={styles.breakdownValue}>about {results.sandCubicYards} cu yd</span>
                </div>
                <p className={styles.helperText} style={{ marginTop: '8px' }}>
                  Rule of thumb: ~7.5 bags masonry cement and ~1.0 cu yd mason sand per 1,000 modular bricks.
                </p>
              </>
            )}
          </div>

          {/* Cost Card (only when prices are entered) */}
          {(results.brickCost > 0 || results.mortarCost > 0) && (
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>Estimated Material Cost</h3>

              {results.brickCost > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Bricks ({results.totalBricksNeeded.toLocaleString()} @ ${parseNum(pricePerBrick).toFixed(2)})</span>
                  <span className={styles.breakdownValue}>${results.brickCost.toFixed(2)}</span>
                </div>
              )}
              {results.mortarCost > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Mortar ({results.mortarBags80lb} bags @ ${parseNum(pricePerMortarBag).toFixed(2)})</span>
                  <span className={styles.breakdownValue}>${results.mortarCost.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.breakdownRow} style={{ borderTop: '2px solid #CBD5E1', marginTop: '6px', paddingTop: '10px' }}>
                <span className={styles.breakdownLabel} style={{ fontWeight: 800, color: '#0F172A' }}>Total Material Cost</span>
                <span className={styles.costHighlight}>${results.totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}

          <p className={styles.disclaimerNote}>
            Results are estimates. Structural, load-bearing and retaining walls must follow engineered plans and local code. Confirm brick size, weight, pallet count and mortar yield with your supplier or the product label.
          </p>
        </div>
      </div>
    </div>
  );
}
