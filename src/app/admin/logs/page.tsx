"use client";

import { useEffect, useMemo, useState } from "react";
import Background from "../../components/Background";
// Legacy admin console styling — scoped to this route only.
import "../../style.css";
import "boxicons/css/boxicons.min.css";

interface LogRow {
  id: number;
  route: string;
  ip: string;
  country: string | null;
  region: string | null;
  city: string | null;
  referer: string | null;
  userAgent: string | null;
  createdAt: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/logs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load logs.");
      setLogs(data.logs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    if (!logs) return null;
    const byCountry = new Map<string, number>();
    const byRoute = new Map<string, number>();
    for (const l of logs) {
      byCountry.set(
        l.country || "—",
        (byCountry.get(l.country || "—") || 0) + 1,
      );
      byRoute.set(l.route, (byRoute.get(l.route) || 0) + 1);
    }
    const top = (m: Map<string, number>) =>
      [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    return {
      total: logs.length,
      countries: top(byCountry),
      routes: top(byRoute),
    };
  }, [logs]);

  const cell: React.CSSProperties = {
    padding: "1rem 1.2rem",
    borderBottom: "1px solid var(--line)",
    fontSize: "1.35rem",
    whiteSpace: "nowrap",
  };
  const th: React.CSSProperties = {
    ...cell,
    textAlign: "left",
    fontFamily: "var(--font-pixel)",
    fontSize: "0.85rem",
    color: "var(--gold)",
    letterSpacing: "0.03em",
  };

  return (
    <>
      <Background />
      <main
        style={{
          minHeight: "100vh",
          padding: "10rem 5% 6rem",
          maxWidth: "130rem",
          margin: "0 auto",
        }}
      >
        <div className="section-tag" style={{ textAlign: "left" }}>
          {"// ADMIN — REQUEST LOGS"}
        </div>
        <h1
          className="heading"
          style={{ textAlign: "left", fontSize: "clamp(2.8rem, 5vw, 4rem)" }}
        >
          Visitor <span>Logs</span>
        </h1>

        <div
          style={{
            display: "flex",
            gap: "1.2rem",
            marginBottom: "2.4rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="gbtn"
            onClick={load}
            disabled={loading}
          >
            <i
              className={`bx ${loading ? "bx-loader-alt bx-spin" : "bx-refresh"}`}
              style={{ fontSize: "2rem" }}
            />
            {loading ? "Loading…" : "Refresh"}
          </button>
          <a href="/" className="gbtn ghost">
            <i className="bx bx-home" style={{ fontSize: "2rem" }} /> Home
          </a>
        </div>

        {error && (
          <div
            className="panel"
            style={{
              padding: "2.4rem",
              borderColor: "var(--pink)",
              marginBottom: "2rem",
            }}
          >
            <strong style={{ color: "var(--pink)", fontSize: "1.6rem" }}>
              ⚠ {error}
            </strong>
          </div>
        )}

        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(24rem, 1fr))",
              gap: "1.6rem",
              marginBottom: "2.4rem",
            }}
          >
            <div className="panel" style={{ padding: "2rem" }}>
              <div className="stat-title" style={{ margin: 0 }}>
                {"// TOTAL (last 200)"}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "3.4rem",
                  color: "var(--cyan)",
                }}
              >
                {stats.total}
              </div>
            </div>
            <div className="panel" style={{ padding: "2rem" }}>
              <div className="stat-title" style={{ margin: 0 }}>
                {"// TOP COUNTRIES"}
              </div>
              {stats.countries.map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.5rem",
                    marginTop: "0.6rem",
                  }}
                >
                  <span>{k}</span>
                  <span style={{ color: "var(--cyan)" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="panel" style={{ padding: "2rem" }}>
              <div className="stat-title" style={{ margin: 0 }}>
                {"// BY ROUTE"}
              </div>
              {stats.routes.map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.5rem",
                    marginTop: "0.6rem",
                  }}
                >
                  <span style={{ fontFamily: "monospace" }}>{k}</span>
                  <span style={{ color: "var(--cyan)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="panel" style={{ padding: 0, overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "80rem",
            }}
          >
            <thead>
              <tr>
                <th style={th}>Time (UTC)</th>
                <th style={th}>Route</th>
                <th style={th}>Country</th>
                <th style={th}>City</th>
                <th style={th}>Referrer</th>
                <th style={th}>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs?.map((l) => (
                <tr key={l.id}>
                  <td style={cell}>
                    {new Date(l.createdAt)
                      .toISOString()
                      .replace("T", " ")
                      .slice(0, 19)}
                  </td>
                  <td
                    style={{
                      ...cell,
                      fontFamily: "monospace",
                      color: "var(--cyan)",
                    }}
                  >
                    {l.route}
                  </td>
                  <td style={cell}>{l.country || "—"}</td>
                  <td style={cell}>{l.city || "—"}</td>
                  <td
                    style={{
                      ...cell,
                      maxWidth: "26rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {l.referer || "direct"}
                  </td>
                  <td style={{ ...cell, color: "var(--muted)" }}>{l.ip}</td>
                </tr>
              ))}
              {logs && logs.length === 0 && (
                <tr>
                  <td
                    style={{
                      ...cell,
                      textAlign: "center",
                      color: "var(--muted)",
                    }}
                    colSpan={6}
                  >
                    No requests logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
