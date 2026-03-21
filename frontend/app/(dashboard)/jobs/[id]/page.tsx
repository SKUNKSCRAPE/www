import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileJson2,
  FileSpreadsheet,
  Filter,
  Globe,
  HardDriveUpload,
  Info,
  Layers3,
  LifeBuoy,
  Link2,
  Loader2,
  Play,
  Radar,
  RefreshCcw,
  Route,
  Search,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Webhook,
  Workflow,
  Wrench,
  XCircle,
} from "lucide-react";

type JobStatus = "queued" | "running" | "completed" | "failed" | "paused";
type QueueType = "redis" | "priority" | "bulk";
type SourceType = "crawler" | "directory" | "api" | "manual";
type JobPriority = "low" | "normal" | "high" | "critical";

type LogLevel = "info" | "warning" | "error" | "success";

type JobTimelineItem = {
  label: string;
  timestamp: string;
  status: "done" | "current" | "pending" | "failed";
  description: string;
};

type JobLogEntry = {
  at: string;
  level: LogLevel;
  message: string;
};

type JobExport = {
  type: "csv" | "json" | "xlsx";
  label: string;
  status: "ready" | "pending" | "failed";
  size: string;
};

type JobRecord = {
  id: string;
  name: string;
  description: string;
  target: string;
  source: SourceType;
  queue: QueueType;
  status: JobStatus;
  priority: JobPriority;
  progress: number;
  results: number;
  uniqueDomains: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  finishedAt?: string;
  duration?: string;
  owner: string;
  environment: string;
  country: string;
  region?: string;
  tags: string[];
  searchTerms: string[];
  includeTerms: string[];
  excludeTerms: string[];
  webhookEnabled: boolean;
  webhookUrl?: string;
  exportCsv: boolean;
  exportJson: boolean;
  exportXlsx: boolean;
  maxConcurrency: number;
  timeoutSeconds: number;
  crawlDepth: number;
  targetLeads: number;
  followContactPages: boolean;
  deduplicateDomains: boolean;
  respectRobots: boolean;
  proxyEnabled: boolean;
  proxyPool?: string;
  authMode: "none" | "basic" | "bearer" | "apikey";
  timeline: JobTimelineItem[];
  logs: JobLogEntry[];
  exports: JobExport[];
  notes?: string;
};

type PageProps = {
  params: {
    id: string;
  };
};

const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME?.trim() || "SkunkScrape Web Console";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://skunkscrape.com";

const APP_ENV =
  process.env.NEXT_PUBLIC_APP_ENV?.trim() ||
  (process.env.NODE_ENV === "production" ? "Production" : "Development");

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const jobId = decodeURIComponent(params.id);

  return {
    title: `Job ${jobId}`,
    description:
      "Detailed execution view for a SkunkScrape job, including progress, logs, exports, configuration, and operational diagnostics.",
  };
}

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

function statusMeta(status: JobStatus) {
  switch (status) {
    case "running":
      return {
        label: "Running",
        pill: "pill-primary",
        dot: "status-running",
        icon: Loader2,
        progressTone: "bg-cyan-400",
      };
    case "completed":
      return {
        label: "Completed",
        pill: "pill-success",
        dot: "status-success",
        icon: CheckCircle2,
        progressTone: "bg-emerald-400",
      };
    case "failed":
      return {
        label: "Failed",
        pill: "pill-danger",
        dot: "status-danger",
        icon: XCircle,
        progressTone: "bg-red-400",
      };
    case "paused":
      return {
        label: "Paused",
        pill: "pill-warning",
        dot: "status-warning",
        icon: TimerReset,
        progressTone: "bg-amber-400",
      };
    default:
      return {
        label: "Queued",
        pill: "pill",
        dot: "status-idle",
        icon: CircleDashed,
        progressTone: "bg-slate-400",
      };
  }
}

