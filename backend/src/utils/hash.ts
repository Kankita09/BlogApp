import crypto from 'crypto';

/**
 * One-way hash an IP or User-Agent for privacy-safe deduplication.
 * Not reversible — safe to store.
 */
export function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Hash IP + UA together for combined view deduplication.
 */
export function hashViewIdentity(ip: string, userAgent: string): { ipHash: string; uaHash: string } {
  return {
    ipHash: hashValue(ip),
    uaHash: hashValue(userAgent),
  };
}
