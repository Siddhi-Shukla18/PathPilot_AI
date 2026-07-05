# 🚀 PathPilot AI – Multi-Agent Career Coach

> An AI-powered multi-agent career coach built with **Google ADK**, **Gemini**, **FastAPI**, and **React** to help students and fresh graduates make informed career decisions.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)
![Google ADK](https://img.shields.io/badge/Google-ADK-orange)
![Gemini](https://img.shields.io/badge/Gemini-AI-red)

---

# 📖 Overview

Choosing the right career path can be overwhelming for students and fresh graduates. Most AI chatbots provide generic responses, making it difficult to receive personalized career guidance.

**PathPilot AI** solves this by using a **multi-agent architecture** where specialized AI agents collaborate to deliver accurate, personalized, and actionable career guidance.

Rather than relying on one large prompt, the system intelligently routes user requests to expert agents responsible for different career domains.

---

# ✨ Features

- 🎯 Personalized Career Recommendations
- 🗺️ AI/ML Learning Roadmaps
- 📊 Skills Gap Analysis
- 📚 Learning Resource Recommendations
- 💡 Portfolio Project Suggestions
- 💻 Coding Practice Platform Recommendations
- 📄 Resume Review & ATS Optimization
- 🎤 Interview Preparation
- 💰 Salary Insights
- 🔍 Job Search Guidance
- 🧠 Intelligent Multi-Agent Routing
- 💬 Modern Chat Interface

---

# 🤖 Multi-Agent Architecture

PathPilot AI uses a central **Career Coach Agent** that orchestrates multiple specialist agents.

```
                    User
                      │
                      ▼
            Career Coach Agent
                      │
 ┌────────────────────┼────────────────────┐
 │                    │                    │
 ▼                    ▼                    ▼
Roadmap Agent   Career Agent     Skills Gap Agent
 │
 ▼
Resource Agent
 │
 ▼
Project Agent
 │
 ▼
Practice Agent

Resume Agent
Interview Agent
Salary Agent
Job Search Agent
```

Each specialist focuses on a single domain, resulting in better responses and easier scalability.

---

# 🛠️ Tech Stack

## Backend

- Python
- FastAPI
- Google ADK
- Gemini
- Async Programming

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

---

# 📂 Project Structure

```
PathPilot-AI
│
├── backend
│   ├── agents
│   ├── ai_career_coach
│   ├── backend.py
│   ├── requirements.txt
│   └── ...
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/Siddhi-Shukla18/PathPilot_AI.git
```

---

## 2. Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file and add your Gemini API key:

```env
GOOGLE_API_KEY=YOUR_API_KEY
```

Run the backend:

```bash
uvicorn backend:app --reload
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 💡 Example Questions

Users can ask questions such as:

- What roadmap should I follow to become an AI Engineer?
- Recommend AI projects for my portfolio.
- Analyze my skill gap for Machine Learning.
- Review my resume.
- Help me prepare for interviews.
- What salary can I expect as a Data Scientist?
- Recommend learning resources.
- How should I search for internships?

---

# 🌟 Highlights

✅ Multi-Agent Architecture

✅ Intelligent Request Routing

✅ Modular & Scalable Design

✅ Personalized Career Guidance

✅ Modern React UI

✅ FastAPI Backend

✅ Google ADK Integration

---

# 🔮 Future Improvements

- User Authentication
- Persistent Conversation History
- Voice Interaction
- Resume Parsing from PDF
- Live Job Listings
- Company-Specific Interview Preparation
- Progress Tracking Dashboard
- Personalized Learning Analytics

---

# 📸 Screenshots

> Add screenshots of your application here.

Examples:

- Dashboard
- Chat Interface
- Roadmap Generation
- Resume Review
- Interview Preparation

---

# 🎥 Demo

Demo Video:

> Add your YouTube demo link here.

---

# 📌 Competition

Developed for the **Google ADK Hackathon 2026** on Kaggle.

---

# 👩‍💻 Author

**Siddhi Shukla**

BCA Graduate | AI & Machine Learning Enthusiast

Passionate about building intelligent AI systems, multi-agent applications, and career-focused technologies that empower students through personalized guidance.

---

# ⭐ Acknowledgements

- Google ADK
- Gemini
- FastAPI
- React
- TypeScript
- Kaggle
