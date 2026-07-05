import asyncio
import unittest

from streamlit_app.utils.backend import PathPilotBackend


class RetryableServerError(RuntimeError):
    def __init__(self, message: str = "503 UNAVAILABLE"):
        super().__init__(message)
        self.status_code = 503


class BackendReliabilityTests(unittest.TestCase):
    def test_detects_retryable_gemini_503_errors(self):
        backend = PathPilotBackend.__new__(PathPilotBackend)
        err = RetryableServerError("503 UNAVAILABLE")

        self.assertTrue(backend._is_retryable_error(err))

    def test_send_async_returns_overload_message_when_gemini_is_busy(self):
        backend = PathPilotBackend.__new__(PathPilotBackend)
        backend._runner = type("Runner", (), {})()
        backend._session_service = None
        backend._session_created = True
        backend.user_id = "user_123"
        backend.session_id = "session_123"

        async def raise_server_error(*args, **kwargs):
            if False:
                yield None
            raise RetryableServerError("503 UNAVAILABLE")

        backend._runner.run_async = raise_server_error

        async def fake_ensure_session():
            return None

        backend._ensure_session = fake_ensure_session

        async def run_test():
            return await backend._send_async("hello")

        result = asyncio.run(run_test())

        self.assertTrue(result.success)
        self.assertIn("temporarily overloaded", result.text.lower())

    def test_send_async_returns_structured_error_for_unexpected_exception(self):
        backend = PathPilotBackend.__new__(PathPilotBackend)
        backend._runner = type("Runner", (), {})()
        backend._session_service = None
        backend._session_created = True
        backend.user_id = "user_123"
        backend.session_id = "session_123"

        async def raise_unexpected_error(*args, **kwargs):
            if False:
                yield None
            raise RuntimeError("boom")

        backend._runner.run_async = raise_unexpected_error

        async def fake_ensure_session():
            return None

        backend._ensure_session = fake_ensure_session

        async def run_test():
            return await backend._send_async("hello")

        result = asyncio.run(run_test())

        self.assertFalse(result.success)
        self.assertIn("unexpected error", result.text.lower())


if __name__ == "__main__":
    unittest.main()
