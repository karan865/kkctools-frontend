'use client';

import React, { useState, useEffect, useMemo, useRef, useId, useSyncExternalStore } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/shared/useTabParam';
import { isAvailable } from '@/lib/secure-random';
import {
  MAX_UUID,
  MAX_UUID_BULK,
  MIN_UUID_BULK,
  NIL_UUID,
  UUID_NAMESPACES,
  UuidV7State,
  formatUuidBytes,
  generateNameBasedUuidBytes,
  generateUuidV4Bytes,
  generateUuidV7Bytes,
  hexToBytes,
  parseUuid,
} from '@/lib/uuid-engine';
import UuidInputGuide from './UuidInputGuide';
import styles from './UuidGenerator.module.css';

type TabId = 'v4' | 'v7' | 'v5' | 'validate' | 'nil';
type EncodingType = 'hex' | 'base64' | 'base64url';
type SeparatorType = 'newline' | 'comma' | 'space';
type QuoteType = 'none' | 'single' | 'double';

const TABS: TabItem<TabId>[] = [
  { id: 'v4', label: '1. v4 (Random)' },
  { id: 'v7', label: '2. v7 (Time-Ordered)' },
  { id: 'v5', label: '3. v5 / v3 (Name)' },
  { id: 'validate', label: '4. Validate & Convert' },
  { id: 'nil', label: '5. Nil & Max' },
];

const TAB_IDS: TabId[] = ['v4', 'v7', 'v5', 'validate', 'nil'];
const emptySubscribe = () => () => {};

function parseBulkCount(raw: string): number | null {
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned || !/^-?\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isSafeInteger(n) || n < MIN_UUID_BULK || n > MAX_UUID_BULK) return null;
  return n;
}

