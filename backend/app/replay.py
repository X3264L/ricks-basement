from __future__ import annotations

from . import db


def list_session_summaries() -> list[dict]:
    return db.list_sessions()


def session_timeline(session_id: str) -> dict | None:
    session = db.get_session(session_id)
    if not session:
        return None
    return {"session": session, "events": db.session_events(session_id)}
