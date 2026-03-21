"""
SkunkScrape plugin package.

This package contains runnable scraper and enrichment plugins used by:
- main.py (CLI orchestrator)
- main_gui.py (desktop launcher)

Each plugin should expose a CLI-style entry point so it can be executed with:
    python -m skunkscrape.plugins.<plugin_name>

Recommended plugin conventions:
- accept --url when applicable
- accept --proxy-file when network requests are used
- support structured logging
- write outputs to a predictable data/output path
"""
