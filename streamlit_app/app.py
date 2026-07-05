"""
PathPilot AI
Main Streamlit Application

Run:
    streamlit run app.py
"""

from dotenv import load_dotenv
load_dotenv()   
import streamlit as st

from styles.theme import inject_css
from utils.backend import get_backend

# Components
from components.sidebar import render_sidebar
from components.header import render_header
from components.chat import render_chat
from components.settings import render_settings, render_about


# ---------------------------------------------------
# Page Config
# ---------------------------------------------------

st.set_page_config(
    page_title="PathPilot AI",
    page_icon="🧭",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------------------------------------------
# Theme
# ---------------------------------------------------

st.markdown(inject_css(), unsafe_allow_html=True)

# ---------------------------------------------------
# Session State Initialization
# ---------------------------------------------------

if "backend" not in st.session_state:
    st.session_state.backend = get_backend()

backend = st.session_state.backend

if "messages" not in st.session_state:
    st.session_state.messages = []

if "chat_titles" not in st.session_state:
    st.session_state.chat_titles = []

if "active_agent" not in st.session_state:
    st.session_state.active_agent = "career_coach"

# ---------------------------------------------------
# Sidebar
# ---------------------------------------------------

try:
    active_view = render_sidebar(backend)
except Exception as e:
    st.sidebar.error("Sidebar Error")
    st.sidebar.exception(e)
    active_view = "💬 Chat"

# ---------------------------------------------------
# Backend Status
# ---------------------------------------------------

if backend.is_ready:

    st.sidebar.success("Backend Connected")

else:

    st.sidebar.error("Backend Not Connected")

    st.warning(
        """
⚠️ Backend could not be loaded.

Please verify:

• AGENT_IMPORT_PATH in utils/backend.py

• Your root_agent import

• Gemini API Key

• Project structure
"""
    )

    with st.expander("Backend Error Details"):

        st.code(backend.init_error or "Unknown Error")

# ---------------------------------------------------
# Routing
# ---------------------------------------------------

if active_view == "💬 Chat":

    render_header()

    try:
        render_chat(backend)
    except Exception as e:
        st.error("Chat component crashed.")
        st.exception(e)

elif active_view == "🕘 History":

    render_header()

    st.title("Conversation History")

    if len(st.session_state.chat_titles) == 0:

        st.info("No previous conversations.")

    else:

        for title in reversed(st.session_state.chat_titles):

            st.container(border=True).write(title)

elif active_view == "⚙️ Settings":

    try:
        render_settings(backend)
    except Exception as e:
        st.exception(e)

elif active_view == "ℹ️ About":

    render_about()

else:

    render_header()
    render_chat(backend)