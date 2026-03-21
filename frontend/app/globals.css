"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChevronRight,
  Command,
  Globe,
  Menu,
  PanelTop,
  Sparkles,
  X,
} from "lucide-react";

type HeaderAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
};

type HeaderNavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

type HeaderMetric = {
  label: string;
  value: string;
  hint?: string;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type AppHeaderProps = {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: HeaderAction[];
  navItems?: HeaderNavItem[];
  metrics?: HeaderMetric[];
  statusLabel?: string;
  statusTone?: "idle" | "running" | "success" | "warning" | "danger";
  environmentLabel?: string;
  environmentTone?: "neutral" | "dev" | "staging" | "prod";
  brandName?: string;
  brandHref?: string;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function titleCase(input: string) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function inferEnvironmentLabel() {
  const explicit =
    process.env.NEXT_PUBLIC_APP_ENV?.trim() ||
    process.env.APP_ENV?.trim() ||
    "";

  if (explicit) return explicit;

  if (process.env.NODE_ENV === "production") return "Production";
  if (process.env.NODE_ENV === "development") return "Development";

  return "Environment";
}

function inferEnvironmentTone(label: string): AppHeaderProps["environmentTone"] {
  const normalized = label.toLowerCase();

  if (normalized.includes("prod")) return "prod";
  if (normalized.includes("stag")) return "staging";
  if (normalized.includes("dev") || normalized.includes("local")) return "dev";

  return "neutral";
}

function statusToneClasses(tone: AppHeaderProps["statusTone"] = "idle") {
  switch (tone) {
    case "running":
      return {
        dot: "bg-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.12)]",
        badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
      };
    case "success":
      return {
        dot: "bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]",
        badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      };
    case "warning":
      return {
        dot: "bg-amber-400 shadow-[0_0_0_4px_rgba(245,158,11,0.12)]",
        badge: "border-amber-400/20 bg-amber-400/10 text-amber-200",
      };
    case "danger":
      return {
        dot: "bg-red-400 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]",
        badge: "border-red-400/20 bg-red-400/10 text-red-200",
      };
    default:
      return {
        dot: "bg-slate-500 shadow-[0_0_0_4px_rgba(100,116,139,0.12)]",
        badge: "border-white/10 bg-white/[0.05] text-slate-300",
      };
  }
}

function envToneClasses(tone: AppHeaderProps["environmentTone"] = "neutral") {
  switch (tone) {
    case "prod":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
    case "staging":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";
    case "dev":
      return "border-sky-400/20 bg-sky-400/10 text-sky-200";
    default:
      return "border-white/10 bg-white/[0.05] text-slate-300";
  }
}

function actionClasses(variant: HeaderAction["variant"] = "secondary") {
  switch (variant) {
    case "primary":
      return "bg-white text-slate-950 hover:opacity-95";
    case "ghost":
      return "text-slate-300 hover:bg-white/[0.06] hover:text-white";
    default:
      return "border border-white/10 bg-white/[0.05] text-white hover:border-cyan-400/30 hover:bg-white/[0.08]";
  }
}

function isActivePath(currentPath: string, href: string, exact?: boolean) {
  if (exact) return currentPath === href;
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function buildBreadcrumbs(pathname: string, brandName: string): BreadcrumbItem[] {
  const clean = pathname.split("?")[0].split("#")[0];
  const segments = clean.split("/").filter(Boolean);

  const crumbs: BreadcrumbItem[] = [
    { label: brandName, href: "/" },
  ];

  if (segments.length === 0) return crumbs;

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    crumbs.push({
      label: titleCase(decodeURIComponent(segment)),
      href: currentPath,
    });
  }

  return crumbs;
}

function inferTitleFromPath(pathname: string) {
  const clean = pathname.split("?")[0].split("#")[0];
  const segments = clean.split("/").filter(Boolean);
  if (segments.length === 0) return "Operations Overview";
  return titleCase(segments[segments.length - 1]);
}

export function AppHeader({
  title,
  description,
  breadcrumbs,
  actions = [],
  navItems = [],
  metrics = [],
  statusLabel = "Ready",
  statusTone = "idle",
  environmentLabel,
  environmentTone,
  brandName,
  brandHref = "/",
  className,
}: AppHeaderProps) {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = React.useState(false);

  const siteUrl = getBaseUrl();
  const resolvedBrandName =
    brandName?.trim() ||
    process.env.NEXT_PUBLIC_APP_NAME?.trim() ||
    "SkunkScrape Web Console";

  const resolvedEnvLabel = environmentLabel?.trim() || inferEnvironmentLabel();
  const resolvedEnvTone = environmentTone || inferEnvironmentTone(resolvedEnvLabel);
  const resolvedBreadcrumbs = breadcrumbs?.length
    ? breadcrumbs
    : buildBreadcrumbs(pathname, resolvedBrandName);

  const resolvedTitle = title?.trim() || inferTitleFromPath(pathname);
  const resolvedDescription =
    description?.trim() ||
    "Manage jobs, monitor platform activity, and move through the SkunkScrape control plane with confidence.";

  const statusClasses = statusToneClasses(statusTone);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={cn("topbar", className)}>
      <div className="topbar-inner">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href={brandHref}
            className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
            aria-label={`${resolvedBrandName} home`}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-300 to-fuchsia-300 text-slate-950 shadow-lg">
              <Command className="h-5 w-5" />
            </span>
            <span className="hidden min-w-0 flex-col md:flex">
              <span className="truncate text-sm font-semibold text-white">
                {resolvedBrandName}
              </span>
              <span className="truncate text-xs text-slate-400">
                {siteUrl.host}
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 flex-col xl:flex">
            <nav
              aria-label="Breadcrumb"
              className="mb-1 flex min-w-0 flex-wrap items-center gap-1 text-xs text-slate-400"
            >
              {resolvedBreadcrumbs.map((crumb, index) => {
                const isLast = index === resolvedBreadcrumbs.length - 1;
                return (
                  <React.Fragment key={`${crumb.label}-${index}`}>
                    {index > 0 ? <ChevronRight className="h-3.5 w-3.5 text-slate-600" /> : null}
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="truncate rounded-md px-1 py-0.5 hover:bg-white/[0.05] hover:text-white"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={cn("truncate px-1 py-0.5", isLast ? "text-slate-200" : "")}>
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-white lg:text-xl">
                {resolvedTitle}
              </h1>
              <p className="truncate text-sm text-slate-400">{resolvedDescription}</p>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
              envToneClasses(resolvedEnvTone),
            )}
            title={`Current environment: ${resolvedEnvLabel}`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{resolvedEnvLabel}</span>
          </div>

          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
              statusClasses.badge,
            )}
            title={`Platform status: ${statusLabel}`}
          >
            <span className={cn("h-2.5 w-2.5 rounded-full", statusClasses.dot)} />
            <span>{statusLabel}</span>
          </div>

          {actions.map((action) => {
            const Icon = action.icon;
            const commonClass = cn(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
              actionClasses(action.variant),
            );

            if (action.href) {
              return (
                <Link
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noreferrer noopener" : undefined}
                  className={commonClass}
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  <span>{action.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={commonClass}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close header menu" : "Open header menu"}
          aria-expanded={menuOpen}
          aria-controls="app-header-mobile-panel"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.08] lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {(navItems.length > 0 || metrics.length > 0) && (
        <div className="border-t border-white/10 bg-white/[0.02]">
          <div className="container-shell flex flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between">
            {navItems.length > 0 ? (
              <nav
                aria-label="Section navigation"
                className="scrollbar-none flex items-center gap-2 overflow-x-auto"
              >
                {navItems.map((item) => {
                  const active = isActivePath(pathname, item.href, item.exact);
                  const Icon = item.icon ?? PanelTop;

                  return (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      className={cn(
                        "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition",
                        active
                          ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20"
                          : "text-slate-300 hover:bg-white/[0.05] hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            ) : (
              <div />
            )}

            {metrics.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <div
                    key={`${metric.label}-${metric.value}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{metric.value}</p>
                    {metric.hint ? (
                      <p className="mt-0.5 text-xs text-slate-400">{metric.hint}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div
        id="app-header-mobile-panel"
        className={cn(
          "overflow-hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 lg:hidden",
          menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container-shell space-y-5 py-4">
          <div className="space-y-2">
            <nav
              aria-label="Mobile breadcrumb"
              className="flex flex-wrap items-center gap-1 text-xs text-slate-400"
            >
              {resolvedBreadcrumbs.map((crumb, index) => {
                const isLast = index === resolvedBreadcrumbs.length - 1;
                return (
                  <React.Fragment key={`mobile-${crumb.label}-${index}`}>
                    {index > 0 ? <ChevronRight className="h-3.5 w-3.5 text-slate-600" /> : null}
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="hover:text-white">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-slate-200" : ""}>{crumb.label}</span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            <div>
              <h2 className="text-lg font-semibold text-white">{resolvedTitle}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">{resolvedDescription}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
                envToneClasses(resolvedEnvTone),
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{resolvedEnvLabel}</span>
            </div>

            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
                statusClasses.badge,
              )}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full", statusClasses.dot)} />
              <span>{statusLabel}</span>
            </div>
          </div>

          {navItems.length > 0 ? (
            <div className="grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon ?? PanelTop;
                const active = isActivePath(pathname, item.href, item.exact);

                return (
                  <Link
                    key={`mobile-nav-${item.label}-${item.href}`}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20"
                        : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.06] hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {metrics.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {metrics.map((metric) => (
                <div
                  key={`mobile-metric-${metric.label}-${metric.value}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{metric.value}</p>
                  {metric.hint ? (
                    <p className="mt-0.5 text-xs text-slate-400">{metric.hint}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {actions.length > 0 ? (
            <div className="grid gap-2">
              {actions.map((action) => {
                const Icon = action.icon ?? Sparkles;
                const commonClass = cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  actionClasses(action.variant),
                );

                if (action.href) {
                  return (
                    <Link
                      key={`mobile-action-${action.label}-${action.href}`}
                      href={action.href}
                      target={action.external ? "_blank" : undefined}
                      rel={action.external ? "noreferrer noopener" : undefined}
                      className={commonClass}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{action.label}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={`mobile-action-${action.label}`}
                    type="button"
                    onClick={action.onClick}
                    className={commonClass}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-start gap-3">
              <Activity className="mt-0.5 h-4 w-4 text-cyan-300" />
              <div>
                <p className="text-sm font-medium text-white">Operational shell active</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  This header is route-aware, mobile-safe, and ready for console pages,
                  dashboard shells, queue monitoring, and job execution views.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;