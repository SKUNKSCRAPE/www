from pathlib import Path


def test_scripts_directory_exists():
    assert Path("scripts").exists()
    assert Path("scripts").is_dir()


def test_core_operational_scripts_exist():
    expected = [
        "scripts/run_tests.ps1",
        "scripts/run_crawler.ps1",
        "scripts/repo_status.ps1",
        "scripts/commit_ready.ps1",
        "scripts/commit_project.ps1",
        "scripts/clean_artifacts.ps1",
        "scripts/bootstrap_dev.ps1",
    ]

    missing = [path for path in expected if not Path(path).exists()]
    assert not missing, f"Missing scripts: {missing}"


def test_main_project_files_exist():
    expected = [
        "main.py",
        "pyproject.toml",
        "README.md",
        "skunkscrape/plugins/manifest.json",
    ]

    missing = [path for path in expected if not Path(path).exists()]
    assert not missing, f"Missing core files: {missing}"