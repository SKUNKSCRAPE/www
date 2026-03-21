"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  Globe,
  Info,
  Layers3,
  Link2,
  Loader2,
  Play,
  Plus,
  Radar,
  RefreshCcw,
  Save,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Webhook,
  Workflow,
} from "lucide-react";

type JobPriority = "low" | "normal" | "high" | "critical";
type SourceType = "crawler" | "directory" | "api" | "manual";
type QueueType = "redis" | "priority" | "bulk";
type AuthMode = "none" | "basic" | "bearer" | "apikey";

type FormState = {
  jobName: string;
  description: string;
  target: string;
  sourceType: SourceType;
  queue: QueueType;
  priority: JobPriority;
  targetLeads: string;
  crawlDepth: number;
  environment: string;
  country: string;
  region: string;
  searchTerms: string;
  includeTerms: string;
  excludeTerms: string;
  tags: string[];
  scheduleEnabled: boolean;
  scheduleMode: "once" | "interval" | "cron";
  scheduleCron: string;
  scheduleIntervalMinutes: number;
  sendToWebhook: boolean;
  webhookUrl: string;
  saveExportCsv: boolean;
  saveExportJson: boolean;
  proxyEnabled: boolean;
  proxyPool: string;
  respectRobots: boolean;
  deduplicateDomains: boolean;
  followContactPages: boolean;
  maxConcurrency: number;
  timeoutSeconds: number;
  authMode: AuthMode;
  authUsername: string;
  authPassword: string;
  authBearerToken: string;
  authApiKeyName: string;
  authApiKeyValue: string;
  notes: string;
};

const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME?.trim() || "SkunkScrape Web Console";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://skunkscrape.com";

const APP_ENV =
  process.env.NEXT_PUBLIC_APP_ENV?.trim() ||
  (process.env.NODE_ENV === "production" ? "Production" : "Development");

const DEFAULT_WEBHOOK =
  process.env.NEXT_PUBLIC_DEFAULT_WEBHOOK_URL?.trim() || "";

const DEFAULT_PROXY_POOL =
  process.env.NEXT_PUBLIC_DEFAULT_PROXY_POOL?.trim() || "webshare-default";

const DEFAULT_CRON = "0 */6 * * *";

const ENVIRONMENT_OPTIONS = [
  APP_ENV,
  "Development",
  "Staging",
  "Production",
].filter((value, index, array) => array.indexOf(value) === index);

const COUNTRY_OPTIONS = [
  "South Africa",
  "Botswana",
  "Rwanda",
  "Cameroon",
  "Portugal",
  "Mexico",
  "Global",
];

const QUEUE_OPTIONS: Array<{ value: QueueType; label: string; hint: string }> = [
  { value: "redis", label: "Redis", hint: "Standard async queue for normal jobs" },
  { value: "priority", label: "Priority", hint: "Fast-lane queue for urgent workloads" },
  { value: "bulk", label: "Bulk", hint: "Throughput-oriented queue for large runs" },
];

const SOURCE_OPTIONS: Array<{ value: SourceType; label: string; hint: string }> = [
  { value: "crawler", label: "Crawler", hint: "URL-first crawling and extraction" },
  { value: "directory", label: "Directory", hint: "Directory, listing, or catalog sources" },
  { value: "api", label: "API", hint: "Partner API or authenticated endpoint" },
  { value: "manual", label: "Manual", hint: "Uploaded or operator-defined inputs" },
];

const PRIORITY_OPTIONS: Array<{
  value: JobPriority;
  label: string;
  hint: string;
}> = [
  { value: "low", label: "Low", hint: "Background or non-urgent" },
  { value: "normal", label: "Normal", hint: "Standard default" },
  { value: "high", label: "High", hint: "Time-sensitive workload" },
  { value: "critical", label: "Critical", hint: "Highest execution urgency" },
];

