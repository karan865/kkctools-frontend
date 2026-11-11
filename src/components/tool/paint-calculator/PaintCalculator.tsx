'use client';

import React, { useState, useId, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  RoomPaintInput,
  PaintCalculationInput,
  calculatePaint,
  parseDimension,
} from '@/lib/paint-engine';
import {
  COVERAGE,
  CoverageTextureKey,
  PRICE_PRESETS,
  DEFAULT_PRIMER_PRICE,
  DEFAULT_SUNDRIES,
  MAX_ROOMS,
} from '@/lib/paint-constants';
import styles from './PaintCalculator.module.css';

const STORAGE_KEY = 'kkc_paint_calc_rooms_v2';

export default function PaintCalculator() {
  const [calculationMode, setCalculationMode] = useState<'dimensions' | 'direct'>('dimensions');

  // Rooms state (1-10 rooms)
  const [rooms, setRooms] = useState<RoomPaintInput[]>(() => {
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
    return [
      {
        id: '1',
        name: 'Room 1',
        lengthFeet: 14,
        widthFeet: 12,
        heightFeet: 8,
        doorsCount: 1,
        windowsCount: 2,
        includeCeiling: false,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    } catch {
      // Ignore
    }
  }, [rooms]);

  // Direct area mode state
  const [directGrossWall, setDirectGrossWall] = useState<string>('416');
  const [directCeiling, setDirectCeiling] = useState<string>('168');
  const [directIncludeCeiling, setDirectIncludeCeiling] = useState<boolean>(false);
  const [directDoors, setDirectDoors] = useState<string>('1');
  const [directWindows, setDirectWindows] = useState<string>('2');

  // Paint specifications (Global)
  const [textureKey, setTextureKey] = useState<CoverageTextureKey>('smooth');
  const [customCoverage, setCustomCoverage] = useState<string>('380');
  const [coats, setCoats] = useState<number>(2);
  const [ceilingCoats, setCeilingCoats] = useState<number>(2);

  // Primer (Global)
  const [includePrimer, setIncludePrimer] = useState<boolean>(false);
  const [primerCoverage, setPrimerCoverage] = useState<string>('300');

  // Pricing (Global)
  const [pricePreset, setPricePreset] = useState<'economy' | 'mid' | 'premium' | 'custom'>('mid');
  const [wallPrice, setWallPrice] = useState<string>('45');
  const [ceilingPrice, setCeilingPrice] = useState<string>('45');
  const [primerPrice, setPrimerPrice] = useState<string>('25');
  const [sundriesCost, setSundriesCost] = useState<string>('25');

  const [copied, setCopied] = useState<boolean>(false);
  const idPrefix = useId();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Multi-room handlers
  const handleAddRoom = () => {
    if (rooms.length >= MAX_ROOMS) return;
    const newId = String(Date.now());
    setRooms([
      ...rooms,
      {
        id: newId,
        name: `Room ${rooms.length + 1}`,
        lengthFeet: 12,
        widthFeet: 10,
        heightFeet: 8,
        doorsCount: 1,
        windowsCount: 1,
        includeCeiling: false,
      },
    ]);
  };

  const handleRemoveRoom = (id: string) => {
    if (rooms.length <= 1) return;
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const handleUpdateRoom = (id: string, updates: Partial<RoomPaintInput>) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleApplyPresetChip = (length: number, width: number) => {
    if (rooms.length > 0) {
      handleUpdateRoom(rooms[0].id, { lengthFeet: length, widthFeet: width });
    }
  };

  const handlePricePresetSelect = (preset: 'economy' | 'mid' | 'premium' | 'custom') => {
    setPricePreset(preset);
    if (preset !== 'custom') {
      const p = String(PRICE_PRESETS[preset]);
      setWallPrice(p);
      setCeilingPrice(p);
    }
  };

  const handleReset = () => {
    setCalculationMode('dimensions');
    setRooms([
      {
        id: '1',
        name: 'Room 1',
        lengthFeet: 14,
        widthFeet: 12,
        heightFeet: 8,
        doorsCount: 1,
        windowsCount: 2,
        includeCeiling: false,
      },
    ]);
    setDirectGrossWall('416');
    setDirectCeiling('168');
    setDirectIncludeCeiling(false);
    setDirectDoors('1');
    setDirectWindows('2');
    setTextureKey('smooth');
    setCustomCoverage('380');
    setCoats(2);
    setCeilingCoats(2);
    setIncludePrimer(false);
    setPrimerCoverage('300');
    setPricePreset('mid');
    setWallPrice('45');
    setCeilingPrice('45');
    setPrimerPrice('25');
    setSundriesCost('25');
    setCopied(false);
  };

  // Switch to smooth on conflict
  const handleSwitchToSmooth = () => {
    setTextureKey('smooth');
  };

  // Prepare input object
  const activeRooms: RoomPaintInput[] =
    calculationMode === 'direct'
      ? [
          {
            id: 'direct-room',
            name: 'Direct Wall Area',
            lengthFeet: 0,
            widthFeet: 0,
            heightFeet: 0,
            doorsCount: parseDimension(directDoors),
            windowsCount: parseDimension(directWindows),
            includeCeiling: directIncludeCeiling,
            isDirectArea: true,
            directGrossWallSqFt: parseDimension(directGrossWall),
            directCeilingSqFt: parseDimension(directCeiling),
          },
        ]
      : rooms;

  const calculationInput: PaintCalculationInput = {
    rooms: activeRooms,
    textureKey,
    customCoverageSqFt: parseDimension(customCoverage),
    coats,
    ceilingCoats,
    includePrimer,
    primerCoverageSqFt: parseDimension(primerCoverage),
    wallPricePerGallon: parseDimension(wallPrice),
    ceilingPricePerGallon: parseDimension(ceilingPrice),
    primerPricePerGallon: parseDimension(primerPrice),
    sundriesCost: parseDimension(sundriesCost),
  };

  const result = calculatePaint(calculationInput);

  const handleCopy = () => {
    let roomDetails = '';
    result.roomBreakdowns.forEach((r, idx) => {
      roomDetails += `  Room ${idx + 1} (${r.name}): Net Wall = ${r.netWallAreaSqFt} sq ft${r.ceilingAreaSqFt > 0 ? `, Ceiling = ${r.ceilingAreaSqFt} sq ft` : ''}\n`;
    });

    const summary = `Paint Cost & Coverage Takeoff Summary:
• Total Net Wall Area: ${result.totalNetWallSqFt.toLocaleString()} sq ft
${result.totalCeilingSqFt > 0 ? `• Total Ceiling Area: ${result.totalCeilingSqFt.toLocaleString()} sq ft\n` : ''}• Wall Paint to Buy: ${result.wallContainers.displayLabel} (${result.wallExactGallons} gal exact for ${coats} coats @ ${result.effectiveCoverage} sq ft/gal)
${result.totalCeilingSqFt > 0 ? `• Ceiling Paint to Buy: ${result.ceilingContainers.displayLabel} (${result.ceilingExactGallons} gal exact)\n` : ''}${result.primerGallonsToBuy > 0 ? `• Primer to Buy: ${result.primerGallonsToBuy} Gallons (1 coat @ ${parseDimension(primerCoverage)} sq ft/gal)\n` : ''}
Room Breakdown:
${roomDetails}
DIY Material Budget:
• Wall Paint: $${result.wallPaintCost.toLocaleString()}
${result.ceilingPaintCost > 0 ? `• Ceiling Paint: $${result.ceilingPaintCost.toLocaleString()}\n` : ''}${result.primerCost > 0 ? `• Primer: $${result.primerCost.toLocaleString()}\n` : ''}• Supplies & Sundries: $${result.sundriesCost.toLocaleString()}
• Total DIY Cost: $${result.totalDIYCost.toLocaleString()}

Professional Contractor Benchmark:
• Typical Pro Labor & Materials: $${result.proEstimateLow.toLocaleString()} – $${result.proEstimateHigh.toLocaleString()} (Estimate only. Get 2–3 local quotes.)
• Estimated DIY Savings: $${result.proSavingsLow.toLocaleString()} – $${result.proSavingsHigh.toLocaleString()}

Calculated with KKCTools Paint Cost Calculator (https://kkctools.com/paint-cost-calculator/)`;

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
          {/* Mode Switcher */}
          <div className={styles.modeSwitcherRow}>
            <button
              type="button"
              className={`${styles.modeButton} ${calculationMode === 'dimensions' ? styles.modeButtonActive : ''}`}
              onClick={() => setCalculationMode('dimensions')}
            >
              Room Dimensions (L × W × H)
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${calculationMode === 'direct' ? styles.modeButtonActive : ''}`}
              onClick={() => setCalculationMode('direct')}
            >
              Direct Wall Area (Sq Ft)
            </button>
          </div>

          {/* Section 1: Dimensions or Direct Area */}
          {calculationMode === 'dimensions' ? (
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>1. Room Dimensions &amp; Deductions</h2>
                <span className={styles.cardSubText}>Add 1 to 10 rooms with individual ceiling toggles</span>
              </div>

              {/* Room Size Presets */}
              <div className={styles.presetChipsWrapper}>
                <span className={styles.presetChipLabel}>Quick Room Presets:</span>
                <div className={styles.presetChipList}>
                  {[
                    { label: '10×10', l: 10, w: 10 },
                    { label: '12×12', l: 12, w: 12 },
                    { label: '12×14', l: 14, w: 12 },
                    { label: '14×16', l: 16, w: 14 },
                    { label: '16×20', l: 20, w: 16 },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      className={styles.presetChip}
                      onClick={() => handleApplyPresetChip(chip.l, chip.w)}
                      title={`Fill first room with ${chip.label} ft`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-room list */}
              <div className={styles.roomsList}>
                {rooms.map((room, idx) => (
                  <div key={room.id} className={styles.roomItem}>
                    <div className={styles.roomItemHeader}>
                      <input
                        type="text"
                        className={styles.roomNameInput}
                        value={room.name}
                        onChange={(e) => handleUpdateRoom(room.id, { name: e.target.value })}
                        aria-label="Room Name"
                      />
                      {rooms.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeSmallButton}
                          onClick={() => handleRemoveRoom(room.id)}
                          aria-label={`Remove ${room.name}`}
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>

                    <div className={styles.inputRow3}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Length (ft)</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={room.lengthFeet || ''}
                          onChange={(e) =>
                            handleUpdateRoom(room.id, { lengthFeet: parseDimension(e.target.value) })
                          }
                          placeholder="e.g. 14"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Width (ft)</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={room.widthFeet || ''}
                          onChange={(e) =>
                            handleUpdateRoom(room.id, { widthFeet: parseDimension(e.target.value) })
                          }
                          placeholder="e.g. 12"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Ceiling Ht (ft)</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={room.heightFeet || ''}
                          onChange={(e) =>
                            handleUpdateRoom(room.id, { heightFeet: parseDimension(e.target.value) })
                          }
                          placeholder="e.g. 8"
                        />
                      </div>
                    </div>

                    <div className={styles.inputRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Doors (21 sq ft)</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={room.doorsCount}
                          onChange={(e) =>
                            handleUpdateRoom(room.id, { doorsCount: parseDimension(e.target.value) })
                          }
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Windows (15 sq ft)</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={room.windowsCount}
                          onChange={(e) =>
                            handleUpdateRoom(room.id, { windowsCount: parseDimension(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={room.includeCeiling}
                          onChange={(e) =>
                            handleUpdateRoom(room.id, { includeCeiling: e.target.checked })
                          }
                        />
                        <span>Include ceiling ({room.lengthFeet * room.widthFeet || 0} sq ft)</span>
                      </label>
                    </div>
                  </div>
                ))}

                {rooms.length < MAX_ROOMS && (
                  <button type="button" className={styles.addRoomButton} onClick={handleAddRoom}>
                    + Add Another Room ({rooms.length}/{MAX_ROOMS})
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Direct Area Mode */
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>1. Direct Wall &amp; Ceiling Area</h2>
                <span className={styles.cardSubText}>Enter known surface square footage directly</span>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-direct-wall`} className={styles.label}>
                  Gross Wall Area (sq ft)
                </label>
                <input
                  id={`${idPrefix}-direct-wall`}
                  type="text"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={directGrossWall}
                  onChange={(e) => setDirectGrossWall(e.target.value)}
                  placeholder="e.g. 416"
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${idPrefix}-direct-doors`} className={styles.label}>
                    Doors (21 sq ft ea)
                  </label>
                  <input
                    id={`${idPrefix}-direct-doors`}
                    type="text"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={directDoors}
                    onChange={(e) => setDirectDoors(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${idPrefix}-direct-win`} className={styles.label}>
                    Windows (15 sq ft ea)
                  </label>
                  <input
                    id={`${idPrefix}-direct-win`}
                    type="text"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={directWindows}
                    onChange={(e) => setDirectWindows(e.target.value)}
                    placeholder="2"
                  />
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={directIncludeCeiling}
                    onChange={(e) => setDirectIncludeCeiling(e.target.checked)}
                  />
                  <span>Add ceiling area to paint</span>
                </label>
              </div>

              {directIncludeCeiling && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${idPrefix}-direct-ceiling`} className={styles.label}>
                    Ceiling Area (sq ft)
                  </label>
                  <input
                    id={`${idPrefix}-direct-ceiling`}
                    type="text"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={directCeiling}
                    onChange={(e) => setDirectCeiling(e.target.value)}
                    placeholder="e.g. 168"
                  />
                </div>
              )}
            </div>
          )}

          {/* Section 2: Texture, Coats & Primer */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>2. Paint Surface &amp; Coats</h2>
              <span className={styles.cardSubText}>Wall texture, coat count, and primer option</span>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`${idPrefix}-texture`} className={styles.label}>
                Wall Surface Texture (Coverage Rate)
              </label>
              <select
                id={`${idPrefix}-texture`}
                className={styles.selectField}
                value={textureKey}
                onChange={(e) => setTextureKey(e.target.value as CoverageTextureKey)}
              >
                <option value="smooth">Smooth Drywall — 380 sq ft / gal (Standard)</option>
                <option value="orangePeel">Orange Peel / Light Texture — 350 sq ft / gal</option>
                <option value="heavyTexture">Heavy Texture / Knockdown — 300 sq ft / gal</option>
                <option value="unprimed">Unprimed Fresh Drywall — 250 sq ft / gal</option>
                <option value="masonry">Rough Masonry / Brick — 225 sq ft / gal</option>
                <option value="custom">Custom Coverage Rate</option>
              </select>
            </div>

            {textureKey === 'custom' && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Custom Coverage Rate (sq ft / gallon)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={customCoverage}
                  onChange={(e) => setCustomCoverage(e.target.value)}
                  placeholder="380"
                />
              </div>
            )}

            {/* E11 Unprimed + Primer Conflict Hint */}
            {result.unprimedPrimerConflict && (
              <div className={styles.conflictBox}>
                <span>
                  💡 You&apos;re priming first, so paint goes on a primed surface. Use the Smooth rate for your paint coats.
                </span>
                <button
                  type="button"
                  className={styles.conflictActionButton}
                  onClick={handleSwitchToSmooth}
                >
                  Switch to Smooth (380)
                </button>
              </div>
            )}

            <div className={styles.inputRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-coats`} className={styles.label}>
                  Wall Paint Coats
                </label>
                <select
                  id={`${idPrefix}-coats`}
                  className={styles.selectField}
                  value={coats}
                  onChange={(e) => setCoats(Number(e.target.value))}
                >
                  <option value={1}>1 Coat (Touch-up / Same Color)</option>
                  <option value={2}>2 Coats (Standard Recommended)</option>
                  <option value={3}>3 Coats (Dramatic Color Change)</option>
                </select>
              </div>

              {result.totalCeilingSqFt > 0 && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${idPrefix}-ceil-coats`} className={styles.label}>
                    Ceiling Coats
                  </label>
                  <select
                    id={`${idPrefix}-ceil-coats`}
                    className={styles.selectField}
                    value={ceilingCoats}
                    onChange={(e) => setCeilingCoats(Number(e.target.value))}
                  >
                    <option value={1}>1 Coat</option>
                    <option value={2}>2 Coats (Standard)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Separate Primer */}
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={includePrimer}
                  onChange={(e) => setIncludePrimer(e.target.checked)}
                />
                <span>Include separate primer coat (bare drywall, stains, or drastic color shifts)</span>
              </label>
            </div>

            {includePrimer && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Primer Coverage (sq ft / gal)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={primerCoverage}
                  onChange={(e) => setPrimerCoverage(e.target.value)}
                  placeholder="300"
                />
                <span className={styles.fieldHelper}>Default: 300 sq ft/gal for standard stain-blocking latex primer</span>
              </div>
            )}
          </div>

          {/* Section 3: Material Pricing */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>3. Paint Pricing &amp; Supplies</h2>
              <span className={styles.cardSubText}>Gallon and quart budget estimates</span>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Paint Grade Presets</label>
              <div className={styles.chipGroup}>
                <button
                  type="button"
                  className={`${styles.chip} ${pricePreset === 'economy' ? styles.chipSelected : ''}`}
                  onClick={() => handlePricePresetSelect('economy')}
                >
                  Economy ($30/gal)
                </button>
                <button
                  type="button"
                  className={`${styles.chip} ${pricePreset === 'mid' ? styles.chipSelected : ''}`}
                  onClick={() => handlePricePresetSelect('mid')}
                >
                  Mid-Grade ($45/gal)
                </button>
                <button
                  type="button"
                  className={`${styles.chip} ${pricePreset === 'premium' ? styles.chipSelected : ''}`}
                  onClick={() => handlePricePresetSelect('premium')}
                >
                  Premium ($65/gal)
                </button>
                <button
                  type="button"
                  className={`${styles.chip} ${pricePreset === 'custom' ? styles.chipSelected : ''}`}
                  onClick={() => setPricePreset('custom')}
                >
                  Custom
                </button>
              </div>
              <span className={styles.fieldHelper}>Quart price is estimated at 40% of the gallon price.</span>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-wall-price`} className={styles.label}>
                  Wall Paint ($ / gal)
                </label>
                <input
                  id={`${idPrefix}-wall-price`}
                  type="text"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={wallPrice}
                  onChange={(e) => {
                    setWallPrice(e.target.value);
                    setPricePreset('custom');
                  }}
                  placeholder="45"
                />
              </div>

              {result.totalCeilingSqFt > 0 && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${idPrefix}-ceil-price`} className={styles.label}>
                    Ceiling Paint ($ / gal)
                  </label>
                  <input
                    id={`${idPrefix}-ceil-price`}
                    type="text"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={ceilingPrice}
                    onChange={(e) => setCeilingPrice(e.target.value)}
                    placeholder="45"
                  />
                </div>
              )}
            </div>

            <div className={styles.inputRow}>
              {includePrimer && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${idPrefix}-primer-price`} className={styles.label}>
                    Primer ($ / gal)
                  </label>
                  <input
                    id={`${idPrefix}-primer-price`}
                    type="text"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={primerPrice}
                    onChange={(e) => setPrimerPrice(e.target.value)}
                    placeholder="25"
                  />
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label htmlFor={`${idPrefix}-sundries`} className={styles.label}>
                  Sundries ($) — Tape, Rollers, Trays
                </label>
                <input
                  id={`${idPrefix}-sundries`}
                  type="text"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={sundriesCost}
                  onChange={(e) => setSundriesCost(e.target.value)}
                  placeholder="25"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtonGroup}>
            <button type="button" className={styles.secondaryActionButton} onClick={handleReset}>
              Reset Fields
            </button>
          </div>
        </div>

        {/* Right Results Panel */}
        <div className={styles.resultsPanel} ref={resultsRef} aria-live="polite">
          {/* Primary Wall Paint Hero Card */}
          <div className={styles.primaryResultCard}>
            <div className={styles.primaryResultLabel}>Wall Paint to Buy</div>
            <div className={styles.primaryResultValue}>
              {result.wallContainers.displayLabel}
            </div>
            <div className={styles.primaryResultSub}>
              Exact requirement: <strong>{result.wallExactGallons} gallons</strong> for {coats} coats @ {result.effectiveCoverage} sq ft/gal
            </div>
            {result.wallContainers.suggestFiveGallonBucket && (
              <div className={styles.bucketNotice}>
                💡 5+ gallons: A 5-gallon bucket is often cheaper per gallon — compare prices at the store.
              </div>
            )}
          </div>

          {/* Surface & Coverage Breakdown */}
          <div className={styles.breakdownCard}>
            <div className={styles.breakdownTitle}>Surface Area Breakdown</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Net Wall Area</span>
              <span className={styles.breakdownValue}>
                {result.totalNetWallSqFt.toLocaleString()} sq ft{' '}
                <span className={styles.subtextInline}>(Gross: {result.totalGrossWallSqFt} sq ft)</span>
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Doors &amp; Windows Deducted</span>
              <span className={styles.breakdownValue}>−{result.totalOpeningsDeductionSqFt.toLocaleString()} sq ft</span>
            </div>
            {result.totalCeilingSqFt > 0 && (
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Ceiling Area</span>
                <span className={styles.breakdownValue}>{result.totalCeilingSqFt.toLocaleString()} sq ft</span>
              </div>
            )}
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Paintable Surface</span>
              <span className={styles.breakdownValue}>{result.totalPaintableSurfaceSqFt.toLocaleString()} sq ft</span>
            </div>
          </div>

          {/* Additional Paints Breakdown (Ceiling & Primer) */}
          {(result.totalCeilingSqFt > 0 || result.primerGallonsToBuy > 0) && (
            <div className={styles.breakdownCard}>
              <div className={styles.breakdownTitle}>Ceiling &amp; Primer Materials</div>
              {result.totalCeilingSqFt > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Ceiling Paint to Buy</span>
                  <span className={styles.breakdownValue}>
                    {result.ceilingContainers.displayLabel}{' '}
                    <span className={styles.subtextInline}>({result.ceilingExactGallons} gal exact)</span>
                  </span>
                </div>
              )}
              {result.primerGallonsToBuy > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Primer to Buy (1 coat)</span>
                  <span className={styles.breakdownValue}>
                    {result.primerGallonsToBuy} Gallons{' '}
                    <span className={styles.subtextInline}>({result.primerExactGallons} gal exact)</span>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Cost Card (Always Visible on first load) */}
          <div className={styles.breakdownCard}>
            <div className={styles.breakdownTitle}>Estimated Material Budget (DIY)</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Wall Paint</span>
              <span className={styles.breakdownValue}>${result.wallPaintCost.toLocaleString()}</span>
            </div>
            {result.ceilingPaintCost > 0 && (
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Ceiling Paint</span>
                <span className={styles.breakdownValue}>${result.ceilingPaintCost.toLocaleString()}</span>
              </div>
            )}
            {result.primerCost > 0 && (
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Primer</span>
                <span className={styles.breakdownValue}>${result.primerCost.toLocaleString()}</span>
              </div>
            )}
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Supplies &amp; Sundries</span>
              <span className={styles.breakdownValue}>${result.sundriesCost.toLocaleString()}</span>
            </div>
            <div className={styles.breakdownRow} style={{ borderTop: '1px solid var(--color-border, #e5e7eb)', paddingTop: '0.5rem' }}>
              <span className={styles.breakdownLabel} style={{ fontWeight: 700, color: 'var(--color-text, #0f172a)' }}>
                Total Estimated DIY Cost
              </span>
              <span className={styles.breakdownValue} style={{ color: 'var(--color-primary, #0284c7)', fontSize: '1.15rem' }}>
                ${result.totalDIYCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* PRO Contractor Benchmark */}
          <div className={styles.proBenchmarkCard}>
            <div className={styles.proBenchmarkTitle}>Professional Contractor Benchmark</div>
            <div className={styles.proBenchmarkPrice}>
              ${result.proEstimateLow.toLocaleString()} – ${result.proEstimateHigh.toLocaleString()}
            </div>
            <div className={styles.proBenchmarkDesc}>
              Estimated professional turnkey cost ($1.00–$2.50 per sq ft of surface). You save approximately{' '}
              <strong>${result.proSavingsLow.toLocaleString()} – ${result.proSavingsHigh.toLocaleString()}</strong> by painting yourself.
            </div>
            <div className={styles.proBenchmarkFootnote}>
              Estimate only. Get 2–3 local quotes for actual contractor bids.
            </div>
          </div>

          {/* Utility Buttons */}
          <div className={styles.resultsUtilityRow}>
            <button type="button" className={styles.utilityButton} onClick={handleCopy}>
              {copied ? '✓ Copied Summary' : '📋 Copy Calculation Summary'}
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
