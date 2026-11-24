import { describe, it, expect } from 'vitest';
import {
  normalizeText,
  countGraphemes,
  countCodePoints,
  countUtf16,
  countUtf8Bytes,
  charsNoSpaces,
  scriptCounts,
  isEmojiGrapheme,
  emojiCount,
  extractWords,
  countWords,
  extractSentences,
  countSentences,
  countParagraphs,
  getNgrams,
  calculateReadingTime,
  calculateSpeakingTime,
} from './text-engine';
import { xWeightedLength, splitThread } from './x-count-engine';

describe('Batch 6 Shared Text Engine — Rules §4 & Section 3 Fixtures', () => {
  it('fixture 1: Hello, world! 👋 matches X weighted 16, graphemes 15, utf16 16, utf8 18', () => {
    const text = 'Hello, world! 👋';
    expect(xWeightedLength(text)).toBe(16);
    expect(countGraphemes(text)).toBe(15);
    expect(countCodePoints(text)).toBe(15);
    expect(countUtf16(text)).toBe(16);
    expect(countUtf8Bytes(text)).toBe(18);
    expect(emojiCount(text)).toBe(1);
  });

  it('fixture 2: 你好世界 matches X weighted 8, graphemes 4, utf8 12', () => {
    const text = '你好世界';
    expect(xWeightedLength(text)).toBe(8);
    expect(countGraphemes(text)).toBe(4);
    expect(countCodePoints(text)).toBe(4);
    expect(countUtf16(text)).toBe(4);
    expect(countUtf8Bytes(text)).toBe(12);
    expect(scriptCounts(text).han).toBe(4);
  });

  it('fixture 3: URL weighting matches 36 (10 + 23 + 1 + 2)', () => {
    const text = 'Read this https://www.example.com/a/very/long/path?utm_source=x 🚀';
    expect(xWeightedLength(text)).toBe(36);
    expect(emojiCount(text)).toBe(1);
  });

  it('fixture 4: family emoji 👨‍👩‍👧‍👦 is 1 grapheme, 7 code points, 11 utf16, 25 utf8, X 2', () => {
    const text = '👨‍👩‍👧‍👦';
    expect(countGraphemes(text)).toBe(1);
    expect(countCodePoints(text)).toBe(7);
    expect(countUtf16(text)).toBe(11);
    expect(countUtf8Bytes(text)).toBe(25);
    expect(xWeightedLength(text)).toBe(2);
    expect(emojiCount(text)).toBe(1);
  });

  it('fixture 5: regional indicator flag 🇮🇳 is 1 grapheme, 2 code points, X 2', () => {
    const text = '🇮🇳';
    expect(countGraphemes(text)).toBe(1);
    expect(countCodePoints(text)).toBe(2);
    expect(countUtf16(text)).toBe(4);
    expect(countUtf8Bytes(text)).toBe(8);
    expect(xWeightedLength(text)).toBe(2);
    expect(emojiCount(text)).toBe(1);
  });

  it('fixture 6: café NFC vs NFD normalization behavior', () => {
    const nfc = 'café';
    const nfd = 'cafe\u0301'; // 'e' + combining acute accent

    expect(countGraphemes(nfc)).toBe(4);
    expect(countGraphemes(nfd)).toBe(4);
    expect(countCodePoints(nfc)).toBe(4);
    expect(countCodePoints(nfd)).toBe(5);

    // After normalizeText, NFD is normalized to NFC
    expect(countCodePoints(normalizeText(nfd))).toBe(4);
  });

  it('fixture 7: word counting hyphen rule gives 10 words (vs raw segmenter 12)', () => {
    const text = 'It’s a well-known fact — numbers like 2,500 and e-mail count.';
    const words = extractWords(text, { hyphenJoin: true });
    expect(words.length).toBe(10);
    expect(words).toEqual([
      "It's",
      'a',
      'well-known',
      'fact',
      'numbers',
      'like',
      '2,500',
      'and',
      'e-mail',
      'count',
    ]);
  });

  it('fixture 8: sentence abbreviation merge rule gives 5 sentences (vs raw segmenter 8)', () => {
    const text =
      'Dr. Smith arrived at 3.30 p.m. on Monday. He paid $4.50 for coffee! Was it worth it? J. K. Rowling wrote it... and then she left. Visit example.com/a.b for more.';
    const sentences = extractSentences(text);
    expect(sentences.length).toBe(5);
    expect(sentences[0].trim()).toBe('Dr. Smith arrived at 3.30 p.m. on Monday.');
    expect(sentences[1].trim()).toBe('He paid $4.50 for coffee!');
    expect(sentences[2].trim()).toBe('Was it worth it?');
    expect(sentences[3].trim()).toBe('J. K. Rowling wrote it... and then she left.');
    expect(sentences[4].trim()).toBe('Visit example.com/a.b for more.');
  });

  it('Section 3.2 emoji detection avoids false positives on digits, #, *, ©, ®, ™', () => {
    expect(isEmojiGrapheme('0')).toBe(false);
    expect(isEmojiGrapheme('9')).toBe(false);
    expect(isEmojiGrapheme('#')).toBe(false);
    expect(isEmojiGrapheme('*')).toBe(false);
    expect(isEmojiGrapheme('©')).toBe(false);
    expect(isEmojiGrapheme('®')).toBe(false);
    expect(isEmojiGrapheme('™')).toBe(false);
    expect(isEmojiGrapheme('0️⃣')).toBe(true);
    expect(isEmojiGrapheme('👋')).toBe(true);
  });

  it('graphemes without spaces ignores whitespace and zero-width spaces', () => {
    expect(charsNoSpaces('a b c')).toBe(3);
    expect(charsNoSpaces('hello\n\tworld')).toBe(10);
    expect(charsNoSpaces(' \u200B ')).toBe(0);
  });

  it('counts paragraphs and lines accurately', () => {
    const text = 'Paragraph 1.\n\nParagraph 2 line 1.\nParagraph 2 line 2.\n\nParagraph 3.';
    expect(countParagraphs(text)).toBe(3);
    expect(countParagraphs('')).toBe(0);
  });

  it('calculates reading and speaking times with Brysbaert and speaking benchmarks', () => {
    const read = calculateReadingTime(476, 238); // exactly 2 minutes
    expect(read.minutes).toBe(2);
    expect(read.seconds).toBe(0);
    expect(read.formatted).toBe('2 min');

    const speak = calculateSpeakingTime(130, 130); // 1 minute
    expect(speak.minutes).toBe(1);
    expect(speak.formatted).toBe('1 min');
  });

  it('generates n-grams with stop-word filtering', () => {
    const words = ['the', 'quick', 'brown', 'fox', 'the', 'quick', 'fox'];
    const unigrams = getNgrams(words, 1);
    // 'the' should be skipped because it is in STOP_WORDS_EN
    expect(unigrams.some((u) => u.phrase === 'the')).toBe(false);
    expect(unigrams.find((u) => u.phrase === 'quick')?.count).toBe(2);

    const bigrams = getNgrams(words, 2);
    expect(bigrams.find((b) => b.phrase === 'quick brown')?.count).toBe(1);
  });

  it('splits twitter threads cleanly respecting limit', () => {
    const longText =
      'This is tweet one of a long thread explaining how client-side word counting and text analysis work without any external network dependencies or API calls. '.repeat(
        3
      );
    const thread = splitThread(longText, { limit: 280, numbering: 'fraction' });
    expect(thread.length).toBeGreaterThan(1);
    for (const tweet of thread) {
      expect(xWeightedLength(tweet)).toBeLessThanOrEqual(280);
    }
  });

  describe('Spec 05 Character Counter Worked Examples', () => {
    it('worked example 1: The quick brown fox jumps over the lazy dog.', () => {
      const text = 'The quick brown fox jumps over the lazy dog.';
      expect(countGraphemes(text)).toBe(44);
      expect(charsNoSpaces(text)).toBe(36);
      expect(countWords(text)).toBe(9);
      expect(countSentences(text)).toBe(1);
      expect(500 - countGraphemes(text)).toBe(456);
    });

    it('worked example 2: Multilingual mixed emoji, currency and CJK', () => {
      const text = 'Café ☕ costs ₹250.\n\n日本語 text 👍🏽!';
      expect(countGraphemes(text)).toBe(31);
      expect(charsNoSpaces(text)).toBe(24);
      expect(countCodePoints(text)).toBe(32);
      expect(countUtf16(text)).toBe(34);
      expect(countUtf8Bytes(text)).toBe(49);
      expect(scriptCounts(text).han).toBe(3);
      expect(emojiCount(text)).toBe(2);
      expect(countParagraphs(text)).toBe(2);
      expect(text.split(/\r?\n/).length).toBe(3);
      expect(countWords(text)).toBe(5);
      expect(countWords(text, { cjkPerChar: true })).toBe(7);
    });

    it('worked example 3: Input guide diagram sample Hi 👋🏽 café.', () => {
      const text = 'Hi 👋🏽 café.';
      expect(countGraphemes(text)).toBe(10);
      expect(charsNoSpaces(text)).toBe(8);
      expect(countUtf8Bytes(text)).toBe(18);
    });

    it('exact sample blocks: 100, 150, and 255 characters', () => {
      const b100 = 'Clear writing uses simple words, fresh verbs, and short sentences to convey ideas with direct punch.';
      const b150 = 'Concise sentences keep readers engaged from start to finish. Focus on active verbs, cut unnecessary filler, and present your ideas with crisp clarity.';
      const b255 = 'Writing effectively requires deliberate focus on clarity and structure. Every sentence must serve a distinct purpose, guiding the reader effortlessly from one concept to the next. When drafts are trimmed of redundant filler, the core message shines clean.';

      expect(countGraphemes(b100)).toBe(100);
      expect(countGraphemes(b150)).toBe(150);
      expect(countGraphemes(b255)).toBe(255);
    });
  });
});
