#!/usr/bin/env python3
"""Generate and audit canonical entity metadata for 7ya.io.

The repository keeps identity data in data/entity-registry.json. This script
renders the managed metadata blocks in the homepage and canonical person page,
then verifies that the pages cannot drift back into competing Person schemas.

Usage:
    python3 scripts/entity_consistency.py --check
    python3 scripts/entity_consistency.py --check --json
    python3 scripts/entity_consistency.py --write
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / "data" / "entity-registry.json"
START_MARKER = "<!-- ENTITY_META:START -->"
END_MARKER = "<!-- ENTITY_META:END -->"
REQUIRED_ALTERNATE_NAMES = [
    "איגור ופרצקי",
    "Игорь Вепрецкий",
    "Ido Vepretski",
    "Igor Ido Vepretski",
    "עידו ופרצקי",
]
EXPECTED_IDS = {
    "person": "https://7ya.io/#igor",
    "website": "https://7ya.io/#website",
    "organization": "https://starton.org.il/#organization",
}
EXPECTED_URLS = {
    "home": "https://7ya.io/",
    "person": "https://7ya.io/igor-vepretski/",
    "organization": "https://starton.org.il/",
}


class EntityAuditError(RuntimeError):
    """Raised for malformed registry or page state."""


@dataclass
class ParsedPage:
    title: str = ""
    h1: str = ""
    canonicals: list[str] = field(default_factory=list)
    metadata: dict[str, str] = field(default_factory=dict)
    jsonld: list[Any] = field(default_factory=list)
    jsonld_errors: list[str] = field(default_factory=list)


class PageParser(HTMLParser):
    """Small, dependency-free HTML extractor for SEO-critical fields."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.page = ParsedPage()
        self._capture: str | None = None
        self._buffer: list[str] = []
        self._h1_depth = 0
        self._script_is_jsonld = False

    @staticmethod
    def _attrs(attrs: list[tuple[str, str | None]]) -> dict[str, str]:
        return {key.lower(): value or "" for key, value in attrs}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        values = self._attrs(attrs)

        if tag == "title":
            self._capture = "title"
            self._buffer = []
        elif tag == "h1":
            self._h1_depth = 1
            self._capture = "h1"
            self._buffer = []
        elif self._h1_depth and tag not in {"script", "style"}:
            self._h1_depth += 1
        elif tag == "link" and values.get("rel", "").lower() == "canonical":
            self.page.canonicals.append(values.get("href", ""))
        elif tag == "meta":
            key = values.get("name") or values.get("property")
            if key:
                self.page.metadata[key.lower()] = values.get("content", "")
        elif tag == "script" and values.get("type", "").lower() == "application/ld+json":
            self._script_is_jsonld = True
            self._capture = "jsonld"
            self._buffer = []

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title" and self._capture == "title":
            self.page.title = _collapse("".join(self._buffer))
            self._capture = None
            self._buffer = []
        elif tag == "h1" and self._h1_depth:
            self._h1_depth -= 1
            if self._h1_depth == 0 and self._capture == "h1":
                self.page.h1 = _collapse("".join(self._buffer))
                self._capture = None
                self._buffer = []
        elif tag == "script" and self._script_is_jsonld:
            raw = "".join(self._buffer).strip()
            try:
                self.page.jsonld.append(json.loads(raw))
            except json.JSONDecodeError as exc:
                self.page.jsonld_errors.append(f"Invalid JSON-LD: {exc}")
            self._script_is_jsonld = False
            self._capture = None
            self._buffer = []

    def handle_data(self, data: str) -> None:
        if self._capture:
            self._buffer.append(data)


@dataclass
class AuditReport:
    violations: list[str] = field(default_factory=list)
    checked_files: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.violations

    def fail(self, message: str) -> None:
        self.violations.append(message)


