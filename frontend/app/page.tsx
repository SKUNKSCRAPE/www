import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  Gauge,
  Globe,
  Lock,
  Radar,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "SkunkScrape Web Console";
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://skunkscrape.com";
const SITE_URL = RAW_SITE_URL.startsWith("http") ? RAW_SITE_URL : `https://${RAW_SITE_URL}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SkunkScrape Web Console | Queue, monitor, and operationalise scraping",
  description:
    "Production-grade web console for SkunkScrape. Launch jobs, monitor queues, track pipeline health, inspect results, and operationalise scraping with Next.js, FastAPI, PostgreSQL, and Redis.",
  applicationName: APP_NAME,
  keywords: [
    "SkunkScrape",
    "lead scraping",
    "web console",
    "FastAPI",
    "Next.js",
    "PostgreSQL",
    "Redis",
    "Celery",
    "queue monitoring",
    "scrape orchestration",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "SkunkScrape Web Console",
    description:
      "A modern control plane for scraping operations, lead pipelines, exports, monitoring, and queued execution.",
    siteName: "SkunkScrape",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkunkScrape Web Console",
    description:
      "Launch, queue, monitor, and operationalise scraping jobs from one responsive control plane.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const featureCards = [
  {
    icon: Workflow,
    title: "Queued execution",
    text: "Create scrape jobs, route them through workers, and keep browser interactions fast while long-running collection executes in the background.",
  },
  {
    icon: Database,
    title: "Persistent operations",
    text: "Treat jobs, logs, exports, retries, and result state as first-class entities instead of disposable scripts and ad-hoc terminal output.",
  },
  {
    icon: ShieldCheck,
    title: "Production posture",
    text: "Built to fit a hardened stack with FastAPI, PostgreSQL, Redis, reverse proxying, observability hooks, and role-based expansion paths.",
  },
  {
    icon: Radar,
    title: "Source visibility",
    text: "Track plugin routes, run health, queue latency, and operational coverage from one site-aware dashboard instead of scattered local tools.",
  },
];

const operationalStats = [
  { label: "Queue aware", value: "Redis-backed" },
  { label: "API ready", value: "FastAPI" },
  { label: "Stateful", value: "PostgreSQL" },
  { label: "Worker model", value: "Async jobs" },
];

const platformBullets = [
  "Responsive console shell for desktop, tablet, and mobile",
  "SEO-ready metadata and JSON-LD structured data",
  "Clear CTA paths into job orchestration and operations",
  "Composable visual system for future dashboard pages",
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "A browser-based control plane for launching, monitoring, and managing scraping workflows, queued jobs, and exports.",
    url: SITE_URL,
    brand: {
      "@type": "Brand",
      name: "SkunkScrape",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <style>{`
        @keyframes skunk-drift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          25% { transform: translate3d(24px, -18px, 0) scale(1.05); }
          50% { transform: translate3d(-10px, 20px, 0) scale(0.98); }
          75% { transform: translate3d(16px, 8px, 0) scale(1.03); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes skunk-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes skunk-grid-pulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.32; }
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"
            style={{ animation: "skunk-drift 18s ease-in-out infinite" }}
          />
          <div
            className="absolute right-[-4rem] top-[10rem] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl"
            style={{ animation: "skunk-drift 22s ease-in-out infinite reverse" }}
          />
          <div
            className="absolute bottom-[-6rem] left-[20%] h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"
            style={{ animation: "skunk-drift 24s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:34px_34px]"
            style={{ animation: "skunk-grid-pulse 8s ease-in-out infinite" }}
          />
        </div>

        <header className="relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur transition hover:border-sky-400/40 hover:bg-white/10"
              aria-label="SkunkScrape home"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 text-slate-950">
                <Bot className="h-5 w-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-wide text-white">
                  SkunkScrape
                </span>
                <span className="text-xs text-slate-400">Web Console</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-3 md:flex">
              <a
                href="#features"
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Features
              </a>
              <a
                href="#workflow"
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Workflow
              </a>
              <Link
                href="/jobs"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/40 hover:bg-white/5 hover:text-white"
              >
                Console
              </Link>
              <Link
                href="/jobs/new"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                New Job
              </Link>
            </nav>
          </div>
        </header>

        <section className="relative z-10">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-24 lg:pt-12">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-sky-200">
                <Sparkles className="h-4 w-4" />
                Production-ready console foundation
              </div>

              <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-7xl">
                Queue, monitor, and operationalise scraping from one modern control plane.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                This landing page is built as the front door to your SkunkScrape platform:
                responsive, animated, metadata-aware, and ready to drive users into job
                creation, operations visibility, and pipeline execution.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:opacity-95"
                >
                  Enter Console
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/jobs/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-sky-400/40 hover:bg-white/10"
                >
                  Create New Job
                  <Workflow className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "FastAPI backend",
                  "PostgreSQL state",
                  "Redis queues",
                  "Responsive UI",
                  "SEO metadata",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {platformBullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <p className="text-sm leading-6 text-slate-300">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="relative mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl"
                style={{ animation: "skunk-float 6s ease-in-out infinite" }}
              >
                <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/80 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                        Live operations shell
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                        Site-aware control card
                      </h2>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                      Ready
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {operationalStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-base font-semibold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-cyan-400/5 to-fuchsia-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          Current lane
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          Scrape orchestration
                        </p>
                      </div>
                      <Gauge className="h-8 w-8 text-sky-300" />
                    </div>

                    <div className="mt-4 space-y-3">
                      {[
                        {
                          icon: Activity,
                          label: "Queue telemetry",
                          value: "Worker state, retries, latency, throughput",
                        },
                        {
                          icon: ServerCog,
                          label: "Execution pipeline",
                          value: "API → queue → worker → persistence → UI",
                        },
                        {
                          icon: Lock,
                          label: "Security posture",
                          value: "Ready for auth, RBAC, audit, and proxy policy",
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                        >
                          <row.icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                          <div>
                            <p className="text-sm font-semibold text-white">{row.label}</p>
                            <p className="mt-1 text-sm text-slate-300">{row.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/jobs"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-white/10"
                    >
                      View jobs
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/jobs/new"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
                    >
                      Launch a run
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="relative z-10 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                Feature set
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Built for operational depth, not just a splash page.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-300">
                This page is designed to be visually strong enough for public entry,
                structured enough for SEO, and clear enough to guide users straight into the
                real product workflow.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((card) => (
                <article
                  key={card.title}
                  className="group rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:border-sky-400/30 hover:bg-white/[0.06]"
                >
                  <div className="inline-flex rounded-2xl border border-sky-400/20 bg-sky-400/10 p-3 text-sky-200 transition group-hover:scale-105">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="relative z-10 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  Workflow
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  One clean path from entry page to job execution.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  The goal of this route is not only to look polished, but to route operators
                  into the system with clarity and without friction.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Globe,
                    title: "1. Public entry",
                    text: "Users land on a branded, metadata-aware, mobile-friendly homepage that clearly explains the product.",
                  },
                  {
                    icon: Workflow,
                    title: "2. Job creation",
                    text: "Operators move directly into new-job setup with target URL, plugin choice, execution mode, and output preferences.",
                  },
                  {
                    icon: ServerCog,
                    title: "3. Async execution",
                    text: "The backend hands work to workers, preserving responsiveness while keeping status and logs visible in the console.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "4. Operational review",
                    text: "Results, exports, queue health, retries, and future auth controls all fit into the same visual system.",
                  },
                ].map((step) => (
                  <div
                    key={step.title}
                    className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <step.icon className="h-5 w-5 text-sky-300" />
                    <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="font-medium text-slate-200">SkunkScrape Web Console</p>
              <p className="mt-1">
                Responsive landing route for your Next.js frontend, ready to pair with FastAPI,
                PostgreSQL, Redis, and the rest of the repo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/jobs"
                className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-sky-400/30 hover:text-white"
              >
                Open Console
              </Link>
              <Link
                href="/jobs/new"
                className="rounded-full bg-white px-4 py-2 font-medium text-slate-950 transition hover:opacity-90"
              >
                Start Job
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}