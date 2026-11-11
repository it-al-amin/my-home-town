"""Educational-institution directory for Netrokona, built from OpenStreetMap (ODbL) and
photographed only with openly licensed Wikimedia Commons images.

* Institutions: Overpass API (amenity = school | college | university) inside the district boundary.
* Upazila: point-in-polygon against the real OSM upazila boundaries (cached in config/).
* Photos: Wikimedia Commons file whose TITLE contains the institution name, with an open licence
  (CC / public domain). Credit, licence and file page are stored. Nothing is taken from Facebook or
  other sites that forbid automated collection. Institutions without a verified photo get none.
"""
from __future__ import annotations

import html
import json
import re
import time
from pathlib import Path
from typing import Dict, List, Optional

import requests
from shapely.geometry import Point, Polygon, MultiPolygon, mapping, shape
from shapely.ops import polygonize, unary_union

from models.article import now_iso
from .storage_service import read_json, write_json_atomic

ROOT = Path(__file__).resolve().parent.parent
BOUNDARY_FILE = ROOT / "config" / "upazila_boundaries.json"
PHOTO_OVERRIDES = ROOT / "config" / "institution_photos.json"
OUT_FILE = ROOT.parent / "src" / "data" / "aggregated" / "institutions" / "institutions.json"
UA = "NetrokonaPortalBot/1.0 (community info aggregator)"
OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
COMMONS = "https://commons.wikimedia.org/w/api.php"

AREA = '[out:json][timeout:90];rel["boundary"="administrative"]["name:en"~"^Netrokona( District)?$"]["admin_level"="5"];map_to_area->.a;'
Q_INSTITUTIONS = AREA + '(nwr["amenity"~"^(school|college|university)$"](area.a););out center tags;'
Q_BOUNDARIES = AREA + 'rel(area.a)["boundary"="administrative"]["admin_level"="6"];out geom;'

UPAZILA_BY_NAME = [("netrokona sadar", "netrokona-sadar"), ("durgapur", "durgapur"), ("kalmakanda", "kalmakanda"),
                   ("purbadhala", "purbadhala"), ("kendua", "kendua"), ("barhatta", "barhatta"),
                   ("atpara", "atpara"), ("madan", "madan"), ("mohanganj", "mohanganj"), ("khaliajuri", "khaliajuri")]
OPEN_LICENSE = re.compile(r"^(CC[ -]|Public domain|PD|GFDL)", re.I)
_BN = re.compile(r"[ঀ-৿]")


def overpass(query: str, tries: int = 3) -> dict:
    last = None
    for attempt in range(tries):
        for url in OVERPASS:
            try:
                r = requests.post(url, data={"data": query}, headers={"User-Agent": UA}, timeout=120)
                if r.status_code == 200:
                    return r.json()
                last = "HTTP %d from %s" % (r.status_code, url)
            except requests.RequestException as e:
                last = "%s from %s" % (type(e).__name__, url)
        time.sleep(10 * (attempt + 1))
    raise RuntimeError("Overpass unavailable: %s" % last)


# --- upazila boundaries ------------------------------------------------------
def load_boundaries(refresh: bool = False) -> Dict[str, object]:
    if not refresh and BOUNDARY_FILE.exists():
        raw = read_json(BOUNDARY_FILE, {})
        return {k: shape(v) for k, v in raw.items()}
    data = overpass(Q_BOUNDARIES)
    out = {}
    for rel in data["elements"]:
        name = (rel["tags"].get("name:en") or "").lower()
        uid = next((i for n, i in UPAZILA_BY_NAME if n in name), None)
        if not uid:
            continue
        lines = [[(p["lon"], p["lat"]) for p in m["geometry"]] for m in rel["members"]
                 if m.get("role") == "outer" and m.get("geometry")]
        poly = unary_union(list(polygonize(unary_union([__import__("shapely.geometry", fromlist=["LineString"]).LineString(l)
                                                          for l in lines]))))
        out[uid] = poly.simplify(0.0005)  # ~50 m, plenty for assignment
    write_json_atomic(BOUNDARY_FILE, {k: mapping(v) for k, v in out.items()})
    return out


def assign_upazila(lon: float, lat: float, boundaries: Dict[str, object]) -> Optional[str]:
    pt = Point(lon, lat)
    for uid, poly in boundaries.items():
        if poly.contains(pt):
            return uid
    near = min(boundaries.items(), key=lambda kv: kv[1].distance(pt), default=None)
    if near and near[1].distance(pt) < 0.02:  # ~2 km outside a border: simplification slack
        return near[0]
    return None


