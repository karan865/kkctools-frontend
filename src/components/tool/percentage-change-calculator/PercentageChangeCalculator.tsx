'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import s from './PercentageChangeCalculator.module.css';
import PercentDiagram from './PercentDiagram';
import {
  pctChange,
  pctDifference,
  applyPct,
  reversePct,
  pctOf,
  whatPct,
  ppDifference,
  listChanges,
  excelFormula,
  formatPct,
  formatNumber,
  ListPair,
  ExcelMode,
} from '@/lib/percent-engine';

export type TabId =
  | 'change'
  | 'difference'
  | 'increase-decrease'
  | 'find-original'
  | 'pct-of'
  | 'what-pct'
  | 'percentage-points'
  | 'list';

interface TabConfig {
  id: TabId;
  label: string;
  hash: string;
  excelMode: ExcelMode;
}

const TABS: TabConfig[] = [
  { id: 'change', label: '% Change (Old → New)', hash: '#change', excelMode: 'change' },
  { id: 'difference', label: '% Difference (Symmetric)', hash: '#difference', excelMode: 'difference' },
  { id: 'increase-decrease', label: 'Increase / Decrease by %', hash: '#increase-decrease', excelMode: 'increaseBy' },
  { id: 'find-original', label: 'Find Original (Reverse)', hash: '#find-original', excelMode: 'original' },
  { id: 'pct-of', label: 'X% of Y', hash: '#pct-of', excelMode: 'pctOf' },
  { id: 'what-pct', label: 'X is what % of Y', hash: '#what-pct', excelMode: 'whatPct' },
  { id: 'percentage-points', label: 'Percentage Points (pp)', hash: '#percentage-points', excelMode: 'change' },
  { id: 'list', label: 'List Mode (Batch Pairs)', hash: '#list', excelMode: 'change' },
];

