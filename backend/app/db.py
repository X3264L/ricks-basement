from __future__ import annotations

import json
import sqlite3
import threading
from collections.abc import Iterable
from pathlib import Path
from typing import Any

from .schemas import NormalizedEvent
from .settings import settings

_lock = threading.Lock()


def _db_path() -> Path:
    path = settings.database_path
    if not path.is_absolute():
        path = Path.cwd() / path
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(_db_path(), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with _lock, connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS events (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              event_type TEXT NOT NULL,
              visual_state TEXT NOT NULL,
              session_id TEXT NOT NULL,
              turn_id TEXT,
              tool_name TEXT,
              status TEXT NOT NULL,
              timestamp TEXT NOT NULL,
              duration_ms INTEGER,
              safe_summary TEXT NOT NULL,
              metadata_json TEXT NOT NULL DEFAULT '{}',
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sessions (
              id TEXT PRIMARY KEY,
              started_at TEXT NOT NULL,
              ended_at TEXT,
              event_count INTEGER NOT NULL DEFAULT 0,
              tool_count INTEGER NOT NULL DEFAULT 0,
              approval_count INTEGER NOT NULL DEFAULT 0,
              compact_count INTEGER NOT NULL DEFAULT 0,
              status TEXT NOT NULL DEFAULT 'active'
            );
            """
        )


def reset_db() -> None:
    path = _db_path()
    if path.exists():
        path.unlink()
    init_db()


def _event_row(row: sqlite3.Row) -> dict[str, Any]:
    item = dict(row)
    item["metadata"] = json.loads(item.pop("metadata_json") or "{}")
    return item


def insert_event(event: NormalizedEvent) -> dict[str, Any]:
    init_db()
    payload = event.model_dump()
    with _lock, connect() as conn:
        cursor = conn.execute(
            """
            INSERT INTO events (
              event_type, visual_state, session_id, turn_id, tool_name, status,
              timestamp, duration_ms, safe_summary, metadata_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload["event_type"],
                payload["visual_state"],
                payload["session_id"],
                payload["turn_id"],
                payload["tool_name"],
                payload["status"],
                payload["timestamp"],
                payload["duration_ms"],
                payload["safe_summary"],
                json.dumps(payload["metadata"], separators=(",", ":")),
            ),
        )
        _upsert_session(conn, event)
        row = conn.execute("SELECT * FROM events WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return _event_row(row)


def _upsert_session(conn: sqlite3.Connection, event: NormalizedEvent) -> None:
    existing = conn.execute("SELECT * FROM sessions WHERE id = ?", (event.session_id,)).fetchone()
    tool_inc = 1 if event.event_type in {"PreToolUse", "PostToolUse"} else 0
    approval_inc = 1 if event.event_type == "PermissionRequest" else 0
    compact_inc = 1 if event.event_type in {"PreCompact", "PostCompact"} else 0
    ended_at = event.timestamp if event.event_type == "Stop" else None
    status = "complete" if event.event_type == "Stop" else "active"

    if existing:
        conn.execute(
            """
            UPDATE sessions
            SET event_count = event_count + 1,
                tool_count = tool_count + ?,
                approval_count = approval_count + ?,
                compact_count = compact_count + ?,
                ended_at = COALESCE(?, ended_at),
                status = ?
            WHERE id = ?
            """,
            (tool_inc, approval_inc, compact_inc, ended_at, status, event.session_id),
        )
        return

    conn.execute(
        """
        INSERT INTO sessions (
          id, started_at, ended_at, event_count, tool_count, approval_count, compact_count, status
        )
        VALUES (?, ?, ?, 1, ?, ?, ?, ?)
        """,
        (
            event.session_id,
            event.timestamp,
            ended_at,
            tool_inc,
            approval_inc,
            compact_inc,
            status,
        ),
    )


def count_events() -> int:
    init_db()
    with connect() as conn:
        row = conn.execute("SELECT COUNT(*) AS total FROM events").fetchone()
    return int(row["total"])


def list_events(limit: int = 100, offset: int = 0) -> list[dict[str, Any]]:
    init_db()
    with connect() as conn:
        rows: Iterable[sqlite3.Row] = conn.execute(
            "SELECT * FROM events ORDER BY id DESC LIMIT ? OFFSET ?",
            (limit, offset),
        ).fetchall()
    return [_event_row(row) for row in rows]


def list_sessions() -> list[dict[str, Any]]:
    init_db()
    with connect() as conn:
        rows = conn.execute("SELECT * FROM sessions ORDER BY started_at DESC").fetchall()
    return [dict(row) for row in rows]


def get_session(session_id: str) -> dict[str, Any] | None:
    init_db()
    with connect() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return dict(row) if row else None


def session_events(session_id: str) -> list[dict[str, Any]]:
    init_db()
    with connect() as conn:
        rows = conn.execute(
            "SELECT * FROM events WHERE session_id = ? ORDER BY timestamp ASC, id ASC",
            (session_id,),
        ).fetchall()
    return [_event_row(row) for row in rows]
