/**
 * Comma Separator / List Engine.
 * RFC 4180 compliant parsing and joining of delimited lists,
 * sorting (alphabetical, natural, numeric), deduplication, casing,
 * and standard language presets (SQL, JSON, Python, JS, Excel, Markdown).
 *
 * ES2017 compliant: no regex 'v' or 's' flags, no named capture groups.
 */

export type DedupeOption = 'off' | 'cs' | 'ci';
export type SortOption = 'none' | 'asc' | 'desc' | 'natural' | 'numeric';
export type CaseOption = 'none' | 'lower' | 'upper';
export type QuoteOption = 'auto' | 'none' | 'double' | 'single' | 'backtick' | 'custom';
export type WrapOption = 'none' | 'parens' | 'brackets' | 'braces' | 'custom';

export interface CleanOptions {
  trim?: boolean;
  removeEmpty?: boolean;
  dedupe?: DedupeOption;
  sort?: SortOption;
  caseStyle?: CaseOption;
}

export interface JoinOptions {
  delimiter?: string;
  quote?: QuoteOption;
  customPrefix?: string;
  customSuffix?: string;
  wrap?: WrapOption;
  customWrapPrefix?: string;
  customWrapSuffix?: string;
  itemsPerLine?: number; // 0 = all on one line
}

export interface ListProcessingCounts {
  inputLines: number;
  itemsOut: number;
  emptyRemoved: number;
  duplicatesRemoved: number;
}

export interface ListProcessingResult {
  output: string;
  items: string[];
  counts: ListProcessingCounts;
}

/**
 * Splits text into lines supporting CRLF, LF, and CR.
 */
export function splitLines(text: string): string[] {
  if (!text) return [];
  return text.split(/\r\n|\n|\r/);
}

/**
 * Quotes a string per RFC 4180 rules if it contains delimiter, quotes, or newlines.
 */
export function quoteCsv(value: string, delimiter: string): string {
  const needsQuoting =
    (delimiter !== '' && value.includes(delimiter.trim() || delimiter)) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r');

  if (!needsQuoting) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Cleans an array of items: trimming, filtering empty, deduplicating, sorting, and casing.
 */
export function cleanList(
  rawItems: string[],
  options: CleanOptions = {}
): { items: string[]; emptyRemoved: number; duplicatesRemoved: number } {
  const {
    trim = true,
    removeEmpty = true,
    dedupe = 'off',
    sort = 'none',
    caseStyle = 'none',
  } = options;

  let emptyRemoved = 0;
  let duplicatesRemoved = 0;

  // 1. Trim & 2. Remove Empty
  const stage1: string[] = [];
  for (let i = 0; i < rawItems.length; i++) {
    let item = rawItems[i];
    if (trim) {
      item = item.trim();
    }
    if (removeEmpty && item.length === 0) {
      emptyRemoved++;
      continue;
    }
    stage1.push(item);
  }

  // 3. Deduplicate (keeping first occurrence)
  let stage2: string[] = [];
  if (dedupe === 'off') {
    stage2 = stage1;
  } else {
    const seen = new Set<string>();
    for (const item of stage1) {
      const key = dedupe === 'ci' ? item.toLowerCase() : item;
      if (seen.has(key)) {
        duplicatesRemoved++;
      } else {
        seen.add(key);
        stage2.push(item);
      }
    }
  }

  // 4. Sort
  const stage3 = [...stage2];
  if (sort !== 'none') {
    if (sort === 'asc' || sort === 'desc') {
      const collator = new Intl.Collator('en', { sensitivity: 'base' });
      stage3.sort((a, b) => {
        const cmp = collator.compare(a, b);
        return sort === 'asc' ? cmp : -cmp;
      });
    } else if (sort === 'natural') {
      const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
      stage3.sort((a, b) => collator.compare(a, b));
    } else if (sort === 'numeric') {
      stage3.sort((a, b) => {
        const numA = a.trim() === '' ? NaN : Number(a.replace(/,/g, ''));
        const numB = b.trim() === '' ? NaN : Number(b.replace(/,/g, ''));
        const aIsNum = !isNaN(numA);
        const bIsNum = !isNaN(numB);

        if (aIsNum && bIsNum) return numA - numB;
        if (aIsNum && !bIsNum) return -1;
        if (!aIsNum && bIsNum) return 1;
        return 0; // maintain relative order for non-numbers
      });
    }
  }

  // 5. Change case
  let stage4 = stage3;
  if (caseStyle === 'lower') {
    stage4 = stage3.map((it) => it.toLowerCase());
  } else if (caseStyle === 'upper') {
    stage4 = stage3.map((it) => it.toUpperCase());
  }

  return {
    items: stage4,
    emptyRemoved,
    duplicatesRemoved,
  };
}

/**
 * Joins cleaned items with delimiters, quotes, wrapping, and chunking.
 */
export function joinList(items: string[], options: JoinOptions = {}): string {
  const {
    delimiter = ', ',
    quote = 'auto',
    customPrefix = '',
    customSuffix = '',
    wrap = 'none',
    customWrapPrefix = '',
    customWrapSuffix = '',
    itemsPerLine = 0,
  } = options;

  if (items.length === 0) return '';

  const quotedItems = items.map((item) => {
    switch (quote) {
      case 'auto':
        return quoteCsv(item, delimiter);
      case 'double':
        return `"${item.replace(/"/g, '""')}"`;
      case 'single':
        return `'${item.replace(/'/g, "''")}'`;
      case 'backtick':
        return `\`${item.replace(/`/g, '\\`')}\``;
      case 'custom':
        return `${customPrefix}${item}${customSuffix}`;
      case 'none':
      default:
        return item;
    }
  });

  let joinedBody = '';
  if (itemsPerLine > 0) {
    const lines: string[] = [];
    for (let i = 0; i < quotedItems.length; i += itemsPerLine) {
      const chunk = quotedItems.slice(i, i + itemsPerLine);
      lines.push(chunk.join(delimiter));
    }
    joinedBody = lines.join('\n');
  } else {
    joinedBody = quotedItems.join(delimiter);
  }

  switch (wrap) {
    case 'parens':
      return `(${joinedBody})`;
    case 'brackets':
      return `[${joinedBody}]`;
    case 'braces':
      return `{${joinedBody}}`;
    case 'custom':
      return `${customWrapPrefix}${joinedBody}${customWrapSuffix}`;
    case 'none':
    default:
      return joinedBody;
  }
}

