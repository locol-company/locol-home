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
    <h2 className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "#4a4a4a" }}>
      {children}
    </h2>
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
  const statusColor = !allLoaded ? "#747474" : allOnline ? "#99CE24" : "#E8B923";

  return (
    <div style={{ background: "#101010", minHeight: "100dvh" }}>
      <PatternStrip />

      {/* Top status bar */}
      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          background: "#0c0c0c",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className="block rounded-full"
              style={{
                width: 7,
                height: 7,
                background: statusColor,
                boxShadow: allLoaded ? `0 0 6px ${statusColor}88` : "none",
                flexShrink: 0,
              }}
            />
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: statusColor }}>
              {!allLoaded
                ? "Checking…"
                : allOnline
                ? "All Systems Online"
                : `${totalOnline} / ${SERVICES.length} Online`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-[10px] hidden sm:block" style={{ color: "#3a3a3a" }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchHealth}
              disabled={isRefreshing}
              className="text-[10px] font-bold uppercase tracking-widest transition-colors"
              style={{
                color: isRefreshing ? "#3a3a3a" : "#99CE24",
                background: "none",
                border: "none",
                cursor: isRefreshing ? "default" : "pointer",
                padding: "4px 0",
              }}
            >
              {isRefreshing ? "Checking…" : "↻ Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 pr-16 sm:pr-20 lg:pr-20">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "8px 0 8px 0",
                background: "#99CE24",
                flexShrink: 0,
              }}
            />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "#99CE24" }}>
              LOCOL
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight leading-none mb-3" style={{ color: "#ffffff" }}>
            The Ranch
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "#747474", maxWidth: 480 }}>
            All services, websites, and farmhands — monitored in one place.
          </p>

          {/* Green accent line */}
          <div
            className="mt-8 h-px"
            style={{
              background: "linear-gradient(to right, #99CE24 0%, #99CE2422 40%, transparent 100%)",
            }}
          />
        </header>

        {/* ── Websites ───────────────────────────────────────── */}
        <section className="mb-12 sm:mb-16">
          <SectionLabel>Websites</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {WEBSITE_SERVICES.map((s) => (
              <WebsiteCard key={s.id} service={s} health={healthMap[s.id]} />
            ))}
          </div>
        </section>

        {/* ── Infrastructure + Farmhands — side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 mb-12 sm:mb-16">

          <section>
            <SectionLabel>Infrastructure</SectionLabel>
            <div className="flex flex-col gap-2.5">
              {INFRA_SERVICES.map((s) => (
                <MiniCard key={s.id} service={s} health={healthMap[s.id]} />
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>Farmhands — Bots &amp; Agents</SectionLabel>
            <div className="flex flex-col gap-2.5">
              {BOT_SERVICES.map((s) => (
                <MiniCard key={s.id} service={s} health={healthMap[s.id]} />
              ))}
            </div>
          </section>

        </div>

        {/* ── Missing health endpoints notice ────────────────── */}
        {MISSING_HEALTH_ENDPOINTS.length > 0 && (
          <section className="mb-12">
            <SectionLabel>Services without /health endpoint</SectionLabel>
            <div
              className="locol-card p-4 sm:p-5"
              style={{ borderColor: "#1c1c1c" }}
            >
              <p className="text-xs mb-3" style={{ color: "#4a4a4a" }}>
                Plain HTTP check only — add{" "}
                <code
                  className="px-1 py-0.5 font-mono"
                  style={{ background: "#1a1a1a", color: "#99CE24", borderRadius: "2px" }}
                >
                  GET /health → {"{"}&quot;status&quot;:&quot;ok&quot;,&quot;version&quot;:&quot;x.y.z&quot;{"}"}
                </code>{" "}
                to unlock version tracking.
              </p>
              <div className="flex flex-wrap gap-2">
                {MISSING_HEALTH_ENDPOINTS.map((id) => {
                  const svc = SERVICES.find((s) => s.id === id)!;
                  return (
                    <div
                      key={id}
                      className="locol-chip flex items-center gap-2 px-3 py-1.5"
                      style={{
                        background: "#1a1a1a",
                        border: "1px solid #242424",
                      }}
                    >
                      <span className="text-sm">{svc.emoji}</span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide"
                        style={{ color: "#4a4a4a" }}
                      >
                        {svc.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer
          className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
          style={{ borderTop: "1px solid #1a1a1a" }}
        >
          <span className="text-[10px] tracking-widest uppercase font-bold" style={{ color: "#2a2a2a" }}>
            LOCOL Ranch Co. — Low Carbon Local Thai Beef
          </span>
          <span className="text-[10px]" style={{ color: "#2a2a2a" }}>
            Auto-refreshes every {POLL_INTERVAL / 1000}s
          </span>
        </footer>
      </div>
    </div>
  );
}
