from __future__ import annotations

import json
import sys
import urllib.request

from hook_common import build_event, load_stdin_json

BACKEND_URL = "http://127.0.0.1:8787/api/events"


def post_event(payload: dict) -> None:
    try:
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        request = urllib.request.Request(
            BACKEND_URL,
            data=body,
            headers={"content-type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=1):
            pass
    except Exception:
        pass


def main() -> int:
    event_type = sys.argv[1] if len(sys.argv) > 1 else "Unknown"
    raw = load_stdin_json()
    post_event(build_event(event_type, raw))
    sys.stdout.write("{}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
