"""Offline tests. Fixtures here are synthetic strings used ONLY to exercise code paths;
they are never written to storage or exported as real content."""
import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from extractors.base_extractor import ExtractionError  # noqa: E402
from extractors.government_extractor import GovernmentExtractor  # noqa: E402
from extractors.news_extractor import parse_article_page  # noqa: E402
from extractors.rss_extractor import RssExtractor  # noqa: E402
from models.article import Article, make_id  # noqa: E402
from services.deduplication_service import Deduplicator  # noqa: E402
from services.export_service import ExportService  # noqa: E402
from services.normalization_service import (bn_to_en_digits, classify, detect_language, make_summary,  # noqa: E402
                                            parse_date)
from services.relevance_service import RelevanceService  # noqa: E402
from services.review_service import ReviewError, ReviewService  # noqa: E402
from services.storage_service import Store  # noqa: E402

REL = RelevanceService()


def mk(title="Canal restoration in Netrokona", url="https://x.test/a/1", **kw):
    d = dict(id=make_id(url), title=title, category="local-news", sourceId="t", sourceName="T",
             sourceUrl=url, relevanceScore=80, language="en")
    d.update(kw)
    a = Article(**d)
    a.contentHash = a.compute_hash()
    return a


# ---- Bengali / dates ----------------------------------------------------
def test_bengali_digits_and_language():
    assert bn_to_en_digits("০২/০৯/২০২৬") == "02/09/2026"
    assert detect_language("নেত্রকোণা জেলা পরিষদ") == "bn"
    assert detect_language("Netrokona canal") == "en"


def test_date_parsing():
    assert parse_date("Wed, 14 Oct 2026 16:15:06 +0000").startswith("2026-10-14T16:15:06")
    assert parse_date(None, "NETROKONA, Nov 9, 2026 (BSS)- Work").startswith("2026-11-09")
    assert parse_date("০২/০৯/২০২৬").startswith("2026-09-02")  # day-first
    assert parse_date("garbage") is None  # never invents a date
    assert parse_date(None) is None


def test_summary_strips_dateline_and_truncates():
    s = make_summary("NETROKONA, Nov 9, 2026 (BSS)- " + "Word " * 200, 100)
    assert not s.startswith("NETROKONA") and len(s) <= 101


# ---- relevance ------------------------------------------------------------
def test_relevance_accepts_real_local_story():
    r = REL.score("Canal restoration begins in Netrokona's 2 unions", "NETROKONA, Nov 10 (BSS)- Work began.",
                  "NETROKONA, Nov 10, 2026 (BSS)")
    assert r.relevant and r.score >= 80


def test_relevance_rejects_passing_mention():
    body = "The minister spoke in Dhaka about floods across the country. " * 5 + "Netrokona was also mentioned once."
    r = REL.score("Minister warns of floods", body, "DHAKA, Nov 10, 2026 (BSS)")
    assert not r.relevant


def test_ambiguous_upazila_needs_district():
    assert not REL.score("Durgapur steel plant output rises", "Durgapur in West Bengal...", "").relevant
    r = REL.score("Durgapur upazila road repaired", "Netrokona district: road in Durgapur repaired.", "NETROKONA, Nov 1 (BSS)")
    assert r.relevant and r.upazila == "durgapur"


def test_bengali_relevance_and_upazila():
    r = REL.score("কলমাকান্দায় নতুন সেতু উদ্বোধন", "নেত্রকোনা জেলার কলমাকান্দা উপজেলায় সেতু উদ্বোধন করা হয়েছে।")
    assert r.relevant and r.upazila == "kalmakanda"


def test_local_source_base_score():
    assert REL.score("ই-টেন্ডার নোটিশ-০১", "", local_source=True).relevant


def test_classify():
    assert classify("ই-টেন্ডার নোটিশ-০১/২০২৬", "", ["notice board"], "government") == "tender"
    assert classify("নিয়োগ বিজ্ঞপ্তি", "", [], "government") == "recruitment"
    assert classify("Hospital gets new ICU", "", [], "news") == "health"
    assert classify("Something unremarkable", "", [], "news") == "local-news"


