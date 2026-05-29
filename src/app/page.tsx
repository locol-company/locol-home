"use client";

import { useEffect, useState, useCallback } from "react";
import {
  SERVICES,
  WEBSITE_SERVICES,
  INFRA_SERVICES,
  BOT_SERVICES,
  MISSING_HEALTH_ENDPOINTS,
  type HealthResult,
} from "@/lib/services";
import { WebsiteCard } from "@/components/WebsiteCard";
import { MiniCard } from "@/components/MiniCard";
import { PatternStrip } from "@/components/PatternStrip";

const POLL_INTERVAL = 30_000;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5"
      style={{ color: "#3a3a3a" }}
    >
      {children}
    </h2>
  );
}

function Divider() {
  return (
    <div
      className="h-px w-full my-12"
      style={{ background: "linear-gradient(to right, #1e1e1e, transparent)" }}
    />
  );
}

export default function Home() {
  const [healthMap, setHealthMap] = useState<Record<string, HealthResult>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealth = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data: HealthResult[] = await res.json();
      const map: Record<string, HealthResult> = {};
      data.forEach((r) => (map[r.id] = r));
      setHealthMap(map);
      setLastUpdated(new Date());
    } catch {
      // keep last known state on error
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchHealth]);

  const totalOnline = Object.values(healthMap).filter((h) => h.status === "online").length;
  const allLoaded = Object.keys(healthMap).length === SERVICES.length;
  const allOnline = allLoaded && totalOnline === SERVICES.length;

  return (
    <div style={{ background: "#101010", minHeight: "100dvh" }}>
      <PatternStrip />

      <div className="max-w-5xl mx-auto px-6 py-12 pr-20">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-16">
          <div className="flex items-start justify-between gap-6">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px 0 8px 0",
                    background: "#99CE24",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="text-xs font-bold tracking-[0.3em] uppercase"
                  style={{ color: "#99CE24" }}
                >
                  LOCOL
                </span>
              </div>

              <h1
                className="text-5xl font-bold uppercase tracking-tight leading-none mb-3"
                style={{ color: "#ffffff" }}
              >
                The Ranch
              </h1>
              <p className="text-sm" style={{ color: "#747474" }}>
                All services, websites, and farmhands — in one place.
              </p>
            </div>

            {/* Health summary card */}
            <div
              className="locol-card px-5 py-4 text-right flex-shrink-0"
              style={{ minWidth: 148 }}
            >
              <div
                className="text-3xl font-bold leading-none"
                style={{ color: allOnline ? "#99CE24" : "#E8B923" }}
              >
                {!allLoaded ? "—" : `${totalOnline}/${SERVICES.length}`}
              </div>
              <div
                className="text-[10px] font-bold tracking-widest uppercase mt-1.5"
                style={{ color: "#747474" }}
              >
                Services Online
              </div>

              <button
                onClick={fetchHealth}
                disabled={isRefreshing}
                className="mt-3 text-[10px] font-bold uppercase tracking-widest block w-full text-right transition-colors"
                style={{
                  color: isRefreshing ? "#3a3a3a" : "#99CE24",
                  background: "none",
                  border: "none",
                  cursor: isRefreshing ? "default" : "pointer",
                  padding: 0,
                }}
              >
                {isRefreshing ? "Checking…" : "↻ Refresh"}
              </button>

              {lastUpdated && (
                <div className="text-[9px] mt-1" style={{ color: "#2a2a2a" }}>
                  {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          {/* Green accent line */}
          <div
            className="mt-8 h-px"
            style={{
              background:
                "linear-gradient(to right, #99CE24 0%, #99CE2422 50%, transparent 100%)",
            }}
          />
        </header>

        {/* ── Websites ───────────────────────────────────────── */}
        <section>
          <SectionLabel>Websites</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WEBSITE_SERVICES.map((s) => (
              <WebsiteCard key={s.id} service={s} health={healthMap[s.id]} />
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Infrastructure ─────────────────────────────────── */}
        <section>
          <SectionLabel>Infrastructure</SectionLabel>
          <div className="flex flex-col gap-3">
            {INFRA_SERVICES.map((s) => (
              <MiniCard key={s.id} service={s} health={healthMap[s.id]} />
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Farmhands ──────────────────────────────────────── */}
        <section>
          <SectionLabel>Farmhands — Bots &amp; Agents</SectionLabel>
          <div className="flex flex-col gap-3">
            {BOT_SERVICES.map((s) => (
              <MiniCard key={s.id} service={s} health={healthMap[s.id]} />
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Missing health endpoints notice ────────────────── */}
        <section>
          <SectionLabel>Services without /health endpoint</SectionLabel>
          <div
            className="locol-card p-5"
            style={{ borderColor: "#1e1e1e" }}
          >
            <p className="text-xs mb-3" style={{ color: "#747474" }}>
              These services use a plain HTTP check (2xx/3xx = online). Add a{" "}
              <code
                className="px-1 py-0.5 font-mono"
                style={{ background: "#1a1a1a", color: "#99CE24", borderRadius: "2px" }}
              >
                GET /health
              </code>{" "}
              endpoint returning{" "}
              <code
                className="px-1 py-0.5 font-mono"
                style={{ background: "#1a1a1a", color: "#99CE24", borderRadius: "2px" }}
              >
                {`{"status":"ok","service":"<name>","version":"x.y.z"}`}
              </code>{" "}
              to unlock version tracking.
            </p>
            <div className="flex flex-wrap gap-2">
              {MISSING_HEALTH_ENDPOINTS.map((id) => {
                const svc = SERVICES.find((s) => s.id === id)!;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{
                      background: "#1a1a1a",
                      borderRadius: "4px 0 4px 0",
                      border: "1px solid #242424",
                    }}
                  >
                    <span className="text-sm">{svc.emoji}</span>
                    <span
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: "#747474" }}
                    >
                      {svc.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer
          className="mt-12 pt-6 flex items-center justify-between"
          style={{ borderTop: "1px solid #1a1a1a" }}
        >
          <span
            className="text-[10px] tracking-widest uppercase font-bold"
            style={{ color: "#1e1e1e" }}
          >
            LOCOL Ranch Co. — Low Carbon Local Thai Beef
          </span>
          <span className="text-[9px]" style={{ color: "#1e1e1e" }}>
            Auto-refreshes every {POLL_INTERVAL / 1000}s
          </span>
        </footer>
      </div>
    </div>
  );
}
