from pathlib import Path

from fastapi.testclient import TestClient

from app import db
from app.main import app
from app.settings import Settings


def client_with_db(tmp_path: Path, monkeypatch) -> TestClient:
    monkeypatch.setattr(db, "settings", Settings(database_path=tmp_path / "events.sqlite3"))
    db.reset_db()
    return TestClient(app)


def test_health_endpoint(tmp_path: Path, monkeypatch) -> None:
    client = client_with_db(tmp_path, monkeypatch)
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "ricks-basement",
        "version": "0.1.0",
    }


def test_events_are_accepted_and_normalized(tmp_path: Path, monkeypatch) -> None:
    client = client_with_db(tmp_path, monkeypatch)
    response = client.post(
        "/api/events",
        json={
            "event_type": "PostToolUse",
            "session_id": "s1",
            "tool_name": "shell_command",
            "status": "failure",
            "metadata": {"exit_code": 1, "command": "should not persist"},
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["visual_state"] == "TOOL_FAILED"
    assert payload["metadata"] == {"exit_code": 1}


def test_sessions_are_grouped(tmp_path: Path, monkeypatch) -> None:
    client = client_with_db(tmp_path, monkeypatch)
    for event_type in ["SessionStart", "PreToolUse", "PermissionRequest", "PreCompact", "Stop"]:
        client.post("/api/events", json={"event_type": event_type, "session_id": "s2"})

    sessions = client.get("/api/sessions").json()
    session = next(item for item in sessions if item["id"] == "s2")
    assert session["event_count"] == 5
    assert session["tool_count"] == 1
    assert session["approval_count"] == 1
    assert session["compact_count"] == 1
    assert session["status"] == "complete"
