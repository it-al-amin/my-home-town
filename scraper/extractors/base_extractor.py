"""Shared HTTP behaviour: robots.txt, rate limiting, TLS verification (never disabled),
conditional GET cache so unchanged pages are not downloaded again."""
from __future__ import annotations

import json
import time
import urllib.robotparser
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional
from urllib.parse import urlsplit

import requests

STORAGE = Path(__file__).resolve().parent.parent / "storage"
CACHE_FILE = STORAGE / "cache" / "http_cache.json"


@dataclass
class RawItem:
    """What an extractor yields before normalisation/relevance."""
    url: str
    title: str
    summary: str = ""
    body: str = ""
    published_raw: Optional[str] = None
    image_url: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    dateline: str = ""


@dataclass
class FetchResult:
    ok: bool
    status: Optional[int] = None
    text: str = ""
    not_modified: bool = False
    error: Optional[str] = None


class ExtractionError(Exception):
    """Raised when a page does not have the structure we validated against."""


class BaseExtractor:
    def __init__(self, source: dict, settings: dict, session: Optional[requests.Session] = None,
                 use_cache: bool = True):
        self.source = source
        self.settings = settings
        self.session = session or requests.Session()
        self.session.headers["User-Agent"] = settings.get("user_agent", "NetrokonaPortalBot/1.0")
        self.delay = float(settings.get("request_delay_seconds", 1.5))
        self.timeout = float(settings.get("timeout_seconds", 20))
        self.max_articles = int(settings.get("max_article_fetches_per_source", 40))
        self.verify = source.get("ca_bundle") or True  # NEVER False
        self.use_cache = use_cache
        self._last_request = 0.0
        self._robots: Dict[str, Optional[urllib.robotparser.RobotFileParser]] = {}
        self._cache = self._load_cache() if use_cache else {}
        self.http_statuses: List[int] = []
        self.errors: List[str] = []

    # --- cache -----------------------------------------------------------
    @staticmethod
    def _load_cache() -> dict:
        try:
            return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            return {}

    def save_cache(self) -> None:
        if not self.use_cache:
            return
        CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
        CACHE_FILE.write_text(json.dumps(self._cache, ensure_ascii=False, indent=1), encoding="utf-8")

    # --- robots ----------------------------------------------------------
    def allowed(self, url: str) -> bool:
        p = urlsplit(url)
        base = "%s://%s" % (p.scheme, p.netloc)
        if base not in self._robots:
            rp = urllib.robotparser.RobotFileParser()
            try:
                r = self.session.get(base + "/robots.txt", timeout=self.timeout, verify=self.verify)
                if r.status_code == 200 and "<html" not in r.text[:200].lower():
                    rp.parse(r.text.splitlines())
                    self._robots[base] = rp
                else:  # no usable robots.txt => nothing published to restrict us
                    self._robots[base] = None
            except requests.RequestException:
                self._robots[base] = None
        rp = self._robots[base]
        return True if rp is None else rp.can_fetch(self.session.headers["User-Agent"], url)

    # --- fetching --------------------------------------------------------
    def fetch(self, url: str) -> FetchResult:
        if not self.allowed(url):
            return FetchResult(False, error="blocked by robots.txt")
        wait = self.delay - (time.time() - self._last_request)
        if wait > 0:
            time.sleep(wait)
        headers = {}
        cached = self._cache.get(url) if self.use_cache else None
        if cached:
            if cached.get("etag"):
                headers["If-None-Match"] = cached["etag"]
            if cached.get("last_modified"):
                headers["If-Modified-Since"] = cached["last_modified"]
        try:
            r = self.session.get(url, headers=headers, timeout=self.timeout, verify=self.verify)
        except requests.exceptions.SSLError as e:
            self._last_request = time.time()
            return FetchResult(False, error="TLS verification failed: %s" % str(e)[:160])
        except requests.RequestException as e:
            self._last_request = time.time()
            return FetchResult(False, error="%s: %s" % (type(e).__name__, str(e)[:160]))
        self._last_request = time.time()
        self.http_statuses.append(r.status_code)
        if r.status_code == 304:
            return FetchResult(True, 304, not_modified=True)
        if r.status_code != 200:
            return FetchResult(False, r.status_code, error="HTTP %d" % r.status_code)
        if r.encoding is None or r.encoding.lower() == "iso-8859-1":
            r.encoding = r.apparent_encoding or "utf-8"
        if self.use_cache:
            self._cache[url] = {
                "etag": r.headers.get("ETag"),
                "last_modified": r.headers.get("Last-Modified"),
                "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
        return FetchResult(True, 200, text=r.text)

    # --- to implement ----------------------------------------------------
    def extract(self, known_urls: set) -> List[RawItem]:
        raise NotImplementedError
