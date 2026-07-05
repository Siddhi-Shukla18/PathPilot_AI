"""chat.py - the main conversation surface: history + input + backend calls."""

import streamlit as st

from components.message import render_message
from components.welcome import render_welcome
from utils.helpers import new_message


def render_chat(backend):
    if "messages" not in st.session_state:
        st.session_state.messages = []

    messages = st.session_state.messages

    prefill_prompt = None
    if not messages:
        prefill_prompt = render_welcome()

    chat_container = st.container()
    with chat_container:
        for msg in messages:
            render_message(msg)

    user_prompt = st.chat_input("Message PathPilot AI...")
    final_prompt = user_prompt or prefill_prompt

    if final_prompt:
        _handle_new_message(backend, final_prompt)


def _handle_new_message(backend, prompt: str):
    st.session_state.messages.append(new_message("user", prompt))

    with st.chat_message("assistant", avatar="🧭"):
        with st.spinner("PathPilot AI is thinking..."):
            reply = backend.send_message(prompt)

    if reply.success:
        st.session_state.active_agent = reply.agent
        st.session_state.messages.append(new_message("assistant", reply.text, agent=reply.agent))
    else:
        st.session_state.messages.append(
            new_message("assistant", f"⚠️ {reply.text}", agent="career_coach")
        )
        if reply.error:
            with st.expander("Error details"):
                st.code(reply.error)
        if st.button("🔄 Retry"):
            _handle_new_message(backend, prompt)
            return

    st.rerun()