def _collapse(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def _escape(value: str) -> str:
    return html.escape(value, quote=True)


def load_registry(path: Path = REGISTRY_PATH) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise EntityAuditError(f"Registry not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise EntityAuditError(f"Registry is not valid JSON: {exc}") from exc

    ids = data.get("ids", {})
    for key, expected in EXPECTED_IDS.items():
        if ids.get(key) != expected:
            raise EntityAuditError(f"ids.{key} must be {expected!r}")

    person = data.get("person", {})
    organization = data.get("organization", {})
    pages = data.get("pages", {})
    if person.get("name") != "Igor Vepretski":
        raise EntityAuditError("person.name must be 'Igor Vepretski'")
    if person.get("url") != EXPECTED_URLS["person"]:
        raise EntityAuditError("person.url must point to the canonical person page")
    if organization.get("url") != EXPECTED_URLS["organization"]:
        raise EntityAuditError("organization.url must point to StartOn")
    if pages.get("home", {}).get("url") != EXPECTED_URLS["home"]:
        raise EntityAuditError("pages.home.url is invalid")
    if pages.get("person", {}).get("url") != EXPECTED_URLS["person"]:
        raise EntityAuditError("pages.person.url is invalid")

    alternate_names = person.get("alternateName")
    if alternate_names != REQUIRED_ALTERNATE_NAMES:
        raise EntityAuditError("person.alternateName must match the approved ordered list")

    same_as = person.get("sameAs")
    if not isinstance(same_as, list) or not same_as:
        raise EntityAuditError("person.sameAs must be a non-empty list")
    if len(same_as) != len(set(same_as)):
        raise EntityAuditError("person.sameAs contains duplicate URLs")
    if organization["url"] in same_as or EXPECTED_IDS["organization"] in same_as:
        raise EntityAuditError("StartOn must not appear in Person.sameAs")
    if any(not isinstance(url, str) or not url.startswith("https://") for url in same_as):
        raise EntityAuditError("Every person.sameAs entry must be an HTTPS URL")

    return data


def homepage_schema(registry: dict[str, Any]) -> dict[str, Any]:
    page = registry["pages"]["home"]
    ids = registry["ids"]
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": ids["website"],
                "name": "7YA.IO",
                "url": page["url"],
                "inLanguage": ["he", "ru", "en"],
            },
            {
                "@type": "WebPage",
                "@id": f'{page["url"]}#webpage',
                "url": page["url"],
                "name": page["title"],
                "description": page["description"],
                "isPartOf": {"@id": ids["website"]},
                "about": {"@id": ids["person"]},
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": page["image"],
                },
            },
        ],
    }


def person_schema(registry: dict[str, Any]) -> dict[str, Any]:
    page = registry["pages"]["person"]
    person = registry["person"]
    organization = registry["organization"]
    ids = registry["ids"]
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ProfilePage",
                "@id": f'{page["url"]}#profile',
                "url": page["url"],
                "name": page["title"],
                "description": page["description"],
                "isPartOf": {"@id": ids["website"]},
                "mainEntity": {"@id": ids["person"]},
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": page["image"],
                },
            },
            {
                "@type": "Person",
                "@id": ids["person"],
                "name": person["name"],
                "alternateName": person["alternateName"],
                "url": person["url"],
                "image": person["image"],
                "description": person["description"],
                "jobTitle": person["jobTitle"],
                "affiliation": {"@id": ids["organization"]},
                "sameAs": person["sameAs"],
            },
            {
                "@type": "Organization",
                "@id": ids["organization"],
                "name": organization["name"],
                "url": organization["url"],
                "description": organization["description"],
                "founder": {"@id": ids["person"]},
            },
        ],
    }


def render_meta_block(registry: dict[str, Any], page_key: str) -> str:
    page = registry["pages"][page_key]
    schema = homepage_schema(registry) if page_key == "home" else person_schema(registry)
    jsonld = json.dumps(schema, ensure_ascii=False, separators=(",", ":"))
    lines = [
        START_MARKER,
        f'  <title>{_escape(page["title"])}</title>',
        f'  <meta name="description" content="{_escape(page["description"])}">',
        f'  <link rel="canonical" href="{_escape(page["url"])}">',
        f'  <link rel="author" href="{_escape(registry["person"]["url"])}">',
        f'  <meta property="og:type" content="{_escape(page["ogType"])}">',
        '  <meta property="og:site_name" content="7YA.IO">',
        '  <meta property="og:locale" content="he_IL">',
        f'  <meta property="og:title" content="{_escape(page["ogTitle"])}">',
        f'  <meta property="og:description" content="{_escape(page["ogDescription"])}">',
        f'  <meta property="og:url" content="{_escape(page["url"])}">',
        f'  <meta property="og:image" content="{_escape(page["image"])}">',
        '  <meta name="twitter:card" content="summary_large_image">',
        f'  <meta name="twitter:title" content="{_escape(page["ogTitle"])}">',
        f'  <meta name="twitter:description" content="{_escape(page["ogDescription"])}">',
        f'  <meta name="twitter:image" content="{_escape(page["image"])}">',
        f'  <script type="application/ld+json">{jsonld}</script>',
        END_MARKER,
    ]
    return "\n".join(lines)


