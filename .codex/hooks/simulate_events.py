from __future__ import annotations

import json
import time
import urllib.request
from datetime import datetime, timezone

BACKEND_URL = "http://127.0.0.1:8787/api/events"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def send(payload: dict) -> None:
    body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    request = urllib.request.Request(
        BACKEND_URL,
        data=body,
        headers={"content-type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=2) as response:
        response.read()


def main() -> int:
    session_id = f"sim-{int(time.time())}"
    events = [
        {"event_type": "SessionStart", "status": "booting", "metadata": {"tool_category": "core"}},
        {
            "event_type": "UserPromptSubmit",
            "status": "received",
            "metadata": {"prompt_length": 148},
        },
        {
            "event_type": "PreToolUse",
            "tool_name": "shell_command",
            "status": "running",
            "metadata": {"tool_category": "terminal", "command_preview": "pytest backend/tests"},
        },
        {
            "event_type": "PostToolUse",
            "tool_name": "shell_command",
            "status": "success",
            "duration_ms": 842,
            "metadata": {"exit_code": 0, "output_length": 614},
        },
        {
            "event_type": "PermissionRequest",
            "tool_name": "shell_command",
            "status": "approval_required",
            "metadata": {"tool_category": "containment", "command_preview": "write hook config"},
        },
        {"event_type": "PreCompact", "status": "pressure", "metadata": {"tool_category": "memory"}},
        {"event_type": "PostCompact", "status": "stable", "metadata": {"tool_category": "memory"}},
        {
            "event_type": "SubagentStart",
            "tool_name": "frontend-probe",
            "status": "running",
            "metadata": {"tool_category": "drone"},
        },
        {
            "event_type": "SubagentStop",
            "tool_name": "frontend-probe",
            "status": "docked",
            "duration_ms": 1200,
            "metadata": {"tool_category": "drone"},
        },
        {"event_type": "Stop", "status": "complete", "metadata": {"tool_category": "core"}},
    ]

    for event in events:
        event["session_id"] = session_id
        event["turn_id"] = "sim-turn-1"
        event["timestamp"] = now()
        send(event)
        print(f"sent {event['event_type']}")
        time.sleep(0.45)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
