"""settings.py - Settings and About views."""

import streamlit as st

APP_VERSION = "1.0.0"


def render_settings(backend):
    st.markdown("### ⚙️ Settings")
    st.markdown('<div class="ppai-card">', unsafe_allow_html=True)

    st.markdown("**Theme**")
    st.selectbox("Appearance", ["Dark (default)"], disabled=True, label_visibility="collapsed")

    st.markdown("**Backend Status**")
    status = "🟢 Connected" if backend.is_ready else "🔴 Unavailable"
    st.write(status)
    if not backend.is_ready:
        st.caption(backend.init_error)

    st.markdown("**Version**")
    st.write(f"PathPilot AI v{APP_VERSION}")

    st.markdown("---")
    if st.button("🗑️ Clear Conversation", use_container_width=False):
        st.session_state.messages = []
        backend.reset_session()
        st.rerun()

    st.markdown("</div>", unsafe_allow_html=True)


def render_about():
    st.markdown("### ℹ️ About PathPilot AI")
    st.markdown('<div class="ppai-card">', unsafe_allow_html=True)

    st.markdown("**Project Name**")
    st.write("PathPilot AI")

    st.markdown("**Description**")
    st.write(
        "A multi-agent AI career coaching platform for college students and fresh "
        "graduates exploring careers in AI, Data Science, and Software Engineering. "
        "A central orchestrator routes each request to the right specialist agent — "
        "Roadmap, Resume, Interview, Skill Gap, Salary, Job Search, and more."
    )

    st.markdown("**Technologies Used**")
    st.markdown(
        "- Google Agent Development Kit (ADK)\n"
        "- Gemini\n"
        "- Python\n"
        "- Streamlit\n"
        "- Multi-Agent Architecture (Orchestrator + 10 Specialist Agents)"
    )

    st.markdown("**Author**")
    st.write("Built by Siddhi — AI/ML Engineering portfolio project.")

    st.markdown("</div>", unsafe_allow_html=True)
