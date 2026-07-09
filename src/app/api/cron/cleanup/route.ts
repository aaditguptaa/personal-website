import { type NextRequest, NextResponse } from "next/server";
import { deleteOldLogs } from "../../../lib/db";

// Delete request logs older than this many days (default 30).
const RETENTION_DAYS = Number(process.env.LOG_RETENTION_DAYS) || 30;

/**
 * Log-retention cron. Vercel Cron calls this on the schedule in vercel.json and
 * automatically sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is
 * set. If CRON_SECRET is unset, the endpoint is open (only ever deletes rows
 * older than the retention window) — set CRON_SECRET in production to lock it.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const deleted = await deleteOldLogs(RETENTION_DAYS);
    if (deleted === null) {
      return NextResponse.json(
        { error: "No database configured." },
        { status: 503 },
      );
    }
    console.log(
      JSON.stringify({
        type: "cron-cleanup",
        deleted,
        retentionDays: RETENTION_DAYS,
      }),
    );
    return NextResponse.json({
      ok: true,
      deleted,
      retentionDays: RETENTION_DAYS,
    });
  } catch (err) {
    console.error("Cleanup cron error:", err);
    return NextResponse.json({ error: "Cleanup failed." }, { status: 500 });
  }
}
