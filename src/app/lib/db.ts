import postgres from "postgres";

/**
 * Lazy Postgres client. Works with any Postgres provider via DATABASE_URL
 * (Neon, Supabase, Vercel Postgres, Railway, local, …).
 *
 * `prepare: false` keeps it compatible with transaction-pooling connection
 * strings (PgBouncer / Neon pooled endpoint) — recommended on serverless.
 * Returns null when DATABASE_URL is unset, so logging degrades gracefully.
 */
let sql: postgres.Sql | null | undefined;

function getSql(): postgres.Sql | null {
  if (sql !== undefined) return sql;
  const url = process.env.DATABASE_URL;
  sql = url ? postgres(url, { prepare: false }) : null;
  return sql;
}

let schemaReady: Promise<void> | null = null;
function ensureSchema(client: postgres.Sql): Promise<void> {
  if (!schemaReady) {
    schemaReady = client`
      CREATE TABLE IF NOT EXISTS request_logs (
        id          bigserial PRIMARY KEY,
        route       text,
        ip          text,
        country     text,
        region      text,
        city        text,
        referer     text,
        user_agent  text,
        created_at  timestamptz NOT NULL DEFAULT now()
      )
    `.then(() => undefined);
  }
  return schemaReady;
}

export interface RequestLogEntry {
  route: string;
  ip: string;
  country: string | null;
  region: string | null;
  city: string | null;
  referer: string | null;
  userAgent: string | null;
}

/**
 * Persist a request-origin entry. No-op when no DB is configured, and never
 * throws — a logging failure must not break the actual API request.
 */
export async function storeRequestLog(entry: RequestLogEntry): Promise<void> {
  const client = getSql();
  if (!client) return;
  try {
    await ensureSchema(client);
    await client`
      INSERT INTO request_logs (route, ip, country, region, city, referer, user_agent)
      VALUES (
        ${entry.route}, ${entry.ip}, ${entry.country}, ${entry.region},
        ${entry.city}, ${entry.referer}, ${entry.userAgent}
      )
    `;
  } catch (err) {
    console.error("Failed to store request log:", err);
  }
}

export interface RequestLogRow extends RequestLogEntry {
  id: number;
  createdAt: string;
}

/**
 * Fetch the most recent request logs. Returns `null` when no DB is configured
 * (so callers can distinguish "not set up" from "empty").
 */
export async function getRecentLogs(
  limit = 200,
): Promise<RequestLogRow[] | null> {
  const client = getSql();
  if (!client) return null;
  await ensureSchema(client);
  const rows = await client`
    SELECT id, route, ip, country, region, city, referer, user_agent, created_at
    FROM request_logs
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: Number(r.id),
    route: r.route,
    ip: r.ip,
    country: r.country,
    region: r.region,
    city: r.city,
    referer: r.referer,
    userAgent: r.user_agent,
    createdAt:
      r.created_at instanceof Date
        ? r.created_at.toISOString()
        : String(r.created_at),
  }));
}

/**
 * Delete request logs older than `days`. Returns the number of rows removed,
 * or `null` when no DB is configured.
 */
export async function deleteOldLogs(days: number): Promise<number | null> {
  const client = getSql();
  if (!client) return null;
  await ensureSchema(client);
  const res = await client`
    DELETE FROM request_logs
    WHERE created_at < now() - make_interval(days => ${days})
  `;
  return res.count;
}
