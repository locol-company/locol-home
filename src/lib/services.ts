export type ServiceCategory = "website" | "infrastructure" | "bot";
export type HealthStatus = "online" | "degraded" | "offline" | "checking";

export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  /** URL hit for health check. If jsonHealth=true, must return {"status":"ok","version":"x.y.z"} */
  healthUrl: string;
  category: ServiceCategory;
  emoji: string;
  tag: string;
  /** true → parse JSON health response and extract version */
  jsonHealth: boolean;
  /** Coolify app UUID — enables container-level status from Coolify API */
  coolifyId?: string;
}

export interface HealthResult {
  id: string;
  status: HealthStatus;
  latency: number;
  version?: string;
  checkedAt: string;
  /** Coolify container status e.g. "running:healthy" */
  coolifyStatus?: string;
}

export const SERVICES: ServiceConfig[] = [
  // ─── Websites ──────────────────────────────────────────────────────────────
  {
    id: "opms",
    name: "LOCOL Workspace",
    description: "Operations & project management platform for the ranch",
    url: "https://opms.locolbeef.com",
    healthUrl: "https://opms.locolbeef.com/health",
    category: "website",
    emoji: "🏢",
    tag: "Workspace",
    jsonHealth: true,
    coolifyId: "i1001rlmhdfmbmlw9vpzz635",
  },
  {
    id: "tms",
    name: "Plane",
    description: "Task management system — Ranch Paddock for all cows",
    url: "https://tms.locolbeef.com",
    healthUrl: "https://tms.locolbeef.com",
    category: "website",
    emoji: "📋",
    tag: "Task Management",
    jsonHealth: false,
  },
  {
    id: "searxng",
    name: "SearXNG",
    description: "Private search engine for the ranch",
    url: "https://searxng.locolbeef.com",
    healthUrl: "https://searxng.locolbeef.com",
    category: "website",
    emoji: "🔍",
    tag: "Search",
    jsonHealth: false,
  },
  {
    id: "dashboard",
    name: "Ranch Dashboard",
    description: "Pixel-art service monitor — original farm view (no /health yet)",
    url: "https://dashboard.locolbeef.com",
    healthUrl: "https://dashboard.locolbeef.com",
    category: "website",
    emoji: "🌾",
    tag: "Monitoring",
    jsonHealth: false,
  },
  // ─── Infrastructure ────────────────────────────────────────────────────────
  {
    id: "coolify",
    name: "Coolify",
    description: "PaaS deployment platform — all services live here (VM 100)",
    url: "https://coolify.locolbeef.com",
    healthUrl: "https://coolify.locolbeef.com",
    category: "infrastructure",
    emoji: "🚀",
    tag: "Deployment",
    jsonHealth: false,
  },
  {
    id: "supabase",
    name: "Supabase OPMS",
    description: "Database & auth backend powering the workspace",
    url: "https://supabase-opms.locolbeef.com",
    healthUrl: "https://supabase-opms.locolbeef.com",
    category: "infrastructure",
    emoji: "🗄️",
    tag: "Database",
    jsonHealth: false,
  },
  // ─── Bots / Farmhands ──────────────────────────────────────────────────────
  {
    id: "amos",
    name: "Amos",
    description: "Discord ↔ Plane integration — creates and tracks cows from Discord",
    url: "https://amos.locolbeef.com",
    healthUrl: "https://amos.locolbeef.com/health",
    category: "bot",
    emoji: "🤠",
    tag: "Farmhand",
    jsonHealth: true,
    coolifyId: "rrjz67v9fex3al5pfyuiesj5",
  },
  {
    id: "ledger",
    name: "Ledger",
    description: "Daily summaries & meeting recorder — keeps the ranch logs",
    url: "https://ledger.locolbeef.com",
    healthUrl: "https://ledger.locolbeef.com/health",
    category: "bot",
    emoji: "📓",
    tag: "Farmhand",
    jsonHealth: true,
    coolifyId: "t10qik1wcvbyps5b5x0wzsn2",
  },
];

export const WEBSITE_SERVICES = SERVICES.filter((s) => s.category === "website");
export const INFRA_SERVICES = SERVICES.filter((s) => s.category === "infrastructure");
export const BOT_SERVICES = SERVICES.filter((s) => s.category === "bot");

/** Services that don't yet expose a JSON /health endpoint */
export const MISSING_HEALTH_ENDPOINTS = SERVICES.filter((s) => !s.jsonHealth).map(
  (s) => s.id
);
