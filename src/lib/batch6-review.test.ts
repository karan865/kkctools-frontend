import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { extractWords, countWords, countSentences, extractSentences, getNgrams, overflowIndex, emojiCount, countGraphemes, analyzeText } from './text-engine';
import { xWeightedLength, xOverflowIndex, splitThread } from './x-count-engine';
import { bigIntToWords, bigIntToIndianWords, parseWordsToNumber, toCheckAmount, toIndianChequeAmount, toOrdinalWords } from './number-words-engine';
import { joinList, parseDelimited, detectDelimiter, cleanList } from './list-engine';
import { calculateKeywordDensity, tokenOffsets } from './keyword-density-engine';
import { calculateSentenceStats, analyzeParagraphs } from './sentence-stats-engine';

describe('words', () => {
  it.each([
    ['state-of-the-art design', 2],
    ['mother-in-law a‑b', 2],
    ['visit www.example.com/a.b now', 3],
    ['see https://www.example.com/a?b=1.', 2],
    ['Visit example.com/a.b for more.', 4],
    ['mail a@b.co.uk.', 2],
    ['foo—bar foo–bar', 4],
    ['1,234.5 it’s', 2],
    ['soft­hyphen', 1],
    ['', 0],
  ])('%s', (text, n) => expect(countWords(text)).toBe(n));

  it('keeps word order around links and drops their trailing punctuation', () => {
    expect(extractWords('see (https://a.com/x), ok')).toEqual(['see', 'https://a.com/x', 'ok']);
  });
  it('toggles', () => {
    expect(countWords('well-known', { hyphenJoin: false })).toBe(2);
    expect(countWords('in 2020-2021 and 2,500', { countNumbers: false })).toBe(2);
  });
  it('n-grams stay inside sentences and the stop list can be empty', () => {
    const s = [['The', 'cat', 'sat'], ['The', 'cat', 'ran']];
    const two = getNgrams(s, 2, { stopWords: new Set() });
    expect(two[0]).toEqual({ phrase: 'the cat', count: 2, density: 33.33 });
    expect(two.some((r) => r.phrase === 'sat the')).toBe(false);
  });
});

describe('sentences (spec 09 §3.4)', () => {
  it.each([
    ['Mr. and Mrs. Lee met Prof. Ray at 9 a.m. on Monday.', 1],
    ['The meeting starts at 9 a.m. Bring the slides.', 2],
    ['We sell apples, pears, etc. and more.', 1],
    ['We sell apples, pears, etc. Then we left.', 2],
    ['She works at Acme Inc. in Ohio.', 1],
    ['It costs 3.14 dollars. Ok.', 2],
    ['Wait... what? Yes.', 2],
    ['He said “Stop!” Then he left.', 2],
    ['Email me at a.b@example.com today. Thanks.', 2],
    ['你好。我很好！', 2],
    ['नमस्ते। आप कैसे हैं?', 2],
    ['I have 5. You have 6.', 2],
    ['It was 2024. Then we left.', 2],
    ['I live in the U.S. It is big.', 2],
    ['So am I. You too.', 2],
    ['J.K. Rowling wrote it.', 1],
    ['See No. 5 on the list.', 1],
    ['This line is\nhard wrapped here.', 1],
    ['Title\n\nbody text', 2],
    ['1. Milk\n2. Eggs', 2],
    ['***\n\nHello', 1],
    ['no final mark', 1],
  ])('%s', (text, n) => expect(countSentences(text)).toBe(n));

  it('list lines toggle', () => {
    expect(countSentences('- milk\n- eggs\n- bread')).toBe(3);
    expect(countSentences('- milk\n- eggs\n- bread', { listLines: false })).toBe(1);
  });
  it('removed and added abbreviations take effect', () => {
    expect(countSentences('Mr. Lee left.', { abbreviations: new Set() })).toBe(2);
    expect(countSentences('Adm. Lee left.')).toBe(2);
    expect(countSentences('Adm. Lee left.', { abbreviations: new Set(['adm']) })).toBe(1);
  });
  it('keeps the original quotes', () => expect(extractSentences('He said “hi”.')[0]).toBe('He said “hi”.'));
  it('stats for the fixture', () => {
    const s = calculateSentenceStats(
      'Dr. Smith arrived at 3.30 p.m. on Monday. He paid $4.50 for coffee! Was it worth it? J. K. Rowling wrote it... and then she left. Visit example.com/a.b for more.'
    );
    expect(s.wordsPerSentence).toEqual([8, 5, 4, 9, 4]);
    expect([s.meanWords, s.medianWords, s.maxWords, s.minWords]).toEqual([6, 5, 9, 4]);
  });
  it('even-count median and emoji paragraph length', () => {
    expect(calculateSentenceStats('One two. One two three.').medianWords).toBe(2.5);
    expect(analyzeParagraphs('👍🏽 ok')[0].chars).toBe(4);
  });
});

