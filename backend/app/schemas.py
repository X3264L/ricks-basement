from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


VisualState = Literal[
    "IDLE",
    "BOOTING",
    "EXPERIMENT_RECEIVED",
    "THINKING",
    "TOOL_ARMING",
    "TOOL_RUNNING",
    "TOOL_COMPLETE",
    "TOOL_FAILED",
    "CONTAINMENT_LOCK",
    "MEMORY_PRESSURE",
    "MEMORY_STABILIZED",
    "DRONE_DEPLOYED",
    "DRONE_DOCKED",
    "EXPERIMENT_COMPLETE",
    "SIGNAL_RECEIVED",
]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class RawEvent(BaseModel):
    model_config = ConfigDict(extra="allow")

    event_type: str = Field(default="Unknown")
    session_id: str | None = None
    turn_id: str | None = None
    tool_name: str | None = None
    status: str | None = None
    timestamp: str = Field(default_factory=utc_now_iso)
    duration_ms: int | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class NormalizedEvent(BaseModel):
    event_type: str
    visual_state: VisualState
    session_id: str
    turn_id: str | None = None
    tool_name: str | None = None
    status: str
    timestamp: str
    duration_ms: int | None = None
    safe_summary: str = ""
    metadata: dict[str, Any] = Field(default_factory=dict)


class StoredEvent(NormalizedEvent):
    id: int
    created_at: str


class SessionSummary(BaseModel):
    id: str
    started_at: str
    ended_at: str | None = None
    event_count: int = 0
    tool_count: int = 0
    approval_count: int = 0
    compact_count: int = 0
    status: str = "active"


class PaginatedEvents(BaseModel):
    events: list[StoredEvent]
    limit: int
    offset: int
    total: int
