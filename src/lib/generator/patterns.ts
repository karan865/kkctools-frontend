import type { GenreId, Pattern, StyleId } from './types';

export const GENRE_PATTERNS: Record<GenreId, Pattern[]> = {
  'rock': [
    { template: '{adj} {noun}', style: 'two-word', weight: 4 },
    { template: '{noun} {noun}', style: 'two-word', weight: 3 },
    { template: 'The {adj} {plural}', style: 'the', weight: 4 },
    { template: 'The {noun} {plural}', style: 'the', weight: 3 },
    { template: '{noun} of {noun}', style: 'of-phrase', weight: 3 },
    { template: 'The {noun} of {noun}', style: 'of-phrase', weight: 2 },
    { template: '{noun}', style: 'one-word', weight: 2 },
    { template: '{adj}', style: 'one-word', weight: 2 },
    { template: '{adj} {plural}', style: 'two-word', weight: 3 },
    { template: 'The {adj} {noun}', style: 'the', weight: 3 },
  ],

  'metal': [
    { template: '{noun} of {noun}', style: 'of-phrase', weight: 4 },
    { template: 'The {noun} of {noun}', style: 'of-phrase', weight: 3 },
    { template: '{adj} {noun}', style: 'two-word', weight: 4 },
    { template: '{verbsIng} {noun}', style: 'two-word', weight: 4 },
    { template: 'The {adj} {noun}', style: 'the', weight: 3 },
    { template: 'The {verbsIng} {noun}', style: 'the', weight: 3 },
    { template: '{noun}', style: 'one-word', weight: 3 },
    { template: '{verbsIng}', style: 'one-word', weight: 2 },
    { template: '{noun} of the {noun}', style: 'of-phrase', weight: 2 },
    { template: '{adj} {verbsIng}', style: 'two-word', weight: 2 },
  ],

  'heavy-metal': [
    { template: '{adj} {noun}', style: 'two-word', weight: 4 },
    { template: '{noun} {noun}', style: 'two-word', weight: 4 },
    { template: 'The {adj} {plural}', style: 'the', weight: 4 },
    { template: 'The {noun} {plural}', style: 'the', weight: 3 },
    { template: '{noun} of {noun}', style: 'of-phrase', weight: 3 },
    { template: 'The {noun} of {noun}', style: 'of-phrase', weight: 2 },
    { template: '{noun}', style: 'one-word', weight: 2 },
    { template: '{adj}', style: 'one-word', weight: 2 },
    { template: '{adj} {plural}', style: 'two-word', weight: 3 },
    { template: 'The {adj} {noun}', style: 'the', weight: 3 },
  ],

  'punk': [
    { template: 'The {adj} {plural}', style: 'the', weight: 4 },
    { template: 'The {noun} {plural}', style: 'the', weight: 3 },
    { template: '{adj} {noun}', style: 'two-word', weight: 4 },
    { template: '{adj} {plural}', style: 'two-word', weight: 4 },
    { template: '{noun} of {noun}', style: 'of-phrase', weight: 2 },
    { template: 'The {noun} of {noun}', style: 'of-phrase', weight: 2 },
    { template: '{noun}', style: 'one-word', weight: 3 },
    { template: '{adj}', style: 'one-word', weight: 2 },
    { template: 'No {noun}', style: 'two-word', weight: 3 },
    { template: 'The {adj} {noun}', style: 'the', weight: 3 },
  ],

  'pop': [
    { template: '{adj} {noun}', style: 'two-word', weight: 4 },
    { template: '{colors} {noun}', style: 'two-word', weight: 4 },
    { template: 'The {adj} {noun}', style: 'the', weight: 3 },
    { template: 'The {colors} {noun}', style: 'the', weight: 3 },
    { template: '{noun} of {noun}', style: 'of-phrase', weight: 3 },
    { template: 'The {noun} of {noun}', style: 'of-phrase', weight: 2 },
    { template: '{noun}', style: 'one-word', weight: 2 },
    { template: '{adj}', style: 'one-word', weight: 2 },
    { template: '{adj} {colors}', style: 'two-word', weight: 2 },
    { template: 'The {adj}', style: 'the', weight: 2 },
  ],

  'kpop': [
    { template: '{conceptWords}', style: 'one-word', weight: 4 },
    { template: '{conceptWords}{suffixes}', style: 'one-word', weight: 4 },
    { template: '{conceptWords} {numberWords}', style: 'two-word', weight: 4 },
    { template: '{adj} {nouns}', style: 'two-word', weight: 3 },
    { template: 'The {conceptWords}', style: 'the', weight: 3 },
    { template: 'The {adj} {nouns}', style: 'the', weight: 2 },
    { template: '{conceptWords} of {nouns}', style: 'of-phrase', weight: 2 },
    { template: 'The {nouns} of {conceptWords}', style: 'of-phrase', weight: 2 },
    { template: '{adjectives}{nouns}', style: 'one-word', weight: 3 },
    { template: '{conceptWords} {nouns}', style: 'two-word', weight: 3 },
  ],

  'boy-band': [
    { template: '{adj} {noun}', style: 'two-word', weight: 4 },
    { template: '{noun} {plural}', style: 'two-word', weight: 4 },
    { template: 'The {adj} {plural}', style: 'the', weight: 4 },
    { template: 'The {noun} {plural}', style: 'the', weight: 3 },
    { template: '{noun} of {noun}', style: 'of-phrase', weight: 3 },
    { template: 'The {noun} of {noun}', style: 'of-phrase', weight: 2 },
    { template: '{noun}', style: 'one-word', weight: 2 },
    { template: '{plural}', style: 'one-word', weight: 2 },
    { template: '{adj} {plural}', style: 'two-word', weight: 3 },
    { template: 'The {adj} {noun}', style: 'the', weight: 3 },
  ],

  'indie': [
    { template: '{adj} {plural}', style: 'two-word', weight: 4 },
    { template: '{adj} {noun}', style: 'two-word', weight: 4 },
    { template: 'The {noun} {plural}', style: 'the', weight: 4 },
    { template: 'The {adj} {plural}', style: 'the', weight: 4 },
    { template: '{noun} of {noun}', style: 'of-phrase', weight: 3 },
    { template: 'The {noun} of {noun}', style: 'of-phrase', weight: 2 },
    { template: '{noun}', style: 'one-word', weight: 2 },
    { template: '{plural}', style: 'one-word', weight: 2 },
    { template: 'The {adj} {noun}', style: 'the', weight: 3 },
    { template: '{noun} {noun}', style: 'two-word', weight: 2 },
  ],

  'any': [
    { template: '{adj} {noun}', style: 'two-word', weight: 4 },
    { template: '{noun} {noun}', style: 'two-word', weight: 3 },
    { template: 'The {adj} {plural}', style: 'the', weight: 4 },
    { template: 'The {noun} {plural}', style: 'the', weight: 3 },
    { template: '{noun} of {noun}', style: 'of-phrase', weight: 3 },
    { template: 'The {noun} of {noun}', style: 'of-phrase', weight: 2 },
    { template: '{noun}', style: 'one-word', weight: 3 },
    { template: '{adj}', style: 'one-word', weight: 2 },
    { template: '{adj} {plural}', style: 'two-word', weight: 3 },
    { template: 'The {adj} {noun}', style: 'the', weight: 3 },
  ],
};

/**
 * Returns patterns filtered by style and genre.
 */
export function getPatterns(genre: GenreId, style: StyleId): Pattern[] {
  const patterns = GENRE_PATTERNS[genre] || GENRE_PATTERNS['any'];
  if (style === 'any') return patterns;
  return patterns.filter((p) => p.style === style);
}

