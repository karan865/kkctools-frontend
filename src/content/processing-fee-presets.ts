/**
 * processing-fee-presets.ts — Verified Payment Processor Rate Presets
 *
 * Source of truth for /processing-fee-calculator/
 * STRICT RULE: Only presets read on official provider pricing pages are listed.
 * Every entry contains provider, type, pct, fixed, currency, sourceUrl, and checked date.
 * TODO(owner): Re-check presets every 3 months.
 * 2026-11-21 review: Stripe and PayPal presets removed. Their official pricing pages could not be
 * read (Stripe served a non-US page; PayPal returned 403), so their rates are unverified. Re-add
 * only after reading the official US pricing page, with sourceUrl + checked date.
 */

export interface ProcessorPreset {
  id: string;
  provider: string;
  planName?: string;
  type: string;
  pct: number; // e.g. 2.6 for 2.6%
  fixed: number; // in currency units (e.g. 0.15 for $0.15)
  monthlyFee: number;
  currency: string;
  sourceUrl: string;
  checked: string; // ISO date 'YYYY-MM-DD'
  notes?: string;
}

export const VERIFIED_PROCESSOR_PRESETS: ProcessorPreset[] = [
  // Square US (squareup.com/us/en/pricing)
  {
    id: 'square-in-person',
    provider: 'Square',
    planName: 'Square Free',
    type: 'In-Person (Tap, Chip, Swipe)',
    pct: 2.6,
    fixed: 0.15,
    monthlyFee: 0,
    currency: 'USD',
    sourceUrl: 'https://squareup.com/us/en/pricing',
    checked: '2026-11-20',
    notes: 'Standard rate on free plan for Magstripe, Chip, and Contactless/NFC transactions.',
  },
  {
    id: 'square-online',
    provider: 'Square',
    planName: 'Square Free',
    type: 'Online Store & Invoices',
    pct: 3.3,
    fixed: 0.30,
    monthlyFee: 0,
    currency: 'USD',
    sourceUrl: 'https://squareup.com/us/en/pricing',
    checked: '2026-11-20',
    notes: 'Square Online store checkout, digital invoices, and online checkout links.',
  },
  {
    id: 'square-keyed',
    provider: 'Square',
    planName: 'Square Free',
    type: 'Manually Keyed / Card on File',
    pct: 3.5,
    fixed: 0.15,
    monthlyFee: 0,
    currency: 'USD',
    sourceUrl: 'https://squareup.com/help/us/en/article/5068',
    checked: '2026-11-20',
    notes: 'Virtual terminal manual card entry and recurring card-on-file charges.',
  },
  {
    id: 'square-plus-in-person',
    provider: 'Square',
    planName: 'Square Plus ($49/mo)',
    type: 'In-Person (Square Plus Plan)',
    pct: 2.5,
    fixed: 0.15,
    monthlyFee: 49,
    currency: 'USD',
    sourceUrl: 'https://squareup.com/us/en/pricing',
    checked: '2026-11-20',
    notes: 'Discounted in-person processing rate with Square for Restaurants/Retail Plus subscription.',
  },
];
