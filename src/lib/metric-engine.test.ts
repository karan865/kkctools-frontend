import { describe, it, expect } from 'vitest';
import {
  convertGeneral,
  convertTemperature,
  parseFeetInches,
  generateConversionChart,
} from './metric-engine';

describe('metric-engine', () => {
  describe('Worked Examples from Spec', () => {
    it('converts 10 ft to exactly 3.048 m', () => {
      const res = convertGeneral(10, 'ft', 'm', 'length', 4);
      expect(res).not.toBeNull();
      expect(res?.resultValue).toBe(3.048);
      expect(res?.formattedResult).toBe('3.048');
    });

    it('parses and converts 5\' 10" to 1.778 m', () => {
      const ftVal = parseFeetInches('5\' 10"');
      expect(ftVal).not.toBeNull();
      // 5 ft 10 in = 70 inches = 70 * 0.0254 = 1.778 m
      const res = convertGeneral(ftVal!, 'ft', 'm', 'length', 4);
      expect(res?.resultValue).toBeCloseTo(1.778, 4);
      expect(res?.formattedResult).toBe('1.778');
    });

    it('converts 100 kg to 220.462 lb', () => {
      const res = convertGeneral(100, 'kg', 'lb', 'weight', 3);
      expect(res).not.toBeNull();
      // 100 / 0.45359237 = 220.46226...
      expect(res?.resultValue).toBeCloseTo(220.462, 3);
      expect(res?.formattedResult).toBe('220.462');
    });

    it('converts 68 °F to 20 °C', () => {
      const res = convertTemperature(68, 'f', 'c', 'point', 2);
      expect(res.resultValue).toBe(20);
      expect(res.formattedResult).toBe('20');
    });

    it('converts a 10 °C temperature difference to 18 °F', () => {
      const res = convertTemperature(10, 'c', 'f', 'diff', 2);
      expect(res.resultValue).toBe(18);
      expect(res.formattedResult).toBe('18');
    });

    it('converts 1 m² to 10.7639 ft²', () => {
      const res = convertGeneral(1, 'sq_m', 'sq_ft', 'area', 4);
      expect(res).not.toBeNull();
      // 1 / 0.09290304 = 10.7639104...
      expect(res?.resultValue).toBeCloseTo(10.7639, 4);
      expect(res?.formattedResult).toBe('10.7639');
    });
  });

  describe('NIST Definitional Factors & Roundtrips', () => {
    it('verifies exact definitions: 1 in = 25.4 mm and 1 yd = 0.9144 m', () => {
      const inRes = convertGeneral(1, 'in', 'mm', 'length', 4);
      expect(inRes?.resultValue).toBe(25.4);

      const ydRes = convertGeneral(1, 'yd', 'm', 'length', 4);
      expect(ydRes?.resultValue).toBe(0.9144);
    });

    it('verifies US gallon vs Imperial gallon', () => {
      const usGalInLitres = convertGeneral(1, 'us_gal', 'l', 'volume', 6);
      expect(usGalInLitres?.resultValue).toBeCloseTo(3.785412, 5);

      const impGalInLitres = convertGeneral(1, 'imp_gal', 'l', 'volume', 6);
      expect(impGalInLitres?.resultValue).toBe(4.54609);
    });

    it('verifies short ton (2000 lb) and long ton (2240 lb)', () => {
      const shortTonInLb = convertGeneral(1, 'short_ton', 'lb', 'weight', 2);
      expect(shortTonInLb?.resultValue).toBe(2000);

      const longTonInLb = convertGeneral(1, 'long_ton', 'lb', 'weight', 2);
      expect(longTonInLb?.resultValue).toBe(2240);
    });
  });

  describe('Conversion Chart Generation', () => {
    it('generates conversion table with correct steps', () => {
      const chart = generateConversionChart('ft', 'm', 'length', 1, 5, 1);
      expect(chart.length).toBe(5);
      expect(chart[0].from).toBe(1);
      expect(chart[0].to).toBe(0.3048);
      expect(chart[4].from).toBe(5);
      expect(chart[4].to).toBeCloseTo(1.524, 4);
    });
  });
});
