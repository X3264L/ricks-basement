# Contributing

Thanks for helping make Rick's Basement useful, weird, and safe.

## Principles

- Keep the project local-first.
- Preserve token efficiency.
- Never add LLM calls to hooks.
- Prefer minimal telemetry and explicit privacy choices.
- Keep the sci-fi basement identity strong.
- Add tests for privacy and event normalization changes.

## Development

```bash
make install
make dev
make simulate
make test
```

Use focused pull requests. Include screenshots or short recordings for visual changes.

## Code Style

- Python: Ruff and pytest.
- Frontend: TypeScript, ESLint, Prettier, Vitest.
- Comments should explain surprising logic, especially privacy decisions.

## Pull Requests

Before opening a PR:

- Run `make test`.
- Run `make lint`.
- Confirm hooks do not print natural language.
- Confirm secrets are redacted in new event paths.
