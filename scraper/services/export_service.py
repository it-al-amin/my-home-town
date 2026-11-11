"""Exports APPROVED records to the public JSON files read by the React app.

Only records with status approved/published are ever exported. Pending and rejected records are
never written to src/. Output is validated against the Article model first.
"""
from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional

from models.article import Article, now_iso
from .storage_service import REPORT_FILE, Store, read_json, write_json_atomic

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
PUBLIC_DIR = PROJECT_ROOT / "src" / "data" / "aggregated"

NOTICE_FILES = {
    "government-notice": "notices/government-notices.json",
    "recruitment": "notices/recruitment.json",
    "tender": "notices/tenders.json",
}
UPDATE_FILES = {
    "education": "updates/education.json",
    "health": "updates/health.json",
    "agriculture": "updates/agriculture.json",
    "fisheries-livestock": "updates/agriculture.json",
    "culture": "updates/culture.json",
    "tourism": "updates/culture.json",
}
LATEST_LIMIT = 30
_PRIVATE = {"reviewNote", "reviewedAt", "contentHash", "manuallyEdited"}


def public_record(a: Article) -> dict:
    d = a.model_dump()
    for k in _PRIVATE:
        d.pop(k, None)
    d["status"] = "published"
    return d


def _sort_key(r: dict) -> str:
    return r.get("publishedAt") or r.get("scrapedAt") or ""


class ExportService:
    def __init__(self, store: Optional[Store] = None, out_dir: Optional[Path] = None):
        self.store = store or Store()
        self.out = out_dir or PUBLIC_DIR

    def build(self, approved: List[Article]) -> Dict[str, list]:
        files: Dict[str, list] = {p: [] for p in
                                  ["news/latest.json", "news/archive.json", *NOTICE_FILES.values(),
                                   *{v for v in UPDATE_FILES.values()}]}
        recs = sorted((public_record(a) for a in approved), key=_sort_key, reverse=True)
        news = []
        for r in recs:
            c = r["category"]
            if c in NOTICE_FILES:
                files[NOTICE_FILES[c]].append(r)
            else:
                news.append(r)
            if c in UPDATE_FILES and r not in files[UPDATE_FILES[c]]:
                files[UPDATE_FILES[c]].append(r)
        files["news/latest.json"] = news[:LATEST_LIMIT]
        files["news/archive.json"] = news[LATEST_LIMIT:]
        return files

    def export(self, dry_run: bool = False) -> dict:
        approved = self.store.load("approved")
        # validate every record again before it can become public
        valid = [Article.model_validate(a.model_dump()) for a in approved]
        files = self.build(valid)
        changed = []
        if not dry_run:
            for rel, data in files.items():
                path = self.out / rel
                if read_json(path, None) != data:
                    write_json_atomic(path, data)
                    changed.append(rel)
            self._write_sources()
            self._write_status(len(valid))
            # mark approved -> published (still stored in approved/, history kept)
            promoted = [a for a in approved if a.status == "approved"]
            if promoted:
                for a in promoted:
                    a.status = "published"
                self.store.save("approved", approved)
        return {"approved": len(valid), "files": {k: len(v) for k, v in files.items()}, "changed": changed}

    def _write_sources(self) -> None:
        from .scraper_service import load_sources
        cfg = load_sources()
        pub = [{"id": s["id"], "name": s["name"], "nameBn": s.get("nameBn"), "url": s["url"],
                "category": s["category"], "status": s["verified"]["status"]} for s in cfg["sources"]]
        data = {"sources": pub}
        if read_json(self.out / "sources/sources.json", None) != data:
            write_json_atomic(self.out / "sources/sources.json", data)

    def _write_status(self, approved_count: int) -> None:
        rep = read_json(REPORT_FILE, {"sources": {}})
        pending = len(self.store.load("pending"))
        sources = [{
            "sourceId": r["sourceId"], "sourceName": r["sourceName"], "availability": r["availability"],
            "lastSuccessfulScrape": r["lastSuccessfulScrape"], "recordsCollected": r["recordsCollected"],
            "relevantRecords": r["relevantRecords"],
        } for r in rep.get("sources", {}).values()]
        status = {"lastExportedAt": now_iso(), "lastScrapedAt": rep.get("generatedAt"),
                  "publishedCount": approved_count, "pendingCount": pending, "sources": sources}
        old = read_json(self.out / "metadata/scraping-status.json", {})
        if {k: v for k, v in old.items() if k != "lastExportedAt"} != {k: v for k, v in status.items() if k != "lastExportedAt"}:
            write_json_atomic(self.out / "metadata/scraping-status.json", status)