def replace_managed_block(path: Path, block: str) -> bool:
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(
        rf"{re.escape(START_MARKER)}.*?{re.escape(END_MARKER)}",
        flags=re.DOTALL,
    )
    if not pattern.search(text):
        raise EntityAuditError(f"Managed metadata markers missing in {path.relative_to(ROOT)}")
    updated = pattern.sub(block, text, count=1)
    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8", newline="\n")
    return True


def parse_page(path: Path) -> ParsedPage:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser.page


def graph_nodes(documents: Iterable[Any]) -> list[dict[str, Any]]:
    nodes: list[dict[str, Any]] = []
    for document in documents:
        if isinstance(document, dict):
            graph = document.get("@graph")
            if isinstance(graph, list):
                nodes.extend(node for node in graph if isinstance(node, dict))
            else:
                nodes.append(document)
        elif isinstance(document, list):
            nodes.extend(node for node in document if isinstance(node, dict))
    return nodes


def types_of(node: dict[str, Any]) -> set[str]:
    value = node.get("@type")
    if isinstance(value, str):
        return {value}
    if isinstance(value, list):
        return {item for item in value if isinstance(item, str)}
    return set()


def nodes_of_type(nodes: list[dict[str, Any]], schema_type: str) -> list[dict[str, Any]]:
    return [node for node in nodes if schema_type in types_of(node)]


def _expect_equal(report: AuditReport, label: str, actual: Any, expected: Any) -> None:
    if actual != expected:
        report.fail(f"{label}: expected {expected!r}, found {actual!r}")


def audit_page(
    report: AuditReport,
    registry: dict[str, Any],
    page_key: str,
    parsed: ParsedPage,
) -> list[dict[str, Any]]:
    page = registry["pages"][page_key]
    label = page["path"]
    report.checked_files.append(label)

    if parsed.jsonld_errors:
        for error in parsed.jsonld_errors:
            report.fail(f"{label}: {error}")

    _expect_equal(report, f"{label} title", parsed.title, page["title"])
    _expect_equal(report, f"{label} canonical", parsed.canonicals, [page["url"]])

    expected_meta = {
        "description": page["description"],
        "og:type": page["ogType"],
        "og:site_name": "7YA.IO",
        "og:locale": "he_IL",
        "og:title": page["ogTitle"],
        "og:description": page["ogDescription"],
        "og:url": page["url"],
        "og:image": page["image"],
        "twitter:card": "summary_large_image",
        "twitter:title": page["ogTitle"],
        "twitter:description": page["ogDescription"],
        "twitter:image": page["image"],
    }
    for key, expected in expected_meta.items():
        _expect_equal(report, f"{label} meta[{key}]", parsed.metadata.get(key), expected)

    return graph_nodes(parsed.jsonld)


