"""RSS/Atom extractor (feedparser). Used for WordPress government sites such as zpnetrokona.gov.bd."""
from __future__ import annotations

import re
from typing import List

import feedparser
from bs4 import BeautifulSoup

from .base_extractor import BaseExtractor, ExtractionError, RawItem


def html_to_text(html: str) -> str:
    return re.sub(r"\s+", " ", BeautifulSoup(html or "", "lxml").get_text(" ")).strip()


class RssExtractor(BaseExtractor):
    def extract(self, known_urls: set) -> List[RawItem]:
        items: List[RawItem] = []
        any_ok = False
        for feed_url in self.source.get("feed_urls", []):
            res = self.fetch(feed_url)
            if res.not_modified:
                any_ok = True
                continue
            if not res.ok:
                self.errors.append("%s -> %s" % (feed_url, res.error))
                continue
            any_ok = True
            parsed = feedparser.parse(res.text)
            if not parsed.entries and (parsed.bozo or not parsed.get("version")):
                raise ExtractionError("feed %s is not valid RSS/Atom (layout/endpoint changed?)" % feed_url)
            for e in parsed.entries:
                link = e.get("link")
                title = html_to_text(e.get("title", ""))
                if not link or not title:
                    self.errors.append("feed entry missing title/link in %s" % feed_url)
                    continue
                content_html = ""
                if e.get("content"):
                    content_html = e["content"][0].get("value", "")
                summary = html_to_text(e.get("summary", ""))
                body = html_to_text(content_html) or summary
                items.append(RawItem(
                    url=link,
                    title=title,
                    summary=summary,
                    body=body,
                    published_raw=e.get("published") or e.get("updated"),
                    tags=[t.get("term", "") for t in e.get("tags", []) if t.get("term")],
                ))
        if not any_ok:
            raise ExtractionError("; ".join(self.errors) or "no feed reachable")
        return items