export default function PercentageChangeCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>('change');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Tab 1: % Change
  const [changeOld, setChangeOld] = useState<string>('80');
  const [changeNew, setChangeNew] = useState<string>('100');

  // Tab 2: % Difference
  const [diffVal1, setDiffVal1] = useState<string>('80');
  const [diffVal2, setDiffVal2] = useState<string>('100');

  // Tab 3: Increase / Decrease by %
  const [incBase, setIncBase] = useState<string>('100');
  const [incPct, setIncPct] = useState<string>('15');
  const [incIsDecrease, setIncIsDecrease] = useState<boolean>(false);

  // Tab 4: Find Original
  const [revFinal, setRevFinal] = useState<string>('115');
  const [revPct, setRevPct] = useState<string>('15');
  const [revIsDecrease, setRevIsDecrease] = useState<boolean>(false);

  // Tab 5: X% of Y
  const [pctOfP, setPctOfP] = useState<string>('20');
  const [pctOfY, setPctOfY] = useState<string>('150');

  // Tab 6: X is what % of Y
  const [whatX, setWhatX] = useState<string>('35');
  const [whatY, setWhatY] = useState<string>('140');

  // Tab 7: Percentage Points
  const [ppRateA, setPpRateA] = useState<string>('4');
  const [ppRateB, setPpRateB] = useState<string>('5');

  // Tab 8: List Mode
  const [listRows, setListRows] = useState<ListPair[]>([
    { oldVal: 80, newVal: 100, label: 'Product A' },
    { oldVal: 50, newVal: 40, label: 'Product B' },
    { oldVal: 1000, newVal: 1100, label: 'Product C' },
  ]);

  // Excel Cell Customization
  const [excelOldCell, setExcelOldCell] = useState<string>('A2');
  const [excelNewCell, setExcelNewCell] = useState<string>('B2');

  // Sync hash and query parameters on mount and hashchange
  useEffect(() => {
    const syncFromUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const matchedTab = TABS.find((t) => t.hash.toLowerCase() === hash);
      if (matchedTab) {
        setActiveTab(matchedTab.id);
      }

      const params = new URLSearchParams(window.location.search);
      const queryTab = params.get('tab') as TabId;
      if (queryTab && TABS.some((t) => t.id === queryTab)) {
        setActiveTab(queryTab);
      }
      const qOld = params.get('old');
      const qNew = params.get('new');
      if (qOld !== null && !isNaN(Number(qOld))) setChangeOld(qOld);
      if (qNew !== null && !isNaN(Number(qNew))) setChangeNew(qNew);
    };

    window.addEventListener('hashchange', syncFromUrl);
    const timer = setTimeout(syncFromUrl, 0);

    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      clearTimeout(timer);
    };
  }, []);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    const targetTab = TABS.find((t) => t.id === tabId);
    if (targetTab && typeof window !== 'undefined') {
      window.history.replaceState(null, '', targetTab.hash);
    }
  };

  const copyToClipboard = useCallback((text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2500);
    }
  }, []);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    if (activeTab === 'change') {
      url.searchParams.set('old', changeOld);
      url.searchParams.set('new', changeNew);
    }
    copyToClipboard(url.toString(), 'Share Link');
  };

  // Calculations for Tab 1: % Change
  const cOldNum = parseFloat(changeOld) || 0;
  const cNewNum = parseFloat(changeNew) || 0;
  const cResult = useMemo(() => pctChange(cOldNum, cNewNum), [cOldNum, cNewNum]);
  const cAbsChange = cNewNum - cOldNum;

  // Calculations for Tab 2: % Difference
  const dVal1Num = parseFloat(diffVal1) || 0;
  const dVal2Num = parseFloat(diffVal2) || 0;
  const dResult = useMemo(() => pctDifference(dVal1Num, dVal2Num), [dVal1Num, dVal2Num]);
  const dAvg = (Math.abs(dVal1Num) + Math.abs(dVal2Num)) / 2;
  const dAbsDiff = Math.abs(dVal1Num - dVal2Num);

  // Calculations for Tab 3: Increase / Decrease by %
  const incBaseNum = parseFloat(incBase) || 0;
  const incPctNum = parseFloat(incPct) || 0;
  const effectivePct = incIsDecrease ? -Math.abs(incPctNum) : Math.abs(incPctNum);
  const incResult = useMemo(() => applyPct(incBaseNum, effectivePct), [incBaseNum, effectivePct]);
  const incDelta = incResult - incBaseNum;

  // Calculations for Tab 4: Reverse %
  const revFinalNum = parseFloat(revFinal) || 0;
  const revPctNum = parseFloat(revPct) || 0;
  const effectiveRevPct = revIsDecrease ? -Math.abs(revPctNum) : Math.abs(revPctNum);
  const revResult = useMemo(() => reversePct(revFinalNum, effectiveRevPct), [revFinalNum, effectiveRevPct]);
  const revDelta = revResult !== null ? revFinalNum - revResult : 0;

  // Calculations for Tab 5: X% of Y
  const pOfPNum = parseFloat(pctOfP) || 0;
  const pOfYNum = parseFloat(pctOfY) || 0;
  const pOfResult = useMemo(() => pctOf(pOfPNum, pOfYNum), [pOfPNum, pOfYNum]);

  // Calculations for Tab 6: X is what % of Y
  const whatXNum = parseFloat(whatX) || 0;
  const whatYNum = parseFloat(whatY) || 0;
  const whatResult = useMemo(() => whatPct(whatXNum, whatYNum), [whatXNum, whatYNum]);

  // Calculations for Tab 7: Percentage Points
  const ppANum = parseFloat(ppRateA) || 0;
  const ppBNum = parseFloat(ppRateB) || 0;
  const ppResult = useMemo(() => ppDifference(ppANum, ppBNum), [ppANum, ppBNum]);

  // Calculations for Tab 8: List Mode
  const listResult = useMemo(() => listChanges(listRows), [listRows]);

  const updateListRow = (idx: number, field: keyof ListPair, value: string | number) => {
    setListRows((prev) => {
      const next = [...prev];
      if (field === 'label') {
        next[idx] = { ...next[idx], label: String(value) };
      } else {
        const num = parseFloat(String(value)) || 0;
        next[idx] = { ...next[idx], [field]: num };
      }
      return next;
    });
  };

  const addListRow = () => {
    setListRows((prev) => [
      ...prev,
      { oldVal: 100, newVal: 120, label: `Item ${prev.length + 1}` },
    ]);
  };

  const removeListRow = (idx: number) => {
    setListRows((prev) => prev.filter((_, i) => i !== idx));
  };

  // Excel formula for current tab
  const activeTabConfig = TABS.find((t) => t.id === activeTab) || TABS[0];
  const activeExcel = useMemo(
    () =>
      excelFormula(activeTabConfig.excelMode, {
        oldCell: excelOldCell,
        newCell: excelNewCell,
      }),
    [activeTabConfig.excelMode, excelOldCell, excelNewCell]
  );

  // Active Diagram Data for Visual Takeoff Card
  const diagramData = useMemo(() => {
    switch (activeTab) {
      case 'change':
        return {
          valOld: cOldNum,
          valNew: cNewNum,
          labelOld: 'Initial (Old)',
          labelNew: 'Final (New)',
          pct: cResult,
          unit: '',
          modeLabel: 'Side-by-side proportional scaling and relative delta shift',
        };
      case 'difference':
        return {
          valOld: dVal1Num,
          valNew: dVal2Num,
          labelOld: 'Value A',
          labelNew: 'Value B',
          pct: dResult,
          unit: '',
          modeLabel: 'Symmetric relative difference between two values',
        };
      case 'increase-decrease':
        return {
          valOld: incBaseNum,
          valNew: incResult,
          labelOld: 'Starting Value',
          labelNew: 'Resulting Amount',
          pct: effectivePct,
          unit: '',
          modeLabel: incIsDecrease ? 'Value reduction step (−)' : 'Value increase step (+)',
        };
      case 'find-original':
        return {
          valOld: revResult ?? 0,
          valNew: revFinalNum,
          labelOld: 'Original Base',
          labelNew: 'Final Value',
          pct: effectiveRevPct,
          unit: '',
          modeLabel: 'Recovered starting value before percentage change',
        };
      case 'percentage-points':
        return {
          valOld: ppANum,
          valNew: ppBNum,
          labelOld: 'Initial Rate',
          labelNew: 'New Rate',
          pct: ppResult.percent,
          unit: '%',
          modeLabel: 'Percentage points (pp) difference vs relative surge',
        };
      case 'pct-of':
        return {
          valOld: pOfYNum,
          valNew: pOfResult,
          labelOld: 'Total Whole (100%)',
          labelNew: `${pOfPNum}% Portion`,
          pct: pOfPNum,
          unit: '',
          modeLabel: `Portion extracted from total: ${pOfPNum}% of ${pOfYNum}`,
        };
      case 'what-pct':
        return {
          valOld: whatYNum,
          valNew: whatXNum,
          labelOld: 'Whole (100%)',
          labelNew: 'Part (X)',
          pct: whatResult,
          unit: '',
          modeLabel: 'Relative percentage share of a whole',
        };
      case 'list':
        return {
          valOld: listResult.totalOld,
          valNew: listResult.totalNew,
          labelOld: 'Combined Old',
          labelNew: 'Combined New',
          pct: listResult.totalPctChange,
          unit: '',
          modeLabel: 'Total portfolio growth across all rows',
        };
    }
  }, [
    activeTab,
    cOldNum,
    cNewNum,
    cResult,
    dVal1Num,
    dVal2Num,
    dResult,
    incBaseNum,
    incResult,
    effectivePct,
    incIsDecrease,
    revResult,
    revFinalNum,
    effectiveRevPct,
    ppANum,
    ppBNum,
    ppResult.percent,
    pOfYNum,
    pOfResult,
    pOfPNum,
    whatYNum,
    whatXNum,
    whatResult,
    listResult.totalOld,
    listResult.totalNew,
    listResult.totalPctChange,
  ]);

  return (
    <div className={s.wrap} id="calculator-section">
      {/* 8-Tab Switcher */}
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={handleTabChange}
        ariaLabel="Percentage Calculator Modes"
      />

      <div className={s.grid}>
        {/* LEFT COLUMN: Interactive Inputs per Active Tab */}
        <div className={s.inputs}>
          {activeTab === 'change' && (
            <div className={s.card}>
              <div className={s.cardHead}>
                <span className={s.step}>1</span>
                <div>
                  <h3 className={s.cardTitle}>Enter Initial and Final Values</h3>
                  <div className={s.cardSubtitle}>Compute the exact relative percentage change</div>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="change-old" className={s.label}>
                  <span>Initial (Old) Value</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="change-old"
                    type="number"
                    step="any"
                    className={s.input}
                    value={changeOld}
                    onChange={(e) => setChangeOld(e.target.value)}
                    placeholder="e.g. 80"
                  />
                  <span className={s.unitBadge}>Base</span>
                </div>
              </div>

              <div className={s.swapBtnRow}>
                <button
                  type="button"
                  className={s.swapBtn}
                  onClick={() => {
                    const temp = changeOld;
                    setChangeOld(changeNew);
                    setChangeNew(temp);
                  }}
                  title="Swap Initial and Final values"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Swap Old ↔ New
                </button>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="change-new" className={s.label}>
                  <span>Final (New) Value</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="change-new"
                    type="number"
                    step="any"
                    className={s.input}
                    value={changeNew}
                    onChange={(e) => setChangeNew(e.target.value)}
                    placeholder="e.g. 100"
                  />
                  <span className={s.unitBadge}>New</span>
                </div>
              </div>

              <div className={s.chipRow}>
                <span className={s.helperText}>Quick Examples:</span>
                <button
                  type="button"
                  className={s.presetChip}
                  onClick={() => { setChangeOld('80'); setChangeNew('100'); }}
                >
                  80 → 100 (+25%)
                </button>
                <button
                  type="button"
                  className={s.presetChip}
                  onClick={() => { setChangeOld('100'); setChangeNew('80'); }}
                >
                  100 → 80 (−20%)
                </button>
                <button
                  type="button"
                  className={s.presetChip}
                  onClick={() => { setChangeOld('50'); setChangeNew('125'); }}
                >
                  50 → 125 (+150%)
                </button>
                <button
                  type="button"
                  className={s.presetChip}
                  onClick={() => { setChangeOld('50000'); setChangeNew('55000'); }}
                >
                  $50k → $55k (+10% raise)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'difference' && (
            <div className={s.card}>
              <div className={s.cardHead}>
                <span className={s.step}>1</span>
                <div>
                  <h3 className={s.cardTitle}>Enter Two Numbers</h3>
                  <div className={s.cardSubtitle}>
                    Order does not matter: calculates symmetric percentage difference
                  </div>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="diff-val1" className={s.label}>
                  <span>First Number (A)</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="diff-val1"
                    type="number"
                    step="any"
                    className={s.input}
                    value={diffVal1}
                    onChange={(e) => setDiffVal1(e.target.value)}
                  />
                  <span className={s.unitBadge}>Value 1</span>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="diff-val2" className={s.label}>
                  <span>Second Number (B)</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="diff-val2"
                    type="number"
                    step="any"
                    className={s.input}
                    value={diffVal2}
                    onChange={(e) => setDiffVal2(e.target.value)}
                  />
                  <span className={s.unitBadge}>Value 2</span>
                </div>
              </div>

              <p className={s.helperText}>
                Use percentage difference when neither number is the &quot;original&quot; baseline, such as comparing the
                capacities or prices of two competing products.
              </p>
            </div>
          )}

          {activeTab === 'increase-decrease' && (
            <div className={s.card}>
              <div className={s.cardHead}>
                <span className={s.step}>1</span>
                <div>
                  <h3 className={s.cardTitle}>Increase or Decrease by Percentage</h3>
                  <div className={s.cardSubtitle}>Apply a percentage markup, tax, or discount</div>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="inc-base" className={s.label}>
                  <span>Starting Number</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="inc-base"
                    type="number"
                    step="any"
                    className={s.input}
                    value={incBase}
                    onChange={(e) => setIncBase(e.target.value)}
                  />
                  <span className={s.unitBadge}>Amount</span>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label className={s.label}>
                  <span>Operation</span>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className={`${s.presetChip} ${!incIsDecrease ? s.tabActive : ''}`}
                    onClick={() => setIncIsDecrease(false)}
                    style={{ flex: 1, padding: '8px' }}
                  >
                    + Increase (Markup / Tax / Raise)
                  </button>
                  <button
                    type="button"
                    className={`${s.presetChip} ${incIsDecrease ? s.tabActive : ''}`}
                    onClick={() => setIncIsDecrease(true)}
                    style={{ flex: 1, padding: '8px' }}
                  >
                    − Decrease (Discount / Reduction)
                  </button>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="inc-pct" className={s.label}>
                  <span>Percentage to {incIsDecrease ? 'Subtract' : 'Add'}</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="inc-pct"
                    type="number"
                    step="any"
                    className={s.input}
                    value={incPct}
                    onChange={(e) => setIncPct(e.target.value)}
                  />
                  <span className={s.unitBadge}>%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'find-original' && (
            <div className={s.card}>
              <div className={s.cardHead}>
                <span className={s.step}>1</span>
                <div>
                  <h3 className={s.cardTitle}>Find the Original Number (Reverse Math)</h3>
                  <div className={s.cardSubtitle}>Recover initial price before a percentage change occurred</div>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="rev-final" className={s.label}>
                  <span>Final Value (After Change)</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="rev-final"
                    type="number"
                    step="any"
                    className={s.input}
                    value={revFinal}
                    onChange={(e) => setRevFinal(e.target.value)}
                  />
                  <span className={s.unitBadge}>Final</span>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label className={s.label}>
                  <span>Type of Prior Change</span>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className={`${s.presetChip} ${!revIsDecrease ? s.tabActive : ''}`}
                    onClick={() => setRevIsDecrease(false)}
                    style={{ flex: 1, padding: '8px' }}
                  >
                    Was an Increase (+)
                  </button>
                  <button
                    type="button"
                    className={`${s.presetChip} ${revIsDecrease ? s.tabActive : ''}`}
                    onClick={() => setRevIsDecrease(true)}
                    style={{ flex: 1, padding: '8px' }}
                  >
                    Was a Decrease (−)
                  </button>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="rev-pct" className={s.label}>
                  <span>Percentage Rate That Was Applied</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="rev-pct"
                    type="number"
                    step="any"
                    className={s.input}
                    value={revPct}
                    onChange={(e) => setRevPct(e.target.value)}
                  />
                  <span className={s.unitBadge}>%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pct-of' && (
            <div className={s.card}>
              <div className={s.cardHead}>
                <span className={s.step}>1</span>
                <div>
                  <h3 className={s.cardTitle}>Calculate X% of Y</h3>
                  <div className={s.cardSubtitle}>Find the portion or part of a whole</div>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="pctof-p" className={s.label}>
                  <span>Percentage (X)</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="pctof-p"
                    type="number"
                    step="any"
                    className={s.input}
                    value={pctOfP}
                    onChange={(e) => setPctOfP(e.target.value)}
                  />
                  <span className={s.unitBadge}>%</span>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="pctof-y" className={s.label}>
                  <span>Of Total Value (Y)</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="pctof-y"
                    type="number"
                    step="any"
                    className={s.input}
                    value={pctOfY}
                    onChange={(e) => setPctOfY(e.target.value)}
                  />
                  <span className={s.unitBadge}>Total</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'what-pct' && (
            <div className={s.card}>
              <div className={s.cardHead}>
                <span className={s.step}>1</span>
                <div>
                  <h3 className={s.cardTitle}>Calculate X is what % of Y</h3>
                  <div className={s.cardSubtitle}>Find what percentage share one number is of another</div>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="what-x" className={s.label}>
                  <span>Part / Numerator (X)</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="what-x"
                    type="number"
                    step="any"
                    className={s.input}
                    value={whatX}
                    onChange={(e) => setWhatX(e.target.value)}
                  />
                  <span className={s.unitBadge}>Part</span>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="what-y" className={s.label}>
                  <span>Whole / Denominator (Y)</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="what-y"
                    type="number"
                    step="any"
                    className={s.input}
                    value={whatY}
                    onChange={(e) => setWhatY(e.target.value)}
                  />
                  <span className={s.unitBadge}>Whole</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'percentage-points' && (
            <div className={s.card}>
              <div className={s.cardHead}>
                <span className={s.step}>1</span>
                <div>
                  <h3 className={s.cardTitle}>Percentage Points vs Relative Change</h3>
                  <div className={s.cardSubtitle}>Compare interest rates, tax brackets, or poll margins</div>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="pp-rate-a" className={s.label}>
                  <span>Initial Rate (A)</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="pp-rate-a"
                    type="number"
                    step="any"
                    className={s.input}
                    value={ppRateA}
                    onChange={(e) => setPpRateA(e.target.value)}
                  />
                  <span className={s.unitBadge}>%</span>
                </div>
              </div>

              <div className={s.inputGroup}>
                <label htmlFor="pp-rate-b" className={s.label}>
                  <span>New Rate (B)</span>
                </label>
                <div className={s.inputWrap}>
                  <input
                    id="pp-rate-b"
                    type="number"
                    step="any"
                    className={s.input}
                    value={ppRateB}
                    onChange={(e) => setPpRateB(e.target.value)}
                  />
                  <span className={s.unitBadge}>%</span>
                </div>
              </div>

              <p className={s.helperText}>
                Example: If an interest rate moves from 4% to 5%, that is a +1.00 percentage point change, but a +25%
                relative surge in interest cost!
              </p>
            </div>
          )}

          {activeTab === 'list' && (
            <div className={s.card}>
              <div className={s.cardHead}>
                <span className={s.step}>1</span>
                <div>
                  <h3 className={s.cardTitle}>Batch Comparison (List Mode)</h3>
                  <div className={s.cardSubtitle}>Compare multiple old and new pairs at once</div>
                </div>
              </div>

              <div className={s.listTableWrap}>
                <table className={s.listTable}>
                  <thead>
                    <tr>
                      <th>Label (Optional)</th>
                      <th>Initial (Old)</th>
                      <th>Final (New)</th>
                      <th>Change</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {listRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            className={s.listInput}
                            value={row.label || ''}
                            onChange={(e) => updateListRow(idx, 'label', e.target.value)}
                            placeholder={`Item ${idx + 1}`}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className={s.listInput}
                            value={row.oldVal}
                            onChange={(e) => updateListRow(idx, 'oldVal', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className={s.listInput}
                            value={row.newVal}
                            onChange={(e) => updateListRow(idx, 'newVal', e.target.value)}
                          />
                        </td>
                        <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {formatPct(pctChange(row.oldVal, row.newVal))}
                        </td>
                        <td>
                          {listRows.length > 1 && (
                            <button
                              type="button"
                              className={s.removeRowBtn}
                              onClick={() => removeListRow(idx)}
                              title="Delete row"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button type="button" className={s.addRowBtn} onClick={addListRow}>
                + Add Another Row
              </button>

              <div className={s.listExplanation}>
                <strong>Why do the Average and Total differ?</strong>
                <br />
                The arithmetic average gives equal weight to every row, whereas the true total change calculates the net
                growth across the combined sum (weighting larger numbers more).
              </div>
            </div>
          )}

          {/* Excel / Google Sheets Formula Box */}
          <div className={s.excelCard}>
            <div className={s.excelHead}>
              <span className={s.excelTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                Excel &amp; Google Sheets Formula
              </span>
            </div>

            <div className={s.excelCellRow}>
              <span className={s.excelCellLabel}>
                Old Cell:
                <input
                  type="text"
                  maxLength={4}
                  className={s.excelCellInput}
                  value={excelOldCell}
                  onChange={(e) => setExcelOldCell(e.target.value)}
                />
              </span>
              <span className={s.excelCellLabel}>
                New Cell:
                <input
                  type="text"
                  maxLength={4}
                  className={s.excelCellInput}
                  value={excelNewCell}
                  onChange={(e) => setExcelNewCell(e.target.value)}
                />
              </span>
            </div>

            <div className={s.excelCodeRow}>
              <code className={s.excelCode}>{activeExcel.formula}</code>
              <button
                type="button"
                className={s.copyBtn}
                onClick={() => copyToClipboard(activeExcel.formula, 'Excel Formula')}
              >
                {copiedText === 'Excel Formula' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className={s.excelNote}>{activeExcel.note}</div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Display, Math Breakdown & Visuals */}
        <div className={s.results} aria-live="polite">
          {/* TAB 1: % Change Output */}
          {activeTab === 'change' && (
            <>
              <div className={s.hero}>
                <div className={s.heroLabel}>Percentage Change</div>
                <div className={s.heroValue}>
                  {cResult !== null ? formatPct(cResult) : 'Undefined'}
                </div>
                {cResult !== null && (
                  <div
                    className={`${s.heroDirectionBadge} ${
                      cResult > 0 ? s.badgeIncrease : cResult < 0 ? s.badgeDecrease : s.badgeNeutral
                    }`}
                  >
                    {cResult > 0 ? '▲ Increase' : cResult < 0 ? '▼ Decrease' : '● No Change'}
                  </div>
                )}
                <div className={s.heroMetrics}>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(cOldNum)}</span>
                    <span className={s.heroMetricLbl}>Starting Value</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(cNewNum)}</span>
                    <span className={s.heroMetricLbl}>Final Value</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>
                      {cAbsChange > 0 ? `+${formatNumber(cAbsChange)}` : formatNumber(cAbsChange)}
                    </span>
                    <span className={s.heroMetricLbl}>Absolute Change</span>
                  </div>
                </div>
              </div>

              <div className={s.card}>
                <div className={s.snippetBox}>
                  <p className={s.snippetSentence}>
                    {cResult !== null
                      ? `Going from ${formatNumber(cOldNum)} to ${formatNumber(cNewNum)} is a ${formatPct(
                          cResult
                        )} ${cResult >= 0 ? 'increase' : 'decrease'} (an absolute change of ${
                          cAbsChange >= 0 ? `+${formatNumber(cAbsChange)}` : formatNumber(cAbsChange)
                        }).`
                      : `Percent change from 0 is mathematically undefined because division by zero is impossible. The absolute change is +${formatNumber(
                          cNewNum
                        )}.`}
                  </p>
                </div>

                <div className={s.mathBox}>
                  <span className={s.mathLabel}>Step-by-Step Calculation</span>
                  <div className={s.mathFormula}>
                    {cOldNum !== 0
                      ? `((${formatNumber(cNewNum)} − ${formatNumber(cOldNum)}) ÷ |${formatNumber(
                          cOldNum
                        )}|) × 100 = (${formatNumber(cAbsChange)} ÷ ${formatNumber(
                          Math.abs(cOldNum)
                        )}) × 100 = ${formatPct(cResult)}`
                      : `Division by zero: (${formatNumber(cNewNum)} − 0) ÷ 0 = Undefined`}
                  </div>
                  <span className={s.mathNote}>
                    {cOldNum < 0
                      ? 'Note: Starting from a negative uses |old| in the denominator so that moving towards positive values produces a positive percentage increase.'
                      : 'Formula: ((New − Old) ÷ |Old|) × 100'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: % Difference Output */}
          {activeTab === 'difference' && (
            <>
              <div className={s.hero}>
                <div className={s.heroLabel}>Percentage Difference</div>
                <div className={s.heroValue}>
                  {dResult !== null ? `${formatNumber(dResult, 2)}%` : 'Undefined'}
                </div>
                <div className={`${s.heroDirectionBadge} ${s.badgeNeutral}`}>
                  Symmetric Relative Difference
                </div>
                <div className={s.heroMetrics}>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(dVal1Num)}</span>
                    <span className={s.heroMetricLbl}>Value A</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(dVal2Num)}</span>
                    <span className={s.heroMetricLbl}>Value B</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(dAvg, 2)}</span>
                    <span className={s.heroMetricLbl}>Average Base</span>
                  </div>
                </div>
              </div>

              <div className={s.card}>
                <div className={s.snippetBox}>
                  <p className={s.snippetSentence}>
                    The percentage difference between {formatNumber(dVal1Num)} and {formatNumber(dVal2Num)} is{' '}
                    {dResult !== null ? `${formatNumber(dResult, 2)}%` : 'undefined'} (absolute difference of{' '}
                    {formatNumber(dAbsDiff)}).
                  </p>
                </div>

                <div className={s.mathBox}>
                  <span className={s.mathLabel}>Symmetric Formula</span>
                  <div className={s.mathFormula}>
                    |{formatNumber(dVal1Num)} − {formatNumber(dVal2Num)}| ÷ (({formatNumber(dVal1Num)} +{' '}
                    {formatNumber(dVal2Num)}) ÷ 2) × 100 = {formatNumber(dAbsDiff)} ÷ {formatNumber(dAvg, 2)} × 100 ={' '}
                    {dResult !== null ? `${formatNumber(dResult, 2)}%` : '0%'}
                  </div>
                  <span className={s.mathNote}>
                    Order does not matter. The denominator is the average of the two numbers.
                  </span>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: Increase / Decrease by % Output */}
          {activeTab === 'increase-decrease' && (
            <>
              <div className={s.hero}>
                <div className={s.heroLabel}>Resulting Amount</div>
                <div className={s.heroValue}>{formatNumber(incResult, 2)}</div>
                <div
                  className={`${s.heroDirectionBadge} ${
                    incIsDecrease ? s.badgeDecrease : s.badgeIncrease
                  }`}
                >
                  {incIsDecrease ? `−${incPctNum}% Reduction` : `+${incPctNum}% Markup / Increase`}
                </div>
                <div className={s.heroMetrics}>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(incBaseNum)}</span>
                    <span className={s.heroMetricLbl}>Starting Value</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(incResult, 2)}</span>
                    <span className={s.heroMetricLbl}>New Value</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>
                      {incDelta >= 0 ? `+${formatNumber(incDelta, 2)}` : formatNumber(incDelta, 2)}
                    </span>
                    <span className={s.heroMetricLbl}>Net Change</span>
                  </div>
                </div>
              </div>

              <div className={s.card}>
                <div className={s.snippetBox}>
                  <p className={s.snippetSentence}>
                    {incIsDecrease ? 'Decreasing' : 'Increasing'} {formatNumber(incBaseNum)} by {incPctNum}% gives{' '}
                    {formatNumber(incResult, 2)} (a change of{' '}
                    {incDelta >= 0 ? `+${formatNumber(incDelta, 2)}` : formatNumber(incDelta, 2)}).
                  </p>
                </div>

                <div className={s.mathBox}>
                  <span className={s.mathLabel}>Multiplier Method</span>
                  <div className={s.mathFormula}>
                    {formatNumber(incBaseNum)} × (1 {incIsDecrease ? '−' : '+'} {incPctNum} ÷ 100) ={' '}
                    {formatNumber(incBaseNum)} × {formatNumber(1 + effectivePct / 100, 4)} ={' '}
                    {formatNumber(incResult, 2)}
                  </div>
                  <span className={s.mathNote}>
                    Quick multiplier: Multiply by {formatNumber(1 + effectivePct / 100, 2)} directly.
                  </span>
                </div>
              </div>
            </>
          )}

          {/* TAB 4: Find Original Output */}
          {activeTab === 'find-original' && (
            <>
              <div className={s.hero}>
                <div className={s.heroLabel}>Original Baseline Value</div>
                <div className={s.heroValue}>
                  {revResult !== null ? formatNumber(revResult, 2) : 'Undefined'}
                </div>
                <div className={`${s.heroDirectionBadge} ${s.badgeNeutral}`}>
                  Recovered Initial Number
                </div>
                <div className={s.heroMetrics}>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(revFinalNum)}</span>
                    <span className={s.heroMetricLbl}>Final Value</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>
                      {revResult !== null ? formatNumber(revResult, 2) : '—'}
                    </span>
                    <span className={s.heroMetricLbl}>Original Base</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>
                      {revDelta >= 0 ? `+${formatNumber(revDelta, 2)}` : formatNumber(revDelta, 2)}
                    </span>
                    <span className={s.heroMetricLbl}>Difference</span>
                  </div>
                </div>
              </div>

              <div className={s.card}>
                <div className={s.snippetBox}>
                  <p className={s.snippetSentence}>
                    If a number is {formatNumber(revFinalNum)} after a {revPctNum}%{' '}
                    {revIsDecrease ? 'decrease' : 'increase'}, the original starting number was{' '}
                    {revResult !== null ? formatNumber(revResult, 2) : 'undefined'}.
                  </p>
                </div>

                <div className={s.mathBox}>
                  <span className={s.mathLabel}>Reverse Percentage Formula</span>
                  <div className={s.mathFormula}>
                    {formatNumber(revFinalNum)} ÷ (1 {revIsDecrease ? '−' : '+'} {revPctNum} ÷ 100) ={' '}
                    {formatNumber(revFinalNum)} ÷ {formatNumber(1 + effectiveRevPct / 100, 4)} ={' '}
                    {revResult !== null ? formatNumber(revResult, 2) : 'Undefined'}
                  </div>
                  <span className={s.mathNote}>
                    Common mistake: Do NOT subtract {revPctNum}% from the final value. You must divide by (1 + rate).
                  </span>
                </div>
              </div>
            </>
          )}

          {/* TAB 5: X% of Y Output */}
          {activeTab === 'pct-of' && (
            <>
              <div className={s.hero}>
                <div className={s.heroLabel}>Result</div>
                <div className={s.heroValue}>{formatNumber(pOfResult, 2)}</div>
                <div className={`${s.heroDirectionBadge} ${s.badgeNeutral}`}>
                  {pOfPNum}% of {formatNumber(pOfYNum)}
                </div>
                <div className={s.heroMetrics}>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{pOfPNum}%</span>
                    <span className={s.heroMetricLbl}>Percentage</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(pOfYNum)}</span>
                    <span className={s.heroMetricLbl}>Of Total</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(pOfPNum / 100, 4)}</span>
                    <span className={s.heroMetricLbl}>Multiplier</span>
                  </div>
                </div>
              </div>

              <div className={s.card}>
                <div className={s.snippetBox}>
                  <p className={s.snippetSentence}>
                    {pOfPNum}% of {formatNumber(pOfYNum)} is {formatNumber(pOfResult, 2)}.
                  </p>
                </div>

                <div className={s.mathBox}>
                  <span className={s.mathLabel}>Calculation</span>
                  <div className={s.mathFormula}>
                    ({pOfPNum} ÷ 100) × {formatNumber(pOfYNum)} = {formatNumber(pOfPNum / 100, 2)} ×{' '}
                    {formatNumber(pOfYNum)} = {formatNumber(pOfResult, 2)}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 6: X is what % of Y Output */}
          {activeTab === 'what-pct' && (
            <>
              <div className={s.hero}>
                <div className={s.heroLabel}>Percentage Share</div>
                <div className={s.heroValue}>
                  {whatResult !== null ? `${formatNumber(whatResult, 2)}%` : 'Undefined'}
                </div>
                <div className={`${s.heroDirectionBadge} ${s.badgeNeutral}`}>
                  Part ÷ Whole
                </div>
                <div className={s.heroMetrics}>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(whatXNum)}</span>
                    <span className={s.heroMetricLbl}>Part (X)</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(whatYNum)}</span>
                    <span className={s.heroMetricLbl}>Whole (Y)</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>
                      {whatResult !== null ? `${formatNumber(whatResult, 2)}%` : '—'}
                    </span>
                    <span className={s.heroMetricLbl}>Fraction %</span>
                  </div>
                </div>
              </div>

              <div className={s.card}>
                <div className={s.snippetBox}>
                  <p className={s.snippetSentence}>
                    {formatNumber(whatXNum)} is{' '}
                    {whatResult !== null ? `${formatNumber(whatResult, 2)}%` : 'undefined'} of{' '}
                    {formatNumber(whatYNum)}.
                  </p>
                </div>

                <div className={s.mathBox}>
                  <span className={s.mathLabel}>Calculation</span>
                  <div className={s.mathFormula}>
                    ({formatNumber(whatXNum)} ÷ {formatNumber(whatYNum)}) × 100 ={' '}
                    {whatResult !== null ? `${formatNumber(whatResult, 2)}%` : 'Undefined'}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 7: Percentage Points Output */}
          {activeTab === 'percentage-points' && (
            <>
              <div className={s.hero}>
                <div className={s.heroLabel}>Point Difference vs Relative Change</div>
                <div className={s.heroValue}>
                  {ppResult.points >= 0 ? `+${formatNumber(ppResult.points, 2)} pp` : `${formatNumber(ppResult.points, 2)} pp`}
                </div>
                <div
                  className={`${s.heroDirectionBadge} ${
                    (ppResult.percent ?? 0) > 0
                      ? s.badgeIncrease
                      : (ppResult.percent ?? 0) < 0
                      ? s.badgeDecrease
                      : s.badgeNeutral
                  }`}
                >
                  {ppResult.percent !== null ? `${formatPct(ppResult.percent)} Relative Change` : 'No Change'}
                </div>
                <div className={s.heroMetrics}>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{ppANum}%</span>
                    <span className={s.heroMetricLbl}>Rate A</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{ppBNum}%</span>
                    <span className={s.heroMetricLbl}>Rate B</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>
                      {ppResult.points >= 0 ? `+${formatNumber(ppResult.points, 2)}` : formatNumber(ppResult.points, 2)}{' '}
                      pp
                    </span>
                    <span className={s.heroMetricLbl}>Percentage Points</span>
                  </div>
                </div>
              </div>

              <div className={s.card}>
                <div className={s.snippetBox}>
                  <p className={s.snippetSentence}>
                    Moving from {ppANum}% to {ppBNum}% is an absolute difference of{' '}
                    {ppResult.points >= 0 ? `+${formatNumber(ppResult.points, 2)}` : formatNumber(ppResult.points, 2)}{' '}
                    percentage points (pp), which represents a{' '}
                    {ppResult.percent !== null ? formatPct(ppResult.percent) : '0%'}{' '}
                    {(ppResult.percent ?? 0) >= 0 ? 'relative increase' : 'relative decrease'}.
                  </p>
                </div>

                <div className={s.mathBox}>
                  <span className={s.mathLabel}>Two Separate Concepts</span>
                  <div className={s.mathFormula}>
                    1. Absolute Points: {ppBNum}% − {ppANum}% = {formatNumber(ppResult.points, 2)} percentage points
                    <br />
                    2. Relative Change: (({ppBNum} − {ppANum}) ÷ |{ppANum}|) × 100 ={' '}
                    {ppResult.percent !== null ? formatPct(ppResult.percent) : '0%'}
                  </div>
                  <span className={s.mathNote}>
                    Never confuse percentage points with percent. A jump from 4% to 5% is only 1 point, but it represents
                    a 25% increase in your interest payments!
                  </span>
                </div>
              </div>
            </>
          )}

          {/* TAB 8: List Mode Output */}
          {activeTab === 'list' && (
            <>
              <div className={s.hero}>
                <div className={s.heroLabel}>Aggregate Portfolio Change</div>
                <div className={s.heroValue}>
                  {listResult.totalPctChange !== null ? formatPct(listResult.totalPctChange) : '0%'}
                </div>
                <div className={`${s.heroDirectionBadge} ${s.badgeNeutral}`}>
                  Average Item Change: {formatPct(listResult.averagePctChange)}
                </div>
                <div className={s.heroMetrics}>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(listResult.totalOld)}</span>
                    <span className={s.heroMetricLbl}>Total Initial</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>{formatNumber(listResult.totalNew)}</span>
                    <span className={s.heroMetricLbl}>Total Final</span>
                  </div>
                  <div className={s.heroMetricItem}>
                    <span className={s.heroMetricVal}>
                      {listResult.totalAbsChange >= 0
                        ? `+${formatNumber(listResult.totalAbsChange)}`
                        : formatNumber(listResult.totalAbsChange)}
                    </span>
                    <span className={s.heroMetricLbl}>Net Total Delta</span>
                  </div>
                </div>
              </div>

              <div className={s.card}>
                <div className={s.snippetBox}>
                  <p className={s.snippetSentence}>
                    Across {listRows.length} items, the arithmetic average of individual percentage changes is{' '}
                    {formatPct(listResult.averagePctChange)}, while the true net aggregate change of the entire group is{' '}
                    {formatPct(listResult.totalPctChange)}.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Dedicated Card: Interactive Visual Diagram */}
          <div className={s.card}>
            <PercentDiagram
              valOld={diagramData.valOld}
              valNew={diagramData.valNew}
              labelOld={diagramData.labelOld}
              labelNew={diagramData.labelNew}
              pct={diagramData.pct}
              unit={diagramData.unit}
              modeLabel={diagramData.modeLabel}
            />
          </div>

          {/* Action Toolbar */}
          <div className={s.toolbar}>
            <button
              type="button"
              className={s.toolBtn}
              onClick={handleShare}
              title="Copy link to this exact calculation"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              {copiedText === 'Share Link' ? 'Link Copied!' : 'Share URL'}
            </button>

            <button
              type="button"
              className={s.toolBtn}
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
              title="Print calculation sheet"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
