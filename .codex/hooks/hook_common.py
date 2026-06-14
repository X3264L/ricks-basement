from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from typing import Any

REDACTED = "[REDACTED]"
MAX_PREVIEW = 120

SENSITIVE_KEY_RE = re.compile(
    r"(api[_-]?key|token|secret|password|passwd|pwd|cookie|authorization|"
    r"private[_-]?key|ssh[_-]?key|database[_-]?url|db[_-]?url|supabase|github)",
    re.IGNORECASE,
)

SECRET_VALUE_PATTERNS = [
    re.compile(r"sk-(?:proj-)?[A-Za-z0-9_-]{20,}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{20,}"),
    re.compile(r"sb_(?:publishable|secret)_[A-Za-z0-9_-]{20,}"),
    re.compile(r"Bearer\s+[A-Za-z0-9._~+/=-]{16,}", re.IGNORECASE),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    re.compile(r"(?:postgres|postgresql|mysql|mongodb(?:\+srv)?)://[^\s]+", re.IGNORECASE),
    re.compile(r"(?i)(OPENAI_API_KEY|API_KEY|PASSWORD|TOKEN|SECRET)=([^\s]+)"),
    re.compile(r"[A-Za-z0-9+/]{48,}={0,2}"),
    re.compile(r"[A-Za-z0-9_-]{64,}"),
]


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_stdin_json() -> dict[str, Any]:
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            return {}
        data = json.loads(raw)
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def truncate(value: str, limit: int = MAX_PREVIEW) -> str:
    return value if len(value) <= limit else f"{value[:limit]}..."


def redact_string(value: str) -> str:
    result = value
    for pattern in SECRET_VALUE_PATTERNS:
        result = pattern.sub(REDACTED, result)
    return truncate(result)


def safe_value(value: Any, *, key: str = "") -> Any:
    if key and SENSITIVE_KEY_RE.search(key):
        return REDACTED
    if value is None or isinstance(value, bool | int | float):
        return value
    if isinstance(value, str):
        return redact_string(value)
    if isinstance(value, list | tuple):
        return [safe_value(item) for item in value[:8]]
    if isinstance(value, dict):
        return {redact_string(str(k))[:64]: safe_value(v, key=str(k)) for k, v in list(value.items())[:12]}
    return redact_string(str(value))


def _first_string(*values: Any) -> str | None:
    for value in values:
        if isinstance(value, str) and value:
            return redact_string(value)
    return None


def build_event(event_type: str, raw: dict[str, Any]) -> dict[str, Any]:
    tool = raw.get("tool") if isinstance(raw.get("tool"), dict) else {}
    metadata: dict[str, Any] = {}

    prompt = raw.get("prompt") or raw.get("user_prompt") or raw.get("input")
    if isinstance(prompt, str):
        metadata["prompt_length"] = len(prompt)

    output = raw.get("output") or raw.get("tool_output")
    if isinstance(output, str):
        metadata["output_length"] = len(output)

    command = _first_string(raw.get("command"), tool.get("command"))
    if command:
        metadata["command_preview"] = command

    cwd = _first_string(raw.get("cwd"), os.getcwd())
    if cwd:
        metadata["cwd_preview"] = cwd

    exit_code = raw.get("exit_code") or raw.get("returncode")
    if isinstance(exit_code, int):
        metadata["exit_code"] = exit_code

    status = raw.get("status")
    if not isinstance(status, str) and event_type == "PostToolUse":
        status = "success" if exit_code in {0, None} else "failure"

    return {
        "event_type": event_type,
        "session_id": safe_value(raw.get("session_id") or raw.get("conversation_id") or "local-codex"),
        "turn_id": safe_value(raw.get("turn_id")),
        "tool_name": _first_string(raw.get("tool_name"), tool.get("name"), raw.get("name")),
        "status": safe_value(status) if isinstance(status, str) else None,
        "timestamp": utc_now(),
        "duration_ms": raw.get("duration_ms") if isinstance(raw.get("duration_ms"), int) else None,
        "metadata": safe_value(metadata),
    }
