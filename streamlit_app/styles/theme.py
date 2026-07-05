"""
theme.py
Centralized color palette and CSS injection for PathPilot AI.
Keeping all visual styling here means components stay free of inline style logic.
"""

COLORS = {
    "background": "#0B1220",
    "card": "#111827",
    "primary": "#3B82F6",
    "accent": "#8B5CF6",
    "success": "#22C55E",
    "text": "#F8FAFC",
    "muted": "#94A3B8",
    "danger": "#EF4444",
    "border": "rgba(148, 163, 184, 0.12)",
}

# Maps backend agent identifiers -> (display label, color) for the header badge
# and message attribution. Extend this if you add more sub-agents.
AGENT_BADGES = {
    "career_coach": ("Career Coach", COLORS["primary"]),
    "roadmap_agent": ("Roadmap Agent", COLORS["accent"]),
    "resource_agent": ("Resource Agent", "#06B6D4"),
    "project_agent": ("Project Agent", "#F59E0B"),
    "practice_agent": ("Practice Agent", "#EC4899"),
    "career_recommendation_agent": ("Career Recommendation", "#14B8A6"),
    "skills_gap_agent": ("Skill Gap Agent", "#F97316"),
    "resume_agent": ("Resume Agent", COLORS["success"]),
    "interview_agent": ("Interview Agent", "#A855F7"),
    "salary_agent": ("Salary Insights", "#22D3EE"),
    "job_search_agent": ("Job Search Agent", "#3B82F6"),
}

QUICK_ACTIONS = [
    {"icon": "🧭", "label": "Generate AI Roadmap", "prompt": "Create a learning roadmap for me to become an AI Engineer."},
    {"icon": "📄", "label": "Review Resume", "prompt": "Can you review my resume and suggest improvements?"},
    {"icon": "🎤", "label": "Prepare Interview", "prompt": "Help me prepare for a Machine Learning Engineer interview."},
    {"icon": "🧩", "label": "Skill Gap Analysis", "prompt": "Analyze my skill gaps for a Data Scientist role."},
    {"icon": "💰", "label": "Salary Insights", "prompt": "What salary can I expect as a fresher AI Engineer in India?"},
    {"icon": "📚", "label": "Find Learning Resources", "prompt": "Recommend the best resources to learn LLM engineering."},
    {"icon": "💼", "label": "Search Jobs", "prompt": "Help me find entry-level AI Engineer job openings."},
    {"icon": "🧑‍🏫", "label": "Career Guidance", "prompt": "I'm confused between Data Science and Software Engineering. Guide me."},
]


def inject_css():
    c = COLORS
    return f"""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    html, body, [class*="css"] {{
        font-family: 'Inter', sans-serif;
    }}

    .stApp {{
        background: radial-gradient(circle at 20% 0%, #0f1a2e 0%, {c['background']} 45%);
        color: {c['text']};
    }}

    #MainMenu, footer, header {{visibility: hidden;}}

    section[data-testid="stSidebar"] {{
        background: linear-gradient(180deg, #0d1526 0%, #0a0f1c 100%);
        border-right: 1px solid {c['border']};
    }}

    div[data-testid="stChatInput"] textarea {{
        background: {c['card']} !important;
        border: 1px solid {c['border']} !important;
        border-radius: 18px !important;
        color: {c['text']} !important;
        font-size: 15px !important;
    }}

    div[data-testid="stChatInput"] {{
        background: transparent !important;
    }}

    .stButton > button {{
        background: {c['card']};
        color: {c['text']};
        border: 1px solid {c['border']};
        border-radius: 12px;
        padding: 0.55rem 1rem;
        font-weight: 500;
        transition: all 0.2s ease;
        width: 100%;
    }}

    .stButton > button:hover {{
        border-color: {c['primary']};
        color: {c['primary']};
        box-shadow: 0 0 0 1px {c['primary']}55;
        transform: translateY(-1px);
    }}

    .primary-btn button {{
        background: linear-gradient(135deg, {c['primary']}, {c['accent']}) !important;
        color: white !important;
        border: none !important;
        font-weight: 600 !important;
    }}

    .ppai-card {{
        background: {c['card']};
        border: 1px solid {c['border']};
        border-radius: 16px;
        padding: 1.1rem 1.3rem;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.25);
    }}

    .ppai-badge {{
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 600;
        color: white;
        letter-spacing: 0.2px;
    }}

    .ppai-header-title {{
        font-size: 1.5rem;
        font-weight: 800;
        margin: 0;
        background: linear-gradient(135deg, {c['text']}, {c['muted']});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }}

    .ppai-header-sub {{
        color: {c['muted']};
        font-size: 0.85rem;
        margin: 0;
    }}

    .ppai-msg-user {{
        background: linear-gradient(135deg, {c['primary']}22, {c['accent']}18);
        border: 1px solid {c['primary']}33;
        border-radius: 18px 18px 4px 18px;
        padding: 0.85rem 1.1rem;
        color: {c['text']};
        margin: 6px 0;
        animation: fadeIn 0.25s ease;
    }}

    .ppai-msg-assistant {{
        background: {c['card']};
        border: 1px solid {c['border']};
        border-radius: 18px 18px 18px 4px;
        padding: 0.9rem 1.15rem;
        color: {c['text']};
        margin: 6px 0;
        animation: fadeIn 0.3s ease;
    }}

    .ppai-timestamp {{
        color: {c['muted']};
        font-size: 11px;
        margin-top: 4px;
    }}

    .ppai-welcome-logo {{
        font-size: 3.2rem;
        text-align: center;
        margin-bottom: 0.4rem;
    }}

    .ppai-welcome-heading {{
        text-align: center;
        font-size: 2rem;
        font-weight: 800;
        color: {c['text']};
        margin-bottom: 0.2rem;
    }}

    .ppai-welcome-sub {{
        text-align: center;
        color: {c['muted']};
        font-size: 1rem;
        margin-bottom: 2rem;
    }}

    .ppai-status-dot {{
        height: 9px;
        width: 9px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 6px;
    }}

    @keyframes fadeIn {{
        from {{ opacity: 0; transform: translateY(4px); }}
        to {{ opacity: 1; transform: translateY(0); }}
    }}

    ::-webkit-scrollbar {{ width: 8px; }}
    ::-webkit-scrollbar-thumb {{ background: {c['border']}; border-radius: 4px; }}
</style>
"""
