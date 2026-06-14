import json
import subprocess
import sys
from pathlib import Path

HOOKS = Path(__file__).resolve().parents[2] / ".codex" / "hooks"
sys.path.insert(0, str(HOOKS))

from hook_common import build_event  # noqa: E402


def test_malformed_json_does_not_crash() -> None:
    result = subprocess.run(
        [sys.executable, str(HOOKS / "emit_event.py"), "Stop"],
        input="{not-json",
        text=True,
        capture_output=True,
        timeout=3,
        check=False,
    )
    assert result.returncode == 0
    assert result.stdout == "{}"
    assert result.stderr == ""


def test_backend_offline_does_not_crash() -> None:
    result = subprocess.run(
        [sys.executable, str(HOOKS / "emit_event.py"), "SubagentStop"],
        input=json.dumps({"session_id": "offline"}),
        text=True,
        capture_output=True,
        timeout=3,
        check=False,
    )
    assert result.returncode == 0
    assert result.stdout == "{}"


def test_hook_redacts_secrets() -> None:
    event = build_event(
        "PreToolUse",
        {
            "tool_name": "shell",
            "command": "echo OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz1234567890",
            "authorization": "Bearer abcdefghijklmnopqrstuvwxyz123456",
        },
    )
    dumped = json.dumps(event)
    assert "sk-proj" not in dumped
    assert "Bearer abc" not in dumped


def test_stop_outputs_valid_json_shape() -> None:
    result = subprocess.run(
        [sys.executable, str(HOOKS / "emit_event.py"), "Stop"],
        input=json.dumps({}),
        text=True,
        capture_output=True,
        timeout=3,
        check=False,
    )
    assert json.loads(result.stdout) == {}
