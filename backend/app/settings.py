from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


VALID_PRIVACY_MODES = {"minimal", "balanced", "debug"}


@dataclass(frozen=True)
class Settings:
    service: str = "ricks-basement"
    version: str = "0.1.0"
    host: str = os.getenv("RICKS_BASEMENT_HOST", "127.0.0.1")
    port: int = int(os.getenv("RICKS_BASEMENT_PORT", "8787"))
    privacy_mode: str = os.getenv("RICKS_BASEMENT_PRIVACY_MODE", "minimal").lower()
    database_path: Path = Path(os.getenv("RICKS_BASEMENT_DB_PATH", "ricks-basement.sqlite3"))

    def safe_privacy_mode(self) -> str:
        if self.privacy_mode in VALID_PRIVACY_MODES:
            return self.privacy_mode
        return "minimal"


settings = Settings()
