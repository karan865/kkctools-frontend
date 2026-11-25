import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  NIL_UUID,
  MAX_UUID,
  UUID_NAMESPACES,
  UuidV7State,
  generateUuidV4,
  generateUuidV7,
  generateNameBasedUuidBytes,
  bytesToHexUuid,
  parseUuid,
  md5Bytes,
} from './uuid-engine';

describe('uuid-engine', () => {
  it('generates valid v4 UUIDs with version nibble 4 and variant 10xx', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const id = generateUuidV4();
      const parsed = parseUuid(id);
      expect(parsed.valid).toBe(true);
      expect(parsed.version).toBe(4);
      expect(parsed.variant).toContain('RFC 9562');
      seen.add(id);
    }
    expect(seen.size).toBe(1000);
  });

  it('generates strictly monotonic v7 UUIDs within the same millisecond and handles backwards clock + overflow', () => {
    const state: UuidV7State = { lastMs: 0, counter: 0 };
    const fixedMs = 1700000000000;
    const ids: string[] = [];

    for (let i = 0; i < 1000; i++) {
      ids.push(generateUuidV7(state, fixedMs));
    }

    for (let i = 1; i < ids.length; i++) {
      expect(ids[i] > ids[i - 1]).toBe(true);
    }

    // Backwards clock keeps lastMs and still increases
    const backwardsId = generateUuidV7(state, fixedMs - 5000);
    expect(backwardsId > ids[ids.length - 1]).toBe(true);

    // Counter overflow (counter = 0x0fff) bumps ms by 1
    const overflowState: UuidV7State = { lastMs: fixedMs, counter: 0x0fff };
    const nextId = generateUuidV7(overflowState, fixedMs);
    const parsedNext = parseUuid(nextId);
    expect(parsedNext.timestampIso).toBe(new Date(fixedMs + 1).toISOString());
  });

  it('matches RFC 9562 Appendix A test vectors for v5 and v3 and RFC 1321 MD5', async () => {
    // RFC 1321 empty string MD5 = d41d8cd98f00b204e9800998ecf8427e
    const emptyMd5 = Array.from(md5Bytes(new Uint8Array(0)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    expect(emptyMd5).toBe('d41d8cd98f00b204e9800998ecf8427e');

    // RFC 9562 Appendix A.4: v5(DNS, "www.example.com")
    const v5Bytes = await generateNameBasedUuidBytes(5, UUID_NAMESPACES.dns, 'www.example.com');
    expect(bytesToHexUuid(v5Bytes)).toBe('2ed6657d-e927-568b-95e1-2665a8aea6a2');

    // RFC 9562 Appendix A.2: v3(DNS, "www.example.com")
    const v3Bytes = await generateNameBasedUuidBytes(3, UUID_NAMESPACES.dns, 'www.example.com');
    expect(bytesToHexUuid(v3Bytes)).toBe('5df41881-3aed-3515-88a7-2f4a814cf09e');

    // UTF-8 name check
    const utf8Bytes = await generateNameBasedUuidBytes(5, UUID_NAMESPACES.url, 'https://example.com/café');
    expect(parseUuid(bytesToHexUuid(utf8Bytes)).version).toBe(5);
  });

  it('matches all spec validator, Base64, base64url, Nil, and Max worked examples', () => {
    const v7Sample = parseUuid('017F22E2-79B0-7CC3-98C4-DC0C0C07398F');
    expect(v7Sample.valid).toBe(true);
    expect(v7Sample.version).toBe(7);
    expect(v7Sample.variant).toContain('RFC 9562');
    expect(v7Sample.timestampIso).toBe('2022-02-22T19:22:22.000Z');
    expect(v7Sample.formats?.base64url).toBe('AX8i4nmwfMOYxNwMDAc5jw');

    const v5Sample = parseUuid('2ed6657d-e927-568b-95e1-2665a8aea6a2');
    expect(v5Sample.version).toBe(5);
    expect(v5Sample.formats?.base64).toBe('LtZlfeknVouV4SZlqK6mog==');
    expect(v5Sample.formats?.base64url).toBe('LtZlfeknVouV4SZlqK6mog');

    // Base64url round-trip
    expect(parseUuid('LtZlfeknVouV4SZlqK6mog').canonical).toBe('2ed6657d-e927-568b-95e1-2665a8aea6a2');

    // Nil and Max
    const nilParsed = parseUuid(NIL_UUID);
    expect(nilParsed.isNil).toBe(true);
    expect(nilParsed.formats?.base64url).toBe('AAAAAAAAAAAAAAAAAAAAAA');

    const maxParsed = parseUuid(MAX_UUID);
    expect(maxParsed.isMax).toBe(true);
    expect(maxParsed.formats?.base64url).toBe('_____________________w');

    // Braces + uppercase accepted
    const braced = parseUuid('{2ED6657D-E927-568B-95E1-2665A8AEA6A2}');
    expect(braced.valid).toBe(true);
    expect(braced.canonical).toBe('2ed6657d-e927-568b-95e1-2665a8aea6a2');

    // Invalid 35-character UUID
    const invalid35 = parseUuid('2ed6657d-e927-568b-95e1-2665a8aea6a');
    expect(invalid35.valid).toBe(false);
    expect(invalid35.error).toContain('35 characters');
  });

  it('never uses Math.random or generator/rng.ts', () => {
    const content = fs.readFileSync(path.join(__dirname, 'uuid-engine.ts'), 'utf8');
    expect(content).not.toMatch(/Math\.random/);
    expect(content).not.toMatch(/generator\/rng/);
  });
});
