from skunkscrape.plugins.smart_contact_crawler import (
    SmartContactCrawler,
    canonicalize_url,
    same_domain,
    sanitize_filename,
)


def test_canonicalize_url_adds_https_and_normalizes_path():
    assert canonicalize_url("example.com/contact/") == "https://example.com/contact"


def test_canonicalize_url_removes_fragment_and_tracking_query():
    url = "HTTPS://Example.com///about///?utm_source=google&b=2&a=1#team"
    assert canonicalize_url(url) == "https://example.com/about?a=1&b=2"


def test_canonicalize_url_keeps_non_tracking_query_parameters():
    url = "https://example.com/search/?q=skunkscrape&utm_medium=email&page=2"
    assert canonicalize_url(url) == "https://example.com/search?page=2&q=skunkscrape"


def test_same_domain_ignores_www_and_scheme():
    assert same_domain("http://www.example.com", "https://example.com/contact")
    assert same_domain("https://example.com", "https://www.example.com/about")


def test_same_domain_rejects_different_domains():
    assert not same_domain("https://example.com", "https://example.org")
    assert not same_domain("https://example.com", "https://sub.example.org/contact")


def test_sanitize_filename_normalizes_text():
    assert sanitize_filename(" Rambrass South Africa / Leads ") == "Rambrass_South_Africa_Leads"


def test_sanitize_filename_falls_back_to_output():
    assert sanitize_filename("////") == "output"
    assert sanitize_filename("...") == "output"


def test_deduplicate_records_merges_matching_canonical_urls():
    crawler = SmartContactCrawler(seed_url="https://example.com", depth=1)

    records = [
        {
            "source_url": "https://example.com/contact/?utm_source=google",
            "page_title": "Contact Us",
            "business_name": "Example Co",
            "emails": ["info@example.com"],
            "phones": ["27110000000"],
            "linkedin": ["https://linkedin.com/company/example"],
            "facebook": [],
            "instagram": [],
            "x": [],
            "youtube": [],
            "tiktok": [],
            "whatsapp": [],
            "contact_links": ["https://example.com/contact"],
            "address_excerpt": "",
            "internal_link_count": 3,
            "external_link_count": 1,
        },
        {
            "source_url": "https://example.com/contact#team",
            "page_title": "",
            "business_name": "",
            "emails": ["sales@example.com", "info@example.com"],
            "phones": ["27110000000", "27119999999"],
            "linkedin": [],
            "facebook": ["https://facebook.com/example"],
            "instagram": [],
            "x": [],
            "youtube": [],
            "tiktok": [],
            "whatsapp": ["https://wa.me/27119999999"],
            "contact_links": ["https://example.com/contact", "https://example.com/about"],
            "address_excerpt": "1 Example Street",
            "internal_link_count": 5,
            "external_link_count": 2,
        },
    ]

    merged = crawler.deduplicate_records(records)

    assert len(merged) == 1

    record = merged[0]
    assert record["source_url"] == "https://example.com/contact"
    assert sorted(record["emails"]) == ["info@example.com", "sales@example.com"]
    assert sorted(record["phones"]) == ["27110000000", "27119999999"]
    assert record["linkedin"] == ["https://linkedin.com/company/example"]
    assert record["facebook"] == ["https://facebook.com/example"]
    assert record["whatsapp"] == ["https://wa.me/27119999999"]
    assert sorted(record["contact_links"]) == [
        "https://example.com/about",
        "https://example.com/contact",
    ]
    assert record["page_title"] == "Contact Us"
    assert record["business_name"] == "Example Co"
    assert record["address_excerpt"] == "1 Example Street"
    assert record["internal_link_count"] == 5
    assert record["external_link_count"] == 2