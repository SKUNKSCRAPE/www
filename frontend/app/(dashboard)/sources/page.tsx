import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Database,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  HardDriveUpload,
  Layers3,
  Link2,
  MapPinned,
  Radar,
  RefreshCcw,
  Search,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Workflow,
  XCircle,
} from "lucide-react";

type SourceStatus = "active" | "degraded" | "paused" | "failed" | "draft";
type SourceCategory = "crawler" | "directory" | "api" | "manual";
type SourceHealth = "healthy" | "warning" | "critical";

type SourceRecord = {
  id: string;
  name: string;
  url: string;
  host: string;
  category: SourceCategory;
  status: SourceStatus;
  health: SourceHealth;
  country: string;
  region: string;
  jobsLinked: number;
  lastRunAt: string;
  lastCheckedAt: string;
  recordsSeen: number;
  uniqueDomains: number;
  avgLatencyMs: number;
  authMode: "none" | "basic" | "bearer" | "apikey";
  robotsPolicy: "respect" | "ignore" | "n/a";
  proxyPool?: string;
  tags: string[];
  notes?: string;
};

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Source registry for SkunkScrape, including target health, category, host visibility, linked jobs, and operational status.",
};

const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME?.trim() || "SkunkScrape Web Console";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://skunkscrape.com";

const PLATFORM_STATUS =
  process.env.NEXT_PUBLIC_PLATFORM_STATUS?.trim() || "Operational";

const SOURCES: SourceRecord[] = [
  {
    id: "SRC-1001",
    name: "Gauteng Plumbers Directory Sweep",
    url: "https://example.za/plumbers/gauteng",
    host: "example.za",
    category: "crawler",
    status: "active",
    health: "healthy",
    country: "South Africa",
    region: "Gauteng",
    jobsLinked: 6,
    lastRunAt: "2026-03-20T10:48:00Z",
    lastCheckedAt: "2026-03-20T10:52:00Z",
    recordsSeen: 1243,
    uniqueDomains: 312,
    avgLatencyMs: 842,
    authMode: "none",
    robotsPolicy: "respect",
    proxyPool: "webshare-default",
    tags: ["lead-gen", "plumbers", "gauteng", "crawler"],
    notes: "Strong contact-density source with stable traversal patterns.",
  },
  {
    id: "SRC-1002",
    name: "Construction Supplier Directory",
    url: "Directory import / supplier catalog",
    host: "directory-import",
    category: "directory",
    status: "active",
    health: "healthy",
    country: "South Africa",
    region: "National",
    jobsLinked: 4,
    lastRunAt: "2026-03-20T07:20:00Z",
    lastCheckedAt: "2026-03-20T07:25:00Z",
    recordsSeen: 842,
    uniqueDomains: 198,
    avgLatencyMs: 320,
    authMode: "none",
    robotsPolicy: "n/a",
    tags: ["directory", "construction", "suppliers"],
    notes: "Structured supplier ingestion with reliable field coverage.",
  },
  {
    id: "SRC-1003",
    name: "Rwanda Facilities Partner API",
    url: "https://partner.example.rw/api/facilities",
    host: "partner.example.rw",
    category: "api",
    status: "active",
    health: "warning",
    country: "Rwanda",
    region: "Kigali",
    jobsLinked: 3,
    lastRunAt: "2026-03-20T09:55:00Z",
    lastCheckedAt: "2026-03-20T10:05:00Z",
    recordsSeen: 0,
    uniqueDomains: 1,
    avgLatencyMs: 1120,
    authMode: "bearer",
    robotsPolicy: "n/a",
    tags: ["api", "partner", "rwanda", "facilities"],
    notes: "Authenticated API source with variable response times.",
  },
  {
    id: "SRC-1004",
    name: "Botswana Logistics Contacts",
    url: "https://example.bw/logistics",
    host: "example.bw",
    category: "crawler",
    status: "failed",
    health: "critical",
    country: "Botswana",
    region: "Gaborone",
    jobsLinked: 2,
    lastRunAt: "2026-03-19T16:02:00Z",
    lastCheckedAt: "2026-03-20T08:10:00Z",
    recordsSeen: 215,
    uniqueDomains: 61,
    avgLatencyMs: 4210,
    authMode: "none",
    robotsPolicy: "respect",
    proxyPool: "webshare-default",
    tags: ["botswana", "logistics", "retry-needed"],
    notes: "Repeated source instability and elevated timeout profile.",
  },
  {
    id: "SRC-1005",
    name: "Manual Import Validation Feed",
    url: "Uploaded CSV validation source",
    host: "manual-upload",
    category: "manual",
    status: "paused",
    health: "warning",
    country: "South Africa",
    region: "Internal",
    jobsLinked: 1,
    lastRunAt: "2026-03-19T12:11:00Z",
    lastCheckedAt: "2026-03-19T12:11:00Z",
    recordsSeen: 311,
    uniqueDomains: 0,
    avgLatencyMs: 0,
    authMode: "none",
    robotsPolicy: "n/a",
    tags: ["manual", "import", "qa"],
    notes: "Paused pending QA review on input quality.",
  },
  {
    id: "SRC-1006",
    name: "Portugal Contractor Discovery Seed",
    url: "https://example.pt/contractors",
    host: "example.pt",
    category: "crawler",
    status: "draft",
    health: "healthy",
    country: "Portugal",
    region: "Lisbon",
    jobsLinked: 0,
    lastRunAt: "",
    lastCheckedAt: "2026-03-20T06:00:00Z",
    recordsSeen: 0,
    uniqueDomains: 0,
    avgLatencyMs: 0,
    authMode: "none",
    robotsPolicy: "respect",
    tags: ["portugal", "contractors", "draft"],
    notes: "Prepared for future expansion wave and localized validation.",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-ZA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-ZA").format(value);
}

function titleCase(input: string) {
  return input.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusMeta(status: SourceStatus) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        pill: "pill-success",
        dot: "status-success",
        icon: CheckCircle2,
      };
    case "degraded":
      return {
        label: "Degraded",
        pill: "pill-warning",
        dot: "status-warning",
        icon: ShieldAlert,
      };
    case "paused":
      return {
        label: "Paused",
        pill: "pill-warning",
        dot: "status-warning",
        icon: TimerReset,
      };
    case "failed":
      return {
        label: "Failed",
        pill: "pill-danger",
        dot: "status-danger",
        icon: XCircle,
      };
    default:
      return {
        label: "Draft",
        pill: "pill",
        dot: "status-idle",
        icon: CircleDashed,
      };
  }
}

