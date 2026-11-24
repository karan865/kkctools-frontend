import { describe, it, expect } from 'vitest';
import {
  splitLines,
  cleanList,
  quoteCsv,
  joinList,
  toSqlPreset,
  toJsonPreset,
  toExcelPreset,
  parseDelimited,
} from './list-engine';

describe('list-engine', () => {
  describe('Worked examples from Spec 08 §3.4', () => {
    it('quotes embedded commas, quotes, and newlines the CSV way', () => {
      const items = ['apple', 'Smith, John', 'say "hi"', 'line\nbreak'];
      const result = joinList(items, { delimiter: ',', quote: 'auto' });
      expect(result).toBe('apple,"Smith, John","say ""hi""","line\nbreak"');
    });

    it('SQL preset escapes single quotes properly', () => {
      const items = ['apple', "O'Brien", 'pear'];
      expect(toSqlPreset(items)).toBe("('apple', 'O''Brien', 'pear')");
    });

    it('JSON preset matches valid JSON array format', () => {
      const items = ['apple', 'say "hi"', 'pear'];
      expect(toJsonPreset(items)).toBe('["apple","say \\"hi\\"","pear"]');
    });

    it('cleans with trim, empty removal, case-insensitive dedupe, and A-Z sort', () => {
      const input = ['apple', 'Banana', '', 'apple ', 'cherry', 'banana'];
      const cleaned = cleanList(input, {
        trim: true,
        removeEmpty: true,
        dedupe: 'ci',
        sort: 'asc',
      });

      expect(cleaned.items).toEqual(['apple', 'Banana', 'cherry']);
      expect(cleaned.emptyRemoved).toBe(1);
      expect(cleaned.duplicatesRemoved).toBe(2);

      const formatted = joinList(cleaned.items, { delimiter: ', ', quote: 'none' });
      expect(formatted).toBe('apple, Banana, cherry');
    });

    it('natural sort orders item1, item2, item10 correctly', () => {
      const input = ['item10', 'item2', 'item1'];
      const cleaned = cleanList(input, { sort: 'natural' });
      expect(cleaned.items).toEqual(['item1', 'item2', 'item10']);
    });

    it('numeric sort orders numbers numerically and leaves non-numbers last', () => {
      const input = ['10', '9', '100'];
      const cleaned = cleanList(input, { sort: 'numeric' });
      expect(cleaned.items).toEqual(['9', '10', '100']);
    });

    it('chunks N items per line', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];
      const chunked = joinList(items, { delimiter: ', ', quote: 'none', itemsPerLine: 2 });
      expect(chunked).toBe('a, b\nc, d\ne');
    });

    it('RFC 4180 parser reverses quoted list back to original lines', () => {
      const csv = 'apple,"Smith, John","say ""hi""",pear';
      const parsed = parseDelimited(csv, ',');
      expect(parsed).toEqual(['apple', 'Smith, John', 'say "hi"', 'pear']);
    });

    it('round trip: column -> list -> column preserves values', () => {
      const original = ['First item', 'Item with, comma', 'Item with "quotes"'];
      const joined = joinList(original, { delimiter: ',', quote: 'auto' });
      const roundTripped = parseDelimited(joined, ',');
      expect(roundTripped).toEqual(original);
    });

    it('Excel preset formats array constant', () => {
      const items = ['alpha', 'beta "quote"'];
      expect(toExcelPreset(items)).toBe('{"alpha","beta ""quote"""}');
    });
  });

  describe('Edge cases and boundary tests', () => {
    it('splits CRLF, LF, CR transparently', () => {
      expect(splitLines('a\r\nb\nc\rd')).toEqual(['a', 'b', 'c', 'd']);
    });

    it('case-sensitive vs case-insensitive deduplication', () => {
      const input = ['Alpha', 'alpha', 'ALPHA'];
      const cs = cleanList(input, { dedupe: 'cs' });
      expect(cs.items).toEqual(['Alpha', 'alpha', 'ALPHA']);
      expect(cs.duplicatesRemoved).toBe(0);

      const ci = cleanList(input, { dedupe: 'ci' });
      expect(ci.items).toEqual(['Alpha']);
      expect(ci.duplicatesRemoved).toBe(2);
    });
  });
});
