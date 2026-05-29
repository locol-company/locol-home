import type { HealthStatus } from "@/lib/services";

const STATUS_CFG: Record<HealthStatus, { label: string; color: string }> = {
  online:   { label: "ONLINE",   color: "#99CE24" },
  degraded: { label: "DEGRADED", color: "#E8B923" },
  offline:  { label: "OFFLINE",  color: "#A12F2D" },
  checking: { label: "CHECKING", color: "#747474" },
};

interface Props {
  status: HealthStatus;
  latency?: number;
  version?: string;
  coolifyStatus?: string;
  size?: "sm" | "md";
}

export function HealthBadge({ status, latency, version, coolifyStatus, size = "md" }: Props) {
  const cfg = STATUS_CFG[status];
  const isChecking = status === "checking";
  const dotSize = size === "sm" ? 6 : 8;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {/* Status dot */}
        <span
          className={`block rounded-full flex-shrink-0 ${isChecking ? "animate-pulse-slow" : ""}`}
          style={{
            width: dotSize,
            height: dotSize,
            background: cfg.color,
            boxShadow: isChecking ? "none" : `0 0 6px ${cfg.color}88`,
          }}
        />
        <span
          className={`font-bold tracking-widest ${size === "sm" ? "text-[10px]" : "text-xs"}`}
          style={{ color: cfg.color }}
        >
          {cfg.label}
        </span>
        {latency !== undefined && status === "online" && (
          <span className="text-[10px]" style={{ color: "#3a3a3a" }}>
            {latency}ms
          </span>
        )}
      </div>

      {/* Version + Coolify container tag */}
      {(version || coolifyStatus) && (
        <div className="flex items-center gap-2 pl-[14px]">
          {version && (
            <span
              className="text-[10px] font-mono"
              style={{ color: "#747474" }}
            >
              v{version}
            </span>
          )}
          {coolifyStatus && (
            <span
              className="text-[9px] font-bold tracking-wider px-1.5 py-0.5"
              style={{
                background: "#1a1a1a",
                color: coolifyStatus.startsWith("running") ? "#4a6a1a" : "#6a2a1a",
                borderRadius: "3px 0 3px 0",
              }}
            >
              {coolifyStatus}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
