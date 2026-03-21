"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Command,
  Database,
  FolderKanban,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PlugZap,
  Settings,
  ShieldCheck,
  Sparkles,
  User2,
  Workflow,
  X,
} from "lucide-react";

type SidebarIcon = React.ComponentType<{ className?: string }>;

export type AppSidebarItem = {
  label: string;
  href: string;
  icon?: SidebarIcon;
  badge?: string | number;
  exact?: boolean;
  external?: boolean;
  disabled?: boolean;
  description?: string;
};

export type AppSidebarSection = {
  title: string;
  items: AppSidebarItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export type AppSidebarMetric = {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

export type AppSidebarUser = {
  name: string;
  role?: string;
  email?: string;
  avatarText?: string;
  href?: string;
};

export type AppSidebarFooterLink = {
  label: string;
  href: string;
  icon?: SidebarIcon;
  external?: boolean;
};

type AppSidebarProps = {
  sections?: AppSidebarSection[];
  metrics?: AppSidebarMetric[];
  user?: AppSidebarUser;
  footerLinks?: AppSidebarFooterLink[];
  workspaceLabel?: string;
  workspaceSubLabel?: string;
  statusLabel?: string;
  statusTone?: "idle" | "running" | "success" | "warning" | "danger";
  brandName?: string;
  brandHref?: string;
  supportHref?: string;
  commandHref?: string;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  defaultCollapsed?: boolean;
  storageKey?: string;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "https://skunkscrape.com";

  try {
    return new URL(raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`);
  } catch {
    return new URL("https://skunkscrape.com");
  }
}

function getBrandName() {
  return process.env.NEXT_PUBLIC_APP_NAME?.trim() || "SkunkScrape Web Console";
}

function titleCase(input: string) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferWorkspaceLabel() {
  const host = getBaseUrl().host;
  const segments = host.split(".");
  if (segments.length >= 2) {
    return titleCase(segments[0]);
  }
  return "Primary Workspace";
}

function inferWorkspaceSubLabel() {
  return getBaseUrl().host;
}

function isActivePath(currentPath: string, href: string, exact?: boolean) {
  if (exact) return currentPath === href;
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function metricToneClasses(tone: AppSidebarMetric["tone"] = "neutral") {
  switch (tone) {
    case "success":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
    case "warning":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";
    case "danger":
      return "border-red-400/20 bg-red-400/10 text-red-200";
    case "info":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
    default:
      return "border-white/10 bg-white/[0.04] text-slate-300";
  }
}

function statusToneClasses(tone: AppSidebarProps["statusTone"] = "idle") {
  switch (tone) {
    case "running":
      return {
        badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
        dot: "bg-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.12)]",
      };
    case "success":
      return {
        badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
        dot: "bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]",
      };
    case "warning":
      return {
        badge: "border-amber-400/20 bg-amber-400/10 text-amber-200",
        dot: "bg-amber-400 shadow-[0_0_0_4px_rgba(245,158,11,0.12)]",
      };
    case "danger":
      return {
        badge: "border-red-400/20 bg-red-400/10 text-red-200",
        dot: "bg-red-400 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]",
      };
    default:
      return {
        badge: "border-white/10 bg-white/[0.04] text-slate-300",
        dot: "bg-slate-500 shadow-[0_0_0_4px_rgba(100,116,139,0.12)]",
      };
  }
}

function createDefaultSections(): AppSidebarSection[] {
  return [
    {
      title: "Overview",
      defaultOpen: true,
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          description: "Operational overview and live activity",
        },
        {
          label: "Jobs",
          href: "/jobs",
          icon: Workflow,
          description: "View and manage scrape jobs",
        },
        {
          label: "New Job",
          href: "/jobs/new",
          icon: Sparkles,
          exact: true,
          description: "Launch a new job configuration",
        },
      ],
    },
    {
      title: "Operations",
      defaultOpen: true,
      items: [
        {
          label: "Projects",
          href: "/projects",
          icon: FolderKanban,
          description: "Organise jobs and targets by project",
        },
        {
          label: "Data Sources",
          href: "/sources",
          icon: Database,
          description: "Inspect source coverage and targets",
        },
        {
          label: "Integrations",
          href: "/integrations",
          icon: PlugZap,
          description: "Webhooks, APIs, and downstream systems",
        },
      ],
    },
    {
      title: "Administration",
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          label: "Security",
          href: "/security",
          icon: ShieldCheck,
          description: "Auth, roles, and platform controls",
        },
        {
          label: "Settings",
          href: "/settings",
          icon: Settings,
          description: "Platform and workspace configuration",
        },
        {
          label: "Support",
          href: "/support",
          icon: LifeBuoy,
          description: "Guidance, support, and documentation",
        },
      ],
    },
  ];
}

function initialsFromName(user?: AppSidebarUser) {
  const value = user?.avatarText?.trim() || user?.name?.trim() || "SS";
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function SidebarContent({
  pathname,
  collapsed,
  onToggleCollapsed,
  sections,
  metrics,
  user,
  footerLinks,
  workspaceLabel,
  workspaceSubLabel,
  statusLabel,
  statusTone,
  brandName,
  brandHref,
  supportHref,
  commandHref,
  onNavigate,
}: {
  pathname: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  sections: AppSidebarSection[];
  metrics: AppSidebarMetric[];
  user?: AppSidebarUser;
  footerLinks: AppSidebarFooterLink[];
  workspaceLabel: string;
  workspaceSubLabel: string;
  statusLabel: string;
  statusTone: NonNullable<AppSidebarProps["statusTone"]>;
  brandName: string;
  brandHref: string;
  supportHref: string;
  commandHref: string;
  onNavigate?: () => void;
}) {
  const siteUrl = getBaseUrl();
  const statusClasses = statusToneClasses(statusTone);

  const [sectionState, setSectionState] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const section of sections) {
      initial[section.title] = section.defaultOpen ?? true;
    }
    return initial;
  });

  React.useEffect(() => {
    const updated: Record<string, boolean> = {};
    for (const section of sections) {
      updated[section.title] =
        sectionState[section.title] ?? (section.defaultOpen ?? true);
    }
    setSectionState(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.map((s) => s.title).join("|")]);

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        collapsed ? "items-stretch" : "",
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-4">
        <Link
          href={brandHref}
          onClick={onNavigate}
          className={cn(
            "group flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-400/30 hover:bg-white/[0.08]",
            collapsed && "justify-center px-2",
          )}
          aria-label={`${brandName} home`}
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-300 to-fuchsia-300 text-slate-950 shadow-lg">
            <Command className="h-5 w-5" />
          </span>

          {!collapsed ? (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-white">
                {brandName}
              </span>
              <span className="block truncate text-xs text-slate-400">
                {siteUrl.host}
              </span>
            </span>
          ) : null}
        </Link>

        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggleCollapsed}
          className="hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-white lg:inline-flex"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <div className="px-4">
        <div
          className={cn(
            "rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4",
            collapsed && "px-3 py-3",
          )}
        >
          <div className={cn("flex items-start gap-3", collapsed && "justify-center")}>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
              <Globe className="h-4 w-4" />
            </span>

            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Workspace
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-white">{workspaceLabel}</p>
                <p className="truncate text-xs text-slate-400">{workspaceSubLabel}</p>
              </div>
            ) : null}
          </div>

          {!collapsed ? (
            <div
              className={cn(
                "mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
                statusClasses.badge,
              )}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full", statusClasses.dot)} />
              <span>{statusLabel}</span>
            </div>
          ) : null}
        </div>

        {!collapsed ? (
          <Link
            href={commandHref}
            onClick={onNavigate}
            className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Quick command
            </span>
            <span className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-slate-400">
              Ctrl K
            </span>
          </Link>
        ) : null}
      </div>

      {metrics.length > 0 ? (
        <div className="px-4 pt-4">
          <div className={cn("grid gap-2", collapsed ? "grid-cols-1" : "grid-cols-1")}>
            {metrics.map((metric) => (
              <div
                key={`${metric.label}-${metric.value}`}
                className={cn(
                  "rounded-2xl border px-3 py-3",
                  metricToneClasses(metric.tone),
                  collapsed && "flex items-center justify-center px-2 py-2",
                )}
                title={collapsed ? `${metric.label}: ${metric.value}` : undefined}
              >
                {collapsed ? (
                  <span className="text-xs font-semibold">{metric.value}</span>
                ) : (
                  <>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em]">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{metric.value}</p>
                    {metric.hint ? <p className="mt-0.5 text-xs opacity-80">{metric.hint}</p> : null}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-4">
        <nav aria-label="Primary sidebar navigation" className="space-y-3">
          {sections.map((section) => {
            const isOpen = sectionState[section.title] ?? true;
            const hasActive = section.items.some((item) =>
              isActivePath(pathname, item.href, item.exact),
            );

            return (
              <div
                key={section.title}
                className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-2"
              >
                {!collapsed ? (
                  <div className="mb-2 flex items-center justify-between gap-2 px-2 pt-1">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {section.title}
                      </p>
                    </div>

                    {section.collapsible ? (
                      <button
                        type="button"
                        aria-label={isOpen ? `Collapse ${section.title}` : `Expand ${section.title}`}
                        aria-expanded={isOpen}
                        onClick={() =>
                          setSectionState((prev) => ({
                            ...prev,
                            [section.title]: !prev[section.title],
                          }))
                        }
                        className="rounded-xl p-1.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isOpen ? "rotate-0" : "-rotate-90",
                          )}
                        />
                      </button>
                    ) : hasActive ? (
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                        Active
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {(isOpen || collapsed) && (
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon ?? ChevronRight;
                      const active = isActivePath(pathname, item.href, item.exact);

                      const baseClasses = cn(
                        "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                        active
                          ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20"
                          : item.disabled
                            ? "cursor-not-allowed opacity-50"
                            : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
                        collapsed && "justify-center px-2",
                      );

                      const content = (
                        <>
                          <span
                            className={cn(
                              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border transition",
                              active
                                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                                : "border-white/10 bg-white/[0.04] text-slate-400 group-hover:border-cyan-400/20 group-hover:text-white",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>

                          {!collapsed ? (
                            <span className="min-w-0 flex-1">
                              <span className="block truncate">{item.label}</span>
                              {item.description ? (
                                <span className="block truncate text-xs font-normal text-slate-500">
                                  {item.description}
                                </span>
                              ) : null}
                            </span>
                          ) : null}

                          {!collapsed && item.badge !== undefined ? (
                            <span
                              className={cn(
                                "inline-flex shrink-0 items-center rounded-full border px-2 py-1 text-[11px] font-semibold",
                                active
                                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                                  : "border-white/10 bg-white/[0.04] text-slate-300",
                              )}
                            >
                              {item.badge}
                            </span>
                          ) : null}

                          {!collapsed && item.external ? (
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500" />
                          ) : null}
                        </>
                      );

                      if (item.disabled) {
                        return (
                          <div
                            key={`${section.title}-${item.label}`}
                            className={baseClasses}
                            aria-disabled="true"
                            title={collapsed ? item.label : undefined}
                          >
                            {content}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={`${section.title}-${item.href}`}
                          href={item.href}
                          onClick={onNavigate}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer noopener" : undefined}
                          className={baseClasses}
                          title={collapsed ? item.label : undefined}
                        >
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        {user ? (
          <div
            className={cn(
              "rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-3",
              collapsed && "px-2 py-2",
            )}
          >
            <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-semibold text-white">
                {initialsFromName(user)}
              </span>

              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                  {user.role ? <p className="truncate text-xs text-slate-400">{user.role}</p> : null}
                  {user.email ? <p className="truncate text-xs text-slate-500">{user.email}</p> : null}
                </div>
              ) : null}
            </div>

            {!collapsed ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href={user.href || "/profile"}
                  onClick={onNavigate}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-white"
                >
                  <User2 className="h-3.5 w-3.5" />
                  Profile
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={cn("mt-3 space-y-1", collapsed && "mt-0")}>
          {footerLinks.map((link) => {
            const Icon = link.icon ?? ChevronRight;
            return (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                onClick={onNavigate}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer noopener" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? link.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed ? <span className="truncate">{link.label}</span> : null}
              </Link>
            );
          })}

          {!collapsed ? (
            <Link
              href={supportHref}
              onClick={onNavigate}
              className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-white"
            >
              <Activity className="h-4 w-4 text-cyan-300" />
              <span className="min-w-0 flex-1 truncate">Platform health and support</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AppSidebar({
  sections = createDefaultSections(),
  metrics = [],
  user,
  footerLinks = [
    { label: "Docs", href: "/docs", icon: LifeBuoy },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  workspaceLabel,
  workspaceSubLabel,
  statusLabel = "Operational",
  statusTone = "idle",
  brandName,
  brandHref = "/",
  supportHref = "/support",
  commandHref = "/jobs/new",
  mobileOpen = false,
  onMobileOpenChange,
  defaultCollapsed = false,
  storageKey = "skunkscrape:sidebar:collapsed",
  className,
}: AppSidebarProps) {
  const pathname = usePathname() || "/";
  const resolvedBrandName = brandName?.trim() || getBrandName();
  const resolvedWorkspaceLabel = workspaceLabel?.trim() || inferWorkspaceLabel();
  const resolvedWorkspaceSubLabel = workspaceSubLabel?.trim() || inferWorkspaceSubLabel();

  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw !== null) {
        setCollapsed(raw === "1");
      } else {
        setCollapsed(defaultCollapsed);
      }
    } catch {
      setCollapsed(defaultCollapsed);
    }
  }, [defaultCollapsed, storageKey]);

  React.useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(storageKey, collapsed ? "1" : "0");
    } catch {
      // ignore storage write failures
    }
  }, [collapsed, mounted, storageKey]);

  React.useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onMobileOpenChange?.(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, onMobileOpenChange]);

  React.useEffect(() => {
    onMobileOpenChange?.(false);
  }, [pathname, onMobileOpenChange]);

  const handleToggleCollapsed = () => setCollapsed((prev) => !prev);
  const handleMobileClose = () => onMobileOpenChange?.(false);

  return (
    <>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={handleMobileClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          "sidebar-shell relative z-50 min-h-[calc(100vh-2rem)] overflow-hidden p-0 transition-all duration-300",
          collapsed ? "lg:w-[104px]" : "lg:w-[312px]",
          className,
          "hidden lg:block",
        )}
        aria-label="Application sidebar"
      >
        <SidebarContent
          pathname={pathname}
          collapsed={collapsed}
          onToggleCollapsed={handleToggleCollapsed}
          sections={sections}
          metrics={metrics}
          user={user}
          footerLinks={footerLinks}
          workspaceLabel={resolvedWorkspaceLabel}
          workspaceSubLabel={resolvedWorkspaceSubLabel}
          statusLabel={statusLabel}
          statusTone={statusTone}
          brandName={resolvedBrandName}
          brandHref={brandHref}
          supportHref={supportHref}
          commandHref={commandHref}
        />
      </aside>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[90vw] max-w-[340px] border-r border-white/10 bg-slate-950 shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile application sidebar"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">{resolvedBrandName}</p>
            <p className="truncate text-xs text-slate-400">{getBaseUrl().host}</p>
          </div>

          <button
            type="button"
            aria-label="Close mobile sidebar"
            onClick={handleMobileClose}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-[calc(100%-73px)]">
          <SidebarContent
            pathname={pathname}
            collapsed={false}
            onToggleCollapsed={() => undefined}
            sections={sections}
            metrics={metrics}
            user={user}
            footerLinks={footerLinks}
            workspaceLabel={resolvedWorkspaceLabel}
            workspaceSubLabel={resolvedWorkspaceSubLabel}
            statusLabel={statusLabel}
            statusTone={statusTone}
            brandName={resolvedBrandName}
            brandHref={brandHref}
            supportHref={supportHref}
            commandHref={commandHref}
            onNavigate={handleMobileClose}
          />
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;