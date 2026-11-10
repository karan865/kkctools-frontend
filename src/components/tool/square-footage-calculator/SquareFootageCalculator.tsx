'use client';

import React, { useState, useId } from 'react';
import {
  LengthUnit,
  ShapeType,
  RoomItem,
  calculateSquareFootage,
} from '@/lib/square-footage-engine';
import styles from './SquareFootageCalculator.module.css';

type ActiveTab = 'single' | 'multiple' | 'shapes';

export default function SquareFootageCalculator() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('single');
  const [wastePercentage, setWastePercentage] = useState<number>(10);
  const [costPerSqft, setCostPerSqft] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Single mode state
  const [singleLength, setSingleLength] = useState<string>('20');
  const [singleLengthInches, setSingleLengthInches] = useState<string>('0');
  const [singleWidth, setSingleWidth] = useState<string>('12');
  const [singleWidthInches, setSingleWidthInches] = useState<string>('0');
  const [singleUnit, setSingleUnit] = useState<LengthUnit>('feet');

  // Multi-room state
  const [rooms, setRooms] = useState<RoomItem[]>([
    { id: '1', name: 'Living Room', shape: 'rectangle', length: 18, width: 14, unit: 'feet' },
    { id: '2', name: 'Master Bedroom', shape: 'rectangle', length: 15, width: 13, unit: 'feet' },
  ]);

  // Shape state
  const [shapeType, setShapeType] = useState<ShapeType>('triangle');
  const [shapeUnit, setShapeUnit] = useState<LengthUnit>('feet');
  const [shapeLength, setShapeLength] = useState<string>('18');
  const [shapeWidth, setShapeWidth] = useState<string>('10');
  const [shapeRadius, setShapeRadius] = useState<string>('7');
  const [shapeBase2, setShapeBase2] = useState<string>('14');
  const [shapeLength2, setShapeLength2] = useState<string>('8');
  const [shapeWidth2, setShapeWidth2] = useState<string>('12');

  const unitId = useId();

  // Prepare rooms array based on active tab
  let activeRooms: RoomItem[] = [];
  if (activeTab === 'single') {
    activeRooms = [
      {
        id: 'single-room',
        name: 'Single Space',
        shape: 'rectangle',
        length: parseFloat(singleLength) || 0,
        lengthInches: parseFloat(singleLengthInches) || 0,
        width: parseFloat(singleWidth) || 0,
        widthInches: parseFloat(singleWidthInches) || 0,
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
        length: parseFloat(shapeLength) || 0,
        width: parseFloat(shapeWidth) || 0,
        radius: parseFloat(shapeRadius) || 0,
        base2: parseFloat(shapeBase2) || 0,
        length2: parseFloat(shapeLength2) || 0,
        width2: parseFloat(shapeWidth2) || 0,
        unit: shapeUnit,
      },
    ];
  }

  const result = calculateSquareFootage(
    activeRooms,
    wastePercentage,
    parseFloat(costPerSqft) || 0
  );

  const handleAddRoom = () => {
    const newId = String(Date.now());
    setRooms([
      ...rooms,
      {
        id: newId,
        name: `Room ${rooms.length + 1}`,
        shape: 'rectangle',
        length: 12,
        width: 10,
        unit: 'feet',
      },
    ]);
  };

  const handleRemoveRoom = (id: string) => {
    if (rooms.length <= 1) return;
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const handleUpdateRoom = (id: string, updates: Partial<RoomItem>) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleReset = () => {
    setSingleLength('20');
    setSingleLengthInches('0');
    setSingleWidth('12');
    setSingleWidthInches('0');
    setSingleUnit('feet');
    setWastePercentage(10);
    setCostPerSqft('');
    setRooms([
      { id: '1', name: 'Living Room', shape: 'rectangle', length: 18, width: 14, unit: 'feet' },
      { id: '2', name: 'Master Bedroom', shape: 'rectangle', length: 15, width: 13, unit: 'feet' },
    ]);
    setShapeType('triangle');
    setShapeLength('18');
    setShapeWidth('10');
    setShapeRadius('7');
    setCopied(false);
  };

  const handleCopy = () => {
    const summary = `Square Footage Calculation Summary:
• Total Area: ${result.sqft.toLocaleString()} sq ft (${result.sqMeters.toLocaleString()} m²)
• Area with +${wastePercentage}% Waste: ${result.sqftWithWaste.toLocaleString()} sq ft (${result.sqMetersWithWaste.toLocaleString()} m²)
• Square Yards: ${result.sqYards.toLocaleString()} sq yd
• Square Inches: ${result.sqInches.toLocaleString()} sq in
• Perimeter (Linear Trim): ${result.perimeterLinearFt.toLocaleString()} linear ft
${result.estimatedCost > 0 ? `• Estimated Material Budget: $${result.estimatedCost.toLocaleString()} (With waste: $${result.estimatedCostWithWaste.toLocaleString()})` : ''}

Calculated with KKCTools Square Footage Calculator (https://kkctools.com/square-footage-calculator/)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
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
          Single Area / Room
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'multiple'}
          className={`${styles.tabButton} ${activeTab === 'multiple' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('multiple')}
        >
          Multiple Rooms (Full House)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'shapes'}
          className={`${styles.tabButton} ${activeTab === 'shapes' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('shapes')}
        >
          Odd Geometric Shapes
        </button>
      </div>

      <div className={styles.layoutGrid}>
        {/* Left Inputs Panel */}
        <div className={styles.inputsPanel}>
          {activeTab === 'single' && (
            <div className={styles.roomCard}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${unitId}-single-unit`} className={styles.label}>
                  Measurement Units
                </label>
                <select
                  id={`${unitId}-single-unit`}
                  className={styles.selectField}
                  value={singleUnit}
                  onChange={(e) => setSingleUnit(e.target.value as LengthUnit)}
                >
                  <option value="feet">Decimal Feet (e.g. 12.5 ft)</option>
                  <option value="feet-inches">Feet &amp; Inches (e.g. 12 ft 6 in)</option>
                  <option value="inches">Inches (e.g. 150 in)</option>
                  <option value="yards">Yards (e.g. 4.5 yd)</option>
                  <option value="meters">Meters (e.g. 4.0 m)</option>
                  <option value="centimeters">Centimeters (e.g. 400 cm)</option>
                </select>
              </div>

              <div className={singleUnit === 'feet-inches' ? styles.inputRow : styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${unitId}-length`} className={styles.label}>
                    Length ({singleUnit === 'feet-inches' ? 'feet' : singleUnit})
                  </label>
                  <input
                    id={`${unitId}-length`}
                    type="number"
                    min="0"
                    step="any"
                    className={styles.inputField}
                    value={singleLength}
                    onChange={(e) => setSingleLength(e.target.value)}
                  />
                </div>
                {singleUnit === 'feet-inches' && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${unitId}-length-in`} className={styles.label}>
                      Length (inches)
                    </label>
                    <input
                      id={`${unitId}-length-in`}
                      type="number"
                      min="0"
                      max="11"
                      step="any"
                      className={styles.inputField}
                      value={singleLengthInches}
                      onChange={(e) => setSingleLengthInches(e.target.value)}
                    />
                  </div>
                )}

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${unitId}-width`} className={styles.label}>
                    Width ({singleUnit === 'feet-inches' ? 'feet' : singleUnit})
                  </label>
                  <input
                    id={`${unitId}-width`}
                    type="number"
                    min="0"
                    step="any"
                    className={styles.inputField}
                    value={singleWidth}
                    onChange={(e) => setSingleWidth(e.target.value)}
                  />
                </div>
                {singleUnit === 'feet-inches' && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${unitId}-width-in`} className={styles.label}>
                      Width (inches)
                    </label>
                    <input
                      id={`${unitId}-width-in`}
                      type="number"
                      min="0"
                      max="11"
                      step="any"
                      className={styles.inputField}
                      value={singleWidthInches}
                      onChange={(e) => setSingleWidthInches(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'multiple' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rooms.map((room, index) => (
                <div key={room.id} className={styles.roomCard}>
                  <div className={styles.roomCardHeader}>
                    <input
                      type="text"
                      className={styles.roomTitleInput}
                      value={room.name}
                      onChange={(e) => handleUpdateRoom(room.id, { name: e.target.value })}
                      aria-label="Room Name"
                    />
                    {rooms.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => handleRemoveRoom(room.id)}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Length (ft)</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className={styles.inputField}
                        value={room.length || ''}
                        onChange={(e) =>
                          handleUpdateRoom(room.id, { length: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Width (ft)</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className={styles.inputField}
                        value={room.width || ''}
                        onChange={(e) =>
                          handleUpdateRoom(room.id, { width: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.unitNotice}>
                    Subtotal: {(room.length * room.width || 0).toFixed(1)} sq ft
                  </div>
                </div>
              ))}

              <button type="button" className={styles.addButton} onClick={handleAddRoom}>
                + Add Another Room
              </button>
            </div>
          )}

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
                  <option value="triangle">Triangle / Gable (Base × Height / 2)</option>
                  <option value="circle">Circle / Round Patio (π × r²)</option>
                  <option value="semicircle">Semi-Circle ((π × r²) / 2)</option>
                  <option value="trapezoid">Trapezoid (Slanted Wall / Yard)</option>
                  <option value="l-shape">L-Shaped Room (Two Connected Rectangles)</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`${unitId}-shape-unit`} className={styles.label}>
                  Units
                </label>
                <select
                  id={`${unitId}-shape-unit`}
                  className={styles.selectField}
                  value={shapeUnit}
                  onChange={(e) => setShapeUnit(e.target.value as LengthUnit)}
                >
                  <option value="feet">Feet (ft)</option>
                  <option value="inches">Inches (in)</option>
                  <option value="yards">Yards (yd)</option>
                  <option value="meters">Meters (m)</option>
                </select>
              </div>

              {(shapeType === 'circle' || shapeType === 'semicircle') && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${unitId}-radius`} className={styles.label}>
                    Radius ({shapeUnit})
                  </label>
                  <input
                    id={`${unitId}-radius`}
                    type="number"
                    min="0"
                    step="any"
                    className={styles.inputField}
                    value={shapeRadius}
                    onChange={(e) => setShapeRadius(e.target.value)}
                  />
                  <span className={styles.unitNotice}>
                    Tip: Radius is half of diameter (e.g. 14 ft round patio = 7 ft radius)
                  </span>
                </div>
              )}

              {shapeType === 'triangle' && (
                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${unitId}-tri-base`} className={styles.label}>
                      Base ({shapeUnit})
                    </label>
                    <input
                      id={`${unitId}-tri-base`}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.inputField}
                      value={shapeLength}
                      onChange={(e) => setShapeLength(e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${unitId}-tri-height`} className={styles.label}>
                      Height ({shapeUnit})
                    </label>
                    <input
                      id={`${unitId}-tri-height`}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.inputField}
                      value={shapeWidth}
                      onChange={(e) => setShapeWidth(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {shapeType === 'trapezoid' && (
                <div className={styles.inputRow3}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Parallel Base 1 ({shapeUnit})</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className={styles.inputField}
                      value={shapeLength}
                      onChange={(e) => setShapeLength(e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Parallel Base 2 ({shapeUnit})</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className={styles.inputField}
                      value={shapeBase2}
                      onChange={(e) => setShapeBase2(e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Height / Depth ({shapeUnit})</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className={styles.inputField}
                      value={shapeWidth}
                      onChange={(e) => setShapeWidth(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {shapeType === 'l-shape' && (
                <>
                  <div className={styles.label} style={{ marginTop: '0.5rem' }}>
                    Section 1 Dimensions
                  </div>
                  <div className={styles.inputRow}>
                    <input
                      type="number"
                      placeholder="Length 1 (ft)"
                      className={styles.inputField}
                      value={shapeLength}
                      onChange={(e) => setShapeLength(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Width 1 (ft)"
                      className={styles.inputField}
                      value={shapeWidth}
                      onChange={(e) => setShapeWidth(e.target.value)}
                    />
                  </div>
                  <div className={styles.label} style={{ marginTop: '0.5rem' }}>
                    Section 2 Dimensions
                  </div>
                  <div className={styles.inputRow}>
                    <input
                      type="number"
                      placeholder="Length 2 (ft)"
                      className={styles.inputField}
                      value={shapeLength2}
                      onChange={(e) => setShapeLength2(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Width 2 (ft)"
                      className={styles.inputField}
                      value={shapeWidth2}
                      onChange={(e) => setShapeWidth2(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Global Controls: Waste % & Cost */}
          <div className={styles.globalControls}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Waste Factor Allowance (%)</label>
              <div className={styles.chipGroup}>
                {[0, 5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`${styles.chip} ${wastePercentage === pct ? styles.chipSelected : ''}`}
                    onClick={() => setWastePercentage(pct)}
                  >
                    {pct === 10 ? '10% (Standard)' : pct === 15 ? '15% (Diagonal)' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`${unitId}-cost`} className={styles.label}>
                Price per Square Foot ($ / sq ft) - Optional
              </label>
              <input
                id={`${unitId}-cost`}
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 3.50"
                className={styles.inputField}
                value={costPerSqft}
                onChange={(e) => setCostPerSqft(e.target.value)}
              />
            </div>

            <div className={styles.buttonRow}>
              <button type="button" className={styles.resetButton} onClick={handleReset}>
                Reset Fields
              </button>
            </div>
          </div>
        </div>

        {/* Right Results Panel */}
        <div className={styles.resultsPanel}>
          <div className={styles.primaryResultCard}>
            <div className={styles.primaryResultLabel}>Total Square Footage</div>
            <div className={styles.primaryResultValue}>
              {result.sqft.toLocaleString()} <span style={{ fontSize: '1.25rem' }}>sq ft</span>
            </div>
            <div className={styles.primaryResultSub}>
              With +{wastePercentage}% Waste Allowance:{' '}
              <strong>{result.sqftWithWaste.toLocaleString()} sq ft</strong>
            </div>
          </div>

          <div className={styles.breakdownCard}>
            <div className={styles.breakdownTitle}>Unit Conversions Summary</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Square Meters (m²)</span>
              <span className={styles.breakdownValue}>
                {result.sqMeters.toLocaleString()} m² ({result.sqMetersWithWaste.toLocaleString()} m² w/waste)
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Square Yards (sq yd)</span>
              <span className={styles.breakdownValue}>
                {result.sqYards.toLocaleString()} sq yd
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Square Inches (sq in)</span>
              <span className={styles.breakdownValue}>
                {result.sqInches.toLocaleString()} sq in
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Perimeter (Linear Trim)</span>
              <span className={styles.breakdownValue}>
                {result.perimeterLinearFt.toLocaleString()} linear ft
              </span>
            </div>
          </div>

          {result.estimatedCost > 0 && (
            <div className={styles.breakdownCard}>
              <div className={styles.breakdownTitle}>Estimated Material Budget</div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Net Material Cost</span>
                <span className={styles.breakdownValue}>${result.estimatedCost.toLocaleString()}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>With {wastePercentage}% Waste Buffer</span>
                <span className={styles.breakdownValue} style={{ color: 'var(--color-primary, #0284c7)' }}>
                  ${result.estimatedCostWithWaste.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <button type="button" className={styles.copyButton} onClick={handleCopy}>
            📋 Copy Calculation Summary
          </button>
          {copied && <div className={styles.copiedMessage}>✓ Copied to clipboard!</div>}
        </div>
      </div>
    </div>
  );
}

