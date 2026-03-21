from __future__ import annotations

import argparse
import csv
import json
import logging
import os
import random
import re
import sys
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.parse import parse_qsl, urlencode, urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup


ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data"
LOG_DIR = DATA_DIR / "logs"
OUTPUT_DIR = DATA_DIR / "output" / "smart_contact_crawler"
LOG_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

LOG_FILE = LOG_DIR / "smart_contact_crawler.log"
DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 SkunkScrape/2.2"
)
DEFAULT_TIMEOUT = 20
DEFAULT_MAX_PAGES = 50

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("smart_contact_crawler")

EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE)
PHONE_RE = re.compile(
    r"(?:(?:\+|00)\d{1,3}[\s\-\.]*)?(?:\(?\d{2,4}\)?[\s\-\.]*){2,4}\d{2,4}"
)
WHITESPACE_RE = re.compile(r"\s+")
TRACKING_QUERY_KEYS = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
    "mc_cid",
    "mc_eid",
}
SOCIAL_HOSTS = {
    "linkedin.com": "linkedin",
    "facebook.com": "facebook",
    "instagram.com": "instagram",
    "x.com": "x",
    "twitter.com": "x",
    "youtube.com": "youtube",
    "tiktok.com": "tiktok",
    "wa.me": "whatsapp",
    "whatsapp.com": "whatsapp",
}
CONTACT_KEYWORDS = [
    "contact",
    "about",
    "team",
    "company",
    "support",
    "help",
    "sales",
    "quote",
    "pricing",
    "location",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Smart contact crawler for extracting public business contact details."
    )
    parser.add_argument("--url", help="Seed URL to crawl, e.g. https://example.com")
    parser.add_argument("--depth", type=int, default=2, help="Maximum crawl depth (default: 2)")
    parser.add_argument(
        "--proxy-file",
        help="Optional path to a proxy list. Supports host:port and host:port:user:pass formats.",
    )
    parser.add_argument(
        "--to-webhook",
        action="store_true",
        help="POST the JSON payload to the URL in SKUNKSCRAPE_WEBHOOK_URL.",
    )
    parser.add_argument(
        "--target-leads",
        type=int,
        default=100,
        help="Target lead count used for metadata and future orchestration (default: 100).",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=DEFAULT_MAX_PAGES,
        help="Safety cap for crawled pages (default: 50).",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=DEFAULT_TIMEOUT,
        help="HTTP timeout in seconds (default: 20).",
    )
    return parser.parse_args()


def canonicalize_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""

    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.\-]*://", url):
        url = f"https://{url.lstrip('/')}"

    parsed = urlparse(url)

    scheme = (parsed.scheme or "https").lower()
    netloc = parsed.netloc.lower()

    if not netloc and parsed.path:
        parsed = urlparse(f"{scheme}://{parsed.path}")
        scheme = (parsed.scheme or "https").lower()
        netloc = parsed.netloc.lower()

    if scheme == "http" and netloc.endswith(":80"):
        netloc = netloc[:-3]
    elif scheme == "https" and netloc.endswith(":443"):
        netloc = netloc[:-4]

    path = re.sub(r"/{2,}", "/", parsed.path or "/")
    if not path.startswith("/"):
        path = "/" + path
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")

    filtered_query = [
        (k, v)
        for k, v in parse_qsl(parsed.query, keep_blank_values=True)
        if k.lower() not in TRACKING_QUERY_KEYS
    ]
    query = urlencode(sorted(filtered_query))

    return urlunparse((scheme, netloc, path, "", query, ""))


def normalize_url(url: str) -> str:
    return canonicalize_url(url)


def sanitize_filename(value: str) -> str:
    safe = re.sub(r"[^A-Za-z0-9._-]+", "_", value.strip())
    return safe.strip("._") or "output"


def same_domain(seed_url: str, candidate_url: str) -> bool:
    seed_netloc = urlparse(canonicalize_url(seed_url)).netloc.lower().replace("www.", "")
    candidate_netloc = urlparse(canonicalize_url(candidate_url)).netloc.lower().replace("www.", "")
    return bool(candidate_netloc) and seed_netloc == candidate_netloc


def clean_text(text: str) -> str:
    return WHITESPACE_RE.sub(" ", text or "").strip()


def normalize_email(value: str) -> str:
    return clean_text(value).lower()


def normalize_phone(value: str) -> str:
    value = clean_text(value)
    digits = re.sub(r"\D", "", value)
    if not (7 <= len(digits) <= 15):
        return ""
    if value.startswith("+"):
        return "+" + digits
    return digits


