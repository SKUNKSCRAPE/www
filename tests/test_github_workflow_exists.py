from pathlib import Path


def test_github_tests_workflow_exists():
    workflow = Path(".github/workflows/tests.yml")
    assert workflow.exists(), ".github/workflows/tests.yml should exist"


def test_github_tests_workflow_has_expected_markers():
    workflow = Path(".github/workflows/tests.yml")
    content = workflow.read_text(encoding="utf-8")

    expected_terms = [
        "name: Tests",
        "actions/checkout@v4",
        "actions/setup-python@v5",
        "python -m pip install -e .",
        "python -m pip install -U pytest",
        "python -m pytest",
        'python-version: ["3.11", "3.12", "3.13"]',
    ]

    missing = [term for term in expected_terms if term not in content]
    assert not missing, f"Missing workflow terms: {missing}"


def test_github_tests_workflow_disables_submodules():
    workflow = Path(".github/workflows/tests.yml")
    content = workflow.read_text(encoding="utf-8")
    assert "submodules: false" in content