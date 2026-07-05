"""message.py - renders a single chat message bubble."""

import streamlit as st

from styles.theme import AGENT_BADGES


def render_message(message: dict):
    role = message["role"]
    content = message["content"]
    timestamp = message.get("timestamp", "")

    if role == "user":
        avatar = "🧑"
        bubble_class = "ppai-msg-user"
    else:
        avatar = "🧭"
        bubble_class = "ppai-msg-assistant"

    with st.chat_message(role, avatar=avatar):
        if role == "assistant":
            agent_key = message.get("agent", "career_coach")
            label, color = AGENT_BADGES.get(agent_key, AGENT_BADGES["career_coach"])
            st.markdown(
                f'<span class="ppai-badge" style="background:{color}; font-size:11px; margin-bottom:6px;">● {label}</span>',
                unsafe_allow_html=True,
            )
        st.markdown(f'<div class="{bubble_class}">{content}</div>', unsafe_allow_html=True)
        st.markdown(f'<div class="ppai-timestamp">{timestamp}</div>', unsafe_allow_html=True)