# ---- dedup ----------------------------------------------------------------
def test_dedup_url_and_title_and_numbered_notices():
    a = mk("ই-টেন্ডার নোটিশ-০১/২০২৬-২০২৭ জেলা পরিষদ", "https://x.test/p/1")
    d = Deduplicator([a])
    assert d.reason(mk("other", "https://www.x.test/p/1/")) == "same URL"
    assert d.reason(mk("ই-টেন্ডার নোটিশ-০১/২০২৬-২০২৭ জেলা পরিষদ!", "https://x.test/p/2"))
    assert d.reason(mk("ই-টেন্ডার নোটিশ-০২/২০২৬-২০২৭ জেলা পরিষদ", "https://x.test/p/3")) is None


# ---- extraction -----------------------------------------------------------
class FakeSession:
    headers = {}

    def __init__(self, pages):
        self.pages = pages

    def get(self, url, **kw):
        import requests
        r = requests.Response()
        if url in self.pages:
            r.status_code, r._content = 200, self.pages[url].encode("utf-8")
            r.encoding = "utf-8"
        else:
            r.status_code, r._content = 404, b"not found"
        return r


RSS = """<?xml version="1.0"?><rss version="2.0"><channel><title>t</title>
<item><title>দরপত্র বিজ্ঞপ্তি</title><link>https://s.test/?p=1</link>
<pubDate>Wed, 14 Oct 2026 16:15:06 +0000</pubDate><category>tender</category>
<description>বিবরণ</description></item></channel></rss>"""


def test_rss_extractor_bengali():
    src = {"id": "s", "feed_urls": ["https://s.test/feed"]}
    ex = RssExtractor(src, {"request_delay_seconds": 0}, FakeSession({"https://s.test/feed": RSS}), use_cache=False)
    items = ex.extract(set())
    assert items[0].title == "দরপত্র বিজ্ঞপ্তি" and items[0].tags == ["tender"]


def test_rss_extractor_reports_bad_feed():
    src = {"id": "s", "feed_urls": ["https://s.test/feed"]}
    ex = RssExtractor(src, {"request_delay_seconds": 0}, FakeSession({"https://s.test/feed": "<html>nope</html>"}),
                      use_cache=False)
    with pytest.raises(ExtractionError):
        ex.extract(set())


def test_article_page_parse_and_layout_change():
    html = ('<html><head><meta property="og:title" content="Canal work | District"/>'
            '<meta property="og:description" content="NETROKONA, Nov 9, 2026 (BSS)- Work began."/></head>'
            '<body><p>x</p></body></html>')
    it = parse_article_page("https://s.test/district/1", html)
    assert it.title == "Canal work" and "Nov 9, 2026" in it.dateline
    with pytest.raises(ExtractionError):
        parse_article_page("https://s.test/district/2", "<html><body>redesigned</body></html>")


def test_government_extractor_requires_dates():
    src = {"id": "g", "listing_urls": ["https://g.test/n"]}
    good = '<table><tr><td><a href="/a1">একটি গুরুত্বপূর্ণ নোটিশ শিরোনাম</a></td><td>০৫/১০/২০২৬</td></tr></table>'
    ex = GovernmentExtractor(src, {"request_delay_seconds": 0}, FakeSession({"https://g.test/n": good}), use_cache=False)
    assert ex.extract(set())[0].published_raw == "০৫/১০/২০২৬"
    bad = '<div><a href="/a1">একটি গুরুত্বপূর্ণ নোটিশ শিরোনাম</a></div>'
    ex = GovernmentExtractor(src, {"request_delay_seconds": 0}, FakeSession({"https://g.test/n": bad}), use_cache=False)
    with pytest.raises(ExtractionError):
        ex.extract(set())


