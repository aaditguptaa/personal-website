import { type NextRequest, NextResponse } from "next/server";

/**
 * Protects the admin dashboard and its data API with HTTP Basic Auth.
 * Credentials come from env: ADMIN_USER (default "admin") + ADMIN_PASSWORD.
 * If ADMIN_PASSWORD is unset, access is denied — the admin area is locked by
 * default until you configure a password.
 */
function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"' },
  });
}

export function middleware(request: NextRequest) {
  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedPass) return unauthorized();

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorized();

  let decoded = "";
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorized();
  }
  const idx = decoded.indexOf(":");
  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);

  if (user === expectedUser && pass === expectedPass) {
    return NextResponse.next();
  }
  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*", "/api/logs/:path*"],
};
