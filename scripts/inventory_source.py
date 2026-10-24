#!/usr/bin/env python3
"""Inventory a public, same-origin website without third-party dependencies.

This is a source capture helper, not a guarantee of complete site coverage.
JavaScript-generated links and CSS background URLs need separate manual review.
"""

from __future__ import annotations

import argparse
import hashlib
from collections import deque
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
from pathlib import Path
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urldefrag, urljoin, urlsplit, urlunsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener


ASSET_SUFFIXES = {
    ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif",
    ".ico", ".pdf", ".css", ".woff", ".woff2", ".ttf",
}
PAGE_SUFFIXES = {"", ".html", ".htm", ".php", ".asp", ".aspx"}
DEFAULT_LIMIT = 20 * 1024 * 1024


def normalized_url(raw: str, base: str) -> str | None:
    absolute, _ = urldefrag(urljoin(base, raw.strip()))
    parts = urlsplit(absolute)
    if parts.scheme not in {"https", "http"} or not parts.hostname:
        return None
    if parts.username or parts.password:
        return None
    return urlunsplit((parts.scheme, parts.netloc.lower(), parts.path or "/", parts.query, ""))


class PageLinks(HTMLParser):
    def __init__(self, base: str):
        super().__init__(convert_charrefs=True)
        self.base = base
        self.links: list[str] = []
        self.images: list[dict[str, str]] = []
        self.title_parts: list[str] = []
        self.text_parts: list[str] = []
        self.in_title = False
        self.hidden_depth = 0

    def add(self, raw: str) -> str | None:
        url = normalized_url(raw, self.base)
        if url and url not in self.links:
            self.links.append(url)
        return url

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag in {"script", "style"}:
            self.hidden_depth += 1
        if tag == "a" and attrs.get("href"):
            self.add(attrs["href"])
        if tag == "link" and attrs.get("href"):
            if any(rel in attrs.get("rel", "") for rel in ("stylesheet", "icon")):
                self.add(attrs["href"])
        if tag in {"img", "source"}:
            for name in ("src", "data-src", "data-original"):
                if attrs.get(name):
                    url = self.add(attrs[name])
                    if url and tag == "img":
                        self.images.append({"url": url, "alt": attrs.get("alt", "")})
            for entry in attrs.get("srcset", "").split(","):
                fields = entry.strip().split()
                if fields:
                    self.add(fields[0])

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag in {"script", "style"}:
            self.hidden_depth = max(0, self.hidden_depth - 1)

    def handle_data(self, data):
        if self.in_title:
            self.title_parts.append(data)
        if not self.hidden_depth and data.strip():
            self.text_parts.append(" ".join(data.split()))


def origin(url):
    parts = urlsplit(url)
    return parts.scheme, parts.hostname, parts.port