def test_tls_is_never_disabled():
    src = {"id": "s", "ca_bundle": None}
    ex = RssExtractor(src, {}, FakeSession({}), use_cache=False)
    assert ex.verify is True


# ---- model / json validation ---------------------------------------------
def test_model_validation():
    with pytest.raises(ValueError):
        mk(category="bogus")
    with pytest.raises(ValueError):
        mk(upazila="nowhere")
    with pytest.raises(ValueError):
        mk(publishedAt="not-a-date")
    with pytest.raises(ValueError):
        mk(relevanceScore=150)


# ---- review + export -------------------------------------------------------
@pytest.fixture
def env(tmp_path):
    return Store(tmp_path / "storage"), tmp_path / "public"


def test_review_and_export_only_approved(env):
    store, out = env
    a, b, c = mk("Approved story Netrokona", "https://x.test/1"), mk("Pending story Netrokona", "https://x.test/2"), \
        mk("Rejected story Netrokona", "https://x.test/3")
    store.add_pending([a, b, c])
    rv = ReviewService(store)
    rv.edit(a.id, title="Corrected headline")
    rv.approve([a.id], "ok")
    rv.reject([c.id], "off topic")
    with pytest.raises(ReviewError):
        rv.approve([a.id])  # already approved
    assert [x.id for x in store.load("pending")] == [b.id]
    assert store.load("approved")[0].manuallyEdited and store.load("approved")[0].isVerified
    ExportService(store, out).export()
    latest = json.loads((out / "news/latest.json").read_text(encoding="utf-8"))
    assert [r["title"] for r in latest] == ["Corrected headline"]
    assert all("reviewNote" not in r for r in latest)
    blob = "".join(p.read_text(encoding="utf-8") for p in out.rglob("*.json"))
    assert "Pending story" not in blob and "Rejected story" not in blob
    assert store.load("approved")[0].status == "published"  # history kept
    assert len(store.load("rejected")) == 1


def test_export_routes_categories_and_is_idempotent(env):
    store, out = env
    t = mk("Tender notice", "https://x.test/t", category="tender")
    e = mk("School news", "https://x.test/e", category="education")
    store.add_pending([t, e])
    ReviewService(store).approve([t.id, e.id])
    svc = ExportService(store, out)
    res = svc.export()
    assert json.loads((out / "notices/tenders.json").read_text(encoding="utf-8"))[0]["id"] == t.id
    assert json.loads((out / "updates/education.json").read_text(encoding="utf-8"))[0]["id"] == e.id
    assert svc.export()["changed"] == []  # no change => nothing rewritten
    assert res["approved"] == 2


def test_scraper_never_duplicates_approved(env):
    store, _ = env
    a = mk()
    store.add_pending([a])
    ReviewService(store).approve([a.id])
    assert Deduplicator(store.all_articles()).reason(mk()) == "same URL"


# ---- institution directory -------------------------------------------------
def test_photo_title_matching_rejects_lookalikes():
    from services.institution_service import titles_match as m
    assert not m("College Building", "Broome Community College manufacturing learning building.jpg")
    assert not m("Netrokona Govt. College", "File:Netrokona Govt. Mohila College (9).jpg")  # different college
    assert not m("School of Excellence", "File:African School of Excellence, Tsakane.JPG")  # not Netrokona
    assert m("Paboi Govt. Primary School", "File:Paboi Govt. Primary School, Paboi, Netrakona.jpg")


def test_upazila_assignment_and_category():
    from shapely.geometry import box
    from services.institution_service import assign_upazila, categorize
    b = {"kendua": box(90.0, 24.0, 90.5, 24.5)}
    assert assign_upazila(90.2, 24.2, b) == "kendua"
    assert assign_upazila(95.0, 30.0, b) is None
    assert categorize({"amenity": "school", "name": "Al Hera Madrasa"}) == "madrasa"
    assert categorize({"amenity": "school", "name": "পূর্বধলা সরকারি প্রাথমিক বিদ্যালয়"}) == "primary"
