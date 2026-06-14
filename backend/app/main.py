from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from . import db
from .event_processor import normalize_raw_event
from .replay import list_session_summaries, session_timeline
from .settings import settings
from .websocket_manager import manager

app = FastAPI(title="Rick's Basement", version=settings.version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["content-type"],
)


@app.on_event("startup")
def startup() -> None:
    db.init_db()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "healthy", "service": settings.service, "version": settings.version}


@app.post("/api/events")
async def create_event(payload: dict[str, Any]) -> dict[str, Any]:
    event = normalize_raw_event(payload)
    stored = db.insert_event(event)
    await manager.broadcast({"type": "event", "event": stored})
    return stored


@app.get("/api/events")
def events(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
) -> dict[str, Any]:
    return {
        "events": db.list_events(limit=limit, offset=offset),
        "limit": limit,
        "offset": offset,
        "total": db.count_events(),
    }


@app.get("/api/sessions")
def sessions() -> list[dict[str, Any]]:
    return list_session_summaries()


@app.get("/api/sessions/{session_id}")
def session(session_id: str) -> dict[str, Any]:
    timeline = session_timeline(session_id)
    if not timeline:
        raise HTTPException(status_code=404, detail="Session not found")
    return timeline


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
