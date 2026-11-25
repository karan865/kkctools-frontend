import { ByteSource, randomBytes, randomInt, webCryptoByteSource } from './secure-random';

export const NIL_UUID = '00000000-0000-0000-0000-000000000000';
export const MAX_UUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

export const UUID_NAMESPACES = {
  dns: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  url: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  oid: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  x500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
} as const;

export const MIN_UUID_BULK = 1;
export const MAX_UUID_BULK = 1000;

export interface UuidV7State {
  lastMs: number;
  counter: number;
}

export interface UuidFormatOptions {
  uppercase?: boolean;
  hyphens?: boolean;
  braces?: boolean;
  urn?: boolean;
  encoding?: 'hex' | 'base64' | 'base64url';
}

export interface ParsedUuid {
  valid: boolean;
  error?: string;
  canonical?: string;
  bytes?: Uint8Array;
  version?: number;
  variant?: string;
  isNil?: boolean;
  isMax?: boolean;
  timestampIso?: string | null;
  formats?: {
    lowercase: string;
    uppercase: string;
    noHyphens: string;
    braces: string;
    urn: string;
    base64: string;
    base64url: string;
  };
}

export function bytesToHexUuid(bytes: Uint8Array, hyphens = true): string {
  const hex: string[] = [];
  for (let i = 0; i < 16; i++) {
    hex.push(bytes[i].toString(16).padStart(2, '0'));
  }
  const raw = hex.join('');
  if (!hyphens) return raw;
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20, 32)}`;
}

export function hexToBytes(hex32: string): Uint8Array {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex32.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function bytesToBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa === 'function') {
    return btoa(bin);
  }
  return Buffer.from(bytes).toString('base64');
}

export function base64ToBytes(b64: string): Uint8Array {
  if (typeof atob === 'function') {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function formatUuidBytes(bytes: Uint8Array, opts: UuidFormatOptions = {}): string {
  const encoding = opts.encoding ?? 'hex';
  if (encoding === 'base64') return bytesToBase64(bytes);
  if (encoding === 'base64url') return bytesToBase64Url(bytes);

  const hyphens = opts.hyphens !== false;
  let str = bytesToHexUuid(bytes, hyphens);
  if (opts.uppercase) str = str.toUpperCase();
  if (opts.braces) str = `{${str}}`;
  if (opts.urn) str = `urn:uuid:${str.toLowerCase().replace(/^\{|\}$/g, '')}`;
  return str;
}

/**
 * Generates a Version 4 (random) UUID (122 random bits, RFC 9562 §5.4).
 */
export function generateUuidV4Bytes(source: ByteSource = webCryptoByteSource): Uint8Array {
  const bytes = randomBytes(16, source);
  const copy = new Uint8Array(bytes);
  copy[6] = (copy[6] & 0x0f) | 0x40;
  copy[8] = (copy[8] & 0x3f) | 0x80;
  return copy;
}

export function generateUuidV4(source: ByteSource = webCryptoByteSource): string {
  return bytesToHexUuid(generateUuidV4Bytes(source), true);
}

/**
 * Generates a Version 7 (time-ordered) UUID with RFC 9562 §6.2 Method 1 monotonicity.
 * Keeps `lastMs` if the system clock moves backwards and increments the 12-bit `rand_a` counter.
 */
export function generateUuidV7Bytes(
  state: UuidV7State,
  nowMs: number = Date.now(),
  source: ByteSource = webCryptoByteSource
): Uint8Array {
  let ms = nowMs;
  let counter: number;

  if (ms <= state.lastMs) {
    ms = state.lastMs;
    counter = state.counter + 1;
    if (counter > 0x0fff) {
      ms = state.lastMs + 1;
      counter = randomInt(2048, source);
    }
  } else {
    counter = randomInt(2048, source);
  }

  state.lastMs = ms;
  state.counter = counter;

  const bytes = new Uint8Array(16);
  // 48-bit unix_ts_ms big-endian
  const msBig = BigInt(Math.floor(ms));
  bytes[0] = Number((msBig >> BigInt('40')) & BigInt('255'));
  bytes[1] = Number((msBig >> BigInt('32')) & BigInt('255'));
  bytes[2] = Number((msBig >> BigInt('24')) & BigInt('255'));
  bytes[3] = Number((msBig >> BigInt('16')) & BigInt('255'));
  bytes[4] = Number((msBig >> BigInt('8')) & BigInt('255'));
  bytes[5] = Number(msBig & BigInt('255'));

  // 4-bit version (7) + 12-bit rand_a counter
  bytes[6] = 0x70 | ((counter >> 8) & 0x0f);
  bytes[7] = counter & 0xff;

  // 62-bit rand_b with 2-bit RFC 9562 variant (10xx)
  const randTail = randomBytes(8, source);
  bytes.set(randTail, 8);
  bytes[8] = 0x80 | (bytes[8] & 0x3f);

  return bytes;
}

export function generateUuidV7(
  state: UuidV7State,
  nowMs: number = Date.now(),
  source: ByteSource = webCryptoByteSource
): string {
  return bytesToHexUuid(generateUuidV7Bytes(state, nowMs, source), true);
}

/**
 * Pure RFC 1321 MD5 implementation (legacy v3 UUID support only).
 */
export function md5Bytes(input: Uint8Array): Uint8Array {
  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;
  }

  const origBitLen = input.length * 8;
  const padLen = ((56 - ((input.length + 1) % 64)) + 64) % 64;
  const padded = new Uint8Array(input.length + 1 + padLen + 8);
  padded.set(input, 0);
  padded[input.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, origBitLen >>> 0, true);
  view.setUint32(padded.length - 4, Math.floor(origBitLen / 4294967296) >>> 0, true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < padded.length; offset += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] = view.getUint32(offset + j * 4, true);
    }
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    for (let i = 0; i < 64; i++) {
      let F = 0;
      let g = 0;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      const dTemp = D;
      D = C;
      C = B;
      const sum = (A + F + K[i] + M[g]) >>> 0;
      const rot = ((sum << s[i]) | (sum >>> (32 - s[i]))) >>> 0;
      B = (B + rot) >>> 0;
      A = dTemp;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  const out = new Uint8Array(16);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, a0, true);
  outView.setUint32(4, b0, true);
  outView.setUint32(8, c0, true);
  outView.setUint32(12, d0, true);
  return out;
}

/**
 * Generates a Version 3 (MD5, legacy) or Version 5 (SHA-1 via Web Crypto) name-based UUID.
 */
export async function generateNameBasedUuidBytes(
  version: 3 | 5,
  namespaceUuid: string,
  name: string
): Promise<Uint8Array> {
  const parsedNs = parseUuid(namespaceUuid);
  if (!parsedNs.valid || !parsedNs.bytes) {
    throw new Error('Namespace must be a valid UUID.');
  }
  const nameBytes = new TextEncoder().encode(name);
  const combined = new Uint8Array(16 + nameBytes.length);
  combined.set(parsedNs.bytes, 0);
  combined.set(nameBytes, 16);

  let digest: Uint8Array;
  if (version === 3) {
    digest = md5Bytes(combined);
  } else {
    if (
      typeof globalThis === 'undefined' ||
      typeof globalThis.crypto === 'undefined' ||
      !globalThis.crypto.subtle
    ) {
      throw new Error("Your browser can't compute SHA-1 for UUID v5.");
    }
    const buf = await globalThis.crypto.subtle.digest('SHA-1', combined);
    digest = new Uint8Array(buf).slice(0, 16);
  }

  const out = digest.slice(0, 16);
  out[6] = (out[6] & 0x0f) | (version << 4);
  out[8] = (out[8] & 0x3f) | 0x80;
  return out;
}

function decodeGregorianTimestamp(bytes: Uint8Array, version: number): string | null {
  try {
    let timeHigh: number;
    let timeMid: number;
    let timeLow: number;

    if (version === 1) {
      timeLow =
        ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
      timeMid = ((bytes[4] << 8) | bytes[5]) >>> 0;
      timeHigh = (((bytes[6] & 0x0f) << 8) | bytes[7]) >>> 0;
    } else if (version === 6) {
      // v6 stores 60-bit big-endian timestamp across bytes 0..7
      const high32 =
        ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
      const mid16 = ((bytes[4] << 8) | bytes[5]) >>> 0;
      const low12 = (((bytes[6] & 0x0f) << 8) | bytes[7]) >>> 0;
      const ticks =
        (BigInt(high32) << BigInt('28')) |
        (BigInt(mid16) << BigInt('12')) |
        BigInt(low12);
      const GREGORIAN_OFFSET_100NS = BigInt('122192928000000000');
      const unixMs = Number((ticks - GREGORIAN_OFFSET_100NS) / BigInt('10000'));
      return new Date(unixMs).toISOString();
    } else {
      return null;
    }

    const ticks =
      (BigInt(timeHigh) << BigInt('48')) |
      (BigInt(timeMid) << BigInt('32')) |
      BigInt(timeLow);
    const GREGORIAN_OFFSET_100NS = BigInt('122192928000000000');
    const unixMs = Number((ticks - GREGORIAN_OFFSET_100NS) / BigInt('10000'));
    return new Date(unixMs).toISOString();
  } catch {
    return null;
  }
}

/**
 * Parses and validates a UUID/GUID in standard, no-hyphen, braced, URN, Base64, or base64url form.
 */
export function parseUuid(rawInput: string): ParsedUuid {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { valid: false, error: 'Enter a UUID or GUID to validate.' };
  }

  let s = trimmed;
  if (s.toLowerCase().startsWith('urn:uuid:')) {
    s = s.slice(9);
  }
  if (s.startsWith('{') && s.endsWith('}')) {
    s = s.slice(1, -1);
  }

  let bytes: Uint8Array | null = null;

  // Check Base64 / base64url (22 or 24 chars)
  if (/^[A-Za-z0-9_-]{22}$/.test(s)) {
    const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '==';
    const b = base64ToBytes(padded);
    if (b.length === 16) bytes = b;
  } else if (/^[A-Za-z0-9+/]{22}==$/.test(s)) {
    const b = base64ToBytes(s);
    if (b.length === 16) bytes = b;
  } else {
    // Hex forms: 8-4-4-4-12 or 32 hex
    const hyphenPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const rawHexPattern = /^[0-9a-fA-F]{32}$/;

    if (hyphenPattern.test(s)) {
      bytes = hexToBytes(s.replace(/-/g, '').toLowerCase());
    } else if (rawHexPattern.test(s)) {
      bytes = hexToBytes(s.toLowerCase());
    } else {
      const stripped = s.replace(/-/g, '');
      if (!/^[0-9a-fA-F]+$/.test(stripped)) {
        return { valid: false, error: 'Invalid characters: a UUID may only contain hex digits (0-9, a-f) and hyphens.' };
      }
      return {
        valid: false,
        error: `${s.length} characters; a UUID has 32 hex digits (36 with hyphens).`,
      };
    }
  }

  if (!bytes || bytes.length !== 16) {
    return { valid: false, error: 'Could not decode a 128-bit UUID.' };
  }

  const canonical = bytesToHexUuid(bytes, true);
  const isNil = canonical === NIL_UUID;
  const isMax = canonical === MAX_UUID;
  const version = (bytes[6] >> 4) & 0x0f;

  const varByte = bytes[8];
  let variant = 'Unknown';
  if ((varByte & 0x80) === 0x00) variant = 'NCS backward compatibility (0xxx)';
  else if ((varByte & 0xc0) === 0x80) variant = 'RFC 9562 / RFC 4122 (10xx)';
  else if ((varByte & 0xe0) === 0xc0) variant = 'Microsoft GUID legacy (110x)';
  else variant = 'Reserved for future definition (111x)';

  let timestampIso: string | null = null;
  if (version === 7 && !isNil && !isMax) {
    const msBig =
      (BigInt(bytes[0]) << BigInt('40')) |
      (BigInt(bytes[1]) << BigInt('32')) |
      (BigInt(bytes[2]) << BigInt('24')) |
      (BigInt(bytes[3]) << BigInt('16')) |
      (BigInt(bytes[4]) << BigInt('8')) |
      BigInt(bytes[5]);
    timestampIso = new Date(Number(msBig)).toISOString();
  } else if ((version === 1 || version === 6) && !isNil && !isMax) {
    timestampIso = decodeGregorianTimestamp(bytes, version);
  }

  return {
    valid: true,
    canonical,
    bytes,
    version,
    variant,
    isNil,
    isMax,
    timestampIso,
    formats: {
      lowercase: canonical,
      uppercase: canonical.toUpperCase(),
      noHyphens: canonical.replace(/-/g, ''),
      braces: `{${canonical}}`,
      urn: `urn:uuid:${canonical}`,
      base64: bytesToBase64(bytes),
      base64url: bytesToBase64Url(bytes),
    },
  };
}
