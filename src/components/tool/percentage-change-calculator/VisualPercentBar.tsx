'use client';

import React from 'react';
import s from './PercentageChangeCalculator.module.css';

interface VisualPercentBarProps {
  labelOld?: string;
  valOld: number;
  labelNew?: string;
  valNew: number;
  unit?: string;
}

/**
 * Visual Percent Bar — CSS-only proportional comparison bar.
 * Visually shows relative sizes between original/initial and new/final values.
 */
export default function VisualPercentBar({
  labelOld = 'Initial Value',
  valOld,
  labelNew = 'Final Value',
  valNew,
  unit = '',
}: VisualPercentBarProps) {
  const max = Math.max(Math.abs(valOld), Math.abs(valNew), 1);
  const widthOld = Math.min(100, Math.max(8, (Math.abs(valOld) / max) * 100));
  const widthNew = Math.min(100, Math.max(8, (Math.abs(valNew) / max) * 100));
  const isIncrease = valNew > valOld;
  const isDecrease = valNew < valOld;

  return (
    <div className={s.visualBarContainer} aria-hidden="true">
      <div className={s.visualBarRow}>
        <div className={s.visualBarLabelWrap}>
          <span className={s.visualBarLabel}>{labelOld}</span>
          <span className={s.visualBarValue}>
            {valOld.toLocaleString('en-US')}
            {unit}
          </span>
        </div>
        <div className={s.visualBarTrack}>
          <div
            className={s.visualBarFillOld}
            style={{ width: `${widthOld}%` }}
          />
        </div>
      </div>

      <div className={s.visualBarRow}>
        <div className={s.visualBarLabelWrap}>
          <span className={s.visualBarLabel}>{labelNew}</span>
          <span className={s.visualBarValue}>
            {valNew.toLocaleString('en-US')}
            {unit}
          </span>
        </div>
        <div className={s.visualBarTrack}>
          <div
            className={`${s.visualBarFillNew} ${
              isIncrease ? s.fillIncrease : isDecrease ? s.fillDecrease : s.fillNeutral
            }`}
            style={{ width: `${widthNew}%` }}
          />
        </div>
      </div>
    </div>
  );
}
