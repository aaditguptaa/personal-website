import { NextResponse } from "next/server";
import { getRecentLogs } from "../../lib/db";

// Protected by middleware.ts (Basic Auth). Returns recent request logs.
export async function GET() {
  try {
    const logs = await getRecentLogs(200);
    if (logs === null) {
      return NextResponse.json(
        { error: "No database configured. Set DATABASE_URL to store logs." },
        { status: 503 },
      );
    }
    return NextResponse.json({ logs });
  } catch (err) {
    console.error("Logs API error:", err);
    return NextResponse.json(
      { error: "Failed to load logs." },
      { status: 500 },
    );
  }
}
