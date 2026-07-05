import type { NextRequest } from "next/server";

/**
 * Lightweight in-memory rate limiter.
 *
 * NOTE: In-memory state is per-instance and resets on cold starts, so on
 * serverless platforms (e.g. Vercel) this is a best-effort guard, not a hard
 * global limit. It still meaningfully blocks bursty abuse from a single client.
 * For a strict global limit, back this with Redis/Upstash.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export interface RateLimitResult {
  ok: boolean;
  retryAfter: number; // seconds until the window resets
}

/**
 * Allow `limit` requests per `windowMs` per key. Returns whether the request
 * is allowed and, if not, how many seconds until the window resets.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

// Opportunistically evict expired buckets so the map can't grow unbounded.
function sweep() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}
setInterval(sweep, 5 * 60 * 1000).unref?.();
