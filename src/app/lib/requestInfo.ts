import type { NextRequest } from "next/server";
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
 * Logs the request origin as a single JSON line. On Vercel these appear in the
 * project's Logs tab (searchable/filterable); pipe them to a Log Drain
 * (Axiom, Logtail, Datadog) or a DB if you want durable, queryable history.
 */
export function logRequest(
  request: NextRequest,
  route: string,
  extra?: Record<string, unknown>,
) {
  console.log(
    JSON.stringify({
      type: "request",
      ...getRequestOrigin(request, route),
      ...extra,
    }),
  );
}
