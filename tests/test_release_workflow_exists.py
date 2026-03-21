from pathlib import Path


def test_release_check_workflow_exists():
    workflow = Path(".github/workflows/release-check.yml")
    assert workflow.exists(), ".github/workflows/release-check.yml should exist"


def test_release_check_workflow_has_expected_markers():
    workflow = Path(".github/workflows/release-check.yml")
    content = workflow.read_text(encoding="utf-8")

    expected_terms = [
        "name: Release Check",
        "actions/checkout@v4",
        "actions/setup-python@v5",
        'python-version: "3.13"',
        "python -m pip install -e .",
        "python -m pip install -U pytest",
        "python -m pytest",
        "CHANGELOG.md",
        "README.md",
        "scripts/tag_release.ps1",
        "scripts/version_bump.ps1",
        "scripts/release_snapshot.ps1",
    ]

    missing = [term for term in expected_terms if term not in content]
    assert not missing, f"Missing workflow terms: {missing}"


def test_release_check_workflow_disables_submodules():
    workflow = Path(".github/workflows/release-check.yml")
    content = workflow.read_text(encoding="utf-8")
    assert "submodules: false" in content