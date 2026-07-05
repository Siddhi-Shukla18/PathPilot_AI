"""header.py - top bar with title and active-agent badge."""

import streamlit as st

from styles.theme import AGENT_BADGES


def render_header():
    active_agent = st.session_state.get("active_agent", "career_coach")
    label, color = AGENT_BADGES.get(active_agent, AGENT_BADGES["career_coach"])

    col1, col2 = st.columns([4, 1.4])
    with col1:
        st.markdown(
            """
            <p class="ppai-header-title">PathPilot AI</p>
            <p class="ppai-header-sub">Multi-Agent Career Intelligence Platform</p>
            """,
            unsafe_allow_html=True,
        )
    with col2:
        st.markdown(
            f"""
            <div style="display:flex; justify-content:flex-end; padding-top:0.6rem;">
                <span class="ppai-badge" style="background:{color};">● {label}</span>
            </div>
            """,
            unsafe_allow_html=True,
        )
    st.markdown("<hr style='border-color:rgba(148,163,184,0.12); margin-top:0.2rem;'>", unsafe_allow_html=True)
