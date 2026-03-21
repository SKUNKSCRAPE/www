"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  DatabaseZap,
  Globe2,
  LifeBuoy,
  Menu,
  Plus,
  Sparkles,
} from "lucide-react";

import AppHeader from "../../components/layout/app-header";
import AppSidebar, {
  type AppSidebarMetric,
  type AppSidebarSection,
} from "../../components/layout/app-sidebar";

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "https://skunkscrape.com";

  try {
    return new URL(
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `https://${raw}`,
    );
  } catch {
    return new URL("https://skunkscrape.com");
  }
}

function getEnvironmentLabel() {
  const explicit =
    process.env.NEXT_PUBLIC_APP_ENV?.trim() ||
    process.env.APP_ENV?.trim() ||
    "";

  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production") return "Production";
  if (process.env.NODE_ENV === "development") return "Development";
  return "Environment";
}

function getEnvironmentTone(
  value: string,
): "neutral" | "dev" | "staging" | "prod" {
  const normalized = value.toLowerCase();

  if (normalized.includes("prod")) return "prod";
  if (normalized.includes("stag")) return "staging";
  if (normalized.includes("dev") || normalized.includes("local")) return "dev";

  return "neutral";
}

function getStatusTone(
  value: string,
): "idle" | "running" | "success" | "warning" | "danger" {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("error") ||
    normalized.includes("down") ||
    normalized.includes("failed") ||
    normalized.includes("critical")
  ) {
    return "danger";
  }

  if (
    normalized.includes("warn") ||
    normalized.includes("degraded") ||
    normalized.includes("attention")
  ) {
    return "warning";
  }

  if (
    normalized.includes("run") ||
    normalized.includes("processing") ||
    normalized.includes("active")
  ) {
    return "running";
  }

  if (
    normalized.includes("healthy") ||
    normalized.includes("ready") ||
    normalized.includes("operational") ||
    normalized.includes("ok")
  ) {
    return "success";
  }

  return "idle";
}

function buildSidebarSections(): AppSidebarSection[] {
  return [
    {
      title: "Overview",
      defaultOpen: true,
      items: [
        {
          label: "Console Home",
          href: "/",
          exact: true,
          description: "Public landing route and platform entry",
        },
        {
          label: "Jobs",
          href: "/jobs",
          description: "Queued scrape execution and history",
        },
        {
          label: "New Job",
          href: "/jobs/new",
          exact: true,
          description: "Launch a new scrape workflow",
        },
      ],
    },
    {
      title: "Operations",
      defaultOpen: true,
      items: [
        {
          label: "Sources",
          href: "/sources",
          description: "Targets, discovery, and source visibility",
        },
        {
          label: "Projects",
          href: "/projects",
          description: "Organise runs and result ownership",
        },
        {
          label: "Integrations",
          href: "/integrations",
          description: "Webhooks, exports, and downstream systems",
        },
      ],
    },
    {
      title: "Administration",
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          label: "Monitoring",
          href: "/monitoring",
          description: "Health, queue activity, and diagnostics",
        },
        {
          label: "Settings",
          href: "/settings",
          description: "Platform, workspace, and runtime controls",
        },
        {
          label: "Security",
          href: "/security",
          description: "Authentication, roles, and policy boundaries",
        },
      ],
    },
  ];
}

