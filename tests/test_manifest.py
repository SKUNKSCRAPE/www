import json
from pathlib import Path


def test_manifest_exists():
    manifest_path = Path("skunkscrape/plugins/manifest.json")
    assert manifest_path.exists(), "manifest.json should exist"


def test_manifest_has_categories():
    manifest_path = Path("skunkscrape/plugins/manifest.json")
    data = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
    assert "categories" in data
    assert isinstance(data["categories"], dict)
    assert "lead_generation" in data["categories"]


def test_smart_contact_crawler_registered():
    manifest_path = Path("skunkscrape/plugins/manifest.json")
    data = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
    plugins = data["categories"]["lead_generation"]["plugins"]
    assert "smart_contact_crawler" in plugins