class OriginRedirects(HTTPRedirectHandler):
    def __init__(self, allowed):
        self.allowed = allowed

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        target = normalized_url(newurl, req.full_url)
        if not target or origin(target) not in self.allowed:
            raise URLError(f"Redirect outside approved origin: {newurl}")
        return super().redirect_request(req, fp, code, msg, headers, target)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="https://www.aaapparels.com/")
    parser.add_argument("--output", type=Path, default=Path("source-audit"))
    parser.add_argument("--max-pages", type=int, default=150)
    parser.add_argument("--max-files", type=int, default=800)
    parser.add_argument("--max-bytes", type=int, default=DEFAULT_LIMIT)
    parser.add_argument("--timeout", type=float, default=25)
    parser.add_argument("--delay", type=float, default=0.3)
    args = parser.parse_args()
    start = normalized_url(args.url, args.url)
    if not start:
        parser.error("--url must be a valid public HTTP(S) URL")
    if min(args.max_pages, args.max_files, args.max_bytes, args.timeout) <= 0 or args.delay < 0:
        parser.error("limits must be positive and delay cannot be negative")

    # Permit only HTTP->HTTPS upgrades and the equivalent www/non-www host.
    parts = urlsplit(start)
    hosts = {parts.hostname}
    if parts.hostname.startswith("www."):
        hosts.add(parts.hostname[4:])
    else:
        hosts.add("www." + parts.hostname)
    schemes = {parts.scheme, "https"}
    allowed = {(scheme, host, parts.port) for scheme in schemes for host in hosts}
    opener = build_opener(OriginRedirects(allowed))
    args.output.mkdir(parents=True, exist_ok=True)
    files_dir = args.output / "files"
    files_dir.mkdir(exist_ok=True)
    manifest = {
        "source": start,
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "status": "incomplete",
        "limitations": ["Manual browser review required", "CSS and JavaScript links not parsed"],
        "pages": [], "assets": [], "errors": [], "external_links": [], "skipped": [],
    }
    queue = deque([start])
    seen = set()
    page_count = 0

    while queue and len(seen) < args.max_files:
        url = queue.popleft()
        if url in seen:
            continue
        seen.add(url)
        suffix = Path(urlsplit(url).path).suffix.lower()
        if suffix not in ASSET_SUFFIXES | PAGE_SUFFIXES:
            manifest["skipped"].append({"url": url, "reason": "Unsupported file type"})
            continue
        if suffix in PAGE_SUFFIXES and page_count >= args.max_pages:
            manifest["skipped"].append({"url": url, "reason": "Page limit reached"})
            continue
        try:
            request = Request(url, headers={"User-Agent": "AAApparels-Presentation-Inventory/1.0"})
            with opener.open(request, timeout=args.timeout) as response:
                body = response.read(args.max_bytes + 1)
                if len(body) > args.max_bytes:
                    raise ValueError("Response exceeded --max-bytes")
                final_url = response.geturl()
                content_type = response.headers.get_content_type()
                charset = response.headers.get_content_charset() or "utf-8"
            is_html = content_type in {"text/html", "application/xhtml+xml"}
            if not is_html and not (
                content_type.startswith("image/")
                or content_type.startswith("font/")
                or content_type in {"application/pdf", "text/css", "application/font-woff"}
            ):
                raise ValueError(f"Unsupported content type: {content_type}")
            extension = ".html" if is_html else suffix or ".bin"
            name = hashlib.sha256(url.encode()).hexdigest()[:20] + extension
            target = files_dir / name
            target.write_bytes(body)
            record = {
                "url": url, "final_url": final_url,
                "file": str(target.relative_to(args.output)), "bytes": len(body),
                "content_type": content_type, "sha256": hashlib.sha256(body).hexdigest(),
            }
            if is_html:
                page_count += 1
                page = PageLinks(final_url)
                page.feed(body.decode(charset, errors="replace"))
                record.update(title=" ".join(page.title_parts).strip(), links=page.links,
                              images=page.images, text="\n".join(page.text_parts))
                manifest["pages"].append(record)
                for link in page.links:
                    if origin(link) in allowed:
                        if link not in seen:
                            queue.append(link)
                    elif link not in manifest["external_links"]:
                        manifest["external_links"].append(link)
            else:
                manifest["assets"].append(record)
            print(f"Saved {content_type}: {url}", flush=True)
        except (HTTPError, URLError, TimeoutError, OSError, ValueError, LookupError) as exc:
            manifest["errors"].append({"url": url, "error": str(exc)})
            print(f"Failed: {url}: {exc}", file=sys.stderr, flush=True)
        if queue:
            time.sleep(args.delay)

    if queue:
        manifest["limitations"].append("File limit reached with URLs remaining")
    if manifest["pages"] and not manifest["errors"] and not queue and not manifest["skipped"]:
        manifest["status"] = "captured-needs-manual-review"
    manifest_path = args.output / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\n{len(manifest['pages'])} pages, {len(manifest['assets'])} assets, "
          f"{len(manifest['errors'])} errors. Manifest: {manifest_path}")
    return 0 if manifest["status"] == "captured-needs-manual-review" else 1


if __name__ == "__main__":
    raise SystemExit(main())
