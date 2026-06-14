.PHONY: install dev backend frontend simulate test lint format hooks-status hooks-install clean

UV_PROJECT_ENVIRONMENT ?= $(HOME)/.cache/ricks-basement/backend-venv
export UV_PROJECT_ENVIRONMENT

install:
	cd backend && uv sync
	cd frontend && corepack pnpm install

dev:
	cd backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8787 & cd frontend && corepack pnpm dev

backend:
	cd backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8787 --reload

frontend:
	cd frontend && corepack pnpm dev

simulate:
	python .codex/hooks/simulate_events.py

test:
	cd backend && uv run pytest
	cd frontend && corepack pnpm test

lint:
	cd backend && uv run ruff check .
	cd frontend && corepack pnpm lint && corepack pnpm typecheck

format:
	cd backend && uv run ruff format .
	cd frontend && corepack pnpm format

hooks-status:
	python .codex/hooks/install_hooks.py --status

hooks-install:
	python .codex/hooks/install_hooks.py

clean:
	cd backend && uv run python -c "from app.db import reset_db; reset_db()"
	cd frontend && corepack pnpm exec rimraf .next coverage
