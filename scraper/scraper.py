#!/usr/bin/env python
"""Netrokona information scraper CLI.  Run from the project root:  python scraper/scraper.py --help"""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))  # allow `models`, `services`, `extractors` imports

if hasattr(sys.stdout, "reconfigure"):  # Bengali text on Windows consoles
    sys.stdout.reconfigure(encoding="utf-8")

from services.export_service import ExportService  # noqa: E402
from services.review_service import ReviewError, ReviewService  # noqa: E402
from services.scraper_service import ScraperService, load_sources, select_sources  # noqa: E402
from services.storage_service import Store  # noqa: E402


def setup_logging() -> None:
    log_dir = HERE / "storage" / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
        handlers=[logging.FileHandler(log_dir / "scraper.log", encoding="utf-8"), logging.StreamHandler()],
    )


def cmd_list_sources() -> None:
    cfg = load_sources()
    print("%-18s %-11s %-8s %-26s %s" % ("ID", "CATEGORY", "ENABLED", "VERIFIED STATUS", "URL"))
    for s in cfg["sources"]:
        print("%-18s %-11s %-8s %-26s %s" % (s["id"], s["category"], "yes" if s.get("enabled") else "no",
                                             s["verified"]["status"], s["url"]))


def print_reports(reports: dict, dry_run: bool) -> None:
    for sid, r in reports.items():
        print("\n== %s  [%s]  http=%s" % (sid, r["availability"], r["httpStatus"]))
        print("   collected=%d relevant=%d new=%d duplicates=%d errors=%d" % (
            r["recordsCollected"], r["relevantRecords"], r["newRecords"], r["duplicates"], r["extractionErrors"]))
        if r["lastError"]:
            print("   last error: %s" % r["lastError"])
        if dry_run:
            for a in r["_new"]:
                print("   + [%d] %s | %s | %s | %s" % (a.relevanceScore, a.category, a.publishedAt or "-",
                                                      a.title[:70], a.sourceUrl))


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="Netrokona district information scraper")
    g = p.add_argument_group("scraping")
    g.add_argument("--list-sources", action="store_true", help="show the source registry")
    g.add_argument("--source", metavar="ID", help="scrape one source (runs even if disabled)")
    g.add_argument("--category", metavar="CAT", help="scrape enabled sources of a category (news|government)")
    g.add_argument("--all", action="store_true", help="scrape all enabled sources")
    g.add_argument("--dry-run", action="store_true", help="fetch and score, but write nothing")
    g.add_argument("--institutions", action="store_true",
                   help="build the education-institution directory (OpenStreetMap + Commons photos)")
    g.add_argument("--no-photos", action="store_true", help="with --institutions: skip photo lookup")
    g.add_argument("--export-json", action="store_true", help="export APPROVED records to src/data/aggregated")
    r = p.add_argument_group("review")
    r.add_argument("--review", action="store_true", help="interactive review of pending records")
    r.add_argument("--pending", action="store_true", help="list pending records")
    r.add_argument("--approve", nargs="+", metavar="ID")
    r.add_argument("--reject", nargs="+", metavar="ID")
    r.add_argument("--revert", metavar="ID", help="move an approved/rejected record back to pending")
    r.add_argument("--note", help="review note for --approve/--reject")
    r.add_argument("--edit", metavar="ID", help="correct fields of a record; combine with the flags below")
    for f in ("title", "title-bn", "summary", "summary-bn", "set-category", "set-upazila"):
        r.add_argument("--" + f, dest=f.replace("-", "_"))
    a = p.parse_args(argv)

    try:
        if a.list_sources:
            cmd_list_sources(); return 0
        if a.institutions:
            from services.institution_service import build_directory
            res = build_directory(dry_run=a.dry_run, with_photos=not a.no_photos)
            recs = res["institutions"]
            print("institutions: %d | with upazila: %d | with photo: %d" % (
                len(recs), sum(1 for r in recs if r["upazilaId"]), sum(1 for r in recs if r["photo"])))
            return 0
        if a.pending:
            for x in ReviewService().list_pending():
                print("%s  [%d] %-18s %s" % (x.id, x.relevanceScore, x.category, x.title[:80]))
            return 0
        if a.review:
            ReviewService().interactive(); return 0
        if a.approve:
            for x in ReviewService().approve(a.approve, a.note): print("approved", x.id)
            return 0
        if a.reject:
            for x in ReviewService().reject(a.reject, a.note): print("rejected", x.id)
            return 0
        if a.revert:
            print("pending", ReviewService().revert_to_pending(a.revert).id); return 0
        if a.edit:
            x = ReviewService().edit(a.edit, title=a.title, titleBn=a.title_bn, summary=a.summary,
                                     summaryBn=a.summary_bn, category=a.set_category, upazila=a.set_upazila)
            print("edited", x.id); return 0
        if a.export_json and not (a.all or a.source or a.category):
            res = ExportService().export(dry_run=a.dry_run)
            print("exported %d approved record(s); changed files: %s" % (res["approved"], res["changed"] or "none"))
            return 0
        if a.all or a.source or a.category or a.dry_run:
            setup_logging()
            svc = ScraperService(dry_run=a.dry_run)
            sources = select_sources(svc.cfg, a.source, a.category)
            if not sources:
                print("No sources selected."); return 1
            reports = svc.run(sources)
            print_reports(reports, a.dry_run)
            if a.export_json:
                res = ExportService().export(dry_run=a.dry_run)
                print("\nexported %d approved record(s); changed: %s" % (res["approved"], res["changed"] or "none"))
            # a failing source must not fail the pipeline (frontend keeps serving last good JSON)
            return 0
        p.print_help(); return 0
    except ReviewError as e:
        print("error:", e, file=sys.stderr); return 2


if __name__ == "__main__":
    sys.exit(main())
