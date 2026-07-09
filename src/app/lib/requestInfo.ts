import type { NextRequest } from "next/server";
import { storeRequestLog } from "./db";
import { getClientIp } from "./rateLimit";

/**
 * Extracts where a request came from. Geo headers (`x-vercel-ip-*`) are
 * populated automatically on Vercel; they're absent locally / on other hosts.
 */
export function getRequestOrigin(request: NextRequest, route: string) {
  const h = request.headers;
  return {
    route,
    ip: getClientIp(request),
    country: h.get("x-vercel-ip-country") || null,
    region: h.get("x-vercel-ip-country-region") || null,
    city: h.get("x-vercel-ip-city") || null,
    referer: h.get("referer") || null,
    userAgent: h.get("user-agent") || null,
    time: new Date().toISOString(),
  };
}

/**
 * Records the request origin: emits a JSON console line (shows up in the Vercel
 * Logs tab) and persists a row to Postgres when DATABASE_URL is configured.
 * Never throws — a logging failure must not break the actual request.
 *
 * `opts.referer` overrides the header referrer — used for page-view beacons,
 * where the meaningful source is the page's `document.referrer`, not the
 * beacon fetch's own Referer (which would just be the current page).
 */
export async function logRequest(
  request: NextRequest,
  route: string,
  opts?: { referer?: string | null },
): Promise<void> {
  const origin = getRequestOrigin(request, route);
  if (opts && "referer" in opts) origin.referer = opts.referer || null;
  console.log(JSON.stringify({ type: "request", ...origin }));
  const { time: _time, ...entry } = origin;
  await storeRequestLog(entry);
}
