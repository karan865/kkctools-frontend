'use client';

import React, { useId, useState } from 'react';
import styles from './BrickCalculator.module.css';
import {
  METRIC_BRICK_PRESETS,
  MetricWall,
  MetricOpening,
  MetricWallType,
  calculateMetricBricks,
} from '@/lib/brick-metric-engine';

const parseNum = (val: string) => {
  if (!val) return 0;
  const n = parseFloat(val.replace(/,/g, '.'));
  return Number.isFinite(n) ? n : 0;
};

let nextId = 100;
const newId = () => String(nextId++);

export function MetricBrickCalculator() {
  const uid = useId();
  const id = (s: string) => `${uid}-${s}`;

  const [walls, setWalls] = useState<MetricWall[]>([{ id: '1', name: 'Main wall', lengthM: 6, heightM: 2.4, quantity: 1 }]);
  const [openings, setOpenings] = useState<MetricOpening[]>([]);
  const [presetId, setPresetId] = useState('ukStandard');
  const [customL, setCustomL] = useState('215');
  const [customH, setCustomH] = useState('65');
  const [customW, setCustomW] = useState('102.5');
  const [jointMm, setJointMm] = useState('10');
  const [wallType, setWallType] = useState<MetricWallType>('half');
  const [waste, setWaste] = useState(5);
  const [perPack, setPerPack] = useState('500');
  const [bagYield, setBagYield] = useState('');
  const [price, setPrice] = useState('');

  const r = calculateMetricBricks({
    walls,
    openings,
    presetId,
    customLengthMm: parseNum(customL),
    customHeightMm: parseNum(customH),
    customWidthMm: parseNum(customW),
    jointMm: parseNum(jointMm),
    wallType,
    wastePercentage: waste,
    bricksPerPack: parseNum(perPack),
    mortarBagYieldLitres: parseNum(bagYield),
    pricePerBrick: parseNum(price),
  });

  const updateWall = (wid: string, key: keyof MetricWall, value: string | number) =>
    setWalls((ws) => ws.map((w) => (w.id === wid ? { ...w, [key]: value } : w)));
  const updateOpening = (oid: string, key: keyof MetricOpening, value: string | number) =>
    setOpenings((os) => os.map((o) => (o.id === oid ? { ...o, [key]: value } : o)));

  const preset = METRIC_BRICK_PRESETS[presetId];

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.inputColumn}>
          {/* 1. Walls */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>1</span>
                Wall size (metres)
              </h2>
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => setWalls((ws) => [...ws, { id: newId(), name: `Wall ${ws.length + 1}`, lengthM: 3, heightM: 2.4, quantity: 1 }])}
              >
                + Add wall
              </button>
            </div>
            {walls.map((w) => (
              <div key={w.id} className={styles.wallRowCard}>
                <div className={styles.wallRowGrid}>
                  <div>
                    <label className={styles.inputLabel} htmlFor={id(`wn${w.id}`)}>Wall name</label>
                    <input id={id(`wn${w.id}`)} type="text" className={styles.textInput} value={w.name} onChange={(e) => updateWall(w.id, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.inputLabel} htmlFor={id(`wl${w.id}`)}>Length (m)</label>
                    <input id={id(`wl${w.id}`)} type="number" min="0" step="any" inputMode="decimal" className={styles.textInput} value={w.lengthM || ''} onChange={(e) => updateWall(w.id, 'lengthM', parseNum(e.target.value))} />
                  </div>
                  <div>
                    <label className={styles.inputLabel} htmlFor={id(`wh${w.id}`)}>Height (m)</label>
                    <input id={id(`wh${w.id}`)} type="number" min="0" step="any" inputMode="decimal" className={styles.textInput} value={w.heightM || ''} onChange={(e) => updateWall(w.id, 'heightM', parseNum(e.target.value))} />
                  </div>
                  <div>
                    <label className={styles.inputLabel} htmlFor={id(`wq${w.id}`)}>Qty</label>
                    <input id={id(`wq${w.id}`)} type="number" min="1" step="1" inputMode="numeric" className={styles.textInput} value={w.quantity || ''} onChange={(e) => updateWall(w.id, 'quantity', parseNum(e.target.value))} />
                  </div>
                </div>
                {walls.length > 1 && (
                  <button type="button" className={styles.secondaryButton} style={{ marginTop: 8 }} onClick={() => setWalls((ws) => ws.filter((x) => x.id !== w.id))}>
                    Remove {w.name}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 2. Openings */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>2</span>
                Doors &amp; windows
              </h2>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button type="button" className={styles.addBtn} onClick={() => setOpenings((os) => [...os, { id: newId(), name: 'Door', widthM: 0.9, heightM: 2.1, quantity: 1 }])}>
                  + Door
                </button>
                <button type="button" className={styles.addBtn} onClick={() => setOpenings((os) => [...os, { id: newId(), name: 'Window', widthM: 1.2, heightM: 1.2, quantity: 1 }])}>
                  + Window
                </button>
              </div>
            </div>
            {openings.length === 0 && <p className={styles.helperText}>No openings. Add doors or windows to subtract them from the wall area.</p>}
            {openings.map((o) => (
              <div key={o.id} className={styles.wallRowCard}>
                <div className={styles.wallRowGrid}>
                  <div>
                    <label className={styles.inputLabel} htmlFor={id(`on${o.id}`)}>Opening</label>
                    <input id={id(`on${o.id}`)} type="text" className={styles.textInput} value={o.name} onChange={(e) => updateOpening(o.id, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.inputLabel} htmlFor={id(`ow${o.id}`)}>Width (m)</label>
                    <input id={id(`ow${o.id}`)} type="number" min="0" step="any" inputMode="decimal" className={styles.textInput} value={o.widthM || ''} onChange={(e) => updateOpening(o.id, 'widthM', parseNum(e.target.value))} />
                  </div>
                  <div>
                    <label className={styles.inputLabel} htmlFor={id(`oh${o.id}`)}>Height (m)</label>
                    <input id={id(`oh${o.id}`)} type="number" min="0" step="any" inputMode="decimal" className={styles.textInput} value={o.heightM || ''} onChange={(e) => updateOpening(o.id, 'heightM', parseNum(e.target.value))} />
                  </div>
                  <div>
                    <label className={styles.inputLabel} htmlFor={id(`oq${o.id}`)}>Qty</label>
                    <input id={id(`oq${o.id}`)} type="number" min="1" step="1" inputMode="numeric" className={styles.textInput} value={o.quantity || ''} onChange={(e) => updateOpening(o.id, 'quantity', parseNum(e.target.value))} />
                  </div>
                </div>
                <button type="button" className={styles.secondaryButton} style={{ marginTop: 8 }} onClick={() => setOpenings((os) => os.filter((x) => x.id !== o.id))}>
                  Remove {o.name}
                </button>
              </div>
            ))}
          </div>

          {/* 3. Brick & joint */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>3</span>
                Brick, joint &amp; wall type
              </h2>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor={id('preset')}>Brick size</label>
              <select id={id('preset')} className={styles.selectInput} value={presetId} onChange={(e) => setPresetId(e.target.value)}>
                {Object.values(METRIC_BRICK_PRESETS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.region}
                  </option>
                ))}
                <option value="custom">Custom size (mm)</option>
              </select>
              {preset?.note && <span className={styles.helperText}>{preset.note}</span>}
            </div>
            {presetId === 'custom' && (
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor={id('cl')}>Length (mm)</label>
                  <input id={id('cl')} type="number" min="0" step="any" inputMode="decimal" className={styles.textInput} value={customL} onChange={(e) => setCustomL(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor={id('ch')}>Height (mm)</label>
                  <input id={id('ch')} type="number" min="0" step="any" inputMode="decimal" className={styles.textInput} value={customH} onChange={(e) => setCustomH(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor={id('cw')}>Depth (mm)</label>
                  <input id={id('cw')} type="number" min="0" step="any" inputMode="decimal" className={styles.textInput} value={customW} onChange={(e) => setCustomW(e.target.value)} />
                </div>
              </div>
            )}
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={id('joint')}>Mortar joint (mm)</label>
                <input id={id('joint')} type="number" min="0" step="any" inputMode="decimal" className={styles.textInput} value={jointMm} onChange={(e) => setJointMm(e.target.value)} />
                <span className={styles.helperText}>10 mm is standard for UK, European and Australian brickwork.</span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.inputLabel} id={id('wt')}>Wall thickness</span>
              <div className={styles.quickPillsRow} role="radiogroup" aria-labelledby={id('wt')}>
                {([
                  ['half', 'Half-brick (single leaf)'],
                  ['one', 'One-brick (two leaves)'],
                ] as const).map(([v, label]) => (
                  <button key={v} type="button" role="radio" aria-checked={wallType === v} className={`${styles.quickPill} ${wallType === v ? styles.quickPillActive : ''}`} onClick={() => setWallType(v)}>
                    {label}
                  </button>
                ))}
              </div>
              <span className={styles.helperText}>
                {wallType === 'half'
                  ? 'Half-brick (102.5 mm with UK bricks) is a single leaf in stretcher bond, e.g. the outer leaf of a cavity wall or a garden wall.'
                  : 'One-brick (215 mm with UK bricks) is two leaves bonded together, e.g. English or Flemish bond; it uses twice the bricks plus a collar joint.'}
              </span>
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.inputLabel} id={id('waste')}>Cutting &amp; breakage allowance</span>
              <div className={styles.quickPillsRow} role="radiogroup" aria-labelledby={id('waste')}>
                {[0, 5, 10, 15].map((p) => (
                  <button key={p} type="button" role="radio" aria-checked={waste === p} className={`${styles.quickPill} ${waste === p ? styles.quickPillActive : ''}`} onClick={() => setWaste(p)}>
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Packs, mortar bag & price */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNumber}>4</span>
                Packs, mortar bag &amp; price (optional)
              </h2>
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={id('pack')}>Bricks per pack</label>
                <input id={id('pack')} type="number" min="1" step="1" inputMode="numeric" className={styles.textInput} value={perPack} onChange={(e) => setPerPack(e.target.value)} />
                <span className={styles.helperText}>Check your merchant; pack sizes vary (often 400–500).</span>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={id('yield')}>Mortar per bag (litres)</label>
                <input id={id('yield')} type="number" min="0" step="any" inputMode="decimal" placeholder="From the bag label" className={styles.textInput} value={bagYield} onChange={(e) => setBagYield(e.target.value)} />
                <span className={styles.helperText}>Enter the wet-mortar yield printed on your bag to get a bag count.</span>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor={id('price')}>Price per brick</label>
                <input id={id('price')} type="number" min="0" step="any" inputMode="decimal" placeholder="e.g. 0.80" className={styles.textInput} value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={styles.resultsColumn} aria-live="polite">
          {r.isOpeningExceeded && <div className={styles.errorBanner}>Openings are larger than the wall area. Check the sizes.</div>}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>TOTAL BRICKS TO ORDER</div>
            <div className={styles.heroValue}>{r.totalBricks.toLocaleString()} bricks</div>
            <div className={styles.heroSubtext}>
              {r.baseBricks.toLocaleString()} for the wall + {r.wasteBricks.toLocaleString()} allowance ({waste}%)
            </div>
          </div>

          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Wall &amp; brick breakdown</h3>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Gross wall area</span>
              <span className={styles.breakdownValue}>{r.grossAreaM2.toFixed(2)} m²</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Openings deducted</span>
              <span className={styles.breakdownValue}>-{r.openingsAreaM2.toFixed(2)} m²</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Net wall area</span>
              <span className={styles.breakdownValue}>{r.netAreaM2.toFixed(2)} m²</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Bricks per m² (one face)</span>
              <span className={styles.breakdownValue}>{r.bricksPerM2Face.toFixed(2)}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Bricks per m² of this wall</span>
              <span className={styles.breakdownValue}>{r.bricksPerM2Wall.toFixed(2)}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Packs</span>
              <span className={styles.breakdownValue}>
                {r.packsRounded} (exact {r.packsExact})
              </span>
            </div>
            {r.totalBrickCost !== null && (
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Brick cost</span>
                <span className={`${styles.breakdownValue} ${styles.costHighlight}`}>{r.totalBrickCost.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Mortar</h3>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Mortar volume (incl. allowance)</span>
              <span className={styles.breakdownValue}>
                {r.mortarM3.toFixed(3)} m³ ({r.mortarLitres.toLocaleString()} L)
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Bags</span>
              <span className={styles.breakdownValue}>{r.mortarBags !== null ? `${r.mortarBags} bags` : 'Enter the bag yield'}</span>
            </div>
            <p className={styles.disclaimerNote}>
              Mortar is the net joint volume for solid bricks ({r.lengthMm} × {r.heightMm} × {r.widthMm} mm, {parseNum(jointMm)} mm joints).
              Frogged or perforated bricks, raked joints and site losses use more, so most bricklayers round up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
