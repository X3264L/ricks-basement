# Rick's Basement Codex Hooks

Use when editing `.codex/hooks.json`, hook scripts, event payload extraction, privacy-safe telemetry, hook installation, or simulated events.

Rules:

- Hooks must never call an LLM.
- Hooks must fail silently when the backend is offline.
- Hooks must not print natural language.
- Hooks should output only `{}` when stdout is needed.
- Extract lengths, statuses, timings, and names instead of full prompts or full outputs.
