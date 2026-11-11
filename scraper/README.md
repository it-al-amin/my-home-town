# Netrokona information scraper

A small Python pipeline that collects Netrokona-related news and government notices, holds them for
**editorial review**, and exports only **approved** records to JSON that the existing React app reads.
No database, no API server, no paid service.

```
sources.json ─► extractors ─► normalise ─► relevance filter ─► dedup ─► storage/pending
                                                                          │  (CLI review)
                              src/data/aggregated/*.json ◄─ export ◄─ storage/approved
```

## Setup

```bash
python -m venv scraper/.venv
scraper/.venv/Scripts/activate        # Windows  (Linux/macOS: source scraper/.venv/bin/activate)
pip install -r scraper/requirements.txt
python -m pytest scraper/tests -q
```

Python 3.9+ (CI uses 3.11).

## Commands (run from the project root)

| Command | What it does |
|---|---|
| `python scraper/scraper.py --list-sources` | Registry with verified status |
| `python scraper/scraper.py --source zp-netrokona` | One source (runs even if disabled) |
| `python scraper/scraper.py --source bss-news` | One source |
| `python scraper/scraper.py --category news` | Enabled sources of a category (`news`/`government`) |
| `python scraper/scraper.py --all` | All enabled sources → new records go to `pending` |
| `python scraper/scraper.py --dry-run` | Fetch + score, print candidates, **write nothing** |
| `python scraper/scraper.py --export-json` | Approved records → `src/data/aggregated/` |

## Editorial review

Nothing is published automatically. Statuses: `pending_review` → `approved` → `published` (set on export), or `rejected`.

```bash
python scraper/scraper.py --pending                       # list, highest relevance first
python scraper/scraper.py --review                        # interactive: approve / reject / edit / skip
python scraper/scraper.py --edit nk-abc123 --title "Better headline" --summary "Short summary" --set-category health --set-upazila kalmakanda
python scraper/scraper.py --approve nk-abc123 --note "checked against source"
python scraper/scraper.py --reject nk-def456 --note "off topic"
python scraper/scraper.py --revert nk-abc123              # back to pending
python scraper/scraper.py --export-json                   # publish
```

You can also edit `scraper/storage/*/articles.json` by hand. Rules enforced by the code:
- Approved/edited/rejected records are never overwritten by a later scrape (dedup by URL, content hash, near-identical title).
- Records are moved between folders, never deleted (history kept). Original `sourceUrl` is always preserved.
- Export validates every record against the Pydantic model and strips internal fields (`reviewNote`, `contentHash`, …).
- Bengali translations are **not machine-generated**: `titleBn`/`summaryBn` are filled only for Bengali sources or by a reviewer via `--title-bn` / `--summary-bn`.

## Sources (verified 2026-11-11)

| Source | Status | Notes |
|---|---|---|
| zpnetrokona.gov.bd | **supported** | WordPress RSS (`/?feed=rss2`). 10 real items extracted (tenders, notices). Posts are mostly images → empty summaries. |
| bssnews.net | **supported** | No RSS. Section listings (`/district`, national, education, health, agriculture) → article pages (og meta + dateline). `/search` returns 403 and is not used. Strict relevance filter: ~1–2 Netrokona stories per 40 articles. |
| netrokona.gov.bd, info.netrokona.gov.bd, doict./pwd.netrokona.gov.bd, bbs.gov.bd | **unavailable** | TLS certificate chain cannot be verified (`unable to get local issuer certificate`). Verification is never disabled. Reported as `unavailable` each run; works automatically if the site fixes its chain, or set `ca_bundle` in `sources.json` to a PEM with the missing intermediate. The government extractor is therefore **untested against live markup**. |
| judiciary, dghs, dshe, bangladesh.gov.bd, prothomalo, thedailystar | reachable, **not scraped** | HTTP 200 but no validated Netrokona-specific extractor; Prothom Alo is JS-heavy/paywalled. Disabled. |

Politeness: robots.txt is honoured, 1.5 s delay between requests, own user agent, conditional GET (ETag/Last-Modified), already-seen URLs are not refetched, no login/CAPTCHA/paywall bypass. Only short summaries + links are stored, never full articles.

## Relevance

`config/keywords.json` holds Bengali + English district, upazila, landmark and category terms and the threshold (50).
Score = district in title (+50) / dateline (+45) / opening text (+30) / repeated mentions, plus upazila and landmark evidence.
A story that mentions Netrokona only in passing is capped at 35 and rejected. Ambiguous names (Durgapur, Madan) count only when the district is also present. Government sites on `all_content_is_local` start at 60.

## Public JSON (`src/data/aggregated/`)

`news/latest.json`, `news/archive.json`, `notices/{government-notices,recruitment,tenders}.json`,
`updates/{education,health,agriculture,culture}.json`, `sources/sources.json`, `metadata/scraping-status.json`.
(Placed under `aggregated/` to avoid clashing with the existing `src/data/news.ts`.) Generated files; don't hand-edit.

Record schema (TypeScript: `src/types/aggregated.ts`):

```json
{
  "id": "nk-<sha1(canonical url)[:12]>", "title": "", "titleBn": null, "summary": "", "summaryBn": null,
  "category": "local-news|government-news|government-notice|recruitment|tender|education|health|agriculture|fisheries-livestock|tourism|development-projects|infrastructure|culture|emergency|district-admin",
  "sourceId": "", "sourceName": "", "sourceUrl": "", "imageUrl": null,
  "publishedAt": "ISO-8601|null", "scrapedAt": "ISO-8601", "language": "bn|en",
  "district": "Netrokona", "upazila": "kalmakanda|null", "locations": [], "relevanceScore": 0,
  "status": "published", "isVerified": true
}
```

## Health report

`storage/reports/scraping-report.json`: per source — URL, category, last successful scrape, HTTP status, records collected, relevant records, new/duplicate counts, extraction errors, last error, availability (`available` / `degraded` / `unavailable` / `not_run`). If a page's structure changes (no feed entries, no `og:` metadata, no matching links) the extractor raises and the issue is reported instead of storing malformed data. A 304 run reports 0 collected (nothing new).

## Automation

`.github/workflows/scrape.yml` runs daily (edit the cron for weekly), runs tests, scrapes (failures tolerated), exports approved records, builds the frontend, and commits `src/data/aggregated` + `scraper/storage/{pending,approved,rejected,state,reports}` only if something changed. Enable via *Settings → Actions → General → Workflow permissions: Read and write*. Trigger manually from the Actions tab (`workflow_dispatch`).
Review happens locally: pull, run `--review`, `--export-json`, commit, push.

## Troubleshooting

- `TLS verification failed` → site certificate chain problem (see Sources). Don't disable verification; use `ca_bundle`.
- `ImportError: lxml.html.clean` → `pip install lxml_html_clean` (in requirements).
- Source shows `degraded`/`layout changed?` → open the URL, compare with the extractor in `extractors/`; update selectors/patterns in `config/sources.json`.
- Nothing appears on the site → records are probably still pending; approve then `--export-json`.
- Bengali garbled in the Windows console → `set PYTHONIOENCODING=utf-8`.
- A relevant story was skipped → lower `relevance.threshold` or add terms in `keywords.json`; delete its URL from `storage/state/seen_urls.json` to re-evaluate.
