"""CLI editorial review: list / show / edit / approve / reject. No auth/backend; records are JSON files."""
from __future__ import annotations

from typing import Iterable, List, Optional

from models.article import CATEGORIES, UPAZILA_IDS, Article, now_iso
from .storage_service import Store


class ReviewError(Exception):
    pass


class ReviewService:
    def __init__(self, store: Optional[Store] = None):
        self.store = store or Store()

    def _get(self, article_id: str, bucket: Optional[str] = None):
        b, a = self.store.find(article_id)
        if a is None:
            raise ReviewError("No record with id %s" % article_id)
        if bucket and b != bucket:
            raise ReviewError("%s is in %s, not %s" % (article_id, b, bucket))
        return b, a

    def list_pending(self) -> List[Article]:
        return sorted(self.store.load("pending"), key=lambda a: -a.relevanceScore)

    def edit(self, article_id: str, **fields) -> Article:
        b, a = self._get(article_id)
        allowed = {"title", "titleBn", "summary", "summaryBn", "category", "upazila"}
        for k, v in fields.items():
            if v is None:
                continue
            if k not in allowed:
                raise ReviewError("field %s cannot be edited" % k)
            if k == "category" and v not in CATEGORIES:
                raise ReviewError("category must be one of: " + ", ".join(CATEGORIES))
            if k == "upazila":
                v = None if v in ("", "none") else v
                if v is not None and v not in UPAZILA_IDS:
                    raise ReviewError("upazila must be one of: " + ", ".join(UPAZILA_IDS))
            setattr(a, k, v)
        a.manuallyEdited = True
        a.contentHash = a.compute_hash()
        self.store.replace(b, a)
        return a

    def approve(self, ids: Iterable[str], note: Optional[str] = None) -> List[Article]:
        out = []
        for i in ids:
            b, a = self._get(i, "pending")
            a.isVerified = True
            a.reviewedAt = now_iso()
            a.reviewNote = note or a.reviewNote
            self.store.move(a, b, "approved")
            out.append(a)
        return out

    def reject(self, ids: Iterable[str], note: Optional[str] = None) -> List[Article]:
        out = []
        for i in ids:
            b, a = self._get(i, "pending")
            a.isVerified = False
            a.reviewedAt = now_iso()
            a.reviewNote = note or a.reviewNote
            self.store.move(a, b, "rejected")
            out.append(a)
        return out

    def revert_to_pending(self, article_id: str) -> Article:
        b, a = self._get(article_id)
        if b == "pending":
            return a
        a.isVerified = False
        self.store.move(a, b, "pending_review")
        return a

    # --- interactive -------------------------------------------------
    def interactive(self, input_fn=input, print_fn=print) -> None:
        pending = self.list_pending()
        if not pending:
            print_fn("No records pending review.")
            return
        for a in pending:
            print_fn("\n[%s] score=%d  %s  %s" % (a.id, a.relevanceScore, a.category, a.upazila or "-"))
            print_fn("  %s" % a.title)
            if a.summary:
                print_fn("  %s" % a.summary)
            print_fn("  %s | %s | %s" % (a.sourceName, a.publishedAt or "no date", a.sourceUrl))
            while True:
                c = input_fn("  (a)pprove / (r)eject / (e)dit title+summary / (s)kip / (q)uit > ").strip().lower()
                if c == "a":
                    self.approve([a.id]); break
                if c == "r":
                    self.reject([a.id], input_fn("  reason (optional) > ").strip() or None); break
                if c == "e":
                    t = input_fn("  new title (blank=keep) > ").strip() or None
                    s = input_fn("  new summary (blank=keep) > ").strip() or None
                    self.edit(a.id, title=t, summary=s)
                    print_fn("  edited.")
                    continue
                if c == "s":
                    break
                if c == "q":
                    return
