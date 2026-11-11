"""Generic extractor for government portal notice/news listings (HTML).

The *.netrokona.gov.bd portals currently fail TLS verification so this extractor could not be
validated against their live markup. It is deliberately conservative: it only emits links that
sit next to a recognisable date, and raises ExtractionError (reported in the health report) when
nothing usable is found rather than producing malformed records.
"""
from __future__ import annotations

import re
from typing import List
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from .base_extractor import BaseExtractor, ExtractionError, RawItem

DATE_RE = re.compile(
    r"(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{4}-\d{2}-\d{2}|[০-৯]{1,2}[-/.][০-৯]{1,2}[-/.][০-৯]{2,4})"
)


class GovernmentExtractor(BaseExtractor):
    def extract(self, known_urls: set) -> List[RawItem]:
        items: List[RawItem] = []
        reachable = 0
        for listing in self.source.get("listing_urls", []):
            res = self.fetch(listing)
            if not res.ok:
                self.errors.append("%s -> %s" % (listing, res.error))
                continue
            reachable += 1
            soup = BeautifulSoup(res.text, "lxml")
            for a in soup.find_all("a", href=True):
                title = re.sub(r"\s+", " ", a.get_text(" ")).strip()
                if len(title) < 12:
                    continue
                container = a.find_parent(["tr", "li", "div"])
                ctx = container.get_text(" ") if container else ""
                m = DATE_RE.search(ctx)
                if not m:
                    continue
                url = urljoin(listing, a["href"])
                if url in known_urls or any(i.url == url for i in items):
                    continue
                items.append(RawItem(url=url, title=title, published_raw=m.group(1), body=ctx[:500]))
        if reachable == 0:
            raise ExtractionError("; ".join(self.errors) or "no listing reachable")
        if not items:
            raise ExtractionError("listing reachable but no dated notice links found (layout changed?)")
        return items