function healthMeta(health: SourceHealth) {
  switch (health) {
    case "healthy":
      return {
        label: "Healthy",
        pill: "pill-success",
      };
    case "warning":
      return {
        label: "Warning",
        pill: "pill-warning",
      };
    default:
      return {
        label: "Critical",
        pill: "pill-danger",
      };
  }
}

function buildInsights(data: SourceRecord[]) {
  const total = data.length;
  const active = data.filter((item) => item.status === "active").length;
  const failed = data.filter((item) => item.status === "failed").length;
  const draft = data.filter((item) => item.status === "draft").length;
  const jobsLinked = data.reduce((sum, item) => sum + item.jobsLinked, 0);
  const recordsSeen = data.reduce((sum, item) => sum + item.recordsSeen, 0);

  return {
    total,
    active,
    failed,
    draft,
    jobsLinked,
    recordsSeen,
  };
}

export default function SourcesPage() {
  const insights = buildInsights(SOURCES);
  const highestLatency =
    [...SOURCES].sort((a, b) => b.avgLatencyMs - a.avgLatencyMs)[0] || null;
  const healthiestCount = SOURCES.filter((item) => item.health === "healthy").length;

  return (
    <div className="space-y-6">
      <section className="surface-card hero-gradient bg-noise p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 max-w-4xl">
            <div className="pill-primary">
              <Database className="h-4 w-4" />
              <span>Source Registry</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Source visibility, host awareness, and operational health in one place.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Review every crawler target, directory source, API endpoint, and manual input lane
              from a single responsive registry. This page is designed for operational review,
              source curation, and platform scaling inside {APP_NAME}.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="pill">
                <Globe className="h-3.5 w-3.5" />
                {SITE_URL.replace(/^https?:\/\//, "")}
              </span>
              <span className="pill">
                <ServerCog className="h-3.5 w-3.5" />
                {PLATFORM_STATUS}
              </span>
              <span className="pill">
                <Workflow className="h-3.5 w-3.5" />
                Source-to-job linkage ready
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px] xl:max-w-[420px]">
            <Link href="/jobs/new" className="btn-primary btn-lg">
              <Sparkles className="h-4 w-4" />
              <span>New Job</span>
            </Link>

            <button type="button" className="btn-secondary btn-lg">
              <RefreshCcw className="h-4 w-4" />
              <span>Refresh Sources</span>
            </button>

            <button type="button" className="btn-secondary btn-lg">
              <HardDriveUpload className="h-4 w-4" />
              <span>Import Source List</span>
            </button>

            <button type="button" className="btn-secondary btn-lg">
              <Search className="h-4 w-4" />
              <span>Run Discovery</span>
            </button>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="stat-label">Total Sources</p>
          <p className="stat-value">{insights.total}</p>
          <p className="stat-trend">Known source entries in the current registry</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Active Sources</p>
          <p className="stat-value">{insights.active}</p>
          <p className="stat-trend">Currently usable targets for execution</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Linked Jobs</p>
          <p className="stat-value">{formatNumber(insights.jobsLinked)}</p>
          <p className="stat-trend">Total job associations across source records</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Records Observed</p>
          <p className="stat-value">{formatCompact(insights.recordsSeen)}</p>
          <p className="stat-trend">Aggregate records surfaced across tracked runs</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Registry overview</p>
            <h2 className="card-title">Operational source posture</h2>
            <p className="card-copy">
              This area highlights high-level source distribution and where operator attention is most needed.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Healthy Sources
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{healthiestCount}</p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Failed Sources
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{insights.failed}</p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Draft Sources
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{insights.draft}</p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Coverage Mode
              </p>
              <p className="mt-2 text-lg font-semibold text-white">Multi-country</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="switch-row">
              <div className="switch-copy">
                <p className="switch-title">Crawler and API coverage</p>
                <p className="switch-description">
                  Keep crawler targets, API sources, directory imports, and manual feeds visible in one consistent registry.
                </p>
              </div>
              <span className="pill-success">Enabled</span>
            </div>

            <div className="switch-row">
              <div className="switch-copy">
                <p className="switch-title">Host-aware governance</p>
                <p className="switch-description">
                  Review hosts, robots posture, authentication requirements, and proxy routing before execution.
                </p>
              </div>
              <span className="pill-success">Enabled</span>
            </div>

            <div className="switch-row">
              <div className="switch-copy">
                <p className="switch-title">Job linkage model</p>
                <p className="switch-description">
                  This page is structured to support one-to-many job relationships per source entry.
                </p>
              </div>
              <span className="pill-primary">Ready</span>
            </div>
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Attention signal</p>
            <h2 className="card-title">Highest-latency source</h2>
            <p className="card-copy">
              Quick spotlight for the source most likely to need concurrency, queue, or proxy adjustments.
            </p>
          </div>

          {highestLatency ? (
            <div className="mt-5 rounded-[1.4rem] border border-amber-400/20 bg-amber-400/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{highestLatency.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{highestLatency.id}</p>
                </div>
                <span className={healthMeta(highestLatency.health).pill}>
                  {healthMeta(highestLatency.health).label}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="surface-card-muted p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Avg latency
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatNumber(highestLatency.avgLatencyMs)} ms
                  </p>
                </div>

                <div className="surface-card-muted p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {titleCase(highestLatency.status)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                This view is built to later support retries, host-level diagnostics, robots review,
                and per-source concurrency recommendations.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary btn-sm">
                  <RefreshCcw className="h-4 w-4" />
                  <span>Retest Source</span>
                </button>
                <button type="button" className="btn-secondary btn-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Review Policy</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state mt-5">
              <Activity className="h-8 w-8 text-slate-500" />
              <p className="empty-title">No source insight available</p>
              <p className="empty-copy">
                Once your source registry grows, this panel can surface latency anomalies and failure hotspots.
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="data-card">
        <div className="data-card-header">
          <div>
            <p className="section-kicker">Source table</p>
            <h2 className="data-card-title mt-1">Responsive source registry</h2>
            <p className="mt-1 text-sm text-slate-400">
              Desktop table and mobile card layout for source review, health checks, and future filtering.
            </p>
          </div>

          <div className="data-card-tools">
            <button type="button" className="btn-secondary btn-sm">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button type="button" className="btn-secondary btn-sm">
              <Download className="h-4 w-4" />
              <span>Export Registry</span>
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Health</th>
                  <th>Category</th>
                  <th>Host</th>
                  <th>Jobs</th>
                  <th>Records</th>
                  <th>Latency</th>
                  <th>Last Checked</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {SOURCES.map((source) => {
                  const status = statusMeta(source.status);
                  const health = healthMeta(source.health);
                  const StatusIcon = status.icon;

                  return (
                    <tr key={source.id}>
                      <td>
                        <div className="data-cell-wrap">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
                              <Database className="h-4 w-4 text-cyan-300" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white">{source.name}</p>
                              <p className="mt-1 text-xs text-slate-400">{source.id}</p>
                              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                {source.url}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={status.pill}>
                          <StatusIcon
                            className={cn(
                              "h-3.5 w-3.5",
                              source.status === "active" && "animate-pulse-soft",
                            )}
                          />
                          {status.label}
                        </span>
                      </td>

                      <td>
                        <span className={health.pill}>{health.label}</span>
                      </td>

                      <td className="capitalize text-slate-300">{source.category}</td>
                      <td className="text-slate-300">{source.host}</td>
                      <td>{formatNumber(source.jobsLinked)}</td>
                      <td>{formatCompact(source.recordsSeen)}</td>
                      <td>{source.avgLatencyMs ? `${formatNumber(source.avgLatencyMs)} ms` : "—"}</td>
                      <td>{formatDateTime(source.lastCheckedAt)}</td>

                      <td>
                        <div className="flex items-center gap-2">
                          <button type="button" className="btn-secondary btn-sm">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:hidden">
          {SOURCES.map((source) => {
            const status = statusMeta(source.status);
            const health = healthMeta(source.health);
            const StatusIcon = status.icon;

            return (
              <article key={source.id} className="surface-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-white">{source.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{source.id}</p>
                  </div>

                  <span className={status.pill}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-400">{source.url}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={health.pill}>{health.label}</span>
                  <span className="pill capitalize">{source.category}</span>
                  <span className="pill">{source.country}</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="surface-card-muted p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Jobs Linked
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {formatNumber(source.jobsLinked)}
                    </p>
                  </div>

                  <div className="surface-card-muted p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Records Seen
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {formatCompact(source.recordsSeen)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {source.tags.map((tag) => (
                      <span key={tag} className="pill">
                        <Sparkles className="h-3.5 w-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    <p>
                      Host: <span className="text-slate-300">{source.host}</span>
                    </p>
                    <p>
                      Checked:{" "}
                      <span className="text-slate-300">
                        {formatDateTime(source.lastCheckedAt)}
                      </span>
                    </p>
                  </div>

                  <button type="button" className="btn-secondary btn-sm">
                    <ArrowRight className="h-4 w-4" />
                    <span>Open</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Source governance</p>
            <h2 className="card-title">Policy and runtime characteristics</h2>
            <p className="card-copy">
              This section is designed to help operators reason about auth, robots posture, and proxy routing per source.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {SOURCES.slice(0, 4).map((source) => (
              <div
                key={`${source.id}-policy`}
                className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{source.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{source.host}</p>
                  </div>

                  <span className={healthMeta(source.health).pill}>
                    {healthMeta(source.health).label}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="surface-card-muted p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Auth mode
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {source.authMode}
                    </p>
                  </div>

                  <div className="surface-card-muted p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Robots
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {source.robotsPolicy}
                    </p>
                  </div>

                  <div className="surface-card-muted p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Proxy pool
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {source.proxyPool || "Disabled"}
                    </p>
                  </div>
                </div>

                {source.notes ? (
                  <p className="mt-4 text-sm leading-7 text-slate-400">{source.notes}</p>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Implementation notes</p>
            <h2 className="card-title">What this page is ready for next</h2>
            <p className="card-copy">
              This route is production-lean and designed to connect cleanly into your API and database model.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {[
              {
                icon: Link2,
                title: "Source detail route",
                text: "Add a dynamic route such as /sources/[id] to inspect one source in depth, including linked jobs and host diagnostics.",
              },
              {
                icon: Search,
                title: "Server-side filtering",
                text: "Bind filters, search, and pagination to FastAPI-backed source list endpoints.",
              },
              {
                icon: Layers3,
                title: "Source-job relationships",
                text: "Store source-to-job mappings in PostgreSQL and expose counts, recent executions, and status history.",
              },
              {
                icon: ShieldCheck,
                title: "Governance controls",
                text: "Add source approval states, robots policy overrides, auth secret references, and proxy rules.",
              },
              {
                icon: Radar,
                title: "Health telemetry",
                text: "Surface response times, failure trends, blocked hosts, and deduplication patterns over time.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
              >
                <item.icon className="mt-0.5 h-5 w-5 text-cyan-300" />
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-7 text-slate-400">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 text-cyan-300" />
              <div>
                <p className="text-sm font-semibold text-white">Recommended next backend model</p>
                <p className="mt-1 text-sm leading-7 text-slate-300">
                  Add a `sources` table plus a source-health ledger and a join table to `jobs`,
                  then expose `/api/sources`, `/api/sources/{id}`, and `/api/sources/{id}/jobs`.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/jobs" className="btn-secondary btn-sm">
              <Workflow className="h-4 w-4" />
              <span>View Jobs</span>
            </Link>
            <button type="button" className="btn-secondary btn-sm">
              <ExternalLink className="h-4 w-4" />
              <span>Open Docs</span>
            </button>
            <button type="button" className="btn-primary btn-sm">
              <ArrowRight className="h-4 w-4" />
              <span>Add Source Flow</span>
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}