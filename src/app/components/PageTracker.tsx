"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fires a page-view beacon to /api/track on each page load and client-side
 * navigation. Sends document.referrer so the DB captures the real traffic
 * source (Google/LinkedIn/direct), not the beacon's own request.
 */
export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, ref: document.referrer || null }),
      keepalive: true,
    }).catch(() => {
      /* non-critical — ignore */
    });
  }, [pathname]);

  return null;
}
