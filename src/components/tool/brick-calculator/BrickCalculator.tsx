'use client';

import React, { useState, useId } from 'react';
import styles from './BrickCalculator.module.css';
import {
  BRICK_PRESETS,
  WallOpening,
  calculateBricks,
} from '@/lib/brick-engine';

export function BrickCalculator() {
  const lengthInputId = useId();
  const heightInputId = useId();
  const presetSelectId = useId();
  const mortarSelectId = useId();
  const priceBrickId = useId();
  const priceMortarId = useId();

  // Inputs state
  const [wallLength, setWallLength] = useState<number>(20);
  const [wallHeight, setWallHeight] = useState<number>(8);
  const [presetId, setPresetId] = useState<string>('modular');
  const [customLength, setCustomLength] = useState<number>(7.625);
  const [customHeight, setCustomHeight] = useState<number>(2.25);
  const [mortarJoint, setMortarJoint] = useState<number>(0.375); // 3/8"
  const [isDoubleWythe, setIsDoubleWythe] = useState<boolean>(false);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [pricePerBrick, setPricePerBrick] = useState<string>('');
  const [pricePerMortarBag, setPricePerMortarBag] = useState<string>('');

  // Openings state
  const [showOpenings, setShowOpenings] = useState<boolean>(false);
  const [openings, setOpenings] = useState<WallOpening[]>([]);

  // Feedback on copy
  const [copied, setCopied] = useState<boolean>(false);

  // Handlers for openings
  const handleAddDoor = () => {
    setOpenings([
      ...openings,
      {
        id: Math.random().toString(),
        name: 'Standard Door',
        widthFeet: 3,
        heightFeet: 6.8,
        quantity: 1,
      },
    ]);
    setShowOpenings(true);
  };

  const handleAddWindow = () => {
    setOpenings([
      ...openings,
      {
        id: Math.random().toString(),
        name: 'Standard Window',
        widthFeet: 3,
        heightFeet: 4,
        quantity: 1,
      },
    ]);
    setShowOpenings(true);
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

  // Perform Calculation
  const result = calculateBricks({
    wallLengthFeet: wallLength,
    wallHeightFeet: wallHeight,
    brickPresetId: presetId,
    customLengthInches: customLength,
    customHeightInches: customHeight,
    mortarJointInches: mortarJoint,
    isDoubleWythe,
    wastePercentage: wastePercent,
    openings,
    pricePerBrick: parseFloat(pricePerBrick) || 0,
    pricePerMortarBag: parseFloat(pricePerMortarBag) || 0,
  });

  const handleReset = () => {
    setWallLength(20);
    setWallHeight(8);
    setPresetId('modular');
    setCustomLength(7.625);
    setCustomHeight(2.25);
    setMortarJoint(0.375);
    setIsDoubleWythe(false);
    setWastePercent(10);
    setPricePerBrick('');
    setPricePerMortarBag('');
    setOpenings([]);
  };

  const handleCopySummary = () => {
    const summary = `--- Brick Calculation Summary (kkctools.com) ---
Wall Dimensions: ${wallLength} ft L x ${wallHeight} ft H
Gross Wall Area: ${result.grossWallAreaSqFt} sq ft
Openings Area Deducted: ${result.openingsAreaSqFt} sq ft
Net Wall Area: ${result.netWallAreaSqFt} sq ft
Brick Type: ${presetId === 'custom' ? 'Custom' : BRICK_PRESETS[presetId]?.name}
Mortar Joint: ${mortarJoint === 0.375 ? '3/8 inch' : '1/2 inch'}
Wall Type: ${isDoubleWythe ? 'Double Wythe (2-layer solid)' : 'Single Wythe (1-layer veneer)'}
Waste Margin: ${wastePercent}%

Results:
• Total Bricks to Order: ${result.totalBricksNeeded} bricks (Base: ${result.baseBricksNeeded} + Waste: ${result.wasteBricks})
• Pre-Mixed Mortar (80 lb bags): ~${result.mortarBags80lb} bags (Order ~${Math.ceil(result.mortarBags80lb)})
• Pre-Mixed Mortar (60 lb bags): ~${result.mortarBags60lb} bags
• Pallets / Cubes Needed: ~${result.palletsNeeded} pallets (based on ~500 bricks/pallet)
• Total Weight: ~${result.totalWeightLbs.toLocaleString()} lbs (${result.totalWeightTons} tons)
${result.totalCost > 0 ? `• Total Estimated Materials Cost: $${result.totalCost.toFixed(2)}` : ''}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.twoColumnGrid}>
        {/* Left Column: Input Form */}
        <div className={styles.inputColumn}>
          {/* Wall Dimensions */}
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor={lengthInputId} className={styles.inputLabel}>
                Wall Length <span>(feet)</span>
              </label>
              <input
                id={lengthInputId}
                type="number"
                min="0"
                step="0.5"
                value={wallLength || ''}
                onChange={(e) => setWallLength(parseFloat(e.target.value) || 0)}
                className={styles.textInput}
                placeholder="e.g. 20"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor={heightInputId} className={styles.inputLabel}>
                Wall Height <span>(feet)</span>
              </label>
              <input
                id={heightInputId}
                type="number"
                min="0"
                step="0.5"
                value={wallHeight || ''}
                onChange={(e) => setWallHeight(parseFloat(e.target.value) || 0)}
                className={styles.textInput}
                placeholder="e.g. 8"
              />
            </div>
          </div>

          {/* Brick Size Dropdown */}
          <div className={styles.inputGroup}>
            <label htmlFor={presetSelectId} className={styles.inputLabel}>
              Brick Size & Type
            </label>
            <select
              id={presetSelectId}
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              className={styles.selectInput}
            >
              {Object.values(BRICK_PRESETS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.description}
                </option>
              ))}
              <option value="custom">Custom Brick Dimensions...</option>
            </select>
            {presetId !== 'custom' && (
              <span className={styles.presetDescription}>
                Coverage: ~{result.bricksPerSqFt} bricks per sq ft (with 3/8&quot; mortar)
              </span>
            )}
          </div>

          {/* Custom Size Fields if selected */}
          {presetId === 'custom' && (
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Length (inches)</label>
                <input
                  type="number"
                  step="0.125"
                  value={customLength}
                  onChange={(e) => setCustomLength(parseFloat(e.target.value) || 0)}
                  className={styles.textInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Height (inches)</label>
                <input
                  type="number"
                  step="0.125"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 0)}
                  className={styles.textInput}
                />
              </div>
            </div>
          )}

          {/* Wall Structure: Single vs Double Wythe */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Wall Thickness / Construction</label>
            <div className={styles.wytheToggle}>
              <button
                type="button"
                className={`${styles.wytheOption} ${!isDoubleWythe ? styles.wytheSelected : ''}`}
                onClick={() => setIsDoubleWythe(false)}
              >
                <span className={styles.wytheTitle}>Single Wythe (1 Layer)</span>
                <span className={styles.wytheSub}>Exterior veneer, siding, or garden trim</span>
              </button>
              <button
                type="button"
                className={`${styles.wytheOption} ${isDoubleWythe ? styles.wytheSelected : ''}`}
                onClick={() => setIsDoubleWythe(true)}
              >
                <span className={styles.wytheTitle}>Double Wythe (2 Layers)</span>
                <span className={styles.wytheSub}>Solid structural wall (2x brick count)</span>
              </button>
            </div>
          </div>

          {/* Mortar Joint Thickness */}
          <div className={styles.inputGroup}>
            <label htmlFor={mortarSelectId} className={styles.inputLabel}>
              Mortar Bed Joint Thickness
            </label>
            <select
              id={mortarSelectId}
              value={mortarJoint}
              onChange={(e) => setMortarJoint(parseFloat(e.target.value))}
              className={styles.selectInput}
            >
              <option value={0.375}>3/8 inch (0.375&quot;) — US Industry Standard</option>
              <option value={0.5}>1/2 inch (0.500&quot;) — Heavy / Rustic Bed</option>
            </select>
          </div>

          {/* Openings Accordion */}
          <div className={styles.openingsSection}>
            <div
              className={styles.openingsHeader}
              onClick={() => setShowOpenings(!showOpenings)}
            >
              <span className={styles.openingsTitle}>
                Deduct Openings (Doors &amp; Windows)
              </span>
              <span className={styles.openingsBadge}>
                {openings.length > 0
                  ? `${openings.length} deducted (${result.openingsAreaSqFt} sq ft)`
                  : showOpenings
                  ? 'Collapse ▲'
                  : '+ Add Openings ▼'}
              </span>
            </div>

            {showOpenings && (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={handleAddDoor}
                    className={styles.addOpeningBtn}
                  >
                    + Add Standard Door (3&apos; × 6.8&apos;)
                  </button>
                  <button
                    type="button"
                    onClick={handleAddWindow}
                    className={styles.addOpeningBtn}
                  >
                    + Add Standard Window (3&apos; × 4&apos;)
                  </button>
                </div>

                {openings.length > 0 && (
                  <div className={styles.openingsList}>
                    {openings.map((op) => (
                      <div key={op.id} className={styles.openingRow}>
                        <input
                          type="text"
                          value={op.name}
                          onChange={(e) =>
                            handleUpdateOpening(op.id, 'name', e.target.value)
                          }
                          className={styles.textInput}
                          placeholder="Label"
                        />
                        <input
                          type="number"
                          step="0.1"
                          value={op.widthFeet}
                          onChange={(e) =>
                            handleUpdateOpening(
                              op.id,
                              'widthFeet',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className={styles.textInput}
                          placeholder="W (ft)"
                          title="Width in feet"
                        />
                        <input
                          type="number"
                          step="0.1"
                          value={op.heightFeet}
                          onChange={(e) =>
                            handleUpdateOpening(
                              op.id,
                              'heightFeet',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className={styles.textInput}
                          placeholder="H (ft)"
                          title="Height in feet"
                        />
                        <input
                          type="number"
                          min="1"
                          value={op.quantity}
                          onChange={(e) =>
                            handleUpdateOpening(
                              op.id,
                              'quantity',
                              parseInt(e.target.value, 10) || 1
                            )
                          }
                          className={styles.textInput}
                          placeholder="Qty"
                          title="Quantity"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOpening(op.id)}
                          className={styles.removeBtn}
                          title="Remove Opening"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Waste Factor Pills */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Waste Factor Allowance <span>(Cuts, Breakage, Corners)</span>
            </label>
            <div className={styles.pillGroup}>
              {[0, 5, 10, 15, 20].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWastePercent(w)}
                  className={`${styles.pillButton} ${
                    wastePercent === w ? styles.pillActive : ''
                  }`}
                >
                  {w === 10 ? '10% (Recommended)' : `${w}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Pricing */}
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor={priceBrickId} className={styles.inputLabel}>
                Price per Brick <span>($/unit - optional)</span>
              </label>
              <input
                id={priceBrickId}
                type="number"
                step="0.05"
                min="0"
                value={pricePerBrick}
                onChange={(e) => setPricePerBrick(e.target.value)}
                className={styles.textInput}
                placeholder="e.g. 0.85"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor={priceMortarId} className={styles.inputLabel}>
                Price per 80 lb Mortar <span>($/bag - optional)</span>
              </label>
              <input
                id={priceMortarId}
                type="number"
                step="0.50"
                min="0"
                value={pricePerMortarBag}
                onChange={(e) => setPricePerMortarBag(e.target.value)}
                className={styles.textInput}
                placeholder="e.g. 11.50"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output Display */}
        <div className={styles.resultsColumn}>
          {/* Hero Big Banner */}
          <div className={styles.heroResultCard}>
            <div className={styles.heroLabel}>Total Bricks to Order</div>
            <div className={styles.heroBigNumber}>
              {result.totalBricksNeeded.toLocaleString()}
              <span className={styles.heroUnit}>bricks</span>
            </div>
            <div className={styles.heroSubtext}>
              Base Count: {result.baseBricksNeeded.toLocaleString()} bricks | +{wastePercent}% Waste Margin: +{result.wasteBricks.toLocaleString()}
            </div>
          </div>

          {/* Secondary Specifications */}
          <div className={styles.secondaryResultsCard}>
            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Net Wall Face Area</span>
              <span className={styles.outputValue}>
                {result.netWallAreaSqFt} sq ft{' '}
                {result.openingsAreaSqFt > 0 && (
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    (Gross: {result.grossWallAreaSqFt} sq ft)
                  </span>
                )}
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Pre-Mixed Mortar (80 lb bags)</span>
              <span className={styles.outputValue}>
                ~{result.mortarBags80lb} bags{' '}
                <span style={{ color: '#0284C7', fontWeight: 500 }}>
                  (Order {Math.ceil(result.mortarBags80lb)})
                </span>
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Pre-Mixed Mortar (60 lb bags)</span>
              <span className={styles.outputValue}>
                ~{result.mortarBags60lb} bags{' '}
                <span style={{ color: '#64748B', fontWeight: 400 }}>
                  ({Math.ceil(result.mortarBags60lb)} bags)
                </span>
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Pallets / Cubes Required</span>
              <span className={styles.outputValue}>
                ~{result.palletsNeeded} pallets{' '}
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  (~500 bricks/pallet)
                </span>
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Estimated Total Dry Weight</span>
              <span className={styles.outputValue}>
                {result.totalWeightLbs.toLocaleString()} lbs ({result.totalWeightTons} tons)
              </span>
            </div>

            <div className={styles.outputRow}>
              <span className={styles.outputLabel}>Bricks per Square Foot</span>
              <span className={styles.outputValue}>
                {result.bricksPerSqFt} bricks/sq ft
              </span>
            </div>
          </div>

          {/* Optional Cost Section */}
          {result.totalCost > 0 && (
            <div className={styles.costSection}>
              <div className={styles.outputRow}>
                <span className={styles.outputLabel}>Estimated Brick Cost:</span>
                <span className={styles.outputValue}>${result.brickCost.toFixed(2)}</span>
              </div>
              {result.mortarCost > 0 && (
                <div className={styles.outputRow}>
                  <span className={styles.outputLabel}>
                    Estimated Mortar Cost ({Math.ceil(result.mortarBags80lb)} bags):
                  </span>
                  <span className={styles.outputValue}>${result.mortarCost.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.costTotalRow}>
                <span>Total Materials Cost:</span>
                <span>${result.totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className={styles.actionRow}>
            <button
              type="button"
              onClick={handleCopySummary}
              className={styles.copyButton}
            >
              {copied ? '✓ Calculation Copied!' : '📋 Copy Calculation Summary'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