describe('X counting (spec 03 §3.4)', () => {
  it.each([
    ['Hello, world! 👋 https://example.com/a/very/long/link', 40],
    ['日本語のテキスト', 16],
    ['नमस्ते', 6],
    ['“Hi”', 4],
    ['1️⃣', 2],
    ['© 2026 Acme', 11],
    ['@friend thanks! 🙌 #tools https://example.com/x', 49],
    ['a'.repeat(280), 280],
    ['a'.repeat(279) + '👋', 281],
    ['café', 4],
    ['see https://a.com.', 28],
    ['(https://a.com)', 25],
    ['example.com hi', 26],
    ['www.example.com', 23],
    ['a@b.com', 7],
    ['https://a.com https://b.com', 47],
    ['ჿ', 1],
    ['ᄀ', 2],
    ['‎', 2],
    ['‟', 1],
    ['†', 2],
    ['‷', 1],
    ['‸', 2],
  ])('%s', (text, n) => expect(xWeightedLength(text)).toBe(n));

  it('overflow', () => {
    expect(xOverflowIndex('a'.repeat(280), 280)).toBe(-1);
    expect(xOverflowIndex('a'.repeat(279) + '👋', 280)).toBe(279);
  });

  it.each(['fraction', 'bracket', 'emoji', 'none'] as const)('thread invariants: %s', (numbering) => {
    const url = 'https://example.com/a/very/long/path/that/must/stay/whole';
    const text =
      `Dr. Lee wrote this first sentence about threads. See ${url} for 👨‍👩‍👧‍👦 details!\n\n` +
      'Another plain sentence that fills space here. '.repeat(90) +
      'x'.repeat(700);
    const posts = splitThread(text, { numbering });
    expect(posts.length).toBeGreaterThan(10);
    posts.forEach((p) => expect(xWeightedLength(p)).toBeLessThanOrEqual(280));
    const bodies = posts.map((p, i) => {
      const n = `${i + 1}/${posts.length}`;
      const s = { fraction: ` ${n}`, bracket: ` (${n})`, emoji: ` 🧵 ${n}`, none: '' }[numbering];
      expect(p.endsWith(s)).toBe(true);
      return p.slice(0, p.length - s.length);
    });
    expect(bodies.join('').replace(/\s/g, '')).toBe(text.replace(/\s/g, ''));
    expect(posts.some((p) => p.includes(url))).toBe(true);
    expect(posts[0]).toContain('\n\n');
  });
  it('short text gets no suffix', () => expect(splitThread('Hi')).toEqual(['Hi']));
});

describe('overflowIndex', () => {
  it('per unit', () => {
    expect(overflowIndex('abc', 3, 'graphemes')).toBe(-1);
    expect(overflowIndex('👍🏽bc', 1, 'graphemes')).toBe(4);
    expect(overflowIndex('a b c', 2, 'noSpaces')).toBe(4);
    expect(overflowIndex('aé', 2, 'bytes')).toBe(1);
    expect(overflowIndex('one two three', 2, 'words')).toBe(8);
  });
  it('CRLF is one character; plain symbols are not emoji', () => {
    expect(countGraphemes('a\r\nb')).toBe(3);
    expect(emojiCount('© ™ 1 1️⃣')).toBe(1);
  });
});

