/**
 * Seeded PRNG using the Mulberry32 algorithm.
 * Deterministic and fast with high statistical randomness.
 */
export function createRNG(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a random 32-bit unsigned integer seed for client sessions.
 */
export function getRandomSeed(): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0];
  }
  return (Math.random() * 0xffffffff) >>> 0;
}
