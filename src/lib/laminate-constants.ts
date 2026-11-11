/**
 * Constants and benchmarks for Laminate Flooring Calculator (Tool #12).
 * Strictly client-side pure data.
 * All figures derived from 2026 US market averages.
 */

export const LAST_VERIFIED = '2026-11';

export const LAMINATE_CONSTANTS = {
  lastReviewed: '2026-11',
  defaultBoxCoverageSqFt: 20.0,
  minBoxCoverageSqFt: 15.0,
  maxBoxCoverageSqFt: 30.0,
  defaultRollCoverageSqFt: 100.0,
  defaultUnderlaymentPricePerRoll: 40.0,
  defaultMoldingPricePerLinearFt: 1.50,
  moldingPieceLengthFt: 7.8, // ~94 inches
  moldingWasteMultiplier: 1.10, // 10% waste on moldings
  proLaborRateLow: 2.0, // $2.00 / sq ft net
  proLaborRateHigh: 5.0, // $5.00 / sq ft net
  maxAreas: 12,
  maxDimensionFt: 500,
  maxWastePercent: 30,
};

export interface WastePatternOption {
  id: string;
  name: string;
  wastePercent: number;
  description: string;
}

export const WASTE_PATTERNS: WastePatternOption[] = [
  {
    id: 'straight',
    name: 'Straight Lay (10%)',
    wastePercent: 10,
    description: 'Simple rectangular rooms, standard parallel planks (recommended safe default)',
  },
  {
    id: 'complex',
    name: 'Complex Room (12%)',
    wastePercent: 12,
    description: 'Rooms with multiple doorways, closets, hallways, or non-square corners',
  },
  {
    id: 'diagonal',
    name: 'Diagonal 45° (15%)',
    wastePercent: 15,
    description: 'Planks installed at a 45-degree angle to walls; requires angled perimeter cuts',
  },
  {
    id: 'herringbone',
    name: 'Herringbone / Chevron (20%)',
    wastePercent: 20,
    description: 'Intricate 90-degree interlocking pattern with high triangular scrap rate',
  },
  {
    id: 'custom',
    name: 'Custom %',
    wastePercent: 10,
    description: 'Specify custom waste allowance between 0% and 30%',
  },
];

export const BOX_COVERAGE_CHIPS = [18, 20, 22, 24];

