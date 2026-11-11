"""Text/date normalisation, language detection and category classification."""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Iterable, Optional

CONFIG_DIR = Path(__file__).resolve().parent.parent / "config"

_BN_DIGITS = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")
_BN_RANGE = re.compile(r"[ঀ-৿]")
_MONTHS = {m: i for i, m in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], 1)}

_DATELINE_RE = re.compile(r"^\s*[^()\n]{2,60}?\(?[A-Za-z ]*\)?,\s*[A-Za-z]{3,9}\.?\s+\d{1,2},?\s+\d{4}\s*\([A-Za-z ]+\)\s*[-–—:]*\s*")


def load_keywords() -> dict:
    return json.loads((CONFIG_DIR / "keywords.json").read_text(encoding="utf-8"))


def bn_to_en_digits(text: str) -> str:
    return text.translate(_BN_DIGITS)


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()


def detect_language(text: str) -> str:
    letters = [c for c in text if c.isalpha()]
    if not letters:
        return "bn"
    bn = sum(1 for c in letters if _BN_RANGE.match(c))
    return "bn" if bn / len(letters) > 0.3 else "en"


def _iso(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).replace(microsecond=0).isoformat()


def parse_date(raw: Optional[str], dateline: str = "") -> Optional[str]:
    """Return an ISO-8601 UTC string or None. Never invents a date.

    Supports RFC-2822 (RSS), ISO-8601, 'Nov 9, 2026' datelines, and dd/mm/yyyy or dd-mm-yyyy
    (day first, as used on Bangladeshi portals) including Bengali digits.
    """
    candidates = [c for c in (raw, dateline) if c]
    for cand in candidates:
        s = bn_to_en_digits(cand.strip())
        try:
            return _iso(parsedate_to_datetime(s))
        except (TypeError, ValueError, IndexError):
            pass
        try:
            return _iso(datetime.fromisoformat(s.replace("Z", "+00:00")))
        except ValueError:
            pass
        m = re.search(r"([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})", s)
        if m and m.group(1).lower() in _MONTHS:
            try:
                return _iso(datetime(int(m.group(3)), _MONTHS[m.group(1).lower()], int(m.group(2))))
            except ValueError:
                pass
        m = re.search(r"\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\b", s)
        if m:
            try:
                return _iso(datetime(int(m.group(3)), int(m.group(2)), int(m.group(1))))
            except ValueError:
                pass
    return None


def make_summary(text: str, limit: int = 280) -> str:
    """Short factual summary: strip dateline, cut at a sentence/word boundary. Never the full article."""
    s = clean_text(text)
    s = _DATELINE_RE.sub("", s)
    if len(s) <= limit:
        return s
    cut = s[:limit]
    end = max(cut.rfind(". "), cut.rfind("। "))
    if end > limit * 0.5:
        return cut[: end + 1]
    return cut.rsplit(" ", 1)[0].rstrip(",;:-") + "…"


def _kw_regex(kw: str) -> re.Pattern:
    k = re.escape(kw.strip())
    if kw.strip().isascii():
        return re.compile(r"(?<![a-z])" + k, re.I)
    return re.compile(k)


_CAT_ORDER_FIRST = ("recruitment", "tender", "government-notice")
_TOPIC = ("education", "health", "agriculture", "fisheries-livestock", "tourism", "development-projects",
          "infrastructure", "culture", "emergency", "district-admin")


def _hits(patterns: Iterable[re.Pattern], text: str) -> int:
    return sum(1 for p in patterns if p.search(text))


def classify(title: str, body: str, tags: Iterable[str], source_category: str, kw: Optional[dict] = None) -> str:
    kw = kw or load_keywords()
    cats = kw["categories"]
    pats = {c: [_kw_regex(k) for k in v["keywords"]] for c, v in cats.items()}
    head = clean_text(" ".join([title, *tags]))
    lead = clean_text(body)[:400]
    # Administrative document types are decided from the title/tags only.
    for c in _CAT_ORDER_FIRST:
        if _hits(pats[c], head):
            return c
    scores = {c: 3 * _hits(pats[c], head) + _hits(pats[c], lead) for c in _TOPIC}
    best = max(scores, key=lambda c: scores[c])
    if scores[best] > 0:
        return best
    if source_category == "government":
        return "government-news"
    return "local-news"
