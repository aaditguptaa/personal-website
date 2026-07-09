import { type NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "../../lib/rateLimit";
import { logRequest } from "../../lib/requestInfo";

// Public page-view beacon. Called by PageTracker on each page load / navigation.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = rateLimit(`track:${ip}`, 60, 60_000);
  if (!ok) return new NextResponse(null, { status: 429 });

  let path = "/";
  let ref: string | null = null;
  try {
    const body = await request.json();
    path = (body?.path ?? "/").toString();
    ref = body?.ref ? body.ref.toString().slice(0, 500) : null;
  } catch {
    // ignore — fall back to defaults
  }

  // Only accept internal-looking paths; strip query/hash.
  if (!path.startsWith("/") || path.length > 200) path = "/";
  path = path.split("?")[0].split("#")[0];

  // Don't log the admin area itself.
  if (path.startsWith("/admin")) return new NextResponse(null, { status: 204 });

  await logRequest(request, path, { referer: ref });
  return new NextResponse(null, { status: 204 });
}
