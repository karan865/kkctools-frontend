'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import RatioInputGuide from './RatioInputGuide';
import styles from './RatioCalculator.module.css';
import {
  parseRatioTerm,
  simplifyRatio,
  solveProportion,
  splitTotalByRatio,
  generateEquivalents,
  areRatiosEquivalent,
  ratioToFractionsAndPercentages,
} from '@/lib/ratio-engine';

type TabType = 'simplify' | 'solve' | 'split' | 'equivalent' | 'fraction';

const TABS: TabItem<TabType>[] = [
  { id: 'simplify', label: '1. Simplify Ratio' },
  { id: 'solve', label: '2. Solve for X' },
  { id: 'split', label: '3. Split a Total' },
  { id: 'equivalent', label: '4. Equivalent Ratios' },
  { id: 'fraction', label: '5. Ratio → Fraction & %' },
];

interface MixPreset {
  name: string;
  terms: string[];
  unit: string;
  total: number;
}

const MIX_PRESETS: MixPreset[] = [
  { name: 'Concrete mix (example)', terms: ['1', '2', '3'], unit: 'parts', total: 60 },
  { name: 'Masonry mortar (example)', terms: ['1', '3'], unit: 'parts', total: 40 },
  { name: 'Epoxy resin (example 2:1)', terms: ['2', '1'], unit: 'fl oz', total: 30 },
  { name: 'Epoxy resin (example 1:1)', terms: ['1', '1'], unit: 'fl oz', total: 32 },
  { name: '2-Stroke fuel (example 50:1)', terms: ['50', '1'], unit: 'fl oz', total: 102 },
];

