"use client";

import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Database,
  Download,
  ExternalLink,
  Filter,
  Globe,
  Loader2,
  Play,
  Plus,
  RefreshCcw,
  Search,
  ServerCog,
  ShieldAlert,
  SquareTerminal,
  TimerReset,
  XCircle,
} from "lucide-react";

type JobStatus = "queued" | "running" | "completed" | "failed" | "paused";
type QueueType = "redis" | "priority" | "bulk";
type SourceType = "crawler" | "directory" | "api" | "manual";
type JobPriority = "low" | "normal" | "high" | "critical";

type JobRecord = {
  id: string;
  name: string;
  target: string;
  source: SourceType;
  queue: QueueType;
  status: JobStatus;
  priority: JobPriority;
  progress: number;
  results: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  duration?: string;
  owner: string;
  environment: string;
  tags: string[];
};

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Operational jobs console for queued SkunkScrape runs, progress tracking, filtering, and execution visibility.",
};

const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME?.trim() || "SkunkScrape Web Console";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://skunkscrape.com";
const PLATFORM_STATUS =
  process.env.NEXT_PUBLIC_PLATFORM_STATUS?.trim() || "Operational";
const DEFAULT_ENV =
  process.env.NEXT_PUBLIC_APP_ENV?.trim() ||
  (process.env.NODE_ENV === "production" ? "Production" : "Development");

