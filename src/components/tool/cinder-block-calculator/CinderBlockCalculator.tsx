'use client';

import React, { useState, useId, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  BlockPresetKey,
  BLOCK_PRESETS,
  CoreFillFrequency,
  MortarType,
  WallItem,
  OpeningItem,
  calculateCinderBlocks,
  parseDimension,
} from '@/lib/cinder-block-engine';
import styles from './CinderBlockCalculator.module.css';

const STORAGE_KEY = 'kkc_cmu_calc_walls_v2';

export default function CinderBlockCalculator() {
  // Wall rows with add/remove
  const [walls, setWalls] = useState<WallItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Ignore
      }
    }
    return [{ id: 'w1', name: 'Main Wall', lengthFeet: 30, heightFeet: 8, heightMode: 'feet', quantity: 1 }];
  });

  // Save walls to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(walls));
    } catch {
      // Ignore
    }
  }, [walls]);

  // Block & Joint config
  const [presetKey, setPresetKey] = useState<BlockPresetKey>('standard_8');
  const [customActualLength, setCustomActualLength] = useState<string>('15.625');
  const [customActualHeight, setCustomActualHeight] = useState<string>('7.625');
  const [customActualDepth, setCustomActualDepth] = useState<string>('7.625');
  const [mortarJoint, setMortarJoint] = useState<string>('0.375'); // 3/8" = 0.375
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [customWaste, setCustomWaste] = useState<string>('');
  const [blocksPerPallet, setBlocksPerPallet] = useState<string>('90');

  // Openings config
  const [openings, setOpenings] = useState<OpeningItem[]>([
    { id: '1', name: 'Entry Door', type: 'door', widthFeet: 3, heightFeet: 7, count: 1 },
    { id: '2', name: 'Window', type: 'window', widthFeet: 4, heightFeet: 3, count: 1 },
  ]);

  // Mortar type
  const [mortarType, setMortarType] = useState<MortarType>('preblended');

  // Core fill (collapsible, off by default)
  const [coreFillOpen, setCoreFillOpen] = useState<boolean>(false);
  const [coreFillFrequency, setCoreFillFrequency] = useState<CoreFillFrequency>('none');
  const [bondBeamCourses, setBondBeamCourses] = useState<string>('0');
  const [groutWastePercent, setGroutWastePercent] = useState<string>('10');

  // Pricing inputs
  const [costPerBlock, setCostPerBlock] = useState<string>('2.25');
  const [costPerMortar, setCostPerMortar] = useState<string>('12.50');

  const [copied, setCopied] = useState<boolean>(false);
  const idPrefix = useId();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Effective waste percentage
  const effectiveWaste =
    wastePercent === -1 ? Math.max(0, parseDimension(customWaste)) : wastePercent;

  // Wall management
  const handleAddWall = () => {
    const newId = String(Date.now());
    setWalls([
      ...walls,
      {
        id: newId,
        name: `Wall ${walls.length + 1}`,
        lengthFeet: 20,
        heightFeet: 8,
        heightMode: 'feet',
        quantity: 1,
      },
    ]);
  };

  const handleRemoveWall = (id: string) => {
    if (walls.length <= 1) return;
    setWalls(walls.filter((w) => w.id !== id));
  };

  const handleUpdateWall = (id: string, updates: Partial<WallItem>) => {
    setWalls(walls.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  // Openings management
  const handleAddOpening = (type: 'door' | 'window' | 'custom') => {
    const newId = String(Date.now());
    if (type === 'door') {
      setOpenings([
        ...openings,
        { id: newId, name: `Door ${openings.length + 1}`, type: 'door', widthFeet: 3, heightFeet: 7, count: 1 },
      ]);
    } else if (type === 'window') {
      setOpenings([
        ...openings,
        { id: newId, name: `Window ${openings.length + 1}`, type: 'window', widthFeet: 4, heightFeet: 3, count: 1 },
      ]);
    } else {
      setOpenings([
        ...openings,
        { id: newId, name: `Custom Cutout ${openings.length + 1}`, type: 'custom', widthFeet: 0, heightFeet: 0, count: 1, customAreaSqFt: 15 },
      ]);
    }
  };

  const handleRemoveOpening = (id: string) => {
    setOpenings(openings.filter((o) => o.id !== id));
  };

  const handleUpdateOpening = (id: string, updates: Partial<OpeningItem>) => {
    setOpenings(openings.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const handleReset = () => {
    setWalls([{ id: 'w1', name: 'Main Wall', lengthFeet: 30, heightFeet: 8, heightMode: 'feet', quantity: 1 }]);
    setPresetKey('standard_8');
    setCustomActualLength('15.625');
    setCustomActualHeight('7.625');
    setCustomActualDepth('7.625');
    setMortarJoint('0.375');
    setWastePercent(10);
    setCustomWaste('');
    setBlocksPerPallet('90');
    setOpenings([
      { id: '1', name: 'Entry Door', type: 'door', widthFeet: 3, heightFeet: 7, count: 1 },
      { id: '2', name: 'Window', type: 'window', widthFeet: 4, heightFeet: 3, count: 1 },
    ]);
    setMortarType('preblended');
    setCoreFillFrequency('none');
    setBondBeamCourses('0');
    setGroutWastePercent('10');
    setCostPerBlock('2.25');
    setCostPerMortar('12.50');
    setCopied(false);
  };

  const result = calculateCinderBlocks({
    walls,
    presetKey,
    customActualLengthInches: parseDimension(customActualLength),
    customActualHeightInches: parseDimension(customActualHeight),
    customActualDepthInches: parseDimension(customActualDepth),
    mortarJointInches: parseDimension(mortarJoint),
    openings,
    wastePercent: effectiveWaste,
    mortarType,
    coreFillFrequency,
    bondBeamCourses: parseDimension(bondBeamCourses),
    groutWastePercent: parseDimension(groutWastePercent),
    blocksPerPallet: parseDimension(blocksPerPallet),
    costPerBlock: parseDimension(costPerBlock),
    costPerMortarBag: parseDimension(costPerMortar),
  });

  const handleCalculateClick = () => {
    if (window.innerWidth < 900 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopy = () => {
    const coreFillLine = result.coreFillEnabled
      ? `• Core Fill Volume: ${result.coreFillWithWasteCuYds} cu yd (${result.coreFillBags80lb} bags of 80 lb concrete mix)\n`
      : '';

    const summary = `Cinder Block (CMU) Wall Takeoff Summary:
• Total Blocks to Order: ${result.totalBlocksWithWaste.toLocaleString()} blocks (Net: ${result.netBlocks.toFixed(1)} + ${effectiveWaste}% waste)
• Net Wall Area: ${result.netWallAreaSqFt.toLocaleString()} sq ft (Gross: ${result.grossWallAreaSqFt.toLocaleString()} sq ft)
• Wall Courses (Rows): ~${result.maxCourses} courses (~${result.maxBlocksPerRow} blocks per row)
• Mortar Required: ${result.mortarBags80lb.toLocaleString()} bags (${result.mortarType === 'masonry_cement' ? '80 lb masonry cement' : '80 lb pre-blended mix'})
• Approx. Weight: ~${result.totalWeightLbs.toLocaleString()} lbs (${result.totalWeightTons} tons)
• Estimated Pallets: ~${result.palletsCount} pallets (at ${result.blocksPerPallet} blocks/pallet)
${coreFillLine}${result.totalEstimatedCost > 0 ? `• Estimated Material Budget: $${result.totalEstimatedCost.toLocaleString()} (Blocks: $${result.estimatedBlockCost.toLocaleString()}, Mortar: $${result.estimatedMortarCost.toLocaleString()})\n` : ''}
Calculated with KKCTools Cinder Block Calculator (https://kkctools.com/cinder-block-calculator/)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.calculatorContainer}>
      <div className={styles.layoutGrid}>
        {/* Left Inputs Panel */}
        <div className={styles.inputsPanel}>
          {/* Section 1: Wall Rows */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>1. Cinder Block Wall Calculator (Wall Dimensions)</h2>
              <span className={styles.cardSubText}>Add multiple walls with distinct lengths and heights</span>
            </div>

            <div className={styles.wallsList}>
              {walls.map((wall) => (
                <div key={wall.id} className={styles.wallItem}>
                  <div className={styles.wallItemHeader}>
                    <input
                      type="text"
                      className={styles.wallNameInput}
                      value={wall.name}
                      onChange={(e) => handleUpdateWall(wall.id, { name: e.target.value })}
                      aria-label="Wall Name"
                    />
                    {walls.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeSmallButton}
                        onClick={() => handleRemoveWall(wall.id)}
                        aria-label={`Remove ${wall.name}`}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.inputRow3}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Length (ft)</label>
                      <input aria-label="Length (ft)"
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={wall.lengthFeet || ''}
                        onChange={(e) =>
                          handleUpdateWall(wall.id, { lengthFeet: parseDimension(e.target.value) })
                        }
                        placeholder="e.g. 30"
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <div className={styles.labelWithToggle}>
                        <label className={styles.label}>Height</label>
                        <button
                          type="button"
                          className={styles.unitToggleLink}
                          onClick={() =>
                            handleUpdateWall(wall.id, {
                              heightMode: wall.heightMode === 'courses' ? 'feet' : 'courses',
                            })
                          }
                        >
                          {wall.heightMode === 'courses' ? 'Switch to Feet' : 'Switch to Courses'}
                        </button>
                      </div>

                      {wall.heightMode === 'courses' ? (
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={wall.courses || ''}
                          onChange={(e) =>
                            handleUpdateWall(wall.id, { courses: parseDimension(e.target.value) })
                          }
                          placeholder="e.g. 12 courses"
                        />
                      ) : (
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={wall.heightFeet || ''}
                          onChange={(e) =>
                            handleUpdateWall(wall.id, { heightFeet: parseDimension(e.target.value) })
                          }
                          placeholder="e.g. 8 ft"
                        />
                      )}
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Quantity</label>
                      <input aria-label="Quantity"
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={wall.quantity || 1}
                        onChange={(e) =>
                          handleUpdateWall(wall.id, { quantity: parseDimension(e.target.value) })
                        }
                        placeholder="1"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className={styles.addWallButton} onClick={handleAddWall}>
                + Add Another Wall Row
              </button>
            </div>
          </div>

          {/* Section 2: Openings Deductions */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>2. Doors, Windows &amp; Cutouts (Deductions)</h2>
              <span className={styles.cardSubText}>Subtract doors, windows, and custom cutouts from gross area</span>
            </div>

            <div className={styles.openingsList}>
              {openings.map((op) => (
                <div key={op.id} className={styles.openingItem}>
                  <div className={styles.wallItemHeader}>
                    <input
                      type="text"
                      className={styles.wallNameInput}
                      value={op.name}
                      onChange={(e) => handleUpdateOpening(op.id, { name: e.target.value })}
                      aria-label="Opening Name"
                    />
                    <button
                      type="button"
                      className={styles.removeSmallButton}
                      onClick={() => handleRemoveOpening(op.id)}
                      aria-label={`Remove ${op.name}`}
                    >
                      ✕ Remove
                    </button>
                  </div>

                  {op.type === 'custom' ? (
                    <div className={styles.inputRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Custom Area (sq ft)</label>
                        <input aria-label="Custom Area (sq ft)"
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={op.customAreaSqFt || ''}
                          onChange={(e) =>
                            handleUpdateOpening(op.id, { customAreaSqFt: parseDimension(e.target.value) })
                          }
                          placeholder="sq ft"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Count</label>
                        <input aria-label="Count"
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={op.count || 1}
                          onChange={(e) =>
                            handleUpdateOpening(op.id, { count: parseDimension(e.target.value) })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.inputRow3}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Width (ft)</label>
                        <input aria-label="Width (ft)"
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={op.widthFeet || ''}
                          onChange={(e) =>
                            handleUpdateOpening(op.id, { widthFeet: parseDimension(e.target.value) })
                          }
                          placeholder="ft"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Height (ft)</label>
                        <input aria-label="Height (ft)"
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={op.heightFeet || ''}
                          onChange={(e) =>
                            handleUpdateOpening(op.id, { heightFeet: parseDimension(e.target.value) })
                          }
                          placeholder="ft"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Count</label>
                        <input aria-label="Count"
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={op.count || 1}
                          onChange={(e) =>
                            handleUpdateOpening(op.id, { count: parseDimension(e.target.value) })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className={styles.openingButtonsRow}>
                <button
                  type="button"
                  className={styles.secondarySmallButton}
                  onClick={() => handleAddOpening('door')}
                >
                  + Add Door (3×7 ft)
                </button>
                <button
                  type="button"
                  className={styles.secondarySmallButton}
                  onClick={() => handleAddOpening('window')}
                >
                  + Add Window (4×3 ft)
                </button>
                <button
                  type="button"
                  className={styles.secondarySmallButton}
                  onClick={() => handleAddOpening('custom')}
                >
                  + Add Custom Deduction
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Block & Mortar Specifications */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>3. Block Size, Joint &amp; Mortar Type</h2>
              <span className={styles.cardSubText}>Nominal and actual block geometry with mortar coverage</span>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`${idPrefix}-preset`} className={styles.label}>
                Select Block Size (Nominal Dimensions)
              </label>
              <select
                id={`${idPrefix}-preset`}
                className={styles.selectField}
                value={presetKey}
                onChange={(e) => setPresetKey(e.target.value as BlockPresetKey)}
              >
                {Object.values(BLOCK_PRESETS).map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {presetKey === 'custom' && (
              <div className={styles.customBlockCard}>
                <p className={styles.customHint}>
                  Enter ACTUAL manufactured block dimensions in inches. The engine adds the mortar joint automatically:
                </p>
                <div className={styles.inputRow3}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Actual Length (in)</label>
                    <input aria-label="Actual Length (in)"
                      type="text"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={customActualLength}
                      onChange={(e) => setCustomActualLength(e.target.value)}
                      placeholder="e.g. 15.625"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Actual Height (in)</label>
                    <input aria-label="Actual Height (in)"
                      type="text"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={customActualHeight}
                      onChange={(e) => setCustomActualHeight(e.target.value)}
                      placeholder="e.g. 7.625"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Actual Thickness (in)</label>
                    <input aria-label="Actual Thickness (in)"
                      type="text"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={customActualDepth}
                      onChange={(e) => setCustomActualDepth(e.target.value)}
                      placeholder="e.g. 7.625"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className={styles.inputRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-joint`} className={styles.label}>
                  Mortar Joint Thickness
                </label>
                <select
                  id={`${idPrefix}-joint`}
                  className={styles.selectField}
                  value={mortarJoint}
                  onChange={(e) => setMortarJoint(e.target.value)}
                >
                  <option value="0.375">3/8&quot; (0.375 in) — Standard (1.125 blocks/sq ft)</option>
                  <option value="0.5">1/2&quot; (0.50 in) — Heavy Joint (1.099 blocks/sq ft)</option>
                  <option value="0.25">1/4&quot; (0.25 in) — Thin Bed Joint</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-mortar-type`} className={styles.label}>
                  Mortar Product Type
                </label>
                <select
                  id={`${idPrefix}-mortar-type`}
                  className={styles.selectField}
                  value={mortarType}
                  onChange={(e) => setMortarType(e.target.value as MortarType)}
                >
                  <option value="preblended">Pre-Blended Mortar Mix (Sand Included, ~13 blocks/80lb)</option>
                  <option value="masonry_cement">Masonry Cement (You Add Sand, ~35 blocks/80lb)</option>
                </select>
              </div>
            </div>

            {mortarType === 'masonry_cement' && (
              <div className={styles.masonryNotice}>
                ℹ️ Masonry cement requires mixing with masonry sand on-site (roughly 2.25 to 3 parts sand per part cement). Use our live{' '}
                <Link href="/sand-calculator/" className={styles.inlineLink}>
                  Sand Calculator
                </Link>{' '}
                to order exact sand tonnage.
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Waste &amp; Cutting Allowance</label>
              <div className={styles.chipGroup}>
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`${styles.chip} ${wastePercent === pct ? styles.chipSelected : ''}`}
                    onClick={() => setWastePercent(pct)}
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  type="button"
                  className={`${styles.chip} ${wastePercent === -1 ? styles.chipSelected : ''}`}
                  onClick={() => setWastePercent(-1)}
                >
                  Custom
                </button>
              </div>
              {wastePercent === -1 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Custom waste % (e.g. 12)"
                    className={styles.inputField}
                    value={customWaste}
                    onChange={(e) => setCustomWaste(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className={styles.inputRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-pallet`} className={styles.label}>
                  Blocks per Pallet (Approx.)
                </label>
                <input
                  id={`${idPrefix}-pallet`}
                  type="text"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={blocksPerPallet}
                  onChange={(e) => setBlocksPerPallet(e.target.value)}
                  placeholder="90"
                />
                <span className={styles.fieldHelper}>Commonly 72–120 depending on supplier</span>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-cost-block`} className={styles.label}>
                  Block Price ($ / each)
                </label>
                <input
                  id={`${idPrefix}-cost-block`}
                  type="text"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={costPerBlock}
                  onChange={(e) => setCostPerBlock(e.target.value)}
                  placeholder="e.g. 2.25"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`${idPrefix}-cost-mortar`} className={styles.label}>
                Mortar Price ($ / 80lb bag) — Optional
              </label>
              <input
                id={`${idPrefix}-cost-mortar`}
                type="text"
                inputMode="decimal"
                className={styles.inputField}
                value={costPerMortar}
                onChange={(e) => setCostPerMortar(e.target.value)}
                placeholder="e.g. 12.50"
              />
            </div>
          </div>

          {/* Section 4: Concrete Core Fill (Collapsible) */}
          <div className={styles.sectionCard}>
            <button
              type="button"
              className={styles.accordionHeader}
              onClick={() => setCoreFillOpen(!coreFillOpen)}
              aria-expanded={coreFillOpen}
            >
              <div className={styles.accordionTitleGroup}>
                <span className={styles.accordionTitle}>4. Concrete Core Fill &amp; Grouting (Optional)</span>
                <span className={styles.accordionBadge}>
                  {coreFillFrequency === 'none' ? 'Disabled (Hollow)' : 'Active'}
                </span>
              </div>
              <span className={styles.accordionIcon}>{coreFillOpen ? '▲' : '▼'}</span>
            </button>

            {coreFillOpen && (
              <div className={styles.accordionContent}>
                <p className={styles.cardSubText} style={{ marginBottom: '1rem' }}>
                  Estimate concrete grout volume for hollow CMU cells and bond beams. Engineered structural drawings dictate real spacing.
                </p>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${idPrefix}-core-fill`} className={styles.label}>
                    Core Fill Spacing Pattern
                  </label>
                  <select
                    id={`${idPrefix}-core-fill`}
                    className={styles.selectField}
                    value={coreFillFrequency}
                    onChange={(e) => setCoreFillFrequency(e.target.value as CoreFillFrequency)}
                  >
                    <option value="none">No Fill — Unreinforced / Hollow Wall (0%)</option>
                    <option value="all">100% Solid Grout — Every Cell Filled (Heavy Retaining/Security)</option>
                    <option value="every_32">Grout Vertical Rebar at 32&quot; o.c. (25% — 1 cell in 4)</option>
                    <option value="every_48">Grout Vertical Rebar at 48&quot; o.c. (16.7% — 1 cell in 6)</option>
                  </select>
                </div>

                {coreFillFrequency !== 'none' && (
                  <div className={styles.inputRow}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor={`${idPrefix}-bond-beam`} className={styles.label}>
                        Bond Beam Courses (Solid Filled)
                      </label>
                      <input
                        id={`${idPrefix}-bond-beam`}
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={bondBeamCourses}
                        onChange={(e) => setBondBeamCourses(e.target.value)}
                        placeholder="0"
                      />
                      <span className={styles.fieldHelper}>Horizontal reinforcement rows</span>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor={`${idPrefix}-grout-waste`} className={styles.label}>
                        Grout Waste Allowance (%)
                      </label>
                      <input
                        id={`${idPrefix}-grout-waste`}
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={groutWastePercent}
                        onChange={(e) => setGroutWastePercent(e.target.value)}
                        placeholder="10"
                      />
                      <span className={styles.fieldHelper}>Default 10% for cell spill &amp; hopper loss</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtonGroup}>
            <button
              type="button"
              className={styles.primaryActionButton}
              onClick={handleCalculateClick}
            >
              Calculate Cinder Blocks
            </button>
            <button type="button" className={styles.secondaryActionButton} onClick={handleReset}>
              Reset
            </button>
          </div>
          <p className={styles.buttonHelperText}>
            Tip: The cinder block calculator calculates live as you type. Click &ldquo;Calculate Cinder Blocks&rdquo; to scroll results into view on mobile.
          </p>
        </div>

        {/* Right Results Panel */}
        <div className={styles.resultsPanel} ref={resultsRef} aria-live="polite">
          {result.isOpeningExceeding && (
            <div className={styles.errorNotice} role="alert">
              Warning: Openings area ({result.openingsAreaSqFt} sq ft) exceeds gross wall area ({result.grossWallAreaSqFt} sq ft). Check your door and window dimensions.
            </div>
          )}

          {/* Primary Order Card */}
          <div className={styles.primaryResultCard}>
            <div className={styles.primaryResultLabel}>Total Cinder Blocks to Order</div>
            <div className={styles.primaryResultValue}>
              {result.totalBlocksWithWaste.toLocaleString()}{' '}
              <span className={styles.unitSuffix}>blocks</span>
            </div>
            <div className={styles.primaryResultSub}>
              Net Required: <strong>{result.netBlocks.toFixed(1)} blocks</strong> (Includes +{effectiveWaste}% waste)
            </div>
          </div>

          {/* Wall Specs Breakdown */}
          <div className={styles.breakdownCard}>
            <div className={styles.breakdownTitle}>Wall Geometry &amp; Course Layout</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Net Wall Area</span>
              <span className={styles.breakdownValue}>
                {result.netWallAreaSqFt.toLocaleString()} sq ft{' '}
                <span className={styles.subtextInline}>(Gross: {result.grossWallAreaSqFt} sq ft)</span>
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Openings Deducted</span>
              <span className={styles.breakdownValue}>−{result.openingsAreaSqFt.toLocaleString()} sq ft</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Coverage Rate</span>
              <span className={styles.breakdownValue}>{result.blocksPerSqFt.toFixed(3)} blocks / sq ft</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Wall Height Courses (Rows)</span>
              <span className={styles.breakdownValue}>~{result.maxCourses} courses</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Blocks per Row (Course)</span>
              <span className={styles.breakdownValue}>~{result.maxBlocksPerRow} blocks / row</span>
            </div>
          </div>

          {/* Mortar Breakdown */}
          <div className={styles.breakdownCard}>
            <div className={styles.breakdownTitle}>Mortar Requirements</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>
                {result.mortarType === 'masonry_cement'
                  ? 'Masonry Cement (80 lb bags)'
                  : 'Pre-Blended Mortar Mix (80 lb)'}
              </span>
              <span className={styles.breakdownValue}>{result.mortarBags80lb.toLocaleString()} bags</span>
            </div>
            {result.mortarType === 'preblended' && (
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Alternative (60 lb bags)</span>
                <span className={styles.breakdownValue}>{result.mortarBags60lb.toLocaleString()} bags</span>
              </div>
            )}
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Typical Joint Yield</span>
              <span className={styles.breakdownValue}>
                {result.mortarType === 'masonry_cement' ? '~35 blocks / 80lb' : '~13 blocks / 80lb'}
              </span>
            </div>
          </div>

          {/* Core Fill Breakdown (If enabled) */}
          {result.coreFillEnabled && (
            <div className={styles.breakdownCard}>
              <div className={styles.breakdownTitle}>Concrete Core Fill (Grout)</div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Grout Volume</span>
                <span className={styles.breakdownValue}>
                  {result.coreFillWithWasteCuYds} cu yd ({result.coreFillCuFt} cu ft net)
                </span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Pre-Mix Concrete Bags (80 lb)</span>
                <span className={styles.breakdownValue}>{result.coreFillBags80lb.toLocaleString()} bags</span>
              </div>
              {result.suggestReadyMix && (
                <div className={styles.readyMixTip}>
                  💡 Volume exceeds 0.5 cu yd ({result.coreFillWithWasteCuYds} cu yd). Consider ordering ready-mix concrete from a truck. Verify with our{' '}
                  <Link href="/cubic-yard-calculator/" className={styles.inlineLink}>
                    Cubic Yard Calculator
                  </Link>.
                </div>
              )}
            </div>
          )}

          {/* Weight & Pallets */}
          <div className={styles.breakdownCard}>
            <div className={styles.breakdownTitle}>Weight, Shipping &amp; Logistics</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Block Weight</span>
              <span className={styles.breakdownValue}>
                ~{result.totalWeightLbs.toLocaleString()} lbs ({result.totalWeightTons} tons)
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Estimated Pallets</span>
              <span className={styles.breakdownValue}>
                ~{result.palletsCount} pallets ({result.blocksPerPallet} / pallet)
              </span>
            </div>
          </div>

          {/* Material Cost Breakdown */}
          {result.totalEstimatedCost > 0 && (
            <div className={styles.breakdownCard}>
              <div className={styles.breakdownTitle}>Estimated Material Budget</div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Cinder Blocks Only</span>
                <span className={styles.breakdownValue}>${result.estimatedBlockCost.toLocaleString()}</span>
              </div>
              {result.estimatedMortarCost > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Mortar Mix Cost</span>
                  <span className={styles.breakdownValue}>${result.estimatedMortarCost.toLocaleString()}</span>
                </div>
              )}
              <div className={styles.breakdownRow} style={{ borderTop: '1px solid var(--color-border, #e5e7eb)', paddingTop: '0.5rem' }}>
                <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: 'var(--color-text, #0f172a)' }}>
                  Total Estimated Material
                </span>
                <span className={styles.breakdownValue} style={{ color: 'var(--color-primary, #0369A1)', fontSize: '1.05rem' }}>
                  ${result.totalEstimatedCost.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Copy and Print */}
          <div className={styles.resultsUtilityRow}>
            <button type="button" className={styles.utilityButton} onClick={handleCopy}>
              {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
            </button>
            <button type="button" className={styles.utilityButton} onClick={handlePrint}>
              🖨️ Print
            </button>
          </div>
          {copied && <div className={styles.copiedMessage}>✓ Summary copied to clipboard!</div>}
        </div>
      </div>
    </div>
  );
}
