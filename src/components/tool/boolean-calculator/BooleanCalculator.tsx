'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import styles from './BooleanCalculator.module.css';
import BooleanInputGuide from './BooleanInputGuide';
import {
  generateTruthTable,
  checkEquivalence,
  calculateBinaryMath,
  decimalToTwosComplement,
} from '@/lib/boolean-engine';

export default function BooleanCalculator() {
  const [activeTab, setActiveTab] = useState<'simplify' | 'equiv' | 'binary'>('simplify');

  // Open the tab named in ?tab= (shareable links)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const t = new URLSearchParams(window.location.search).get('tab');
        if (t && (['simplify', 'equiv', 'binary'] as string[]).includes(t)) setActiveTab(t as typeof activeTab);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tab 1 state: Simplify & Truth Table
  const [expr, setExpr] = useState('(A AND B) OR (A AND NOT B)');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Tab 2 state: Equivalence
  const [expr1, setExpr1] = useState('NOT(A AND B)');
  const [expr2, setExpr2] = useState('NOT A OR NOT B');

  // Tab 3 state: Binary
  const [binA, setBinA] = useState('1011');
  const [binB, setBinB] = useState('0110');
  const [op, setOp] = useState<'+' | '-' | '*' | '/' | 'AND' | 'OR' | 'XOR'>('+');
  const [bitWidth, setBitWidth] = useState<8 | 16 | 32 | 64>(8);
  const [decInput, setDecInput] = useState('-5');

  // IDs
  const idExpr = useId();
  const idExpr1 = useId();
  const idExpr2 = useId();
  const idBinA = useId();
  const idBinB = useId();
  const idOp = useId();
  const idBitWidth = useId();
  const idDecInput = useId();

  // Tab 1 calculation
  const ttResult = useMemo(() => {
    try {
      return generateTruthTable(expr);
    } catch {
      return null;
    }
  }, [expr]);

  // Tab 2 calculation
  const equivResult = useMemo(() => {
    try {
      return checkEquivalence(expr1, expr2);
    } catch {
      return null;
    }
  }, [expr1, expr2]);

  // Tab 3 calculation
  const binaryResult = useMemo(() => {
    return calculateBinaryMath(binA, binB, op, bitWidth);
  }, [binA, binB, op, bitWidth]);

  // Two's complement decimal convert
  const twosComplResult = useMemo(() => {
    const num = parseInt(decInput, 10);
    if (isNaN(num)) return 'Invalid';
    return decimalToTwosComplement(num, bitWidth <= 32 ? (bitWidth as 8 | 16 | 32) : 32);
  }, [decInput, bitWidth]);

  // Quick insertion helpers for Tab 1
  const insertToken = (token: string) => {
    setExpr((prev) => `${prev} ${token}`.trim());
  };

  // CSV download for Truth Table
  const downloadCSV = () => {
    if (!ttResult) return;
    const headers = [...ttResult.variables, 'Result (F)'];
    const rows = ttResult.rows.map((r) => {
      const vals = ttResult.variables.map((v) => (r.assignment[v] ? '1' : '0'));
      vals.push(r.result ? '1' : '0');
      return vals.join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'truth_table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopyStatus('CSV Downloaded!');
    setTimeout(() => setCopyStatus(null), 2500);
  };

  return (
    <div className={styles.calculatorWrapper}>
      {/* Input Guide Diagram */}
      <BooleanInputGuide
        activeTab={activeTab}
        expression={expr}
        variables={ttResult ? ttResult.variables : ['A', 'B']}
        isEquivalent={equivResult?.isEquivalent ?? true}
        binA={binA}
        binB={binB}
        bitWidth={bitWidth}
      />

      {/* Tabs navigation */}
      <TabSlider
        tabs={[{ id: 'simplify', label: '1. Simplify & Truth Table' }, { id: 'equiv', label: '2. Equivalence Check' }, { id: 'binary', label: '3. Binary & Bitwise Maths' }]}
        activeId={activeTab}
        onChange={(id) => {
          setActiveTab(id as typeof activeTab);
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', id);
            window.history.replaceState({}, '', url.toString());
          } catch {
            /* ignore */
          }
        }}
        ariaLabel="Boolean calculator modes"
      />

      {/* TAB 1: Simplify & Truth Table */}
      {activeTab === 'simplify' && (
        <div className={styles.calcCard}>
          <div className={styles.formGroup}>
            <label htmlFor={idExpr} className={styles.label}>
              <span>Boolean Expression</span>
              <span className={styles.subText}>Supports AND (&amp;, *), OR (|, +), NOT (!, ~), XOR (^)</span>
            </label>
            <div className={styles.inputRow}>
              <input
                id={idExpr}
                type="text"
                className={styles.input}
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                placeholder="e.g. (A AND B) OR (A AND NOT B)"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <div className={styles.quickButtons}>
              <button type="button" className={styles.symbolBtn} onClick={() => insertToken('AND')}>
                AND
              </button>
              <button type="button" className={styles.symbolBtn} onClick={() => insertToken('OR')}>
                OR
              </button>
              <button type="button" className={styles.symbolBtn} onClick={() => insertToken('NOT')}>
                NOT
              </button>
              <button type="button" className={styles.symbolBtn} onClick={() => insertToken('XOR')}>
                XOR
              </button>
              <button type="button" className={styles.symbolBtn} onClick={() => insertToken('(')}>
                (
              </button>
              <button type="button" className={styles.symbolBtn} onClick={() => insertToken(')')}>
                )
              </button>
              <button
                type="button"
                className={styles.symbolBtn}
                onClick={() => setExpr('(A AND B) OR (A AND NOT B)')}
              >
                Reset Example
              </button>
            </div>
          </div>

          {/* Hero Card */}
          {ttResult && (
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Minimal Sum of Products (Quine-McCluskey)</span>
              <div className={styles.heroExpression}>{ttResult.simplifiedSOP}</div>
              <p className={styles.heroBluf}>
                {expr.trim()} simplifies to <strong>{ttResult.simplifiedSOP}</strong>.{' '}
                {ttResult.isTautology
                  ? 'This expression evaluates to 1 (True) for all input variable combinations (Tautology).'
                  : ttResult.isContradiction
                  ? 'This expression evaluates to 0 (False) for all input variable combinations (Contradiction).'
                  : 'Independent inputs have been minimized.'}
              </p>

              <div className={styles.canonicalGrid}>
                <div className={styles.canonicalBox}>
                  <span className={styles.canonicalTitle}>Minterms (SOP)</span>
                  <span className={styles.canonicalVal}>{ttResult.sopString}</span>
                </div>
                <div className={styles.canonicalBox}>
                  <span className={styles.canonicalTitle}>Maxterms (POS)</span>
                  <span className={styles.canonicalVal}>{ttResult.posString}</span>
                </div>
              </div>
            </div>
          )}

          {/* Truth Table */}
          {ttResult && ttResult.variables.length > 0 && (
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <span className={styles.tableTitle}>
                  Truth Table ({ttResult.rows.length} Rows &bull; 2
                  <sup>{ttResult.variables.length}</sup> Combinations)
                </span>
                <button type="button" className={styles.csvBtn} onClick={downloadCSV}>
                  {copyStatus || 'Export CSV (RFC 4180)'}
                </button>
              </div>

              <div className={styles.tableScroll}>
                <table className={styles.truthTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      {ttResult.variables.map((v) => (
                        <th key={v}>{v}</th>
                      ))}
                      <th>Output (F)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ttResult.rows.map((row) => (
                      <tr key={row.index} className={row.result ? styles.mintermHighlight : undefined}>
                        <td>{row.index}</td>
                        {ttResult.variables.map((v) => (
                          <td key={v}>{row.assignment[v] ? '1' : '0'}</td>
                        ))}
                        <td>
                          <span className={row.result ? styles.bitTrue : styles.bitFalse}>
                            {row.result ? '1 (T)' : '0 (F)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Equivalence Check */}
      {activeTab === 'equiv' && (
        <div className={styles.calcCard}>
          <div className={styles.formGroup}>
            <label htmlFor={idExpr1} className={styles.label}>
              <span>Expression 1</span>
            </label>
            <input
              id={idExpr1}
              type="text"
              className={styles.input}
              value={expr1}
              onChange={(e) => setExpr1(e.target.value)}
              placeholder="e.g. NOT(A AND B)"
              spellCheck="false"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={idExpr2} className={styles.label}>
              <span>Expression 2</span>
            </label>
            <input
              id={idExpr2}
              type="text"
              className={styles.input}
              value={expr2}
              onChange={(e) => setExpr2(e.target.value)}
              placeholder="e.g. NOT A OR NOT B"
              spellCheck="false"
            />
          </div>

          {equivResult && (
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Logical Equivalence Proof</span>
              <div className={styles.heroExpression}>
                {equivResult.isEquivalent ? 'Expressions are Equivalent (≡)' : 'Expressions Differ (≢)'}
              </div>
              <p className={styles.heroBluf}>
                {equivResult.isEquivalent
                  ? 'Both boolean expressions yield identical truth value outputs across all input states (e.g. De Morgan\'s Law verification).'
                  : 'A counterexample was detected where Expression 1 and Expression 2 produce differing truth values.'}
              </p>

              {!equivResult.isEquivalent && equivResult.counterexample && (
                <div className={styles.canonicalBox}>
                  <span className={styles.canonicalTitle}>First Counterexample State:</span>
                  <span className={styles.canonicalVal}>
                    {equivResult.variables
                      .map((v) => `${v}=${equivResult.counterexample?.[v] ? '1' : '0'}`)
                      .join(', ')}{' '}
                    &rarr; Expr 1 = {equivResult.val1 ? '1' : '0'}, Expr 2 ={' '}
                    {equivResult.val2 ? '1' : '0'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Binary & Bitwise Maths */}
      {activeTab === 'binary' && (
        <div className={styles.calcCard}>
          <div className={styles.binaryGrid}>
            <div className={styles.formGroup}>
              <label htmlFor={idBinA} className={styles.label}>
                <span>First Binary Number</span>
              </label>
              <input
                id={idBinA}
                type="text"
                className={styles.input}
                value={binA}
                onChange={(e) => setBinA(e.target.value.replace(/[^01]/g, ''))}
                placeholder="e.g. 1011"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={idOp} className={styles.label}>
                <span>Operation</span>
              </label>
              <select
                id={idOp}
                className={styles.input}
                value={op}
                onChange={(e) => setOp(e.target.value as '+' | '-' | '*' | '/' | 'AND' | 'OR' | 'XOR')}
              >
                <option value="+">Addition (+)</option>
                <option value="-">Subtraction (-)</option>
                <option value="*">Multiplication (*)</option>
                <option value="/">Integer Division (/)</option>
                <option value="AND">Bitwise AND (&amp;)</option>
                <option value="OR">Bitwise OR (|)</option>
                <option value="XOR">Bitwise XOR (^)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={idBinB} className={styles.label}>
                <span>Second Binary Number</span>
              </label>
              <input
                id={idBinB}
                type="text"
                className={styles.input}
                value={binB}
                onChange={(e) => setBinB(e.target.value.replace(/[^01]/g, ''))}
                placeholder="e.g. 0110"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={idBitWidth} className={styles.label}>
                <span>Bit Width</span>
              </label>
              <select
                id={idBitWidth}
                className={styles.input}
                value={bitWidth}
                onChange={(e) => setBitWidth(parseInt(e.target.value, 10) as 8 | 16 | 32 | 64)}
              >
                <option value={8}>8-bit byte</option>
                <option value={16}>16-bit word</option>
                <option value={32}>32-bit dword</option>
                <option value={64}>64-bit qword</option>
              </select>
            </div>
          </div>

          {binaryResult && (
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Binary Result ({binaryResult.bitWidth}-bit)</span>
              <div className={styles.heroExpression}>{binaryResult.resultBinary}</div>
              <p className={styles.heroBluf}>
                {binaryResult.binA} ({binaryResult.decA.toString()}) {binaryResult.operation}{' '}
                {binaryResult.binB} ({binaryResult.decB.toString()}) ={' '}
                <strong>
                  {binaryResult.resultBinary} (Dec: {binaryResult.resultDec})
                </strong>
                .{' '}
                {binaryResult.hasOverflow
                  ? 'Overflow occurred beyond register bit width.'
                  : 'Computed with exact precision.'}
              </p>

              <table className={styles.binaryResultTable}>
                <tbody>
                  <tr>
                    <th>Binary</th>
                    <td>{binaryResult.resultBinary}</td>
                  </tr>
                  <tr>
                    <th>Hexadecimal</th>
                    <td>0x{binaryResult.resultHex}</td>
                  </tr>
                  <tr>
                    <th>Unsigned Decimal</th>
                    <td>{binaryResult.resultDec}</td>
                  </tr>
                  <tr>
                    <th>Two&apos;s Complement (Signed)</th>
                    <td>{binaryResult.twoComplementSigned}</td>
                  </tr>
                  <tr>
                    <th>Octal</th>
                    <td>{binaryResult.resultOctal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Quick Decimal to Two's Complement converter */}
          <div className={styles.formGroup}>
            <label htmlFor={idDecInput} className={styles.label}>
              <span>Signed Decimal to Two&apos;s Complement Quick Convert</span>
              <span className={styles.subText}>e.g. -5 &rarr; 11111011</span>
            </label>
            <div className={styles.inputRow}>
              <input
                id={idDecInput}
                type="text"
                className={styles.input}
                value={decInput}
                onChange={(e) => setDecInput(e.target.value)}
                placeholder="-5"
              />
              <input
                type="text"
                className={styles.input}
                value={twosComplResult}
                readOnly
                aria-label="Two's complement representation"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
