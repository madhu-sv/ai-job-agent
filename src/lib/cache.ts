// src/lib/cache.ts
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const CACHE_FILE = path.resolve('.cache/llm-cache.json');
let store: Record<string, unknown> = {};

// Load on startup
try {
  store = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
} catch {
  // Ignore error if cache file does not exist
}

/** Generate a cache key based on prompt + options */
export function makeKey(prefix: string, payload: unknown): string {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Payload must be a non-null object');
  }
  const hash = crypto.createHash('md5').update(JSON.stringify(payload)).digest('hex');
  return `${prefix}_${hash}`;
}

/** Get from cache or undefined */
export function getCache<T>(key: string): T | undefined {
  return store[key] as T | undefined;
}

/** Save to cache and persist to disk */
export function setCache<T>(key: string, value: T) {
  store[key] = value;
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(store, null, 2));
}
