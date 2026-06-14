# Security

Rick's Basement handles local development telemetry. Treat session data as sensitive even when privacy mode is minimal.

## Supported Versions

The `main` branch is the supported development line until the first release.

## Reporting Vulnerabilities

Do not open public issues containing secrets, prompts, command output, private files, tokens, or session dumps. Contact the maintainers privately with a minimal reproduction and redacted logs.

## Privacy-Sensitive Areas

- `.codex/hooks/*`
- `backend/app/privacy.py`
- `backend/app/event_processor.py`
- `backend/app/db.py`
- `frontend/src/lib/privacy.ts`

## Rules

- Hooks must never call an LLM.
- Hooks must never store full prompts or full tool output by default.
- Hooks must fail silently when the backend is offline.
- If unsure whether a value is sensitive, redact it.
