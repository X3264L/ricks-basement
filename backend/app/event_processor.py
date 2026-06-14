from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from .privacy import safe_summary, sanitize_metadata, sanitize_value
from .schemas import NormalizedEvent, RawEvent
from .settings import settings

VISUAL_STATE_BY_EVENT = {
    "SessionStart": "BOOTING",
    "UserPromptSubmit": "EXPERIMENT_RECEIVED",
    "PreToolUse": "TOOL_ARMING",
    "PostToolUse": "TOOL_COMPLETE",
    "PermissionRequest": "CONTAINMENT_LOCK",
    "PreCompact": "MEMORY_PRESSURE",
    "PostCompact": "MEMORY_STABILIZED",
    "SubagentStart": "DRONE_DEPLOYED",
    "SubagentStop": "DRONE_DOCKED",
    "Stop": "EXPERIMENT_COMPLETE",
}

TOOL_RUNNING_EVENTS = {"PreToolUse"}
COMPACT_EVENTS = {"PreCompact", "PostCompact"}


def _timestamp(value: str | None) -> str:
    if not value:
        return datetime.now(timezone.utc).isoformat()
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed.astimezone(timezone.utc).isoformat()
    except ValueError:
        return datetime.now(timezone.utc).isoformat()


def _status(raw: RawEvent) -> str:
    event_type = raw.event_type
    supplied = (raw.status or "").lower()
    if event_type == "PostToolUse":
        if supplied in {"error", "failed", "failure"}:
            return "failure"
        if supplied in {"ok", "success", "succeeded"}:
            return "success"
        exit_code = raw.metadata.get("exit_code")
        return "success" if exit_code in {0, "0", None} else "failure"
    if event_type in TOOL_RUNNING_EVENTS:
        return "running"
    if event_type == "PermissionRequest":
        return "approval_required"
    if event_type == "Stop":
        return "complete"
    return supplied or "received"


def _visual_state(event_type: str, status: str) -> str:
    if event_type == "PostToolUse" and status == "failure":
        return "TOOL_FAILED"
    return VISUAL_STATE_BY_EVENT.get(event_type, "SIGNAL_RECEIVED")


def _session_id(raw: RawEvent) -> str:
    value = raw.session_id or raw.metadata.get("session_id")
    if value:
        return str(sanitize_value(value, mode="minimal"))
    return f"local-{uuid4().hex[:12]}"


def normalize_raw_event(
    payload: dict[str, Any], *, privacy_mode: str | None = None
) -> NormalizedEvent:
    raw = RawEvent.model_validate(payload)
    mode = privacy_mode or settings.safe_privacy_mode()
    status = _status(raw)
    visual_state = _visual_state(raw.event_type, status)
    metadata = sanitize_metadata(raw.metadata, mode=mode)
    tool_name = sanitize_value(raw.tool_name, mode="minimal") if raw.tool_name else None

    return NormalizedEvent(
        event_type=raw.event_type,
        visual_state=visual_state,  # type: ignore[arg-type]
        session_id=_session_id(raw),
        turn_id=str(sanitize_value(raw.turn_id, mode="minimal")) if raw.turn_id else None,
        tool_name=str(tool_name) if tool_name else None,
        status=status,
        timestamp=_timestamp(raw.timestamp),
        duration_ms=raw.duration_ms,
        safe_summary=safe_summary(raw.event_type, str(tool_name) if tool_name else None, status),
        metadata=metadata,
    )
