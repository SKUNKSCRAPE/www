import json
from pathlib import Path

import main as main_module


def test_load_manifest_reads_utf8_sig_file(tmp_path, monkeypatch):
    manifest_path = tmp_path / "manifest.json"
    manifest_data = {
        "categories": {
            "lead_generation": {
                "label": "Lead Generation",
                "description": "Contact discovery workflows.",
                "plugins": ["smart_contact_crawler"],
            }
        }
    }

    manifest_path.write_text(
        json.dumps(manifest_data, indent=2),
        encoding="utf-8-sig",
    )

    monkeypatch.setattr(main_module, "MANIFEST_PATH", manifest_path)

    loaded = main_module.load_manifest()

    assert loaded["categories"]["lead_generation"]["plugins"] == ["smart_contact_crawler"]


def test_list_plugins_flattens_manifest_categories():
    manifest = {
        "categories": {
            "lead_generation": {
                "plugins": ["smart_contact_crawler", "directory_scraper"]
            },
            "enrichment": {
                "plugins": ["company_enricher"]
            },
        }
    }

    plugins = main_module.list_plugins(manifest)

    assert plugins == {
        "smart_contact_crawler": "smart_contact_crawler",
        "directory_scraper": "directory_scraper",
        "company_enricher": "company_enricher",
    }


def test_run_plugin_builds_smart_contact_crawler_command(monkeypatch):
    captured = {}

    def fake_run(cmd, check):
        captured["cmd"] = cmd
        captured["check"] = check

    monkeypatch.setattr(main_module.subprocess, "run", fake_run)
    monkeypatch.setattr(main_module, "DEFAULT_PROXY_FILE", r"C:\temp\proxies.txt")

    main_module.run_plugin(
        "smart_contact_crawler",
        url="https://example.com",
        depth=2,
        to_webhook=True,
        target_leads=25,
    )

    assert captured["check"] is True
    assert captured["cmd"] == [
        "python",
        "-m",
        "skunkscrape.plugins.smart_contact_crawler",
        "--url",
        "https://example.com",
        "--depth",
        "2",
        "--to-webhook",
        "--target-leads",
        "25",
        "--proxy-file",
        r"C:\temp\proxies.txt",
    ]


def test_main_unknown_plugin_prints_available_plugins(monkeypatch, capsys):
    manifest = {
        "categories": {
            "lead_generation": {
                "label": "Lead Generation",
                "description": "Contact discovery workflows.",
                "plugins": ["smart_contact_crawler"],
            }
        }
    }

    monkeypatch.setattr(main_module, "load_manifest", lambda: manifest)
    monkeypatch.setattr(
        main_module.argparse.ArgumentParser,
        "parse_args",
        lambda self: main_module.argparse.Namespace(
            plugin="does_not_exist",
            category=None,
            all=False,
            url=None,
            depth=None,
            to_webhook=False,
            target_leads=None,
        ),
    )

    main_module.main()
    output = capsys.readouterr().out

    assert "Unknown plugin: does_not_exist" in output
    assert "smart_contact_crawler" in output


def test_main_unknown_category_prints_available_categories(monkeypatch, capsys):
    manifest = {
        "categories": {
            "lead_generation": {
                "label": "Lead Generation",
                "description": "Contact discovery workflows.",
                "plugins": ["smart_contact_crawler"],
            }
        }
    }

    monkeypatch.setattr(main_module, "load_manifest", lambda: manifest)
    monkeypatch.setattr(
        main_module.argparse.ArgumentParser,
        "parse_args",
        lambda self: main_module.argparse.Namespace(
            plugin=None,
            category="wrong_category",
            all=False,
            url=None,
            depth=None,
            to_webhook=False,
            target_leads=None,
        ),
    )

    main_module.main()
    output = capsys.readouterr().out

    assert "Unknown category: wrong_category" in output
    assert "lead_generation" in output


def test_main_runs_plugin_for_category(monkeypatch):
    manifest = {
        "categories": {
            "lead_generation": {
                "label": "Lead Generation",
                "description": "Contact discovery workflows.",
                "plugins": ["smart_contact_crawler"],
            }
        }
    }

    calls = []

    def fake_run_plugin(plugin, url=None, depth=None, to_webhook=False, target_leads=None):
        calls.append(
            {
                "plugin": plugin,
                "url": url,
                "depth": depth,
                "to_webhook": to_webhook,
                "target_leads": target_leads,
            }
        )

    monkeypatch.setattr(main_module, "load_manifest", lambda: manifest)
    monkeypatch.setattr(main_module, "run_plugin", fake_run_plugin)
    monkeypatch.setattr(
        main_module.argparse.ArgumentParser,
        "parse_args",
        lambda self: main_module.argparse.Namespace(
            plugin=None,
            category="lead_generation",
            all=False,
            url="https://example.com",
            depth=1,
            to_webhook=True,
            target_leads=10,
        ),
    )

    main_module.main()

    assert calls == [
        {
            "plugin": "smart_contact_crawler",
            "url": "https://example.com",
            "depth": 1,
            "to_webhook": True,
            "target_leads": 10,
        }
    ]


def test_main_runs_specific_plugin(monkeypatch):
    manifest = {
        "categories": {
            "lead_generation": {
                "label": "Lead Generation",
                "description": "Contact discovery workflows.",
                "plugins": ["smart_contact_crawler"],
            }
        }
    }

    calls = []

    def fake_run_plugin(plugin, url=None, depth=None, to_webhook=False, target_leads=None):
        calls.append(
            {
                "plugin": plugin,
                "url": url,
                "depth": depth,
                "to_webhook": to_webhook,
                "target_leads": target_leads,
            }
        )

    monkeypatch.setattr(main_module, "load_manifest", lambda: manifest)
    monkeypatch.setattr(main_module, "run_plugin", fake_run_plugin)
    monkeypatch.setattr(
        main_module.argparse.ArgumentParser,
        "parse_args",
        lambda self: main_module.argparse.Namespace(
            plugin="smart_contact_crawler",
            category=None,
            all=False,
            url="https://skunkworks.africa",
            depth=3,
            to_webhook=False,
            target_leads=100,
        ),
    )

    main_module.main()

    assert calls == [
        {
            "plugin": "smart_contact_crawler",
            "url": "https://skunkworks.africa",
            "depth": 3,
            "to_webhook": False,
            "target_leads": 100,
        }
    ]