def load_proxies(proxy_file: str | None) -> list[str]:
    if not proxy_file:
        return []

    path = Path(proxy_file)
    if not path.exists():
        log.warning("Proxy file not found: %s", path)
        return []

    proxies: list[str] = []
    for raw_line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        if line.startswith(("http://", "https://")):
            proxies.append(line)
            continue

        parts = line.split(":")
        if len(parts) == 2:
            host, port = parts
            proxies.append(f"http://{host}:{port}")
        elif len(parts) >= 4:
            host, port, username, password = parts[0], parts[1], parts[2], ":".join(parts[3:])
            proxies.append(f"http://{username}:{password}@{host}:{port}")
        else:
            log.warning("Skipping unsupported proxy format: %s", line)

    log.info("Loaded %s proxies", len(proxies))
    return proxies


class ProxyPool:
    def __init__(self, proxies: list[str] | None = None) -> None:
        self.proxies = proxies or []

    def get(self) -> dict[str, str] | None:
        if not self.proxies:
            return None
        proxy = random.choice(self.proxies)
        return {"http": proxy, "https": proxy}


class SmartContactCrawler:
    def __init__(
        self,
        seed_url: str,
        depth: int = 2,
        timeout: int = DEFAULT_TIMEOUT,
        max_pages: int = DEFAULT_MAX_PAGES,
        proxy_pool: ProxyPool | None = None,
        target_leads: int = 100,
    ) -> None:
        self.seed_url = normalize_url(seed_url)
        self.depth = max(1, int(depth))
        self.timeout = max(5, int(timeout))
        self.max_pages = max(1, int(max_pages))
        self.proxy_pool = proxy_pool or ProxyPool()
        self.target_leads = target_leads
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": DEFAULT_USER_AGENT})
        self.visited: set[str] = set()
        self.discovered_contact_pages: set[str] = set()

    def fetch(self, url: str) -> requests.Response | None:
        try:
            response = self.session.get(
                url,
                timeout=self.timeout,
                proxies=self.proxy_pool.get(),
                allow_redirects=True,
            )
            content_type = response.headers.get("content-type", "")
            if response.status_code >= 400:
                log.warning("HTTP %s for %s", response.status_code, url)
                return None
            if "text/html" not in content_type and "application/xhtml+xml" not in content_type:
                log.info("Skipping non-HTML content at %s (%s)", url, content_type)
                return None
            return response
        except requests.RequestException as exc:
            log.warning("Request failed for %s: %s", url, exc)
            return None

    def extract_contacts(self, url: str, soup: BeautifulSoup) -> dict:
        text = clean_text(soup.get_text(" ", strip=True))
        page_title = clean_text(soup.title.get_text(" ", strip=True)) if soup.title else ""

        emails = sorted({normalize_email(match) for match in EMAIL_RE.findall(text)})
        phones = sorted(
            {
                normalized
                for normalized in (normalize_phone(match) for match in PHONE_RE.findall(text))
                if normalized
            }
        )

        mailto_emails: set[str] = set()
        telephone_links: set[str] = set()
        social_links: dict[str, set[str]] = {name: set() for name in set(SOCIAL_HOSTS.values())}
        contact_links: set[str] = set()
        external_links: set[str] = set()
        internal_links: set[str] = set()

        for anchor in soup.find_all("a", href=True):
            href = anchor.get("href", "").strip()
            href_lower = href.lower()
            text_label = clean_text(anchor.get_text(" ", strip=True)).lower()

            if href_lower.startswith("mailto:"):
                email = href.split(":", 1)[1].split("?", 1)[0].strip()
                if email:
                    mailto_emails.add(normalize_email(email))
                continue

            if href_lower.startswith("tel:"):
                normalized = normalize_phone(href.split(":", 1)[1])
                if normalized:
                    telephone_links.add(normalized)
                continue

            absolute_url = canonicalize_url(urljoin(url, href))
            parsed = urlparse(absolute_url)
            if parsed.scheme not in {"http", "https"}:
                continue

            host = parsed.netloc.lower()
            for social_host, social_name in SOCIAL_HOSTS.items():
                if social_host in host:
                    social_links[social_name].add(absolute_url)

            if same_domain(self.seed_url, absolute_url):
                internal_links.add(absolute_url)
                haystack = f"{absolute_url.lower()} {text_label}"
                if any(keyword in haystack for keyword in CONTACT_KEYWORDS):
                    contact_links.add(absolute_url)
            else:
                external_links.add(absolute_url)

        emails = sorted(set(emails) | mailto_emails)
        phones = sorted(set(phones) | telephone_links)

        address_excerpt = self.extract_address_excerpt(text)
        business_name = self.extract_business_name(soup, page_title, url)

        return {
            "source_url": canonicalize_url(url),
            "page_title": page_title,
            "business_name": business_name,
            "emails": emails,
            "phones": phones,
            "linkedin": sorted(social_links["linkedin"]),
            "facebook": sorted(social_links["facebook"]),
            "instagram": sorted(social_links["instagram"]),
            "x": sorted(social_links["x"]),
            "youtube": sorted(social_links["youtube"]),
            "tiktok": sorted(social_links["tiktok"]),
            "whatsapp": sorted(social_links["whatsapp"]),
            "contact_links": sorted(contact_links),
            "address_excerpt": address_excerpt,
            "internal_link_count": len(internal_links),
            "external_link_count": len(external_links),
        }

    @staticmethod
    def extract_business_name(soup: BeautifulSoup, page_title: str, url: str) -> str:
        candidates: list[str] = []

        og_site_name = soup.find("meta", attrs={"property": "og:site_name"})
        if og_site_name and og_site_name.get("content"):
            candidates.append(clean_text(og_site_name["content"]))

        app_name = soup.find("meta", attrs={"name": "application-name"})
        if app_name and app_name.get("content"):
            candidates.append(clean_text(app_name["content"]))

        h1 = soup.find("h1")
        if h1:
            candidates.append(clean_text(h1.get_text(" ", strip=True)))

        if page_title:
            title_parts = re.split(r"\||-|–|—", page_title)
            candidates.extend(clean_text(part) for part in title_parts if clean_text(part))

        hostname = urlparse(url).netloc.replace("www.", "")
        if hostname:
            candidates.append(hostname.split(".")[0].replace("-", " ").replace("_", " ").title())

        for candidate in candidates:
            if 2 <= len(candidate) <= 100:
                return candidate
        return hostname or "Unknown"

    @staticmethod
    def extract_address_excerpt(text: str) -> str:
        patterns = [
            r"\b\d{1,5}\s+[A-Za-z0-9\-\.' ]{3,80}\b(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Parkway|Way|Close|Crescent|Boulevard|Blvd)\b[^\n]{0,80}",
            r"\bP\.?\s?O\.?\s?Box\s+\d+[^\n]{0,60}",
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return clean_text(match.group(0))[:180]
        return ""

    def crawl(self) -> dict:
        queue: deque[tuple[str, int]] = deque([(self.seed_url, 0)])
        records: list[dict] = []
        pages_crawled = 0

        while queue and pages_crawled < self.max_pages:
            current_url, current_depth = queue.popleft()
            current_url = canonicalize_url(current_url)

            if current_url in self.visited:
                continue
            self.visited.add(current_url)

            response = self.fetch(current_url)
            if not response:
                continue

            resolved_url = canonicalize_url(response.url)
            self.visited.add(resolved_url)

            soup = BeautifulSoup(response.text, "html.parser")
            pages_crawled += 1
            log.info("Parsed page %s/%s: %s", pages_crawled, self.max_pages, resolved_url)

            record = self.extract_contacts(resolved_url, soup)
            if record["emails"] or record["phones"] or record["contact_links"] or record["whatsapp"]:
                records.append(record)
                self.discovered_contact_pages.update(record["contact_links"])

            if current_depth >= self.depth:
                continue

            for anchor in soup.find_all("a", href=True):
                href = anchor.get("href", "").strip()
                if not href:
                    continue

                absolute_url = canonicalize_url(urljoin(resolved_url, href))
                parsed = urlparse(absolute_url)
                if parsed.scheme not in {"http", "https"}:
                    continue
                if not same_domain(self.seed_url, absolute_url):
                    continue
                if absolute_url in self.visited:
                    continue

                anchor_text = clean_text(anchor.get_text(" ", strip=True)).lower()
                href_text = absolute_url.lower()
                priority = 0 if any(k in f"{anchor_text} {href_text}" for k in CONTACT_KEYWORDS) else 1

                if priority == 0:
                    queue.appendleft((absolute_url, current_depth + 1))
                else:
                    queue.append((absolute_url, current_depth + 1))

        deduped_records = self.deduplicate_records(records)
        summary = self.build_summary(deduped_records, pages_crawled)
        return {"summary": summary, "records": deduped_records}

    def deduplicate_records(self, records: Iterable[dict]) -> list[dict]:
        merged: dict[str, dict] = {}
        for record in records:
            key = canonicalize_url(record["source_url"])
            if key not in merged:
                record["source_url"] = key
                merged[key] = record
                continue

            current = merged[key]
            for field in [
                "emails",
                "phones",
                "linkedin",
                "facebook",
                "instagram",
                "x",
                "youtube",
                "tiktok",
                "whatsapp",
                "contact_links",
            ]:
                current[field] = sorted(set(current[field]) | set(record[field]))

            if not current.get("address_excerpt") and record.get("address_excerpt"):
                current["address_excerpt"] = record["address_excerpt"]
            if not current.get("page_title") and record.get("page_title"):
                current["page_title"] = record["page_title"]
            if not current.get("business_name") and record.get("business_name"):
                current["business_name"] = record["business_name"]

            current["internal_link_count"] = max(
                int(current.get("internal_link_count", 0)),
                int(record.get("internal_link_count", 0)),
            )
            current["external_link_count"] = max(
                int(current.get("external_link_count", 0)),
                int(record.get("external_link_count", 0)),
            )

        return list(merged.values())

    def build_summary(self, records: list[dict], pages_crawled: int) -> dict:
        unique_emails = sorted({email for record in records for email in record["emails"]})
        unique_phones = sorted({phone for record in records for phone in record["phones"]})
        timestamp = datetime.now(timezone.utc).isoformat()
        return {
            "seed_url": self.seed_url,
            "crawl_depth": self.depth,
            "target_leads": self.target_leads,
            "pages_crawled": pages_crawled,
            "records_found": len(records),
            "unique_email_count": len(unique_emails),
            "unique_phone_count": len(unique_phones),
            "contact_pages_discovered": sorted(self.discovered_contact_pages),
            "timestamp_utc": timestamp,
        }


def flatten_record(record: dict) -> dict[str, str | int]:
    return {
        "business_name": record.get("business_name", ""),
        "page_title": record.get("page_title", ""),
        "source_url": record.get("source_url", ""),
        "emails": "; ".join(record.get("emails", [])),
        "phones": "; ".join(record.get("phones", [])),
        "linkedin": "; ".join(record.get("linkedin", [])),
        "facebook": "; ".join(record.get("facebook", [])),
        "instagram": "; ".join(record.get("instagram", [])),
        "x": "; ".join(record.get("x", [])),
        "youtube": "; ".join(record.get("youtube", [])),
        "tiktok": "; ".join(record.get("tiktok", [])),
        "whatsapp": "; ".join(record.get("whatsapp", [])),
        "contact_links": "; ".join(record.get("contact_links", [])),
        "address_excerpt": record.get("address_excerpt", ""),
        "internal_link_count": record.get("internal_link_count", 0),
        "external_link_count": record.get("external_link_count", 0),
    }


def write_outputs(seed_url: str, payload: dict) -> tuple[Path, Path]:
    host = sanitize_filename(urlparse(seed_url).netloc or "crawl")
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    json_path = OUTPUT_DIR / f"{host}_{timestamp}.json"
    csv_path = OUTPUT_DIR / f"{host}_{timestamp}.csv"

    json_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    fieldnames = [
        "business_name",
        "page_title",
        "source_url",
        "emails",
        "phones",
        "linkedin",
        "facebook",
        "instagram",
        "x",
        "youtube",
        "tiktok",
        "whatsapp",
        "contact_links",
        "address_excerpt",
        "internal_link_count",
        "external_link_count",
    ]
    with csv_path.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for record in payload.get("records", []):
            writer.writerow(flatten_record(record))

    return json_path, csv_path


def post_to_webhook(payload: dict) -> bool:
    webhook_url = os.getenv("SKUNKSCRAPE_WEBHOOK_URL", "").strip()
    if not webhook_url:
        log.warning("--to-webhook was used but SKUNKSCRAPE_WEBHOOK_URL is not set.")
        return False

    try:
        response = requests.post(webhook_url, json=payload, timeout=20)
        response.raise_for_status()
        log.info("Webhook delivery succeeded: %s", webhook_url)
        return True
    except requests.RequestException as exc:
        log.error("Webhook delivery failed: %s", exc)
        return False


def main() -> int:
    args = parse_args()

    if not args.url:
        log.error("A seed URL is required. Example: --url https://example.com")
        return 2

    seed_url = normalize_url(args.url)
    proxies = load_proxies(args.proxy_file)
    crawler = SmartContactCrawler(
        seed_url=seed_url,
        depth=args.depth,
        timeout=args.timeout,
        max_pages=args.max_pages,
        proxy_pool=ProxyPool(proxies),
        target_leads=args.target_leads,
    )

    log.info(
        "Starting crawl | seed=%s depth=%s max_pages=%s target_leads=%s",
        seed_url,
        args.depth,
        args.max_pages,
        args.target_leads,
    )
    payload = crawler.crawl()
    json_path, csv_path = write_outputs(seed_url, payload)

    summary = payload["summary"]
    print("\n=== SkunkScrape Smart Contact Crawler Summary ===")
    print(f"Seed URL:          {summary['seed_url']}")
    print(f"Pages crawled:     {summary['pages_crawled']}")
    print(f"Records found:     {summary['records_found']}")
    print(f"Unique emails:     {summary['unique_email_count']}")
    print(f"Unique phones:     {summary['unique_phone_count']}")
    print(f"JSON output:       {json_path}")
    print(f"CSV output:        {csv_path}")

    if args.to_webhook:
        delivered = post_to_webhook(payload)
        print(f"Webhook delivered: {'yes' if delivered else 'no'}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())