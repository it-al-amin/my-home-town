"""Duplicate detection: same canonical URL/id, same content hash, or near-identical title."""
from __future__ import annotations

import re
from difflib import SequenceMatcher
from typing import Iterable, Optional

from models.article import Article, canonical_url
from .normalization_service import bn_to_en_digits


def norm_title(title: str) -> str:
    t = bn_to_en_digits(title).lower()
    return re.sub(r"[\W_]+", " ", t).strip()


class Deduplicator:
    def __init__(self, existing: Iterable[Article] = (), title_threshold: float = 0.92):
        self.threshold = title_threshold
        self.ids, self.urls, self.hashes, self.titles = set(), set(), set(), []
        for a in existing:
            self.add(a)

    def add(self, a: Article) -> None:
        self.ids.add(a.id)
        self.urls.add(canonical_url(a.sourceUrl))
        if a.contentHash:
            self.hashes.add(a.contentHash)
        self.titles.append((norm_title(a.title), a.sourceId))

    def reason(self, a: Article) -> Optional[str]:
        if a.id in self.ids or canonical_url(a.sourceUrl) in self.urls:
            return "same URL"
        if a.contentHash and a.contentHash in self.hashes:
            return "same content"
        nt = norm_title(a.title)
        for other, _src in self.titles:
            if nt == other:
                return "near-identical title"
            # numbered notices ("e-tender 01/2026" vs "02/2026") are different records: the
            # digits must also match before a fuzzy title match counts as a duplicate.
            if (len(nt) > 15 and re.findall(r"\d+", nt) == re.findall(r"\d+", other)
                    and SequenceMatcher(None, nt, other).ratio() >= self.threshold):
                return "near-identical title"
        return None
