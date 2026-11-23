'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider, { type TabItem } from '@/components/tool/shared/TabSlider';
import SpeedsFeedsInputGuide from './SpeedsFeedsInputGuide';
import styles from './SpeedsFeedsCalculator.module.css';
import {
  rpmFromSfm,
  sfmFromRpm,
  rpmFromVc,
  vcFromRpm,
  feedRate,
  chipThinningFactor,
  materialRemovalRate,
  drillFeed,
  tapFeed,
  scaleToLimits,
} from '@/lib/machining-engine';

type SpeedsFeedsTab = 'milling' | 'routing' | 'drilling' | 'tapping';
type UnitSystem = 'inch' | 'metric';

const TAB_OPTIONS: TabItem<SpeedsFeedsTab>[] = [
  { id: 'milling', label: 'CNC Milling' },
  { id: 'routing', label: 'CNC Router' },
  { id: 'drilling', label: 'Drilling' },
  { id: 'tapping', label: 'Tapping' },
];

export default function SpeedsFeedsCalculator() {
  const [tab, setTab] = useState<SpeedsFeedsTab>('milling');
  const [unit, setUnit] = useState<UnitSystem>('inch');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showLimits, setShowLimits] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['milling', 'routing', 'drilling', 'tapping'].includes(tabParam)) {
        setTab(tabParam as SpeedsFeedsTab);
      }
    };
    const timer = setTimeout(syncFromUrl, 0);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const handleTabChange = (newTabId: SpeedsFeedsTab) => {
    setTab(newTabId);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTabId);
    window.history.replaceState({}, '', url.toString());
  };

  // Milling Inputs
  const [millDia, setMillDia] = useState<number>(0.5); // inch
  const [millFlutes, setMillFlutes] = useState<number>(3);
  const [millToolType, setMillToolType] = useState<string>('Solid Carbide End Mill');
  const [millSfm, setMillSfm] = useState<number>(600); // SFM (example)
  const [millChipLoad, setMillChipLoad] = useState<number>(0.002); // in/tooth
  const [millWoc, setMillWoc] = useState<number>(0.25); // in
  const [millDoc, setMillDoc] = useState<number>(0.25); // in

  // Router Inputs
  const [routerDia, setRouterDia] = useState<number>(0.25); // inch
  const [routerFlutes, setRouterFlutes] = useState<number>(2);
  const [routerToolType, setRouterToolType] = useState<string>('Carbide Spiral Upcut');
  const [routerSfm, setRouterSfm] = useState<number>(600); // SFM (example)
  const [routerChipLoad, setRouterChipLoad] = useState<number>(0.004); // in/tooth
  const [routerWoc, setRouterWoc] = useState<number>(0.125);
  const [routerDoc, setRouterDoc] = useState<number>(0.25);

  // Drilling Inputs
  const [drillDia, setDrillDia] = useState<number>(0.25); // inch
  const [drillSfm, setDrillSfm] = useState<number>(200); // SFM (example)
  const [drillIpr, setDrillIpr] = useState<number>(0.004); // in/rev

  // Tapping Inputs
  const [tapDia, setTapDia] = useState<number>(0.25); // 1/4-20 default
  const [tapStandard, setTapStandard] = useState<'inch' | 'metric'>('inch');
  const [tapTpi, setTapTpi] = useState<number>(20); // 20 TPI
  const [tapMetricPitch, setTapMetricPitch] = useState<number>(1.5); // mm pitch
  const [tapRpm, setTapRpm] = useState<number>(500); // spindle RPM

  // Machine Limits (optional)
  const [maxRpm, setMaxRpm] = useState<number | ''>('');
  const [minRpm, setMinRpm] = useState<number | ''>('');
  const [maxFeed, setMaxFeed] = useState<number | ''>('');

  // ID generators for accessibility
  const millDiaId = useId();
  const millFlutesId = useId();
  const millToolTypeId = useId();
  const millSfmId = useId();
  const millChipLoadId = useId();
  const millWocId = useId();
  const millDocId = useId();

  const routerDiaId = useId();
  const routerFlutesId = useId();
  const routerToolTypeId = useId();
  const routerSfmId = useId();
  const routerChipLoadId = useId();
  const routerWocId = useId();
  const routerDocId = useId();

  const drillDiaId = useId();
  const drillSfmId = useId();
  const drillIprId = useId();

  const tapDiaId = useId();
  const tapStandardId = useId();
  const tapTpiId = useId();
  const tapMetricPitchId = useId();
  const tapRpmId = useId();

  const maxRpmId = useId();
  const minRpmId = useId();
  const maxFeedId = useId();

  // Primary Calculations based on active tab
  const calculations = useMemo(() => {
    const limits = {
      maxRpm: typeof maxRpm === 'number' && maxRpm > 0 ? maxRpm : undefined,
      minRpm: typeof minRpm === 'number' && minRpm > 0 ? minRpm : undefined,
      maxFeedIpm: typeof maxFeed === 'number' && maxFeed > 0 ? maxFeed : undefined,
    };

    if (tab === 'milling') {
      const diaIn = unit === 'metric' ? millDia / 25.4 : millDia;
      const sfm = unit === 'metric' ? millSfm / 0.3048 : millSfm;
      const chipLoadIn = unit === 'metric' ? millChipLoad / 25.4 : millChipLoad;
      const wocIn = unit === 'metric' ? millWoc / 25.4 : millWoc;
      const docIn = unit === 'metric' ? millDoc / 25.4 : millDoc;

      const idealRpm = rpmFromSfm(sfm, diaIn) ?? 0;
      const idealFeed = feedRate(idealRpm, millFlutes, chipLoadIn) ?? 0;
      const scaled = scaleToLimits(idealRpm, idealFeed, millFlutes, diaIn, limits);

      const thinningFactor = chipThinningFactor(wocIn, diaIn);
      // Chip-thinning boost starts from the machine-limited feed and never exceeds the max feed.
      const adjustedFeed = limits.maxFeedIpm
        ? Math.min(scaled.actualFeedIpm * thinningFactor, limits.maxFeedIpm)
        : scaled.actualFeedIpm * thinningFactor;
      const mrrIn3 = materialRemovalRate(wocIn, docIn, scaled.actualFeedIpm) ?? 0;
      const mrrMm3 = mrrIn3 * 16387.064;

      return {
        spindleRpm: Math.round(scaled.actualRpm),
        idealRpm: Math.round(idealRpm),
        feedIpm: scaled.actualFeedIpm,
        feedMmpm: scaled.actualFeedIpm * 25.4,
        actualChipLoad: scaled.actualChipLoad,
        actualSfm: scaled.actualSfm,
        actualVc: scaled.actualSfm * 0.3048,
        thinningFactor,
        adjustedFeedIpm: adjustedFeed,
        adjustedFeedMmpm: adjustedFeed * 25.4,
        mrrIn3,
        mrrMm3,
        warnings: scaled.warnings,
        isRpmCapped: scaled.isRpmCapped,
        isFeedCapped: scaled.isFeedCapped,
        dia: millDia,
        flutes: millFlutes,
        sfmOrVc: millSfm,
        chipLoad: millChipLoad,
        woc: millWoc,
        doc: millDoc,
      };
    } else if (tab === 'routing') {
      const diaIn = unit === 'metric' ? routerDia / 25.4 : routerDia;
      const sfm = unit === 'metric' ? routerSfm / 0.3048 : routerSfm;
      const chipLoadIn = unit === 'metric' ? routerChipLoad / 25.4 : routerChipLoad;
      const wocIn = unit === 'metric' ? routerWoc / 25.4 : routerWoc;
      const docIn = unit === 'metric' ? routerDoc / 25.4 : routerDoc;

      const idealRpm = rpmFromSfm(sfm, diaIn) ?? 0;
      const idealFeed = feedRate(idealRpm, routerFlutes, chipLoadIn) ?? 0;
      const scaled = scaleToLimits(idealRpm, idealFeed, routerFlutes, diaIn, limits);

      const thinningFactor = chipThinningFactor(wocIn, diaIn);
      // Chip-thinning boost starts from the machine-limited feed and never exceeds the max feed.
      const adjustedFeed = limits.maxFeedIpm
        ? Math.min(scaled.actualFeedIpm * thinningFactor, limits.maxFeedIpm)
        : scaled.actualFeedIpm * thinningFactor;
      const mrrIn3 = materialRemovalRate(wocIn, docIn, scaled.actualFeedIpm) ?? 0;
      const mrrMm3 = mrrIn3 * 16387.064;

      return {
        spindleRpm: Math.round(scaled.actualRpm),
        idealRpm: Math.round(idealRpm),
        feedIpm: scaled.actualFeedIpm,
        feedMmpm: scaled.actualFeedIpm * 25.4,
        actualChipLoad: scaled.actualChipLoad,
        actualSfm: scaled.actualSfm,
        actualVc: scaled.actualSfm * 0.3048,
        thinningFactor,
        adjustedFeedIpm: adjustedFeed,
        adjustedFeedMmpm: adjustedFeed * 25.4,
        mrrIn3,
        mrrMm3,
        warnings: scaled.warnings,
        isRpmCapped: scaled.isRpmCapped,
        isFeedCapped: scaled.isFeedCapped,
        dia: routerDia,
        flutes: routerFlutes,
        sfmOrVc: routerSfm,
        chipLoad: routerChipLoad,
        woc: routerWoc,
        doc: routerDoc,
      };
    } else if (tab === 'drilling') {
      const diaIn = unit === 'metric' ? drillDia / 25.4 : drillDia;
      const sfm = unit === 'metric' ? drillSfm / 0.3048 : drillSfm;
      const ipr = unit === 'metric' ? drillIpr / 25.4 : drillIpr;

      const idealRpm = rpmFromSfm(sfm, diaIn) ?? 0;
      const feedIpm = drillFeed(idealRpm, ipr) ?? 0;
      const scaled = scaleToLimits(idealRpm, feedIpm, 2, diaIn, limits);

      return {
        spindleRpm: Math.round(scaled.actualRpm),
        idealRpm: Math.round(idealRpm),
        feedIpm: scaled.actualFeedIpm,
        feedMmpm: scaled.actualFeedIpm * 25.4,
        actualChipLoad: ipr / 2,
        actualSfm: scaled.actualSfm,
        actualVc: scaled.actualSfm * 0.3048,
        thinningFactor: 1,
        adjustedFeedIpm: scaled.actualFeedIpm,
        adjustedFeedMmpm: scaled.actualFeedIpm * 25.4,
        mrrIn3: 0,
        mrrMm3: 0,
        warnings: scaled.warnings,
        isRpmCapped: scaled.isRpmCapped,
        isFeedCapped: scaled.isFeedCapped,
        dia: drillDia,
        flutes: 2,
        sfmOrVc: drillSfm,
        chipLoad: drillIpr,
        woc: drillDia,
        doc: drillDia,
      };
    } else {
      // Tapping
      const isMetricTap = tapStandard === 'metric';
      let calculatedFeedIpm = 0;
      let calculatedFeedMmpm = 0;

      if (isMetricTap) {
        // Feed (mm/min) = RPM × Pitch (mm)
        calculatedFeedMmpm = tapFeed(tapRpm, tapMetricPitch, false) ?? 0;
        calculatedFeedIpm = calculatedFeedMmpm / 25.4;
      } else {
        // Feed (IPM) = RPM × (1 / TPI)
        calculatedFeedIpm = tapFeed(tapRpm, tapTpi, true) ?? 0;
        calculatedFeedMmpm = calculatedFeedIpm * 25.4;
      }

      return {
        spindleRpm: Math.round(tapRpm),
        idealRpm: Math.round(tapRpm),
        feedIpm: calculatedFeedIpm,
        feedMmpm: calculatedFeedMmpm,
        actualChipLoad: 0,
        actualSfm: 0,
        actualVc: 0,
        thinningFactor: 1,
        adjustedFeedIpm: calculatedFeedIpm,
        adjustedFeedMmpm: calculatedFeedMmpm,
        mrrIn3: 0,
        mrrMm3: 0,
        warnings: [],
        isRpmCapped: false,
        isFeedCapped: false,
        dia: tapDia,
        flutes: 1,
        sfmOrVc: 0,
        chipLoad: 0,
        woc: 0,
        doc: 0,
      };
    }
  }, [
    tab,
    unit,
    millDia,
    millFlutes,
    millSfm,
    millChipLoad,
    millWoc,
    millDoc,
    routerDia,
    routerFlutes,
    routerSfm,
    routerChipLoad,
    routerWoc,
    routerDoc,
    drillDia,
    drillSfm,
    drillIpr,
    tapStandard,
    tapTpi,
    tapMetricPitch,
    tapRpm,
    tapDia,
    maxRpm,
    minRpm,
    maxFeed,
  ]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.tabWrapper}>
        <TabSlider
          tabs={TAB_OPTIONS}
          activeId={tab}
          onChange={handleTabChange}
          ariaLabel="Speeds and feeds machining operation mode"
        />
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {tab === 'milling' && 'CNC Milling Parameters'}
          {tab === 'routing' && 'CNC Router Parameters (Wood / Plastic / Aluminum)'}
          {tab === 'drilling' && 'Drilling Parameters'}
          {tab === 'tapping' && 'Tapping Feed Rate Parameters'}
        </h2>
        <div className={styles.unitToggle}>
          <button
            type="button"
            className={`${styles.unitBtn} ${unit === 'inch' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnit('inch')}
          >
            Inches (Imperial)
          </button>
          <button
            type="button"
            className={`${styles.unitBtn} ${unit === 'metric' ? styles.unitBtnActive : ''}`}
            onClick={() => setUnit('metric')}
          >
            Millimeters (Metric)
          </button>
        </div>
      </div>

      {/* Input Guide Diagram */}
      <SpeedsFeedsInputGuide
        tab={tab}
        unit={unit}
        dia={calculations.dia}
        flutes={calculations.flutes}
        sfmOrVc={calculations.sfmOrVc}
        chipLoad={calculations.chipLoad}
        woc={calculations.woc}
        doc={calculations.doc}
        calculatedRpm={calculations.spindleRpm}
        calculatedFeed={unit === 'metric' ? calculations.feedMmpm : calculations.feedIpm}
        focusedField={focusedField}
      />

      {/* Milling Tab Inputs */}
      {tab === 'milling' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={millDiaId} className={styles.label}>
              1. Tool Diameter <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={millDiaId}
              type="number"
              step={unit === 'metric' ? '0.5' : '0.0625'}
              min="0.01"
              value={millDia}
              onChange={(e) => setMillDia(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('dia')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Outer cutting diameter of end mill</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={millFlutesId} className={styles.label}>
              2. Number of Flutes <span className={styles.labelSub}>(teeth)</span>
            </label>
            <input
              id={millFlutesId}
              type="number"
              min="1"
              max="12"
              value={millFlutes}
              onChange={(e) => setMillFlutes(parseInt(e.target.value, 10) || 1)}
              onFocus={() => setFocusedField('flutes')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>e.g. 2, 3 or 4 flutes</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={millToolTypeId} className={styles.label}>
              Tool Material &amp; Type
            </label>
            <input
              id={millToolTypeId}
              type="text"
              value={millToolType}
              onChange={(e) => setMillToolType(e.target.value)}
              className={styles.input}
              placeholder="e.g. Solid Carbide, HSS, TiAlN coated"
            />
            <span className={styles.helpText}>Label for your setup sheet</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={millSfmId} className={styles.label}>
              3. Cutting Surface Speed <span className={styles.labelSub}>({unit === 'metric' ? 'm/min Vc' : 'SFM'})</span>
            </label>
            <input
              id={millSfmId}
              type="number"
              min="1"
              value={millSfm}
              onChange={(e) => setMillSfm(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('sfm')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Example: 600 SFM (consult your tool maker&apos;s chart)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={millChipLoadId} className={styles.label}>
              4. Chip Load per Tooth <span className={styles.labelSub}>({unit === 'metric' ? 'mm/tooth' : 'in/tooth'})</span>
            </label>
            <input
              id={millChipLoadId}
              type="number"
              step={unit === 'metric' ? '0.01' : '0.0005'}
              min="0.0001"
              value={millChipLoad}
              onChange={(e) => setMillChipLoad(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('chip')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Target feed per tooth (advance per flute)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={millWocId} className={styles.label}>
              5. Radial Width of Cut (WOC) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={millWocId}
              type="number"
              step={unit === 'metric' ? '0.5' : '0.05'}
              min="0.001"
              value={millWoc}
              onChange={(e) => setMillWoc(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('woc')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Stepover for chip thinning &amp; MRR calculation</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={millDocId} className={styles.label}>
              6. Axial Depth of Cut (DOC) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={millDocId}
              type="number"
              step={unit === 'metric' ? '0.5' : '0.05'}
              min="0.001"
              value={millDoc}
              onChange={(e) => setMillDoc(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('doc')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Axial cut depth per pass</span>
          </div>
        </div>
      )}

      {/* Router Tab Inputs */}
      {tab === 'routing' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={routerDiaId} className={styles.label}>
              1. Router Bit Diameter <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={routerDiaId}
              type="number"
              step={unit === 'metric' ? '0.5' : '0.0625'}
              min="0.01"
              value={routerDia}
              onChange={(e) => setRouterDia(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('dia')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>e.g. 1/4&quot; (6.35 mm) or 1/8&quot; (3.175 mm)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={routerFlutesId} className={styles.label}>
              2. Flutes <span className={styles.labelSub}>(1, 2 or 3 flutes)</span>
            </label>
            <input
              id={routerFlutesId}
              type="number"
              min="1"
              max="4"
              value={routerFlutes}
              onChange={(e) => setRouterFlutes(parseInt(e.target.value, 10) || 1)}
              onFocus={() => setFocusedField('flutes')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Fewer flutes = bigger chip per tooth at the same feed</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={routerToolTypeId} className={styles.label}>
              Bit Geometry
            </label>
            <input
              id={routerToolTypeId}
              type="text"
              value={routerToolType}
              onChange={(e) => setRouterToolType(e.target.value)}
              className={styles.input}
              placeholder="e.g. Spiral Upcut, Downcut, Compression"
            />
            <span className={styles.helpText}>Downcut for clean top surface, Upcut for chip clearing</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={routerSfmId} className={styles.label}>
              3. Surface Speed <span className={styles.labelSub}>({unit === 'metric' ? 'm/min Vc' : 'SFM'})</span>
            </label>
            <input
              id={routerSfmId}
              type="number"
              min="1"
              value={routerSfm}
              onChange={(e) => setRouterSfm(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('sfm')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Example value: use your tool maker&apos;s chart for your material</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={routerChipLoadId} className={styles.label}>
              4. Target Chip Load <span className={styles.labelSub}>({unit === 'metric' ? 'mm/tooth' : 'in/tooth'})</span>
            </label>
            <input
              id={routerChipLoadId}
              type="number"
              step={unit === 'metric' ? '0.01' : '0.0005'}
              min="0.0001"
              value={routerChipLoad}
              onChange={(e) => setRouterChipLoad(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('chip')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Example value: use your tool maker&apos;s chart; too thin a chip rubs and makes dust</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={routerWocId} className={styles.label}>
              5. Stepover (WOC) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={routerWocId}
              type="number"
              step={unit === 'metric' ? '0.5' : '0.05'}
              min="0.001"
              value={routerWoc}
              onChange={(e) => setRouterWoc(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={routerDocId} className={styles.label}>
              6. Pass Depth (DOC) <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={routerDocId}
              type="number"
              step={unit === 'metric' ? '0.5' : '0.05'}
              min="0.001"
              value={routerDoc}
              onChange={(e) => setRouterDoc(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>
        </div>
      )}

      {/* Drilling Tab Inputs */}
      {tab === 'drilling' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={drillDiaId} className={styles.label}>
              1. Drill Diameter <span className={styles.labelSub}>({unit === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={drillDiaId}
              type="number"
              step={unit === 'metric' ? '0.5' : '0.03125'}
              min="0.01"
              value={drillDia}
              onChange={(e) => setDrillDia(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('dia')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Twist drill nominal diameter</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={drillSfmId} className={styles.label}>
              2. Surface Speed (SFM / Vc) <span className={styles.labelSub}>({unit === 'metric' ? 'm/min' : 'SFM'})</span>
            </label>
            <input
              id={drillSfmId}
              type="number"
              min="1"
              value={drillSfm}
              onChange={(e) => setDrillSfm(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('sfm')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Example value: use your drill maker&apos;s chart for your material</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={drillIprId} className={styles.label}>
              3. Feed per Revolution (IPR) <span className={styles.labelSub}>({unit === 'metric' ? 'mm/rev' : 'in/rev'})</span>
            </label>
            <input
              id={drillIprId}
              type="number"
              step={unit === 'metric' ? '0.01' : '0.001'}
              min="0.0001"
              value={drillIpr}
              onChange={(e) => setDrillIpr(parseFloat(e.target.value) || 0)}
              onFocus={() => setFocusedField('chip')}
              onBlur={() => setFocusedField(null)}
              className={styles.input}
            />
            <span className={styles.helpText}>Advance per full spindle rotation</span>
          </div>
        </div>
      )}

      {/* Tapping Tab Inputs */}
      {tab === 'tapping' && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={tapStandardId} className={styles.label}>
              Thread Standard
            </label>
            <select
              id={tapStandardId}
              value={tapStandard}
              onChange={(e) => setTapStandard(e.target.value as 'inch' | 'metric')}
              className={styles.select}
            >
              <option value="inch">Unified National (UNC / UNF / TPI)</option>
              <option value="metric">ISO Metric (M-profile / pitch mm)</option>
            </select>
            <span className={styles.helpText}>Select thread pitch definition</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={tapDiaId} className={styles.label}>
              Nominal Tap Size <span className={styles.labelSub}>({tapStandard === 'metric' ? 'mm' : 'in'})</span>
            </label>
            <input
              id={tapDiaId}
              type="number"
              step="0.05"
              min="0.01"
              value={tapDia}
              onChange={(e) => setTapDia(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
            <span className={styles.helpText}>e.g. 0.25 (1/4&quot;) or 10 (M10)</span>
          </div>

          {tapStandard === 'inch' ? (
            <div className={styles.field}>
              <label htmlFor={tapTpiId} className={styles.label}>
                Threads Per Inch (TPI)
              </label>
              <input
                id={tapTpiId}
                type="number"
                step="1"
                min="1"
                value={tapTpi}
                onChange={(e) => setTapTpi(parseFloat(e.target.value) || 1)}
                className={styles.input}
              />
              <span className={styles.helpText}>e.g. 20 for 1/4-20 UNC, 28 for 1/4-28 UNF</span>
            </div>
          ) : (
            <div className={styles.field}>
              <label htmlFor={tapMetricPitchId} className={styles.label}>
                Metric Pitch (mm)
              </label>
              <input
                id={tapMetricPitchId}
                type="number"
                step="0.05"
                min="0.1"
                value={tapMetricPitch}
                onChange={(e) => setTapMetricPitch(parseFloat(e.target.value) || 0.1)}
                className={styles.input}
              />
              <span className={styles.helpText}>e.g. 1.5 mm for M10×1.5</span>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor={tapRpmId} className={styles.label}>
              Tapping Spindle RPM
            </label>
            <input
              id={tapRpmId}
              type="number"
              step="50"
              min="1"
              value={tapRpm}
              onChange={(e) => setTapRpm(parseFloat(e.target.value) || 1)}
              className={styles.input}
            />
            <span className={styles.helpText}>Conservative RPM for rigid tapping or floating holder</span>
          </div>
        </div>
      )}

      {/* Machine Limits Toggle */}
      <button
        type="button"
        className={styles.advancedToggle}
        onClick={() => setShowLimits(!showLimits)}
        aria-expanded={showLimits}
      >
        <span>
          ⚙️ <strong>Machine Limits &amp; Spindle Envelope</strong> (Scale to your CNC capabilities)
        </span>
        <span>{showLimits ? '▲ Hide' : '▼ Expand'}</span>
      </button>

      {showLimits && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={maxRpmId} className={styles.label}>
              Spindle Maximum RPM
            </label>
            <input
              id={maxRpmId}
              type="number"
              min="1"
              placeholder="e.g. 24000 (Router) or 10000 (VMC)"
              value={maxRpm}
              onChange={(e) => setMaxRpm(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
            <span className={styles.helpText}>Caps RPM to prevent motor overload</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={minRpmId} className={styles.label}>
              Spindle Minimum RPM
            </label>
            <input
              id={minRpmId}
              type="number"
              min="1"
              placeholder="e.g. 8000 (Trim router low end)"
              value={minRpm}
              onChange={(e) => setMinRpm(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
            <span className={styles.helpText}>Prevents torque stalling on air-cooled spindles</span>
          </div>

          <div className={styles.field}>
            <label htmlFor={maxFeedId} className={styles.label}>
              Maximum Axis Feed <span className={styles.labelSub}>(IPM)</span>
            </label>
            <input
              id={maxFeedId}
              type="number"
              min="1"
              placeholder="e.g. 200 (stepper axis ceiling)"
              value={maxFeed}
              onChange={(e) => setMaxFeed(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
            <span className={styles.helpText}>Prevents lost steps on rapid or heavy cuts</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className={styles.resultsSection}>
        {calculations.warnings.length > 0 && (
          <div className={styles.warningCard} role="alert">
            {calculations.warnings.map((w, idx) => (
              <div key={idx} className={styles.warningItem}>
                ⚠️ {w}
              </div>
            ))}
          </div>
        )}

        <div className={styles.resultsGrid}>
          <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
            <span className={styles.resultLabel}>Spindle Speed</span>
            <span className={styles.resultValue}>{calculations.spindleRpm.toLocaleString()} RPM</span>
            <span className={styles.resultSub}>
              {calculations.actualSfm ? `${Math.round(calculations.actualSfm)} SFM (${Math.round(calculations.actualVc)} m/min)` : '—'}
            </span>
          </div>

          <div className={`${styles.resultCard} ${styles.resultCardPrimary}`}>
            <span className={styles.resultLabel}>Linear Feed Rate</span>
            <span className={styles.resultValue}>
              {unit === 'metric'
                ? `${calculations.feedMmpm.toFixed(1)} mm/min`
                : `${calculations.feedIpm.toFixed(2)} IPM`}
            </span>
            <span className={styles.resultSub}>
              {unit === 'metric'
                ? `(${calculations.feedIpm.toFixed(2)} IPM)`
                : `(${calculations.feedMmpm.toFixed(1)} mm/min)`}
            </span>
          </div>

          {tab !== 'tapping' && (
            <div className={styles.resultCard}>
              <span className={styles.resultLabel}>Tooth Chip Load</span>
              <span className={styles.resultValue}>
                {unit === 'metric'
                  ? `${(calculations.actualChipLoad * 25.4).toFixed(3)} mm`
                  : `${calculations.actualChipLoad.toFixed(4)} in`}
              </span>
              <span className={styles.resultSub}>Per tooth advance</span>
            </div>
          )}

          {(tab === 'milling' || tab === 'routing') && (
            <div className={styles.resultCard}>
              <span className={styles.resultLabel}>Material Removal (MRR)</span>
              <span className={styles.resultValue}>
                {unit === 'metric'
                  ? `${(calculations.mrrMm3 / 1000).toFixed(1)} cm³/min`
                  : `${calculations.mrrIn3.toFixed(2)} in³/min`}
              </span>
              <span className={styles.resultSub}>Volume swept per minute</span>
            </div>
          )}
        </div>

        {/* Chip Thinning Callout when WOC < 50% tool diameter */}
        {calculations.thinningFactor > 1.02 && (tab === 'milling' || tab === 'routing') && (
          <div className={styles.thinningCard}>
            <div className={styles.thinningTitle}>
              ⚡ Radial Chip Thinning Active ({calculations.thinningFactor.toFixed(2)}× Multiplier)
            </div>
            <div className={styles.thinningText}>
              Because width of cut ({calculations.woc} {unit === 'metric' ? 'mm' : 'in'}) is less than 50% cutter diameter, the physical chip is thinner than programmed. To maintain true chip thickness and avoid tool rubbing, boost feed rate to{' '}
              <strong>
                {unit === 'metric'
                  ? `${calculations.adjustedFeedMmpm.toFixed(1)} mm/min`
                  : `${calculations.adjustedFeedIpm.toFixed(2)} IPM`}
              </strong>
              .
            </div>
          </div>
        )}

        {/* Dynamic Summary Sentence (from Spec §3.5) */}
        <div className={styles.summaryBanner}>
          {tab === 'milling' && (
            <>
              A <strong>{millDia}&quot;</strong>, <strong>{millFlutes}-flute</strong> cutter at{' '}
              <strong>{millSfm} SFM</strong> runs at <strong>{calculations.spindleRpm.toLocaleString()} RPM</strong>; at{' '}
              <strong>{millChipLoad} in</strong> per tooth the feed is{' '}
              <strong>{calculations.feedIpm.toFixed(1)} inches per minute</strong> (
              {calculations.feedMmpm.toFixed(0)} mm/min). These are starting values; make a test cut.
            </>
          )}
          {tab === 'routing' && (
            <>
              A <strong>{routerDia}&quot;</strong> router bit with <strong>{routerFlutes} flutes</strong> at{' '}
              <strong>{calculations.spindleRpm.toLocaleString()} RPM</strong> feeds at{' '}
              <strong>{calculations.feedIpm.toFixed(1)} IPM</strong> (
              {calculations.feedMmpm.toFixed(0)} mm/min) to achieve{' '}
              <strong>{routerChipLoad} in/tooth</strong> chip load. Ensure dust extraction is running.
            </>
          )}
          {tab === 'drilling' && (
            <>
              A <strong>{drillDia}&quot;</strong> drill at <strong>{drillSfm} SFM</strong> runs at{' '}
              <strong>{calculations.spindleRpm.toLocaleString()} RPM</strong> with a feed rate of{' '}
              <strong>{calculations.feedIpm.toFixed(2)} IPM</strong> at {drillIpr} in/rev.
            </>
          )}
          {tab === 'tapping' && (
            <>
              Tapping at <strong>{tapRpm} RPM</strong> requires a synchronized linear feed of{' '}
              <strong>{calculations.feedIpm.toFixed(2)} IPM</strong> ({calculations.feedMmpm.toFixed(1)} mm/min) to exactly match thread lead.
            </>
          )}
        </div>

        {/* Printable CNC Setup Card */}
        <div className={styles.setupCard}>
          <div className={styles.setupHeader}>
            <span className={styles.setupTitle}>📋 CNC Machine Setup Card</span>
            <button type="button" onClick={handlePrint} className={styles.printBtn}>
              🖨️ Print Setup Sheet
            </button>
          </div>
          <div className={styles.setupGrid}>
            <div className={styles.setupItem}>
              <span className={styles.setupItemLabel}>Operation</span>
              <span className={styles.setupItemValue}>
                {tab === 'milling' && 'Milling Profile / Pocket'}
                {tab === 'routing' && 'CNC Wood / Plastic Routing'}
                {tab === 'drilling' && 'Hole Drilling'}
                {tab === 'tapping' && 'Rigid / Floating Tapping'}
              </span>
            </div>
            <div className={styles.setupItem}>
              <span className={styles.setupItemLabel}>Tool Description</span>
              <span className={styles.setupItemValue}>
                {tab === 'milling' && `${millDia}" ${millToolType} (${millFlutes} Flutes)`}
                {tab === 'routing' && `${routerDia}" ${routerToolType} (${routerFlutes} Flutes)`}
                {tab === 'drilling' && `${drillDia}" Twist Drill`}
                {tab === 'tapping' && `${tapDia}" Tap (${tapStandard === 'inch' ? `${tapTpi} TPI` : `${tapMetricPitch}mm pitch`})`}
              </span>
            </div>
            <div className={styles.setupItem}>
              <span className={styles.setupItemLabel}>Programmed Spindle Speed</span>
              <span className={styles.setupItemValue}>{calculations.spindleRpm.toLocaleString()} RPM</span>
            </div>
            <div className={styles.setupItem}>
              <span className={styles.setupItemLabel}>Programmed Feed Rate</span>
              <span className={styles.setupItemValue}>
                {calculations.feedIpm.toFixed(2)} IPM / {calculations.feedMmpm.toFixed(0)} mm/min
              </span>
            </div>
            <div className={styles.setupItem}>
              <span className={styles.setupItemLabel}>Cut Depths</span>
              <span className={styles.setupItemValue}>
                WOC: {calculations.woc} {unit === 'metric' ? 'mm' : 'in'} | DOC: {calculations.doc}{' '}
                {unit === 'metric' ? 'mm' : 'in'}
              </span>
            </div>
            <div className={styles.setupItem}>
              <span className={styles.setupItemLabel}>Coolant / Lubrication</span>
              <span className={styles.setupItemValue}>Flood, Mist / Air Blast, or MQL as recommended</span>
            </div>
          </div>
        </div>

        {/* Router Troubleshooting Reference */}
        {tab === 'routing' && (
          <div className={styles.troubleWrapper}>
            <table className={styles.troubleTable}>
              <thead>
                <tr>
                  <th>Symptom</th>
                  <th>Primary Root Cause</th>
                  <th>Corrective Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.troubleIssue}>Burning / Smoke</td>
                  <td>Chip load too low; bit is rubbing and generating friction heat</td>
                  <td>Increase feed rate or decrease spindle RPM; check for dull bit</td>
                </tr>
                <tr>
                  <td className={styles.troubleIssue}>Chatter / Vibration</td>
                  <td>Bit deflection, excessive tool stickout, or chip overload</td>
                  <td>Decrease DOC, shorten tool stickout, or check workpiece clamping</td>
                </tr>
                <tr>
                  <td className={styles.troubleIssue}>Fuzzy / Torn Edges</td>
                  <td>Incorrect flute geometry or cut direction</td>
                  <td>Use downcut or compression bit; ensure climb milling where supported</td>
                </tr>
                <tr>
                  <td className={styles.troubleIssue}>Fine Dust instead of Chips</td>
                  <td>Severe chip thinning or excessive RPM relative to feed</td>
                  <td>Speed up table feed; single-flute bits help on high-RPM routers</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