export default function UuidGenerator() {
  const uid = useId();
  const [tab, setTab] = useTabParam<TabId>(TAB_IDS, 'v4');
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Format options
  const [countInput, setCountInput] = useState('1');
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [urn, setUrn] = useState(false);
  const [encoding, setEncoding] = useState<EncodingType>('hex');
  const [separator, setSeparator] = useState<SeparatorType>('newline');
  const [quotes, setQuotes] = useState<QuoteType>('none');

  // v5 / v3 state
  const [nameVersion, setNameVersion] = useState<3 | 5>(5);
  const [nsPreset, setNsPreset] = useState<'dns' | 'url' | 'oid' | 'x500' | 'custom'>('dns');
  const [customNs, setCustomNs] = useState<string>(UUID_NAMESPACES.dns);
  const [nameInput, setNameInput] = useState('www.example.com');
  const [nameResultBytes, setNameResultBytes] = useState<Uint8Array | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Validate state
  const [validateInput, setValidateInput] = useState('');

  // Random output state
  const v7StateRef = useRef<UuidV7State>({ lastMs: 0, counter: 0 });
  const [generatedList, setGeneratedList] = useState<{ bytes: Uint8Array; tsIso: string | null }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [regenTick, setRegenTick] = useState(0);

  const validCount = useMemo(() => parseBulkCount(countInput), [countInput]);

  // Generate v4 / v7 on mount and when triggered
  useEffect(() => {
    if (!mounted || (tab !== 'v4' && tab !== 'v7')) return;
    const timer = setTimeout(() => {
      if (!isAvailable()) {
        setErrorMsg("Your browser can't generate secure random values");
        setGeneratedList([]);
        return;
      }
      if (validCount === null) {
        setErrorMsg(`Enter a whole count between ${MIN_UUID_BULK} and ${MAX_UUID_BULK.toLocaleString('en-US')}.`);
        setGeneratedList([]);
        return;
      }

      setErrorMsg(null);
      const items: { bytes: Uint8Array; tsIso: string | null }[] = [];
      for (let i = 0; i < validCount; i++) {
        if (tab === 'v4') {
          items.push({ bytes: generateUuidV4Bytes(), tsIso: null });
        } else {
          const b = generateUuidV7Bytes(v7StateRef.current);
          const parsed = parseUuid(
            formatUuidBytes(b, { encoding: 'hex', hyphens: true })
          );
          items.push({ bytes: b, tsIso: parsed.timestampIso ?? null });
        }
      }
      setGeneratedList(items);
    }, 0);
    return () => clearTimeout(timer);
  }, [mounted, tab, validCount, regenTick]);

  // Generate v5 / v3 async
  useEffect(() => {
    if (!mounted || tab !== 'v5') return;
    let active = true;
    const ns = nsPreset === 'custom' ? customNs : UUID_NAMESPACES[nsPreset];
    generateNameBasedUuidBytes(nameVersion, ns, nameInput)
      .then((b) => {
        if (active) {
          setNameError(null);
          setNameResultBytes(b);
        }
      })
      .catch((err) => {
        if (active) {
          setNameError(err instanceof Error ? err.message : 'Invalid namespace UUID.');
          setNameResultBytes(null);
        }
      });
    return () => {
      active = false;
    };
  }, [mounted, tab, nameVersion, nsPreset, customNs, nameInput]);

  const formatItem = (bytes: Uint8Array) =>
    formatUuidBytes(bytes, { uppercase, hyphens, braces, urn, encoding });

  const formattedStrings = useMemo(() => {
    const raw = generatedList.map((item) => formatItem(item.bytes));
    return raw.map((val) => {
      if (quotes === 'single') return `'${val}'`;
      if (quotes === 'double') return `"${val}"`;
      return val;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedList, uppercase, hyphens, braces, urn, encoding, quotes]);

  const joinedBulkOutput = useMemo(() => {
    const sep = separator === 'newline' ? '\n' : separator === 'comma' ? ', ' : ' ';
    return formattedStrings.join(sep);
  }, [formattedStrings, separator]);

  const parsedValidation = useMemo(() => parseUuid(validateInput), [validateInput]);

  const handleCopy = async (text: string, key: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1800);
      }
    } catch {
      setCopiedKey(null);
    }
  };

  const handleDownload = (ext: 'txt' | 'json' | 'csv') => {
    if (formattedStrings.length === 0) return;
    let body = joinedBulkOutput;
    let mime = 'text/plain;charset=utf-8';
    if (ext === 'json') {
      body = JSON.stringify(formattedStrings, null, 2);
      mime = 'application/json;charset=utf-8';
    } else if (ext === 'csv') {
      body = ['uuid', ...formattedStrings].join('\n');
      mime = 'text/csv;charset=utf-8';
    }
    try {
      const blob = new Blob([body], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uuids-${tab}-${formattedStrings.length}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  const applyListPreset = (preset: 'plain' | 'sql' | 'json' | 'csv') => {
    if (preset === 'plain') {
      setSeparator('newline');
      setQuotes('none');
    } else if (preset === 'sql') {
      setSeparator('comma');
      setQuotes('single');
    } else if (preset === 'json') {
      setSeparator('comma');
      setQuotes('double');
    } else {
      setSeparator('newline');
      setQuotes('none');
    }
  };

  return (
    <div className={styles.container}>
      <TabSlider
        tabs={TABS}
        activeId={tab}
        onChange={setTab}
        ariaLabel="UUID Generator Modes"
      />

      <UuidInputGuide
        tab={tab}
        count={validCount ?? 1}
        sampleUuid={
          tab === 'v7' && generatedList[0]
            ? formatUuidBytes(generatedList[0].bytes, { encoding: 'hex', hyphens: true })
            : undefined
        }
      />

      {(tab === 'v4' || tab === 'v7') && (
        <>
          <div className={styles.card}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor={`${uid}-count`} className={styles.label}>
                  7. How many ({MIN_UUID_BULK}–{MAX_UUID_BULK.toLocaleString('en-US')})
                </label>
                <input
                  id={`${uid}-count`}
                  type="text"
                  inputMode="numeric"
                  className={styles.input}
                  value={countInput}
                  onChange={(e) => setCountInput(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor={`${uid}-enc`} className={styles.label}>
                  8. Encoding
                </label>
                <select
                  id={`${uid}-enc`}
                  className={styles.select}
                  value={encoding}
                  onChange={(e) => setEncoding(e.target.value as EncodingType)}
                >
                  <option value="hex">Standard Hex</option>
                  <option value="base64">Base64 (24 chars)</option>
                  <option value="base64url">base64url (22 chars)</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor={`${uid}-sep`} className={styles.label}>
                  List Separator
                </label>
                <select
                  id={`${uid}-sep`}
                  className={styles.select}
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value as SeparatorType)}
                >
                  <option value="newline">Newline</option>
                  <option value="comma">Comma (, )</option>
                  <option value="space">Space</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor={`${uid}-quotes`} className={styles.label}>
                  Quotes
                </label>
                <select
                  id={`${uid}-quotes`}
                  className={styles.select}
                  value={quotes}
                  onChange={(e) => setQuotes(e.target.value as QuoteType)}
                >
                  <option value="none">None</option>
                  <option value="single">Single (&apos;...&apos;)</option>
                  <option value="double">Double (&quot;...&quot;)</option>
                </select>
              </div>
            </div>

            {encoding === 'hex' && (
              <div className={styles.row}>
                <label className={styles.checkboxItem}>
                  <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
                  <span>UPPERCASE</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} />
                  <span>Hyphens</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input type="checkbox" checked={braces} onChange={(e) => setBraces(e.target.checked)} />
                  <span>Braces &#123;...&#125;</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input type="checkbox" checked={urn} onChange={(e) => setUrn(e.target.checked)} />
                  <span>urn:uuid:</span>
                </label>
              </div>
            )}

            <div className={styles.row}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setRegenTick((t) => t + 1)}
              >
                Generate {validCount ?? 1} {tab.toUpperCase()} {validCount === 1 ? 'UUID' : 'UUIDs'}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                disabled={formattedStrings.length === 0}
                onClick={() => handleCopy(joinedBulkOutput, 'all')}
              >
                {copiedKey === 'all' ? '✓ Copied' : 'Copy all'}
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => handleDownload('txt')}>
                Download .txt
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => handleDownload('json')}>
                Download .json
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => handleDownload('csv')}>
                Download .csv
              </button>
            </div>

            <div className={styles.row}>
              <span className={styles.hint}>List presets:</span>
              <button type="button" className={styles.secondaryBtn} onClick={() => applyListPreset('plain')}>Plain</button>
              <button type="button" className={styles.secondaryBtn} onClick={() => applyListPreset('sql')}>SQL IN</button>
              <button type="button" className={styles.secondaryBtn} onClick={() => applyListPreset('json')}>JSON</button>
              <button type="button" className={styles.secondaryBtn} onClick={() => applyListPreset('csv')}>CSV</button>
            </div>

            {errorMsg && <div className={styles.errorBox} role="alert">{errorMsg}</div>}
          </div>

          <div className={styles.card}>
            <p className={styles.hint}>
              {!mounted
                ? 'Ready to generate in your browser.'
                : tab === 'v4'
                  ? `Generated ${generatedList.length} random UUID${generatedList.length === 1 ? '' : 's'} (version 4, 122 random bits) in your browser.`
                  : `Generated ${generatedList.length} monotonic time-ordered UUID${generatedList.length === 1 ? '' : 's'} (version 7, RFC 9562 §6.2 Method 1) in your browser.`}
            </p>
            <div className={styles.outputList}>
              {!mounted ? (
                <div className={styles.uuidItem}>
                  <span>xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx</span>
                </div>
              ) : (
                generatedList.map((item, idx) => {
                  const display = formattedStrings[idx] ?? '';
                  return (
                    <div key={idx} className={styles.uuidItem}>
                      <div>
                        <span>{display}</span>
                        {item.tsIso && (
                          <div className={styles.hint}>Timestamp: {item.tsIso}</div>
                        )}
                      </div>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => handleCopy(display, `row-${idx}`)}
                      >
                        {copiedKey === `row-${idx}` ? '✓' : 'Copy'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            {mounted && formattedStrings.length > 1 && (
              <pre className={styles.formattedPreview}>{joinedBulkOutput}</pre>
            )}
          </div>
        </>
      )}

      {tab === 'v5' && (
        <div className={styles.card}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${uid}-namever`} className={styles.label}>Version</label>
              <select
                id={`${uid}-namever`}
                className={styles.select}
                value={nameVersion}
                onChange={(e) => setNameVersion(Number(e.target.value) as 3 | 5)}
              >
                <option value={5}>UUID v5 (SHA-1, recommended)</option>
                <option value={3}>UUID v3 (MD5, legacy)</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor={`${uid}-nspreset`} className={styles.label}>Namespace</label>
              <select
                id={`${uid}-nspreset`}
                className={styles.select}
                value={nsPreset}
                onChange={(e) => setNsPreset(e.target.value as typeof nsPreset)}
              >
                <option value="dns">DNS ({UUID_NAMESPACES.dns.slice(0, 8)}…)</option>
                <option value="url">URL ({UUID_NAMESPACES.url.slice(0, 8)}…)</option>
                <option value="oid">OID ({UUID_NAMESPACES.oid.slice(0, 8)}…)</option>
                <option value="x500">X.500 ({UUID_NAMESPACES.x500.slice(0, 8)}…)</option>
                <option value="custom">Custom UUID</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor={`${uid}-nameval`} className={styles.label}>Name</label>
              <input
                id={`${uid}-nameval`}
                type="text"
                className={styles.input}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
          </div>

          {nsPreset === 'custom' && (
            <div className={styles.field}>
              <label htmlFor={`${uid}-customns`} className={styles.label}>Custom Namespace UUID</label>
              <input
                id={`${uid}-customns`}
                type="text"
                className={styles.input}
                value={customNs}
                onChange={(e) => setCustomNs(e.target.value)}
              />
            </div>
          )}

          {nameError && <div className={styles.errorBox} role="alert">{nameError}</div>}

          {nameResultBytes && !nameError && (
            <div className={styles.uuidItem}>
              <span>{formatItem(nameResultBytes)}</span>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => handleCopy(formatItem(nameResultBytes), 'v5-copy')}
              >
                {copiedKey === 'v5-copy' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'validate' && (
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor={`${uid}-valinput`} className={styles.label}>
              Paste a UUID, GUID, URN, Base64, or base64url string
            </label>
            <input
              id={`${uid}-valinput`}
              type="text"
              placeholder="e.g. 017F22E2-79B0-7CC3-98C4-DC0C0C07398F"
              className={styles.input}
              value={validateInput}
              onChange={(e) => setValidateInput(e.target.value)}
            />
          </div>

          {validateInput.trim().length > 0 && !parsedValidation.valid && (
            <div className={styles.errorBox} role="alert">
              Invalid UUID: {parsedValidation.error}
            </div>
          )}

          {parsedValidation.valid && parsedValidation.formats && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <caption>Decoded UUID properties and converted formats</caption>
                <tbody>
                  <tr>
                    <th>Valid</th>
                    <td><strong>Yes</strong> {parsedValidation.isNil ? '(Nil UUID)' : parsedValidation.isMax ? '(Max UUID)' : ''}</td>
                  </tr>
                  <tr>
                    <th>Version</th>
                    <td>Version {parsedValidation.version}</td>
                  </tr>
                  <tr>
                    <th>Variant</th>
                    <td>{parsedValidation.variant}</td>
                  </tr>
                  {parsedValidation.timestampIso && (
                    <tr>
                      <th>Timestamp (UTC)</th>
                      <td><strong>{parsedValidation.timestampIso}</strong></td>
                    </tr>
                  )}
                  {Object.entries(parsedValidation.formats).map(([fmtName, fmtVal]) => (
                    <tr key={fmtName}>
                      <th>{fmtName}</th>
                      <td>
                        <div className={styles.row} style={{ justifyContent: 'space-between' }}>
                          <code>{fmtVal}</code>
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => handleCopy(fmtVal, `fmt-${fmtName}`)}
                          >
                            {copiedKey === `fmt-${fmtName}` ? '✓' : 'Copy'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'nil' && (
        <div className={styles.card}>
          <div className={styles.uuidItem}>
            <div>
              <strong>Nil (Empty) UUID / GUID:</strong>{' '}
              <code>{formatItem(hexToBytes(NIL_UUID.replace(/-/g, '')))}</code>
            </div>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => handleCopy(formatItem(hexToBytes(NIL_UUID.replace(/-/g, ''))), 'nil')}
            >
              {copiedKey === 'nil' ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className={styles.uuidItem}>
            <div>
              <strong>Max UUID (all 128 bits set):</strong>{' '}
              <code>{formatItem(hexToBytes(MAX_UUID.replace(/-/g, '')))}</code>
            </div>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => handleCopy(formatItem(hexToBytes(MAX_UUID.replace(/-/g, ''))), 'max')}
            >
              {copiedKey === 'max' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      <p className={styles.privacyNote}>
        Generated in your browser with Web Crypto (crypto.getRandomValues). No API calls, nothing stored.
      </p>
    </div>
  );
}
