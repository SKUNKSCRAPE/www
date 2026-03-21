from pathlib import Path


def test_tag_release_script_exists():
    script = Path("scripts/tag_release.ps1")
    assert script.exists(), "scripts/tag_release.ps1 should exist"


def test_tag_release_script_has_expected_markers():
    script = Path("scripts/tag_release.ps1")
    content = script.read_text(encoding="utf-8")

    expected_terms = [
        "SkunkScrape Release Tagging",
        "CHANGELOG.md",
        "commit_ready.ps1",
        "git status --porcelain",
        "git tag -a",
        "git push origin",
        "Release tagging completed successfully.",
    ]

    missing = [term for term in expected_terms if term not in content]
    assert not missing, f"Missing script terms: {missing}"


def test_tag_release_script_uses_versioned_tag_pattern():
    script = Path("scripts/tag_release.ps1")
    content = script.read_text(encoding="utf-8")
    assert '$tagName = "v$normalizedVersion"' in content