import argparse
import json
import logging
import subprocess
from pathlib import Path

LOG_DIR = Path("data/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    filename=str(LOG_DIR / "main.log"),
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
log = logging.getLogger("main")

MANIFEST_PATH = Path("skunkscrape/plugins/manifest.json")
DEFAULT_PROXY_FILE = r"C:\Users\Raydo\OneDrive\Apps\SkunkScrape\data\proxies\Webshare 10 proxies.txt"


def load_manifest():
    if not MANIFEST_PATH.exists():
        raise FileNotFoundError(f"Missing manifest.json at {MANIFEST_PATH}")
    with MANIFEST_PATH.open("r", encoding="utf-8-sig") as f:
        return json.load(f)


def list_plugins(manifest):
    plugins = {}
    for _, info in manifest["categories"].items():
        for plugin_name in info["plugins"]:
            plugins[plugin_name] = plugin_name
    return plugins


def run_plugin(
    plugin,
    url=None,
    depth=None,
    to_webhook=False,
    target_leads=None,
    proxy_file=None,
    max_pages=None,
    timeout=None,
):
    effective_proxy_file = proxy_file or DEFAULT_PROXY_FILE

    cmd = ["python", "-m", f"skunkscrape.plugins.{plugin}"]

    if url:
        cmd += ["--url", url]

    if plugin == "smart_contact_crawler":
        if depth is not None:
            cmd += ["--depth", str(depth)]
        if to_webhook:
            cmd += ["--to-webhook"]
        if target_leads is not None:
            cmd += ["--target-leads", str(target_leads)]
        if effective_proxy_file:
            cmd += ["--proxy-file", effective_proxy_file]
        if max_pages is not None:
            cmd += ["--max-pages", str(max_pages)]
        if timeout is not None:
            cmd += ["--timeout", str(timeout)]
    else:
        if to_webhook:
            cmd += ["--to-webhook"]
        if target_leads is not None:
            cmd += ["--target-leads", str(target_leads)]
        if effective_proxy_file:
            cmd += ["--proxy-file", effective_proxy_file]

    print(f"\nRunning {plugin} ...")
    log.info("Launching %s: %s", plugin, cmd)

    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as exc:
        log.error("Error running %s: %s", plugin, exc)
        print("Error running plugin. See data/logs/main.log")


def main():
    manifest = load_manifest()
    plugins = list_plugins(manifest)

    parser = argparse.ArgumentParser(description="SkunkScrape CLI Orchestrator")
    parser.add_argument("--plugin", help="Run a specific plugin")
    parser.add_argument("--category", help="Run all plugins in a category")
    parser.add_argument("--all", action="store_true", help="Run all plugins")
    parser.add_argument("--url", help="Seed URL or source input")
    parser.add_argument("--depth", type=int, help="Depth for smart_contact_crawler")
    parser.add_argument("--to-webhook", action="store_true", help="Send payload to webhook")
    parser.add_argument("--target-leads", type=int, help="Target lead count")
    parser.add_argument(
        "--proxy-file",
        help="Proxy file to pass to plugins. Defaults to the configured SkunkScrape proxy file.",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        help="Maximum pages to crawl for smart_contact_crawler",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        help="HTTP timeout in seconds for smart_contact_crawler",
    )
    args = parser.parse_args()

    proxy_file = getattr(args, "proxy_file", None)
    max_pages = getattr(args, "max_pages", None)
    timeout = getattr(args, "timeout", None)

    def build_run_kwargs():
        kwargs = {
            "url": args.url,
            "depth": args.depth,
            "to_webhook": args.to_webhook,
            "target_leads": args.target_leads,
        }
        if proxy_file is not None:
            kwargs["proxy_file"] = proxy_file
        if max_pages is not None:
            kwargs["max_pages"] = max_pages
        if timeout is not None:
            kwargs["timeout"] = timeout
        return kwargs

    if args.all:
        for plugin in plugins:
            run_plugin(plugin, **build_run_kwargs())
        return

    if args.category:
        if args.category not in manifest["categories"]:
            print(f"Unknown category: {args.category}")
            print("Available categories:", ", ".join(sorted(manifest["categories"].keys())))
            return

        for plugin in manifest["categories"][args.category]["plugins"]:
            run_plugin(plugin, **build_run_kwargs())
        return

    if args.plugin:
        if args.plugin not in plugins:
            print(f"Unknown plugin: {args.plugin}")
            print("Available plugins:", ", ".join(sorted(plugins.keys())))
            return

        run_plugin(args.plugin, **build_run_kwargs())
        return

    parser.print_help()


if __name__ == "__main__":
    main()