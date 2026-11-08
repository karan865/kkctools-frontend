import type { GenreId, WordPools } from '../types';
import { rockPools } from './rock';
import { metalPools } from './metal';
import { heavyMetalPools } from './heavy-metal';
import { punkPools } from './punk';
import { popPools } from './pop';
import { kpopPools } from './kpop';
import { boyBandPools } from './boy-band';
import { indiePools } from './indie';

function mergeUnique(...lists: (string[] | undefined)[]): string[] {
  const set = new Set<string>();
  for (const list of lists) {
    if (list) {
      for (const item of list) {
        set.add(item);
      }
    }
  }
  return Array.from(set);
}

export const anyPools: WordPools = {
  adjectives: mergeUnique(
    rockPools.adjectives,
    metalPools.adjectives,
    heavyMetalPools.adjectives,
    punkPools.adjectives,
    popPools.adjectives,
    kpopPools.adjectives,
    boyBandPools.adjectives,
    indiePools.adjectives
  ),
  nouns: mergeUnique(
    rockPools.nouns,
    metalPools.nouns,
    heavyMetalPools.nouns,
    punkPools.nouns,
    popPools.nouns,
    kpopPools.nouns,
    boyBandPools.nouns,
    indiePools.nouns
  ),
  plurals: mergeUnique(
    rockPools.plurals,
    heavyMetalPools.plurals,
    punkPools.plurals,
    boyBandPools.plurals,
    indiePools.plurals
  ),
  verbsIng: metalPools.verbsIng,
  colors: popPools.colors,
  conceptWords: kpopPools.conceptWords,
  numberWords: kpopPools.numberWords,
  suffixes: kpopPools.suffixes,
};

export const GENRE_POOLS: Record<GenreId, WordPools> = {
  'any': anyPools,
  'rock': rockPools,
  'metal': metalPools,
  'heavy-metal': heavyMetalPools,
  'punk': punkPools,
  'pop': popPools,
  'kpop': kpopPools,
  'boy-band': boyBandPools,
  'indie': indiePools,
};