function buildSidebarMetrics(siteHost: string): AppSidebarMetric[] {
  return [
    {
      label: "Site",
      value: siteHost,
      hint: "Resolved from environment",
      tone: "info",
    },
    {
      label: "Queue",
      value: "Redis",
      hint: "Async execution layer",
      tone: "neutral",
    },
    {
      label: "State",
      value: "PostgreSQL",
      hint: "Persistent platform state",
      tone: "neutral",
    },
    {
      label: "API",
      value: "FastAPI",
      hint: "Typed service layer",
      tone: "success",
    },
  ];
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const siteUrl = React.useMemo(() => getSiteUrl(), []);
  const appName =
    process.env.NEXT_PUBLIC_APP_NAME?.trim() || "SkunkScrape Web Console";
  const environmentLabel = getEnvironmentLabel();
  const environmentTone = getEnvironmentTone(environmentLabel);

  const platformStatus =
    process.env.NEXT_PUBLIC_PLATFORM_STATUS?.trim() || "Operational";
  const platformStatusTone = getStatusTone(platformStatus);

  const supportHref =
    process.env.NEXT_PUBLIC_SUPPORT_URL?.trim() || "/support";
  const docsHref =
    process.env.NEXT_PUBLIC_DOCS_URL?.trim() || "/docs";

  const sidebarSections = React.useMemo(() => buildSidebarSections(), []);
  const sidebarMetrics = React.useMemo(
    () => buildSidebarMetrics(siteUrl.host),
    [siteUrl.host],
  );

  return (
    <div className="page-shell">
      <div className="container-shell py-4 sm:py-5 lg:py-6">
        <div className="app-grid">
          <AppSidebar
            sections={sidebarSections}
            metrics={sidebarMetrics}
            mobileOpen={mobileSidebarOpen}
            onMobileOpenChange={setMobileSidebarOpen}
            brandName={appName}
            brandHref="/"
            workspaceLabel="SkunkScrape Control Plane"
            workspaceSubLabel={siteUrl.host}
            statusLabel={platformStatus}
            statusTone={platformStatusTone}
            supportHref={supportHref}
            commandHref="/jobs/new"
            footerLinks={[
              { label: "Docs", href: docsHref, external: false },
              { label: "Support", href: supportHref, external: false },
            ]}
            user={{
              name: "Platform Operator",
              role: "Operations Console",
              email:
                process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
                "ops@skunkscrape.com",
              href: "/profile",
            }}
          />

          <div className="content-shell min-w-0">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              <div className="lg:hidden">
                <div className="surface-card p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                        Console shell
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">
                        {appName}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {siteUrl.host}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Open navigation"
                      aria-expanded={mobileSidebarOpen}
                      onClick={() => setMobileSidebarOpen(true)}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-white"
                    >
                      <Menu className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href="/jobs/new" className="btn-primary btn-sm">
                      <Plus className="h-4 w-4" />
                      <span>New Job</span>
                    </Link>

                    <Link href="/jobs" className="btn-secondary btn-sm">
                      <Activity className="h-4 w-4" />
                      <span>View Jobs</span>
                    </Link>
                  </div>
                </div>
              </div>

              <AppHeader
                description="Shared application shell for queued scraping, operational visibility, exports, and platform administration."
                navItems={[
                  { label: "Jobs", href: "/jobs" },
                  { label: "New Job", href: "/jobs/new", exact: true },
                  { label: "Sources", href: "/sources" },
                  { label: "Monitoring", href: "/monitoring" },
                  { label: "Settings", href: "/settings" },
                ]}
                metrics={[
                  {
                    label: "Environment",
                    value: environmentLabel,
                    hint: "Runtime target",
                  },
                  {
                    label: "Host",
                    value: siteUrl.host,
                    hint: "Site-aware shell",
                  },
                  {
                    label: "Queue",
                    value: "Redis",
                    hint: "Background jobs",
                  },
                  {
                    label: "Persistence",
                    value: "PostgreSQL",
                    hint: "Durable state",
                  },
                ]}
                statusLabel={platformStatus}
                statusTone={platformStatusTone}
                environmentLabel={environmentLabel}
                environmentTone={environmentTone}
                actions={[
                  {
                    label: "Documentation",
                    href: docsHref,
                    icon: LifeBuoy,
                    variant: "ghost",
                  },
                  {
                    label: "Health",
                    href: "/monitoring",
                    icon: DatabaseZap,
                    variant: "secondary",
                  },
                  {
                    label: "New Job",
                    href: "/jobs/new",
                    icon: Sparkles,
                    variant: "primary",
                  },
                ]}
              />

              <section
                className="min-w-0"
                aria-label="Dashboard content area"
              >
                {children}
              </section>

              <div className="surface-card p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                      Platform shell
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">
                      Responsive dashboard framework active
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
                      This layout wires the sidebar, header, mobile navigation, quick
                      actions, environment awareness, and operational framing for all
                      routes inside your dashboard group.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href="/jobs" className="btn-secondary btn-sm">
                      <Activity className="h-4 w-4" />
                      <span>Jobs</span>
                    </Link>
                    <Link href={supportHref} className="btn-secondary btn-sm">
                      <LifeBuoy className="h-4 w-4" />
                      <span>Support</span>
                    </Link>
                    <Link href="/jobs/new" className="btn-primary btn-sm">
                      <Plus className="h-4 w-4" />
                      <span>Create Job</span>
                    </Link>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="surface-card-muted p-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      Site awareness
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {siteUrl.host}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Pulled from configured site URL
                    </p>
                  </div>

                  <div className="surface-card-muted p-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      Runtime
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {environmentLabel}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Environment-sensitive console shell
                    </p>
                  </div>

                  <div className="surface-card-muted p-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      Background jobs
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">Redis queue</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Ready for async scrape execution
                    </p>
                  </div>

                  <div className="surface-card-muted p-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      Data layer
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      FastAPI + PostgreSQL
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Durable operational platform foundation
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="pill">Responsive layout</span>
                  <span className="pill">Mobile drawer</span>
                  <span className="pill">Route-aware navigation</span>
                  <span className="pill">Operational header</span>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4 text-xs text-slate-500">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                      SkunkScrape dashboard shell is ready for pages like{" "}
                      <span className="text-slate-300">/jobs</span>,{" "}
                      <span className="text-slate-300">/jobs/new</span>,{" "}
                      <span className="text-slate-300">/sources</span>, and{" "}
                      <span className="text-slate-300">/monitoring</span>.
                    </p>

                    <div className="flex items-center gap-3">
                      <Link
                        href={docsHref}
                        className="text-slate-400 transition hover:text-white"
                      >
                        Documentation
                      </Link>
                      <Link
                        href={supportHref}
                        className="text-slate-400 transition hover:text-white"
                      >
                        Support
                      </Link>
                      <Link
                        href="/jobs/new"
                        className="text-cyan-300 transition hover:text-cyan-200"
                      >
                        Launch Job
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}