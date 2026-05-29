# locol-home — LOCOL Main Dashboard

Main website and service health dashboard for LOCOL. Deployed at `locol.locolbeef.com`.

## What it does

- Lists all LOCOL services by category (Websites, Infrastructure, Farmhands)
- Polls each service's `/health` endpoint every 30s for live status + version
- Fetches Coolify container status via API as a secondary health source
- Shows which services are missing a proper `/health` endpoint

## Port

`3100` — host port mapping in Coolify must be `3100:3100`.

## Adding a new service

Edit `src/lib/services.ts` — add an entry to `SERVICES`. Fields:
- `jsonHealth: true` if the service returns `{"status":"ok","version":"x.y.z"}` from `/health`
- `coolifyId` — Coolify app UUID (from `GET /api/v1/applications`) if deployed via Coolify

## Environment variables

| Var | Default | Notes |
|-----|---------|-------|
| `COOLIFY_API_TOKEN` | hardcoded fallback | Override for security |
| `PORT` | `3100` | Set by Dockerfile |

## Health check format (for services to implement)

```json
GET /health → 200 OK
{ "status": "ok", "service": "<name>", "version": "1.0.0" }
```

## Services missing /health endpoint

- `dashboard` (pixel-farm) — custom app, easy to add
- `tms` (Plane) — third-party
- `searxng` — third-party
- `coolify` — third-party PaaS
- `supabase-opms` — third-party

## Deploy

See root CLAUDE.md → "Deployment Convention". Coolify app UUID: (set after first deploy).
cf-deploy: `cf-deploy locol http://192.168.1.158:3100`
