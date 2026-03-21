import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/jobs/new", label: "New Job" },
];

export function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-line px-6 py-4">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        SkunkScrape
      </Link>
      <div className="flex gap-4 text-sm text-slate-300">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
