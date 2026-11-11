"""Orchestrates extractors -> normalisation -> relevance -> dedup -> pending storage, and builds
the per-source health report."""
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional

from extractors.base_extractor import BaseExtractor, ExtractionError, RawItem
from extractors.government_extractor import GovernmentExtractor
from extractors.news_extractor import NewsListingExtractor
from extractors.rss_extractor import RssExtractor
from models.article import Article, make_id, now_iso
from .deduplication_service import Deduplicator
from .normalization_service import (classify, clean_text, detect_language, load_keywords, make_summary,
                                    parse_date)
from .relevance_service import RelevanceService
from .storage_service import REPORT_FILE, Store, read_json, write_json_atomic

CONFIG_DIR = Path(__file__).resolve().parent.parent / "config"
log = logging.getLogger("scraper")

EXTRACTORS = {"rss": RssExtractor, "listing": None, "government": GovernmentExtractor}


def load_sources() -> dict:
    return json.loads((CONFIG_DIR / "sources.json").read_text(encoding="utf-8"))


def pick_extractor(source: dict):
    kind = source.get("kind")
    if kind == "rss":
        return RssExtractor
    if kind == "listing":
        # sources with an article_link_pattern are news-style (listing -> article pages);
        # otherwise a government notice-board style page.
        return NewsListingExtractor if source.get("article_link_pattern") else GovernmentExtractor
    raise ValueError("unknown source kind %r" % kind)


def select_sources(cfg: dict, source_id: Optional[str] = None, category: Optional[str] = None) -> List[dict]:
    sources = cfg["sources"]
    if source_id:
        found = [s for s in sources if s["id"] == source_id]
        if not found:
            raise SystemExit("Unknown source id %r. Use --list-sources." % source_id)
        return found  # explicit request runs even if disabled
    chosen = [s for s in sources if s.get("enabled")]
    if category:
        chosen = [s for s in chosen if s["category"] == category]
    return chosen


class ScraperService:
    def __init__(self, store: Optional[Store] = None, dry_run: bool = False, keywords: Optional[dict] = None):
        self.store = store or Store()
        self.dry_run = dry_run
        self.kw = keywords or load_keywords()
        self.relevance = RelevanceService(self.kw)
        self.cfg = load_sources()

    # ------------------------------------------------------------------
    def build_article(self, source: dict, item: RawItem) -> Optional[Article]:
        title = clean_text(item.title)
        body = item.body or item.summary
        res = self.relevance.score(title, body, item.dateline, bool(source.get("all_content_is_local")))
        if not res.relevant:
            return None
        lang = detect_language(title)
        art = Article(
            id=make_id(item.url),
            title=title,
            titleBn=title if lang == "bn" else None,
            summary=make_summary(item.summary or "", 280),
            summaryBn=None,
            category=classify(title, body, item.tags, source["category"], self.kw),
            sourceId=source["id"],
            sourceName=source["name"],
            sourceUrl=item.url,
            imageUrl=item.image_url,
            publishedAt=parse_date(item.published_raw, item.dateline),
            language=lang,
            upazila=res.upazila,
            locations=res.locations,
            relevanceScore=res.score,
        )
        if lang == "bn":
            art.summaryBn = art.summary or None
        art.contentHash = art.compute_hash()
        return art

    # ------------------------------------------------------------------
    def run_source(self, source: dict, dedup: Deduplicator) -> dict:
        prev = (read_json(REPORT_FILE, {}).get("sources", {}) or {}).get(source["id"], {})
        report = {
            "sourceId": source["id"], "sourceName": source["name"], "sourceUrl": source["url"],
            "sourceCategory": source["category"],
            "lastSuccessfulScrape": prev.get("lastSuccessfulScrape"),
            "lastAttempt": now_iso(), "httpStatus": None,
            "recordsCollected": 0, "relevantRecords": 0, "newRecords": 0, "duplicates": 0,
            "extractionErrors": 0, "lastError": None, "availability": "unavailable",
        }
        ext_cls = pick_extractor(source)
        ext: BaseExtractor = ext_cls(source, self.cfg, use_cache=not self.dry_run)
        known = self.store.seen_urls(source["id"]) | {a.sourceUrl for a in self.store.all_articles()
                                                      if a.sourceId == source["id"]}
        new_articles: List[Article] = []
        seen_now: List[str] = []
        try:
            items = ext.extract(known)
            report["recordsCollected"] = len(items)
            for it in items:
                seen_now.append(it.url)
                try:
                    art = self.build_article(source, it)
                except ValueError as e:  # pydantic validation => malformed data, do not store
                    ext.errors.append("invalid record %s: %s" % (it.url, str(e).splitlines()[0]))
                    continue
                if art is None:
                    continue
                report["relevantRecords"] += 1
                why = dedup.reason(art)
                if why:
                    report["duplicates"] += 1
                    continue
                dedup.add(art)
                new_articles.append(art)
            report["availability"] = "degraded" if ext.errors else "available"
            report["lastSuccessfulScrape"] = report["lastAttempt"]
        except ExtractionError as e:
            ext.errors.append(str(e))
        report["httpStatus"] = ext.http_statuses[-1] if ext.http_statuses else None
        report["extractionErrors"] = len(ext.errors)
        report["lastError"] = ext.errors[-1] if ext.errors else None
        report["newRecords"] = len(new_articles)
        if not self.dry_run:
            self.store.add_pending(new_articles)
            self.store.mark_seen(source["id"], seen_now)
            ext.save_cache()
        report["_new"] = new_articles
        return report

    # ------------------------------------------------------------------
    def run(self, sources: List[dict]) -> Dict[str, dict]:
        dedup = Deduplicator(self.store.all_articles())
        reports: Dict[str, dict] = {}
        for s in sources:
            log.info("scraping %s", s["id"])
            reports[s["id"]] = self.run_source(s, dedup)
        if not self.dry_run:
            self.write_report(reports)
        return reports

    def write_report(self, reports: Dict[str, dict]) -> None:
        old = read_json(REPORT_FILE, {"sources": {}})
        merged = old.get("sources", {})
        for sid, r in reports.items():
            merged[sid] = {k: v for k, v in r.items() if not k.startswith("_")}
        # sources never run yet are listed with their registry verification result
        for s in self.cfg["sources"]:
            merged.setdefault(s["id"], {
                "sourceId": s["id"], "sourceName": s["name"], "sourceUrl": s["url"],
                "sourceCategory": s["category"], "lastSuccessfulScrape": None, "lastAttempt": None,
                "httpStatus": s["verified"].get("http_status"), "recordsCollected": 0, "relevantRecords": 0,
                "newRecords": 0, "duplicates": 0, "extractionErrors": 0,
                "lastError": s["verified"].get("notes") if s["verified"]["status"] != "supported" else None,
                "availability": "not_run",
            })
        write_json_atomic(REPORT_FILE, {"generatedAt": now_iso(), "sources": merged})
