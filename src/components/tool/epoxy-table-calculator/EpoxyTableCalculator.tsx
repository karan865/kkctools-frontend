'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import EpoxyTableInputGuide from './EpoxyTableInputGuide';
import styles from './EpoxyTableCalculator.module.css';
import {
  riverVolumeIn3,
  rectVolumeIn3,
  applyAllowances,
  in3ToVolumes,
  mixSplit,
  pourPlan,
  kitPlan,
  STANDARD_KITS,
  averageWidth,
} from '@/lib/epoxy-engine';

type TabType = 'river' | 'flood' | 'full';
type UnitType = 'in' | 'cm';

const TABS: TabItem<TabType>[] = [
  { id: 'river', label: 'River Channel Only' },
  { id: 'flood', label: 'Flood Coat Only' },
  { id: 'full', label: 'Full Build (River + Top Coat)' },
];

export default function EpoxyTableCalculator() {
  const fieldId = useId();
  const [tab, setTab] = useState<TabType>('full');
  const [unit, setUnit] = useState<UnitType>('in');

  // River dimensions
  const [riverLength, setRiverLength] = useState<number>(48);
  const [riverAvgWidth, setRiverAvgWidth] = useState<number>(6);
  const [riverDepth, setRiverDepth] = useState<number>(1.0);
  const [widthReadingsInput, setWidthReadingsInput] = useState<string>('5, 6, 7, 6, 6');
  const [useReadings, setUseReadings] = useState<boolean>(false);

  // Table & Flood Coat dimensions
  const [tableLength, setTableLength] = useState<number>(48);
  const [tableWidth, setTableWidth] = useState<number>(24);
  const [floodThickness, setFloodThickness] = useState<number>(0.125); // 1/8 in
  const [edgeHeight, setEdgeHeight] = useState<number>(0);
  const [seepageGap, setSeepageGap] = useState<number>(0);

  // Allowances & Pour Planner
  const [wastePct, setWastePct] = useState<number>(10);
  const [maxLayerDepth, setMaxLayerDepth] = useState<number>(0.5);

  // Mix Ratio
  const [ratioA, setRatioA] = useState<number>(1);
  const [ratioB, setRatioB] = useState<number>(1);

  // Focus tracking
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // URL tab syncing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as TabType;
        if (tabParam && ['river', 'flood', 'full'].includes(tabParam)) {
          setTab(tabParam);
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

  const toInches = (val: number) => (unit === 'cm' ? val / 2.54 : val);

  // Parse width readings if enabled
  const parsedAvgWidth = useMemo(() => {
    if (!useReadings) return riverAvgWidth;
    const nums = widthReadingsInput
      .split(/[,;\s]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
    const avg = averageWidth(nums);
    return avg !== null ? avg : riverAvgWidth;
  }, [useReadings, widthReadingsInput, riverAvgWidth]);

  // River volume
  const riverVolIn3 = useMemo(() => {
    if (tab === 'flood') return 0;
    const lIn = toInches(riverLength);
    const wIn = toInches(parsedAvgWidth);
    const dIn = toInches(riverDepth);
    return riverVolumeIn3(lIn, wIn, dIn);
  }, [tab, riverLength, parsedAvgWidth, riverDepth, unit]);

  // Flood coat volume
  const floodVolIn3 = useMemo(() => {
    if (tab === 'river') return 0;
    const lIn = toInches(tableLength);
    const wIn = toInches(tableWidth);
    const tIn = toInches(floodThickness);
    return rectVolumeIn3(lIn, wIn, tIn);
  }, [tab, tableLength, tableWidth, floodThickness, unit]);

  // Seepage under slab volume
  const seepageVolIn3 = useMemo(() => {
    if (tab === 'flood' || seepageGap <= 0) return 0;
    const lIn = toInches(tableLength);
    const wIn = toInches(tableWidth);
    const gIn = toInches(seepageGap);
    // Slab footprint roughly table area minus river area
    const riverArea = toInches(riverLength) * toInches(parsedAvgWidth);
    const slabFootprint = Math.max(0, lIn * wIn - riverArea);
    return slabFootprint * gIn;
  }, [tab, tableLength, tableWidth, riverLength, parsedAvgWidth, seepageGap, unit]);

  // Perimeter edge volume
  const edgeVolIn3 = useMemo(() => {
    if (tab === 'river' || edgeHeight <= 0) return 0;
    const lIn = toInches(tableLength);
    const wIn = toInches(tableWidth);
    const hIn = toInches(edgeHeight);
    const perimeter = 2 * (lIn + wIn);
    // Assume thin 1/16 in wrap around edges
    return perimeter * hIn * (1 / 16);
  }, [tab, tableLength, tableWidth, edgeHeight, unit]);

  // Combined base volume
  const baseTotalIn3 = useMemo(() => {
    return riverVolIn3 + floodVolIn3 + seepageVolIn3 + edgeVolIn3;
  }, [riverVolIn3, floodVolIn3, seepageVolIn3, edgeVolIn3]);

  // Allowances & Total
  const allowances = useMemo(() => {
    return applyAllowances(baseTotalIn3, 0, wastePct);
  }, [baseTotalIn3, wastePct]);

  const totalVolumes = useMemo(() => {
    return in3ToVolumes(allowances.totalIn3);
  }, [allowances.totalIn3]);

  // Mix split
  const split = useMemo(() => {
    return mixSplit(allowances.totalIn3, ratioA, ratioB);
  }, [allowances.totalIn3, ratioA, ratioB]);

  // Pour plan for the river portion
  const pourPlanData = useMemo(() => {
    const depthIn = toInches(riverDepth);
    const maxLayerIn = toInches(maxLayerDepth);
    // Account for river volume with waste
    const riverWithWasteIn3 = riverVolIn3 * (1 + wastePct / 100);
    return pourPlan(depthIn, maxLayerIn, riverWithWasteIn3, ratioA, ratioB);
  }, [riverDepth, maxLayerDepth, riverVolIn3, wastePct, ratioA, ratioB, unit]);

  // Kit plan
  const kitPlanData = useMemo(() => {
    return kitPlan(allowances.totalIn3, STANDARD_KITS);
  }, [allowances.totalIn3]);

  const copySummary = () => {
    const text = `Epoxy River Table Plan:\nTotal Epoxy: ${totalVolumes.usGal.toFixed(2)} US gal (${totalVolumes.liters.toFixed(2)} L / ${totalVolumes.flOz.toFixed(0)} fl oz)\nRiver: ${(riverVolIn3 / 231).toFixed(2)} gal | Flood: ${(floodVolIn3 / 231).toFixed(2)} gal\nPours: ${pourPlanData?.poursCount || 1} layer(s)\nCalculated at KKCTools.com`;
    navigator.clipboard.writeText(text);
    alert('Table build summary copied!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.tabWrapper}>
          <TabSlider
            tabs={TABS}
            activeId={tab}
            onChange={handleTabChange}
            ariaLabel="River table calculation modes"
          />
        </div>

        {/* Input Guide Diagram */}
        <EpoxyTableInputGuide
          tab={tab}
          unit={unit}
          riverLength={riverLength}
          riverAvgWidth={parsedAvgWidth}
          riverDepth={riverDepth}
          seepageGap={seepageGap}
          tableLength={tableLength}
          tableWidth={tableWidth}
          floodThickness={floodThickness}
          edgeHeight={edgeHeight}
          maxLayerDepth={maxLayerDepth}
          focusedField={focusedField}
        />

        {/* Header & Unit Toggle */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {tab === 'river' ? '1. River Channel Dimensions' : tab === 'flood' ? '1. Table Top Dimensions' : '1. River & Table Dimensions'}
          </h2>
          <div className={styles.unitToggle} role="group" aria-label="Unit system">
            <button
              type="button"
              className={`${styles.unitBtn} ${unit === 'in' ? styles.unitBtnActive : ''}`}
              onClick={() => setUnit('in')}
            >
              Inches (in)
            </button>
            <button
              type="button"
              className={`${styles.unitBtn} ${unit === 'cm' ? styles.unitBtnActive : ''}`}
              onClick={() => setUnit('cm')}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Quick project size presets */}
        <div className={styles.presetsRow}>
          <span className={styles.labelSub}>Presets:</span>
          <button
            type="button"
            className={styles.presetChip}
            onClick={() => {
              setTableLength(unit === 'in' ? 48 : 120);
              setTableWidth(unit === 'in' ? 24 : 60);
              setRiverLength(unit === 'in' ? 48 : 120);
              setRiverAvgWidth(unit === 'in' ? 6 : 15);
              setRiverDepth(unit === 'in' ? 1 : 2.5);
              setFloodThickness(unit === 'in' ? 0.125 : 0.32);
            }}
          >
            Coffee Table (48 × 24&quot;)
          </button>
          <button
            type="button"
            className={styles.presetChip}
            onClick={() => {
              setTableLength(unit === 'in' ? 72 : 180);
              setTableWidth(unit === 'in' ? 36 : 90);
              setRiverLength(unit === 'in' ? 72 : 180);
              setRiverAvgWidth(unit === 'in' ? 8 : 20);
              setRiverDepth(unit === 'in' ? 1.5 : 3.8);
              setFloodThickness(unit === 'in' ? 0.125 : 0.32);
            }}
          >
            Dining Table (72 × 36&quot;)
          </button>
          <button
            type="button"
            className={styles.presetChip}
            onClick={() => {
              setTableLength(unit === 'in' ? 24 : 60);
              setTableWidth(unit === 'in' ? 24 : 60);
              setRiverLength(unit === 'in' ? 24 : 60);
              setRiverAvgWidth(unit === 'in' ? 5 : 12);
              setRiverDepth(unit === 'in' ? 1 : 2.5);
            }}
          >
            End Table (24 × 24&quot;)
          </button>
        </div>

        {/* River Inputs (Visible on 'river' or 'full') */}
        {(tab === 'river' || tab === 'full') && (
          <>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f0`} className={styles.label}>
                  <span>1 River Length ({unit})</span>
                </label>
                <input id={`${fieldId}-f0`}
                  type="number"
                  min="1"
                  step="0.5"
                  className={styles.input}
                  value={riverLength}
                  onFocus={() => setFocusedField('riverLength')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setRiverLength(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f1`} className={styles.label}>
                  <span>2 Average River Width ({unit})</span>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--cat-engineering)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                    onClick={() => setUseReadings(!useReadings)}
                  >
                    {useReadings ? 'Enter single average' : '+ Enter multiple readings'}
                  </button>
                </label>
                <input id={`${fieldId}-f1`}
                  type="number"
                  min="0.5"
                  step="0.25"
                  className={styles.input}
                  disabled={useReadings}
                  value={parsedAvgWidth.toFixed(2)}
                  onFocus={() => setFocusedField('riverAvgWidth')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setRiverAvgWidth(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor={`${fieldId}-f2`} className={styles.label}>
                  <span>3 River Depth / Slab Thickness ({unit})</span>
                </label>
                <input id={`${fieldId}-f2`}
                  type="number"
                  min="0.25"
                  step="0.125"
                  className={styles.input}
                  value={riverDepth}
                  onFocus={() => setFocusedField('riverDepth')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setRiverDepth(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </div>
            </div>

            {/* Multiple width readings entry */}
            {useReadings && (
              <div className={styles.readingsBox}>
                <div className={styles.readingsHeader}>
                  <span className={styles.readingsTitle}>Multiple Width Measurements (Every 6 to 12 inches)</span>
                  <span className={styles.labelSub}>Calculated Mean: <strong>{parsedAvgWidth.toFixed(2)} {unit}</strong></span>
                </div>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. 5.5, 7.2, 6.0, 4.8, 8.1"
                  value={widthReadingsInput}
                  onChange={(e) => setWidthReadingsInput(e.target.value)}
                />
              </div>
            )}
          </>
        )}

        {/* Flood Coat & Table Inputs (Visible on 'flood' or 'full') */}
        {(tab === 'flood' || tab === 'full') && (
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f3`} className={styles.label}>Table Overall Length ({unit})</label>
              <input id={`${fieldId}-f3`}
                type="number"
                min="1"
                step="0.5"
                className={styles.input}
                value={tableLength}
                onChange={(e) => setTableLength(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f4`} className={styles.label}>Table Overall Width ({unit})</label>
              <input id={`${fieldId}-f4`}
                type="number"
                min="1"
                step="0.5"
                className={styles.input}
                value={tableWidth}
                onChange={(e) => setTableWidth(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f5`} className={styles.label}>
                <span>5 Flood Coat Thickness ({unit})</span>
                <span className={styles.labelSub}>e.g. 1/8&quot;; check your product label</span>
              </label>
              <input id={`${fieldId}-f5`}
                type="number"
                min="0.03"
                step="0.0625"
                className={styles.input}
                value={floodThickness}
                onChange={(e) => setFloodThickness(Math.max(0, parseFloat(e.target.value) || 0))}
              />
            </div>
          </div>
        )}

        {/* Extras & Pour Planning */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>2. Allowances &amp; Pour Planning</h2>
        </div>

        <div className={styles.grid}>
          {(tab === 'river' || tab === 'full') && (
            <div className={styles.field}>
              <label htmlFor={`${fieldId}-f6`} className={styles.label}>
                <span>7 Max Depth per Layer ({unit})</span>
                <span className={styles.labelSub}>from your product label</span>
              </label>
              <input id={`${fieldId}-f6`}
                type="number"
                min="0.1"
                step="0.25"
                className={styles.input}
                value={maxLayerDepth}
                onChange={(e) => setMaxLayerDepth(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f7`} className={styles.label}>
              <span>Waste Allowance (%)</span>
              <span className={styles.labelSub}>cup cling &amp; leveling</span>
            </label>
            <input id={`${fieldId}-f7`}
              type="number"
              min="0"
              max="30"
              step="1"
              className={styles.input}
              value={wastePct}
              onChange={(e) => setWastePct(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f8`} className={styles.label}>
              <span>4 Under-Slab Seepage Gap ({unit})</span>
              <span className={styles.labelSub}>optional (usually 0)</span>
            </label>
            <input id={`${fieldId}-f8`}
              type="number"
              min="0"
              max="0.5"
              step="0.03125"
              className={styles.input}
              value={seepageGap}
              onChange={(e) => setSeepageGap(Math.max(0, parseFloat(e.target.value) || 0))}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={`${fieldId}-f9`} className={styles.label}>
              <span>Part A : Part B Mix Ratio</span>
              <span className={styles.labelSub}>example: check label</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input id={`${fieldId}-f9`}
                type="number"
                min="1"
                className={styles.input}
                value={ratioA}
                onChange={(e) => setRatioA(Math.max(1, parseFloat(e.target.value) || 1))}
              />
              <span style={{ fontWeight: 700 }}>:</span>
              <input
                type="number"
                min="1"
                className={styles.input}
                value={ratioB}
                onChange={(e) => setRatioB(Math.max(1, parseFloat(e.target.value) || 1))}
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className={styles.resultsBand}>
          <div className={styles.heroResult}>
            <div className={styles.heroLabel}>Total Epoxy Required for Build</div>
            <div className={styles.heroValue}>
              {totalVolumes.usGal.toFixed(2)} US Gallons
            </div>
            <div className={styles.heroSub}>
              {totalVolumes.liters.toFixed(2)} Liters · {totalVolumes.flOz.toFixed(0)} fl oz ({allowances.totalIn3.toFixed(1)} in³)
            </div>
          </div>

          {/* Plain English Result Sentence */}
          <div className={styles.sentence}>
            A {riverLength}-inch river, {parsedAvgWidth.toFixed(1)} inches wide and {riverDepth} inch deep,
            {tab === 'full' && ` plus a ${floodThickness}-inch flood coat on a ${tableLength} × ${tableWidth} in top,`} needs
            about <strong>{totalVolumes.usGal.toFixed(2)} gallons</strong> of mixed epoxy, poured in{' '}
            <strong>{pourPlanData?.poursCount || 1} layer{pourPlanData?.poursCount !== 1 ? 's' : ''}</strong>.
          </div>

          {/* Volume Breakdown Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Cubic Inches</th>
                  <th>Fluid Ounces</th>
                  <th>US Gallons</th>
                  <th>Liters</th>
                </tr>
              </thead>
              <tbody>
                {riverVolIn3 > 0 && (
                  <tr>
                    <td><strong>River Channel</strong></td>
                    <td>{riverVolIn3.toFixed(1)} in³</td>
                    <td>{(riverVolIn3 / 1.804688).toFixed(1)} fl oz</td>
                    <td>{(riverVolIn3 / 231).toFixed(2)} gal</td>
                    <td>{((riverVolIn3 * 16.387064) / 1000).toFixed(2)} L</td>
                  </tr>
                )}
                {floodVolIn3 > 0 && (
                  <tr>
                    <td><strong>Top Flood Coat</strong></td>
                    <td>{floodVolIn3.toFixed(1)} in³</td>
                    <td>{(floodVolIn3 / 1.804688).toFixed(1)} fl oz</td>
                    <td>{(floodVolIn3 / 231).toFixed(2)} gal</td>
                    <td>{((floodVolIn3 * 16.387064) / 1000).toFixed(2)} L</td>
                  </tr>
                )}
                {seepageVolIn3 > 0 && (
                  <tr>
                    <td><strong>Under-Slab Seepage</strong></td>
                    <td>{seepageVolIn3.toFixed(1)} in³</td>
                    <td>{(seepageVolIn3 / 1.804688).toFixed(1)} fl oz</td>
                    <td>{(seepageVolIn3 / 231).toFixed(2)} gal</td>
                    <td>{((seepageVolIn3 * 16.387064) / 1000).toFixed(2)} L</td>
                  </tr>
                )}
                <tr>
                  <td><strong>Waste Allowance ({wastePct}%)</strong></td>
                  <td>{allowances.wasteIn3.toFixed(1)} in³</td>
                  <td>{(allowances.wasteIn3 / 1.804688).toFixed(1)} fl oz</td>
                  <td>{(allowances.wasteIn3 / 231).toFixed(2)} gal</td>
                  <td>{((allowances.wasteIn3 * 16.387064) / 1000).toFixed(2)} L</td>
                </tr>
                <tr>
                  <td><strong>Total Mixed Requirement</strong></td>
                  <td><strong>{allowances.totalIn3.toFixed(1)} in³</strong></td>
                  <td><strong>{totalVolumes.flOz.toFixed(1)} fl oz</strong></td>
                  <td><strong>{totalVolumes.usGal.toFixed(2)} gal</strong></td>
                  <td><strong>{totalVolumes.liters.toFixed(2)} L</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pour Schedule */}
          {pourPlanData && pourPlanData.poursCount > 1 && (
            <div className={styles.kitBox}>
              <div className={styles.kitTitle}>
                River Pour Schedule ({pourPlanData.poursCount} Separate Pours to Prevent Overheating)
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: 'var(--ink)' }}>
                Pour depth is capped at {maxLayerDepth} {unit} per layer. Allow each layer to cool and reach firm gel state before pouring the next.
              </p>
              <ul className={styles.kitList}>
                {Array.from({ length: pourPlanData.poursCount }).map((_, i) => (
                  <li key={i}>
                    <strong>Pour #{i + 1}:</strong> {pourPlanData.volumePerPour.usGal.toFixed(2)} US gal ({pourPlanData.volumePerPour.flOz.toFixed(0)} fl oz) —{' '}
                    {pourPlanData.partAPerPour.flOz.toFixed(0)} fl oz Resin (Part A) + {pourPlanData.partBPerPour.flOz.toFixed(0)} fl oz Hardener (Part B)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mold Box Dimensions Guide */}
          <div className={styles.kitBox}>
            <div className={styles.kitTitle}>Recommended Mold Box Sizing</div>
            <p style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: 'var(--ink)' }}>
              To ensure slabs fit flat with clamping room, build your melamine or HDPE mold form:
            </p>
            <p style={{ margin: '0', fontSize: '0.92rem', fontWeight: 600, color: 'var(--cat-engineering-deep)' }}>
              Inside Form Dimensions: {tableLength + (unit === 'in' ? 1 : 2.5)} {unit} Length × {tableWidth + (unit === 'in' ? 1 : 2.5)} {unit} Width × {riverDepth + (unit === 'in' ? 0.5 : 1.2)} {unit} Wall Height
            </p>
          </div>

          {/* Kit Purchase Advice */}
          {kitPlanData.items.length > 0 && (
            <div className={styles.kitBox}>
              <div className={styles.kitTitle}>Recommended Commercial Kit Purchase</div>
              <ul className={styles.kitList}>
                {kitPlanData.items.map((it, idx) => (
                  <li key={idx}>
                    • {it.count} × {it.kit.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <button type="button" className={styles.actionBtn} onClick={copySummary}>
              Copy Build Summary
            </button>
            <button type="button" className={styles.actionBtnSecondary} onClick={handlePrint}>
              Print Pour Plan
            </button>
          </div>

          {/* Safety Notice */}
          <div className={styles.safetyNotice}>
            <div className={styles.safetyTitle}>Safety &amp; Exotherm Notice</div>
            River table pours involve large liquid masses. Deep epoxy can reach temperatures over 200°F (93°C) if poured thicker than the manufacturer&apos;s technical data sheet allows. Work in a well-ventilated space, wear nitrile gloves, and monitor layer temperatures.
          </div>
        </div>
      </div>
    </>
  );
}
