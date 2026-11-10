'use client';

import React, { useState, useId } from 'react';
import styles from './SandCalculator.module.css';
import {
  UnitSystem,
  SandCondition,
  AreaSection,
  calculateSandVolume,
  calculatePaverSand,
  calculatePolymericSand,
} from '@/lib/sand-engine';

export default function SandCalculator() {
  const baseId = useId();

  // Mode: 1. Sand Volume, 2. Paver Sand, 3. Polymeric Sand
  const [mode, setMode] = useState<'volume' | 'paver' | 'polymeric'>('volume');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('us');

  // Mode 1: Sand Volume State
  const [preset, setPreset] = useState<'custom' | 'sandbox'>('custom');
  const [sections, setSections] = useState<AreaSection[]>([
    { id: '1', shape: 'rectangle', lengthFt: 10, widthFt: 10, lengthM: 3, widthM: 2 },
  ]);
  const [depthInches, setDepthInches] = useState<number>(2);
  const [depthCm, setDepthCm] = useState<number>(5);
  const [sandCondition, setSandCondition] = useState<SandCondition>('dry');
  const [customDensityLb, setCustomDensityLb] = useState<number>(2600);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [bagSizeOption, setBagSizeOption] = useState<'40' | '50' | '60' | '80' | 'customLb' | 'customCuFt' | '25kg'>('50');
  const [customBagWeightLb, setCustomBagWeightLb] = useState<number>(50);
  const [customBagVolumeCuFt, setCustomBagVolumeCuFt] = useState<number>(0.5);

  // Mode 2: Paver Sand (Bedding) State
  const [paverAreaSqFt, setPaverAreaSqFt] = useState<number>(200);
  const [paverAreaSqM, setPaverAreaSqM] = useState<number>(20);
  const [beddingDepthInches, setBeddingDepthInches] = useState<number>(1);
  const [beddingDepthCm, setBeddingDepthCm] = useState<number>(2.5);
  const [paverWastePercent, setPaverWastePercent] = useState<number>(10);
  const [paverSandCondition, setPaverSandCondition] = useState<SandCondition>('dry');

  // Mode 3: Polymeric Sand State
  const [polyAreaSqFt, setPolyAreaSqFt] = useState<number>(200);
  const [polyAreaSqM, setPolyAreaSqM] = useState<number>(20);
  const [paverLengthInches, setPaverLengthInches] = useState<number>(6);
  const [paverWidthInches, setPaverWidthInches] = useState<number>(9);
  const [jointWidthInches, setJointWidthInches] = useState<number>(0.25);
  const [jointDepthInches, setJointDepthInches] = useState<number>(2);
  const [polyWastePercent, setPolyWastePercent] = useState<number>(10);
  const [bagCoverageSqFt, setBagCoverageSqFt] = useState<number | undefined>(undefined);

  // UX toggles
  const [showMath, setShowMath] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<string>('Copy Summary');

  // Handler for Sand Volume Presets
  const applyPreset = (p: 'custom' | 'sandbox') => {
    setPreset(p);
    if (p === 'sandbox') {
      setDepthInches(6);
      setDepthCm(15);
      setSections([
        { id: '1', label: 'Sandbox', shape: 'rectangle', lengthFt: 4, widthFt: 4, lengthM: 1.2, widthM: 1.2 },
      ]);
    } else {
      setDepthInches(2);
      setDepthCm(5);
      setSections([
        { id: '1', shape: 'rectangle', lengthFt: 10, widthFt: 10, lengthM: 3, widthM: 2 },
      ]);
    }
  };

  // Section managers for Mode 1
  const addSection = () => {
    if (sections.length >= 5) return;
    setSections([
      ...sections,
      {
        id: String(Date.now()),
        shape: 'rectangle',
        lengthFt: 10,
        widthFt: 10,
        lengthM: 3,
        widthM: 2,
      },
    ]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<AreaSection>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // Calculations
  const volumeResult = calculateSandVolume({
    unitSystem,
    sections,
    depthInches,
    depthCm,
    sandCondition,
    customDensityLbPerYd3: customDensityLb,
    wastePercent,
    bagSizeOption: unitSystem === 'metric' ? '25kg' : bagSizeOption,
    customBagWeightLb,
    customBagVolumeCuFt,
  });

  const paverResult = calculatePaverSand({
    unitSystem,
    areaSqFt: paverAreaSqFt,
    areaSqM: paverAreaSqM,
    beddingDepthInches,
    beddingDepthCm,
    sandCondition: paverSandCondition,
    wastePercent: paverWastePercent,
    bagSizeOption: unitSystem === 'metric' ? '25kg' : '50',
  });

  const polymericResult = calculatePolymericSand({
    unitSystem,
    totalAreaSqFt: polyAreaSqFt,
    totalAreaSqM: polyAreaSqM,
    paverLengthInches,
    paverWidthInches,
    jointWidthInches,
    jointDepthInches,
    wastePercent: polyWastePercent,
    bagWeightLb: 50,
    optionalCoverageSqFtPerBag: bagCoverageSqFt,
  });

  // Copy result action
  const handleCopy = () => {
    let text = '';
    if (mode === 'volume') {
      text = `Sand Calculation:
- Volume: ${unitSystem === 'metric' ? `${volumeResult.volumeM3WithWaste.toFixed(2)} m³` : `${volumeResult.volumeCuYdWithWaste.toFixed(2)} cu yd (${volumeResult.volumeCuFtWithWaste.toFixed(2)} cu ft)`}
- Weight: ${unitSystem === 'metric' ? `${volumeResult.weightKgWithWaste.toFixed(0)} kg (${volumeResult.weightTonnesWithWaste.toFixed(2)} tonnes)` : `${volumeResult.weightTonsWithWaste.toFixed(2)} tons (${volumeResult.weightLbWithWaste.toFixed(0)} lb)`}
- Bags: ${volumeResult.totalBags} bags (${volumeResult.bagWeightOrVolLabel})
- Waste allowance: ${wastePercent}%
Calculated at kkctools.com/sand-calculator/`;
    } else if (mode === 'paver') {
      text = `Paver Sand (Bedding) Calculation:
- Area: ${unitSystem === 'metric' ? `${paverAreaSqM} m²` : `${paverAreaSqFt} sq ft`} @ ${unitSystem === 'metric' ? `${beddingDepthCm} cm` : `${beddingDepthInches} in`} depth
- Volume: ${unitSystem === 'metric' ? `${paverResult.volumeM3WithWaste.toFixed(2)} m³` : `${paverResult.volumeCuYdWithWaste.toFixed(2)} cu yd (${paverResult.volumeCuFtWithWaste.toFixed(2)} cu ft)`}
- Weight: ${unitSystem === 'metric' ? `${paverResult.weightKgWithWaste.toFixed(0)} kg` : `${paverResult.weightTonsWithWaste.toFixed(2)} tons`}
- Bags: ${paverResult.totalBags} bags (50 lb)
Calculated at kkctools.com/sand-calculator/`;
    } else {
      text = `Polymeric Sand (Joints) Calculation:
- Patio Area: ${unitSystem === 'metric' ? `${polyAreaSqM} m²` : `${polyAreaSqFt} sq ft`}
- Joint Volume: ${polymericResult.jointVolumeCuFtWithWaste.toFixed(2)} cu ft (${polymericResult.jointVolumeCuYdWithWaste.toFixed(2)} cu yd)
- Sand Weight: ${polymericResult.jointWeightLbWithWaste.toFixed(0)} lb
- Bags Required: ${polymericResult.totalBags} bags (50 lb)
Calculated at kkctools.com/sand-calculator/`;
    }

    navigator.clipboard.writeText(text);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Summary'), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.calculatorContainer} aria-label="Sand Calculator Form">
      {/* Header controls: Modes & Unit toggle */}
      <div className={styles.modeHeader}>
        <div className={styles.modeTabs} role="tablist" aria-label="Calculator Modes">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'volume'}
            className={`${styles.modeTab} ${mode === 'volume' ? styles.modeTabActive : ''}`}
            onClick={() => setMode('volume')}
          >
            1. Sand Volume
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'paver'}
            className={`${styles.modeTab} ${mode === 'paver' ? styles.modeTabActive : ''}`}
            onClick={() => setMode('paver')}
          >
            2. Paver Sand (Bedding)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'polymeric'}
            className={`${styles.modeTab} ${mode === 'polymeric' ? styles.modeTabActive : ''}`}
            onClick={() => setMode('polymeric')}
          >
            3. Polymeric Sand (Joints)
          </button>
        </div>

        <div className={styles.unitToggle}>
          <button
            type="button"
            className={`${styles.unitBtn} ${unitSystem === 'us' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnitSystem('us')}
          >
            US (ft, in, yd³)
          </button>
          <button
            type="button"
            className={`${styles.unitBtn} ${unitSystem === 'metric' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnitSystem('metric')}
          >
            Metric (m, cm, m³)
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* INPUTS COLUMN */}
        <div className={styles.formCol}>
          {/* MODE 1: SAND VOLUME */}
          {mode === 'volume' && (
            <>
              {/* Presets */}
              <div className={styles.presetBar}>
                <span><strong>Presets:</strong></span>
                <button
                  type="button"
                  className={`${styles.presetBtn} ${preset === 'custom' ? styles.presetBtnActive : ''}`}
                  onClick={() => applyPreset('custom')}
                >
                  Custom Area
                </button>
                <button
                  type="button"
                  className={`${styles.presetBtn} ${preset === 'sandbox' ? styles.presetBtnActive : ''}`}
                  onClick={() => applyPreset('sandbox')}
                >
                  Sandbox (6″ Depth)
                </button>
              </div>

              {/* Multi-section list */}
              {sections.map((sec, idx) => (
                <div key={sec.id} className={styles.sectionBox}>
                  <div className={styles.sectionHeader}>
                    <span>Area #{idx + 1} {sec.label ? `— ${sec.label}` : ''}</span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => removeSection(sec.id)}
                        aria-label="Remove Area"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor={`${baseId}-shape-${sec.id}`}>Shape</label>
                      <select
                        id={`${baseId}-shape-${sec.id}`}
                        className={styles.selectField}
                        value={sec.shape}
                        onChange={(e) =>
                          updateSection(sec.id, { shape: e.target.value as 'rectangle' | 'circle' })
                        }
                      >
                        <option value="rectangle">Rectangle (L × W)</option>
                        <option value="circle">Circle (Round)</option>
                      </select>
                    </div>

                    {sec.shape === 'rectangle' ? (
                      <>
                        <div className={styles.fieldGroup}>
                          <label htmlFor={`${baseId}-len-${sec.id}`}>
                            Length ({unitSystem === 'us' ? 'ft' : 'm'})
                          </label>
                          <input
                            id={`${baseId}-len-${sec.id}`}
                            type="number"
                            min="0.1"
                            step="any"
                            inputMode="decimal"
                            className={styles.inputField}
                            value={unitSystem === 'us' ? sec.lengthFt ?? '' : sec.lengthM ?? ''}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              if (unitSystem === 'us') updateSection(sec.id, { lengthFt: val });
                              else updateSection(sec.id, { lengthM: val });
                            }}
                          />
                        </div>
                        <div className={styles.fieldGroup}>
                          <label htmlFor={`${baseId}-wid-${sec.id}`}>
                            Width ({unitSystem === 'us' ? 'ft' : 'm'})
                          </label>
                          <input
                            id={`${baseId}-wid-${sec.id}`}
                            type="number"
                            min="0.1"
                            step="any"
                            inputMode="decimal"
                            className={styles.inputField}
                            value={unitSystem === 'us' ? sec.widthFt ?? '' : sec.widthM ?? ''}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              if (unitSystem === 'us') updateSection(sec.id, { widthFt: val });
                              else updateSection(sec.id, { widthM: val });
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className={styles.fieldGroup}>
                        <label htmlFor={`${baseId}-dia-${sec.id}`}>
                          Diameter ({unitSystem === 'us' ? 'ft' : 'm'})
                        </label>
                        <input
                          id={`${baseId}-dia-${sec.id}`}
                          type="number"
                          min="0.1"
                          step="any"
                          inputMode="decimal"
                          className={styles.inputField}
                          value={unitSystem === 'us' ? sec.diameterFt ?? '' : sec.diameterM ?? ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            if (unitSystem === 'us') updateSection(sec.id, { diameterFt: val });
                            else updateSection(sec.id, { diameterM: val });
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sections.length < 5 && (
                <button type="button" className={styles.addBtn} onClick={addSection}>
                  + Add Another Area (Max 5)
                </button>
              )}

              {/* Depth */}
              <div className={styles.fieldGroup}>
                <label htmlFor={`${baseId}-depth`}>
                  Sand Depth ({unitSystem === 'us' ? 'inches' : 'cm'})
                </label>
                <input
                  id={`${baseId}-depth`}
                  type="number"
                  min="0.1"
                  max="60"
                  step="any"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={unitSystem === 'us' ? depthInches : depthCm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    if (unitSystem === 'us') setDepthInches(val);
                    else setDepthCm(val);
                  }}
                />
                <div className={styles.chipGroup}>
                  {unitSystem === 'us' ? (
                    <>
                      <button type="button" className={`${styles.chip} ${depthInches === 1 ? styles.chipActive : ''}`} onClick={() => setDepthInches(1)}>1″ (Paver Bed)</button>
                      <button type="button" className={`${styles.chip} ${depthInches === 2 ? styles.chipActive : ''}`} onClick={() => setDepthInches(2)}>2″ (Standard)</button>
                      <button type="button" className={`${styles.chip} ${depthInches === 3 ? styles.chipActive : ''}`} onClick={() => setDepthInches(3)}>3″</button>
                      <button type="button" className={`${styles.chip} ${depthInches === 4 ? styles.chipActive : ''}`} onClick={() => setDepthInches(4)}>4″</button>
                      <button type="button" className={`${styles.chip} ${depthInches === 6 ? styles.chipActive : ''}`} onClick={() => setDepthInches(6)}>6″ (Sandbox)</button>
                    </>
                  ) : (
                    <>
                      <button type="button" className={`${styles.chip} ${depthCm === 2.5 ? styles.chipActive : ''}`} onClick={() => setDepthCm(2.5)}>2.5 cm</button>
                      <button type="button" className={`${styles.chip} ${depthCm === 5 ? styles.chipActive : ''}`} onClick={() => setDepthCm(5)}>5 cm</button>
                      <button type="button" className={`${styles.chip} ${depthCm === 7.5 ? styles.chipActive : ''}`} onClick={() => setDepthCm(7.5)}>7.5 cm</button>
                      <button type="button" className={`${styles.chip} ${depthCm === 15 ? styles.chipActive : ''}`} onClick={() => setDepthCm(15)}>15 cm</button>
                    </>
                  )}
                </div>
              </div>

              {/* Sand condition & Density */}
              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-condition`}>Sand Condition</label>
                  <select
                    id={`${baseId}-condition`}
                    className={styles.selectField}
                    value={sandCondition}
                    onChange={(e) => setSandCondition(e.target.value as SandCondition)}
                  >
                    <option value="dry">Dry (~2,600 lb/yd³)</option>
                    <option value="damp">Damp (~2,900 lb/yd³)</option>
                    <option value="wet">Wet (~3,200 lb/yd³)</option>
                    <option value="custom">Custom Density</option>
                  </select>
                </div>

                {sandCondition === 'custom' && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-density`}>
                      Density ({unitSystem === 'us' ? 'lb/yd³' : 'kg/m³'})
                    </label>
                    <input
                      id={`${baseId}-density`}
                      type="number"
                      min="1000"
                      max="5000"
                      className={styles.inputField}
                      value={customDensityLb}
                      onChange={(e) => setCustomDensityLb(parseFloat(e.target.value) || 2600)}
                    />
                  </div>
                )}

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-waste`}>Waste & Settling (%)</label>
                  <input
                    id={`${baseId}-waste`}
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    className={styles.inputField}
                    value={wastePercent}
                    onChange={(e) => setWastePercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Bag Size options */}
              {unitSystem === 'us' && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-bag-size`}>Bag Weight / Size</label>
                  <select
                    id={`${baseId}-bag-size`}
                    className={styles.selectField}
                    value={bagSizeOption}
                    onChange={(e) =>
                      setBagSizeOption(
                        e.target.value as '40' | '50' | '60' | '80' | 'customLb' | 'customCuFt' | '25kg',
                      )
                    }
                  >
                    <option value="50">50 lb Bag (Most common retail)</option>
                    <option value="40">40 lb Bag</option>
                    <option value="60">60 lb Bag</option>
                    <option value="80">80 lb Bag</option>
                    <option value="customCuFt">Custom Volume (cu ft)</option>
                    <option value="customLb">Custom Weight (lb)</option>
                  </select>

                  {bagSizeOption === 'customCuFt' && (
                    <input
                      type="number"
                      step="0.05"
                      placeholder="Bag volume in cu ft (e.g. 0.5)"
                      className={styles.inputField}
                      value={customBagVolumeCuFt}
                      onChange={(e) => setCustomBagVolumeCuFt(parseFloat(e.target.value) || 0.5)}
                    />
                  )}
                  {bagSizeOption === 'customLb' && (
                    <input
                      type="number"
                      placeholder="Bag weight in lbs (e.g. 50)"
                      className={styles.inputField}
                      value={customBagWeightLb}
                      onChange={(e) => setCustomBagWeightLb(parseFloat(e.target.value) || 50)}
                    />
                  )}
                </div>
              )}
            </>
          )}

          {/* MODE 2: PAVER SAND (BEDDING) */}
          {mode === 'paver' && (
            <>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${baseId}-paver-area`}>
                  Total Paved Patio / Walkway Area ({unitSystem === 'us' ? 'sq ft' : 'm²'})
                </label>
                <input
                  id={`${baseId}-paver-area`}
                  type="number"
                  min="1"
                  step="any"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={unitSystem === 'us' ? paverAreaSqFt : paverAreaSqM}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    if (unitSystem === 'us') setPaverAreaSqFt(val);
                    else setPaverAreaSqM(val);
                  }}
                />
                <div className={styles.chipGroup}>
                  {unitSystem === 'us' ? (
                    <>
                      <button type="button" className={`${styles.chip} ${paverAreaSqFt === 100 ? styles.chipActive : ''}`} onClick={() => setPaverAreaSqFt(100)}>100 sq ft</button>
                      <button type="button" className={`${styles.chip} ${paverAreaSqFt === 200 ? styles.chipActive : ''}`} onClick={() => setPaverAreaSqFt(200)}>200 sq ft</button>
                      <button type="button" className={`${styles.chip} ${paverAreaSqFt === 300 ? styles.chipActive : ''}`} onClick={() => setPaverAreaSqFt(300)}>300 sq ft</button>
                      <button type="button" className={`${styles.chip} ${paverAreaSqFt === 500 ? styles.chipActive : ''}`} onClick={() => setPaverAreaSqFt(500)}>500 sq ft</button>
                    </>
                  ) : (
                    <>
                      <button type="button" className={`${styles.chip} ${paverAreaSqM === 10 ? styles.chipActive : ''}`} onClick={() => setPaverAreaSqM(10)}>10 m²</button>
                      <button type="button" className={`${styles.chip} ${paverAreaSqM === 20 ? styles.chipActive : ''}`} onClick={() => setPaverAreaSqM(20)}>20 m²</button>
                      <button type="button" className={`${styles.chip} ${paverAreaSqM === 30 ? styles.chipActive : ''}`} onClick={() => setPaverAreaSqM(30)}>30 m²</button>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-bedding-depth`}>
                    Bedding Depth ({unitSystem === 'us' ? 'inches' : 'cm'})
                  </label>
                  <input
                    id={`${baseId}-bedding-depth`}
                    type="number"
                    min="0.25"
                    max="6"
                    step="0.25"
                    inputMode="decimal"
                    className={styles.inputField}
                    value={unitSystem === 'us' ? beddingDepthInches : beddingDepthCm}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (unitSystem === 'us') setBeddingDepthInches(val);
                      else setBeddingDepthCm(val);
                    }}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-paver-cond`}>Sand Condition</label>
                  <select
                    id={`${baseId}-paver-cond`}
                    className={styles.selectField}
                    value={paverSandCondition}
                    onChange={(e) => setPaverSandCondition(e.target.value as SandCondition)}
                  >
                    <option value="dry">Dry (~2,600 lb/yd³)</option>
                    <option value="damp">Damp (~2,900 lb/yd³)</option>
                    <option value="wet">Wet (~3,200 lb/yd³)</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-paver-waste`}>Waste (%)</label>
                  <input
                    id={`${baseId}-paver-waste`}
                    type="number"
                    min="0"
                    max="50"
                    className={styles.inputField}
                    value={paverWastePercent}
                    onChange={(e) => setPaverWastePercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </>
          )}

          {/* MODE 3: POLYMERIC SAND (JOINTS) */}
          {mode === 'polymeric' && (
            <>
              <div className={styles.fieldGroup}>
                <label htmlFor={`${baseId}-poly-area`}>
                  Total Paved Patio / Walkway Area ({unitSystem === 'us' ? 'sq ft' : 'm²'})
                </label>
                <input
                  id={`${baseId}-poly-area`}
                  type="number"
                  min="1"
                  step="any"
                  inputMode="decimal"
                  className={styles.inputField}
                  value={unitSystem === 'us' ? polyAreaSqFt : polyAreaSqM}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    if (unitSystem === 'us') setPolyAreaSqFt(val);
                    else setPolyAreaSqM(val);
                  }}
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-paver-l`}>
                    Paver Length ({unitSystem === 'us' ? 'in' : 'cm'})
                  </label>
                  <input
                    id={`${baseId}-paver-l`}
                    type="number"
                    min="1"
                    step="any"
                    className={styles.inputField}
                    value={paverLengthInches}
                    onChange={(e) => setPaverLengthInches(parseFloat(e.target.value) || 6)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-paver-w`}>
                    Paver Width ({unitSystem === 'us' ? 'in' : 'cm'})
                  </label>
                  <input
                    id={`${baseId}-paver-w`}
                    type="number"
                    min="1"
                    step="any"
                    className={styles.inputField}
                    value={paverWidthInches}
                    onChange={(e) => setPaverWidthInches(parseFloat(e.target.value) || 9)}
                  />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-joint-w`}>
                    Joint Width ({unitSystem === 'us' ? 'inches' : 'mm'})
                  </label>
                  <select
                    id={`${baseId}-joint-w`}
                    className={styles.selectField}
                    value={jointWidthInches}
                    onChange={(e) => setJointWidthInches(parseFloat(e.target.value) || 0.25)}
                  >
                    <option value="0.125">1/8″ (0.125 in / ~3 mm)</option>
                    <option value="0.25">1/4″ (0.25 in / ~6 mm) - Typical</option>
                    <option value="0.375">3/8″ (0.375 in / ~10 mm)</option>
                    <option value="0.5">1/2″ (0.50 in / ~13 mm)</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-joint-d`}>
                    Joint Depth ({unitSystem === 'us' ? 'inches' : 'cm'})
                  </label>
                  <input
                    id={`${baseId}-joint-d`}
                    type="number"
                    min="0.5"
                    max="6"
                    step="any"
                    className={styles.inputField}
                    value={jointDepthInches}
                    onChange={(e) => setJointDepthInches(parseFloat(e.target.value) || 2)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-poly-waste`}>Waste (%)</label>
                  <input
                    id={`${baseId}-poly-waste`}
                    type="number"
                    min="0"
                    max="50"
                    className={styles.inputField}
                    value={polyWastePercent}
                    onChange={(e) => setPolyWastePercent(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`${baseId}-cov-bag`}>
                  Optional: Product Bag Coverage (sq ft per 50 lb bag)
                </label>
                <input
                  id={`${baseId}-cov-bag`}
                  type="number"
                  placeholder="e.g. 50 (from manufacturer package)"
                  className={styles.inputField}
                  value={bagCoverageSqFt ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setBagCoverageSqFt(isNaN(val) ? undefined : val);
                  }}
                />
              </div>
            </>
          )}

          <div className={styles.inlineNotice}>
            💡 <strong>Pro Tip:</strong> Sand compacts during installation and spillage is natural. A 5–10% waste buffer ensures you won’t halt your project mid-way.
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className={styles.resultCol} aria-live="polite">
          {/* Main Hero Card */}
          <div className={styles.primaryResultCard}>
            <div className={styles.resultTitle}>
              {mode === 'polymeric' ? 'Required Joint Sand' : 'Total Sand Required'}
            </div>

            {mode === 'volume' && (
              <>
                <div className={styles.resultHero}>
                  {unitSystem === 'metric'
                    ? `${volumeResult.volumeM3WithWaste.toFixed(2)} m³`
                    : `${volumeResult.volumeCuYdWithWaste.toFixed(2)} yd³`}
                </div>
                <div className={styles.resultSubHero}>
                  {unitSystem === 'metric'
                    ? `${volumeResult.weightTonnesWithWaste.toFixed(2)} Tonnes (${volumeResult.weightKgWithWaste.toFixed(0)} kg)`
                    : `${volumeResult.volumeCuFtWithWaste.toFixed(2)} ft³ · ${volumeResult.weightTonsWithWaste.toFixed(2)} Tons`}
                </div>
              </>
            )}

            {mode === 'paver' && (
              <>
                <div className={styles.resultHero}>
                  {unitSystem === 'metric'
                    ? `${paverResult.volumeM3WithWaste.toFixed(2)} m³`
                    : `${paverResult.volumeCuYdWithWaste.toFixed(2)} yd³`}
                </div>
                <div className={styles.resultSubHero}>
                  {unitSystem === 'metric'
                    ? `${paverResult.weightTonnesWithWaste.toFixed(2)} Tonnes (${paverResult.weightKgWithWaste.toFixed(0)} kg)`
                    : `${paverResult.volumeCuFtWithWaste.toFixed(2)} ft³ · ${paverResult.weightTonsWithWaste.toFixed(2)} Tons`}
                </div>
              </>
            )}

            {mode === 'polymeric' && (
              <>
                <div className={styles.resultHero}>
                  {polymericResult.totalBags} Bags (50 lb)
                </div>
                <div className={styles.resultSubHero}>
                  {polymericResult.jointVolumeCuFtWithWaste.toFixed(2)} ft³ ({polymericResult.jointVolumeCuYdWithWaste.toFixed(2)} yd³) · ≈ {polymericResult.jointWeightLbWithWaste.toFixed(0)} lb
                </div>
              </>
            )}
          </div>

          {/* Breakdown Metric Cards */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <div className={styles.metricVal}>
                {mode === 'volume' && `${volumeResult.totalBags} bags`}
                {mode === 'paver' && `${paverResult.totalBags} bags`}
                {mode === 'polymeric' && `${polymericResult.totalBags} bags`}
              </div>
              <div className={styles.metricLbl}>
                {mode === 'volume' ? `${volumeResult.bagWeightOrVolLabel} Bags` : '50 lb Bags'}
              </div>
            </div>

            <div className={styles.metricItem}>
              <div className={styles.metricVal}>
                {mode === 'volume' && `${volumeResult.weightTonsWithWaste.toFixed(2)} Tons`}
                {mode === 'paver' && `${paverResult.weightTonsWithWaste.toFixed(2)} Tons`}
                {mode === 'polymeric' && `${(polymericResult.jointWeightLbWithWaste / 2000).toFixed(2)} Tons`}
              </div>
              <div className={styles.metricLbl}>Total Weight (Tons)</div>
            </div>

            <div className={styles.metricItem}>
              <div className={styles.metricVal}>
                {mode === 'volume' && `${volumeResult.volumeCuFtWithWaste.toFixed(1)} ft³`}
                {mode === 'paver' && `${paverResult.volumeCuFtWithWaste.toFixed(1)} ft³`}
                {mode === 'polymeric' && `${polymericResult.jointVolumeCuFtWithWaste.toFixed(1)} ft³`}
              </div>
              <div className={styles.metricLbl}>Cubic Feet (ft³)</div>
            </div>

            <div className={styles.metricItem}>
              <div className={styles.metricVal}>
                {mode === 'volume' && `${wastePercent}%`}
                {mode === 'paver' && `${paverWastePercent}%`}
                {mode === 'polymeric' && `${polyWastePercent}%`}
              </div>
              <div className={styles.metricLbl}>Waste Buffer Included</div>
            </div>
          </div>

          {/* Action Row */}
          <div className={styles.actionRow}>
            <button type="button" className={styles.actionBtn} onClick={handleCopy}>
              📋 {copyStatus}
            </button>
            <button type="button" className={styles.actionBtn} onClick={handlePrint}>
              🖨️ Print
            </button>
          </div>

          {/* Show Math Accordion */}
          <button
            type="button"
            className={styles.mathToggle}
            onClick={() => setShowMath(!showMath)}
            aria-expanded={showMath}
          >
            {showMath ? '▲ Hide Step-by-Step Math' : '▼ Show Step-by-Step Math'}
          </button>

          {showMath && (
            <div className={styles.mathDrawer}>
              {(mode === 'volume' ? volumeResult.mathSteps : mode === 'paver' ? paverResult.mathSteps : polymericResult.mathSteps).map((st, i) => (
                <div key={i} className={styles.mathRow}>
                  <span className={styles.mathStepName}>{st.step}</span>
                  <span className={styles.mathFormula}>{st.formula}</span>
                  <span className={styles.mathResult}>= {st.result}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