const JOBS: JobRecord[] = [
  {
    id: "JOB-24031",
    name: "Gauteng Plumbers Lead Sweep",
    target: "https://example.za/plumbers/gauteng",
    source: "crawler",
    queue: "redis",
    status: "running",
    priority: "high",
    progress: 68,
    results: 1243,
    createdAt: "2026-03-20T08:12:00Z",
    updatedAt: "2026-03-20T10:48:00Z",
    startedAt: "2026-03-20T08:14:00Z",
    duration: "2h 34m",
    owner: "Operations",
    environment: DEFAULT_ENV,
    tags: ["gauteng", "plumbers", "b2b"],
  },
  {
    id: "JOB-24030",
    name: "Construction Supplier Directory Sync",
    target: "Directory import / supplier sync",
    source: "directory",
    queue: "priority",
    status: "completed",
    priority: "normal",
    progress: 100,
    results: 842,
    createdAt: "2026-03-20T06:40:00Z",
    updatedAt: "2026-03-20T07:20:00Z",
    startedAt: "2026-03-20T06:42:00Z",
    duration: "38m",
    owner: "Data Team",
    environment: DEFAULT_ENV,
    tags: ["directory", "construction", "sync"],
  },
  {
    id: "JOB-24029",
    name: "Rwanda Facilities API Pull",
    target: "Partner API / facilities endpoint",
    source: "api",
    queue: "priority",
    status: "queued",
    priority: "critical",
    progress: 0,
    results: 0,
    createdAt: "2026-03-20T09:55:00Z",
    updatedAt: "2026-03-20T09:55:00Z",
    owner: "Platform",
    environment: DEFAULT_ENV,
    tags: ["rwanda", "api", "partner"],
  },
  {
    id: "JOB-24028",
    name: "Botswana Logistics Contacts Refresh",
    target: "https://example.bw/logistics",
    source: "crawler",
    queue: "redis",
    status: "failed",
    priority: "high",
    progress: 41,
    results: 215,
    createdAt: "2026-03-19T15:15:00Z",
    updatedAt: "2026-03-19T16:02:00Z",
    startedAt: "2026-03-19T15:16:00Z",
    duration: "46m",
    owner: "Operations",
    environment: DEFAULT_ENV,
    tags: ["botswana", "logistics", "refresh"],
  },
  {
    id: "JOB-24027",
    name: "Manual Import Validation Batch",
    target: "Uploaded CSV validation",
    source: "manual",
    queue: "bulk",
    status: "paused",
    priority: "low",
    progress: 52,
    results: 311,
    createdAt: "2026-03-19T11:05:00Z",
    updatedAt: "2026-03-19T12:11:00Z",
    startedAt: "2026-03-19T11:10:00Z",
    duration: "1h 01m",
    owner: "QA",
    environment: DEFAULT_ENV,
    tags: ["import", "validation", "qa"],
  },
  {
    id: "JOB-24026",
    name: "South Africa Electricians Discovery",
    target: "https://example.co.za/electricians",
    source: "crawler",
    queue: "bulk",
    status: "completed",
    priority: "normal",
    progress: 100,
    results: 2148,
    createdAt: "2026-03-19T07:45:00Z",
    updatedAt: "2026-03-19T09:02:00Z",
    startedAt: "2026-03-19T07:46:00Z",
    duration: "1h 14m",
    owner: "Sales Ops",
    environment: DEFAULT_ENV,
    tags: ["south-africa", "electricians", "lead-gen"],
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDateTime(value: string) {
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

function getStatusStyles(status: JobStatus) {
  switch (status) {
    case "running":
      return {
        pill: "pill-primary",
        dot: "status-running",
        label: "Running",
        icon: Loader2,
      };
    case "completed":
      return {
        pill: "pill-success",
        dot: "status-success",
        label: "Completed",
        icon: CheckCircle2,
      };
    case "failed":
      return {
        pill: "pill-danger",
        dot: "status-danger",
        label: "Failed",
        icon: XCircle,
      };
    case "paused":
      return {
        pill: "pill-warning",
        dot: "status-warning",
        label: "Paused",
        icon: TimerReset,
      };
    default:
      return {
        pill: "pill",
        dot: "status-idle",
        label: "Queued",
        icon: CircleDashed,
      };
  }
}

function getPriorityStyles(priority: JobPriority) {
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

function progressBarTone(status: JobStatus) {
  switch (status) {
    case "failed":
      return "bg-red-400";
    case "completed":
      return "bg-emerald-400";
    case "paused":
      return "bg-amber-400";
    default:
      return "bg-cyan-400";
  }
}

function buildInsights(data: JobRecord[]) {
  const total = data.length;
  const running = data.filter((j) => j.status === "running").length;
  const queued = data.filter((j) => j.status === "queued").length;
  const completed = data.filter((j) => j.status === "completed").length;
  const failed = data.filter((j) => j.status === "failed").length;
  const paused = data.filter((j) => j.status === "paused").length;
  const totalResults = data.reduce((sum, job) => sum + job.results, 0);

  return {
    total,
    running,
    queued,
    completed,
    failed,
    paused,
    totalResults,
  };
}

export default function JobsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | JobStatus>("all");
  const [queueFilter, setQueueFilter] = React.useState<"all" | QueueType>("all");
  const [sourceFilter, setSourceFilter] = React.useState<"all" | SourceType>("all");

  const filteredJobs = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    return JOBS.filter((job) => {
      const matchesSearch =
        !term ||
        job.id.toLowerCase().includes(term) ||
        job.name.toLowerCase().includes(term) ||
        job.target.toLowerCase().includes(term) ||
        job.owner.toLowerCase().includes(term) ||
        job.tags.some((tag) => tag.toLowerCase().includes(term));

      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesQueue = queueFilter === "all" || job.queue === queueFilter;
      const matchesSource = sourceFilter === "all" || job.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesQueue && matchesSource;
    });
  }, [search, statusFilter, queueFilter, sourceFilter]);

  const insights = React.useMemo(() => buildInsights(filteredJobs), [filteredJobs]);
  const globalInsights = React.useMemo(() => buildInsights(JOBS), []);

  const activeRunningJob = JOBS.find((job) => job.status === "running");
  const latestFailedJob = JOBS.find((job) => job.status === "failed");

  return (
    <div className="space-y-6">
      <section className="surface-card hero-gradient bg-noise p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 max-w-4xl">
            <div className="pill-primary">
              <Activity className="h-4 w-4" />
              <span>Jobs Operations</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Queued execution, run visibility, and responsive job control.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Monitor scrape workflows, review queue health, inspect job progress,
              and move directly into creation, reruns, exports, and diagnostics from
              one operational surface inside {APP_NAME}.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="pill">
                <Globe className="h-3.5 w-3.5" />
                {SITE_URL.replace(/^https?:\/\//, "")}
              </span>
              <span className="pill">
                <ServerCog className="h-3.5 w-3.5" />
                {PLATFORM_STATUS}
              </span>
              <span className="pill">
                <Database className="h-3.5 w-3.5" />
                PostgreSQL + Redis queue model
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px] xl:max-w-[420px]">
            <Link href="/jobs/new" className="btn-primary btn-lg">
              <Plus className="h-4 w-4" />
              <span>Create Job</span>
            </Link>

            <button type="button" className="btn-secondary btn-lg">
              <RefreshCcw className="h-4 w-4" />
              <span>Refresh Status</span>
            </button>

            <button type="button" className="btn-secondary btn-lg">
              <Download className="h-4 w-4" />
              <span>Export Results</span>
            </button>

            <button type="button" className="btn-secondary btn-lg">
              <SquareTerminal className="h-4 w-4" />
              <span>Open Diagnostics</span>
            </button>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="stat-label">Total Jobs</p>
          <p className="stat-value">{globalInsights.total}</p>
          <p className="stat-trend">All tracked runs in this console view</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Currently Running</p>
          <p className="stat-value">{globalInsights.running}</p>
          <p className="stat-trend">Active worker execution lanes</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Completed</p>
          <p className="stat-value">{globalInsights.completed}</p>
          <p className="stat-trend">Finished runs available for export</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Results Captured</p>
          <p className="stat-value">{formatCompact(globalInsights.totalResults)}</p>
          <p className="stat-trend">Records surfaced across visible jobs</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="page-header">
            <div>
              <p className="section-kicker">Filtering and control</p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                Search, segment, and inspect jobs quickly
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                This page is ready to bind to API-backed query params later, but already
                provides a strong operational interaction model.
              </p>
            </div>
          </div>

          <div className="mt-5 form-stack">
            <div className="form-grid">
              <div className="field sm:col-span-2">
                <label htmlFor="jobs-search" className="field-label">
                  Search jobs
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="jobs-search"
                    className="input pl-11"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by job ID, name, target, owner, or tag"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="status-filter" className="field-label">
                  Status
                </label>
                <select
                  id="status-filter"
                  className="select"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | JobStatus)
                  }
                >
                  <option value="all">All statuses</option>
                  <option value="queued">Queued</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="queue-filter" className="field-label">
                  Queue
                </label>
                <select
                  id="queue-filter"
                  className="select"
                  value={queueFilter}
                  onChange={(event) =>
                    setQueueFilter(event.target.value as "all" | QueueType)
                  }
                >
                  <option value="all">All queues</option>
                  <option value="redis">Redis</option>
                  <option value="priority">Priority</option>
                  <option value="bulk">Bulk</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="source-filter" className="field-label">
                  Source
                </label>
                <select
                  id="source-filter"
                  className="select"
                  value={sourceFilter}
                  onChange={(event) =>
                    setSourceFilter(event.target.value as "all" | SourceType)
                  }
                >
                  <option value="all">All sources</option>
                  <option value="crawler">Crawler</option>
                  <option value="directory">Directory</option>
                  <option value="api">API</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div className="field">
                <label className="field-label">Actions</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                      setQueueFilter("all");
                      setSourceFilter("all");
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="surface-card-muted p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Visible Jobs
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{insights.total}</p>
              </div>

              <div className="surface-card-muted p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Running
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{insights.running}</p>
              </div>

              <div className="surface-card-muted p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Queued
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{insights.queued}</p>
              </div>

              <div className="surface-card-muted p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Failed
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{insights.failed}</p>
              </div>

              <div className="surface-card-muted p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Results
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {formatCompact(insights.totalResults)}
                </p>
              </div>
            </div>
          </div>
        </article>

        <aside className="grid gap-4">
          <article className="surface-card p-5">
            <div className="card-header">
              <p className="section-kicker">Live activity</p>
              <h3 className="card-title">Primary execution lane</h3>
            </div>

            {activeRunningJob ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-[1.35rem] border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {activeRunningJob.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {activeRunningJob.id}
                      </p>
                    </div>
                    <span className="pill-primary">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Running
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Progress</span>
                      <span>{activeRunningJob.progress}%</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-white/10">
                      <div
                        className="h-2.5 rounded-full bg-cyan-400 transition-all duration-300"
                        style={{ width: `${activeRunningJob.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="surface-card-muted p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Results
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {formatCompact(activeRunningJob.results)}
                      </p>
                    </div>
                    <div className="surface-card-muted p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Duration
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {activeRunningJob.duration || "In progress"}
                      </p>
                    </div>
                  </div>
                </div>

                <Link href={`/jobs/${activeRunningJob.id}`} className="btn-secondary w-full">
                  <ArrowRight className="h-4 w-4" />
                  <span>Inspect Job</span>
                </Link>
              </div>
            ) : (
              <div className="empty-state mt-4">
                <Loader2 className="h-8 w-8 text-slate-500" />
                <p className="empty-title">No active running jobs</p>
                <p className="empty-copy">
                  Once a worker begins processing, this panel can surface live progress,
                  queue activity, and execution metadata.
                </p>
              </div>
            )}
          </article>

          <article className="surface-card p-5">
            <div className="card-header">
              <p className="section-kicker">Attention required</p>
              <h3 className="card-title">Recent failure signal</h3>
            </div>

            {latestFailedJob ? (
              <div className="mt-4 rounded-[1.35rem] border border-red-400/20 bg-red-400/10 p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-red-300" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {latestFailedJob.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {latestFailedJob.id} • {latestFailedJob.duration || "No duration"}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      This panel is intended for surfaced alerts, retry recommendations,
                      and quick links into diagnostics once the backend error model is wired.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary btn-sm">
                    <RefreshCcw className="h-4 w-4" />
                    <span>Retry Job</span>
                  </button>
                  <Link href={`/jobs/${latestFailedJob.id}`} className="btn-secondary btn-sm">
                    <ExternalLink className="h-4 w-4" />
                    <span>Open Detail</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="alert-success mt-4">
                No recent failure signal is visible in the current job set.
              </div>
            )}
          </article>
        </aside>
      </section>

      <section className="data-card">
        <div className="data-card-header">
          <div>
            <p className="section-kicker">Job registry</p>
            <h2 className="data-card-title mt-1">Responsive operational jobs table</h2>
            <p className="mt-1 text-sm text-slate-400">
              Table view for desktop, card view for smaller screens, and strong visual hooks
              for eventual live API-backed data.
            </p>
          </div>

          <div className="data-card-tools">
            <button type="button" className="btn-secondary btn-sm">
              <Play className="h-4 w-4" />
              <span>Resume Selected</span>
            </button>
            <button type="button" className="btn-secondary btn-sm">
              <Download className="h-4 w-4" />
              <span>Export Visible</span>
            </button>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="empty-state m-4">
            <Search className="h-8 w-8 text-slate-500" />
            <p className="empty-title">No jobs matched your current filters</p>
            <p className="empty-copy">
              Adjust the search term or reset your filters to bring jobs back into view.
              This state is ready for backend-driven empty responses too.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setQueueFilter("all");
                  setSourceFilter("all");
                }}
              >
                <RefreshCcw className="h-4 w-4" />
                <span>Reset Filters</span>
              </button>
              <Link href="/jobs/new" className="btn-primary">
                <Plus className="h-4 w-4" />
                <span>Create Job</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden lg:block">
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Source</th>
                      <th>Queue</th>
                      <th>Progress</th>
                      <th>Results</th>
                      <th>Updated</th>
                      <th>Owner</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredJobs.map((job) => {
                      const status = getStatusStyles(job.status);
                      const StatusIcon = status.icon;

                      return (
                        <tr key={job.id}>
                          <td>
                            <div className="data-cell-wrap">
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
                                  <Activity className="h-4 w-4 text-cyan-300" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-white">{job.name}</p>
                                  <p className="mt-1 text-xs text-slate-400">{job.id}</p>
                                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                    {job.target}
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
                                  job.status === "running" && "animate-spin",
                                )}
                              />
                              {status.label}
                            </span>
                          </td>

                          <td>
                            <span className={getPriorityStyles(job.priority)}>
                              {job.priority}
                            </span>
                          </td>

                          <td className="capitalize text-slate-300">{job.source}</td>
                          <td className="capitalize text-slate-300">{job.queue}</td>

                          <td>
                            <div className="w-[160px]">
                              <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>{job.progress}%</span>
                                <span>{job.duration || "—"}</span>
                              </div>
                              <div className="mt-2 h-2 rounded-full bg-white/10">
                                <div
                                  className={cn("h-2 rounded-full", progressBarTone(job.status))}
                                  style={{ width: `${job.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td>{formatCompact(job.results)}</td>
                          <td>{formatDateTime(job.updatedAt)}</td>
                          <td>{job.owner}</td>

                          <td>
                            <div className="flex items-center gap-2">
                              <Link href={`/jobs/${job.id}`} className="btn-secondary btn-sm">
                                <ArrowRight className="h-4 w-4" />
                                <span>Open</span>
                              </Link>
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
              {filteredJobs.map((job) => {
                const status = getStatusStyles(job.status);
                const StatusIcon = status.icon;

                return (
                  <article key={job.id} className="surface-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-white">{job.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{job.id}</p>
                      </div>

                      <span className={status.pill}>
                        <StatusIcon
                          className={cn(
                            "h-3.5 w-3.5",
                            job.status === "running" && "animate-spin",
                          )}
                        />
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-400">{job.target}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={getPriorityStyles(job.priority)}>{job.priority}</span>
                      <span className="pill capitalize">{job.source}</span>
                      <span className="pill capitalize">{job.queue}</span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="surface-card-muted p-3">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Progress
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">{job.progress}%</p>
                        <div className="mt-2 h-2 rounded-full bg-white/10">
                          <div
                            className={cn("h-2 rounded-full", progressBarTone(job.status))}
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="surface-card-muted p-3">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Results
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {formatCompact(job.results)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Updated {formatDateTime(job.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <div className="text-xs text-slate-500">
                        <p>Owner: <span className="text-slate-300">{job.owner}</span></p>
                        <p>Env: <span className="text-slate-300">{job.environment}</span></p>
                      </div>

                      <Link href={`/jobs/${job.id}`} className="btn-secondary btn-sm">
                        <ArrowRight className="h-4 w-4" />
                        <span>Open</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Queue posture</p>
            <h3 className="card-title">Operational readiness snapshot</h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Queue layer
              </p>
              <p className="mt-2 text-sm font-semibold text-white">Redis-backed workers</p>
              <p className="mt-1 text-xs text-slate-400">
                Ready for Celery or equivalent async execution
              </p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                API surface
              </p>
              <p className="mt-2 text-sm font-semibold text-white">FastAPI jobs endpoints</p>
              <p className="mt-1 text-xs text-slate-400">
                Job create, list, detail, rerun, and export flows
              </p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Persistence
              </p>
              <p className="mt-2 text-sm font-semibold text-white">PostgreSQL state model</p>
              <p className="mt-1 text-xs text-slate-400">
                Jobs, logs, results, exports, and audit trail
              </p>
            </div>

            <div className="surface-card-muted p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                UX posture
              </p>
              <p className="mt-2 text-sm font-semibold text-white">Responsive and API-ready</p>
              <p className="mt-1 text-xs text-slate-400">
                Table + mobile card dual rendering model
              </p>
            </div>
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <div className="card-header">
            <p className="section-kicker">Next wiring steps</p>
            <h3 className="card-title">What this page is ready for next</h3>
          </div>

          <div className="mt-5 space-y-3">
            {[
              {
                icon: Clock3,
                title: "Live polling",
                text: "Bind filters and table refresh to real API responses and job status polling.",
              },
              {
                icon: Database,
                title: "Job detail drill-down",
                text: "Open job-specific logs, outputs, diagnostics, retries, and exports from each record.",
              },
              {
                icon: Download,
                title: "Export pipeline",
                text: "Wire visible and per-job export actions into CSV, XLSX, and JSON endpoints.",
              },
              {
                icon: Globe,
                title: "Site-aware tenancy",
                text: "Use host or environment settings later for workspace-aware branding and scoping.",
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
        </article>
      </section>
    </div>
  );
}