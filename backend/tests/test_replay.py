from pathlib import Path

from fastapi.testclient import TestClient

from app import db
from app.main import app
from app.settings import Settings


def test_session_timeline_orders_events(tmp_path: Path, monkeypatch) -> None:
    monkeypatch.setattr(db, "settings", Settings(database_path=tmp_path / "replay.sqlite3"))
    db.reset_db()
    client = TestClient(app)

    client.post(
        "/api/events",
        json={
            "event_type": "SessionStart",
            "session_id": "timeline",
            "timestamp": "2026-01-01T00:00:00Z",
        },
    )
    client.post(
        "/api/events",
        json={"event_type": "Stop", "session_id": "timeline", "timestamp": "2026-01-01T00:00:02Z"},
    )

    response = client.get("/api/sessions/timeline")
    assert response.status_code == 200
    payload = response.json()
    assert [event["event_type"] for event in payload["events"]] == ["SessionStart", "Stop"]