function priorityPill(priority: JobPriority) {
  switch (priority) {
    case "critical":
      return "pill-danger";
    case "high":
      return "pill-warning";
    case "low":
      return "pill";
    default:
      return "pill-primary";
  }
}

function logTone(level: LogLevel) {
  switch (level) {
    case "success":
      return "pill-success";
    case "warning":
      return "pill-warning";
    case "error":
      return "pill-danger";
    default:
      return "pill";
  }
}

function timelineTone(status: JobTimelineItem["status"]) {
  switch (status) {
    case "done":
      return {
        ring: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
        dot: "bg-emerald-400",
      };
    case "current":
      return {
        ring: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
        dot: "bg-cyan-400",
      };
    case "failed":
      return {
        ring: "border-red-400/20 bg-red-400/10 text-red-200",
        dot: "bg-red-400",
      };
    default:
      return {
        ring: "border-white/10 bg-white/[0.04] text-slate-300",
        dot: "bg-slate-500",
      };
  }
}

function exportTone(status: JobExport["status"]) {
  switch (status) {
    case "ready":
      return "pill-success";
    case "failed":
      return "pill-danger";
    default:
      return "pill-warning";
  }
}

function buildJob(id: string): JobRecord {
  const upperId = id.toUpperCase();
  const numeric = Number.parseInt(upperId.replace(/\D/g, ""), 10) || 24031;
  const mode = numeric % 5;

  const base: JobRecord = {
    id: upperId,
    name: "Gauteng Plumbers Lead Sweep",
    description:
      "High-value lead generation run targeting plumbing-related listings, company profile pages, and contact-rich business sources in Gauteng.",
    target: "https://example.za/plumbers/gauteng",
    source: "crawler",
    queue: "redis",
    status: "running",
    priority: "high",
    progress: 68,
    results: 1243,
    uniqueDomains: 312,
    createdAt: "2026-03-20T08:12:00Z",
    updatedAt: "2026-03-20T10:48:00Z",
    startedAt: "2026-03-20T08:14:00Z",
    duration: "2h 34m",
    owner: "Operations",
    environment: APP_ENV,
    country: "South Africa",
    region: "Gauteng",
    tags: ["lead-gen", "gauteng", "plumbers", "b2b", "priority"],
    searchTerms: ["plumber", "plumbing", "emergency plumber", "drain cleaning"],
    includeTerms: ["contact", "phone", "whatsapp", "call", "quote"],
    excludeTerms: ["spam", "franchise-only", "job seeker"],
    webhookEnabled: true,
    webhookUrl: "https://hooks.example.com/skunkscrape/jobs",
    exportCsv: true,
    exportJson: true,
    exportXlsx: true,
    maxConcurrency: 12,
    timeoutSeconds: 15,
    crawlDepth: 2,
    targetLeads: 1000,
    followContactPages: true,
    deduplicateDomains: true,
    respectRobots: true,
    proxyEnabled: true,
    proxyPool: "webshare-default",
    authMode: "none",
    timeline: [
      {
        label: "Job created",
        timestamp: "2026-03-20T08:12:00Z",
        status: "done",
        description: "Job persisted and accepted by the API.",
      },
      {
        label: "Queued",
        timestamp: "2026-03-20T08:13:00Z",
        status: "done",
        description: "Dispatched to Redis-backed worker queue.",
      },
      {
        label: "Worker started",
        timestamp: "2026-03-20T08:14:00Z",
        status: "done",
        description: "Execution context prepared and crawler bootstrapped.",
      },
      {
        label: "Extraction in progress",
        timestamp: "2026-03-20T10:48:00Z",
        status: "current",
        description: "Source traversal and contact extraction are still active.",
      },
      {
        label: "Export packaging",
        timestamp: "",
        status: "pending",
        description: "Exports will generate after persistence finalises.",
      },
    ],
    logs: [
      {
        at: "2026-03-20T08:14:10Z",
        level: "info",
        message: "Worker initialised job context and loaded proxy pool webshare-default.",
      },
      {
        at: "2026-03-20T08:14:19Z",
        level: "success",
        message: "Initial target responded successfully; crawl session created.",
      },
      {
        at: "2026-03-20T09:02:41Z",
        level: "info",
        message: "Deduplication reduced repeated host candidates by 18%.",
      },
      {
        at: "2026-03-20T09:47:12Z",
        level: "warning",
        message: "Transient timeout recorded on one source page; retry policy recovered successfully.",
      },
      {
        at: "2026-03-20T10:48:00Z",
        level: "info",
        message: "Progress checkpoint persisted with 1,243 result rows collected.",
      },
    ],
    exports: [
      { type: "csv", label: "CSV Export", status: "pending", size: "—" },
      { type: "json", label: "JSON Export", status: "pending", size: "—" },
      { type: "xlsx", label: "Excel Export", status: "pending", size: "—" },
    ],
    notes:
      "Targeted for sales operations follow-up. Keep WhatsApp-friendly contact formats prioritised.",
  };

  if (mode === 1) {
    return {
      ...base,
      name: "Construction Supplier Directory Sync",
      description:
        "Directory-focused ingestion job for supplier listings with structured extraction and post-run export generation.",
      target: "Directory import / supplier sync",
      source: "directory",
      queue: "priority",
      status: "completed",
      priority: "normal",
      progress: 100,
      results: 842,
      uniqueDomains: 198,
      createdAt: "2026-03-20T06:40:00Z",
      updatedAt: "2026-03-20T07:20:00Z",
      startedAt: "2026-03-20T06:42:00Z",
      finishedAt: "2026-03-20T07:20:00Z",
      duration: "38m",
      owner: "Data Team",
      region: "National",
      tags: ["directory", "construction", "sync"],
      searchTerms: ["supplier", "construction", "materials"],
      includeTerms: ["contact", "email", "phone"],
      excludeTerms: ["duplicate", "inactive"],
      timeline: [
        {
          label: "Job created",
          timestamp: "2026-03-20T06:40:00Z",
          status: "done",
          description: "Job persisted and validated.",
        },
        {
          label: "Priority queue dispatch",
          timestamp: "2026-03-20T06:41:00Z",
          status: "done",
          description: "Assigned to fast-lane worker.",
        },
        {
          label: "Worker completed",
          timestamp: "2026-03-20T07:15:00Z",
          status: "done",
          description: "Directory parsing and field normalisation completed.",
        },
        {
          label: "Exports generated",
          timestamp: "2026-03-20T07:18:00Z",
          status: "done",
          description: "CSV, JSON, and XLSX export bundles created.",
        },
        {
          label: "Job closed",
          timestamp: "2026-03-20T07:20:00Z",
          status: "done",
          description: "All result metadata finalised.",
        },
      ],
      logs: [
        {
          at: "2026-03-20T06:42:19Z",
          level: "info",
          message: "Directory source configuration loaded successfully.",
        },
        {
          at: "2026-03-20T06:54:08Z",
          level: "success",
          message: "Structured supplier fields mapped cleanly for 82% of sources.",
        },
        {
          at: "2026-03-20T07:15:12Z",
          level: "success",
          message: "Execution completed with 842 normalised rows.",
        },
        {
          at: "2026-03-20T07:18:30Z",
          level: "success",
          message: "Export artifacts written and download handles registered.",
        },
      ],
      exports: [
        { type: "csv", label: "CSV Export", status: "ready", size: "1.8 MB" },
        { type: "json", label: "JSON Export", status: "ready", size: "2.7 MB" },
        { type: "xlsx", label: "Excel Export", status: "ready", size: "1.4 MB" },
      ],
    };
  }

  if (mode === 2) {
    return {
      ...base,
      name: "Rwanda Facilities API Pull",
      description:
        "Authenticated partner API ingestion for facilities records with downstream webhook delivery and controlled queueing.",
      target: "https://partner.example.rw/api/facilities",
      source: "api",
      queue: "priority",
      status: "queued",
      priority: "critical",
      progress: 0,
      results: 0,
      uniqueDomains: 0,
      createdAt: "2026-03-20T09:55:00Z",
      updatedAt: "2026-03-20T09:55:00Z",
      startedAt: undefined,
      duration: undefined,
      owner: "Platform",
      country: "Rwanda",
      region: "Kigali",
      tags: ["rwanda", "api", "partner", "critical"],
      targetLeads: 500,
      followContactPages: false,
      proxyEnabled: false,
      webhookEnabled: true,
      authMode: "bearer",
      timeline: [
        {
          label: "Job created",
          timestamp: "2026-03-20T09:55:00Z",
          status: "done",
          description: "Validated and accepted by the platform.",
        },
        {
          label: "Awaiting worker allocation",
          timestamp: "2026-03-20T09:55:00Z",
          status: "current",
          description: "Queued behind a small number of higher-cost API runs.",
        },
        {
          label: "API execution",
          timestamp: "",
          status: "pending",
          description: "Will start once worker capacity is free.",
        },
      ],
      logs: [
        {
          at: "2026-03-20T09:55:00Z",
          level: "info",
          message: "Job queued successfully for authenticated API execution.",
        },
      ],
      exports: [
        { type: "csv", label: "CSV Export", status: "pending", size: "—" },
        { type: "json", label: "JSON Export", status: "pending", size: "—" },
        { type: "xlsx", label: "Excel Export", status: "pending", size: "—" },
      ],
    };
  }

  if (mode === 3) {
    return {
      ...base,
      name: "Botswana Logistics Contacts Refresh",
      description:
        "Refresh run for logistics providers, ended with repeated source instability and partial extraction.",
      target: "https://example.bw/logistics",
      source: "crawler",
      queue: "redis",
      status: "failed",
      priority: "high",
      progress: 41,
      results: 215,
      uniqueDomains: 61,
      createdAt: "2026-03-19T15:15:00Z",
      updatedAt: "2026-03-19T16:02:00Z",
      startedAt: "2026-03-19T15:16:00Z",
      finishedAt: "2026-03-19T16:02:00Z",
      duration: "46m",
      owner: "Operations",
      country: "Botswana",
      region: "Gaborone",
      tags: ["botswana", "logistics", "refresh", "retry-needed"],
      timeline: [
        {
          label: "Job created",
          timestamp: "2026-03-19T15:15:00Z",
          status: "done",
          description: "Job persisted and queued.",
        },
        {
          label: "Execution started",
          timestamp: "2026-03-19T15:16:00Z",
          status: "done",
          description: "Crawler started with configured proxy routing.",
        },
        {
          label: "Repeated source timeouts",
          timestamp: "2026-03-19T15:52:00Z",
          status: "failed",
          description: "Retries exceeded configured threshold on key pages.",
        },
        {
          label: "Failure persisted",
          timestamp: "2026-03-19T16:02:00Z",
          status: "failed",
          description: "Job moved to failed state for operator review.",
        },
      ],
      logs: [
        {
          at: "2026-03-19T15:16:09Z",
          level: "info",
          message: "Worker started Botswana logistics refresh.",
        },
        {
          at: "2026-03-19T15:41:28Z",
          level: "warning",
          message: "Repeated 504 responses observed on source pages.",
        },
        {
          at: "2026-03-19T15:55:11Z",
          level: "error",
          message: "Retry ceiling reached for critical target route.",
        },
        {
          at: "2026-03-19T16:02:00Z",
          level: "error",
          message: "Job marked failed after partial extraction and recovery exhaustion.",
        },
      ],
      exports: [
        { type: "csv", label: "CSV Export", status: "failed", size: "—" },
        { type: "json", label: "JSON Export", status: "ready", size: "412 KB" },
        { type: "xlsx", label: "Excel Export", status: "failed", size: "—" },
      ],
      notes:
        "Review source health, lower concurrency, and consider queueing through a more stable proxy pool before rerun.",
    };
  }

  if (mode === 4) {
    return {
      ...base,
      name: "Manual Import Validation Batch",
      description:
        "Manual validation job for uploaded import data. Execution was paused for QA review before export generation.",
      target: "Uploaded CSV validation",
      source: "manual",
      queue: "bulk",
      status: "paused",
      priority: "low",
      progress: 52,
      results: 311,
      uniqueDomains: 0,
      createdAt: "2026-03-19T11:05:00Z",
      updatedAt: "2026-03-19T12:11:00Z",
      startedAt: "2026-03-19T11:10:00Z",
      duration: "1h 01m",
      owner: "QA",
      country: "South Africa",
      region: "Internal",
      tags: ["import", "validation", "qa"],
      followContactPages: false,
      respectRobots: false,
      proxyEnabled: false,
      timeline: [
        {
          label: "Import accepted",
          timestamp: "2026-03-19T11:05:00Z",
          status: "done",
          description: "Upload parsed and validation session created.",
        },
        {
          label: "Validation started",
          timestamp: "2026-03-19T11:10:00Z",
          status: "done",
          description: "Row-level checks executed against import schema.",
        },
        {
          label: "Paused for QA",
          timestamp: "2026-03-19T12:11:00Z",
          status: "current",
          description: "Operator review requested before continuing.",
        },
      ],
      logs: [
        {
          at: "2026-03-19T11:10:05Z",
          level: "info",
          message: "Manual validation process started.",
        },
        {
          at: "2026-03-19T11:42:18Z",
          level: "warning",
          message: "Detected inconsistent phone formatting across import batch.",
        },
        {
          at: "2026-03-19T12:11:00Z",
          level: "warning",
          message: "Run paused for operator confirmation on malformed rows.",
        },
      ],
      exports: [
        { type: "csv", label: "CSV Export", status: "pending", size: "—" },
        { type: "json", label: "JSON Export", status: "pending", size: "—" },
        { type: "xlsx", label: "Excel Export", status: "pending", size: "—" },
      ],
    };
  }

  return base;
}

