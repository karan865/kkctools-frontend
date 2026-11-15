import { GenerateOptions, GenerateResult, GenreId, WordPools } from './types';
import { createRNG, getRandomSeed } from './rng';
import { GENRE_POOLS } from './pools';
import { getPatterns } from './patterns';
import { isBlocklisted } from './blocklist';
import { isOffensive } from './offensive';

/**
 * Capitalizes a string to Title Case.
 */
const SMALL_WORDS = new Set(['of', 'the', 'and', 'in', 'on', 'at', 'a', 'to', 'for']);

/** Title Case that keeps short joining words lower-case after the first word ("Hammer of Glory"). */
function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w.toLowerCase()) ? w.toLowerCase() : w.replace(/\b[a-z]/g, (char) => char.toUpperCase())))
    .join(' ');
}

/**
 * Sanitizes user custom word: keeps letters, numbers, spaces, hyphens, apostrophes.
 * Trims and limits to 20 characters.
 */
export function sanitizeMustInclude(word?: string): string {
  if (!word) return '';
  return word
    .trim()
    .replace(/[^a-zA-Z0-9\s'-]/g, '')
    .slice(0, 20);
}

/**
 * Checks if a generated name contains repeated consecutive words ("Fire Fire").
 */
function hasRepeatedWords(name: string): boolean {
  const parts = name.toLowerCase().split(/\s+/);
  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i] === parts[i + 1]) return true;
  }
  return false;
}

/**
 * Extracts the first significant word (ignoring leading "The" or "No").
 */
function getFirstSignificantWord(name: string): string {
  let cleaned = name.trim();
  if (cleaned.toLowerCase().startsWith('the ')) {
    cleaned = cleaned.slice(4).trim();
  } else if (cleaned.toLowerCase().startsWith('no ')) {
    cleaned = cleaned.slice(3).trim();
  }
  const firstWord = cleaned.split(/\s+/)[0] || '';
  return firstWord.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Core Name Generator Engine.
 * Pure logic, deterministic with seeds, zero side effects or network calls.
 */
export function generateNames(opts: GenerateOptions): GenerateResult {
  const genre: GenreId = opts.genre || 'any';
  const style = opts.style || 'any';
  const count = opts.count || 10;
  const seed = opts.seed !== undefined ? opts.seed : getRandomSeed();
  const rng = createRNG(seed);
  const avoid = opts.avoid || new Set<string>();

  const startsWith = opts.startsWith ? opts.startsWith.trim().toUpperCase() : '';
  const rawMustInclude = sanitizeMustInclude(opts.mustInclude);
  const mustInclude = isOffensive(rawMustInclude) ? '' : rawMustInclude;

  const pools: WordPools = GENRE_POOLS[genre] || GENRE_POOLS['any'];
  let availablePatterns = getPatterns(genre, style);

  // If strict style has no patterns, fall back to any patterns for genre
  if (availablePatterns.length === 0) {
    availablePatterns = getPatterns(genre, 'any');
  }

  // Calculate pattern cumulative weights
  const patternWeights: number[] = [];
  let totalWeight = 0;
  for (const p of availablePatterns) {
    totalWeight += p.weight;
    patternWeights.push(totalWeight);
  }

  function pickPattern() {
    const r = rng() * totalWeight;
    for (let i = 0; i < patternWeights.length; i++) {
      if (r <= patternWeights[i]) return availablePatterns[i];
    }
    return availablePatterns[0];
  }

  function pickFromPool(list?: string[]): string {
    if (!list || list.length === 0) return 'Echo';
    const index = Math.floor(rng() * list.length);
    return list[index];
  }

  const results: string[] = [];
  const seenInBatch = new Set<string>();
  const MAX_ATTEMPTS = 500;
  let attempts = 0;

  while (results.length < count && attempts < MAX_ATTEMPTS) {
    attempts++;
    const pattern = pickPattern();
    const template = pattern.template;

    // Slot replacements — every occurrence gets its own word (templates like '{noun} of {noun}' have two)
    let name = template
      .replace(/\{adj\}/g, () => pickFromPool(pools.adjectives))
      .replace(/\{adjectives\}/g, () => pickFromPool(pools.adjectives))
      .replace(/\{noun\}/g, () => pickFromPool(pools.nouns))
      .replace(/\{nouns\}/g, () => pickFromPool(pools.nouns))
      .replace(/\{plural\}/g, () => pickFromPool(pools.plurals || pools.nouns))
      .replace(/\{verbsIng\}/g, () => pickFromPool(pools.verbsIng || pools.adjectives))
      .replace(/\{colors\}/g, () => pickFromPool(pools.colors || pools.adjectives))
      .replace(/\{conceptWords\}/g, () => pickFromPool(pools.conceptWords || pools.nouns))
      .replace(/\{numberWords\}/g, () => pickFromPool(pools.numberWords || ['ONE']))
      .replace(/\{suffixes\}/g, () => pickFromPool(pools.suffixes || ['X']));

    // Injected mustInclude if requested
    if (mustInclude) {
      if (template.includes('{adj}') || template.includes('{noun}')) {
        // Swap one word with mustInclude
        const words = name.split(' ');
        if (words.length > 1) {
          const slotIdx = words[0].toLowerCase() === 'the' ? 1 : 0;
          words[slotIdx] = toTitleCase(mustInclude);
          name = words.join(' ');
        } else {
          name = `${toTitleCase(mustInclude)} ${name}`;
        }
      } else {
        name = `${name} ${toTitleCase(mustInclude)}`;
      }
    }

    // Normalization & formatting
    name = name.replace(/\s+/g, ' ').trim();
    if (!opts.uppercase && genre !== 'kpop') {
      name = toTitleCase(name);
    } else if (opts.uppercase || (genre === 'kpop' && opts.uppercase !== false)) {
      name = name.toUpperCase();
    }

    // Constraints & Quality Checks
    if (name.length > 40) continue;
    if (hasRepeatedWords(name)) continue;

    // Check startsWith
    if (startsWith) {
      const firstSignificant = getFirstSignificantWord(name);
      if (!firstSignificant.toUpperCase().startsWith(startsWith)) {
        continue;
      }
    }

    // Check mustInclude
    if (mustInclude) {
      if (!name.toLowerCase().includes(mustInclude.toLowerCase())) {
        continue;
      }
    }

    // Check offensive
    if (isOffensive(name)) continue;

    // Check blocklist
    if (isBlocklisted(name)) continue;

    // Check duplicate in batch or session
    const norm = name.toLowerCase();
    if (seenInBatch.has(norm)) continue;
    if (avoid.has(norm)) continue;

    seenInBatch.add(norm);
    results.push(name);
  }

  const resultObj: GenerateResult = {
    names: results,
  };

  if (results.length < count) {
    resultObj.warning = 'Filters are too strict. Try fewer filters to get more names.';
  }

  return resultObj;
}
