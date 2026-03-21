import main as main_module


def test_run_plugin_includes_all_smart_contact_crawler_options(monkeypatch):
    captured = {}

    def fake_run(cmd, check):
        captured["cmd"] = cmd
        captured["check"] = check

    monkeypatch.setattr(main_module.subprocess, "run", fake_run)

    main_module.run_plugin(
        "smart_contact_crawler",
        url="https://example.com",
        depth=2,
        to_webhook=True,
        target_leads=25,
        proxy_file=r"C:\temp\proxies.txt",
        max_pages=10,
        timeout=15,
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
        "--max-pages",
        "10",
        "--timeout",
        "15",
    ]


def test_run_plugin_uses_default_proxy_file_when_none_provided(monkeypatch):
    captured = {}

    def fake_run(cmd, check):
        captured["cmd"] = cmd
        captured["check"] = check

    monkeypatch.setattr(main_module.subprocess, "run", fake_run)
    monkeypatch.setattr(main_module, "DEFAULT_PROXY_FILE", r"C:\default\proxies.txt")

    main_module.run_plugin(
        "smart_contact_crawler",
        url="https://example.com",
        depth=1,
    )

    assert captured["check"] is True
    assert "--proxy-file" in captured["cmd"]
    assert r"C:\default\proxies.txt" in captured["cmd"]


def test_run_plugin_omits_optional_crawler_flags_when_not_provided(monkeypatch):
    captured = {}

    def fake_run(cmd, check):
        captured["cmd"] = cmd
        captured["check"] = check

    monkeypatch.setattr(main_module.subprocess, "run", fake_run)
    monkeypatch.setattr(main_module, "DEFAULT_PROXY_FILE", r"C:\default\proxies.txt")

    main_module.run_plugin(
        "smart_contact_crawler",
        url="https://example.com",
    )

    cmd = captured["cmd"]

    assert captured["check"] is True
    assert "--url" in cmd
    assert "https://example.com" in cmd
    assert "--proxy-file" in cmd
    assert r"C:\default\proxies.txt" in cmd
    assert "--depth" not in cmd
    assert "--to-webhook" not in cmd
    assert "--target-leads" not in cmd
    assert "--max-pages" not in cmd
    assert "--timeout" not in cmd


def test_run_plugin_non_crawler_still_gets_shared_options(monkeypatch):
    captured = {}

    def fake_run(cmd, check):
        captured["cmd"] = cmd
        captured["check"] = check

    monkeypatch.setattr(main_module.subprocess, "run", fake_run)

    main_module.run_plugin(
        "some_other_plugin",
        url="https://example.com",
        to_webhook=True,
        target_leads=50,
        proxy_file=r"C:\temp\proxies.txt",
    )

    assert captured["check"] is True
    assert captured["cmd"] == [
        "python",
        "-m",
        "skunkscrape.plugins.some_other_plugin",
        "--url",
        "https://example.com",
        "--to-webhook",
        "--target-leads",
        "50",
        "--proxy-file",
        r"C:\temp\proxies.txt",
    ]