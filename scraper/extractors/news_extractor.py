"""Listing-page news extractor (BSS and similar sites without RSS).

Strategy: fetch section listing pages, collect article links matching the configured
pattern, then fetch each *new* article (known URLs are skipped so nothing is downloaded
twice) and read its metadata: og:title, og:description (carries the dateline), og:image.
The article body is read only to score relevance and is never stored.
"""
from __future__ import annotations

import re
from typing import List

from bs4 import BeautifulSoup

try:
    import trafilatura
except ImportError:  # trafilatura is optional at runtime; scoring then uses description only
    trafilatura = None

from .base_extractor import BaseExtractor, ExtractionError, RawItem


def _meta(soup: BeautifulSoup, key: str) -> str:
    tag = soup.find("meta", attrs={"property": key}) or soup.find("meta", attrs={"name": key})
    return (tag.get("content") or "").strip() if tag else ""


def parse_article_page(url: str, html: str) -> RawItem:
    soup = BeautifulSoup(html, "lxml")
    title = _meta(soup, "og:title")
    desc = _meta(soup, "og:description") or _meta(soup, "description")
    if not title or not desc:
        raise ExtractionError("article %s lacks og:title/og:description (layout changed?)" % url)
    title = re.sub(r"\s*\|\s*[^|]{1,40}$", "", title).strip()  # drop " | District" section suffix
    body = ""
    if trafilatura is not None:
        body = trafilatura.extract(html, include_comments=False, include_tables=False) or ""
    return RawItem(
        url=url, title=title, summary=desc, body=body or desc,
        published_raw=_meta(soup, "article:published_time") or None,
        image_url=_meta(soup, "og:image") or None,
        dateline=desc[:120],
    )


class NewsListingExtractor(BaseExtractor):
    def collect_links(self) -> List[str]:
        pattern = re.compile(self.source["article_link_pattern"])
        links: List[str] = []
        reachable = 0
        for listing in self.source.get("listing_urls", []):
            res = self.fetch(listing)
            if not res.ok:
                self.errors.append("%s -> %s" % (listing, res.error))
                continue
            reachable += 1
            soup = BeautifulSoup(res.text, "lxml")
            found = [a["href"].strip() for a in soup.find_all("a", href=True) if pattern.match(a["href"].strip())]
            if not found:
                self.errors.append("no article links matched on %s (layout changed?)" % listing)
            for href in found:
                if href not in links:
                    links.append(href)
        if reachable == 0:
            raise ExtractionError("; ".join(self.errors) or "no listing reachable")
        if not links:
            raise ExtractionError("listing pages reachable but no article links matched the configured pattern")
        return links

    def extract(self, known_urls: set) -> List[RawItem]:
        links = self.collect_links()
        new_links = [u for u in links if u not in known_urls]
        # newest first: BSS ids increase with time
        new_links.sort(key=lambda u: int(re.search(r"/(\d+)$", u).group(1)) if re.search(r"/(\d+)$", u) else 0,
                       reverse=True)
        items: List[RawItem] = []
        for url in new_links[: self.max_articles]:
            res = self.fetch(url)
            if not res.ok:
                self.errors.append("%s -> %s" % (url, res.error))
                continue
            try:
                items.append(parse_article_page(url, res.text))
            except ExtractionError as e:
                self.errors.append(str(e))
        self.links_seen = len(links)
        return items