const TAG_SUGGESTIONS = [
  "lead-gen",
  "directory",
  "crawler",
  "priority",
  "b2b",
  "south-africa",
  "gauteng",
  "construction",
  "plumbing",
  "electricians",
  "compliance",
  "monitoring",
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function normaliseTags(input: string[]) {
  return [...new Set(input.map((tag) => tag.trim()).filter(Boolean))];
}

function getInitialState(): FormState {
  return {
    jobName: "",
    description: "",
    target: "",
    sourceType: "crawler",
    queue: "redis",
    priority: "normal",
    targetLeads: "1000",
    crawlDepth: 2,
    environment: APP_ENV,
    country: "South Africa",
    region: "",
    searchTerms: "",
    includeTerms: "",
    excludeTerms: "",
    tags: ["lead-gen"],
    scheduleEnabled: false,
    scheduleMode: "once",
    scheduleCron: DEFAULT_CRON,
    scheduleIntervalMinutes: 360,
    sendToWebhook: Boolean(DEFAULT_WEBHOOK),
    webhookUrl: DEFAULT_WEBHOOK,
    saveExportCsv: true,
    saveExportJson: true,
    proxyEnabled: true,
    proxyPool: DEFAULT_PROXY_POOL,
    respectRobots: true,
    deduplicateDomains: true,
    followContactPages: true,
    maxConcurrency: 12,
    timeoutSeconds: 15,
    authMode: "none",
    authUsername: "",
    authPassword: "",
    authBearerToken: "",
    authApiKeyName: "X-API-Key",
    authApiKeyValue: "",
    notes: "",
  };
}

function validateForm(state: FormState) {
  const errors: Partial<Record<keyof FormState | "form", string>> = {};

  if (!state.jobName.trim()) {
    errors.jobName = "Job name is required.";
  }

  if (!state.target.trim()) {
    errors.target = "Target URL, endpoint, or source reference is required.";
  }

  if (state.sourceType === "crawler" || state.sourceType === "api") {
    const looksLikeUrl =
      /^https?:\/\/.+/i.test(state.target.trim()) ||
      state.target.trim().startsWith("http://") ||
      state.target.trim().startsWith("https://");
    if (!looksLikeUrl) {
      errors.target = "For crawler or API jobs, use a valid URL beginning with http:// or https://.";
    }
  }

  if (state.sendToWebhook && !state.webhookUrl.trim()) {
    errors.webhookUrl = "Webhook URL is required when webhook delivery is enabled.";
  }

  if (state.sendToWebhook && state.webhookUrl.trim()) {
    const validWebhook = /^https?:\/\/.+/i.test(state.webhookUrl.trim());
    if (!validWebhook) {
      errors.webhookUrl = "Webhook URL must start with http:// or https://.";
    }
  }

  if (state.scheduleEnabled && state.scheduleMode === "cron" && !state.scheduleCron.trim()) {
    errors.scheduleCron = "Cron expression is required when cron scheduling is enabled.";
  }

  if (
    state.scheduleEnabled &&
    state.scheduleMode === "interval" &&
    (!Number.isFinite(state.scheduleIntervalMinutes) || state.scheduleIntervalMinutes <= 0)
  ) {
    errors.scheduleIntervalMinutes = "Interval must be greater than zero minutes.";
  }

  if (state.maxConcurrency < 1 || state.maxConcurrency > 100) {
    errors.maxConcurrency = "Max concurrency must be between 1 and 100.";
  }

  if (state.timeoutSeconds < 5 || state.timeoutSeconds > 300) {
    errors.timeoutSeconds = "Timeout must be between 5 and 300 seconds.";
  }

  if (state.authMode === "basic") {
    if (!state.authUsername.trim()) errors.authUsername = "Username is required for basic auth.";
    if (!state.authPassword.trim()) errors.authPassword = "Password is required for basic auth.";
  }

  if (state.authMode === "bearer" && !state.authBearerToken.trim()) {
    errors.authBearerToken = "Bearer token is required.";
  }

  if (state.authMode === "apikey") {
    if (!state.authApiKeyName.trim()) errors.authApiKeyName = "API key header name is required.";
    if (!state.authApiKeyValue.trim()) errors.authApiKeyValue = "API key value is required.";
  }

  return errors;
}

function buildRequestPreview(state: FormState) {
  const payload: Record<string, unknown> = {
    name: state.jobName.trim(),
    description: state.description.trim() || undefined,
    target: state.target.trim(),
    source_type: state.sourceType,
    queue: state.queue,
    priority: state.priority,
    environment: state.environment,
    geography: {
      country: state.country,
      region: state.region.trim() || undefined,
    },
    scraping: {
      crawl_depth: state.crawlDepth,
      target_leads: Number(state.targetLeads || 0) || undefined,
      search_terms: state.searchTerms
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      include_terms: state.includeTerms
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      exclude_terms: state.excludeTerms
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      proxy_enabled: state.proxyEnabled,
      proxy_pool: state.proxyEnabled ? state.proxyPool.trim() || undefined : undefined,
      respect_robots: state.respectRobots,
      deduplicate_domains: state.deduplicateDomains,
      follow_contact_pages: state.followContactPages,
      max_concurrency: state.maxConcurrency,
      timeout_seconds: state.timeoutSeconds,
    },
    auth:
      state.authMode === "none"
        ? undefined
        : state.authMode === "basic"
          ? {
              mode: "basic",
              username: state.authUsername.trim(),
              password: state.authPassword ? "********" : "",
            }
          : state.authMode === "bearer"
            ? {
                mode: "bearer",
                token: state.authBearerToken ? "********" : "",
              }
            : {
                mode: "apikey",
                header_name: state.authApiKeyName.trim(),
                header_value: state.authApiKeyValue ? "********" : "",
              },
    outputs: {
      webhook_enabled: state.sendToWebhook,
      webhook_url: state.sendToWebhook ? state.webhookUrl.trim() || undefined : undefined,
      export_csv: state.saveExportCsv,
      export_json: state.saveExportJson,
    },
    schedule: state.scheduleEnabled
      ? state.scheduleMode === "interval"
        ? {
            enabled: true,
            mode: "interval",
            interval_minutes: state.scheduleIntervalMinutes,
          }
        : state.scheduleMode === "cron"
          ? {
              enabled: true,
              mode: "cron",
              cron: state.scheduleCron.trim(),
            }
          : {
              enabled: true,
              mode: "once",
            }
      : {
          enabled: false,
        },
    tags: state.tags,
    notes: state.notes.trim() || undefined,
  };

  return JSON.stringify(payload, null, 2);
}

function StepPill({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
        active
          ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
          : "border-white/10 bg-white/[0.04] text-slate-400",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}

export default function NewJobPage() {
  const [state, setState] = React.useState<FormState>(getInitialState);
  const [tagInput, setTagInput] = React.useState("");
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof FormState | "form", string>>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isTestingConnection, setIsTestingConnection] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [draftSaved, setDraftSaved] = React.useState(false);

  const requestPreview = React.useMemo(() => buildRequestPreview(state), [state]);

  const completionScore = React.useMemo(() => {
    let score = 0;
    if (state.jobName.trim()) score += 15;
    if (state.target.trim()) score += 20;
    if (state.description.trim()) score += 10;
    if (state.tags.length > 0) score += 10;
    if (state.searchTerms.trim() || state.includeTerms.trim()) score += 10;
    if (state.sendToWebhook && state.webhookUrl.trim()) score += 10;
    if (state.scheduleEnabled) score += 10;
    if (state.proxyEnabled && state.proxyPool.trim()) score += 5;
    if (state.authMode !== "none") score += 10;
    return Math.min(score, 100);
  }, [state]);

  const estimatedProfile = React.useMemo(() => {
    if (state.priority === "critical" || state.queue === "priority") {
      return "Fast-lane execution profile";
    }
    if (state.queue === "bulk") {
      return "Bulk throughput profile";
    }
    if (state.sourceType === "api") {
      return "Authenticated API pull profile";
    }
    return "Standard async crawling profile";
  }, [state]);

  const onFieldChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
    setSubmitSuccess(false);
    setDraftSaved(false);
  };

  const addTag = (value: string) => {
    const next = value.trim();
    if (!next) return;
    onFieldChange("tags", normaliseTags([...state.tags, next]));
    setTagInput("");
  };

  const removeTag = (value: string) => {
    onFieldChange(
      "tags",
      state.tags.filter((tag) => tag !== value),
    );
  };

  const handleTagKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(tagInput);
    }
  };

  const applyPreset = (preset: "discovery" | "priority" | "safe") => {
    if (preset === "discovery") {
      setState((prev) => ({
        ...prev,
        sourceType: "crawler",
        queue: "bulk",
        priority: "normal",
        crawlDepth: 3,
        targetLeads: "5000",
        followContactPages: true,
        deduplicateDomains: true,
        proxyEnabled: true,
        maxConcurrency: 16,
        timeoutSeconds: 18,
        tags: normaliseTags([...prev.tags, "discovery"]),
      }));
      return;
    }

    if (preset === "priority") {
      setState((prev) => ({
        ...prev,
        queue: "priority",
        priority: "critical",
        targetLeads: "1000",
        maxConcurrency: 8,
        timeoutSeconds: 12,
        tags: normaliseTags([...prev.tags, "priority"]),
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      respectRobots: true,
      deduplicateDomains: true,
      followContactPages: true,
      proxyEnabled: true,
      queue: "redis",
      priority: "normal",
      maxConcurrency: 6,
      timeoutSeconds: 20,
      tags: normaliseTags([...prev.tags, "safe-mode"]),
    }));
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setSubmitSuccess(false);
    setErrors((prev) => ({ ...prev, form: undefined }));
  };

  const handleReset = () => {
    setState(getInitialState());
    setErrors({});
    setTagInput("");
    setSubmitSuccess(false);
    setDraftSaved(false);
  };

  const handleTestConnection = async () => {
    const baseErrors = validateForm(state);
    if (baseErrors.target || baseErrors.webhookUrl) {
      setErrors(baseErrors);
      return;
    }

    setIsTestingConnection(true);
    setSubmitSuccess(false);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsTestingConnection(false);
    setDraftSaved(false);
    setErrors((prev) => ({ ...prev, form: undefined }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm(state);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setDraftSaved(false);

    await new Promise((resolve) => setTimeout(resolve, 1600));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setErrors({});
  };

  const hasScheduleConfig =
    state.scheduleEnabled &&
    (state.scheduleMode === "cron"
      ? Boolean(state.scheduleCron.trim())
      : state.scheduleMode === "interval"
        ? state.scheduleIntervalMinutes > 0
        : true);

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

              <div className="pill-primary">
                <Sparkles className="h-4 w-4" />
                <span>New Job Builder</span>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Create a production-ready scrape job with scheduling, outputs, and controls.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Configure source targeting, queue priority, authentication, concurrency,
              webhook delivery, export handling, and operational behaviour from a single
              responsive job creation surface inside {APP_NAME}.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <StepPill icon={Globe} label={SITE_URL.replace(/^https?:\/\//, "")} active />
              <StepPill icon={Workflow} label="Queue aware" active />
              <StepPill icon={ShieldCheck} label="Operational controls" active />
              <StepPill icon={Webhook} label="Outputs and delivery" active />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px] xl:max-w-[420px]">
            <button type="button" className="btn-secondary btn-lg" onClick={() => applyPreset("discovery")}>
              <Search className="h-4 w-4" />
              <span>Discovery Preset</span>
            </button>

            <button type="button" className="btn-secondary btn-lg" onClick={() => applyPreset("priority")}>
              <Radar className="h-4 w-4" />
              <span>Priority Preset</span>
            </button>

            <button type="button" className="btn-secondary btn-lg" onClick={() => applyPreset("safe")}>
              <ShieldCheck className="h-4 w-4" />
              <span>Safe Mode Preset</span>
            </button>

            <button type="button" className="btn-secondary btn-lg" onClick={handleReset}>
              <RefreshCcw className="h-4 w-4" />
              <span>Reset Form</span>
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="surface-card p-5 sm:p-6">
            <div className="card-header">
              <p className="section-kicker">1. Job identity</p>
              <h2 className="card-title">Define the run and target context</h2>
              <p className="card-copy">
                Name the job clearly, assign target inputs, set geography, and capture the
                search logic that will guide the scrape.
              </p>
            </div>

            <div className="mt-5 form-stack">
              <div className="form-grid">
                <div className="field sm:col-span-2">
                  <label htmlFor="job-name" className="field-label">
                    Job name
                  </label>
                  <input
                    id="job-name"
                    className="input"
                    placeholder="Example: Gauteng Plumbers Lead Sweep"
                    value={state.jobName}
                    onChange={(event) => onFieldChange("jobName", event.target.value)}
                  />
                  {errors.jobName ? <p className="field-error">{errors.jobName}</p> : null}
                </div>

                <div className="field sm:col-span-2">
                  <label htmlFor="job-description" className="field-label">
                    Description
                  </label>
                  <textarea
                    id="job-description"
                    className="textarea"
                    placeholder="Summarise the business goal, intended output, or operational purpose of this run."
                    value={state.description}
                    onChange={(event) => onFieldChange("description", event.target.value)}
                  />
                </div>

                <div className="field sm:col-span-2">
                  <label htmlFor="job-target" className="field-label">
                    Target URL / endpoint / source reference
                  </label>
                  <input
                    id="job-target"
                    className="input"
                    placeholder="https://example.co.za/directory or Partner API endpoint"
                    value={state.target}
                    onChange={(event) => onFieldChange("target", event.target.value)}
                  />
                  <p className="field-help">
                    Use a valid URL for crawler and API-based jobs. Manual and directory jobs can
                    use a named source reference.
                  </p>
                  {errors.target ? <p className="field-error">{errors.target}</p> : null}
                </div>

                <div className="field">
                  <label htmlFor="source-type" className="field-label">
                    Source type
                  </label>
                  <select
                    id="source-type"
                    className="select"
                    value={state.sourceType}
                    onChange={(event) =>
                      onFieldChange("sourceType", event.target.value as SourceType)
                    }
                  >
                    {SOURCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="target-leads" className="field-label">
                    Target leads
                  </label>
                  <input
                    id="target-leads"
                    className="input"
                    inputMode="numeric"
                    placeholder="1000"
                    value={state.targetLeads}
                    onChange={(event) => onFieldChange("targetLeads", event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="country" className="field-label">
                    Country
                  </label>
                  <select
                    id="country"
                    className="select"
                    value={state.country}
                    onChange={(event) => onFieldChange("country", event.target.value)}
                  >
                    {COUNTRY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="region" className="field-label">
                    Region / province
                  </label>
                  <input
                    id="region"
                    className="input"
                    placeholder="Example: Gauteng"
                    value={state.region}
                    onChange={(event) => onFieldChange("region", event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="environment" className="field-label">
                    Environment
                  </label>
                  <select
                    id="environment"
                    className="select"
                    value={state.environment}
                    onChange={(event) => onFieldChange("environment", event.target.value)}
                  >
                    {ENVIRONMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="crawl-depth" className="field-label">
                    Crawl depth
                  </label>
                  <input
                    id="crawl-depth"
                    className="input"
                    type="number"
                    min={1}
                    max={10}
                    value={state.crawlDepth}
                    onChange={(event) =>
                      onFieldChange("crawlDepth", Number(event.target.value || 1))
                    }
                  />
                </div>

                <div className="field sm:col-span-2">
                  <label htmlFor="search-terms" className="field-label">
                    Search terms
                  </label>
                  <input
                    id="search-terms"
                    className="input"
                    placeholder="plumber, plumbing, emergency plumber"
                    value={state.searchTerms}
                    onChange={(event) => onFieldChange("searchTerms", event.target.value)}
                  />
                  <p className="field-help">
                    Comma-separated search terms used for discovery, filtering, or semantic targeting.
                  </p>
                </div>

                <div className="field">
                  <label htmlFor="include-terms" className="field-label">
                    Include terms
                  </label>
                  <input
                    id="include-terms"
                    className="input"
                    placeholder="contact, phone, whatsapp"
                    value={state.includeTerms}
                    onChange={(event) => onFieldChange("includeTerms", event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="exclude-terms" className="field-label">
                    Exclude terms
                  </label>
                  <input
                    id="exclude-terms"
                    className="input"
                    placeholder="directory spam, duplicate"
                    value={state.excludeTerms}
                    onChange={(event) => onFieldChange("excludeTerms", event.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="tag-input" className="field-label">
                  Tags
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="tag-input"
                    className="input"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => addTag(tagInput)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Tag</span>
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {state.tags.map((tag) => (
                    <span key={tag} className="pill-primary">
                      <span>{tag}</span>
                      <button
                        type="button"
                        className="rounded-full p-0.5 text-cyan-100 transition hover:bg-white/10"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove tag ${tag}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {TAG_SUGGESTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="pill"
                      onClick={() => addTag(tag)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="card-header">
              <p className="section-kicker">2. Queue and execution strategy</p>
              <h2 className="card-title">Tune how the job is processed</h2>
              <p className="card-copy">
                Choose the queue lane, set urgency, and define runtime behaviour for worker execution.
              </p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {QUEUE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFieldChange("queue", option.value)}
                  className={cn(
                    "rounded-[1.4rem] border p-4 text-left transition",
                    state.queue === option.value
                      ? "border-cyan-400/20 bg-cyan-400/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{option.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{option.hint}</p>
                    </div>
                    {state.queue === option.value ? (
                      <BadgeCheck className="h-5 w-5 text-cyan-300" />
                    ) : null}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-4">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFieldChange("priority", option.value)}
                  className={cn(
                    "rounded-[1.4rem] border p-4 text-left transition",
                    state.priority === option.value
                      ? "border-cyan-400/20 bg-cyan-400/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
                  )}
                >
                  <p className="text-sm font-semibold text-white">{option.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{option.hint}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 form-grid">
              <div className="field">
                <label htmlFor="max-concurrency" className="field-label">
                  Max concurrency
                </label>
                <input
                  id="max-concurrency"
                  className="input"
                  type="number"
                  min={1}
                  max={100}
                  value={state.maxConcurrency}
                  onChange={(event) =>
                    onFieldChange("maxConcurrency", Number(event.target.value || 1))
                  }
                />
                {errors.maxConcurrency ? (
                  <p className="field-error">{errors.maxConcurrency}</p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="timeout-seconds" className="field-label">
                  Timeout seconds
                </label>
                <input
                  id="timeout-seconds"
                  className="input"
                  type="number"
                  min={5}
                  max={300}
                  value={state.timeoutSeconds}
                  onChange={(event) =>
                    onFieldChange("timeoutSeconds", Number(event.target.value || 5))
                  }
                />
                {errors.timeoutSeconds ? (
                  <p className="field-error">{errors.timeoutSeconds}</p>
                ) : null}
              </div>

              <div className="field sm:col-span-2">
                <label className="field-label">Execution toggles</label>

                <div className="grid gap-3">
                  <div className="switch-row">
                    <div className="switch-copy">
                      <p className="switch-title">Respect robots.txt</p>
                      <p className="switch-description">
                        Preserve a safer crawl posture for compliant runs.
                      </p>
                    </div>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={state.respectRobots}
                      onChange={(event) => onFieldChange("respectRobots", event.target.checked)}
                    />
                  </div>

                  <div className="switch-row">
                    <div className="switch-copy">
                      <p className="switch-title">Deduplicate domains</p>
                      <p className="switch-description">
                        Collapse repeated host hits before result persistence.
                      </p>
                    </div>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={state.deduplicateDomains}
                      onChange={(event) =>
                        onFieldChange("deduplicateDomains", event.target.checked)
                      }
                    />
                  </div>

                  <div className="switch-row">
                    <div className="switch-copy">
                      <p className="switch-title">Follow contact pages</p>
                      <p className="switch-description">
                        Attempt secondary contact-page traversal for improved signal collection.
                      </p>
                    </div>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={state.followContactPages}
                      onChange={(event) =>
                        onFieldChange("followContactPages", event.target.checked)
                      }
                    />
                  </div>

                  <div className="switch-row">
                    <div className="switch-copy">
                      <p className="switch-title">Enable proxy routing</p>
                      <p className="switch-description">
                        Route requests through a configured proxy pool when required.
                      </p>
                    </div>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={state.proxyEnabled}
                      onChange={(event) => onFieldChange("proxyEnabled", event.target.checked)}
                    />
                  </div>

                  {state.proxyEnabled ? (
                    <div className="field">
                      <label htmlFor="proxy-pool" className="field-label">
                        Proxy pool name
                      </label>
                      <input
                        id="proxy-pool"
                        className="input"
                        placeholder="webshare-default"
                        value={state.proxyPool}
                        onChange={(event) => onFieldChange("proxyPool", event.target.value)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="card-header">
              <p className="section-kicker">3. Authentication and delivery</p>
              <h2 className="card-title">Secure inputs and define outputs</h2>
              <p className="card-copy">
                Configure API authentication, webhook delivery, export formats, and scheduling.
              </p>
            </div>

            <div className="mt-5 form-stack">
              <div className="field">
                <label htmlFor="auth-mode" className="field-label">
                  Authentication mode
                </label>
                <select
                  id="auth-mode"
                  className="select"
                  value={state.authMode}
                  onChange={(event) =>
                    onFieldChange("authMode", event.target.value as AuthMode)
                  }
                >
                  <option value="none">None</option>
                  <option value="basic">Basic auth</option>
                  <option value="bearer">Bearer token</option>
                  <option value="apikey">API key</option>
                </select>
              </div>

              {state.authMode === "basic" ? (
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="auth-username" className="field-label">
                      Username
                    </label>
                    <input
                      id="auth-username"
                      className="input"
                      value={state.authUsername}
                      onChange={(event) => onFieldChange("authUsername", event.target.value)}
                    />
                    {errors.authUsername ? (
                      <p className="field-error">{errors.authUsername}</p>
                    ) : null}
                  </div>

                  <div className="field">
                    <label htmlFor="auth-password" className="field-label">
                      Password
                    </label>
                    <input
                      id="auth-password"
                      className="input"
                      type="password"
                      value={state.authPassword}
                      onChange={(event) => onFieldChange("authPassword", event.target.value)}
                    />
                    {errors.authPassword ? (
                      <p className="field-error">{errors.authPassword}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {state.authMode === "bearer" ? (
                <div className="field">
                  <label htmlFor="auth-bearer" className="field-label">
                    Bearer token
                  </label>
                  <input
                    id="auth-bearer"
                    className="input"
                    type="password"
                    value={state.authBearerToken}
                    onChange={(event) => onFieldChange("authBearerToken", event.target.value)}
                  />
                  {errors.authBearerToken ? (
                    <p className="field-error">{errors.authBearerToken}</p>
                  ) : null}
                </div>
              ) : null}

              {state.authMode === "apikey" ? (
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="api-key-name" className="field-label">
                      Header name
                    </label>
                    <input
                      id="api-key-name"
                      className="input"
                      value={state.authApiKeyName}
                      onChange={(event) => onFieldChange("authApiKeyName", event.target.value)}
                    />
                    {errors.authApiKeyName ? (
                      <p className="field-error">{errors.authApiKeyName}</p>
                    ) : null}
                  </div>

                  <div className="field">
                    <label htmlFor="api-key-value" className="field-label">
                      API key value
                    </label>
                    <input
                      id="api-key-value"
                      className="input"
                      type="password"
                      value={state.authApiKeyValue}
                      onChange={(event) => onFieldChange("authApiKeyValue", event.target.value)}
                    />
                    {errors.authApiKeyValue ? (
                      <p className="field-error">{errors.authApiKeyValue}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3">
                <div className="switch-row">
                  <div className="switch-copy">
                    <p className="switch-title">Send results to webhook</p>
                    <p className="switch-description">
                      Trigger downstream automation as soon as the job completes.
                    </p>
                  </div>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={state.sendToWebhook}
                    onChange={(event) => onFieldChange("sendToWebhook", event.target.checked)}
                  />
                </div>

                {state.sendToWebhook ? (
                  <div className="field">
                    <label htmlFor="webhook-url" className="field-label">
                      Webhook URL
                    </label>
                    <input
                      id="webhook-url"
                      className="input"
                      placeholder="https://hooks.example.com/skunkscrape"
                      value={state.webhookUrl}
                      onChange={(event) => onFieldChange("webhookUrl", event.target.value)}
                    />
                    {errors.webhookUrl ? (
                      <p className="field-error">{errors.webhookUrl}</p>
                    ) : null}
                  </div>
                ) : null}

                <div className="switch-row">
                  <div className="switch-copy">
                    <p className="switch-title">Export CSV</p>
                    <p className="switch-description">
                      Persist a CSV export after the run completes.
                    </p>
                  </div>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={state.saveExportCsv}
                    onChange={(event) => onFieldChange("saveExportCsv", event.target.checked)}
                  />
                </div>

                <div className="switch-row">
                  <div className="switch-copy">
                    <p className="switch-title">Export JSON</p>
                    <p className="switch-description">
                      Persist a structured JSON export for API or pipeline consumption.
                    </p>
                  </div>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={state.saveExportJson}
                    onChange={(event) => onFieldChange("saveExportJson", event.target.checked)}
                  />
                </div>

                <div className="switch-row">
                  <div className="switch-copy">
                    <p className="switch-title">Enable scheduling</p>
                    <p className="switch-description">
                      Convert this into a recurring or timed execution workflow.
                    </p>
                  </div>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={state.scheduleEnabled}
                    onChange={(event) => onFieldChange("scheduleEnabled", event.target.checked)}
                  />
                </div>

                {state.scheduleEnabled ? (
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="schedule-mode" className="field-label">
                        Schedule mode
                      </label>
                      <select
                        id="schedule-mode"
                        className="select"
                        value={state.scheduleMode}
                        onChange={(event) =>
                          onFieldChange(
                            "scheduleMode",
                            event.target.value as FormState["scheduleMode"],
                          )
                        }
                      >
                        <option value="once">Run once</option>
                        <option value="interval">Interval</option>
                        <option value="cron">Cron</option>
                      </select>
                    </div>

                    {state.scheduleMode === "interval" ? (
                      <div className="field">
                        <label htmlFor="schedule-interval" className="field-label">
                          Interval minutes
                        </label>
                        <input
                          id="schedule-interval"
                          className="input"
                          type="number"
                          min={1}
                          value={state.scheduleIntervalMinutes}
                          onChange={(event) =>
                            onFieldChange(
                              "scheduleIntervalMinutes",
                              Number(event.target.value || 1),
                            )
                          }
                        />
                        {errors.scheduleIntervalMinutes ? (
                          <p className="field-error">{errors.scheduleIntervalMinutes}</p>
                        ) : null}
                      </div>
                    ) : null}

                    {state.scheduleMode === "cron" ? (
                      <div className="field sm:col-span-2">
                        <label htmlFor="schedule-cron" className="field-label">
                          Cron expression
                        </label>
                        <input
                          id="schedule-cron"
                          className="input"
                          placeholder="0 */6 * * *"
                          value={state.scheduleCron}
                          onChange={(event) => onFieldChange("scheduleCron", event.target.value)}
                        />
                        <p className="field-help">
                          Example: <code>0 */6 * * *</code> runs every 6 hours.
                        </p>
                        {errors.scheduleCron ? (
                          <p className="field-error">{errors.scheduleCron}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="job-notes" className="field-label">
                  Operator notes
                </label>
                <textarea
                  id="job-notes"
                  className="textarea"
                  placeholder="Capture internal context, client constraints, compliance notes, or follow-up tasks."
                  value={state.notes}
                  onChange={(event) => onFieldChange("notes", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="card-header">
              <p className="section-kicker">4. Submit actions</p>
              <h2 className="card-title">Validate, save, test, and launch</h2>
              <p className="card-copy">
                This section is ready to wire into FastAPI job creation and worker queue dispatch.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {errors.form ? <div className="alert-danger">{errors.form}</div> : null}
              {submitSuccess ? (
                <div className="alert-success">
                  Job configuration passed validation and is ready to submit to the backend queue.
                </div>
              ) : null}
              {draftSaved ? (
                <div className="alert-info">
                  Draft state saved locally in the page session. Persist this later to your API or database.
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleSaveDraft}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  <span>{isTestingConnection ? "Testing..." : "Test Connection"}</span>
                </button>

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span>{isSubmitting ? "Submitting..." : "Create Job"}</span>
                </button>
              </div>
            </div>
          </section>
        </form>

        <aside className="space-y-6">
          <section className="surface-card p-5 sm:p-6">
            <div className="card-header">
              <p className="section-kicker">Build summary</p>
              <h2 className="card-title">Job readiness and execution profile</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="surface-card-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Completion
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">{completionScore}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
                    {estimatedProfile}
                  </div>
                </div>

                <div className="mt-3 h-2.5 rounded-full bg-white/10">
                  <div
                    className="h-2.5 rounded-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${completionScore}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="surface-card-muted p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Source type
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white capitalize">
                    {state.sourceType}
                  </p>
                </div>

                <div className="surface-card-muted p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Queue lane
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white capitalize">
                    {state.queue}
                  </p>
                </div>

                <div className="surface-card-muted p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Priority
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white capitalize">
                    {state.priority}
                  </p>
                </div>

                <div className="surface-card-muted p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Environment
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {state.environment}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Operational signals</p>

                <div className="mt-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <Bot className="mt-0.5 h-4 w-4 text-cyan-300" />
                    <div>
                      <p className="text-sm text-slate-300">
                        Target reference:
                        <span className="ml-2 text-white">
                          {state.target.trim() || "Not yet defined"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Database className="mt-0.5 h-4 w-4 text-cyan-300" />
                    <div>
                      <p className="text-sm text-slate-300">
                        Export posture:
                        <span className="ml-2 text-white">
                          {[
                            state.saveExportCsv ? "CSV" : null,
                            state.saveExportJson ? "JSON" : null,
                          ]
                            .filter(Boolean)
                            .join(" + ") || "No exports selected"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Webhook className="mt-0.5 h-4 w-4 text-cyan-300" />
                    <div>
                      <p className="text-sm text-slate-300">
                        Delivery:
                        <span className="ml-2 text-white">
                          {state.sendToWebhook
                            ? state.webhookUrl.trim() || "Webhook enabled, URL pending"
                            : "Webhook disabled"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarClock className="mt-0.5 h-4 w-4 text-cyan-300" />
                    <div>
                      <p className="text-sm text-slate-300">
                        Schedule:
                        <span className="ml-2 text-white">
                          {state.scheduleEnabled
                            ? state.scheduleMode === "cron"
                              ? `Cron • ${state.scheduleCron || "pending"}`
                              : state.scheduleMode === "interval"
                                ? `Every ${state.scheduleIntervalMinutes} min`
                                : "Single scheduled run"
                            : "Run on demand"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!hasScheduleConfig && state.scheduleEnabled ? (
                <div className="alert-warning">
                  Scheduling is enabled but the schedule configuration is incomplete.
                </div>
              ) : null}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="card-header">
              <p className="section-kicker">Request preview</p>
              <h2 className="card-title">API-ready payload model</h2>
              <p className="card-copy">
                Use this preview when wiring the page to your FastAPI job creation endpoint.
              </p>
            </div>

            <div className="mt-5">
              <pre className="max-h-[520px] overflow-auto text-xs leading-6">
                <code>{requestPreview}</code>
              </pre>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="card-header">
              <p className="section-kicker">Implementation notes</p>
              <h2 className="card-title">What this route is ready for next</h2>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  icon: Settings2,
                  title: "POST /api/jobs integration",
                  text: "Submit the validated payload to FastAPI and create a persisted job record.",
                },
                {
                  icon: Send,
                  title: "Queue dispatch",
                  text: "Hand the created job to Redis/Celery or your worker abstraction for execution.",
                },
                {
                  icon: Layers3,
                  title: "Draft persistence",
                  text: "Persist drafts server-side per user or workspace instead of only local state.",
                },
                {
                  icon: CheckCircle2,
                  title: "Validation hardening",
                  text: "Replace UI-only validation with shared schema validation using Zod or Pydantic-aligned contracts.",
                },
                {
                  icon: Clock3,
                  title: "Scheduler binding",
                  text: "Map cron and interval settings into APScheduler, Celery Beat, or your preferred runtime.",
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

            <div className="mt-5 rounded-[1.25rem] border border-amber-400/20 bg-amber-400/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Operational reminder</p>
                  <p className="mt-1 text-sm leading-7 text-slate-300">
                    This page is intentionally interactive and production-lean. It is ready to
                    connect to your backend, but does not yet submit to a live API in its current form.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/jobs" className="btn-secondary btn-sm">
                <ChevronRight className="h-4 w-4" />
                <span>View Jobs</span>
              </Link>
              <button type="button" className="btn-secondary btn-sm" onClick={handleReset}>
                <RefreshCcw className="h-4 w-4" />
                <span>Clear Form</span>
              </button>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="card-header">
              <p className="section-kicker">Context and guidance</p>
              <h2 className="card-title">Operator help</h2>
            </div>

            <div className="mt-5 space-y-3">
              <div className="alert-info">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-4 w-4" />
                  <p>
                    Use <strong>Priority</strong> queueing for urgent customer delivery, and
                    <strong> Bulk</strong> for large-volume discovery where throughput matters more
                    than speed.
                  </p>
                </div>
              </div>

              <div className="alert-info">
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-4 w-4" />
                  <p>
                    Keep jobs site-aware by aligning target geography, source type, and host-specific
                    routing with the deployment environment.
                  </p>
                </div>
              </div>

              <div className="alert-info">
                <div className="flex items-start gap-3">
                  <Search className="mt-0.5 h-4 w-4" />
                  <p>
                    Combine search terms with include/exclude logic to reduce weak signals before
                    they reach your persistence and export layers.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}