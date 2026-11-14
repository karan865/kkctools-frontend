'use client';

import React, { useState, useId } from 'react';
import styles from './TileCalculator.module.css';
import {
  TILE_PRESETS,
  GROUT_JOINT_OPTIONS,
  PATTERN_PRESETS,
  TILE_MATERIAL_OPTIONS,
  DEFAULT_PRICES,
  LAST_VERIFIED,
} from '@/lib/tile-constants';
import {
  calculateTiles,
  TileAreaItem,
  PricingUnit,
  BoxPackagingMode,
} from '@/lib/tile-engine';

export type ProjectType = 'floor' | 'shower' | 'backsplash';

export function TileCalculator() {
  const directAreaInputId = useId();
  const presetSelectId = useId();
  const customLengthId = useId();
  const customWidthId = useId();
  const customThicknessId = useId();
  const groutJointId = useId();
  const boxUnitsId = useId();
  const priceUnitId = useId();
  const unitPriceId = useId();
  const mortarPriceId = useId();
  const groutPriceId = useId();
  const toolsPriceId = useId();

  // Mode: 'areas' | 'direct'
  const [mode, setMode] = useState<'areas' | 'direct'>('areas');
  const [directArea, setDirectArea] = useState<number>(120);

  // Project Type
  const [projectType, setProjectType] = useState<ProjectType>('floor');

  // Areas list (default: 12x10 floor)
  const [areas, setAreas] = useState<TileAreaItem[]>([
    { id: '1', name: 'Main Floor', lengthFeet: 12, widthFeet: 10, type: 'add' },
  ]);

  // Tile dimensions & presets
  const [tilePresetId, setTilePresetId] = useState<string>('tile12x12');
  const [customLength, setCustomLength] = useState<number>(12);
  const [customWidth, setCustomWidth] = useState<number>(12);
  const [customThickness, setCustomThickness] = useState<number>(0.375);

  // Grout & pattern
  const [groutJoint, setGroutJoint] = useState<number>(0.125);
  const [patternId, setPatternId] = useState<string>('grid');
  const [wastePercent, setWastePercent] = useState<number>(10);

  // Packaging
  const [boxMode, setBoxMode] = useState<BoxPackagingMode>('tilesPerBox');
  const [tilesPerBox, setTilesPerBox] = useState<number>(10);
  const [sqFtPerBox, setSqFtPerBox] = useState<number>(10);

  // Pricing
  const [pricingUnit, setPricingUnit] = useState<PricingUnit>('sqft');
  const [unitPrice, setUnitPrice] = useState<number>(3.0);
  const [mortarPrice, setMortarPrice] = useState<number>(DEFAULT_PRICES.thinset50lbBag);
  const [groutPrice, setGroutPrice] = useState<number>(DEFAULT_PRICES.grout25lbBag);
  const [toolsAllowance, setToolsAllowance] = useState<number>(DEFAULT_PRICES.toolsAllowance);
  const [includeMaterials, setIncludeMaterials] = useState<boolean>(true);

  // Copy status
  const [copied, setCopied] = useState<boolean>(false);

  // Project Type change handler
  const handleProjectTypeChange = (type: ProjectType) => {
    setProjectType(type);
    setMode('areas');

    if (type === 'floor') {
      setAreas([{ id: '1', name: 'Main Floor', lengthFeet: 12, widthFeet: 10, type: 'add' }]);
      setTilePresetId('tile12x12');
      setTilesPerBox(10);
      setPatternId('grid');
      setWastePercent(10);
    } else if (type === 'shower') {
      setAreas([
        { id: '1', name: 'Left Wall', lengthFeet: 3, widthFeet: 8, type: 'add' },
        { id: '2', name: 'Right Wall', lengthFeet: 3, widthFeet: 8, type: 'add' },
        { id: '3', name: 'Back Wall', lengthFeet: 5, widthFeet: 8, type: 'add' },
        { id: '4', name: 'Niche', lengthFeet: 1, widthFeet: 2, type: 'subtract' },
      ]);
      setTilePresetId('tile12x24');
      setTilesPerBox(8);
      setPatternId('running-bond');
      setWastePercent(12);
    } else if (type === 'backsplash') {
      setAreas([{ id: '1', name: 'Backsplash Run', lengthFeet: 14, widthFeet: 1.5, type: 'add' }]);
      setTilePresetId('subway3x6');
      setTilesPerBox(100);
      setPatternId('running-bond');
      setWastePercent(12);
    }
  };

  // Preset change handler
  const handlePresetChange = (presetId: string) => {
    setTilePresetId(presetId);
    const p = TILE_PRESETS[presetId];
    if (p && presetId !== 'custom') {
      setTilesPerBox(p.defaultTilesPerBox);
      const faceSqFt = (p.lengthInches * p.widthInches) / 144;
      setSqFtPerBox(parseFloat((p.defaultTilesPerBox * faceSqFt).toFixed(2)));
    }
  };

  // Pattern change handler
  const handlePatternChange = (patId: string) => {
    setPatternId(patId);
    const p = PATTERN_PRESETS.find((x) => x.id === patId);
    if (p && patId !== 'custom') {
      setWastePercent(p.wastePercent);
    }
  };

  // Area list management (Max 10)
  const handleAddArea = (type: 'add' | 'subtract') => {
    if (areas.length >= 10) return;
    const newId = String(Date.now() + Math.random());
    const isWall = projectType === 'shower' || projectType === 'backsplash';
    const defaultName =
      type === 'subtract'
        ? isWall
          ? 'Niche / Window'
          : 'Cabinet / Island'
        : isWall
          ? `Wall Section ${areas.length + 1}`
          : `Area ${areas.length + 1}`;

    setAreas([
      ...areas,
      {
        id: newId,
        name: defaultName,
        lengthFeet: type === 'subtract' ? 2 : 10,
        widthFeet: type === 'subtract' ? 2 : 10,
        type,
      },
    ]);
  };

  const handleUpdateArea = (id: string, field: keyof TileAreaItem, val: string | number) => {
    setAreas(
      areas.map((a) => {
        if (a.id === id) {
          return { ...a, [field]: val };
        }
        return a;
      })
    );
  };

  const handleRemoveArea = (id: string) => {
    if (areas.length <= 1) return;
    setAreas(areas.filter((a) => a.id !== id));
  };

  // Run calculation engine
  const result = calculateTiles({
    mode,
    directAreaSqFt: directArea,
    areas,
    tilePresetId,
    customLengthInches: customLength,
    customWidthInches: customWidth,
    customThicknessInches: customThickness,
    groutJointInches: groutJoint,
    patternId,
    wastePercentage: wastePercent,
    boxMode,
    tilesPerBox,
    sqFtPerBox,
    pricingUnit,
    tileUnitPrice: unitPrice,
    thinsetPricePerBag: mortarPrice,
    groutPricePerBag: groutPrice,
    toolsAllowance,
    includeInstallationMaterials: includeMaterials,
  });

  // Reset to default
  const handleReset = () => {
    setMode('areas');
    setProjectType('floor');
    setDirectArea(120);
    setAreas([{ id: '1', name: 'Main Floor', lengthFeet: 12, widthFeet: 10, type: 'add' }]);
    setTilePresetId('tile12x12');
    setCustomLength(12);
    setCustomWidth(12);
    setCustomThickness(0.375);
    setGroutJoint(0.125);
    setPatternId('grid');
    setWastePercent(10);
    setBoxMode('tilesPerBox');
    setTilesPerBox(10);
    setSqFtPerBox(10);
    setPricingUnit('sqft');
    setUnitPrice(3.0);
    setMortarPrice(DEFAULT_PRICES.thinset50lbBag);
    setGroutPrice(DEFAULT_PRICES.grout25lbBag);
    setToolsAllowance(DEFAULT_PRICES.toolsAllowance);
    setIncludeMaterials(true);
  };

  // Copy Calculation Summary
  const handleCopySummary = () => {
    const tileName =
      tilePresetId === 'custom'
        ? `Custom (${customLength}" × ${customWidth}", 3/8" thick)`
        : TILE_PRESETS[tilePresetId]?.name || 'Standard Tile';

    const lines: string[] = [
      '=== Tile Calculation Summary (kkctools.com) ===',
      `Project Type: ${projectType.toUpperCase()}`,
      `Calculation Mode: ${mode === 'areas' ? 'Multi-Area Takeoff' : 'Direct Square Footage'}`,
    ];

    if (mode === 'areas') {
      lines.push('Measured Sections:');
      for (const a of areas) {
        lines.push(
          `  - [${a.type === 'subtract' ? 'SUBTRACT' : 'ADD'}] ${a.name}: ${a.lengthFeet} ft × ${a.widthFeet} ft = ${(a.lengthFeet * a.widthFeet).toFixed(1)} sq ft`
        );
      }
    }

    lines.push(`Net Surface Area: ${result.netAreaSqFt} sq ft`);
    lines.push(`Gross Area (+${wastePercent}% waste): ${result.grossAreaSqFt} sq ft`);
    lines.push(`Selected Tile: ${tileName}`);
    lines.push(`Face Area per Tile: ${result.singleTileAreaSqFt} sq ft (${result.tilesPerSqFt} tiles/sq ft)`);
    lines.push(`Grout Joint Width: ${result.groutJointInches}"`);
    lines.push('');
    lines.push('--- QUANTITY REQUIREMENTS ---');
    lines.push(
      `Total Tiles Needed: ${result.totalTilesNeeded} tiles (Base: ${result.baseTilesNeeded} + Waste: ${result.wasteTiles})`
    );
    lines.push(
      `Retail Boxes to Order: ${result.boxesNeeded} boxes (${result.totalTilesInBoxes} tiles total, ${result.surplusTiles} surplus pieces)`
    );
    lines.push(
      `Thin-set Mortar (50 lb bags): ${result.thinsetBags50lb} bag(s) (Coverage: ${result.mortarCoverageSqFtPerBag} sq ft/bag with ${result.mortarTrowelSize})`
    );
    lines.push(
      `Grout (25 lb bags): ${result.groutBags25lb} bag(s) (Estimated weight: ${result.groutWeightLb} lb sanded)`
    );
    lines.push('');
    lines.push('--- COST & SAVINGS ESTIMATE ---');
    lines.push(`Tile Material: $${result.tileMaterialCost.toFixed(2)}`);
    if (includeMaterials) {
      lines.push(`Thin-set Mortar: $${result.mortarCost.toFixed(2)}`);
      lines.push(`Grout: $${result.groutCost.toFixed(2)}`);
      lines.push(`Tools & Supplies Allowance: $${result.toolsCost.toFixed(2)}`);
    }
    lines.push(`Total Estimated DIY Cost: $${result.totalDiyCost.toFixed(2)}`);
    lines.push(`Professional Labor Benchmark: $${result.proLaborLow} – $${result.proLaborHigh}`);
    lines.push(`Professional All-In Cost: $${result.proAllInLow} – $${result.proAllInHigh}`);
    lines.push(`Estimated DIY Savings: $${result.diySavingsLow} – $${result.diySavingsHigh}`);
    lines.push('');
    lines.push('* Estimates only based on typical US ranges. Always get 2–3 written local contractor quotes.');

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isWallProject = projectType === 'shower' || projectType === 'backsplash';

  return (
    <div className={styles.calculatorContainer} id="tile-calc-app">
      <div className={styles.layoutGrid}>
        {/* Left: Inputs Panel */}
        <div className={styles.inputsPanel}>
          {/* Project Type Pills */}
          <div className={styles.projectPillsRow}>
            <button
              type="button"
              className={`${styles.projectPill} ${projectType === 'floor' ? styles.projectPillActive : ''}`}
              onClick={() => handleProjectTypeChange('floor')}
            >
              Floor
            </button>
            <button
              type="button"
              className={`${styles.projectPill} ${projectType === 'shower' ? styles.projectPillActive : ''}`}
              onClick={() => handleProjectTypeChange('shower')}
            >
              Shower Walls
            </button>
            <button
              type="button"
              className={`${styles.projectPill} ${projectType === 'backsplash' ? styles.projectPillActive : ''}`}
              onClick={() => handleProjectTypeChange('backsplash')}
            >
              Backsplash
            </button>
          </div>

          {/* Mode Switcher */}
          <div className={styles.modeSwitcherRow}>
            <button
              type="button"
              className={`${styles.modeButton} ${mode === 'areas' ? styles.modeButtonActive : ''}`}
              onClick={() => setMode('areas')}
            >
              {isWallProject ? 'Wall Sections & Deductions' : 'Room Areas & Deductions'}
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${mode === 'direct' ? styles.modeButtonActive : ''}`}
              onClick={() => setMode('direct')}
            >
              Direct Sq Ft
            </button>
          </div>

          {/* Section 1: Surface Area Inputs */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>1. Project Surface Dimensions</h2>
              <p className={styles.cardSubText}>
                {mode === 'areas'
                  ? 'Add your surfaces and deduct windows, doors, niches, or vanity mirrors.'
                  : 'Enter your pre-measured net surface area directly.'}
              </p>
            </div>

            {mode === 'direct' ? (
              <div className={styles.inputGroup}>
                <label htmlFor={directAreaInputId} className={styles.inputLabel}>
                  Total Net Surface Area (sq ft)
                </label>
                <input
                  id={directAreaInputId}
                  type="number"
                  min="0"
                  max="10000"
                  step="0.5"
                  value={directArea === 0 ? '' : directArea}
                  onChange={(e) => setDirectArea(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.inputField}
                  placeholder="e.g. 120"
                />
              </div>
            ) : (
              <div className={styles.areasList}>
                {areas.map((area) => (
                  <div key={area.id} className={styles.areaRow}>
                    <div className={styles.areaRowHeader}>
                      <span className={area.type === 'subtract' ? styles.areaBadgeSub : styles.areaBadgeAdd}>
                        {area.type === 'subtract' ? '− Deduct Opening' : '+ Surface Area'}
                      </span>
                      {areas.length > 1 && (
                        <button
                          type="button"
                          className={styles.areaDeleteBtn}
                          onClick={() => handleRemoveArea(area.id)}
                          aria-label={`Remove ${area.name}`}
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                    <div className={styles.areaInputsGrid}>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Section Label</label>
                        <input aria-label="Section Label"
                          type="text"
                          value={area.name}
                          onChange={(e) => handleUpdateArea(area.id, 'name', e.target.value)}
                          className={styles.inputField}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>
                          {isWallProject ? 'Width (ft)' : 'Length (ft)'}
                        </label>
                        <input
                          aria-label={isWallProject ? 'Width (ft)' : 'Length (ft)'}
                          type="number"
                          min="0"
                          max="500"
                          step="0.25"
                          value={area.lengthFeet === 0 ? '' : area.lengthFeet}
                          onChange={(e) =>
                            handleUpdateArea(area.id, 'lengthFeet', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className={styles.inputField}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>
                          {isWallProject ? 'Height (ft)' : 'Width (ft)'}
                        </label>
                        <input
                          aria-label={isWallProject ? 'Height (ft)' : 'Width (ft)'}
                          type="number"
                          min="0"
                          max="500"
                          step="0.25"
                          value={area.widthFeet === 0 ? '' : area.widthFeet}
                          onChange={(e) =>
                            handleUpdateArea(area.id, 'widthFeet', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className={styles.inputField}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {areas.length < 10 && (
                  <div className={styles.areaActionsRow}>
                    <button
                      type="button"
                      className={styles.btnAddArea}
                      onClick={() => handleAddArea('add')}
                    >
                      + Add Surface Area
                    </button>
                    <button
                      type="button"
                      className={styles.btnSubArea}
                      onClick={() => handleAddArea('subtract')}
                    >
                      − Subtract Opening (Niche, Window, Vanity)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Tile Size & Grout */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>2. Tile Dimensions &amp; Grout Joint</h2>
              <p className={styles.cardSubText}>
                Select a standard US tile preset or enter custom tile dimensions.
              </p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={presetSelectId} className={styles.inputLabel}>
                Tile Size Preset
              </label>
              <select
                id={presetSelectId}
                value={tilePresetId}
                onChange={(e) => handlePresetChange(e.target.value)}
                className={styles.selectField}
              >
                {Object.values(TILE_PRESETS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {tilePresetId === 'custom' && (
              <div className={styles.areaInputsGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor={customLengthId} className={styles.inputLabel}>
                    Tile Length (inches)
                  </label>
                  <input
                    id={customLengthId}
                    type="number"
                    min="0.5"
                    max="72"
                    step="0.125"
                    value={customLength}
                    onChange={(e) => setCustomLength(Math.max(0.5, parseFloat(e.target.value) || 12))}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor={customWidthId} className={styles.inputLabel}>
                    Tile Width (inches)
                  </label>
                  <input
                    id={customWidthId}
                    type="number"
                    min="0.5"
                    max="72"
                    step="0.125"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(0.5, parseFloat(e.target.value) || 12))}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor={customThicknessId} className={styles.inputLabel}>
                    Thickness (inches)
                  </label>
                  <input
                    id={customThicknessId}
                    type="number"
                    min="0.0625"
                    max="2"
                    step="0.0625"
                    value={customThickness}
                    onChange={(e) => setCustomThickness(Math.max(0.0625, parseFloat(e.target.value) || 0.375))}
                    className={styles.inputField}
                  />
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor={groutJointId} className={styles.inputLabel}>
                Grout Joint Width
              </label>
              <select
                id={groutJointId}
                value={groutJoint}
                onChange={(e) => setGroutJoint(parseFloat(e.target.value))}
                className={styles.selectField}
              >
                {GROUT_JOINT_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {Math.max(result.tileLengthInches, result.tileWidthInches) > 15 && (
              <div className={styles.hintBanner}>
                Large-format tiles (&gt; 15&quot;) need a bigger trowel (1/2&quot; × 1/2&quot;) and back-buttering
                to prevent hollow spots and cracking.
              </div>
            )}
          </div>

          {/* Section 3: Pattern & Waste Factor */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>3. Layout Pattern &amp; Waste Factor</h2>
              <p className={styles.cardSubText}>
                Angled and offset patterns require extra cuts along perimeters and corners.
              </p>
            </div>

            <div className={styles.pillsList}>
              {PATTERN_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.pillBtn} ${patternId === p.id ? styles.pillBtnActive : ''}`}
                  onClick={() => handlePatternChange(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {patternId === 'custom' && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Custom Waste Factor (0% to 25%)</label>
                <input aria-label="Custom Waste Factor (0% to 25%)"
                  type="number"
                  min="0"
                  max="25"
                  value={wastePercent}
                  onChange={(e) =>
                    setWastePercent(Math.min(25, Math.max(0, parseFloat(e.target.value) || 0)))
                  }
                  className={styles.inputField}
                />
              </div>
            )}
          </div>

          {/* Section 4: Packaging & Retail Box Yield */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>4. Retail Packaging &amp; Box Mode</h2>
              <p className={styles.cardSubText}>
                Stores sell tile in whole boxes. Enter pieces per box or sq ft per box from the label.
              </p>
            </div>

            <div className={styles.modeSwitcherRow}>
              <button
                type="button"
                className={`${styles.modeButton} ${boxMode === 'tilesPerBox' ? styles.modeButtonActive : ''}`}
                onClick={() => setBoxMode('tilesPerBox')}
              >
                Tiles per Box
              </button>
              <button
                type="button"
                className={`${styles.modeButton} ${boxMode === 'sqFtPerBox' ? styles.modeButtonActive : ''}`}
                onClick={() => {
                  setBoxMode('sqFtPerBox');
                  if (pricingUnit === 'tile') {
                    setPricingUnit('sqft');
                  }
                }}
              >
                Sq Ft per Box
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={boxUnitsId} className={styles.inputLabel}>
                {boxMode === 'tilesPerBox' ? 'Tiles per Box (pieces)' : 'Coverage per Box (sq ft)'}
              </label>
              <input
                id={boxUnitsId}
                type="number"
                min="1"
                step="0.1"
                value={boxMode === 'tilesPerBox' ? tilesPerBox : sqFtPerBox}
                onChange={(e) => {
                  const val = Math.max(0.1, parseFloat(e.target.value) || 1);
                  if (boxMode === 'tilesPerBox') {
                    setTilesPerBox(Math.round(val));
                  } else {
                    setSqFtPerBox(val);
                  }
                }}
                className={styles.inputField}
              />
            </div>
          </div>

          {/* Section 5: Materials & Cost Calculator */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>5. Project Pricing &amp; Benchmarking</h2>
              <p className={styles.cardSubText}>
                Compare estimated DIY material costs against professional contractor installation.
              </p>
            </div>

            <div className={styles.pillsList}>
              {TILE_MATERIAL_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={styles.pillBtn}
                  onClick={() => {
                    setPricingUnit('sqft');
                    setUnitPrice(m.defaultPricePerSqFt);
                  }}
                >
                  {m.name}
                </button>
              ))}
            </div>

            <div className={styles.areaInputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={priceUnitId} className={styles.inputLabel}>
                  Pricing Unit
                </label>
                <select
                  id={priceUnitId}
                  value={pricingUnit}
                  onChange={(e) => setPricingUnit(e.target.value as PricingUnit)}
                  className={styles.selectField}
                >
                  <option value="sqft">Per Sq Ft ($)</option>
                  <option value="box">Per Box ($)</option>
                  {boxMode === 'tilesPerBox' && <option value="tile">Per Tile ($)</option>}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={unitPriceId} className={styles.inputLabel}>
                  Tile Unit Price ($)
                </label>
                <input
                  id={unitPriceId}
                  type="number"
                  min="0"
                  step="0.25"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={mortarPriceId} className={styles.inputLabel}>
                  Mortar (50 lb bag)
                </label>
                <input
                  id={mortarPriceId}
                  type="number"
                  min="0"
                  step="1"
                  value={mortarPrice}
                  onChange={(e) => setMortarPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div className={styles.areaInputsGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor={groutPriceId} className={styles.inputLabel}>
                  Grout (25 lb bag)
                </label>
                <input
                  id={groutPriceId}
                  type="number"
                  min="0"
                  step="1"
                  value={groutPrice}
                  onChange={(e) => setGroutPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={toolsPriceId} className={styles.inputLabel}>
                  Tools Allowance ($)
                </label>
                <input
                  id={toolsPriceId}
                  type="number"
                  min="0"
                  step="5"
                  value={toolsAllowance}
                  onChange={(e) => setToolsAllowance(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup} style={{ justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={includeMaterials}
                    onChange={(e) => setIncludeMaterials(e.target.checked)}
                  />
                  <span>Include mortar, grout &amp; tools</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className={styles.resultsPanel} aria-live="polite">
          {/* Hero Result */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>Total Tiles Needed</div>
            <div className={styles.heroValue}>{result.totalTilesNeeded}</div>
            <div className={styles.heroSub}>
              {result.baseTilesNeeded} base tiles + {result.wasteTiles} waste tiles ({wastePercent}%{' '}
              {patternId})
            </div>
          </div>

          {/* Breakdown Card */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Quantity &amp; Packaging Breakdown</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Net Surface Area</span>
              <span className={styles.breakdownVal}>{result.netAreaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Gross Area (+{wastePercent}% waste)</span>
              <span className={styles.breakdownVal}>{result.grossAreaSqFt} sq ft</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Single Tile Face Area</span>
              <span className={styles.breakdownVal}>
                {result.singleTileAreaSqFt} sq ft ({result.singleTileAreaSqInches} sq in)
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Retail Boxes to Buy</span>
              <span className={styles.breakdownVal}>
                {result.boxesNeeded} boxes ({result.totalTilesInBoxes} tiles total)
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Surplus Pieces</span>
              <span className={styles.breakdownVal}>{result.surplusTiles} extra tiles</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Thin-Set Mortar (50 lb bags)</span>
              <span className={styles.breakdownVal}>
                {result.thinsetBags50lb} bag{result.thinsetBags50lb === 1 ? '' : 's'}
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Recommended Trowel</span>
              <span className={styles.breakdownVal} style={{ fontSize: '0.8rem' }}>
                {result.mortarTrowelSize}
              </span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Sanded Grout (25 lb bags)</span>
              <span className={styles.breakdownVal}>
                {result.groutBags25lb} bag{result.groutBags25lb === 1 ? '' : 's'} (~{result.groutWeightLb} lb)
              </span>
            </div>
          </div>

          {/* Cost Card (Always Visible) */}
          <div className={styles.costCard}>
            <div className={styles.costHeader}>
              <span className={styles.costTotalLabel}>Estimated DIY Cost</span>
              <span className={styles.costTotalVal}>${result.totalDiyCost.toFixed(2)}</span>
            </div>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownKey}>Tiles Material</span>
              <span className={styles.breakdownVal}>${result.tileMaterialCost.toFixed(2)}</span>
            </div>

            {includeMaterials && (
              <>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Mortar &amp; Grout</span>
                  <span className={styles.breakdownVal}>
                    ${(result.mortarCost + result.groutCost).toFixed(2)}
                  </span>
                </div>

                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownKey}>Tools &amp; Supplies</span>
                  <span className={styles.breakdownVal}>${result.toolsCost.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className={styles.benchmarkBox}>
              <span className={styles.benchmarkTitle}>Pro Contractor Benchmark</span>
              <div className={styles.benchmarkRange}>
                ${result.proAllInLow.toLocaleString()} – ${result.proAllInHigh.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                Labor only: ${result.proLaborLow.toLocaleString()} – ${result.proLaborHigh.toLocaleString()} ($5–$15/sq ft)
              </div>
              <div className={styles.savingsPill}>
                Save ~${result.diySavingsLow.toLocaleString()} – ${result.diySavingsHigh.toLocaleString()} by DIYing
              </div>
            </div>

            <p className={styles.disclaimerText}>
              Estimate only. Tile, mortar, and regional contractor rates vary. Obtain 2–3 written local quotes.
              Last verified: {LAST_VERIFIED}.
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsCard}>
            <button
              type="button"
              className={styles.btnActionCopy}
              onClick={handleCopySummary}
            >
              {copied ? '✓ Copied to Clipboard!' : 'Copy Calculation Summary'}
            </button>
            <button
              type="button"
              className={styles.btnActionReset}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TileCalculator;
