/**
 * Original word bank for the Hacker Name Generator.
 * Fun fictional handle components only — no real hacker aliases, no real people, no brands.
 */

export interface HackerWordPools {
  adjectives: readonly string[];
  techNouns: readonly string[];
  verbs: readonly string[];
  prefixes: readonly string[];
  suffixes: readonly string[];
  terminalTokens: readonly string[];
  shortWords: readonly string[];
}

export const HACKER_POOLS: HackerWordPools = {
  adjectives: [
    'silent', 'neon', 'hollow', 'velvet', 'static', 'binary', 'cobalt', 'frost',
    'crimson', 'amber', 'phantom', 'shadow', 'solar', 'lunar', 'wired', 'rogue',
    'hidden', 'lucid', 'vivid', 'cryptic', 'broken', 'iron', 'glass', 'astral',
    'drift', 'pale', 'sharp', 'obsidian', 'chrome', 'rapid', 'quiet', 'neural',
    'electric', 'arctic', 'midnight', 'ember', 'silver', 'rusted', 'ghost',
  ],
  techNouns: [
    'vector', 'cipher', 'signal', 'packet', 'daemon', 'kernel', 'socket', 'matrix',
    'proxy', 'beacon', 'circuit', 'syntax', 'payload', 'relay', 'vertex', 'tensor',
    'ledger', 'module', 'buffer', 'mirror', 'portal', 'grid', 'pulse', 'router',
    'thread', 'frame', 'vault', 'shard', 'prism', 'tracer', 'walker', 'runner',
    'drifter', 'watcher', 'nomad', 'pilot', 'specter', 'glitch', 'spark', 'echo',
    'forge', 'anchor', 'compass',
  ],
  verbs: [
    'trace', 'parse', 'route', 'shift', 'drift', 'blink', 'flash', 'ping',
    'scan', 'sync', 'loop', 'warp', 'bend', 'split', 'forge', 'weave',
    'cast', 'seek', 'glide', 'spark',
  ],
  prefixes: [
    'neo', 'x', 'zero', 'null', 'void', 'sub', 'hex', 'bit',
    'raw', 'arc', 'vortex', 'kilo', 'mega', 'meta', 'cyber', 'dark',
    'ice', 'sky', 'alt', 'syn',
  ],
  suffixes: [
    'exe', 'dev', 'ops', 'bit', 'byte', 'core', 'node', 'wave',
    'lock', 'flux', 'code', 'ware', 'net', 'sys', 'bot', 'craft',
    'line', 'fox', 'owl', 'lynx',
  ],
  terminalTokens: [
    'null', 'void', 'root', 'sys', 'hex', 'bin', 'ptr', 'env',
    'cli', 'ssh', 'tls', 'dns', 'tcp', 'udp', 'ram', 'cpu',
    'tty', 'pid', 'uid', 'eof', 'ack', 'syn', 'nop', 'jmp',
  ],
  shortWords: [
    'kilo', 'echo', 'flux', 'zero', 'nova', 'byte', 'void', 'node',
    'mint', 'lynx', 'iris', 'zeta', 'halo', 'onyx', 'volt', 'rune',
    'mist', 'pico', 'nano', 'grid', 'veil', 'sage', 'wren', 'pine',
  ],
};