describe('numbers', () => {
  it('UK and', () => {
    expect(bigIntToWords(BigInt(1001), { style: 'uk' })).toBe('one thousand and one');
    expect(bigIntToWords(BigInt(1100), { style: 'uk' })).toBe('one thousand one hundred');
    expect(bigIntToWords(BigInt(1001))).toBe('one thousand one');
  });
  it('limits and amount input', () => {
    expect(bigIntToWords(BigInt('1' + '0'.repeat(33)))).toBe('one decillion');
    expect(bigIntToWords(BigInt('9'.repeat(36)))).toContain('decillion');
    expect(toCheckAmount('1' + '0'.repeat(36))).toBeNull();
    expect(toCheckAmount('-5')).toBeNull();
    expect(toIndianChequeAmount('-5')).toBeNull();
    expect(toCheckAmount('$1,234.50')).toBe('One thousand two hundred thirty-four and 50/100 dollars');
    expect(toCheckAmount('.5')).toBe('Zero and 50/100 dollars');
    expect(toIndianChequeAmount('₹1,00,00,000')).toBe('Rupees One Crore Only');
    expect(toOrdinalWords('one hundred twelve')).toBe('one hundred twelfth');
  });
  it.each([
    ['one thousand crore', '10000000000'],
    ['one lakh crore', '1000000000000'],
    ['one thousand two hundred crore', '12000000000'],
    ['two hundred thousand million', '200000000000'],
    ['twenty-five hundred', '2500'],
    ['two million five', '2000005'],
    ['a hundred', '100'],
    ['negative five', '-5'],
    ['three point one four', '3.14'],
    ['fourteenth', '14'],
    ['Rupees Twelve Lakh Only', '1200000'],
    ['zero', '0'],
    ['one million first', '1000001'],
  ])('%s', (t, v) => expect(parseWordsToNumber(t).formatted).toBe(v));
  it.each(['one two', 'five twenty', 'ten five', 'one lakh two lakh', 'xyz', 'zero five', 'three point', 'constructor', ''])(
    'rejects "%s"',
    (t) => expect(parseWordsToNumber(t).success).toBe(false)
  );
  it('round trips', () => {
    for (let n = 1; n < 1e9; n = Math.floor(n * 1.7) + 13) {
      const b = BigInt(n);
      const indian = b * BigInt(1009);
      expect(parseWordsToNumber(bigIntToWords(b)).value).toBe(b);
      expect(parseWordsToNumber(bigIntToWords(b, { style: 'uk' })).value).toBe(b);
      expect(parseWordsToNumber(bigIntToIndianWords(indian)).value).toBe(indian);
      expect(parseWordsToNumber(toOrdinalWords(bigIntToWords(b))).value).toBe(b);
    }
  });
});

describe('lists', () => {
  it('quotes commas under a comma + space delimiter and round trips', () => {
    const items = ['Smith,John', 'say "hi"', 'b', 'two\nlines'];
    const out = joinList(items, { delimiter: ', ' });
    expect(out).toBe('"Smith,John", "say ""hi""", b, "two\nlines"');
    expect(parseDelimited(out).map((v) => v.trim())).toEqual(items);
  });
  it('parser edge cases', () => {
    expect(parseDelimited('5" pipe,x')).toEqual(['5" pipe', 'x']);
    expect(parseDelimited('a,b\n')).toEqual(['a', 'b']);
    expect(parseDelimited('a,,b')).toEqual(['a', '', 'b']);
    expect(detectDelimiter('"a,b,c";d')).toBe(';');
  });
  it('numeric sort', () => expect(cleanList(['1,200', 'x', '9'], { sort: 'numeric' }).items).toEqual(['9', '1,200', 'x']));
});

describe('keyword density', () => {
  it('a target phrase never crosses a sentence', () => {
    expect(
      calculateKeywordDensity('I love word. Counter is good.', { targetPhrase: 'word counter' }).targetAnalysis?.count
    ).toBe(0);
  });
});

describe('sample blocks on the pages have the length they state', () => {
  const longStrings = (file: string) => {
    const src = readFileSync(`src/app/${file}/page.tsx`, 'utf8').replace(/\r/g, '');
    const out: string[] = [];
    const re = /const sample\w+\s*=\s*(['"`])([\s\S]*?[^\\])\1;/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src)) !== null) {
      if (m[2].length > 200) out.push(m[2].split('\\n').join('\n').replace(/\\(['"])/g, '$1'));
    }
    return out;
  };
  it('100, 200 and 300 words', () => expect(longStrings('words-to-pages').map((t) => countWords(t))).toEqual([100, 200, 300]));
  it('500 and 1,000 characters', () =>
    expect(longStrings('characters-to-words').map((t) => countGraphemes(t))).toEqual([500, 1000]));
});

describe('improvement round', () => {
  it('ignoring punctuation keeps emoji and symbols', () => {
    expect(analyzeText('Hi 👋 $5+!', { ignorePunctuation: true }).characters).toBe(8);
    expect(analyzeText('½ 1a', { ignoreDigits: true }).characters).toBe(3);
  });
  it('overflow index is valid for text typed with combining marks', () => {
    const typed = 'cafe\u0301s';
    expect(overflowIndex(typed, 4, 'graphemes')).toBe(5);
    expect(overflowIndex('a,b', 2, 'bytes', { ignorePunctuation: true })).toBe(2);
  });
  it('keyword hits select the word itself, not a longer word before it', () => {
    const text = 'Category one. The cat sat; it\u2019s a ca\u00ADt, my cat.';
    const hits = calculateKeywordDensity(text, { targetPhrase: 'cat' }).targetAnalysis!.kwic.map((k) => [k.startIndex, text.slice(k.startIndex, k.endIndex)]);
    expect(hits).toEqual([
      [18, 'cat'],
      [34, 'ca\u00ADt'],
      [43, 'cat'],
    ]);
    expect(tokenOffsets('cafe\u0301 ok', ['caf\u00E9', 'ok'])).toEqual([
      { start: 0, end: 5 },
      { start: 6, end: 8 },
    ]);
  });
});
