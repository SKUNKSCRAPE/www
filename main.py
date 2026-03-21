import argparse
import logging
import subprocess
import json
from pathlib import Path

LOG_DIR = Path("data/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    filename=str(LOG_DIR / "main.log"),
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
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


def run_plugin(plugin, url=None, depth=None, to_webhook=False, target_leads=None):
    cmd = ["python", "-m", f"skunkscrape.plugins.{plugin}"]

    if url:
        if plugin == "smart_contact_crawler":
            cmd += ["--url", url]
        else:
            cmd += ["--url", url, "--category", url, "--search", url]

    if plugin == "smart_contact_crawler" and depth:
        cmd += ["--depth", str(depth)]

    if to_webhook:
        cmd += ["--to-webhook"]

    if target_leads:
        cmd += ["--target-leads", str(target_leads)]

    cmd += ["--proxy-file", DEFAULT_PROXY_FILE]

    print(f"`nRunning {plugin} ...")
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
    args = parser.parse_args()

    if args.all:
        for plugin in plugins:
            run_plugin(
                plugin,
                url=args.url,
                depth=args.depth,
                to_webhook=args.to_webhook,
                target_leads=args.target_leads,
            )
        return

    if args.category:
        if args.category not in manifest["categories"]:
            print(f"Unknown category: {args.category}")
            print("Available categories:", ", ".join(sorted(manifest["categories"].keys())))
            return

        for plugin in manifest["categories"][args.category]["plugins"]:
            run_plugin(
                plugin,
                url=args.url,
                depth=args.depth,
                to_webhook=args.to_webhook,
                target_leads=args.target_leads,
            )
        return

    if args.plugin:
        if args.plugin not in plugins:
            print(f"Unknown plugin: {args.plugin}")
            print("Available plugins:", ", ".join(sorted(plugins.keys())))
            return

        run_plugin(
            args.plugin,
            url=args.url,
            depth=args.depth,
            to_webhook=args.to_webhook,
            target_leads=args.target_leads,
        )
        return

    parser.print_help()


if __name__ == "__main__":
    main()