function buildPayloadPreview(job: JobRecord) {
  return JSON.stringify(
    {
      id: job.id,
      name: job.name,
      target: job.target,
      source_type: job.source,
      queue: job.queue,
      priority: job.priority,
      status: job.status,
      environment: job.environment,
      geography: {
        country: job.country,
        region: job.region || undefined,
      },
      scraping: {
        target_leads: job.targetLeads,
        crawl_depth: job.crawlDepth,
        max_concurrency: job.maxConcurrency,
        timeout_seconds: job.timeoutSeconds,
        search_terms: job.searchTerms,
        include_terms: job.includeTerms,
        exclude_terms: job.excludeTerms,
        respect_robots: job.respectRobots,
        deduplicate_domains: job.deduplicateDomains,
        follow_contact_pages: job.followContactPages,
        proxy_enabled: job.proxyEnabled,
        proxy_pool: job.proxyPool,
      },
      outputs: {
        export_csv: job.exportCsv,
        export_json: job.exportJson,
        export_xlsx: job.exportXlsx,
        webhook_enabled: job.webhookEnabled,
        webhook_url: job.webhookEnabled ? job.webhookUrl : undefined,
      },
      auth: {
        mode: job.authMode,
      },
      tags: job.tags,
      owner: job.owner,
      notes: job.notes,
    },
    null,
    2,
  );
}

