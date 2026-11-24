import { describe, it, expect } from 'vitest';
import {
  bigIntToWords,
  bigIntToIndianWords,
  toCheckAmount,
  toIndianChequeAmount,
  groupDigits,
  toOrdinalWords,
  parseWordsToNumber,
  roundCents,
  parseNumberInput,
} from './number-words-engine';

describe('number-words-engine', () => {
  describe('Worked examples from Spec 04 §3.4', () => {
    it('5,075.62 (check) -> Five thousand seventy-five and 62/100 dollars', () => {
      expect(toCheckAmount('5,075.62')).toBe('Five thousand seventy-five and 62/100 dollars');
    });

    it('1,250.75 (check) -> One thousand two hundred fifty and 75/100 dollars', () => {
      expect(toCheckAmount('1,250.75')).toBe('One thousand two hundred fifty and 75/100 dollars');
    });

    it('88.52 (check) -> Eighty-eight and 52/100 dollars', () => {
      expect(toCheckAmount('88.52')).toBe('Eighty-eight and 52/100 dollars');
    });

    it('0.05 (check) -> Zero and 05/100 dollars', () => {
      expect(toCheckAmount('0.05')).toBe('Zero and 05/100 dollars');
    });

    it('10.995 (check) -> Eleven and 00/100 dollars (rounding carries into integer)', () => {
      expect(toCheckAmount('10.995')).toBe('Eleven and 00/100 dollars');
    });

    it('1,234.567 (check) -> One thousand two hundred thirty-four and 57/100 dollars', () => {
      expect(toCheckAmount('1,234.567')).toBe('One thousand two hundred thirty-four and 57/100 dollars');
    });

    it('123 US and UK styles', () => {
      expect(bigIntToWords(BigInt('123'), { style: 'us' })).toBe('one hundred twenty-three');
      expect(bigIntToWords(BigInt('123'), { style: 'uk' })).toBe('one hundred and twenty-three');
    });

    it('1,000,001 -> one million one', () => {
      expect(bigIntToWords(BigInt('1000001'))).toBe('one million one');
    });

    it('4,207,938 -> four million two hundred seven thousand nine hundred thirty-eight', () => {
      expect(bigIntToWords(BigInt('4207938'))).toBe(
        'four million two hundred seven thousand nine hundred thirty-eight'
      );
    });

    it('12,34,567.50 (cheque) -> Rupees Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven and Fifty Paise Only', () => {
      expect(toIndianChequeAmount('12,34,567.50')).toBe(
        'Rupees Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven and Fifty Paise Only'
      );
    });

    it('25,000 (cheque) -> Rupees Twenty-Five Thousand Only', () => {
      expect(toIndianChequeAmount('25,000')).toBe('Rupees Twenty-Five Thousand Only');
    });

    it('99.99 (cheque) -> Rupees Ninety-Nine and Ninety-Nine Paise Only', () => {
      expect(toIndianChequeAmount('99.99')).toBe('Rupees Ninety-Nine and Ninety-Nine Paise Only');
    });

    it('1,00,00,000 (cheque) -> Rupees One Crore Only', () => {
      expect(toIndianChequeAmount('1,00,00,000')).toBe('Rupees One Crore Only');
    });

    it('10,00,00,000 -> ten crore (Indian) vs one hundred million (US)', () => {
      expect(bigIntToIndianWords(BigInt('100000000'))).toBe('ten crore');
      expect(bigIntToWords(BigInt('100000000'))).toBe('one hundred million');
    });

    it('1,000,00,00,000 -> one thousand crore', () => {
      expect(bigIntToIndianWords(BigInt('10000000000'))).toBe('one thousand crore');
    });

    it('Digit grouping 1234567 and 123456789', () => {
      expect(groupDigits('1234567', 'intl')).toBe('1,234,567');
      expect(groupDigits('1234567', 'indian')).toBe('12,34,567');
      expect(groupDigits('123456789', 'intl')).toBe('123,456,789');
      expect(groupDigits('123456789', 'indian')).toBe('12,34,56,789');
    });

    it('10^33 -> one decillion', () => {
      const decillion = BigInt('1000000000000000000000000000000000');
      expect(bigIntToWords(decillion)).toBe('one decillion');
    });

    it('Ordinals 1, 2, 3, 5, 8, 9, 12, 20, 21, 40, 100, 112', () => {
      expect(toOrdinalWords('one')).toBe('first');
      expect(toOrdinalWords('two')).toBe('second');
      expect(toOrdinalWords('three')).toBe('third');
      expect(toOrdinalWords('five')).toBe('fifth');
      expect(toOrdinalWords('eight')).toBe('eighth');
      expect(toOrdinalWords('nine')).toBe('ninth');
      expect(toOrdinalWords('twelve')).toBe('twelfth');
      expect(toOrdinalWords('twenty')).toBe('twentieth');
      expect(toOrdinalWords('twenty-one')).toBe('twenty-first');
      expect(toOrdinalWords('forty')).toBe('fortieth');
      expect(toOrdinalWords('one hundred')).toBe('one hundredth');
      expect(toOrdinalWords('one hundred twelve')).toBe('one hundred twelfth');
    });

    it('Reverse words -> numbers', () => {
      expect(parseWordsToNumber('three hundred fifty').value).toBe(BigInt('350'));
      expect(parseWordsToNumber('one hundred and twenty-three').value).toBe(BigInt('123'));
      expect(parseWordsToNumber('a hundred').value).toBe(BigInt('100'));
      expect(parseWordsToNumber('two million five').value).toBe(BigInt('2000005'));
      expect(parseWordsToNumber('twelve lakh thirty-four thousand five hundred sixty-seven').value).toBe(
        BigInt('1234567')
      );
    });
  });

  describe('Edge cases and boundary tests', () => {
    it('handles zero, negative zero, and basic scales', () => {
      expect(bigIntToWords(BigInt('0'))).toBe('zero');
      expect(bigIntToIndianWords(BigInt('0'))).toBe('zero');

      const negZero = parseNumberInput('-0');
      expect(negZero?.sign).toBe('');
      expect(negZero?.isNegativeZero).toBe(true);
    });

    it('roundCents half-up and boundaries', () => {
      expect(roundCents('05')).toEqual({ intCarry: 0, centsStr: '05' });
      expect(roundCents('994')).toEqual({ intCarry: 0, centsStr: '99' });
      expect(roundCents('995')).toEqual({ intCarry: 1, centsStr: '00' });
      expect(roundCents('005')).toEqual({ intCarry: 0, centsStr: '01' });
    });

    it('reverse parser unknown word detection', () => {
      const res = parseWordsToNumber('one hundred banana fifty');
      expect(res.success).toBe(false);
      expect(res.unknownWord).toBe('banana');
    });
  });
});