# --- institutions --------------------------------------------------------------
def categorize(tags: dict) -> str:
    name = " ".join(tags.get(k, "") for k in ("name", "name:en", "name:bn")).lower()
    amenity = tags.get("amenity")
    if amenity == "university":
        return "university"
    if re.search(r"madrasa|madrasah|madrasha|মাদ্রাসা|হাফিজিয়া|দাখিল|আলিম|ফাজিল|কওমি", name):
        return "madrasa"
    if re.search(r"polytechnic|technical|nursing|training|vocational|পলিটেকনিক|কারিগরি|নার্সিং|প্রশিক্ষণ", name):
        return "technical"
    if amenity == "college":
        return "college"
    if re.search(r"primary|প্রাথমিক", name):
        return "primary"
    return "school"


def build_record(el: dict, boundaries: Dict[str, object]) -> Optional[dict]:
    t = el.get("tags", {})
    c = el.get("center") or ({"lat": el["lat"], "lon": el["lon"]} if "lat" in el else None)
    raw = t.get("name") or t.get("name:bn") or t.get("name:en")
    if not c or not raw:
        return None
    name_bn = t.get("name:bn") or (raw if _BN.search(raw) else None)
    name_en = t.get("name:en") or (raw if not _BN.search(raw) else None)
    return {
        "id": "osm-%s-%s" % (el["type"], el["id"]),
        "name": name_en or name_bn,
        "nameBn": name_bn or name_en,
        "category": categorize(t),
        "upazilaId": assign_upazila(c["lon"], c["lat"], boundaries),
        "coordinates": {"lat": round(c["lat"], 6), "lng": round(c["lon"], 6)},
        "website": t.get("website") or t.get("contact:website"),
        "phone": t.get("phone") or t.get("contact:phone") or t.get("contact:mobile"),
        "wikidata": t.get("wikidata"),
        "photo": None,
        "sourceName": "OpenStreetMap contributors (ODbL)",
        "sourceUrl": "https://www.openstreetmap.org/%s/%s" % (el["type"], el["id"]),
        "isVerified": False,
    }


# --- Commons photos --------------------------------------------------------------
_STOP = {"the", "of", "and", "a", "in", "at", "for", "file", "jpg", "jpeg", "png", "bangladesh", "district", "upazila"}
_GENERIC = {"school", "college", "high", "primary", "building", "government", "institute", "madrasa", "madrasah",
            "madrasha", "university", "academy", "model", "girls", "boys", "secondary", "technical", "and"}
_PLACE_WORDS = {"netrokona", "netrakona", "netrokona", "durgapur", "kalmakanda", "purbadhala", "kendua", "barhatta",
                "atpara", "madan", "mohanganj", "khaliajuri"}
_BAD_TITLE = re.compile(r"graffiti|procession|speech|presentation|protest|rally|meeting|portrait|logo|map|"
                        r"inauguration|ceremony|seminar|award|signature|poster|referendum|advisor|minister|visit", re.I)


def _tokens(s: str) -> set:
    words = re.findall(r"[a-z]+", s.lower())  # digits (file numbering) are ignored
    words = ["government" if w in ("govt", "gov") else w for w in words]
    return {w for w in words if w not in _STOP}


def titles_match(name: str, title: str) -> bool:
    """True only if the Commons file title is (almost) exactly this institution in Netrokona.
    - the name needs at least one distinctive word (not just 'College Building');
    - the title must name Netrokona or an upazila (rules out same-named places elsewhere);
    - apart from place words the two token sets must be nearly identical (Jaccard >= 0.8), so
      'Netrokona Govt. College' never matches 'Netrokona Govt. Mohila College'."""
    n, t = _tokens(name), _tokens(title)
    if not (n - _GENERIC - _PLACE_WORDS) or not (t & _PLACE_WORDS):
        return False
    n2, t2 = n - _PLACE_WORDS, t - _PLACE_WORDS
    if not n2 or not t2:
        return False
    return len(n2 & t2) / len(n2 | t2) >= 0.8


