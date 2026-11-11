/**
 * Paint Calculator Constants
 * Verified against US retail and contractor benchmarks.
 */
export const LAST_VERIFIED = '2026-11';

export const DOOR_SQFT = 21;
export const WINDOW_SQFT = 15;

export const COVERAGE = {
  smooth: 380,
  orangePeel: 350,
  heavyTexture: 300,
  unprimed: 250,
  masonry: 225,
} as const;

export type CoverageTextureKey = keyof typeof COVERAGE | 'custom';

export const PRIMER_COVERAGE_DEFAULT = 300; // sq ft per gallon, editable

// Quart priced at 40% of a gallon (labelled as an assumption in the UI)
export const QUART_PRICE_RATIO = 0.40;

export const PRICE_PRESETS = {
  economy: 30,
  mid: 45, // mid = $45 to match all copy
  premium: 65,
} as const;

export type PricePresetKey = keyof typeof PRICE_PRESETS | 'custom';

export const DEFAULT_PRIMER_PRICE = 25;
export const DEFAULT_SUNDRIES = 25;

export const PRO_RATE_LOW = 1.00; // $ per sq ft of paintable surface
export const PRO_RATE_HIGH = 2.50;

export const MAX_ROOMS = 10;

