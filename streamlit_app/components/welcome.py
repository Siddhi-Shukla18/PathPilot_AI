"""welcome.py - empty-state screen shown before the first message."""

import streamlit as st

from styles.theme import QUICK_ACTIONS


def render_welcome():
    st.markdown('<div class="ppai-welcome-logo">🧭</div>', unsafe_allow_html=True)
    st.markdown('<div class="ppai-welcome-heading">Welcome to PathPilot AI</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="ppai-welcome-sub">Your intelligent multi-agent career coach powered by Google ADK.</div>',
        unsafe_allow_html=True,
    )

    rows = [QUICK_ACTIONS[i : i + 4] for i in range(0, len(QUICK_ACTIONS), 4)]
    clicked_prompt = None

    for row in rows:
        cols = st.columns(len(row))
        for col, action in zip(cols, row):
            with col:
                st.markdown('<div class="ppai-card" style="text-align:center; margin-bottom:0.6rem;">', unsafe_allow_html=True)
                st.markdown(f"<div style='font-size:1.6rem;'>{action['icon']}</div>", unsafe_allow_html=True)
                if st.button(action["label"], key=f"qa_{action['label']}", use_container_width=True):
                    clicked_prompt = action["prompt"]
                st.markdown("</div>", unsafe_allow_html=True)

    return clicked_prompt