def _strip(s: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def _accept(info: dict) -> Optional[dict]:
    meta = info.get("extmetadata", {})
    lic = _strip(meta.get("LicenseShortName", {}).get("value", ""))
    if info.get("mime", "").startswith("image/") and info.get("thumburl") and OPEN_LICENSE.search(lic):
        return {"url": info["thumburl"], "pageUrl": info.get("descriptionurl"),
                "credit": _strip(meta.get("Artist", {}).get("value", "")) or "Wikimedia Commons contributor",
                "license": lic, "source": "Wikimedia Commons"}
    return None


_last_call = [0.0]


def _api_json(session: requests.Session, url: str, params: dict, tries: int = 5) -> dict:
    """GET JSON politely: >=1.5 s spacing, honour Retry-After on HTTP 429/503, raise if still failing
    (a throttled request must never be mistaken for 'no photo')."""
    for attempt in range(tries):
        wait = 1.5 - (time.time() - _last_call[0])
        if wait > 0:
            time.sleep(wait)
        r = session.get(url, params=params, timeout=30)
        _last_call[0] = time.time()
        if r.status_code in (429, 503):
            time.sleep(min(60, float(r.headers.get("retry-after", 5)) + 2 * attempt))
            continue
        r.raise_for_status()
        return r.json()
    raise RuntimeError("API still throttling after %d tries: %s" % (tries, url))


_IIPROP = {"prop": "imageinfo", "iiprop": "url|extmetadata|mime", "iiurlwidth": 640}


def wikidata_photo(qid: str, session: requests.Session) -> Optional[dict]:
    """Main image (P18) of a Wikidata item, if it is an openly licensed Commons file."""
    try:
        j = _api_json(session, "https://www.wikidata.org/w/api.php", {
            "action": "wbgetclaims", "entity": qid, "property": "P18", "format": "json"})
        fname = j["claims"]["P18"][0]["mainsnak"]["datavalue"]["value"]
        r = _api_json(session, COMMONS, {"action": "query", "format": "json", "titles": "File:" + fname,
                                         **_IIPROP})
        page = next(iter(r["query"]["pages"].values()))
        return _accept((page.get("imageinfo") or [{}])[0])
    except (requests.RequestException, KeyError, IndexError, ValueError, StopIteration):
        return None


def commons_photo(rec: dict, session: requests.Session) -> Optional[dict]:
    """Accept a file only if EVERY distinctive word of the institution's English name is in the file
    title (so 'Netrokona Govt. Mohila College' never matches another Netrokona college), the title is
    not an event/graffiti photo, and the licence is open."""
    if rec.get("wikidata"):
        p = wikidata_photo(rec["wikidata"], session)
        if p:
            return p
    name = rec["name"]
    want = _tokens(name) if name and not _BN.search(name) else set()
    if not (want - _GENERIC - _PLACE_WORDS):
        return None
    params = {"action": "query", "format": "json", "generator": "search", "gsrnamespace": 6,
              "gsrsearch": " ".join(sorted(want - {"government"})), "gsrlimit": 10, **_IIPROP}
    try:
        pages = (_api_json(session, COMMONS, params).get("query") or {}).get("pages") or {}
    except (requests.RequestException, ValueError):
        return None
    for p in sorted(pages.values(), key=lambda p: p.get("index", 0)):
        title = p.get("title", "")
        if _BAD_TITLE.search(title) or not titles_match(name, title):
            continue
        got = _accept((p.get("imageinfo") or [{}])[0])
        if got:
            return got
    return None


def website_photo(rec: dict, session: requests.Session) -> Optional[dict]:
    """The institution's OWN declared link-preview image (og:image), if its robots.txt allows us.
    Hotlinked with attribution and a link back; never downloaded or re-hosted."""
    import urllib.robotparser
    from urllib.parse import urljoin, urlsplit
    from bs4 import BeautifulSoup
    site = rec.get("website")
    if not site or not site.startswith("http"):
        return None
    try:
        base = "%s://%s" % (urlsplit(site).scheme, urlsplit(site).netloc)
        rp = urllib.robotparser.RobotFileParser()
        rr = session.get(base + "/robots.txt", timeout=20)
        if rr.status_code == 200 and "<html" not in rr.text[:200].lower():
            rp.parse(rr.text.splitlines())
            if not rp.can_fetch(UA, site):
                return None
        time.sleep(1.5)
        r = session.get(site, timeout=20)
        if r.status_code != 200:
            return None
        tag = BeautifulSoup(r.text, "lxml").find("meta", attrs={"property": "og:image"})
        img = urljoin(site, tag["content"]) if tag and tag.get("content") else None
    except requests.RequestException:
        return None
    if not img:
        return None
    return {"url": img, "pageUrl": site, "credit": urlsplit(site).netloc, "license": "Official website image",
            "source": "Institution website"}


def load_photo_overrides() -> dict:
    """config/institution_photos.json: {"osm-node-123": {"url", "pageUrl", "credit", "license", "source"}}
    for photos you have the right to use (your own, with permission, or openly licensed)."""
    return read_json(PHOTO_OVERRIDES, {})


def build_directory(dry_run: bool = False, with_photos: bool = True, refresh_boundaries: bool = False) -> dict:
    boundaries = load_boundaries(refresh_boundaries)
    data = overpass(Q_INSTITUTIONS)
    recs = [r for r in (build_record(e, boundaries) for e in data["elements"]) if r]
    recs.sort(key=lambda r: (r["upazilaId"] or "zz", r["category"], r["name"]))
    if with_photos:
        s = requests.Session()
        s.headers["User-Agent"] = UA
        overrides = load_photo_overrides()
        for r in recs:
            r["photo"] = overrides.get(r["id"]) or commons_photo(r, s) or website_photo(r, s)
    result = {"generatedAt": now_iso(), "source": "OpenStreetMap contributors (ODbL), partial coverage",
              "institutions": recs}
    if not dry_run:
        write_json_atomic(OUT_FILE, result)
    return result
