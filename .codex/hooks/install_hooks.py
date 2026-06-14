from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HOOKS_JSON = ROOT / ".codex" / "hooks.json"


def load_config() -> dict:
    return json.loads(HOOKS_JSON.read_text(encoding="utf-8"))


def status() -> None:
    config = load_config()
    for event_name in config.get("hooks", {}):
        print(event_name)


def install(yes: bool) -> None:
    print("Rick's Basement project hooks are local Python scripts.")
    print("Review .codex/hooks.json and trust this project before enabling hooks.")
    print("The hooks send minimal JSON to http://127.0.0.1:8787 and print only {}.")
    if not yes:
        answer = input("Confirm hooks reviewed and trusted? [y/N] ").strip().lower()
        if answer != "y":
            print("No changes made.")
            return
    print(f"Hook config ready at {HOOKS_JSON}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--status", action="store_true")
    parser.add_argument("--yes", action="store_true")
    args = parser.parse_args()
    if args.status:
        status()
    else:
        install(args.yes)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
