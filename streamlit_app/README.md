# PathPilot AI — Streamlit Frontend

A production-styled, ChatGPT-inspired UI for your Google ADK multi-agent career coach.

## 1. Install dependencies

```bash
pip install -r requirements.txt
```

(Your ADK backend's own dependencies — `google-adk`, `google-genai`, etc. — should
already be installed in this same environment, since the UI imports `root_agent`
directly rather than calling a separate server.)

## 2. Connect your real backend (one line)

Open `utils/backend.py` and set:

```python
AGENT_IMPORT_PATH = "career_coach_agent.agent"  # <-- your actual package.module path
```

This must be the importable dotted path to the module that defines `root_agent`
(the file you shared, with `Agent(... sub_agents=[...])`). For example, if your
project structure is:

```
your_project/
  career_coach_agent/
    agent.py        <-- defines root_agent
    roadmap_agent/
    resume_agent/
    ...
```

then run Streamlit from `your_project/` and set
`AGENT_IMPORT_PATH = "career_coach_agent.agent"`.

Make sure your Gemini API key / `.env` is set up exactly as it is for your existing
ADK backend (e.g. `GOOGLE_API_KEY`), since this UI runs the same `root_agent` in-process.

## 3. Run

```bash
streamlit run app.py
```

## How the integration works

- `utils/backend.py` is the **only** file that touches `google.adk`. It creates a
  `Runner` + `InMemorySessionService` around your `root_agent`, keeps one ADK
  session per Streamlit session, and exposes a single `send_message()` call.
- Every ADK response `Event` is inspected for `event.author` (which sub-agent
  produced it) so the header badge and message bubble show which specialist
  answered — Roadmap, Resume, Interview, etc.
- If the import fails (wrong path, missing agent, misconfigured `.env`), the UI
  still loads and shows a clear inline error instead of crashing, so you can debug
  without losing the rest of the app.

## Project structure

```
streamlit_app/
  app.py                  Entry point — wires everything together
  components/
    sidebar.py            New chat, history, settings nav, profile
    header.py             Title + active-agent badge
    chat.py                Message loop, input, error/retry handling
    message.py             Single chat bubble renderer
    welcome.py              Empty-state + quick action cards
    settings.py             Settings + About panels
  styles/
    theme.py                Color palette, CSS, agent badge colors
  utils/
    backend.py              ADK Runner integration (the only ADK-aware file)
    helpers.py              Small formatting utilities
```
