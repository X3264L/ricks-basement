from __future__ import annotations

import re
from collections.abc import Mapping
from typing import Any

REDACTED = "[REDACTED]"
MAX_STRING_LENGTH = 160
MAX_METADATA_KEYS = 32

SENSITIVE_KEY_RE = re.compile(
    r"(api[_-]?key|token|secret|password|passwd|pwd|cookie|authorization|"
    r"private[_-]?key|ssh[_-]?key|database[_-]?url|db[_-]?url|supabase|github)",
    re.IGNORECASE,
)

SECRET_VALUE_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9_-]{20,}"),
    re.compile(r"sk-proj-[A-Za-z0-9_-]{20,}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{20,}"),
    re.compile(r"sb_(?:publishable|secret)_[A-Za-z0-9_-]{20,}"),
    re.compile(r"Bearer\s+[A-Za-z0-9._~+/=-]{16,}", re.IGNORECASE),
    re.compile(r"Authorization\s*:\s*[^\s]+", re.IGNORECASE),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    re.compile(r"postgres(?:ql)?://[^\s]+", re.IGNORECASE),
    re.compile(r"mysql://[^\s]+", re.IGNORECASE),
    re.compile(r"mongodb(?:\+srv)?://[^\s]+", re.IGNORECASE),
    re.compile(r"(?i)(OPENAI_API_KEY|API_KEY|PASSWORD|TOKEN|SECRET)=([^\s]+)"),
    re.compile(r"[A-Za-z0-9+/]{48,}={0,2}"),
    re.compile(r"[A-Za-z0-9_-]{64,}"),
]

MINIMAL_METADATA_ALLOWLIST = {
    "prompt_length",
    "input_length",
    "output_length",
    "exit_code",
    "cwd_preview",
    "path_preview",
    "tool_category",
}

BALANCED_METADATA_ALLOWLIST = MINIMAL_METADATA_ALLOWLIST | {
    "command_preview",
    "file_preview",
    "error_preview",
    "args_preview",
}


def truncate_value(value: str, limit: int = MAX_STRING_LENGTH) -> str:
    if len(value) <= limit:
        return value
    return f"{value[:limit]}..."


def redact_string(value: str) -> str:
    redacted = value
    for pattern in SECRET_VALUE_PATTERNS:
        redacted = pattern.sub(REDACTED, redacted)
    return truncate_value(redacted)


def is_sensitive_key(key: str) -> bool:
    return bool(SENSITIVE_KEY_RE.search(key))


def sanitize_value(value: Any, *, mode: str = "minimal", key: str = "") -> Any:
    if key and is_sensitive_key(key):
        return REDACTED
    if value is None or isinstance(value, bool | int | float):
        return value
    if isinstance(value, str):
        return redact_string(value)
    if isinstance(value, list | tuple):
        return [sanitize_value(item, mode=mode) for item in value[:12]]
    if isinstance(value, Mapping):
        return sanitize_metadata(dict(value), mode=mode)
    return truncate_value(redact_string(str(value)))


def sanitize_metadata(
    metadata: Mapping[str, Any] | None, *, mode: str = "minimal"
) -> dict[str, Any]:
    if not metadata:
        return {}
    allowed = MINIMAL_METADATA_ALLOWLIST
    if mode == "balanced":
        allowed = BALANCED_METADATA_ALLOWLIST
    elif mode == "debug":
        allowed = set(metadata.keys())

    sanitized: dict[str, Any] = {}
    for key, value in list(metadata.items())[:MAX_METADATA_KEYS]:
        safe_key = redact_string(str(key))[:64]
        if mode != "debug" and safe_key not in allowed:
            continue
        sanitized[safe_key] = sanitize_value(value, mode=mode, key=safe_key)
    return sanitized


def safe_summary(event_type: str, tool_name: str | None, status: str) -> str:
    tool_part = f"::{redact_string(tool_name)}" if tool_name else ""
    return f"{event_type}{tool_part}:{status}"
