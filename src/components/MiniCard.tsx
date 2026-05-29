import type { ServiceConfig, HealthResult } from "@/lib/services";
import { HealthBadge } from "./HealthBadge";

interface Props {
  service: ServiceConfig;
  health?: HealthResult;
}

export function MiniCard({ service, health }: Props) {
  const status = health?.status ?? "checking";

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="locol-card group flex items-center gap-3 sm:gap-4 px-4 py-3.5 relative overflow-hidden"
      style={{ textDecoration: "none", minHeight: 56 }}
    >
      {/* Emoji */}
      <span className="text-xl sm:text-2xl flex-shrink-0">{service.emoji}</span>

      {/* Name + tag + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
          <span className="text-sm font-bold uppercase tracking-wide" style={{ color: "#ffffff" }}>
            {service.name}
          </span>
          <span className="text-[9px] font-bold tracking-widest flex-shrink-0" style={{ color: "#3a3a3a" }}>
            {service.tag.toUpperCase()}
          </span>
        </div>
        <p className="text-xs truncate" style={{ color: "#747474" }}>
          {service.description}
        </p>
      </div>

      {/* Health badge */}
      <div className="flex-shrink-0">
        <HealthBadge
          status={status}
          latency={health?.latency}
          version={health?.version}
          coolifyStatus={health?.coolifyStatus}
          size="sm"
        />
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at left, rgba(153,206,36,0.04) 0%, transparent 70%)",
        }}
      />
    </a>
  );
}
