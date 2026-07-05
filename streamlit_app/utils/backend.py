"""
backend.py

Google ADK backend wrapper for PathPilot AI.
"""

from __future__ import annotations

import asyncio
import random
import threading
import time
import traceback
import uuid
from dataclasses import dataclass
from importlib import import_module
from typing import Optional
import os
import sys

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------

AGENT_IMPORT_PATH = "ai_career_coach.agent"
APP_NAME = "ai_career_coach"
MAX_RETRIES = 3
RETRY_BASE_DELAY = 1.0
RATE_LIMIT_WINDOW_SECONDS = 3.0


# -------------------------------------------------------------------
# Response Object
# -------------------------------------------------------------------

@dataclass
class AgentReply:
    text: str
    agent: str = "career_coach"
    success: bool = True
    error: Optional[str] = None
    response: Optional[str] = None


# -------------------------------------------------------------------
# Backend Wrapper
# -------------------------------------------------------------------

class PathPilotBackend:

    def __init__(self):

        self._runner = None
        self._session_service = None
        self._root_agent = None
        self._init_error = None

        self.user_id = f"user_{uuid.uuid4().hex[:8]}"
        self.session_id = f"session_{uuid.uuid4().hex[:8]}"

        self._session_created = False
        self._request_lock = threading.Lock()
        self._inflight_requests = {}
        self._request_history = {}

        self._load_agent()

    # ----------------------------------------------------------------

    def _load_agent(self):

        try:

            from google.adk.runners import Runner
            from google.adk.sessions import InMemorySessionService

            module = import_module(AGENT_IMPORT_PATH)

            self._root_agent = module.root_agent

            self._session_service = InMemorySessionService()

            self._runner = Runner(
                agent=self._root_agent,
                app_name=APP_NAME,
                session_service=self._session_service,
            )

        except Exception as e:

            self._init_error = (
                f"Failed to load ADK backend.\n\n"
                f"Import Path : {AGENT_IMPORT_PATH}\n\n"
                f"{e}\n\n"
                f"{traceback.format_exc()}"
            )

    # ----------------------------------------------------------------

    @property
    def is_ready(self):

        return self._runner is not None

    @property
    def init_error(self):

        return self._init_error

    # ----------------------------------------------------------------

    async def _ensure_session(self):

        if self._session_created:
            return

        try:

            await self._session_service.create_session(
                app_name=APP_NAME,
                user_id=self.user_id,
                session_id=self.session_id,
            )

        except Exception:
            # Session may already exist
            pass

        self._session_created = True

    # ----------------------------------------------------------------

    def _is_retryable_error(self, error: Exception) -> bool:
        status_code = getattr(error, "status_code", None)
        if status_code == 503:
            return True

        message = str(error).upper()
        if "503" in message or "UNAVAILABLE" in message or "OVERLOAD" in message:
            return True

        try:
            from google.genai.errors import ServerError
        except Exception:
            ServerError = None

        if ServerError is not None and isinstance(error, ServerError):
            return True

        return False

    def _request_key(self) -> str:
        return f"{self.user_id}:{self.session_id}"

    def _begin_request(self) -> tuple[bool, Optional[str]]:
        key = self._request_key()
        now = time.monotonic()

        with self._request_lock:
            if self._inflight_requests.get(key):
                return False, "Please wait, previous request is still processing."

            history = self._request_history.setdefault(key, [])
            history[:] = [ts for ts in history if now - ts <= RATE_LIMIT_WINDOW_SECONDS]

            if history:
                return False, "Please wait a moment before sending another request."

            history.append(now)
            self._inflight_requests[key] = True
            return True, None

    def _end_request(self) -> None:
        key = self._request_key()
        with self._request_lock:
            self._inflight_requests[key] = False

    async def _send_async(self, message: str) -> AgentReply:

        from google.genai import types

        await self._ensure_session()

        user_message = types.Content(
            role="user",
            parts=[
                types.Part(text=message)
            ],
        )

        response = ""
        responding_agent = "career_coach"

        last_error = None

        for attempt in range(MAX_RETRIES + 1):
            response = ""
            try:
                async for event in self._runner.run_async(
                    user_id=self.user_id,
                    session_id=self.session_id,
                    new_message=user_message,
                ):

                    if getattr(event, "author", None):
                        responding_agent = event.author

                    content = getattr(event, "content", None)

                    if content is None:
                        continue

                    parts = getattr(content, "parts", [])

                    for part in parts:

                        text = getattr(part, "text", None)

                        if text:
                            response += text

                if response.strip():
                    return AgentReply(
                        text=response,
                        agent=responding_agent,
                        success=True,
                    )

                return AgentReply(
                    text="No response was returned from the AI agent.",
                    agent=responding_agent,
                    success=True,
                )

            except Exception as e:
                last_error = e

                if self._is_retryable_error(e):
                    if attempt < MAX_RETRIES:
                        delay = RETRY_BASE_DELAY * (2 ** attempt) + random.uniform(0, 0.5)
                        await asyncio.sleep(delay)
                        continue

                    overload_message = (
                        "The AI model is temporarily overloaded. Please try again in a few moments."
                    )
                    return AgentReply(
                        text=overload_message,
                        agent=responding_agent,
                        success=True,
                        error=None,
                        response=overload_message,
                    )

                unexpected_error_message = (
                    "An unexpected error occurred while processing your request."
                )
                return AgentReply(
                    text=unexpected_error_message,
                    agent=responding_agent,
                    success=False,
                    error=f"Unexpected error: {e}\n\n{traceback.format_exc()}",
                    response=unexpected_error_message,
                )

        if self._is_retryable_error(last_error):
            overload_message = (
                "The AI model is temporarily overloaded. Please try again in a few moments."
            )
            return AgentReply(
                text=overload_message,
                agent=responding_agent,
                success=True,
                error=None,
                response=overload_message,
            )

        unexpected_error_message = (
            "An unexpected error occurred while processing your request."
        )
        return AgentReply(
            text=unexpected_error_message,
            agent=responding_agent,
            success=False,
            error=f"Unexpected error: {last_error}\n\n{traceback.format_exc()}" if last_error else None,
            response=unexpected_error_message,
        )

    # ----------------------------------------------------------------

    def send_message(self, message: str) -> AgentReply:

        if not self.is_ready:

            return AgentReply(
                text="Backend not initialized.",
                success=False,
                error=self._init_error,
            )

        allowed, reason = self._begin_request()
        if not allowed:
            return AgentReply(
                text=reason or "Please wait, previous request is still processing.",
                success=False,
                error=reason,
            )

        loop = None

        try:

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            return loop.run_until_complete(
                self._send_async(message)
            )

        except Exception as e:

            return AgentReply(
                text="Something went wrong while talking to the backend.",
                success=False,
                error=f"{e}\n\n{traceback.format_exc()}",
            )

        finally:
            self._end_request()

            if loop is not None:
                loop.close()

    # ----------------------------------------------------------------

    def reset_session(self):

        self.session_id = f"session_{uuid.uuid4().hex[:8]}"
        self._session_created = False


# -------------------------------------------------------------------
# Factory
# -------------------------------------------------------------------

def get_backend() -> PathPilotBackend:

    return PathPilotBackend()