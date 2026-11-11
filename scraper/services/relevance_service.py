"""Netrokona relevance scoring. A passing mention must not make an article relevant."""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List, Optional

from .normalization_service import clean_text, load_keywords


def _pat(term: str) -> re.Pattern:
    t = re.escape(term.strip())
    return re.compile((r"(?<![A-Za-z])" + t + r"(?![A-Za-z])") if term.isascii() else t, re.I)


@dataclass
class RelevanceResult:
    score: int
    relevant: bool
    locations: List[str] = field(default_factory=list)
    upazila: Optional[str] = None
    reasons: List[str] = field(default_factory=list)


class RelevanceService:
    def __init__(self, keywords: Optional[dict] = None):
        kw = keywords or load_keywords()
        self.threshold = kw["relevance"]["threshold"]
        self.local_base = kw["relevance"]["local_source_base_score"]
        self.district = [_pat(t) for t in kw["district"]["bn"] + kw["district"]["en"]]
        self.upazilas = []
        for u in kw["upazilas"]:
            self.upazilas.append((u["id"], u["name"], u["ambiguous"], [_pat(t) for t in u["bn"] + u["en"]]))
        self.landmarks = []
        for group in ("institutions", "historical_places", "rivers_and_haors"):
            for term in kw["landmarks"][group]:
                self.landmarks.append((term, _pat(term)))

    @staticmethod
    def _count(pats, text: str) -> int:
        return sum(len(p.findall(text)) for p in pats)

    def score(self, title: str, body: str, dateline: str = "", local_source: bool = False) -> RelevanceResult:
        title, body, dateline = clean_text(title), clean_text(body), clean_text(dateline)
        lead = body[:300]
        reasons: List[str] = []
        score = self.local_base if local_source else 0
        if local_source:
            reasons.append("source is a Netrokona local-government site")

        d_title = self._count(self.district, title)
        d_dateline = self._count(self.district, dateline[:100])
        d_lead = self._count(self.district, lead)
        d_body = self._count(self.district, body)
        district_present = bool(d_title or d_dateline or d_body)

        strong = bool(d_title or d_dateline or d_lead)
        if d_title:
            score += 50; reasons.append("district named in title")
        if d_dateline:
            score += 45; reasons.append("district in dateline")
        if d_lead and not d_title and not d_dateline:
            score += 30; reasons.append("district named in opening text")
        if d_body > 1:
            score += min(20, 5 * (d_body - (1 if d_lead else 0))); reasons.append("district mentioned %d times" % d_body)

        locations: List[str] = []
        best_upazila, best_w = None, 0
        if district_present:
            locations.append("Netrokona")
        mentions_total = d_body
        for uid, name, ambiguous, pats in self.upazilas:
            if ambiguous and not district_present and not local_source:
                continue  # e.g. Durgapur / Madan exist in other districts
            u_title, u_date = self._count(pats, title), self._count(pats, dateline[:100])
            u_body = self._count(pats, body)
            if not (u_title or u_date or u_body):
                continue
            locations.append(name)
            mentions_total += u_body
            w = 30 * bool(u_title) + 40 * bool(u_date) + min(15, 5 * u_body)
            if u_title or u_date:
                strong = True
            if not ambiguous or district_present or local_source:
                score += w
                reasons.append("upazila %s (+%d)" % (name, w))
            if w > best_w:
                best_upazila, best_w = uid, w

        lm_hits = 0
        for term, p in self.landmarks:
            if p.search(title + " " + body):
                lm_hits += 1
                locations.append(term)
        if lm_hits:
            score += min(16, 8 * lm_hits)
            reasons.append("%d local landmark(s)" % lm_hits)

        if not local_source and not strong and mentions_total < 3:
            if score > 35:
                reasons.append("capped: only a passing mention")
            score = min(score, 35)
        if not local_source and not district_present and best_upazila is None:
            score = min(score, 20)

        score = max(0, min(100, int(score)))
        seen, uniq = set(), []
        for loc in locations:
            if loc not in seen:
                seen.add(loc); uniq.append(loc)
        return RelevanceResult(score, score >= self.threshold, uniq, best_upazila, reasons)
