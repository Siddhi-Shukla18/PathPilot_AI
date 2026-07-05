"""helpers.py - small stateless utility functions shared across components."""

from datetime import datetime


def now_stamp() -> str:
    return datetime.now().strftime("%I:%M %p").lstrip("0")


def new_message(role: str, content: str, agent: str = "career_coach") -> dict:
    return {
        "role": role,
        "content": content,
        "agent": agent,
        "timestamp": now_stamp(),
    }


def truncate(text: str, length: int = 40) -> str:
    return text if len(text) <= length else text[: length - 1].rstrip() + "…"