def audit(root: Path, registry: dict[str, Any]) -> AuditReport:
    report = AuditReport()
    parsed_home = parse_page(root / registry["pages"]["home"]["path"])
    parsed_person = parse_page(root / registry["pages"]["person"]["path"])
    home_nodes = audit_page(report, registry, "home", parsed_home)
    person_nodes = audit_page(report, registry, "person", parsed_person)

    if "איגור ופרצקי" not in parsed_person.h1 or "Igor Vepretski" not in parsed_person.h1:
        report.fail(
            "igor-vepretski/index.html H1 must contain both 'איגור ופרצקי' and 'Igor Vepretski'"
        )

    if nodes_of_type(home_nodes, "Person"):
        report.fail("index.html must reference the Person by @id, not declare a Person node")
    if nodes_of_type(home_nodes, "ProfilePage"):
        report.fail("index.html must be WebPage, not a competing ProfilePage")
    if len(nodes_of_type(home_nodes, "WebSite")) != 1:
        report.fail("index.html must declare exactly one WebSite node")
    home_webpages = nodes_of_type(home_nodes, "WebPage")
    if len(home_webpages) != 1:
        report.fail("index.html must declare exactly one WebPage node")
    else:
        _expect_equal(
            report,
            "index.html WebPage.about",
            home_webpages[0].get("about"),
            {"@id": registry["ids"]["person"]},
        )

    profile_pages = nodes_of_type(person_nodes, "ProfilePage")
    people = nodes_of_type(person_nodes, "Person")
    organizations = nodes_of_type(person_nodes, "Organization")
    if len(profile_pages) != 1:
        report.fail("igor-vepretski/index.html must declare exactly one ProfilePage")
    if len(people) != 1:
        report.fail("igor-vepretski/index.html must declare exactly one Person")
    if len(organizations) != 1:
        report.fail("igor-vepretski/index.html must declare exactly one Organization")

    if profile_pages:
        _expect_equal(
            report,
            "ProfilePage.mainEntity",
            profile_pages[0].get("mainEntity"),
            {"@id": registry["ids"]["person"]},
        )

    if people:
        person = people[0]
        expected_person = registry["person"]
        _expect_equal(report, "Person.@id", person.get("@id"), registry["ids"]["person"])
        _expect_equal(report, "Person.name", person.get("name"), expected_person["name"])
        _expect_equal(
            report,
            "Person.alternateName",
            person.get("alternateName"),
            expected_person["alternateName"],
        )
        _expect_equal(report, "Person.url", person.get("url"), expected_person["url"])
        _expect_equal(report, "Person.sameAs", person.get("sameAs"), expected_person["sameAs"])
        _expect_equal(
            report,
            "Person.affiliation",
            person.get("affiliation"),
            {"@id": registry["ids"]["organization"]},
        )
        if EXPECTED_URLS["organization"] in person.get("sameAs", []):
            report.fail("StartOn must never be present in Person.sameAs")

    if organizations:
        organization = organizations[0]
        _expect_equal(
            report,
            "Organization.@id",
            organization.get("@id"),
            registry["ids"]["organization"],
        )
        _expect_equal(
            report,
            "Organization.url",
            organization.get("url"),
            registry["organization"]["url"],
        )
        _expect_equal(
            report,
            "Organization.founder",
            organization.get("founder"),
            {"@id": registry["ids"]["person"]},
        )

    all_nodes = home_nodes + person_nodes
    if len(nodes_of_type(all_nodes, "Person")) != 1:
        report.fail("The two audited pages must contain exactly one Person declaration in total")
    if len(nodes_of_type(all_nodes, "ProfilePage")) != 1:
        report.fail("The two audited pages must contain exactly one ProfilePage declaration in total")

    return report


def print_report(report: AuditReport, as_json: bool) -> None:
    payload = {
        "ok": report.ok,
        "checkedFiles": report.checked_files,
        "violations": report.violations,
    }
    if as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return

    status = "PASS" if report.ok else "FAIL"
    print(f"Entity consistency audit: {status}")
    print(f"Checked: {', '.join(report.checked_files)}")
    if report.violations:
        for index, violation in enumerate(report.violations, start=1):
            print(f"  {index}. {violation}")
    else:
        print("No canonical, metadata, JSON-LD, H1, sameAs, or entity hierarchy drift detected.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true", help="Audit files without changing them")
    mode.add_argument("--write", action="store_true", help="Regenerate managed metadata, then audit")
    parser.add_argument("--json", action="store_true", help="Print the audit result as JSON")
    args = parser.parse_args(argv)

    try:
        registry = load_registry()
        if args.write:
            changed: list[str] = []
            for page_key in ("home", "person"):
                relative = registry["pages"][page_key]["path"]
                if replace_managed_block(ROOT / relative, render_meta_block(registry, page_key)):
                    changed.append(relative)
            if not args.json:
                if changed:
                    print(f"Regenerated entity metadata: {', '.join(changed)}")
                else:
                    print("Entity metadata already matches the registry.")

        report = audit(ROOT, registry)
        print_report(report, args.json)
        return 0 if report.ok else 1
    except (EntityAuditError, OSError) as exc:
        if args.json:
            print(json.dumps({"ok": False, "fatal": str(exc)}, ensure_ascii=False, indent=2))
        else:
            print(f"Entity consistency audit: FATAL\n  {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
