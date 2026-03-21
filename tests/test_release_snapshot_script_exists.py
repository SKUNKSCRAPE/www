from pathlib import Path


def test_release_snapshot_script_exists():
    script = Path("scripts/release_snapshot.ps1")
    assert script.exists(), "scripts/release_snapshot.ps1 should exist"


def test_release_snapshot_script_has_expected_markers():
    script = Path("scripts/release_snapshot.ps1")
    content = script.read_text(encoding="utf-8")

    expected_terms = [
        "SkunkScrape Release Snapshot",
        "data\\release_snapshots",
        "python -m pytest",
        "git status --short",
        "CHANGELOG.md",
    ]

    missing = [term for term in expected_terms if term not in content]
    assert not missing, f"Missing script terms: {missing}"


def test_release_snapshot_output_folder_concept_present():
    script = Path("scripts/release_snapshot.ps1")
    content = script.read_text(encoding="utf-8")
    assert "release_snapshot_" in content