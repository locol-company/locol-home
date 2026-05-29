import type { ServiceConfig, HealthResult } from "@/lib/services";
import { HealthBadge } from "./HealthBadge";

interface Props {
  service: ServiceConfig;
  health?: HealthResult;
}

export function WebsiteCard({ service, health }: Props) {
  const status = health?.status ?? "checking";

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="locol-card group flex flex-col p-6 hover:no-underline relative overflow-hidden"
      style={{ textDecoration: "none", minHeight: 180 }}
    >
      {/* Tag chip */}
      <div
        className="self-start px-2 py-0.5 text-[10px] font-bold tracking-widest mb-4"
        style={{ background: "#1a2a0a", color: "#99CE24", borderRadius: "4px 0 4px 0" }}
      >
        {service.tag.toUpperCase()}
      </div>

      {/* Emoji + Name */}
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl leading-none flex-shrink-0">{service.emoji}</span>
        <h3
          className="text-lg font-bold uppercase tracking-wide leading-tight"
          style={{ color: "#99CE24" }}
        >
          {service.name}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-auto" style={{ color: "#747474" }}>
        {service.description}
      </p>

      {/* Footer */}
      <div className="flex items-end justify-between mt-5">
        <HealthBadge
          status={status}
          latency={health?.latency}
          version={health?.version}
          coolifyStatus={health?.coolifyStatus}
        />
        <span
          className="text-[11px] font-medium opacity-30 group-hover:opacity-70 transition-opacity"
          style={{ color: "#ffffff" }}
        >
          {service.url.replace("https://", "")} →
        </span>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(153,206,36,0.05) 0%, transparent 60%)",
        }}
      />
    </a>
  );
}
