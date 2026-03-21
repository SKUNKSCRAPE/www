from pathlib import Path


def test_version_bump_script_exists():
    script = Path("scripts/version_bump.ps1")
    assert script.exists(), "scripts/version_bump.ps1 should exist"


def test_version_bump_script_has_expected_markers():
    script = Path("scripts/version_bump.ps1")
    content = script.read_text(encoding="utf-8")

    expected_terms = [
        "SkunkScrape Version Bump",
        "pyproject.toml",
        "skunkscrape\\__init__.py",
        "skunkscrape\\plugins\\manifest.json",
        "CHANGELOG.md",
        "semantic format like 2.2.1",
        "Version bump completed successfully.",
    ]

    missing = [term for term in expected_terms if term not in content]
    assert not missing, f"Missing script terms: {missing}"


def test_version_bump_script_targets_version_fields():
    script = Path("scripts/version_bump.ps1")
    content = script.read_text(encoding="utf-8")

    expected_terms = [
        'version\\s*=\\s*"',
        '__version__\\s*=\\s*"',
        "app']['version",
    ]

    missing = [term for term in expected_terms if term not in content]
    assert not missing, f"Missing version bump targets: {missing}"