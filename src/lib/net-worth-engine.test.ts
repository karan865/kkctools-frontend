import { describe, it, expect } from 'vitest';
import {
  calculateNetWorth,
  calculateHouseholdNetWorth,
  compareWithSnapshot,
  AssetsInput,
  LiabilitiesInput,
} from './net-worth-engine';

describe('net-worth-engine', () => {
  const defaultAssets: AssetsInput = {
    cashChecking: 10000,
    savings: 15000,
    taxableInvestments: 40000,
    retirementPreTax: 80000,
    retirementRoth: 40000,
    primaryHome: 350000,
    otherRealEstate: 0,
    vehicles: 15000,
    businessInterests: 0,
    otherAssets: 0,
  };

  const defaultLiabilities: LiabilitiesInput = {
    primaryMortgage: 260000,
    helocHomeEquity: 0,
    autoLoans: 10000,
    studentLoans: 20000,
    creditCards: 4000,
    personalLoans: 0,
    otherLiabilities: 0,
  };

  it('matches spec §3.4 worked example exactly', () => {
    const res = calculateNetWorth(defaultAssets, defaultLiabilities);

    expect(res.totalAssets).toBe(550000);
    expect(res.totalLiabilities).toBe(294000);
    expect(res.netWorth).toBe(256000);
    expect(res.liquidAssets).toBe(65000); // 10k + 15k + 40k
    expect(res.nonMortgageDebt).toBe(34000); // 10k auto + 20k student + 4k card
    expect(res.liquidNetWorth).toBe(31000); // 65k - 34k
    expect(res.investableAssets).toBe(185000); // 65k + 120k
    expect(res.investableNetWorth).toBe(151000); // 185k - 34k
    expect(res.debtToAssetPct).toBe(53.45); // 294k / 550k = 53.4545%
    expect(res.homeEquity).toBe(90000); // 350k - 260k
    expect(res.isNegative).toBe(false);
  });

  it('handles negative net worth correctly for young graduates', () => {
    const assets: AssetsInput = {
      cashChecking: 2000,
      savings: 3000,
      taxableInvestments: 0,
      retirementPreTax: 0,
      retirementRoth: 0,
      primaryHome: 0,
      otherRealEstate: 0,
      vehicles: 5000,
      businessInterests: 0,
      otherAssets: 0,
    };

    const liabilities: LiabilitiesInput = {
      primaryMortgage: 0,
      helocHomeEquity: 0,
      autoLoans: 4000,
      studentLoans: 45000,
      creditCards: 6000,
      personalLoans: 0,
      otherLiabilities: 0,
    };

    const res = calculateNetWorth(assets, liabilities);
    expect(res.totalAssets).toBe(10000);
    expect(res.totalLiabilities).toBe(55000);
    expect(res.netWorth).toBe(-45000);
    expect(res.isNegative).toBe(true);
    expect(res.liquidAssets).toBe(5000);
    expect(res.nonMortgageDebt).toBe(55000);
    expect(res.liquidNetWorth).toBe(-50000);
  });

  it('handles zero assets without division by zero', () => {
    const emptyAssets: AssetsInput = {
      cashChecking: 0,
      savings: 0,
      taxableInvestments: 0,
      retirementPreTax: 0,
      retirementRoth: 0,
      primaryHome: 0,
      otherRealEstate: 0,
      vehicles: 0,
      businessInterests: 0,
      otherAssets: 0,
    };

    const liabilities: LiabilitiesInput = {
      primaryMortgage: 0,
      helocHomeEquity: 0,
      autoLoans: 0,
      studentLoans: 10000,
      creditCards: 2000,
      personalLoans: 0,
      otherLiabilities: 0,
    };

    const res = calculateNetWorth(emptyAssets, liabilities);
    expect(res.totalAssets).toBe(0);
    expect(res.debtToAssetPct).toBeNull();
    expect(res.netWorth).toBe(-12000);
  });

  it('applies pre-tax retirement haircut correctly when specified', () => {
    const resWithout = calculateNetWorth(defaultAssets, defaultLiabilities, { preTaxHaircutPct: 0 });
    const resWithHaircut = calculateNetWorth(defaultAssets, defaultLiabilities, { preTaxHaircutPct: 20 });

    // $80,000 pre-tax with 20% haircut -> $64,000 ($16,000 reduction in assets)
    expect(resWithout.totalAssets).toBe(550000);
    expect(resWithHaircut.totalAssets).toBe(534000);
    expect(resWithHaircut.netWorth).toBe(240000);
  });

  it('calculates months of living expenses covered by liquid assets', () => {
    const res = calculateNetWorth(defaultAssets, defaultLiabilities, { monthlySpend: 5000 });
    // $65,000 liquid / $5,000 spend = 13.0 months
    expect(res.monthsCovered).toBe(13.0);
  });

  it('calculates household mode combined net worth accurately', () => {
    const memberA = {
      name: 'Alex',
      assets: { ...defaultAssets, primaryHome: 0 },
      liabilities: { ...defaultLiabilities, primaryMortgage: 0 },
    };

    const memberB = {
      name: 'Jordan',
      assets: {
        cashChecking: 5000,
        savings: 10000,
        taxableInvestments: 20000,
        retirementPreTax: 50000,
        retirementRoth: 25000,
        primaryHome: 0,
        otherRealEstate: 0,
        vehicles: 12000,
        businessInterests: 0,
        otherAssets: 0,
      },
      liabilities: {
        primaryMortgage: 0,
        helocHomeEquity: 0,
        autoLoans: 8000,
        studentLoans: 15000,
        creditCards: 1500,
        personalLoans: 0,
        otherLiabilities: 0,
      },
    };

    const joint = {
      assets: {
        ...defaultAssets,
        cashChecking: 12000,
        savings: 20000,
        taxableInvestments: 0,
        retirementPreTax: 0,
        retirementRoth: 0,
        primaryHome: 450000,
        otherRealEstate: 0,
        vehicles: 0,
        businessInterests: 0,
        otherAssets: 0,
      },
      liabilities: {
        ...defaultLiabilities,
        primaryMortgage: 320000,
        helocHomeEquity: 0,
        autoLoans: 0,
        studentLoans: 0,
        creditCards: 0,
        personalLoans: 0,
        otherLiabilities: 0,
      },
    };

    const householdRes = calculateHouseholdNetWorth(memberA, memberB, joint);
    expect(householdRes.combined.totalAssets).toBe(
      householdRes.memberA.totalAssets + householdRes.memberB.totalAssets + householdRes.joint.totalAssets
    );
    expect(householdRes.combined.totalLiabilities).toBe(
      householdRes.memberA.totalLiabilities + householdRes.memberB.totalLiabilities + householdRes.joint.totalLiabilities
    );
    expect(householdRes.combined.netWorth).toBe(
      householdRes.memberA.netWorth + householdRes.memberB.netWorth + householdRes.joint.netWorth
    );
  });

  it('compares with saved snapshots properly', () => {
    const diff = compareWithSnapshot(256000, 240000);
    expect(diff.dollarChange).toBe(16000);
    expect(diff.pctChange).toBe(6.67); // 16k / 240k = 6.666%
    expect(diff.isPositive).toBe(true);

    const negativeDiff = compareWithSnapshot(240000, 256000);
    expect(negativeDiff.dollarChange).toBe(-16000);
    expect(negativeDiff.pctChange).toBe(-6.25);
    expect(negativeDiff.isPositive).toBe(false);
  });
});
