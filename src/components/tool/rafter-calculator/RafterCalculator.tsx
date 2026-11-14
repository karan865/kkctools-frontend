'use client';

import React, { useState, useId } from 'react';
import styles from './RafterCalculator.module.css';
import {
  RoofType,
  PitchMode,
  calcRafter,
  formatFtIn,
} from '@/lib/rafter-engine';

export default function RafterCalculator() {
  const baseId = useId();

  // Unit mode: US (feet/inches) vs Metric (m/mm)
  const [unitMode, setUnitMode] = useState<'us' | 'metric'>('us');

  // Core Inputs
  const [roofType, setRoofType] = useState<RoofType>('gable');
  // Span in feet & inches (US) or meters (Metric)
  const [spanFt, setSpanFt] = useState<number>(24);
  const [spanIn, setSpanIn] = useState<number>(0);
  const [spanM, setSpanM] = useState<number>(7.315);

  const [pitchMode, setPitchMode] = useState<PitchMode>('pitch');
  const [pitch, setPitch] = useState<number>(6); // rise per 12
  const [angleDeg, setAngleDeg] = useState<number>(26.57);
  const [totalRiseIn, setTotalRiseIn] = useState<number>(72);

  const [overhangIn, setOverhangIn] = useState<number>(12);

  // Advanced Options
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [ridgeThickness, setRidgeThickness] = useState<number>(1.5);
  const [rafterDepth, setRafterDepth] = useState<number>(7.25); // 2x8
  const [plateWidth, setPlateWidth] = useState<number>(3.5); // 2x4 wall
  const [spacingIn, setSpacingIn] = useState<number>(16);
  const [buildingLengthFt, setBuildingLengthFt] = useState<number>(30);

  const [copyStatus, setCopyStatus] = useState<string>('Copy Results');

  // Convert inputs to total inches internally
  const totalSpanInches =
    unitMode === 'metric' ? spanM * 39.3700787 : spanFt * 12 + (spanIn || 0);
  const totalBuildingLengthInches = buildingLengthFt * 12;

  // Run calculation
  const res = calcRafter({
    roofType,
    span: totalSpanInches,
    pitchMode,
    pitch,
    angleDeg,
    totalRise: totalRiseIn,
    overhang: overhangIn,
    ridgeThickness,
    rafterDepth,
    plateWidth,
    spacing: spacingIn,
    buildingLength: totalBuildingLengthInches,
  });

  const handleReset = () => {
    setRoofType('gable');
    setSpanFt(24);
    setSpanIn(0);
    setSpanM(7.315);
    setPitchMode('pitch');
    setPitch(6);
    setAngleDeg(26.57);
    setTotalRiseIn(72);
    setOverhangIn(12);
    setRidgeThickness(1.5);
    setRafterDepth(7.25);
    setPlateWidth(3.5);
    setSpacingIn(16);
    setBuildingLengthFt(30);
  };

  const handleCopy = () => {
    if (!res.ok) return;
    const text = `Rafter Calculation Summary:
- Roof Type: ${roofType === 'gable' ? 'Gable Roof' : 'Shed Roof'}
- Building Span: ${spanFt} ft ${spanIn} in (${(totalSpanInches / 12).toFixed(2)} ft)
- Roof Pitch: ${res.pitchPer12.toFixed(2)}/12 (${res.angleDeg.toFixed(2)}°)
- Rafter Length (top edge): ${formatFtIn(res.totalLen)} (${res.totalLen.toFixed(2)} in)
- Stock Board to Buy: ${res.buyLen ? `${res.buyLen / 12} ft board` : 'Longer than 20 ft stock'}
- Total Rise (plate to ridge): ${formatFtIn(res.totalRise)} (${res.totalRise.toFixed(2)} in)
- Run: ${formatFtIn(res.run)} (${res.run.toFixed(2)} in)
- Plumb Cut Angle: ${res.plumbCutAngle.toFixed(2)}°
- Level (Seat) Cut Angle: ${res.levelCutAngle.toFixed(2)}°
- Birdsmouth Seat Cut: ${res.seatCut} in, Heel Cut Depth: ${res.heelDepth.toFixed(2)} in (${(res.heelRatio * 100).toFixed(0)}% rafter depth)
${res.rafterCount ? `- Rafters Needed: ${res.rafterCount.total} pcs (${res.rafterCount.perSide} per side)` : ''}
Calculated at kkctools.com/rafter-calculator/`;

    navigator.clipboard.writeText(text);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Results'), 2000);
  };

  return (
    <div className={styles.calculatorContainer} aria-label="Rafter Calculator Form">
      <div className={styles.topBar}>
        <span className={styles.topTitle}>Rafter Length Calculator</span>
        <div className={styles.unitToggle}>
          <button
            type="button"
            className={`${styles.unitBtn} ${unitMode === 'us' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnitMode('us')}
          >
            Feet &amp; Inches
          </button>
          <button
            type="button"
            className={`${styles.unitBtn} ${unitMode === 'metric' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnitMode('metric')}
          >
            Metric (m)
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* INPUTS COLUMN */}
        <div className={styles.formCol}>
          {/* Roof Type */}
          <div className={styles.fieldGroup}>
            <label>Roof Type</label>
            <div className={styles.segmentedControl} role="group">
              <button aria-pressed={roofType === 'gable'}
                type="button"
                className={`${styles.segmentBtn} ${roofType === 'gable' ? styles.segmentBtnActive : ''}`}
                onClick={() => setRoofType('gable')}
              >
                Gable roof
              </button>
              <button aria-pressed={roofType === 'shed'}
                type="button"
                className={`${styles.segmentBtn} ${roofType === 'shed' ? styles.segmentBtnActive : ''}`}
                onClick={() => setRoofType('shed')}
              >
                Shed roof
              </button>
            </div>
          </div>

          {/* Building Span */}
          <div className={styles.fieldGroup}>
            <label htmlFor={`${baseId}-span`}>Building Span</label>
            <span className={styles.helperText}>
              Outside of wall to outside of wall. For a shed roof, enter the horizontal distance the rafter covers.
            </span>
            {unitMode === 'us' ? (
              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <input
                    id={`${baseId}-span-ft`}
                    type="number"
                    min="1"
                    placeholder="Feet"
                    className={styles.inputField}
                    value={spanFt || ''}
                    onChange={(e) => setSpanFt(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <input
                    id={`${baseId}-span-in`}
                    type="number"
                    min="0"
                    max="11.99"
                    step="any"
                    placeholder="Inches"
                    className={styles.inputField}
                    value={spanIn || ''}
                    onChange={(e) => setSpanIn(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            ) : (
              <input
                id={`${baseId}-span-m`}
                type="number"
                min="0.1"
                step="0.01"
                placeholder="Meters (e.g. 7.3)"
                className={styles.inputField}
                value={spanM || ''}
                onChange={(e) => setSpanM(parseFloat(e.target.value) || 0)}
              />
            )}
          </div>

          {/* Slope Input Mode */}
          <div className={styles.fieldGroup}>
            <label>Slope Input Mode</label>
            <div className={styles.segmentedControl} role="group">
              <button aria-pressed={pitchMode === 'pitch'}
                type="button"
                className={`${styles.segmentBtn} ${pitchMode === 'pitch' ? styles.segmentBtnActive : ''}`}
                onClick={() => setPitchMode('pitch')}
              >
                Pitch (rise/12)
              </button>
              <button aria-pressed={pitchMode === 'angle'}
                type="button"
                className={`${styles.segmentBtn} ${pitchMode === 'angle' ? styles.segmentBtnActive : ''}`}
                onClick={() => setPitchMode('angle')}
              >
                Angle (°)
              </button>
              <button aria-pressed={pitchMode === 'riseRun'}
                type="button"
                className={`${styles.segmentBtn} ${pitchMode === 'riseRun' ? styles.segmentBtnActive : ''}`}
                onClick={() => setPitchMode('riseRun')}
              >
                Rise &amp; Run
              </button>
            </div>
          </div>

          {/* Dynamic Slope Value Input */}
          {pitchMode === 'pitch' && (
            <div className={styles.fieldGroup}>
              <label htmlFor={`${baseId}-pitch`}>Roof Pitch (Rise / 12)</label>
              <span className={styles.helperText}>
                Inches of rise per 12 inches of run. Example: 6 = 6/12.
              </span>
              <input
                id={`${baseId}-pitch`}
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                className={styles.inputField}
                value={pitch || ''}
                onChange={(e) => setPitch(parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          {pitchMode === 'angle' && (
            <div className={styles.fieldGroup}>
              <label htmlFor={`${baseId}-angle`}>Roof Angle (°)</label>
              <input
                id={`${baseId}-angle`}
                type="number"
                min="0.5"
                max="79.9"
                step="0.1"
                className={styles.inputField}
                value={angleDeg || ''}
                onChange={(e) => setAngleDeg(parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          {pitchMode === 'riseRun' && (
            <div className={styles.fieldGroup}>
              <label htmlFor={`${baseId}-rise`}>Total Rise (Inches)</label>
              <span className={styles.helperText}>
                Height from the top of the wall plate to the ridge line.
              </span>
              <input
                id={`${baseId}-rise`}
                type="number"
                min="1"
                step="any"
                className={styles.inputField}
                value={totalRiseIn || ''}
                onChange={(e) => setTotalRiseIn(parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          {/* Overhang */}
          <div className={styles.fieldGroup}>
            <label htmlFor={`${baseId}-overhang`}>Overhang (Horizontal Inches)</label>
            <span className={styles.helperText}>
              How far the roof extends past the wall, measured horizontally.
            </span>
            <input
              id={`${baseId}-overhang`}
              type="number"
              min="0"
              step="any"
              className={styles.inputField}
              value={overhangIn || ''}
              onChange={(e) => setOverhangIn(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Advanced More Options Accordion */}
          <button
            type="button"
            className={styles.moreOptionsBtn}
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            aria-expanded={showMoreOptions}
          >
            {showMoreOptions ? '▲ Less options' : '▼ More options (Rafter Size, Spacing & Cut Details)'}
          </button>

          {showMoreOptions && (
            <div className={styles.moreOptionsCard}>
              {roofType === 'gable' && (
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-ridge-thick`}>Ridge Board Thickness</label>
                  <span className={styles.helperText}>
                    Gable roofs only. 1½ in (1.5″) for a standard 2x ridge board.
                  </span>
                  <input
                    id={`${baseId}-ridge-thick`}
                    type="number"
                    min="0"
                    step="0.25"
                    className={styles.inputField}
                    value={ridgeThickness}
                    onChange={(e) => setRidgeThickness(parseFloat(e.target.value) || 0)}
                  />
                </div>
              )}

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-rafter-depth`}>Rafter Lumber Size</label>
                  <select
                    id={`${baseId}-rafter-depth`}
                    className={styles.selectField}
                    value={rafterDepth}
                    onChange={(e) => setRafterDepth(parseFloat(e.target.value))}
                  >
                    <option value={5.5}>2x6 (5½ in actual)</option>
                    <option value={7.25}>2x8 (7¼ in actual)</option>
                    <option value={9.25}>2x10 (9¼ in actual)</option>
                    <option value={11.25}>2x12 (11¼ in actual)</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-plate-width`}>Wall Plate Thickness</label>
                  <select
                    id={`${baseId}-plate-width`}
                    className={styles.selectField}
                    value={plateWidth}
                    onChange={(e) => setPlateWidth(parseFloat(e.target.value))}
                  >
                    <option value={3.5}>2x4 wall (3½ in)</option>
                    <option value={5.5}>2x6 wall (5½ in)</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-spacing`}>Rafter Spacing (on-center)</label>
                  <select
                    id={`${baseId}-spacing`}
                    className={styles.selectField}
                    value={spacingIn}
                    onChange={(e) => setSpacingIn(parseFloat(e.target.value))}
                  >
                    <option value={12}>12 in o.c.</option>
                    <option value={16}>16 in o.c. (Standard)</option>
                    <option value={19.2}>19.2 in o.c.</option>
                    <option value={24}>24 in o.c.</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-bldg-len`}>Building Length (ft)</label>
                  <input
                    id={`${baseId}-bldg-len`}
                    type="number"
                    min="1"
                    placeholder="e.g. 30"
                    className={styles.inputField}
                    value={buildingLengthFt || ''}
                    onChange={(e) => setBuildingLengthFt(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Validation Errors & Warnings */}
          {res.errors.length > 0 && (
            <div className={styles.errorAlert} role="alert">
              {res.errors.map((err, i) => (
                <div key={i}>⚠️ {err}</div>
              ))}
            </div>
          )}

          {res.warnings.length > 0 && (
            <div className={styles.warningAlert} role="status">
              {res.warnings.map((warn, i) => (
                <div key={i}>
                  <strong>Check:</strong> {warn}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RESULTS COLUMN */}
        <div className={styles.resultCol} aria-live="polite">
          {res.ok ? (
            <>
              {/* Primary Output Hero */}
              <div className={styles.primaryResultCard}>
                <div className={styles.resultTitle}>Rafter Length (Along Top Edge)</div>
                <div className={styles.resultHero}>{formatFtIn(res.totalLen)}</div>
                <div className={styles.resultSubHero}>
                  {res.totalLen.toFixed(2)} inches · {(res.totalLen / 12).toFixed(2)} feet (
                  {(res.totalLen * 0.0254).toFixed(3)} m)
                </div>
                {res.buyLen && (
                  <div className={styles.buyBadge}>
                    🌲 Board to Buy: <strong>{res.buyLen / 12} ft board</strong> (min {formatFtIn(res.longPoint)} long-point)
                  </div>
                )}
              </div>

              {/* Grid Metrics */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>{res.pitchPer12.toFixed(2)}/12</div>
                  <div className={styles.metricLbl}>Roof Pitch ({res.angleDeg.toFixed(1)}°)</div>
                </div>

                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>{formatFtIn(res.totalRise)}</div>
                  <div className={styles.metricLbl}>Total Rise ({res.totalRise.toFixed(1)}″)</div>
                </div>

                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>{res.plumbCutAngle.toFixed(1)}°</div>
                  <div className={styles.metricLbl}>Plumb Cut Angle</div>
                </div>

                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>{res.levelCutAngle.toFixed(1)}°</div>
                  <div className={styles.metricLbl}>Level (Seat) Angle</div>
                </div>

                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>{formatFtIn(res.run)}</div>
                  <div className={styles.metricLbl}>Total Run ({res.run.toFixed(1)}″)</div>
                </div>

                <div className={styles.metricItem}>
                  <div className={styles.metricVal}>
                    {res.heelDepth.toFixed(2)}″ ({Math.round(res.heelRatio * 100)}%)
                  </div>
                  <div className={styles.metricLbl}>Birdsmouth Heel Depth</div>
                </div>
              </div>

              {/* Rafter Count Badge if Available */}
              {res.rafterCount && (
                <div className={styles.primaryResultCard} style={{ padding: '12px' }}>
                  <div className={styles.resultTitle}>Estimated Rafter Count</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)' }}>
                    {res.rafterCount.total} Rafters ({res.rafterCount.perSide} per side)
                  </div>
                  <div className={styles.helperText} style={{ marginTop: '4px' }}>
                    Based on {buildingLengthFt} ft length @ {spacingIn}″ o.c. (Order extras for gable end fly rafters).
                  </div>
                </div>
              )}

              {/* Live SVG Roof Diagram */}
              <div className={styles.diagramBox}>
                <span className={styles.resultTitle}>Gable Roof Cross-Section</span>
                <svg
                  className={styles.diagramSvg}
                  viewBox="0 0 320 180"
                  role="img"
                  aria-label="Roof rafter calculator diagram showing span, run, rise, overhang and rafter length"
                >
                  {/* Ground/Ceiling tie base line */}
                  <line x1="40" y1="130" x2="280" y2="130" stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="4 2" />
                  {/* Left and Right Wall Plates */}
                  <rect x="50" y="130" width="16" height="24" fill="var(--surface-2)" stroke="var(--ink)" strokeWidth="1.5" />
                  <rect x="254" y="130" width="16" height="24" fill="var(--surface-2)" stroke="var(--ink)" strokeWidth="1.5" />
                  {/* Left Rafter */}
                  <line x1="30" y1="140" x2="160" y2="40" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
                  {/* Right Rafter */}
                  <line x1="290" y1="140" x2="160" y2="40" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
                  {/* Ridge Board */}
                  <rect x="156" y="32" width="8" height="20" fill="var(--highlight)" stroke="var(--ink)" strokeWidth="1" />
                  {/* Rise line */}
                  <line x1="160" y1="52" x2="160" y2="130" stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="3 3" />
                  {/* Labels */}
                  <text x="160" y="95" fill="var(--danger)" fontSize="10" textAnchor="end" fontWeight="bold">Rise: {formatFtIn(res.totalRise)}</text>
                  <text x="100" y="75" fill="var(--accent)" fontSize="10" fontWeight="bold">Rafter: {formatFtIn(res.totalLen)}</text>
                  <text x="160" y="152" fill="var(--ink)" fontSize="10" textAnchor="middle" fontWeight="bold">Span: {spanFt} ft {spanIn} in</text>
                </svg>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionRow}>
                <button type="button" className={styles.actionBtn} onClick={handleCopy}>
                  📋 {copyStatus}
                </button>
                <button type="button" className={styles.actionBtn} onClick={() => window.print()}>
                  🖨️ Print Cut List
                </button>
                <button type="button" className={styles.actionBtn} onClick={handleReset}>
                  ↺ Reset
                </button>
              </div>
            </>
          ) : (
            <div className={styles.primaryResultCard}>
              <div className={styles.resultTitle}>Calculation Paused</div>
              <div className={styles.resultHero} style={{ fontSize: '1.4rem' }}>
                Fix input errors
              </div>
              <div className={styles.helperText}>
                Please check the error messages on the left to recalculate.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

