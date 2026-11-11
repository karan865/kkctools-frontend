'use client';

import React, { useState, useId, useRef, useEffect } from 'react';
import {
  LengthUnit,
  ShapeType,
  RoomItem,
  calculateSquareFootage,
  parseDimension,
} from '@/lib/square-footage-engine';
import styles from './SquareFootageCalculator.module.css';

type ActiveTab = 'single' | 'multiple' | 'shapes';

type ConverterUnit = 'sqft' | 'sqin' | 'sqyd' | 'sqm' | 'acre';

const CONVERSION_TO_SQFT: Record<ConverterUnit, number> = {
  sqft: 1,
  sqin: 1 / 144,
  sqyd: 9,
  sqm: 10.7639104, // 1 / 0.09290304
  acre: 43560,
};

const UNIT_LABELS: Record<ConverterUnit, string> = {
  sqft: 'Square Feet (sq ft)',
  sqin: 'Square Inches (sq in)',
  sqyd: 'Square Yards (sq yd)',
  sqm: 'Square Meters (m²)',
  acre: 'Acres (ac)',
};

const STORAGE_KEY = 'kkc_sqft_calc_rooms_v1';

export default function SquareFootageCalculator() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('single');
  const [wastePercentage, setWastePercentage] = useState<number>(10);
  const [customWaste, setCustomWaste] = useState<string>('');
  const [costPerSqft, setCostPerSqft] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Single mode state
  const [singleLength, setSingleLength] = useState<string>('20');
  const [singleLengthInches, setSingleLengthInches] = useState<string>('0');
  const [singleWidth, setSingleWidth] = useState<string>('12');
  const [singleWidthInches, setSingleWidthInches] = useState<string>('0');
  const [singleUnit, setSingleUnit] = useState<LengthUnit>('feet');

  // Multi-room state with default items initialized from localStorage if available
  const [rooms, setRooms] = useState<RoomItem[]>(() => {
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
      { id: '1', name: 'Living Room', shape: 'rectangle', length: 18, width: 14, mode: 'add', unit: 'feet' },
      { id: '2', name: 'Master Bedroom', shape: 'rectangle', length: 15, width: 13, mode: 'add', unit: 'feet' },
    ];
  });

  // Save rooms to localStorage when rooms change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    } catch {
      // Ignore
    }
  }, [rooms]);

  const saveRooms = (newRooms: RoomItem[]) => {
    setRooms(newRooms);
  };

  // Shape state (Rectangle, L-Shape, Triangle, Circle, Semi-circle, Trapezoid)
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');
  const [shapeUnit, setShapeUnit] = useState<LengthUnit>('feet');
  const [shapeLength, setShapeLength] = useState<string>('18');
  const [shapeWidth, setShapeWidth] = useState<string>('10');
  const [shapeRadius, setShapeRadius] = useState<string>('7');
  const [shapeBase2, setShapeBase2] = useState<string>('14');
  const [shapeLength2, setShapeLength2] = useState<string>('8');
  const [shapeWidth2, setShapeWidth2] = useState<string>('12');

  // Quick Area Converter Widget state
  const [convValue, setConvValue] = useState<string>('100');
  const [convFrom, setConvFrom] = useState<ConverterUnit>('sqft');
  const [convTo, setConvTo] = useState<ConverterUnit>('sqm');

  const unitId = useId();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Effective waste percentage
  const effectiveWaste =
    wastePercentage === -1
      ? Math.max(0, parseDimension(customWaste))
      : wastePercentage;

  // Prepare rooms array based on active tab
  let activeRooms: RoomItem[] = [];
  if (activeTab === 'single') {
    activeRooms = [
      {
        id: 'single-room',
        name: 'Single Space',
        shape: 'rectangle',
        mode: 'add',
        length: parseDimension(singleLength),
        lengthInches: singleUnit === 'feet-inches' ? parseDimension(singleLengthInches) : 0,
        width: parseDimension(singleWidth),
        widthInches: singleUnit === 'feet-inches' ? parseDimension(singleWidthInches) : 0,
        unit: singleUnit,
      },
    ];
  } else if (activeTab === 'multiple') {
    activeRooms = rooms;
  } else {
    activeRooms = [
      {
        id: 'shape-room',
        name: 'Geometric Shape',
        shape: shapeType,
        mode: 'add',
        length: parseDimension(shapeLength),
        width: parseDimension(shapeWidth),
        radius: parseDimension(shapeRadius),
        base2: parseDimension(shapeBase2),
        length2: parseDimension(shapeLength2),
        width2: parseDimension(shapeWidth2),
        unit: shapeUnit,
      },
    ];
  }

  const result = calculateSquareFootage(
    activeRooms,
    effectiveWaste,
    parseDimension(costPerSqft)
  );

  const handleCalculateClick = () => {
    // Scroll results into view on mobile
    if (window.innerWidth < 900 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddRoom = () => {
    const newId = String(Date.now());
    const updated: RoomItem[] = [
      ...rooms,
      {
        id: newId,
        name: `Room ${rooms.length + 1}`,
        shape: 'rectangle',
        length: 12,
        width: 10,
        mode: 'add',
        unit: 'feet',
      },
    ];
    saveRooms(updated);
  };

  const handleRemoveRoom = (id: string) => {
    if (rooms.length <= 1) return;
    const updated = rooms.filter((r) => r.id !== id);
    saveRooms(updated);
  };

  const handleUpdateRoom = (id: string, updates: Partial<RoomItem>) => {
    const updated = rooms.map((r) => (r.id === id ? { ...r, ...updates } : r));
    saveRooms(updated);
  };

  const handleReset = () => {
    setSingleLength('20');
    setSingleLengthInches('0');
    setSingleWidth('12');
    setSingleWidthInches('0');
    setSingleUnit('feet');
    setWastePercentage(10);
    setCustomWaste('');
    setCostPerSqft('');
    const defaultRooms: RoomItem[] = [
      { id: '1', name: 'Living Room', shape: 'rectangle', length: 18, width: 14, mode: 'add', unit: 'feet' },
      { id: '2', name: 'Master Bedroom', shape: 'rectangle', length: 15, width: 13, mode: 'add', unit: 'feet' },
    ];
    saveRooms(defaultRooms);
    setShapeType('rectangle');
    setShapeUnit('feet');
    setShapeLength('18');
    setShapeWidth('10');
    setShapeRadius('7');
    setShapeBase2('14');
    setShapeLength2('8');
    setShapeWidth2('12');
    setCopied(false);
  };

  const handleCopy = () => {
    const perimeterLine =
      result.hasPerimeter && result.perimeterLinearFt !== null
        ? `• Perimeter: ${result.perimeterLinearFt.toLocaleString()} linear ft ${result.isPerimeterApprox ? '(approx.)' : ''}\n`
        : '';

    const summary = `Square Footage Calculation Summary:
• Total Area: ${result.sqft.toLocaleString()} sq ft (${result.sqMeters.toLocaleString()} m²)
• Area with +${effectiveWaste}% Waste: ${result.sqftWithWaste.toLocaleString()} sq ft (${result.sqMetersWithWaste.toLocaleString()} m²)
• Square Yards: ${result.sqYards.toLocaleString()} sq yd
• Square Inches: ${result.sqInches.toLocaleString()} sq in
${perimeterLine}${result.estimatedCost > 0 ? `• Estimated Material Cost: $${result.estimatedCost.toLocaleString()} (With waste: $${result.estimatedCostWithWaste.toLocaleString()})\n` : ''}
Calculated with KKCTools Square Footage Calculator (https://kkctools.com/square-footage-calculator/)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Area converter calculation
  const inputVal = parseDimension(convValue);
  const sqftEquivalent = inputVal * CONVERSION_TO_SQFT[convFrom];
  const convertedVal = sqftEquivalent / CONVERSION_TO_SQFT[convTo];
  const convertedDisplay = Number(convertedVal.toFixed(4)).toLocaleString();

  const handleSwapConverter = () => {
    setConvFrom(convTo);
    setConvTo(convFrom);
  };

  return (
    <div className={styles.calculatorWrapper}>
      <div className={styles.calculatorContainer}>
        {/* Tabs */}
        <div className={styles.tabList} role="tablist" aria-label="Calculation Mode">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'single'}
            className={`${styles.tabButton} ${activeTab === 'single' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('single')}
          >
            Single Room
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'multiple'}
            className={`${styles.tabButton} ${activeTab === 'multiple' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('multiple')}
          >
            Multiple Rooms
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'shapes'}
            className={`${styles.tabButton} ${activeTab === 'shapes' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('shapes')}
          >
            Shapes
          </button>
        </div>

        <div className={styles.layoutGrid}>
          {/* Left Inputs Panel */}
          <div className={styles.inputsPanel}>
            {/* Single Room Tab */}
            {activeTab === 'single' && (
              <div className={styles.roomCard}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${unitId}-single-unit`} className={styles.label}>
                    Measurement Unit
                  </label>
                  <select
                    id={`${unitId}-single-unit`}
                    className={styles.selectField}
                    value={singleUnit}
                    onChange={(e) => setSingleUnit(e.target.value as LengthUnit)}
                  >
                    <option value="feet">Decimal Feet (e.g. 12.5 ft)</option>
                    <option value="feet-inches">Feet &amp; Inches (e.g. 12 ft 6 in)</option>
                    <option value="inches">Inches (in)</option>
                    <option value="yards">Yards (yd)</option>
                    <option value="meters">Meters (m)</option>
                    <option value="centimeters">Centimeters (cm)</option>
                  </select>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${unitId}-length`} className={styles.label}>
                      Length ({singleUnit === 'feet-inches' ? 'feet' : singleUnit})
                    </label>
                    <input
                      id={`${unitId}-length`}
                      type="text"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={singleLength}
                      onChange={(e) => setSingleLength(e.target.value)}
                      placeholder="e.g. 20"
                    />
                  </div>
                  {singleUnit === 'feet-inches' && (
                    <div className={styles.fieldGroup}>
                      <label htmlFor={`${unitId}-length-in`} className={styles.label}>
                        Length (inches)
                      </label>
                      <input
                        id={`${unitId}-length-in`}
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={singleLengthInches}
                        onChange={(e) => setSingleLengthInches(e.target.value)}
                        placeholder="0-11"
                      />
                    </div>
                  )}

                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${unitId}-width`} className={styles.label}>
                      Width ({singleUnit === 'feet-inches' ? 'feet' : singleUnit})
                    </label>
                    <input
                      id={`${unitId}-width`}
                      type="text"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={singleWidth}
                      onChange={(e) => setSingleWidth(e.target.value)}
                      placeholder="e.g. 12"
                    />
                  </div>
                  {singleUnit === 'feet-inches' && (
                    <div className={styles.fieldGroup}>
                      <label htmlFor={`${unitId}-width-in`} className={styles.label}>
                        Width (inches)
                      </label>
                      <input
                        id={`${unitId}-width-in`}
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={singleWidthInches}
                        onChange={(e) => setSingleWidthInches(e.target.value)}
                        placeholder="0-11"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Multiple Rooms Tab */}
            {activeTab === 'multiple' && (
              <div className={styles.multiRoomContainer}>
                <p className={styles.sectionHelpText}>
                  Add each room or hallway. Toggle to <strong>Subtract</strong> for closets, cutouts, kitchen islands, or stairwells.
                </p>

                {rooms.map((room) => {
                  const roomSqft = (room.length || 0) * (room.width || 0);
                  const isSub = room.mode === 'subtract';

                  return (
                    <div key={room.id} className={`${styles.roomCard} ${isSub ? styles.roomCardSubtract : ''}`}>
                      <div className={styles.roomCardHeader}>
                        <input
                          type="text"
                          className={styles.roomTitleInput}
                          value={room.name}
                          onChange={(e) => handleUpdateRoom(room.id, { name: e.target.value })}
                          aria-label="Room Name"
                        />
                        <div className={styles.roomHeaderActions}>
                          <button
                            type="button"
                            className={`${styles.modeToggle} ${isSub ? styles.modeToggleSubtract : styles.modeToggleAdd}`}
                            onClick={() =>
                              handleUpdateRoom(room.id, { mode: isSub ? 'add' : 'subtract' })
                            }
                            title="Toggle between Add room area or Subtract cutout/closet"
                          >
                            {isSub ? '− Subtract (Cutout)' : '+ Add Space'}
                          </button>
                          {rooms.length > 1 && (
                            <button
                              type="button"
                              className={styles.removeButton}
                              onClick={() => handleRemoveRoom(room.id)}
                              aria-label={`Delete ${room.name}`}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <div className={styles.inputRow}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.label}>Length (ft)</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            className={styles.inputField}
                            value={room.length || ''}
                            onChange={(e) =>
                              handleUpdateRoom(room.id, { length: parseDimension(e.target.value) })
                            }
                            placeholder="ft"
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label className={styles.label}>Width (ft)</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            className={styles.inputField}
                            value={room.width || ''}
                            onChange={(e) =>
                              handleUpdateRoom(room.id, { width: parseDimension(e.target.value) })
                            }
                            placeholder="ft"
                          />
                        </div>
                      </div>
                      <div className={styles.rowSubtotal}>
                        <span>{isSub ? 'Subtracted Area:' : 'Subtotal:'}</span>
                        <strong className={isSub ? styles.subtractedValue : styles.addedValue}>
                          {isSub ? '−' : ''}{roomSqft.toFixed(2)} sq ft
                        </strong>
                      </div>
                    </div>
                  );
                })}

                <button type="button" className={styles.addButton} onClick={handleAddRoom}>
                  + Add Room
                </button>
              </div>
            )}

            {/* Shapes Tab */}
            {activeTab === 'shapes' && (
              <div className={styles.roomCard}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${unitId}-shape-type`} className={styles.label}>
                    Select Geometric Shape
                  </label>
                  <select
                    id={`${unitId}-shape-type`}
                    className={styles.selectField}
                    value={shapeType}
                    onChange={(e) => setShapeType(e.target.value as ShapeType)}
                  >
                    <option value="rectangle">Rectangle / Square (Length × Width)</option>
                    <option value="l-shape">L-Shape (Two Connected Rectangles A + B)</option>
                    <option value="triangle">Triangle (Base × Height / 2)</option>
                    <option value="circle">Circle (π × r²)</option>
                    <option value="semicircle">Semi-Circle ((π × r²) / 2)</option>
                    <option value="trapezoid">Trapezoid ((Base 1 + Base 2) / 2 × Height)</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${unitId}-shape-unit`} className={styles.label}>
                    Unit of Measurement
                  </label>
                  <select
                    id={`${unitId}-shape-unit`}
                    className={styles.selectField}
                    value={shapeUnit}
                    onChange={(e) => setShapeUnit(e.target.value as LengthUnit)}
                  >
                    <option value="feet">Decimal Feet (ft)</option>
                    <option value="inches">Inches (in)</option>
                    <option value="yards">Yards (yd)</option>
                    <option value="meters">Meters (m)</option>
                    <option value="centimeters">Centimeters (cm)</option>
                  </select>
                </div>

                {shapeType === 'rectangle' && (
                  <div className={styles.inputRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Length ({shapeUnit})</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={shapeLength}
                        onChange={(e) => setShapeLength(e.target.value)}
                        placeholder="Length"
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Width ({shapeUnit})</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={shapeWidth}
                        onChange={(e) => setShapeWidth(e.target.value)}
                        placeholder="Width"
                      />
                    </div>
                  </div>
                )}

                {shapeType === 'l-shape' && (
                  <div className={styles.shapeSubSection}>
                    <p className={styles.shapeHint}>
                      Split the L-shape into two rectangles: Section A and Section B.
                    </p>
                    <div className={styles.shapeSubTitle}>Section A</div>
                    <div className={styles.inputRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Length A ({shapeUnit})</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={shapeLength}
                          onChange={(e) => setShapeLength(e.target.value)}
                          placeholder="e.g. 10"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Width A ({shapeUnit})</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={shapeWidth}
                          onChange={(e) => setShapeWidth(e.target.value)}
                          placeholder="e.g. 12"
                        />
                      </div>
                    </div>

                    <div className={styles.shapeSubTitle}>Section B</div>
                    <div className={styles.inputRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Length B ({shapeUnit})</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={shapeLength2}
                          onChange={(e) => setShapeLength2(e.target.value)}
                          placeholder="e.g. 8"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Width B ({shapeUnit})</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={shapeWidth2}
                          onChange={(e) => setShapeWidth2(e.target.value)}
                          placeholder="e.g. 14"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {shapeType === 'triangle' && (
                  <div className={styles.inputRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Base ({shapeUnit})</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={shapeLength}
                        onChange={(e) => setShapeLength(e.target.value)}
                        placeholder="Base"
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Height ({shapeUnit})</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={shapeWidth}
                        onChange={(e) => setShapeWidth(e.target.value)}
                        placeholder="Height"
                      />
                    </div>
                  </div>
                )}

                {(shapeType === 'circle' || shapeType === 'semicircle') && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${unitId}-radius`} className={styles.label}>
                      Radius ({shapeUnit})
                    </label>
                    <input
                      id={`${unitId}-radius`}
                      type="text"
                      inputMode="decimal"
                      className={styles.inputField}
                      value={shapeRadius}
                      onChange={(e) => setShapeRadius(e.target.value)}
                      placeholder="Radius"
                    />
                    <span className={styles.unitNotice}>
                      Tip: Radius is half of the total diameter (e.g. 14 ft round circle = 7 ft radius)
                    </span>
                  </div>
                )}

                {shapeType === 'trapezoid' && (
                  <div className={styles.inputRow3}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Base 1 ({shapeUnit})</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={shapeLength}
                        onChange={(e) => setShapeLength(e.target.value)}
                        placeholder="Base 1"
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Base 2 ({shapeUnit})</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={shapeBase2}
                        onChange={(e) => setShapeBase2(e.target.value)}
                        placeholder="Base 2"
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Height / Depth ({shapeUnit})</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={styles.inputField}
                        value={shapeWidth}
                        onChange={(e) => setShapeWidth(e.target.value)}
                        placeholder="Height"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Waste Preset Chips + Custom */}
            <div className={styles.globalControls}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Waste Allowance</label>
                <div className={styles.chipGroup}>
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`${styles.chip} ${wastePercentage === pct ? styles.chipSelected : ''}`}
                      onClick={() => setWastePercentage(pct)}
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`${styles.chip} ${wastePercentage === -1 ? styles.chipSelected : ''}`}
                    onClick={() => setWastePercentage(-1)}
                  >
                    Custom
                  </button>
                </div>
                {wastePercentage === -1 && (
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

              {/* Cost input: price per sq ft only */}
              <div className={styles.fieldGroup}>
                <label htmlFor={`${unitId}-cost`} className={styles.label}>
                  Cost per Square Foot ($ / sq ft) — Optional
                </label>
                <input
                  id={`${unitId}-cost`}
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 3.50"
                  className={styles.inputField}
                  value={costPerSqft}
                  onChange={(e) => setCostPerSqft(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtonGroup}>
                <button
                  type="button"
                  className={styles.primaryActionButton}
                  onClick={handleCalculateClick}
                >
                  Calculate Square Feet
                </button>
                <button type="button" className={styles.secondaryActionButton} onClick={handleReset}>
                  Reset
                </button>
              </div>
              <p className={styles.buttonHelperText}>
                Tip: The sqft calculator updates instantly as you type. Click &ldquo;Calculate Square Feet&rdquo; to jump directly to results on mobile.
              </p>
            </div>
          </div>

          {/* Right Results Panel */}
          <div className={styles.resultsPanel} ref={resultsRef} aria-live="polite">
            {result.isNegativeTotal && (
              <div className={styles.errorNotice} role="alert">
                Warning: Total area cannot be negative. Subtracted areas exceed positive space.
              </div>
            )}

            <div className={styles.primaryResultCard}>
              <div className={styles.primaryResultLabel}>Total Square Footage</div>
              <div className={styles.primaryResultValue}>
                {result.sqft.toLocaleString()} <span className={styles.unitSuffix}>sq ft</span>
              </div>
              <div className={styles.primaryResultSub}>
                With +{effectiveWaste}% Waste: <strong>{result.sqftWithWaste.toLocaleString()} sq ft</strong>
              </div>
            </div>

            <div className={styles.breakdownCard}>
              <div className={styles.breakdownTitle}>Unit Conversions (Based on Net Area)</div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Square Meters (m²)</span>
                <span className={styles.breakdownValue}>{result.sqMeters.toLocaleString()} m²</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Square Yards (sq yd)</span>
                <span className={styles.breakdownValue}>{result.sqYards.toLocaleString()} sq yd</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Square Inches (sq in)</span>
                <span className={styles.breakdownValue}>{result.sqInches.toLocaleString()} sq in</span>
              </div>

              {/* Conditional Perimeter */}
              {result.hasPerimeter && result.perimeterLinearFt !== null && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>
                    Perimeter (Trim / Baseboard)
                    {result.isPerimeterApprox && (
                      <span className={styles.approxBadge}>
                        approx. — does not account for doorways or shared walls
                      </span>
                    )}
                  </span>
                  <span className={styles.breakdownValue}>
                    {result.perimeterLinearFt.toLocaleString()} linear ft
                  </span>
                </div>
              )}
            </div>

            {result.estimatedCost > 0 && (
              <div className={styles.breakdownCard}>
                <div className={styles.breakdownTitle}>Estimated Material Budget</div>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Base Material Cost</span>
                  <span className={styles.breakdownValue}>${result.estimatedCost.toLocaleString()}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>With +{effectiveWaste}% Waste Buffer</span>
                  <span className={styles.breakdownValue} style={{ color: 'var(--color-primary, #0284c7)' }}>
                    ${result.estimatedCostWithWaste.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

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

      {/* Quick Area Converter Widget */}
      <div className={styles.quickConverterCard}>
        <div className={styles.quickConverterHeader}>
          <h3 className={styles.quickConverterTitle}>Quick Area Converter</h3>
          <p className={styles.quickConverterDesc}>
            Instant bidirectional conversion between square feet, square meters, square inches, square yards, and acres.
          </p>
        </div>
        <div className={styles.converterGrid}>
          <div className={styles.converterInputCol}>
            <label htmlFor={`${unitId}-conv-val`} className={styles.label}>
              Convert Value
            </label>
            <input
              id={`${unitId}-conv-val`}
              type="text"
              inputMode="decimal"
              className={styles.inputField}
              value={convValue}
              onChange={(e) => setConvValue(e.target.value)}
              placeholder="e.g. 100"
            />
          </div>

          <div className={styles.converterSelectCol}>
            <label htmlFor={`${unitId}-conv-from`} className={styles.label}>
              From
            </label>
            <select
              id={`${unitId}-conv-from`}
              className={styles.selectField}
              value={convFrom}
              onChange={(e) => setConvFrom(e.target.value as ConverterUnit)}
            >
              {(Object.keys(CONVERSION_TO_SQFT) as ConverterUnit[]).map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.converterSwapCol}>
            <button
              type="button"
              className={styles.swapButton}
              onClick={handleSwapConverter}
              aria-label="Swap conversion units"
              title="Swap From and To"
            >
              ⇄
            </button>
          </div>

          <div className={styles.converterSelectCol}>
            <label htmlFor={`${unitId}-conv-to`} className={styles.label}>
              To
            </label>
            <select
              id={`${unitId}-conv-to`}
              className={styles.selectField}
              value={convTo}
              onChange={(e) => setConvTo(e.target.value as ConverterUnit)}
            >
              {(Object.keys(CONVERSION_TO_SQFT) as ConverterUnit[]).map((u) => (
                <option key={u} value={u}>
                  {UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.converterResultBox}>
          <span className={styles.converterResultLabel}>Converted Area:</span>
          <span className={styles.converterResultNumber}>
            {convertedDisplay} {convTo === 'sqm' ? 'm²' : convTo}
          </span>
          <span className={styles.converterResultDetail}>
            ({inputVal} {convFrom} = {convertedDisplay} {convTo})
          </span>
        </div>
      </div>
    </div>
  );
}
