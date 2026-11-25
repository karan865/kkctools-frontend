/**
 * Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) wrapper.
 * Uses Web Crypto `crypto.getRandomValues` exclusively and fails closed when unavailable.
 * Never uses non-cryptographic or seeded PRNGs.
 */

export type ByteSource = (length: number) => Uint8Array;

const MAX_CRYPTO_CHUNK = 65536;
const UINT32_RANGE = 4294967296; // 2^32

export const SECURE_RANDOM_UNAVAILABLE_MSG =
  "Your browser can't generate secure random values";

/**
 * Checks if Web Crypto `getRandomValues` is available in the current environment.
 */
export function isAvailable(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  );
}

/**
 * Default Web Crypto byte source; fails closed when Web Crypto is missing.
 */
export function webCryptoByteSource(length: number): Uint8Array {
  if (!isAvailable()) {
    throw new Error(SECURE_RANDOM_UNAVAILABLE_MSG);
  }
  const out = new Uint8Array(length);
  for (let offset = 0; offset < length; offset += MAX_CRYPTO_CHUNK) {
    const sliceLen = Math.min(MAX_CRYPTO_CHUNK, length - offset);
    const view = out.subarray(offset, offset + sliceLen);
    globalThis.crypto.getRandomValues(view);
  }
  return out;
}

/**
 * Generates `n` cryptographically random bytes in chunks of <= 65,536 bytes.
 */
export function randomBytes(n: number, source: ByteSource = webCryptoByteSource): Uint8Array {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('Byte length must be a non-negative integer');
  }
  if (n === 0) return new Uint8Array(0);
  return source(n);
}

/**
 * Returns a uniformly distributed random integer in `[0, maxExclusive)`
 * using 32-bit rejection sampling (eliminating modulo bias).
 */
export function randomInt(
  maxExclusive: number,
  source: ByteSource = webCryptoByteSource
): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > UINT32_RANGE) {
    throw new RangeError('maxExclusive must be an integer between 1 and 2^32');
  }
  if (maxExclusive === 1) return 0;

  const limit = Math.floor(UINT32_RANGE / maxExclusive) * maxExclusive;

  while (true) {
    const bytes = randomBytes(4, source);
    if (bytes.length < 4) {
      throw new Error('Byte source returned fewer than 4 bytes');
    }
    const x =
      ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
    if (x < limit) {
      return x % maxExclusive;
    }
  }
}

/**
 * Picks a uniform random element from a non-empty array.
 */
export function pick<T>(array: readonly T[], source: ByteSource = webCryptoByteSource): T {
  if (array.length === 0) {
    throw new RangeError('Cannot pick from an empty array');
  }
  return array[randomInt(array.length, source)];
}

/**
 * Returns a new uniformly shuffled copy of `array` using Fisher-Yates.
 */
export function shuffle<T>(array: readonly T[], source: ByteSource = webCryptoByteSource): T[] {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, source);
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }
  return result;
}
