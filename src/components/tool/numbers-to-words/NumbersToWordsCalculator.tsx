'use client';

import React, { useState, useMemo } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/text/useTabParam';
import {
  parseNumberInput,
  bigIntToWords,
  bigIntToIndianWords,
  toCheckAmount,
  toIndianChequeAmount,
  toOrdinalWords,
  groupDigits,
  MAX_NAMED_DIGITS,
  applyCase,
  parseWordsToNumber,
  CaseStyle,
  ScaleStyle,
  GroupingStyle,
} from '@/lib/number-words-engine';
import NumberWordsInputGuide from './NumberWordsInputGuide';
import styles from './NumbersToWordsCalculator.module.css';

type ActiveTab = 'words' | 'check' | 'cheque' | 'ordinal' | 'reverse';

const TABS: TabItem<ActiveTab>[] = [
  { id: 'words', label: '1. Words' },
  { id: 'check', label: '2. Check (US)' },
  { id: 'cheque', label: '3. Cheque (India)' },
  { id: 'ordinal', label: '4. Ordinal' },
  { id: 'reverse', label: '5. Words → Number' },
];
const TAB_IDS = TABS.map((t) => t.id);

export default function NumbersToWordsCalculator() {
  const [activeTab, setActiveTab] = useTabParam<ActiveTab>(TAB_IDS, 'words');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Core Inputs
  const [numberInput, setNumberInput] = useState<string>('1234567');
  const [checkAmountInput, setCheckAmountInput] = useState<string>('5075.62');
  const [chequeAmountInput, setChequeAmountInput] = useState<string>('1234567.50');
  const [ordinalInput, setOrdinalInput] = useState<string>('21');
  const [reverseWordsInput, setReverseWordsInput] = useState<string>('three hundred fifty');

  // Options
  const [groupingSystem, setGroupingSystem] = useState<GroupingStyle>('intl');
  const [scaleStyle, setScaleStyle] = useState<ScaleStyle>('us');
  const [caseStyle, setCaseStyle] = useState<CaseStyle>('sentence');
  const [checkSuffix, setCheckSuffix] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);

  // Standard Words Calculation
  const wordsResult = useMemo(() => {
    const parsed = parseNumberInput(numberInput);
    if (!parsed) return { text: 'Enter digits only, for example 1,234,567 or -42.5.', isError: true };

    if (parsed.intPart.toString().length > MAX_NAMED_DIGITS) {
      return { text: 'Too large to name (over 36 digits). Use scientific notation.', isError: true };
    }

    let words =
      groupingSystem === 'indian'
        ? bigIntToIndianWords(parsed.intPart)
        : bigIntToWords(parsed.intPart, { style: scaleStyle });

    if (parsed.fracStr) {
      words += ` point ${parsed.fracStr
        .split('')
        .map((d) => bigIntToWords(BigInt(d)))
        .join(' ')}`;
    }

    if (parsed.sign === '-') {
      words = `negative ${words}`;
    }

    return {
      text: applyCase(words, caseStyle),
      isError: false,
      groupedIntl: groupDigits(parsed.intPart.toString(), 'intl'),
      groupedIndian: groupDigits(parsed.intPart.toString(), 'indian'),
    };
  }, [numberInput, groupingSystem, scaleStyle, caseStyle]);

  // US Check Calculation
  const checkResult = useMemo(() => {
    const res = toCheckAmount(checkAmountInput, { suffix: checkSuffix });
    return res || 'Enter a positive amount, for example 5,075.62.';
  }, [checkAmountInput, checkSuffix]);

  // Indian Cheque Calculation
  const chequeResult = useMemo(() => {
    const res = toIndianChequeAmount(chequeAmountInput);
    return res || 'Enter a positive amount under one crore crore, for example 12,34,567.50.';
  }, [chequeAmountInput]);

  // The printed check already says DOLLARS / RUPEES, so the previews leave that word out.
  const checkLine = checkResult.replace(' dollars', '');
  const chequeLine = chequeResult.replace(/^Rupees /, '');

  // Ordinal Calculation
  const ordinalResult = useMemo(() => {
    const clean = ordinalInput.trim().replace(/\D/g, '');
    if (!clean || clean.length > MAX_NAMED_DIGITS) return { text: 'Enter a whole number of up to 36 digits', numeral: '' };

    const n = BigInt(clean);
    const cardinal = bigIntToWords(n, { style: 'us' });
    const ordinalWord = toOrdinalWords(cardinal);

    // Numeral suffix: 1st, 2nd, 3rd, 4th, 11th, 12th, 13th
    const num = Number(n % BigInt('100'));
    let suffix = 'th';
    if (num < 11 || num > 13) {
      const last = num % 10;
      if (last === 1) suffix = 'st';
      else if (last === 2) suffix = 'nd';
      else if (last === 3) suffix = 'rd';
    }

    return {
      text: applyCase(ordinalWord, caseStyle),
      numeral: `${n.toString()}${suffix}`,
    };
  }, [ordinalInput, caseStyle]);

  // Reverse Parse Calculation
  const reverseResult = useMemo(() => {
    return parseWordsToNumber(reverseWordsInput);
  }, [reverseWordsInput]);

  // Copy handler
  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={styles.container}>
      {/* Visual Guide Header */}
      <NumberWordsInputGuide
        focusedField={focusedField}
        activeTab={activeTab}
        system={groupingSystem}
        numberStr={numberInput}
      />

      {/* Tabs */}
      <TabSlider tabs={TABS} activeId={activeTab} onChange={setActiveTab} ariaLabel="Numbers to words modes" />

      <div className={styles.actionRow} style={{ justifyContent: 'flex-end' }}>
        <button
          className={styles.btnSecondary}
          onClick={() => {
            const copyText =
              activeTab === 'words'
                ? wordsResult.text
                : activeTab === 'check'
                ? checkResult
                : activeTab === 'cheque'
                ? chequeResult
                : activeTab === 'ordinal'
                ? `${ordinalResult.numeral} (${ordinalResult.text})`
                : reverseResult.formatted || '';
            handleCopy(copyText);
          }}
        >
          {copied ? '✓ Copied' : '📋 Copy Words'}
        </button>
      </div>

      {/* Tab 1: Standard Words */}
      {activeTab === 'words' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="number-input-field" className={styles.label}>
              Enter Any Number or Decimals
            </label>
            <input
              id="number-input-field"
              type="text"
              value={numberInput}
              onFocus={() => setFocusedField('number')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setNumberInput(e.target.value)}
              className={styles.input}
              placeholder="e.g. 1234567 or 1,234.56"
            />
            <div className={styles.quickPills}>
              {['42', '123', '1000', '1234567', '5000000', '123456789', '1000000000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`${styles.pillBtn} ${numberInput === preset ? styles.pillBtnActive : ''}`}
                  onClick={() => setNumberInput(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Formatting Controls */}
          <div className={styles.gridCols4} style={{ marginTop: '14px' }}>
            <div className={styles.field}>
              <label htmlFor="nw-sys" className={styles.label}>System Scale</label>
              <select
                id="nw-sys"
                value={groupingSystem}
                onChange={(e) => setGroupingSystem(e.target.value as GroupingStyle)}
                className={styles.select}
              >
                <option value="intl">International (Million, Billion)</option>
                <option value="indian">Indian (Lakh, Crore)</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="nw-and" className={styles.label}>&quot;And&quot; Style</label>
              <select
                id="nw-and"
                value={scaleStyle}
                onChange={(e) => setScaleStyle(e.target.value as ScaleStyle)}
                className={styles.select}
              >
                <option value="us">US Standard (no &quot;and&quot;)</option>
                <option value="uk">UK Formal (&quot;and&quot;)</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="nw-case" className={styles.label}>Letter Casing</label>
              <select
                id="nw-case"
                value={caseStyle}
                onChange={(e) => setCaseStyle(e.target.value as CaseStyle)}
                className={styles.select}
              >
                <option value="sentence">Sentence case</option>
                <option value="lower">lower case</option>
                <option value="upper">UPPER CASE</option>
                <option value="title">Title Case</option>
              </select>
            </div>

            <div className={styles.field} style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setNumberInput('1234567')}
              >
                Reset Default
              </button>
            </div>
          </div>

          {/* Output Display Banner */}
          <div className={styles.wordsOutputBanner} style={{ marginTop: '16px' }}>
            <span className={styles.label}>Amount in Words</span>
            <div className={styles.wordsText}>{wordsResult.text}</div>
          </div>

          {/* Grouped Periods Bar */}
          {!wordsResult.isError && (
            <div className={styles.groupingBar} style={{ marginTop: '12px' }}>
              <span>
                <strong>International:</strong> {wordsResult.groupedIntl}
              </span>
              <span>•</span>
              <span>
                <strong>Indian:</strong> {wordsResult.groupedIndian}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: US Check Writing */}
      {activeTab === 'check' && (
        <div className={styles.card}>
          <div className={styles.gridCols2}>
            <div className={styles.field}>
              <label htmlFor="check-amount-field" className={styles.label}>
                Check Amount ($)
              </label>
              <input
                id="check-amount-field"
                type="text"
                value={checkAmountInput}
                onChange={(e) => setCheckAmountInput(e.target.value)}
                className={styles.input}
                placeholder="e.g. 5075.62"
              />
              <div className={styles.quickPills}>
                {['50.00', '88.52', '1250.75', '5075.62', '10000.00'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`${styles.pillBtn} ${checkAmountInput === preset ? styles.pillBtnActive : ''}`}
                    onClick={() => setCheckAmountInput(preset)}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="nw-suffix" className={styles.label}>Trailing Suffix</label>
              <select
                id="nw-suffix"
                value={checkSuffix}
                onChange={(e) => setCheckSuffix(e.target.value)}
                className={styles.select}
              >
                <option value="">None (Standard)</option>
                <option value="Only">Only</option>
                <option value="Exactly">Exactly</option>
              </select>
            </div>
          </div>

          <div className={styles.wordsOutputBanner} style={{ marginTop: '16px' }}>
            <span className={styles.label}>Amount in Words Line</span>
            <div className={styles.wordsText}>{checkResult}</div>
          </div>

          {/* SVG Check Preview */}
          <div className={styles.checkPreviewWrapper}>
            <svg viewBox="0 0 700 220" className={styles.checkSvg} role="img" aria-label="Sample US Check Diagram">
              <rect x="10" y="10" width="680" height="200" rx="10" className={styles.checkBg} />
              <text x="350" y="125" className={styles.watermark}>SAMPLE</text>

              {/* Check Header */}
              <text x="35" y="42" className={styles.checkText}>YOUR NAME / BUSINESS</text>
              <text x="35" y="58" className={styles.checkSub}>123 MAIN STREET, CITY, STATE 12345</text>
              <text x="590" y="42" className={styles.checkText}>1001</text>
              
              <text x="460" y="70" className={styles.checkSub}>DATE</text>
              <line x1="495" y1="70" x2="650" y2="70" className={styles.checkLine} />

              {/* Payee Line */}
              <text x="35" y="105" className={styles.checkSub}>PAY TO THE ORDER OF</text>
              <line x1="165" y1="105" x2="510" y2="105" className={styles.checkLine} />
              
              {/* Numeric Amount Box */}
              <rect x="525" y="86" width="135" height="28" rx="4" fill="var(--surface-2)" stroke="var(--line-strong, #94a3b8)" />
              <text x="535" y="105" className={styles.checkText}>$</text>
              <text x="592" y="105" textAnchor="middle" className={styles.checkText}>{checkAmountInput}</text>

              {/* Words Line */}
              <text
                x="35"
                y="145"
                className={styles.checkTextScript}
                {...(checkLine.length > 68 ? { textLength: 575, lengthAdjust: 'spacingAndGlyphs' as const } : {})}
              >
                {checkLine}
              </text>
              {checkLine.length < 60 && (
                <line x1={45 + checkLine.length * 8.6} y1="141" x2="618" y2="141" className={styles.trailDash} />
              )}
              <text x="625" y="145" className={styles.checkSub}>DOLLARS</text>

              {/* Memo & Sign Lines */}
              <text x="35" y="185" className={styles.checkSub}>MEMO</text>
              <line x1="75" y1="185" x2="280" y2="185" className={styles.checkLine} />

              <line x1="420" y1="185" x2="650" y2="185" className={styles.checkLine} />
              <text x="535" y="198" textAnchor="middle" className={styles.checkSub}>AUTHORIZED SIGNATURE</text>
            </svg>
          </div>

          <div className={styles.uccCallout}>
            <strong>If they disagree:</strong> If the number and the words on a check disagree, UCC § 3-114 says <em>words prevail over numbers</em> (<a href="https://www.law.cornell.edu/ucc/3/3-114" target="_blank" rel="noopener noreferrer">source</a>, checked 2026-11-22).
          </div>
        </div>
      )}

      {/* Tab 3: Indian Cheque Writing */}
      {activeTab === 'cheque' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="cheque-amount-field" className={styles.label}>
              Cheque Amount (₹)
            </label>
            <input
              id="cheque-amount-field"
              type="text"
              value={chequeAmountInput}
              onChange={(e) => setChequeAmountInput(e.target.value)}
              className={styles.input}
              placeholder="e.g. 1234567.50"
            />
            <div className={styles.quickPills}>
              {['25000', '99.99', '1234567.50', '10000000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`${styles.pillBtn} ${chequeAmountInput === preset ? styles.pillBtnActive : ''}`}
                  onClick={() => setChequeAmountInput(preset)}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.wordsOutputBanner} style={{ marginTop: '16px' }}>
            <span className={styles.label}>Cheque Words Line (Rupees ... Only)</span>
            <div className={styles.wordsText}>{chequeResult}</div>
          </div>

          {/* SVG Indian Cheque Preview */}
          <div className={styles.checkPreviewWrapper}>
            <svg viewBox="0 0 700 220" className={styles.checkSvg} role="img" aria-label="Sample Indian Cheque Diagram">
              <rect x="10" y="10" width="680" height="200" rx="10" className={styles.checkBg} />
              <text x="350" y="125" className={styles.watermark}>SAMPLE</text>

              {/* Date Box */}
              <text x="35" y="42" className={styles.checkText}>ACCOUNT PAYEE ONLY</text>
              <text x="490" y="42" className={styles.checkSub}>DATE: D D M M Y Y Y Y</text>

              {/* Payee Line */}
              <text x="35" y="90" className={styles.checkSub}>PAY</text>
              <line x1="70" y1="90" x2="650" y2="90" className={styles.checkLine} />

              {/* Words Line */}
              <text x="35" y="128" className={styles.checkSub}>RUPEES</text>
              <text
                x="95"
                y="128"
                className={styles.checkTextScript}
                {...(chequeLine.length > 64 ? { textLength: 565, lengthAdjust: 'spacingAndGlyphs' as const } : {})}
              >
                {chequeLine}
              </text>

              {/* ₹ Box */}
              <rect x="525" y="145" width="135" height="32" rx="4" fill="var(--surface-2)" stroke="var(--line-strong, #94a3b8)" />
              <text x="535" y="166" className={styles.checkText}>₹</text>
              <text x="595" y="166" textAnchor="middle" className={styles.checkText}>{chequeAmountInput}</text>

              <line x1="380" y1="185" x2="650" y2="185" className={styles.checkLine} />
              <text x="515" y="200" textAnchor="middle" className={styles.checkSub}>PLEASE SIGN ABOVE THIS LINE</text>
            </svg>
          </div>
        </div>
      )}

      {/* Tab 4: Ordinals */}
      {activeTab === 'ordinal' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="ordinal-input-field" className={styles.label}>
              Enter a Whole Number
            </label>
            <input
              id="ordinal-input-field"
              type="text"
              inputMode="numeric"
              value={ordinalInput}
              onChange={(e) => setOrdinalInput(e.target.value)}
              className={styles.input}
              placeholder="e.g. 21"
            />
            <div className={styles.quickPills}>
              {['1', '2', '3', '5', '8', '9', '12', '20', '21', '40', '100', '112'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`${styles.pillBtn} ${ordinalInput === preset ? styles.pillBtnActive : ''}`}
                  onClick={() => setOrdinalInput(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.wordsOutputBanner} style={{ marginTop: '16px' }}>
            <span className={styles.label}>Ordinal Word &amp; Numeral</span>
            <div className={styles.wordsText}>
              {ordinalResult.numeral} ({ordinalResult.text})
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Words to Numbers (Reverse) */}
      {activeTab === 'reverse' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="reverse-words-field" className={styles.label}>
              Enter Words to Convert Back to Digits
            </label>
            <input
              id="reverse-words-field"
              type="text"
              value={reverseWordsInput}
              onChange={(e) => setReverseWordsInput(e.target.value)}
              className={styles.input}
              placeholder="e.g. three hundred fifty"
            />
            <div className={styles.quickPills}>
              {[
                'three hundred fifty',
                'one hundred and twenty-three',
                'a hundred',
                'two million five',
                'twelve lakh thirty-four thousand five hundred sixty-seven',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`${styles.pillBtn} ${reverseWordsInput === preset ? styles.pillBtnActive : ''}`}
                  onClick={() => setReverseWordsInput(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.wordsOutputBanner} style={{ marginTop: '16px' }}>
            <span className={styles.label}>Numeric Digits Output</span>
            {reverseResult.success ? (
              <div className={styles.wordsText}>
                {reverseResult.formatted}{' '}
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
                  (International: {reverseResult.formattedIntl} • Indian: {reverseResult.formattedIndian})
                </span>
              </div>
            ) : (
              <div className={styles.wordsText} style={{ color: '#ef4444' }}>
                {reverseResult.unknownWord
                  ? `I couldn't read "${reverseResult.unknownWord}" here. Check the spelling and the word order.`
                  : 'Enter English number words above to convert.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
