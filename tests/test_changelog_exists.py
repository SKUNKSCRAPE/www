from pathlib import Path


def test_changelog_exists():
    changelog = Path("CHANGELOG.md")
    assert changelog.exists(), "CHANGELOG.md should exist"


def test_changelog_has_current_version_entry():
    changelog = Path("CHANGELOG.md")
    content = changelog.read_text(encoding="utf-8")
    assert "# Changelog" in content
    assert "## [2.2.0] - 2026-03-21" in content


def test_changelog_mentions_core_components():
    changelog = Path("CHANGELOG.md")
    content = changelog.read_text(encoding="utf-8")

    expected_terms = [
        "smart_contact_crawler",
        "main.py",
        "pyproject.toml",
        "manifest.json",
        "run_crawler.ps1",
        "commit_ready.ps1",
    ]

    missing = [term for term in expected_terms if term not in content]
    assert not missing, f"Missing changelog terms: {missing}"