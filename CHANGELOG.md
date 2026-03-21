# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on Keep a Changelog and the project currently follows an internal semantic versioning approach.


## [2.2.1] - 2026-03-21

### Added

### Changed

### Fixed
## [2.2.0] - 2026-03-21

### Added
- Added `skunkscrape` Python package scaffold.
- Added plugin package under `skunkscrape/plugins/`.
- Added `manifest.json` for manifest-driven plugin registration.
- Added `smart_contact_crawler` plugin for public contact discovery.
- Added root CLI orchestrator in `main.py`.
- Added `pyproject.toml` for packaging and editable installs.
- Added project `README.md`.
- Added test coverage for:
  - manifest loading and registration
  - crawler URL normalization and deduplication
  - main CLI orchestration
  - run-plugin option pass-through
  - operational script presence
- Added PowerShell operational scripts:
  - `run_tests.ps1`
  - `run_crawler.ps1`
  - `repo_status.ps1`
  - `commit_ready.ps1`
  - `commit_project.ps1`
  - `clean_artifacts.ps1`
  - `bootstrap_dev.ps1`

### Changed
- Improved URL canonicalization in `smart_contact_crawler.py`.
- Improved deduplication of crawler records.
- Updated `main.py` to support:
  - `--proxy-file`
  - `--max-pages`
  - `--timeout`
- Improved README structure to unify web console and plugin toolkit positioning.
- Hardened `.gitignore` for generated artefacts and caches.

### Fixed
- Fixed UTF-8 BOM manifest loading issues by using `utf-8-sig`.
- Fixed duplicate homepage crawl behavior caused by variant URL formats.
- Fixed `run_crawler.ps1` so runtime parameters are actually forwarded to `main.py`.
- Fixed `commit_project.ps1` behavior when there is nothing new to commit.

### Notes
- Current baseline test status reached 22 passing tests during setup stabilization.
- Project remains positioned for both local toolkit use and future SaaS expansion.