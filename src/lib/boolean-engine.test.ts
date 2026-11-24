import { describe, it, expect } from 'vitest';
import {
  tokenize,
  parseExpression,
  astToString,
  generateTruthTable,
  checkEquivalence,
  calculateBinaryMath,
  decimalToTwosComplement,
  simplifyQuineMcCluskey,
} from './boolean-engine';

describe('boolean-engine', () => {
  describe('Tokenizer & Parser', () => {
    it('tokenizes mixed operators and word forms', () => {
      const tokens = tokenize('(A & B) | (!C ^ D) -> E <-> 1');
      expect(tokens.map((t) => t.type)).toEqual([
        'LPAREN',
        'VAR',
        'AND',
        'VAR',
        'RPAREN',
        'OR',
        'LPAREN',
        'NOT',
        'VAR',
        'XOR',
        'VAR',
        'RPAREN',
        'IMPLIES',
        'VAR',
        'EQUIV',
        'CONST',
      ]);
    });

    it('respects precedence: NOT > AND > XOR > OR', () => {
      // !A & B | C ^ D -> ((!A & B) | (C ^ D))
      const ast = parseExpression('NOT A AND B OR C XOR D');
      const str = astToString(ast);
      expect(str).toBe('((NOT A AND B) OR (C XOR D))');
    });
  });

  describe('Worked Examples from Spec', () => {
    it('simplifies (A AND B) OR (A AND NOT B) to A with Σm(2, 3)', () => {
      const tt = generateTruthTable('(A AND B) OR (A AND NOT B)');
      expect(tt.variables).toEqual(['A', 'B']);
      // A=0, B=0 -> 0; A=0, B=1 -> 0; A=1, B=0 -> 1 (index 2); A=1, B=1 -> 1 (index 3)
      expect(tt.minterms).toEqual([2, 3]);
      expect(tt.sopString).toBe('Σm(2, 3)');
      expect(tt.simplifiedSOP).toBe('A');
    });

    it('proves De Morgan equivalence: NOT(A AND B) vs NOT A OR NOT B', () => {
      const equiv = checkEquivalence('NOT(A AND B)', 'NOT A OR NOT B');
      expect(equiv.isEquivalent).toBe(true);
      expect(equiv.counterexample).toBeNull();
    });

    it('proves absorption law: A AND (A OR B) is equivalent to A', () => {
      const equiv = checkEquivalence('A AND (A OR B)', 'A');
      expect(equiv.isEquivalent).toBe(true);
    });

    it('calculates binary addition 1011 + 0110 = 10001 (11 + 6 = 17)', () => {
      // In 8-bit width: 00010001
      const res = calculateBinaryMath('1011', '0110', '+', 8);
      expect(res).not.toBeNull();
      expect(res?.resultDec).toBe('17');
      expect(res?.resultBinary).toBe('00010001');
      expect(res?.resultHex).toBe('11');
    });

    it('converts -5 in 8-bit two complement to 11111011', () => {
      const twos = decimalToTwosComplement(-5, 8);
      expect(twos).toBe('11111011');
    });
  });

  describe('Equivalence Checker with Counterexample', () => {
    it('detects non-equivalence and provides a counterexample', () => {
      const res = checkEquivalence('A AND B', 'A OR B');
      expect(res.isEquivalent).toBe(false);
      expect(res.counterexample).not.toBeNull();
      // A=0, B=1 -> A AND B is false, A OR B is true
      expect(res.val1).not.toBe(res.val2);
    });
  });

  describe('Binary Operations & Two\'s Complement', () => {
    it('handles binary subtraction with two\'s complement signed output', () => {
      // 0100 (4) - 0111 (7) = -3
      const res = calculateBinaryMath('0100', '0111', '-', 8);
      expect(res).not.toBeNull();
      expect(res?.twoComplementSigned).toBe('-3');
      // 256 - 3 = 253 = 11111101 in binary
      expect(res?.resultBinary).toBe('11111101');
    });

    it('handles bitwise operations XOR, AND, OR', () => {
      const xorRes = calculateBinaryMath('1100', '1010', 'XOR', 8);
      expect(xorRes?.resultBinary).toBe('00000110'); // 6
    });
  });
});

describe('minimal cover and binary edge cases (review 2026-11-24)', () => {
  it('finds a 3-term minimal SOP for the cyclic function Σm(0,1,2,5,6,7)', () => {
    const sop = simplifyQuineMcCluskey(['A', 'B', 'C'], [0, 1, 2, 5, 6, 7]);
    expect(sop.split(' OR ')).toHaveLength(3);
  });
  it('returns null for division by zero instead of a fake 0', () => {
    expect(calculateBinaryMath('1011', '0', '/')).toBeNull();
  });
});