/**
 * Formats items into SQL IN (...) clause:
 * e.g. ['apple', "O'Brien", 'pear'] -> "('apple', 'O''Brien', 'pear')"
 */
export function toSqlPreset(items: string[]): string {
  const escaped = items.map((v) => `'${v.replace(/'/g, "''")}'`);
  return `(${escaped.join(', ')})`;
}

/**
 * Formats items as JSON array.
 */
export function toJsonPreset(items: string[]): string {
  return JSON.stringify(items);
}

/**
 * Formats items as Python list literal.
 */
export function toPythonPreset(items: string[]): string {
  const escaped = items.map((v) => {
    const s = v
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    return `'${s}'`;
  });
  return `[${escaped.join(', ')}]`;
}

/**
 * Formats items as JavaScript array literal.
 */
export function toJsPreset(items: string[]): string {
  return toPythonPreset(items);
}

/**
 * Formats items as Excel array constant: {"a","b"}
 */
export function toExcelPreset(items: string[]): string {
  const escaped = items.map((v) => `"${v.replace(/"/g, '""')}"`);
  return `{${escaped.join(',')}}`;
}

/**
 * Formats items as Markdown list: - a\n- b
 */
export function toMarkdownPreset(items: string[]): string {
  return items.map((v) => `- ${v}`).join('\n');
}

/**
 * RFC 4180 Compliant Delimited Text Parser.
 * Correctly handles quotes, escaped quotes (""), embedded delimiters, and multiline fields.
 */
export function parseDelimited(text: string, delimiter = ','): string[] {
  if (!text) return [];

  const results: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let closedQuote = false; // this field was quoted
  let i = 0;

  const len = text.length;
  const delimLen = delimiter.length;

  while (i < len) {
    const char = text.charAt(i);

    if (inQuotes) {
      if (char === '"') {
        // Lookahead for escaped quote ""
        if (i + 1 < len && text.charAt(i + 1) === '"') {
          currentField += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      // A quote opens a quoted field only at the start of the field (spaces before it are allowed)
      if (char === '"' && !closedQuote && currentField.trim() === '') {
        currentField = '';
        closedQuote = true;
        inQuotes = true;
        i++;
        continue;
      }

      // Check delimiter match
      if (text.startsWith(delimiter, i)) {
        results.push(currentField);
        currentField = '';
        closedQuote = false;
        i += delimLen;
        continue;
      }

      // Check line breaks outside quotes
      if (char === '\r' || char === '\n') {
        results.push(currentField);
        currentField = '';
        closedQuote = false;
        if (char === '\r' && i + 1 < len && text.charAt(i + 1) === '\n') {
          i += 2;
        } else {
          i++;
        }
        continue;
      }

      // Spaces between a closing quote and the delimiter are not part of the value
      if (!(closedQuote && /\s/.test(char))) currentField += char;
      i++;
    }
  }

  // A trailing line break does not create an extra field
  if (!/[\r\n]$/.test(text) || currentField !== '' || inQuotes) results.push(currentField);

  return results;
}

/**
 * Auto-detects delimiter among common choices: comma, semicolon, tab, pipe.
 */
export function detectDelimiter(text: string): string {
  const sample = text.slice(0, 1000).replace(/"(?:[^"]|"")*"/g, '');
  const counts = {
    ',': (sample.match(/,/g) || []).length,
    ';': (sample.match(/;/g) || []).length,
    '\t': (sample.match(/\t/g) || []).length,
    '|': (sample.match(/\|/g) || []).length,
  };

  let bestDelim = ',';
  let maxCount = -1;
  for (const [delim, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      bestDelim = delim;
    }
  }
  return bestDelim;
}
