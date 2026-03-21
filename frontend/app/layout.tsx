import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME?.trim() || "SkunkScrape Web Console";
const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION?.trim() ||
  "Production-grade SkunkScrape web console for queued scraping, operational monitoring, result inspection, and export workflows.";

function getBaseUrl(): URL {
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

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: baseUrl,
  applicationName: APP_NAME,
  title: {
    default: `${APP_NAME} | Scrape orchestration and operations`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  referrer: "origin-when-cross-origin",
  generator: "Next.js",
  category: "technology",
  keywords: [
    "SkunkScrape",
    "scraping platform",
    "scrape orchestration",
    "lead generation",
    "FastAPI",
    "Next.js",
    "PostgreSQL",
    "Redis",
    "Celery",
    "operations dashboard",
    "queue monitoring",
    "data extraction",
  ],
  authors: [
    {
      name: "Skunkworks",
      url: "https://www.skunkworks.africa",
    },
  ],
  creator: "Skunkworks",
  publisher: "Skunkworks",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} | Scrape orchestration and operations`,
    description: APP_DESCRIPTION,
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | Scrape orchestration and operations`,
    description: APP_DESCRIPTION,
    creator: "@skunkworks",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "color-scheme": "dark",
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SkunkScrape",
    url: baseUrl.toString(),
    description: APP_DESCRIPTION,
    brand: APP_NAME,
    sameAs: [
      "https://www.skunkworks.africa",
    ],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: baseUrl.toString(),
    description: APP_DESCRIPTION,
    inLanguage: "en-ZA",
    publisher: {
      "@type": "Organization",
      name: "Skunkworks",
    },
  };

  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-300 selection:text-slate-950`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-950 focus:shadow-2xl"
        >
          Skip to main content
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />

        <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_24%),linear-gradient(to_bottom,#020617,#020617)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="relative z-10 flex min-h-screen flex-col">
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}