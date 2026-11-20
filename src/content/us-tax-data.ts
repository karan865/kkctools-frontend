/**
 * US Tax Data — Verified federal tax rates, wage bases, thresholds, and mileage allowances.
 *
 * Rules (from 00_BATCH3_BUILD_RULES.md §7):
 * - ONLY figures verified on official IRS or SSA government pages with date and URL are included.
 * - Anything unverified or pending owner review stays null with a TODO(owner) comment.
 * - Used by Labor Cost Calculator, Freelance Hourly Rate Calculator, and Self-Employment Tax Calculator.
 */

export interface TaxSourceReference {
  label: string;
  url: string;
  checked: string;
}

export interface MileageRatePeriod {
  from: string;
  to: string;
  centsPerMile: number;
}

export interface UsTaxYearData {
  year: number;
  ssRate: number; // 0.124 (12.4% employer + employee combined)
  medicareRate: number; // 0.029 (2.9% combined)
  seTaxTotalRate: number; // 0.153 (15.3% combined)
  seFactor: number | null; // TODO(owner): verify 92.35% net earnings multiplier from Schedule SE instructions
  ssWageBase: number; // Maximum earnings subject to Social Security tax
  addlMedicareRate: number; // 0.009 (0.9% surtax above threshold)
  addlMedicareThresholds: {
    single: number;
    mfj: number;
    mfs: number;
    hoh: number;
  };
  seMinimumNet: number; // Net earnings threshold where SE tax begins ($400)
  futa: {
    grossRate: number;
    wageBase: number;
    maxCreditRate: number;
    netRate: number;
  } | null; // TODO(owner): verify FUTA state credit rules
  mileage: MileageRatePeriod[];
  estimatedTaxDueDates: string[];
  safeHarbor: {
    currentYearPct: number; // 90%
    priorYearPct: number; // 100%
    penaltyExemptionThreshold: number; // $1,000
    highIncomeThreshold: number | null; // TODO(owner): verify 110% prior-year safe harbor threshold ($150,000 AGI)
    highIncomePriorYearPct: number | null; // 110%
  };
  sources: TaxSourceReference[];
}

export const US_TAX_DATA: Record<number, UsTaxYearData> = {
  2026: {
    year: 2026,
    ssRate: 0.124,
    medicareRate: 0.029,
    seTaxTotalRate: 0.153,
    seFactor: 0.9235, // Verified: IRS Schedule SE (Form 1040) Line 4a and IRC § 1402(a)(12) (100% - 7.65% = 92.35%)
    ssWageBase: 184500, // IRS page reviewed 30-Oct-2026. SSA COLA fact sheet (ssa.gov/oact/cola/cbb.html)
    addlMedicareRate: 0.009,
    addlMedicareThresholds: {
      single: 200000,
      mfj: 250000,
      mfs: 125000,
      hoh: 200000,
    },
    seMinimumNet: 400,
    futa: null, // TODO(owner): verify 2026 FUTA effective rate
    mileage: [
      { from: '2026-01-01', to: '2026-06-30', centsPerMile: 72.5 },
      { from: '2026-07-01', to: '2026-12-31', centsPerMile: 76.0 },
    ],
    estimatedTaxDueDates: ['2026-04-15', '2026-06-15', '2026-09-15', '2027-01-15'],
    safeHarbor: {
      currentYearPct: 90,
      priorYearPct: 100,
      penaltyExemptionThreshold: 1000,
      highIncomeThreshold: null, // TODO(owner): verify IRS Pub 505 $150k AGI rule
      highIncomePriorYearPct: null, // TODO(owner): verify 110%
    },
    sources: [
      {
        label: 'IRS: Self-employment tax (Social Security and Medicare taxes)',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes',
        checked: '2026-10-30',
      },
      {
        label: 'IRS: Standard mileage rates',
        url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates',
        checked: '2026-07-28',
      },
      {
        label: 'IRS: Estimated taxes for individuals',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes',
        checked: '2026-10-15',
      },
    ],
  },
  2025: {
    year: 2025,
    ssRate: 0.124,
    medicareRate: 0.029,
    seTaxTotalRate: 0.153,
    seFactor: null, // TODO(owner): confirm 0.9235 factor from 2025 IRS Schedule SE form
    ssWageBase: 176100,
    addlMedicareRate: 0.009,
    addlMedicareThresholds: {
      single: 200000,
      mfj: 250000,
      mfs: 125000,
      hoh: 200000,
    },
    seMinimumNet: 400,
    futa: null,
    mileage: [
      { from: '2025-01-01', to: '2025-12-31', centsPerMile: 70.0 },
    ],
    estimatedTaxDueDates: ['2025-04-15', '2025-06-16', '2025-09-15', '2026-01-15'],
    safeHarbor: {
      currentYearPct: 90,
      priorYearPct: 100,
      penaltyExemptionThreshold: 1000,
      highIncomeThreshold: null,
      highIncomePriorYearPct: null,
    },
    sources: [
      {
        label: 'IRS: Self-employment tax (Social Security and Medicare taxes)',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes',
        checked: '2026-10-30',
      },
      {
        label: 'IRS: Standard mileage rates',
        url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates',
        checked: '2026-07-28',
      },
    ],
  },
};
