'use client';

import React, { useState, useEffect, useId } from 'react';
import styles from './TonsYardsConverter.module.css';
import {
  convert,
  MATERIAL_PRESETS,
  ConversionDirection,
  WeightUnit,
  PriceMode,
  CustomDensityUnit,
} from '@/lib/tons-yards-engine';

export default function TonsYardsConverter() {
  const quantityId = useId();
  const materialDropdownId = useId();
  const customDensityValId = useId();
  const customDensityUnitId = useId();
  const priceId = useId();
  const deliveryId = useId();

  // State initialized with lazy initializer checking window.location.hash
  const [direction, setDirection] = useState<ConversionDirection>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#cubic-yards-to-tons') {
      return 'yards-to-tons';
    }
    return 'tons-to-yards';
  });
  const [quantity, setQuantity] = useState<string>('12');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('short-ton');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('crushed_stone');
  const [customDensityValue, setCustomDensityValue] = useState<number>(2800);
  const [customDensityUnit, setCustomDensityUnit] = useState<CustomDensityUnit>('lb-per-cy');
  const [bufferPct, setBufferPct] = useState<number>(0);
  const [priceMode, setPriceMode] = useState<PriceMode>('ton');
  const [price, setPrice] = useState<string>('60.00');
  const [deliveryFee, setDeliveryFee] = useState<string>('');

  // Handle hash change or scroll on mount without calling setState inside effect body
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#cubic-yards-to-tons') {
        setDirection('yards-to-tons');
        const el = document.getElementById('converter-tool-card');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    if (window.location.hash === '#cubic-yards-to-tons') {
      const el = document.getElementById('converter-tool-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const parsedPrice = parseFloat(price);
  const parsedDelivery = parseFloat(deliveryFee);

  const results = convert({
    direction,
    quantity,
    weightUnit,
    materialId: selectedMaterial,
    customDensityValue: selectedMaterial === 'custom' ? customDensityValue : undefined,
    customDensityUnit: selectedMaterial === 'custom' ? customDensityUnit : undefined,
    bufferPct,
    priceMode,
    price: isNaN(parsedPrice) ? undefined : parsedPrice,
    deliveryFee: isNaN(parsedDelivery) ? undefined : parsedDelivery,
  });

  // Material quick chips
  const quickChips = [
    { label: 'Gravel (Crushed Stone)', id: 'crushed_stone' },
    { label: 'Sand (Dry)', id: 'dry_sand' },
    { label: 'Topsoil', id: 'topsoil' },
    { label: 'Mulch', id: 'mulch' },
    { label: 'Asphalt', id: 'hot_mix_asphalt' },
    { label: 'Concrete', id: 'concrete' },
  ];

  return (
    <div id="converter-tool-card" className={styles.container}>
      <div className={styles.calculatorGrid}>
        {/* Left Column: 3 Step Cards */}
        <div className={styles.leftColumn}>
          {/* Card 1: Direction & Quantity */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>1</span>
              <h2 className={styles.cardTitle}>Direction &amp; Quantity</h2>
            </div>

            <div className={styles.directionToggle}>
              <button
                type="button"
                className={`${styles.dirBtn} ${direction === 'tons-to-yards' ? styles.dirBtnActive : ''}`}
                onClick={() => setDirection('tons-to-yards')}
              >
                Tons to Cubic Yards
              </button>
              <button
                type="button"
                className={`${styles.dirBtn} ${direction === 'yards-to-tons' ? styles.dirBtnActive : ''}`}
                onClick={() => setDirection('yards-to-tons')}
              >
                Cubic Yards to Tons
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={quantityId} className={styles.label}>
                {direction === 'tons-to-yards'
                  ? `Enter Weight (${weightUnit === 'metric-tonne' ? 'Metric Tonnes' : 'US Short Tons'})`
                  : 'Enter Volume (Cubic Yards / CY)'}
              </label>
              <input
                id={quantityId}
                type="text"
                className={styles.input}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={direction === 'tons-to-yards' ? 'e.g. 12 or 1,200' : 'e.g. 8.5'}
              />
              <span className={styles.helperText}>
                {direction === 'tons-to-yards'
                  ? 'Accepts whole numbers or decimals. 1 US short ton = 2,000 lbs.'
                  : '1 cubic yard (CY) = 27 cubic feet (3 ft × 3 ft × 3 ft).'}
              </span>
            </div>

            {/* Unit selector shown ONLY in Direction A */}
            {direction === 'tons-to-yards' && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Weight Unit</label>
                <div className={styles.toggleRow}>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${weightUnit === 'short-ton' ? styles.toggleButtonActive : ''}`}
                    onClick={() => setWeightUnit('short-ton')}
                  >
                    US Short Tons (2,000 lb)
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${weightUnit === 'metric-tonne' ? styles.toggleButtonActive : ''}`}
                    onClick={() => setWeightUnit('metric-tonne')}
                  >
                    Metric Tonnes (2,204.62 lb)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Material */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>2</span>
              <h2 className={styles.cardTitle}>Material</h2>
            </div>

            <label className={styles.label}>Quick Select</label>
            <div className={styles.pillsRow}>
              {quickChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className={`${styles.pillButton} ${selectedMaterial === chip.id ? styles.pillButtonActive : ''}`}
                  onClick={() => setSelectedMaterial(chip.id)}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor={materialDropdownId} className={styles.label}>
                Select Aggregate or Earth Material
              </label>
              <select
                id={materialDropdownId}
                className={styles.select}
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                {MATERIAL_PRESETS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
                <option value="custom">Custom Density...</option>
              </select>
            </div>

            {selectedMaterial === 'custom' && (
              <div className={styles.rowInputs} style={{ marginTop: '12px' }}>
                <div className={styles.inputGroup}>
                  <label htmlFor={customDensityValId} className={styles.label}>
                    Density Value
                  </label>
                  <input
                    id={customDensityValId}
                    type="number"
                    min="1"
                    step="any"
                    className={styles.input}
                    value={customDensityValue}
                    onChange={(e) => setCustomDensityValue(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor={customDensityUnitId} className={styles.label}>
                    Density Unit
                  </label>
                  <select
                    id={customDensityUnitId}
                    className={styles.select}
                    value={customDensityUnit}
                    onChange={(e) => setCustomDensityUnit(e.target.value as CustomDensityUnit)}
                  >
                    <option value="lb-per-cy">Pounds per Cu Yd (lb/yd³)</option>
                    <option value="lb-per-cf">Pounds per Cu Ft (lb/ft³)</option>
                    <option value="tons-per-cy">Tons per Cu Yd (t/yd³)</option>
                  </select>
                </div>
              </div>
            )}

            <div style={{ marginTop: '10px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.825rem', color: '#0F172A', fontWeight: 600 }}>
                Density used: {results.effectiveDensityLbPerCy.toLocaleString()} lb/yd³ ({results.densityTonsPerCy.toFixed(2)} tons/yd³, {results.densityLbPerCf.toFixed(1)} lb/ft³)
              </span>
            </div>
          </div>

          {/* Card 3: Order Buffer & Cost (Optional) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>3</span>
              <h2 className={styles.cardTitle}>Order Buffer &amp; Cost (Optional)</h2>
            </div>

            {/* Buffer is Direction B only */}
            {direction === 'yards-to-tons' && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Settling &amp; Compaction Buffer</label>
                <div className={styles.pillsRow}>
                  {[0, 5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`${styles.pillButton} ${bufferPct === pct ? styles.pillButtonActive : ''}`}
                      onClick={() => setBufferPct(pct)}
                    >
                      {pct}% {pct === 10 ? '(Typical)' : ''}
                    </button>
                  ))}
                </div>
                <span className={styles.helperText}>
                  Loose bulk materials compact 10% to 20% once spread and tamped.
                </span>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Quarry Pricing Basis</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${priceMode === 'ton' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setPriceMode('ton')}
                >
                  $ per US Short Ton
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${priceMode === 'cy' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setPriceMode('cy')}
                >
                  $ per Cubic Yard
                </button>
              </div>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor={priceId} className={styles.label}>
                  {priceMode === 'ton' ? 'Material Price ($ / Ton)' : 'Material Price ($ / Cu Yd)'}
                </label>
                <input
                  id={priceId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 60.00"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor={deliveryId} className={styles.label}>
                  Delivery Fee ($)
                </label>
                <input
                  id={deliveryId}
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.input}
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  placeholder="e.g. 75.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero & Breakdown */}
        <div className={styles.rightColumn}>
          {/* Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>
              {direction === 'tons-to-yards' ? 'CONVERTED VOLUME' : 'CONVERTED WEIGHT'}
            </div>
            <div className={styles.heroValue}>
              {direction === 'tons-to-yards'
                ? `${results.orderCy.toFixed(2)} Cubic Yards`
                : `${results.baseShortTons.toFixed(2)} US Short Tons`}
            </div>
            <div className={styles.heroSubtext}>
              {direction === 'tons-to-yards' ? (
                <>Equivalent to {results.orderCf.toFixed(1)} Cubic Feet (from {quantity || '0'} {weightUnit === 'metric-tonne' ? 'Tonnes' : 'Tons'})</>
              ) : (
                <>
                  Equivalent to {results.baseLbs.toLocaleString()} lbs (from {quantity || '0'} Cubic Yards)
                  {bufferPct > 0 && (
                    <span style={{ display: 'block', marginTop: '6px', fontSize: '1rem', color: '#BAE6FD' }}>
                      With {bufferPct}% buffer: {results.orderShortTons.toFixed(2)} tons ({results.orderLbs.toLocaleString()} lbs)
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Breakdown Card: Conversion Matrix */}
          <div className={styles.breakdownCard}>
            <h3 className={styles.breakdownTitle}>Complete Conversion Matrix</h3>

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Cubic Yards (CY)</span>
              <span className={styles.breakdownValue} style={{ color: '#0369A1', fontSize: '1.05rem' }}>
                {results.orderCy.toFixed(2)} yd³
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Cubic Feet (cu ft)</span>
              <span className={styles.breakdownValue}>{results.orderCf.toFixed(1)} ft³</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Cubic Meters (m³)</span>
              <span className={styles.breakdownValue}>{results.orderM3.toFixed(2)} m³</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>US Short Tons (2,000 lb)</span>
              <span className={styles.breakdownValue}>{results.orderShortTons.toFixed(2)} tons</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Total Weight (Pounds)</span>
              <span className={styles.breakdownValue}>{results.orderLbs.toLocaleString()} lbs</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Metric Tonnes (1,000 kg)</span>
              <span className={styles.breakdownValue}>{results.orderMetricTonnes.toFixed(2)} tonnes</span>
            </div>

            {results.orderLbs <= 4000 && (
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>50-lb Retail Bags</span>
                <span className={styles.breakdownValue}>{results.bags50Lb} bags</span>
              </div>
            )}

            <div className={styles.breakdownRow} style={{ borderTop: '1px solid #E2E8F0', marginTop: '6px', paddingTop: '10px' }}>
              <span className={styles.breakdownLabel}>Estimated Truck Hauls</span>
              <span className={styles.breakdownValue}>
                about {results.tandemLoads} loads
              </span>
            </div>
            <p className={styles.helperText} style={{ marginTop: '2px', fontSize: '0.75rem' }}>
              *Assumes about 14 tons per tandem-axle dump load; check your supplier and local legal load limits.
            </p>
          </div>

          {/* Cost Card (only when price entered) */}
          {results.grandTotalCost !== undefined && (
            <div className={styles.breakdownCard}>
              <h3 className={styles.breakdownTitle}>Estimated Material &amp; Delivery Cost</h3>

              {results.pricePerTon !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Equivalent Price per Ton</span>
                  <span className={styles.breakdownValue}>${results.pricePerTon.toFixed(2)} / ton</span>
                </div>
              )}
              {results.pricePerCy !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Equivalent Price per Cu Yd</span>
                  <span className={styles.breakdownValue}>${results.pricePerCy.toFixed(2)} / yd³</span>
                </div>
              )}
              {results.materialTotalCost !== undefined && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Material Subtotal</span>
                  <span className={styles.breakdownValue}>${results.materialTotalCost.toFixed(2)}</span>
                </div>
              )}
              {parsedDelivery > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownLabel}>Delivery Fee</span>
                  <span className={styles.breakdownValue}>${parsedDelivery.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.breakdownRow} style={{ borderTop: '2px solid #CBD5E1', marginTop: '6px', paddingTop: '10px' }}>
                <span className={styles.breakdownLabel} style={{ fontWeight: 800, color: '#0F172A' }}>Estimated Total</span>
                <span className={styles.costHighlight}>${results.grandTotalCost.toFixed(2)}</span>
              </div>
            </div>
          )}

          <p className={styles.disclaimerNote}>
            Densities are typical averages. Moisture, gradation and supplier can change real weight. Confirm with your supplier&apos;s scale ticket.
          </p>
        </div>
      </div>
    </div>
  );
}
