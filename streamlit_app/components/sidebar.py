"""sidebar.py - left navigation rail."""

import streamlit as st

from utils.helpers import truncate


def render_sidebar(backend):
    with st.sidebar:
        st.markdown(
            """
            <div style="text-align:center; padding: 1rem 0 0.5rem 0;">
                <div style="font-size:2.2rem;">🧭</div>
                <div style="font-size:1.3rem; font-weight:800; color:#F8FAFC;">PathPilot AI</div>
                <div style="font-size:0.8rem; color:#94A3B8;">Your AI Career Coach</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        st.markdown("<hr style='border-color:rgba(148,163,184,0.12);'>", unsafe_allow_html=True)

        st.markdown('<div class="primary-btn">', unsafe_allow_html=True)
        if st.button("➕ New Chat", use_container_width=True):
            _start_new_chat(backend)
        st.markdown("</div>", unsafe_allow_html=True)

        nav = st.radio(
            "Navigate",
            ["💬 Chat", "🕘 History", "⚙️ Settings", "ℹ️ About"],
            label_visibility="collapsed",
        )
        st.session_state.active_view = nav

        if st.button("🗑️ Clear Chat", use_container_width=True):
            st.session_state.messages = []
            backend.reset_session()
            st.rerun()

        st.markdown("<div style='margin-top:1rem;'></div>", unsafe_allow_html=True)
        st.markdown("**Conversation History**")
        history = st.session_state.get("chat_titles", [])
        if not history:
            st.caption("Your recent chats will appear here.")
        else:
            for i, title in enumerate(history[-8:][::-1]):
                st.button(f"💬 {truncate(title, 28)}", key=f"hist_{i}", use_container_width=True)

        st.markdown(
            "<div style='flex:1; min-height:80px;'></div>", unsafe_allow_html=True
        )

        st.markdown("<hr style='border-color:rgba(148,163,184,0.12);'>", unsafe_allow_html=True)
        status_color = "#22C55E" if backend.is_ready else "#EF4444"
        status_text = "Backend Connected" if backend.is_ready else "Backend Unavailable"
        st.markdown(
            f"""
            <div style="display:flex; align-items:center; gap:8px; padding:0.4rem 0;">
                <span class="ppai-status-dot" style="background:{status_color};"></span>
                <span style="font-size:0.8rem; color:#94A3B8;">{status_text}</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px; padding:0.6rem 0;">
                <div style="width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#3B82F6,#8B5CF6);
                            display:flex; align-items:center; justify-content:center; font-weight:700; color:white;">S</div>
                <div>
                    <div style="font-size:0.85rem; font-weight:600; color:#F8FAFC;">Guest User</div>
                    <div style="font-size:0.72rem; color:#94A3B8;">Career Explorer</div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        return nav


def _start_new_chat(backend):
    if st.session_state.get("messages"):
        first_user_msg = next(
            (m["content"] for m in st.session_state.messages if m["role"] == "user"), "New chat"
        )
        st.session_state.setdefault("chat_titles", []).append(first_user_msg)
    st.session_state.messages = []
    backend.reset_session()
    st.rerun()
