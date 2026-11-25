'use client';

import React, { useState, useEffect, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import GallonsInputGuide from './GallonsInputGuide';
import styles from './GallonsConverter.module.css';
import {
  VolumeUnit,
  LengthUnit,
  volumeToLitres,
  litresToVolume,
  calculateBoxVolume,
  calculateCylinderVolume,
  US_GAL_PER_FT3,
  FT3_PER_US_GAL,
} from '@/lib/volume-units-engine';

type TabType = 'convert' | 'dimensions' | 'table';

const TABS: TabItem<TabType>[] = [
  { id: 'convert', label: '1. Convert Units' },
  { id: 'dimensions', label: '2. From Dimensions' },
  { id: 'table', label: '3. Conversion Table' },
];

interface PresetItem {
  name: string;
  unit: VolumeUnit;
  val: number;
}

const PRESETS: PresetItem[] = [
  { name: '100 US Gal (Spec)', unit: 'us_gal', val: 100 },
  { name: '1 ft³ (7.48 gal)', unit: 'ft3', val: 1 },
  { name: '5 Gal Bucket', unit: 'us_gal', val: 5 },
  { name: '55 Gal Drum', unit: 'us_gal', val: 55 },
  { name: '1 US Gal', unit: 'us_gal', val: 1 },
  { name: '1 m³ (264.2 gal)', unit: 'm3', val: 1 },
];

export default function GallonsConverter() {
  const id = useId();
  const [tab, setTab] = useState<TabType>('convert');
  const [copied, setCopied] = useState(false);

  // Tab 1 state: canonical litres
  const [litres, setLitres] = useState<number>(volumeToLitres(100, 'us_gal')); // default 100 US gal
  const [lastEditedUnit, setLastEditedUnit] = useState<VolumeUnit>('us_gal');
  const [showWaterWeight, setShowWaterWeight] = useState<boolean>(false);

  // Tab 2 state: container dimensions
  const [shape, setShape] = useState<'box' | 'cylinder'>('box');
  const [boxLength, setBoxLength] = useState<number>(4);
  const [boxWidth, setBoxWidth] = useState<number>(2);
  const [boxHeight, setBoxHeight] = useState<number>(2);
  const [boxUnit, setBoxUnit] = useState<LengthUnit>('ft');

  const [cylDiameter, setCylDiameter] = useState<number>(3);
  const [cylHeight, setCylHeight] = useState<number>(2);
  const [cylUnit, setCylUnit] = useState<LengthUnit>('ft');

  // Tab 3 state: conversion table
  const [tableMax, setTableMax] = useState<number>(50);
  const [tableStep, setTableStep] = useState<number>(1);

  // Sync tab from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab') as TabType;
        if (urlTab && TABS.some((t) => t.id === urlTab)) {
          setTab(urlTab);
        }
      };
      const timer = setTimeout(syncFromUrl, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Convert Tab live values
  const usGal = litresToVolume(litres, 'us_gal');
  const ft3 = litresToVolume(litres, 'ft3');
  const m3 = litresToVolume(litres, 'm3');
  const l = litres;
  const impGal = litresToVolume(litres, 'imp_gal');

  const handleUnitInput = (valStr: string, unit: VolumeUnit) => {
    const val = parseFloat(valStr);
    setLastEditedUnit(unit);
    if (!isNaN(val) && val >= 0) {
      setLitres(volumeToLitres(val, unit));
    } else {
      setLitres(0);
    }
  };

  // Tab 2 dimensions calculation
  const dimGal =
    shape === 'box'
      ? calculateBoxVolume(boxLength, boxWidth, boxHeight, boxUnit, 'us_gal')
      : calculateCylinderVolume(cylDiameter, cylHeight, cylUnit, 'us_gal');
  const dimFt3 =
    shape === 'box'
      ? calculateBoxVolume(boxLength, boxWidth, boxHeight, boxUnit, 'ft3')
      : calculateCylinderVolume(cylDiameter, cylHeight, cylUnit, 'ft3');
  const dimLitres =
    shape === 'box'
      ? calculateBoxVolume(boxLength, boxWidth, boxHeight, boxUnit, 'litres')
      : calculateCylinderVolume(cylDiameter, cylHeight, cylUnit, 'litres');
  const dimM3 =
    shape === 'box'
      ? calculateBoxVolume(boxLength, boxWidth, boxHeight, boxUnit, 'm3')
      : calculateCylinderVolume(cylDiameter, cylHeight, cylUnit, 'm3');

  // Copy Summary
  const handleCopySummary = () => {
    const text = `Gallons ↔ Cubic Feet Conversion:
${usGal.toFixed(4)} US Gallons = ${ft3.toFixed(4)} Cubic Feet
= ${m3.toFixed(4)} Cubic Metres
= ${l.toFixed(2)} Litres
= ${impGal.toFixed(4)} Imperial Gallons
NIST Factors: 1 ft³ = ${US_GAL_PER_FT3.toFixed(5)} US gal | 1 US gal = ${FT3_PER_US_GAL.toFixed(6)} ft³
Source: KKC Tools (https://kkctools.com/gallons-to-cubic-feet/)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate Table Rows
  const tableRows: Array<{ gal: number; ft3: number; litres: number; m3: number }> = [];
  for (let g = 1; g <= tableMax; g += tableStep) {
    const rowLitres = volumeToLitres(g, 'us_gal');
    tableRows.push({
      gal: g,
      ft3: litresToVolume(rowLitres, 'ft3'),
      litres: rowLitres,
      m3: litresToVolume(rowLitres, 'm3'),
    });
  }

  const handleCopyCsv = () => {
    const header = 'US Gallons,Cubic Feet,Litres,Cubic Metres\n';
    const body = tableRows
      .map((r) => `${r.gal},${r.ft3.toFixed(4)},${r.litres.toFixed(2)},${r.m3.toFixed(4)}`)
      .join('\n');
    navigator.clipboard.writeText(header + body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={tab} onChange={handleTabChange} ariaLabel="Gallons converter modes" />

      <GallonsInputGuide tab={tab} />

      {/* Preset pills for quick conversions */}
      {tab === 'convert' && (
        <div className={styles.presetBar}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Quick Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              className={styles.presetBtn}
              onClick={() => {
                setLastEditedUnit(p.unit);
                setLitres(volumeToLitres(p.val, p.unit));
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* TAB 1: CONVERT UNITS */}
      {tab === 'convert' && (
        <>
          <div className={styles.unitsGrid}>
            {/* US Gallons */}
            <div className={styles.unitCard}>
              <div className={styles.unitHeader}>
                <label className={styles.unitLabel} htmlFor={`${id}-us-gal`}>
                  US Gallons (Liquid)
                </label>
                <span className={styles.unitSymbol}>US gal</span>
              </div>
              <input
                id={`${id}-us-gal`}
                type="number"
                min="0"
                step="any"
                className={styles.unitInput}
                value={Number(usGal.toFixed(4))}
                onChange={(e) => handleUnitInput(e.target.value, 'us_gal')}
              />
              <span className={styles.unitSub}>1 gal = 231 cubic inches</span>
            </div>

            {/* Cubic Feet */}
            <div className={styles.unitCard}>
              <div className={styles.unitHeader}>
                <label className={styles.unitLabel} htmlFor={`${id}-ft3`}>
                  Cubic Feet
                </label>
                <span className={styles.unitSymbol}>ft³</span>
              </div>
              <input
                id={`${id}-ft3`}
                type="number"
                min="0"
                step="any"
                className={styles.unitInput}
                value={Number(ft3.toFixed(4))}
                onChange={(e) => handleUnitInput(e.target.value, 'ft3')}
              />
              <span className={styles.unitSub}>1 ft³ = 1,728 cubic inches</span>
            </div>

            {/* Cubic Metres */}
            <div className={styles.unitCard}>
              <div className={styles.unitHeader}>
                <label className={styles.unitLabel} htmlFor={`${id}-m3`}>
                  Cubic Metres
                </label>
                <span className={styles.unitSymbol}>m³</span>
              </div>
              <input
                id={`${id}-m3`}
                type="number"
                min="0"
                step="any"
                className={styles.unitInput}
                value={Number(m3.toFixed(4))}
                onChange={(e) => handleUnitInput(e.target.value, 'm3')}
              />
              <span className={styles.unitSub}>1 m³ = 1,000 litres</span>
            </div>

            {/* Litres */}
            <div className={styles.unitCard}>
              <div className={styles.unitHeader}>
                <label className={styles.unitLabel} htmlFor={`${id}-litres`}>
                  Litres
                </label>
                <span className={styles.unitSymbol}>L</span>
              </div>
              <input
                id={`${id}-litres`}
                type="number"
                min="0"
                step="any"
                className={styles.unitInput}
                value={Number(l.toFixed(2))}
                onChange={(e) => handleUnitInput(e.target.value, 'litres')}
              />
              <span className={styles.unitSub}>1 L = 0.264172 US gal</span>
            </div>

            {/* Imperial Gallons */}
            <div className={styles.unitCard}>
              <div className={styles.unitHeader}>
                <label className={styles.unitLabel} htmlFor={`${id}-imp-gal`}>
                  Imperial Gallons (UK)
                </label>
                <span className={styles.unitSymbol}>imp gal</span>
              </div>
              <input
                id={`${id}-imp-gal`}
                type="number"
                min="0"
                step="any"
                className={styles.unitInput}
                value={Number(impGal.toFixed(4))}
                onChange={(e) => handleUnitInput(e.target.value, 'imp_gal')}
              />
              <span className={styles.unitSub}>1 imp gal = 4.54609 L</span>
            </div>
          </div>

          <div className={styles.resultsBand}>
            {/* User's Required Dark Hero Result Card */}
            <div className={styles.heroResult}>
              <div className={styles.heroLabel}>
                {lastEditedUnit === 'us_gal' ? 'EQUIVALENT CUBIC FEET' : 'EQUIVALENT US GALLONS'}
              </div>
              <div className={styles.heroValue}>
                {lastEditedUnit === 'us_gal' ? `${ft3.toFixed(4)} ft³` : `${usGal.toFixed(2)} gal`}
              </div>
              <div className={styles.heroSub}>
                <span>{l.toFixed(1)} Litres</span>
                <span>·</span>
                <span>{m3.toFixed(4)} m³</span>
                <span>·</span>
                <span>{impGal.toFixed(2)} Imp gal</span>
              </div>
            </div>

            {/* Explanatory sentence */}
            <div className={styles.sentence}>
              <strong>Exact Conversion:</strong> {usGal.toFixed(2)} US gallons is equivalent to{' '}
              <strong>{ft3.toFixed(4)} cubic feet</strong> (or {m3.toFixed(4)} m³, {l.toFixed(1)} litres).
              Based on the exact NIST definition: 1 ft³ = 1,728 in³ and 1 US gal = 231 in³.
            </div>

            {/* Water weight toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <input
                id={`${id}-water-wt`}
                type="checkbox"
                checked={showWaterWeight}
                onChange={(e) => setShowWaterWeight(e.target.checked)}
              />
              <label htmlFor={`${id}-water-wt`} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
                Show estimated water weight (approximate, at 60°F / 15.6°C)
              </label>
            </div>

            {showWaterWeight && (
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>US Water Weight</span>
                  <span className={styles.metricValue}>{(usGal * 8.34).toLocaleString(undefined, { maximumFractionDigits: 1 })} lbs</span>
                  <span className={styles.metricSub}>~8.34 lb / US gal</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Metric Water Weight</span>
                  <span className={styles.metricValue}>{(l * 1.0).toLocaleString(undefined, { maximumFractionDigits: 1 })} kg</span>
                  <span className={styles.metricSub}>~1 kg / Litre</span>
                </div>
              </div>
            )}

            <div className={styles.actionsBar}>
              <button type="button" className={styles.copyBtn} onClick={handleCopySummary}>
                {copied ? '✓ Copied' : 'Copy Summary'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: FROM DIMENSIONS */}
      {tab === 'dimensions' && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <div role="radiogroup" aria-labelledby={`${id}-shape`} style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span id={`${id}-shape`} style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)' }}>Shape:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  <input
                    type="radio"
                    name="shapeType"
                    checked={shape === 'box'}
                    onChange={() => setShape('box')}
                  />
                  Rectangular Box (L × W × H)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  <input
                    type="radio"
                    name="shapeType"
                    checked={shape === 'cylinder'}
                    onChange={() => setShape('cylinder')}
                  />
                  Cylinder / Round Tank (D × H)
                </label>
              </div>
            </div>

            {shape === 'box' ? (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor={`${id}-box-l`}>Length</label>
                  <div className={styles.inputWithUnit}>
                    <input
                      id={`${id}-box-l`}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.unitInput}
                      value={boxLength}
                      onChange={(e) => setBoxLength(parseFloat(e.target.value) || 0)}
                    />
                    <select
                      className={styles.select}
                      value={boxUnit}
                      onChange={(e) => setBoxUnit(e.target.value as LengthUnit)}
                    >
                      <option value="ft">ft</option>
                      <option value="in">in</option>
                      <option value="m">m</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor={`${id}-box-w`}>Width</label>
                  <div className={styles.inputWithUnit}>
                    <input
                      id={`${id}-box-w`}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.unitInput}
                      value={boxWidth}
                      onChange={(e) => setBoxWidth(parseFloat(e.target.value) || 0)}
                    />
                    <select
                      className={styles.select}
                      value={boxUnit}
                      onChange={(e) => setBoxUnit(e.target.value as LengthUnit)}
                    >
                      <option value="ft">ft</option>
                      <option value="in">in</option>
                      <option value="m">m</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor={`${id}-box-h`}>Height / Depth</label>
                  <div className={styles.inputWithUnit}>
                    <input
                      id={`${id}-box-h`}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.unitInput}
                      value={boxHeight}
                      onChange={(e) => setBoxHeight(parseFloat(e.target.value) || 0)}
                    />
                    <select
                      className={styles.select}
                      value={boxUnit}
                      onChange={(e) => setBoxUnit(e.target.value as LengthUnit)}
                    >
                      <option value="ft">ft</option>
                      <option value="in">in</option>
                      <option value="m">m</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor={`${id}-cyl-d`}>Diameter</label>
                  <div className={styles.inputWithUnit}>
                    <input
                      id={`${id}-cyl-d`}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.unitInput}
                      value={cylDiameter}
                      onChange={(e) => setCylDiameter(parseFloat(e.target.value) || 0)}
                    />
                    <select
                      className={styles.select}
                      value={cylUnit}
                      onChange={(e) => setCylUnit(e.target.value as LengthUnit)}
                    >
                      <option value="ft">ft</option>
                      <option value="in">in</option>
                      <option value="m">m</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor={`${id}-cyl-h`}>Height</label>
                  <div className={styles.inputWithUnit}>
                    <input
                      id={`${id}-cyl-h`}
                      type="number"
                      min="0"
                      step="any"
                      className={styles.unitInput}
                      value={cylHeight}
                      onChange={(e) => setCylHeight(parseFloat(e.target.value) || 0)}
                    />
                    <select
                      className={styles.select}
                      value={cylUnit}
                      onChange={(e) => setCylUnit(e.target.value as LengthUnit)}
                    >
                      <option value="ft">ft</option>
                      <option value="in">in</option>
                      <option value="m">m</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={styles.resultsBand}>
            <div className={styles.heroResult}>
              <div className={styles.heroLabel}>CALCULATED TANK CAPACITY</div>
              <div className={styles.heroValue}>{dimGal.toFixed(2)} US Gallons</div>
              <div className={styles.heroSub}>
                <span>{dimFt3.toFixed(2)} ft³</span>
                <span>·</span>
                <span>{dimLitres.toFixed(1)} L</span>
                <span>·</span>
                <span>{dimM3.toFixed(3)} m³</span>
              </div>
            </div>

            <div className={styles.sentence}>
              A {shape === 'box' ? `${boxLength} × ${boxWidth} × ${boxHeight} ${boxUnit}` : `diameter ${cylDiameter} × height ${cylHeight} ${cylUnit}`} container holds{' '}
              <strong>{dimGal.toFixed(2)} US gallons</strong> ({dimFt3.toFixed(2)} cubic feet).
            </div>
          </div>
        </>
      )}

      {/* TAB 3: CONVERSION TABLE */}
      {tab === 'table' && (
        <div className={styles.resultsBand}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor={`${id}-tbl-max`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>Up to:</label>
              <select
                id={`${id}-tbl-max`}
                className={styles.select}
                value={tableMax}
                onChange={(e) => setTableMax(parseInt(e.target.value))}
              >
                <option value={25}>25 Gallons</option>
                <option value={50}>50 Gallons</option>
                <option value={100}>100 Gallons</option>
                <option value={500}>500 Gallons</option>
                <option value={1000}>1,000 Gallons</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor={`${id}-tbl-step`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>Step:</label>
              <select
                id={`${id}-tbl-step`}
                className={styles.select}
                value={tableStep}
                onChange={(e) => setTableStep(parseInt(e.target.value))}
              >
                <option value={1}>Step 1</option>
                <option value={5}>Step 5</option>
                <option value={10}>Step 10</option>
                <option value={25}>Step 25</option>
                <option value={50}>Step 50</option>
              </select>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button type="button" className={styles.copyBtn} onClick={handleCopyCsv}>
                {copied ? '✓ Copied' : 'Copy CSV'}
              </button>
              <button type="button" className={styles.copyBtn} onClick={() => window.print()}>
                🖨️ Print
              </button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>US Gallons (gal)</th>
                  <th>Cubic Feet (ft³)</th>
                  <th>Litres (L)</th>
                  <th>Cubic Metres (m³)</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.gal}>
                    <td><strong>{r.gal} gal</strong></td>
                    <td><strong>{r.ft3.toFixed(4)} ft³</strong></td>
                    <td>{r.litres.toFixed(2)} L</td>
                    <td>{r.m3.toFixed(4)} m³</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