export default function JobDetailPage({ params }: PageProps) {
  const job = buildJob(decodeURIComponent(params.id));
  const status = statusMeta(job.status);
  const StatusIcon = status.icon;
  const payloadPreview = buildPayloadPreview(job);

  const completedTimelineSteps = job.timeline.filter((item) => item.status === "done").length;
  const totalTimelineSteps = job.timeline.length;

  return (
    <div className="space-y-6">
      <section className="surface-card hero-gradient bg-noise p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/jobs" className="btn-ghost btn-sm">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Jobs</span>
              </Link>

              <span className={status.pill}>
                <StatusIcon
                  className={cn("h-3.5 w-3.5", job.status === "running" && "animate-spin")}
                />
                {status.label}
              </span>

              <span className={priorityPill(job.priority)}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {titleCase(job.priority)}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              {job.name}
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300">
              {job.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="pill">
                <Workflow className="h-3.5 w-3.5" />
                {job.id}
              </span>
              <span className="pill">
                <Globe className="h-3.5 w-3.5" />
                {job.country}
                {job.region ? ` • ${job.region}` : ""}
              </span>
              <span className="pill">
                <ServerCog className="h-3.5 w-3.5" />
                {job.queue}
              </span>
              <span className="pill">
                <Radar className="h-3.5 w-3.5" />
                {job.source}
              </span>
              <span className="pill">
                <Database className="h-3.5 w-3.5" />
                {SITE_URL.replace(/^https?:\/\//, "")}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px] xl:max-w-[420px]">
            <button type="button" className="btn-primary btn-lg">
              <RefreshCcw className="h-4 w-4" />
              <span>Rerun Job</span>
            </button>

            <button type="button" className="btn-secondary btn-lg">
              <Play className="h-4 w-4" />
              <span>
                {job.status === "paused" ? "Resume Job" : "Replay Config"}
              </span>
            </button>

            <button type="button" className="btn-secondary btn-lg">
              <Download className="h-4 w-4" />
              <span>Export Outputs</span>
            </button>

            <Link href={`/jobs/new`} className="btn-secondary btn-lg">
              <Sparkles className="h-4 w-4" />
              <span>Clone as New Job</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="stat-label">Progress</p>
          <p className="stat-value">{job.progress}%</p>
          <p className="stat-trend">{job.duration || "Awaiting runtime window"}</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Results Collected</p>
          <p className="stat-value">{formatCompact(job.results)}</p>
          <p className="stat-trend">Total records currently attached to the run</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Unique Domains</p>
          <p className="stat-value">{formatNumber(job.uniqueDomains)}</p>
          <p className="stat-trend">Distinct host coverage during collection</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Runtime Environment</p>
          <p className="stat-value">{job.environment}</p>
          <p className="stat-trend">{APP_NAME}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Execution summary</p>
            <h2 className="card-title">Current run posture and progress</h2>
            <p className="card-copy">
              This area is designed to surface the job’s current lifecycle state, worker
              posture, timing, and main operational controls.
            </p>
          </div>

          <div className="mt-5 space-y-5">
            <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={status.pill}>
                      <StatusIcon
                        className={cn(
                          "h-3.5 w-3.5",
                          job.status === "running" && "animate-spin",
                        )}
                      />
                      {status.label}
                    </span>
                    <span className={priorityPill(job.priority)}>
                      {titleCase(job.priority)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-white">
                    Target reference
                  </p>
                  <p className="mt-1 text-sm leading-7 text-slate-400">
                    {job.target}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[260px]">
                  <div className="surface-card-muted p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Owner
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{job.owner}</p>
                  </div>
                  <div className="surface-card-muted p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Queue
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{job.queue}</p>
                  </div>
                  <div className="surface-card-muted p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Source
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{job.source}</p>
                  </div>
                  <div className="surface-card-muted p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Auth
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{job.authMode}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Execution progress</span>
                  <span>{job.progress}%</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-white/10">
                  <div
                    className={cn("h-2.5 rounded-full transition-all duration-300", status.progressTone)}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="surface-card-muted p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Created
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatDateTime(job.createdAt)}
                  </p>
                </div>
                <div className="surface-card-muted p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Started
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatDateTime(job.startedAt)}
                  </p>
                </div>
                <div className="surface-card-muted p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Updated
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatDateTime(job.updatedAt)}
                  </p>
                </div>
                <div className="surface-card-muted p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Finished
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatDateTime(job.finishedAt)}
                  </p>
                </div>
              </div>
            </div>

            {job.status === "failed" ? (
              <div className="alert-danger">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-4 w-4" />
                  <p>
                    This run failed before completion. Review logs, diagnostics, and source
                    health before replaying or cloning the configuration.
                  </p>
                </div>
              </div>
            ) : null}

            {job.status === "running" ? (
              <div className="alert-info">
                <div className="flex items-start gap-3">
                  <Loader2 className="mt-0.5 h-4 w-4 animate-spin" />
                  <p>
                    The run is active. This screen is structured for polling or live updates
                    once you wire in your FastAPI detail endpoint and worker state refresh.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Lifecycle</p>
            <h2 className="card-title">Timeline and checkpoints</h2>
            <p className="card-copy">
              A concise execution timeline for route-aware debugging, job state review,
              and operator hand-off.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div className="surface-card-muted p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Completion path
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {completedTimelineSteps} of {totalTimelineSteps} steps completed
                  </p>
                </div>
                <span className="pill-primary">
                  <Clock3 className="h-3.5 w-3.5" />
                  {job.duration || "Pending"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {job.timeline.map((item, index) => {
                const tone = timelineTone(item.status);

                return (
                  <div
                    key={`${item.label}-${index}`}
                    className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex flex-col items-center">
                        <span
                          className={cn(
                            "inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                            tone.ring,
                          )}
                        >
                          <span className={cn("h-2.5 w-2.5 rounded-full", tone.dot)} />
                        </span>
                        {index < job.timeline.length - 1 ? (
                          <span className="mt-2 h-8 w-px bg-white/10" />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-semibold text-white">{item.label}</p>
                          <p className="text-xs text-slate-500">
                            {item.timestamp ? formatDateTime(item.timestamp) : "Pending"}
                          </p>
                        </div>
                        <p className="mt-1 text-sm leading-7 text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Configuration</p>
            <h2 className="card-title">Execution settings and scrape model</h2>
            <p className="card-copy">
              Structured configuration view for operational review before reruns, clones,
              and scheduling changes.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Target leads
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {formatNumber(job.targetLeads)}
              </p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Crawl depth
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{job.crawlDepth}</p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Concurrency
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{job.maxConcurrency}</p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Timeout
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {job.timeoutSeconds}s
              </p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Proxy routing
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {job.proxyEnabled ? job.proxyPool || "Enabled" : "Disabled"}
              </p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Robots posture
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {job.respectRobots ? "Respect robots.txt" : "Ignore robots.txt"}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="switch-row">
              <div className="switch-copy">
                <p className="switch-title">Follow contact pages</p>
                <p className="switch-description">
                  Attempt deeper traversal where contact-oriented signals are detected.
                </p>
              </div>
              <span className={job.followContactPages ? "pill-success" : "pill"}>
                {job.followContactPages ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="switch-row">
              <div className="switch-copy">
                <p className="switch-title">Deduplicate domains</p>
                <p className="switch-description">
                  Collapse repeated host candidates before persistence and export.
                </p>
              </div>
              <span className={job.deduplicateDomains ? "pill-success" : "pill"}>
                {job.deduplicateDomains ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="switch-row">
              <div className="switch-copy">
                <p className="switch-title">Webhook delivery</p>
                <p className="switch-description">
                  Push completion events and downstream automation triggers.
                </p>
              </div>
              <span className={job.webhookEnabled ? "pill-success" : "pill"}>
                {job.webhookEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Search terms</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.searchTerms.map((term) => (
                  <span key={term} className="pill-primary">
                    <Search className="h-3.5 w-3.5" />
                    {term}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Include terms</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.includeTerms.map((term) => (
                  <span key={term} className="pill-success">
                    <Filter className="h-3.5 w-3.5" />
                    {term}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Exclude terms</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.excludeTerms.map((term) => (
                  <span key={term} className="pill-warning">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {term}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="pill">
                    <Sparkles className="h-3.5 w-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Logs and diagnostics</p>
            <h2 className="card-title">Operator-facing runtime detail</h2>
            <p className="card-copy">
              Review chronological runtime events, transient warnings, failures, and export readiness.
            </p>
          </div>

          <div className="mt-5 space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="surface-card-muted p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  API posture
                </p>
                <p className="mt-2 text-sm font-semibold text-white">FastAPI detail route</p>
                <p className="mt-1 text-xs text-slate-400">
                  Ready for live job status fetch
                </p>
              </div>

              <div className="surface-card-muted p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Queue model
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{job.queue}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Worker-backed execution lane
                </p>
              </div>

              <div className="surface-card-muted p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Webhook target
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {job.webhookEnabled ? "Configured" : "Disabled"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {job.webhookEnabled ? job.webhookUrl : "No downstream delivery"}
                </p>
              </div>
            </div>

            <div className="data-card overflow-hidden">
              <div className="data-card-header">
                <div>
                  <p className="data-card-title">Execution log stream</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Structured runtime messages for troubleshooting, audit, and operator review.
                  </p>
                </div>
              </div>

              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Level</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.logs.map((entry, index) => (
                      <tr key={`${entry.at}-${index}`}>
                        <td className="text-slate-400">{formatDateTime(entry.at)}</td>
                        <td>
                          <span className={logTone(entry.level)}>
                            {titleCase(entry.level)}
                          </span>
                        </td>
                        <td className="data-cell-wrap">{entry.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {job.exports.map((item) => {
                const Icon =
                  item.type === "csv"
                    ? FileSpreadsheet
                    : item.type === "json"
                      ? FileJson2
                      : HardDriveUpload;

                return (
                  <div
                    key={`${item.type}-${item.label}`}
                    className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className={exportTone(item.status)}>
                        {titleCase(item.status)}
                      </span>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-400">Size: {item.size}</p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        className="btn-secondary btn-sm w-full"
                        disabled={item.status !== "ready"}
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Request model</p>
            <h2 className="card-title">Payload preview</h2>
            <p className="card-copy">
              Useful for debugging API persistence, comparing the stored job model, and validating replay behaviour.
            </p>
          </div>

          <div className="mt-5">
            <pre className="max-h-[520px] overflow-auto text-xs leading-6">
              <code>{payloadPreview}</code>
            </pre>
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Actions and next steps</p>
            <h2 className="card-title">Operational follow-up</h2>
            <p className="card-copy">
              Suggested flows for retry, export, diagnostics, and API integration work.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {[
              {
                icon: RefreshCcw,
                title: "Bind live polling",
                text: "Wire this page to your FastAPI job detail endpoint and refresh status, progress, and logs at a controlled interval.",
              },
              {
                icon: Cpu,
                title: "Worker telemetry",
                text: "Attach worker metadata, queue position, retry count, and host execution context when available.",
              },
              {
                icon: Route,
                title: "Replay and clone flows",
                text: "Add server-backed replay and clone actions so operators can rerun or fork the configuration safely.",
              },
              {
                icon: Webhook,
                title: "Delivery verification",
                text: "Surface webhook response history and downstream delivery status beside export artifacts.",
              },
              {
                icon: Wrench,
                title: "Diagnostics deep-linking",
                text: "Open queue health, source errors, and export generation diagnostics directly from this screen.",
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

          {job.notes ? (
            <div className="mt-5 rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 text-cyan-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Operator note</p>
                  <p className="mt-1 text-sm leading-7 text-slate-300">{job.notes}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/jobs" className="btn-secondary btn-sm">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Jobs</span>
            </Link>

            <Link href="/jobs/new" className="btn-secondary btn-sm">
              <Sparkles className="h-4 w-4" />
              <span>New Job</span>
            </Link>

            <button type="button" className="btn-secondary btn-sm">
              <LifeBuoy className="h-4 w-4" />
              <span>Support</span>
            </button>

            <button type="button" className="btn-primary btn-sm">
              <ArrowRight className="h-4 w-4" />
              <span>Replay Run</span>
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}