import { NextResponse } from "next/server";
import { SERVICES, type HealthResult } from "@/lib/services";

const COOLIFY_API = "https://coolify.locolbeef.com/api/v1";
const COOLIFY_TOKEN = process.env.COOLIFY_API_TOKEN ?? "3|623fW2W2iyoBjHKIvh8JNivwhYHZneJzbLCyUFSgcea48543";

/** Fetch container status for all Coolify-managed apps in one call */
async function fetchCoolifyStatuses(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${COOLIFY_API}/applications`, {
      headers: { Authorization: `Bearer ${COOLIFY_TOKEN}` },
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (!res.ok) return {};
    const apps: { uuid: string; name: string; status: string }[] = await res.json();
    return Object.fromEntries(apps.map((a) => [a.uuid, a.status]));
  } catch {
    return {};
  }
}

async function checkService(
  id: string,
  healthUrl: string,
  jsonHealth: boolean,
  coolifyId: string | undefined,
  coolifyStatuses: Record<string, string>
): Promise<HealthResult> {
  const start = Date.now();

  const [httpResult] = await Promise.all([
    (async () => {
      try {
        const res = await fetch(healthUrl, {
          signal: AbortSignal.timeout(5000),
          cache: "no-store",
          redirect: "follow",
        });
        const latency = Date.now() - start;

        if (!res.ok) {
          // 401/302/etc — service is responding, treat as online (e.g. Coolify login redirect, Supabase auth)
          const isAlive = res.status < 500;
          return { status: isAlive ? "online" : "degraded", latency, version: undefined } as const;
        }

        if (jsonHealth) {
          try {
            const body = await res.json();
            const version: string | undefined =
              typeof body?.version === "string" ? body.version : undefined;
            const status = body?.status === "ok" ? "online" : "degraded";
            return { status, latency, version } as const;
          } catch {
            return { status: "online", latency, version: undefined } as const;
          }
        }

        return { status: "online", latency, version: undefined } as const;
      } catch {
        return { status: "offline", latency: Date.now() - start, version: undefined } as const;
      }
    })(),
  ]);

  const coolifyStatus = coolifyId ? coolifyStatuses[coolifyId] : undefined;

  // If Coolify says unhealthy/stopped but HTTP says online — trust Coolify for container health
  let finalStatus = httpResult.status;
  if (coolifyStatus && !coolifyStatus.startsWith("running")) {
    finalStatus = "degraded";
  }

  return {
    id,
    status: finalStatus,
    latency: httpResult.latency,
    version: httpResult.version,
    checkedAt: new Date().toISOString(),
    coolifyStatus,
  };
}

export async function GET() {
  // Fetch Coolify statuses and all HTTP health checks in parallel
  const coolifyStatuses = await fetchCoolifyStatuses();

  const results = await Promise.all(
    SERVICES.map((s) =>
      checkService(s.id, s.healthUrl, s.jsonHealth, s.coolifyId, coolifyStatuses)
    )
  );

  return NextResponse.json(results, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