export default function RatioCalculator() {
  const id = useId();
  const [tab, setTab] = useState<TabType>('simplify');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Read ?tab= from URL on load
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

  // --- Tab 1: Simplify State ---
  const [simplifyTerms, setSimplifyTerms] = useState<string[]>(['12', '18']);

  const parsedSimplifyTerms = useMemo(() => {
    return simplifyTerms.map((t) => parseRatioTerm(t) ?? 0);
  }, [simplifyTerms]);

  const simplifyResult = useMemo(() => {
    return simplifyRatio(parsedSimplifyTerms);
  }, [parsedSimplifyTerms]);

  const addSimplifyTerm = () => {
    if (simplifyTerms.length < 6) {
      setSimplifyTerms([...simplifyTerms, '']);
    }
  };

  const removeSimplifyTerm = (index: number) => {
    if (simplifyTerms.length > 2) {
      setSimplifyTerms(simplifyTerms.filter((_, i) => i !== index));
    }
  };

  // --- Tab 2: Solve for X State ---
  const [solveA, setSolveA] = useState<string>('2');
  const [solveB, setSolveB] = useState<string>('3');
  const [solveC, setSolveC] = useState<string>('10');
  const [solveUnknown, setSolveUnknown] = useState<'A' | 'B' | 'C' | 'D'>('D');
  const [solveD, setSolveD] = useState<string>('');

  const solveResult = useMemo(() => {
    const valA = solveUnknown === 'A' ? null : parseRatioTerm(solveA);
    const valB = solveUnknown === 'B' ? null : parseRatioTerm(solveB);
    const valC = solveUnknown === 'C' ? null : parseRatioTerm(solveC);
    const valD = solveUnknown === 'D' ? null : parseRatioTerm(solveD);

    return solveProportion([valA, valB], [valC, valD]);
  }, [solveA, solveB, solveC, solveD, solveUnknown]);

  // --- Tab 3: Split Total State ---
  const [splitTotal, setSplitTotal] = useState<number>(60);
  const [splitUnit, setSplitUnit] = useState<string>('kg');
  const [splitTerms, setSplitTerms] = useState<string[]>(['1', '2', '3']);

  const parsedSplitTerms = useMemo(() => {
    return splitTerms.map((t) => parseRatioTerm(t) ?? 0);
  }, [splitTerms]);

  const splitResult = useMemo(() => {
    return splitTotalByRatio(splitTotal, parsedSplitTerms, splitUnit);
  }, [splitTotal, parsedSplitTerms, splitUnit]);

  const applyPreset = (preset: MixPreset) => {
    setSplitTerms([...preset.terms]);
    setSplitUnit(preset.unit);
    setSplitTotal(preset.total);
  };

  const addSplitTerm = () => {
    if (splitTerms.length < 6) {
      setSplitTerms([...splitTerms, '1']);
    }
  };

  const removeSplitTerm = (index: number) => {
    if (splitTerms.length > 2) {
      setSplitTerms(splitTerms.filter((_, i) => i !== index));
    }
  };

  // --- Tab 4: Equivalents State ---
  const [eqTerm1, setEqTerm1] = useState<string>('5');
  const [eqTerm2, setEqTerm2] = useState<string>('2');
  const [check1A, setCheck1A] = useState<string>('4');
  const [check1B, setCheck1B] = useState<string>('6');
  const [check2A, setCheck2A] = useState<string>('6');
  const [check2B, setCheck2B] = useState<string>('9');

  const parsedEqTerms = useMemo(() => {
    const t1 = parseRatioTerm(eqTerm1) ?? 5;
    const t2 = parseRatioTerm(eqTerm2) ?? 2;
    return [t1, t2];
  }, [eqTerm1, eqTerm2]);

  const equivalentsList = useMemo(() => {
    return generateEquivalents(parsedEqTerms, 10);
  }, [parsedEqTerms]);

  const checkEquivalenceResult = useMemo(() => {
    const r1 = [parseRatioTerm(check1A) ?? 0, parseRatioTerm(check1B) ?? 0];
    const r2 = [parseRatioTerm(check2A) ?? 0, parseRatioTerm(check2B) ?? 0];
    return areRatiosEquivalent(r1, r2);
  }, [check1A, check1B, check2A, check2B]);

  // --- Tab 5: Fraction & % State ---
  const [fracTerm1, setFracTerm1] = useState<string>('3');
  const [fracTerm2, setFracTerm2] = useState<string>('4');

  const fractionResult = useMemo(() => {
    const t1 = parseRatioTerm(fracTerm1) ?? 3;
    const t2 = parseRatioTerm(fracTerm2) ?? 4;
    return ratioToFractionsAndPercentages([t1, t2]);
  }, [fracTerm1, fracTerm2]);

  // Copy result action
  const handleCopy = () => {
    let textToCopy = '';
    if (tab === 'simplify' && simplifyResult) {
      textToCopy = `Simplified Ratio: ${simplifyResult.ratioString} (1:n: ${simplifyResult.oneToN})`;
    } else if (tab === 'solve' && solveResult) {
      textToCopy = `Solved Value: x = ${solveResult.xValue} (${solveResult.stepExplanation})`;
    } else if (tab === 'split' && splitResult) {
      textToCopy = `Split Total (${splitResult.total} ${splitResult.unit}): ${splitResult.shares.map((s, i) => `Part ${i + 1}: ${s.amount} ${splitResult.unit} (${s.percentage}%)`).join(', ')}`;
    } else if (tab === 'equivalent') {
      textToCopy = `Equivalent Ratios for ${parsedEqTerms.join(':')}: ${equivalentsList.map((e) => e.terms.join(':')).join(', ')}`;
    } else if (tab === 'fraction' && fractionResult) {
      textToCopy = `Part of whole shares: Part 1 = ${fractionResult.partOfWhole[0]?.percentage}%, Part 2 = ${fractionResult.partOfWhole[1]?.percentage}%`;
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={tab} onChange={handleTabChange} ariaLabel="Ratio calculator functions" />

      {/* Input Guide Diagram */}
      <RatioInputGuide
        tab={tab}
        terms={tab === 'split' ? parsedSplitTerms : tab === 'equivalent' ? parsedEqTerms : parsedSimplifyTerms}
        solveRatio1={[
          solveUnknown === 'A' ? null : parseRatioTerm(solveA),
          solveUnknown === 'B' ? null : parseRatioTerm(solveB),
        ]}
        solveRatio2={[
          solveUnknown === 'C' ? null : parseRatioTerm(solveC),
          solveUnknown === 'D' ? null : parseRatioTerm(solveD),
        ]}
        total={splitTotal}
        unit={splitUnit}
        focusedField={focusedField}
      />

      {/* TAB 1: SIMPLIFY */}
      {tab === 'simplify' && (
        <>
          <div className={styles.inputCard}>
          <div className={styles.grid}>
            {simplifyTerms.map((term, index) => (
              <div key={index} className={styles.field}>
                <label htmlFor={`${id}-term-${index}`} className={styles.label}>
                  <span className={styles.badge}>{index + 1}</span> Term {index + 1}
                </label>
                <input
                  id={`${id}-term-${index}`}
                  type="text"
                  className={styles.input}
                  value={term}
                  onChange={(e) => {
                    const next = [...simplifyTerms];
                    next[index] = e.target.value;
                    setSimplifyTerms(next);
                  }}
                  onFocus={() => setFocusedField(`term${index}`)}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. 12, 1.5, or 1/2"
                />
                <span className={styles.inputHint}>Whole numbers, decimals or fractions</span>
              </div>
            ))}
          </div>

          <div className={styles.termActions}>
            {simplifyTerms.length < 6 && (
              <button type="button" className={styles.actionBtn} onClick={addSimplifyTerm}>
                + Add Term (up to 6)
              </button>
            )}
            {simplifyTerms.length > 2 && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => removeSimplifyTerm(simplifyTerms.length - 1)}
              >
                &minus; Remove Last Term
              </button>
            )}
          </div>

          </div>

          {!simplifyResult && simplifyTerms.every((t) => t.trim() !== '') && (
            <div className={styles.sentence} role="alert">
              Every term must be a positive number. A ratio term can&apos;t be 0 or negative here; check each box.
            </div>
          )}

          {simplifyResult && (
            <div className={styles.resultsBand}>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Simplified Ratio</div>
                <div className={styles.heroValue}>{simplifyResult.ratioString}</div>
                <div className={styles.heroSub}>
                  1 : n = {simplifyResult.oneToN} &bull; n : 1 = {simplifyResult.nToOne}
                </div>
              </div>

              <div className={styles.sentence}>
                <strong>{simplifyTerms.join(' : ')}</strong> simplifies to{' '}
                <strong>{simplifyResult.ratioString}</strong>
                {simplifyResult.multiplier > 1 ? (
                  <>
                    {' '}after multiplying every term by <strong>{simplifyResult.multiplier}</strong> to clear the fractions or decimals
                    {simplifyResult.gcd > 1 ? <> and dividing by the greatest common factor <strong>{simplifyResult.gcd}</strong></> : null}.
                  </>
                ) : simplifyResult.gcd > 1 ? (
                  <> because all terms divide by the greatest common factor <strong>{simplifyResult.gcd}</strong>.</>
                ) : (
                  <>: the terms share no common factor, so it is already in simplest form.</>
                )}
              </div>

              <div className={styles.stepsBox}>
                <div className={styles.stepsTitle}>Step-by-step simplification</div>
                <ol className={styles.stepList}>
                  {simplifyResult.steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ol>
              </div>

              <div className={styles.actionsBar}>
                <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy result'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: SOLVE FOR X */}
      {tab === 'solve' && (
        <>
          <div className={styles.inputCard}>
          <div className={styles.presetBar}>
            <span className={styles.presetLabel}>Unknown variable:</span>
            {(['A', 'B', 'C', 'D'] as const).map((pos) => (
              <button
                key={pos}
                type="button"
                className={`${styles.presetBtn} ${solveUnknown === pos ? styles.actionBtnActive : ''}`}
                onClick={() => setSolveUnknown(pos)}
              >
                Solve for {pos} ({pos === 'D' ? 'A:B = C:x' : `${pos} is x`})
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${id}-solve-a`} className={styles.label}>
                <span className={styles.badge}>1</span> Term A {solveUnknown === 'A' && '(x)'}
              </label>
              <input
                id={`${id}-solve-a`}
                type="text"
                disabled={solveUnknown === 'A'}
                className={styles.input}
                value={solveUnknown === 'A' ? 'x' : solveA}
                onChange={(e) => setSolveA(e.target.value)}
                onFocus={() => setFocusedField('solveA')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-solve-b`} className={styles.label}>
                <span className={styles.badge}>2</span> Term B {solveUnknown === 'B' && '(x)'}
              </label>
              <input
                id={`${id}-solve-b`}
                type="text"
                disabled={solveUnknown === 'B'}
                className={styles.input}
                value={solveUnknown === 'B' ? 'x' : solveB}
                onChange={(e) => setSolveB(e.target.value)}
                onFocus={() => setFocusedField('solveB')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-solve-c`} className={styles.label}>
                <span className={styles.badge}>3</span> Term C {solveUnknown === 'C' && '(x)'}
              </label>
              <input
                id={`${id}-solve-c`}
                type="text"
                disabled={solveUnknown === 'C'}
                className={styles.input}
                value={solveUnknown === 'C' ? 'x' : solveC}
                onChange={(e) => setSolveC(e.target.value)}
                onFocus={() => setFocusedField('solveC')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-solve-d`} className={styles.label}>
                <span className={styles.badge}>4</span> Term D {solveUnknown === 'D' && '(x)'}
              </label>
              <input
                id={`${id}-solve-d`}
                type="text"
                disabled={solveUnknown === 'D'}
                className={styles.input}
                value={solveUnknown === 'D' ? 'x' : solveD}
                onChange={(e) => setSolveD(e.target.value)}
                onFocus={() => setFocusedField('solveD')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          </div>

          {!solveResult && (
            <div className={styles.sentence} role="alert">
              Enter three positive numbers. A ratio term can&apos;t be 0 or negative when solving for x.
            </div>
          )}

          {solveResult && (
            <div className={styles.resultsBand}>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Solved Unknown Variable</div>
                <div className={styles.heroValue}>x = {solveResult.xValue}</div>
                <div className={styles.heroSub}>
                  Proportion: {solveUnknown === 'A' ? solveResult.xValue : solveA} :{' '}
                  {solveUnknown === 'B' ? solveResult.xValue : solveB} ={' '}
                  {solveUnknown === 'C' ? solveResult.xValue : solveC} :{' '}
                  {solveUnknown === 'D' ? solveResult.xValue : solveD}
                </div>
              </div>

              <div className={styles.sentence}>
                <strong>{solveResult.stepExplanation}</strong>
              </div>

              {solveResult.crossMultiplication && (
                <div className={styles.stepsBox}>
                  <div className={styles.stepsTitle}>Cross-multiplication breakdown</div>
                  <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                    {solveResult.crossMultiplication}
                  </p>
                </div>
              )}

              <div className={styles.actionsBar}>
                <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy result'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 3: SPLIT A TOTAL */}
      {tab === 'split' && (
        <>
          <div className={styles.inputCard}>
          <div className={styles.presetBar}>
            <span className={styles.presetLabel}>Example Presets:</span>
            {MIX_PRESETS.map((pr, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.presetBtn}
                onClick={() => applyPreset(pr)}
              >
                {pr.name}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${id}-split-total`} className={styles.label}>
                <span className={styles.badge}>★</span> Total Amount to Divide
              </label>
              <input
                id={`${id}-split-total`}
                type="number"
                min="0.01"
                step="any"
                className={styles.input}
                value={splitTotal}
                onChange={(e) => setSplitTotal(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-split-unit`} className={styles.label}>
                <span className={styles.badge}>🏷️</span> Unit of Measure
              </label>
              <input
                id={`${id}-split-unit`}
                type="text"
                className={styles.input}
                value={splitUnit}
                onChange={(e) => setSplitUnit(e.target.value)}
                placeholder="e.g. kg, lbs, liters, fl oz"
              />
            </div>
          </div>

          <div className={styles.grid} style={{ marginTop: '16px' }}>
            {splitTerms.map((term, index) => (
              <div key={index} className={styles.field}>
                <label htmlFor={`${id}-split-term-${index}`} className={styles.label}>
                  <span className={styles.badge}>{index + 1}</span> Part {index + 1} Ratio
                </label>
                <input
                  id={`${id}-split-term-${index}`}
                  type="text"
                  className={styles.input}
                  value={term}
                  onChange={(e) => {
                    const next = [...splitTerms];
                    next[index] = e.target.value;
                    setSplitTerms(next);
                  }}
                  onFocus={() => setFocusedField(`term${index}`)}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            ))}
          </div>

          <div className={styles.termActions}>
            {splitTerms.length < 6 && (
              <button type="button" className={styles.actionBtn} onClick={addSplitTerm}>
                + Add Part
              </button>
            )}
            {splitTerms.length > 2 && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => removeSplitTerm(splitTerms.length - 1)}
              >
                &minus; Remove Last Part
              </button>
            )}
          </div>

          </div>

          {!splitResult && (
            <div className={styles.sentence} role="alert">
              Enter a total above 0 and ratio parts that are all positive numbers.
            </div>
          )}

          {splitResult && (
            <div className={styles.resultsBand}>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Split Allocation Breakdown</div>
                <div className={styles.heroValue}>
                  {splitResult.shares.map((s) => s.amount).join(' / ')} {splitResult.unit}
                </div>
                <div className={styles.heroSub}>
                  Total: {splitResult.total} {splitResult.unit} &bull; Sum of parts: {splitResult.sumTerms}
                </div>
              </div>

              <div className={styles.sentence}>
                Splitting <strong>{splitResult.total} {splitResult.unit}</strong> into a{' '}
                <strong>{splitTerms.join(' : ')}</strong> ratio gives shares of{' '}
                {splitResult.shares.map((s, i) => (
                  <span key={i}>
                    <strong>{s.amount} {splitResult.unit}</strong> ({s.percentage}%)
                    {i < splitResult.shares.length - 1 ? ', ' : '.'}
                  </span>
                ))}
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Part</th>
                      <th>Ratio Weight</th>
                      <th>Calculated Amount</th>
                      <th>Share of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {splitResult.shares.map((share, i) => (
                      <tr key={i}>
                        <td>Part {i + 1}</td>
                        <td>{share.term} / {splitResult.sumTerms}</td>
                        <td><strong>{share.amount} {splitResult.unit}</strong></td>
                        <td>{share.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.actionsBar}>
                <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy result'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 4: EQUIVALENT RATIOS */}
      {tab === 'equivalent' && (
        <>
          <div className={styles.inputCard}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${id}-eq-1`} className={styles.label}>
                <span className={styles.badge}>1</span> First Term
              </label>
              <input
                id={`${id}-eq-1`}
                type="text"
                className={styles.input}
                value={eqTerm1}
                onChange={(e) => setEqTerm1(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-eq-2`} className={styles.label}>
                <span className={styles.badge}>2</span> Second Term
              </label>
              <input
                id={`${id}-eq-2`}
                type="text"
                className={styles.input}
                value={eqTerm2}
                onChange={(e) => setEqTerm2(e.target.value)}
              />
            </div>
          </div>
          </div>

          <div className={styles.resultsBand}>
            <div className={styles.heroResult}>
              <div className={styles.heroLabel}>Equivalent Ratios for {parsedEqTerms.join(' : ')}</div>
              <div className={styles.heroValue}>
                {equivalentsList.slice(0, 4).map((e) => e.terms.join(':')).join(', ')}...
              </div>
              <div className={styles.heroSub}>Multipliers 1 through 10</div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Multiplier (n)</th>
                    <th>Formula</th>
                    <th>Equivalent Ratio</th>
                    <th>Decimal Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {equivalentsList.map((pair) => (
                    <tr key={pair.multiplier}>
                      <td>× {pair.multiplier}</td>
                      <td>({parsedEqTerms[0]} × {pair.multiplier}) : ({parsedEqTerms[1]} × {pair.multiplier})</td>
                      <td><strong>{pair.terms.join(' : ')}</strong></td>
                      <td>{pair.terms[1] === 0 ? '—' : (pair.terms[0] / pair.terms[1]).toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Check if two ratios are equivalent */}
            <div className={styles.stepsBox} style={{ marginTop: '24px' }}>
              <div className={styles.stepsTitle}>Equivalence Checker Tool</div>
              <p style={{ margin: '0 0 12px', fontSize: '0.88rem', color: varInkSubColor }}>
                Compare any two ratios to check whether they simplify to the same fraction:
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  style={{ width: '60px', padding: '6px' }}
                  value={check1A}
                  onChange={(e) => setCheck1A(e.target.value)}
                  aria-label="Ratio 1 First Term"
                />
                <span>:</span>
                <input
                  type="text"
                  style={{ width: '60px', padding: '6px' }}
                  value={check1B}
                  onChange={(e) => setCheck1B(e.target.value)}
                  aria-label="Ratio 1 Second Term"
                />
                <span style={{ margin: '0 8px', fontWeight: 'bold' }}>vs</span>
                <input
                  type="text"
                  style={{ width: '60px', padding: '6px' }}
                  value={check2A}
                  onChange={(e) => setCheck2A(e.target.value)}
                  aria-label="Ratio 2 First Term"
                />
                <span>:</span>
                <input
                  type="text"
                  style={{ width: '60px', padding: '6px' }}
                  value={check2B}
                  onChange={(e) => setCheck2B(e.target.value)}
                  aria-label="Ratio 2 Second Term"
                />
                <span
                  style={{
                    marginLeft: '12px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    background: checkEquivalenceResult ? 'rgba(13, 148, 136, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: checkEquivalenceResult ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  {checkEquivalenceResult ? '✓ Equivalent' : '✗ Not Equivalent'}
                </span>
              </div>
            </div>

            <div className={styles.actionsBar}>
              <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                {copied ? '✓ Copied' : 'Copy result'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* TAB 5: FRACTION & % */}
      {tab === 'fraction' && (
        <>
          <div className={styles.inputCard}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${id}-frac-1`} className={styles.label}>
                <span className={styles.badge}>1</span> First Term
              </label>
              <input
                id={`${id}-frac-1`}
                type="text"
                className={styles.input}
                value={fracTerm1}
                onChange={(e) => setFracTerm1(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-frac-2`} className={styles.label}>
                <span className={styles.badge}>2</span> Second Term
              </label>
              <input
                id={`${id}-frac-2`}
                type="text"
                className={styles.input}
                value={fracTerm2}
                onChange={(e) => setFracTerm2(e.target.value)}
              />
            </div>
          </div>

          </div>

          {fractionResult && (
            <div className={styles.resultsBand}>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Part-of-Whole Shares</div>
                <div className={styles.heroValue}>
                  {fractionResult.partOfWhole[0]?.percentage}% / {fractionResult.partOfWhole[1]?.percentage}%
                </div>
                <div className={styles.heroSub}>
                  Fractions: {fractionResult.partOfWhole[0]?.fraction} and {fractionResult.partOfWhole[1]?.fraction} (Sum = 100%)
                </div>
              </div>

              <div className={styles.sentence}>
                In a <strong>{fracTerm1} : {fracTerm2}</strong> ratio, the total consists of{' '}
                <strong>{(parseRatioTerm(fracTerm1) ?? 0) + (parseRatioTerm(fracTerm2) ?? 0)} parts</strong>. Part 1 represents{' '}
                <strong>{fractionResult.partOfWhole[0]?.fraction} ({fractionResult.partOfWhole[0]?.percentage}%)</strong> and Part 2 represents{' '}
                <strong>{fractionResult.partOfWhole[1]?.fraction} ({fractionResult.partOfWhole[1]?.percentage}%)</strong> of the whole.
              </div>

              <div className={styles.stepsBox}>
                <div className={styles.stepsTitle}>Understanding the Two Ratio Meanings</div>
                <ul className={styles.stepList}>
                  <li>
                    <strong>Part-of-Whole (Standard Proportion):</strong> Each part divided by the sum of parts ({(parseRatioTerm(fracTerm1) ?? 0)} / {(parseRatioTerm(fracTerm1) ?? 0) + (parseRatioTerm(fracTerm2) ?? 0)} = {fractionResult.partOfWhole[0]?.percentage}%). This is used for mixes, recipes, and budget allocation.
                  </li>
                  <li>
                    <strong>Part-to-Part Comparison:</strong> First term divided directly by the second term ({fracTerm1} / {fracTerm2} = {fractionResult.partToPart.percentage}%). This measures relative size between the two items, not share of the whole.
                  </li>
                </ul>
              </div>

              <div className={styles.actionsBar}>
                <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy result'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const varInkSubColor = 'var(--ink-soft)';
