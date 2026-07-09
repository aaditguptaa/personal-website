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
 * Never throws — a logging failure must not break the actual API request.
 */
export async function logRequest(
  request: NextRequest,
  route: string,
  extra?: Record<string, unknown>,
): Promise<void> {
  const origin = getRequestOrigin(request, route);
  console.log(JSON.stringify({ type: "request", ...origin, ...extra }));
  const { time: _time, ...entry } = origin;
  await storeRequestLog(entry);
}
