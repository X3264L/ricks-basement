from app.privacy import REDACTED, redact_string, sanitize_metadata


def test_redacts_common_secrets() -> None:
    text = "OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz1234567890"
    assert REDACTED in redact_string(text)
    assert "sk-proj" not in redact_string(text)


def test_sensitive_keys_are_redacted() -> None:
    metadata = sanitize_metadata(
        {
            "authorization": "Bearer abcdefghijklmnopqrstuvwxyz123456",
            "password": "correct-horse-battery-staple",
            "prompt_length": 12,
        },
        mode="debug",
    )
    assert metadata["authorization"] == REDACTED
    assert metadata["password"] == REDACTED
    assert metadata["prompt_length"] == 12


def test_minimal_mode_drops_unapproved_metadata() -> None:
    metadata = sanitize_metadata(
        {"prompt": "do not store me", "prompt_length": 18, "command_preview": "pytest"},
        mode="minimal",
    )
    assert metadata == {"prompt_length": 18}


def test_large_values_are_truncated() -> None:
    metadata = sanitize_metadata({"error_preview": "x" * 500}, mode="balanced")
    assert len(metadata["error_preview"]) < 200
