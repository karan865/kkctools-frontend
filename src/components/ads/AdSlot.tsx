import React from 'react';
import { ADS_ENABLED, ADSENSE_CLIENT } from '@/config/site';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export default function AdSlot({
  slotId = 'default-slot',
  format = 'auto',
  className = '',
}: AdSlotProps) {
  // If ads are disabled or no client ID is provided, render completely inert (nothing in DOM)
  if (!ADS_ENABLED || !ADSENSE_CLIENT) {
    return null;
  }

  return (
    <div
      className={`ad-container ${className}`}
      style={{
        minHeight: '280px',
        margin: 'var(--space-6) 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-2)',
        border: '1px dashed var(--line)',
        borderRadius: 'var(--radius-m)',
      }}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '250px' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
