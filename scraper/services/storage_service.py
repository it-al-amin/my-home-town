"""JSON file storage for pending / approved / rejected records. Atomic writes, history kept."""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Dict, List, Optional

from models.article import Article

ROOT = Path(__file__).resolve().parent.parent
STORAGE = ROOT / "storage"
STATE_DIR = STORAGE / "state"
REPORT_FILE = STORAGE / "reports" / "scraping-report.json"
_DIR_FOR_STATUS = {"pending_review": "pending", "approved": "approved", "published": "approved", "rejected": "rejected"}
BUCKETS = ("pending", "approved", "rejected")


def write_json_atomic(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, path)


def read_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return default


class Store:
    def __init__(self, storage: Optional[Path] = None):
        self.storage = storage or STORAGE
        self.state_dir = self.storage / "state"

    def _file(self, bucket: str) -> Path:
        return self.storage / bucket / "articles.json"

    def load(self, bucket: str) -> List[Article]:
        return [Article.model_validate(r) for r in read_json(self._file(bucket), [])]

    def save(self, bucket: str, articles: List[Article]) -> None:
        write_json_atomic(self._file(bucket), [a.model_dump() for a in articles])

    def load_all(self) -> Dict[str, List[Article]]:
        return {b: self.load(b) for b in BUCKETS}

    def all_articles(self) -> List[Article]:
        return [a for b in BUCKETS for a in self.load(b)]

    def add_pending(self, new: List[Article]) -> None:
        if new:
            self.save("pending", self.load("pending") + new)

    def find(self, article_id: str):
        for b in BUCKETS:
            for a in self.load(b):
                if a.id == article_id:
                    return b, a
        return None, None

    def move(self, article: Article, from_bucket: str, status: str) -> None:
        """Change status and move between buckets (never deletes: history is kept)."""
        to_bucket = _DIR_FOR_STATUS[status]
        src = [a for a in self.load(from_bucket) if a.id != article.id]
        article.status = status
        if from_bucket == to_bucket:
            src.append(article)
            self.save(from_bucket, src)
            return
        self.save(from_bucket, src)
        self.save(to_bucket, self.load(to_bucket) + [article])

    def replace(self, bucket: str, article: Article) -> None:
        items = [article if a.id == article.id else a for a in self.load(bucket)]
        self.save(bucket, items)

    # --- seen-URL state: irrelevant pages are not re-downloaded on the next run -----
    def seen_urls(self, source_id: str) -> set:
        return set(read_json(self.state_dir / "seen_urls.json", {}).get(source_id, []))

    def mark_seen(self, source_id: str, urls) -> None:
        data = read_json(self.state_dir / "seen_urls.json", {})
        merged = set(data.get(source_id, [])) | set(urls)
        data[source_id] = sorted(merged)[-2000:]
        write_json_atomic(self.state_dir / "seen_urls.json", data)
