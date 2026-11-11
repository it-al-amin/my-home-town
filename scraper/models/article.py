"""Pydantic model for a scraped record. Field names are camelCase on purpose:
they match the JSON consumed by the React frontend (src/types/aggregated.ts)."""
from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from typing import List, Optional
from urllib.parse import urlsplit, urlunsplit

from pydantic import BaseModel, ConfigDict, Field, field_validator

STATUSES = ("pending_review", "approved", "rejected", "published")

CATEGORIES = (
    "local-news", "government-news", "government-notice", "recruitment", "tender",
    "education", "health", "agriculture", "fisheries-livestock", "tourism",
    "development-projects", "infrastructure", "culture", "emergency", "district-admin",
)

UPAZILA_IDS = (
    "netrokona-sadar", "durgapur", "kalmakanda", "purbadhala", "kendua",
    "barhatta", "atpara", "madan", "mohanganj", "khaliajuri",
)


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def canonical_url(url: str) -> str:
    """Normalise a URL so the same article always yields the same id."""
    p = urlsplit(url.strip())
    host = p.netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    path = p.path.rstrip("/") or "/"
    return urlunsplit(("https", host, path, p.query, ""))


def make_id(url: str) -> str:
    return "nk-" + hashlib.sha1(canonical_url(url).encode("utf-8")).hexdigest()[:12]


class Article(BaseModel):
    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    id: str
    title: str = Field(min_length=3)
    titleBn: Optional[str] = None
    summary: str = ""
    summaryBn: Optional[str] = None
    category: str
    sourceId: str
    sourceName: str
    sourceUrl: str
    imageUrl: Optional[str] = None
    publishedAt: Optional[str] = None
    scrapedAt: str = Field(default_factory=now_iso)
    language: str = "bn"
    district: str = "Netrokona"
    upazila: Optional[str] = None
    locations: List[str] = Field(default_factory=list)
    relevanceScore: int = Field(ge=0, le=100)
    status: str = "pending_review"
    isVerified: bool = False
    contentHash: str = ""
    manuallyEdited: bool = False
    reviewNote: Optional[str] = None
    reviewedAt: Optional[str] = None

    @field_validator("category")
    @classmethod
    def _cat(cls, v: str) -> str:
        if v not in CATEGORIES:
            raise ValueError("unknown category %r" % v)
        return v

    @field_validator("status")
    @classmethod
    def _status(cls, v: str) -> str:
        if v not in STATUSES:
            raise ValueError("unknown status %r" % v)
        return v

    @field_validator("language")
    @classmethod
    def _lang(cls, v: str) -> str:
        if v not in ("bn", "en"):
            raise ValueError("language must be bn or en")
        return v

    @field_validator("upazila")
    @classmethod
    def _upazila(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in UPAZILA_IDS:
            raise ValueError("unknown upazila %r" % v)
        return v

    @field_validator("sourceUrl")
    @classmethod
    def _url(cls, v: str) -> str:
        if not v.startswith(("http://", "https://")):
            raise ValueError("sourceUrl must be http(s)")
        return v

    @field_validator("publishedAt", "scrapedAt")
    @classmethod
    def _iso(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        datetime.fromisoformat(v.replace("Z", "+00:00"))
        return v

    def compute_hash(self) -> str:
        return hashlib.sha1((self.title + "|" + self.summary).encode("utf-8")).hexdigest()[:16]
