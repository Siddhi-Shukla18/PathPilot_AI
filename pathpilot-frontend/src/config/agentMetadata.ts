/**
 * agentMetadata.ts
 *
 * SINGLE SOURCE OF TRUTH for all PathPilot AI agents.
 *
 * To add a new agent:
 *   1. Add an entry to AGENT_METADATA below.
 *   2. The badge, routing display, sidebar, and all UI update automatically.
 *
 * Fields:
 *   id         — matches the ADK agent `name` field exactly
 *   displayName — human-readable label
 *   emoji       — shown in badges and routing path
 *   icon        — Lucide icon name (used via dynamic icon component)
 *   description — short one-line purpose
 *   color       — CSS hex/hsl used for badge glow and accent
 *   gradient    — Tailwind gradient classes for card backgrounds
 *   badge       — short badge label (fits in pill)
 *   category    — groups agents in the UI
 *   suggestedPrompts — quick-start prompts shown on welcome screen
 */

export type AgentId =
  | 'career_coach'
  | 'roadmap_agent'
  | 'career_recommendation_agent'
  | 'skills_gap_agent'
  | 'project_agent'
  | 'resource_agent'
  | 'practice_agent'
  | 'resume_agent'
  | 'interview_agent'
  | 'salary_agent'
  | 'job_search_agent';

export type AgentCategory =
  | 'root'
  | 'career'
  | 'learning'
  | 'practice'
  | 'job-search';

export interface AgentMeta {
  id: AgentId;
  displayName: string;
  emoji: string;
  iconName: string;          // lucide-react icon name
  description: string;
  color: string;             // hex color for glow effects
  gradient: string;          // tailwind gradient classes
  badgeLabel: string;
  category: AgentCategory;
  suggestedPrompts: string[];
}

export const AGENT_METADATA: Record<AgentId, AgentMeta> = {
  career_coach: {
    id: 'career_coach',
    displayName: 'Career Coach',
    emoji: '🧭',
    iconName: 'Compass',
    description: 'Your central AI orchestrator that routes you to the right specialist',
    color: '#6366f1',
    gradient: 'from-indigo-500/20 to-violet-500/20',
    badgeLabel: 'Career Coach',
    category: 'root',
    suggestedPrompts: [
      'What career should I choose in AI?',
      'How do I break into tech?',
      'Build me a 6-month learning plan',
      'Review my career goals',
    ],
  },

  roadmap_agent: {
    id: 'roadmap_agent',
    displayName: 'Roadmap Planner',
    emoji: '📖',
    iconName: 'Map',
    description: 'Creates structured, step-by-step learning roadmaps for your career goal',
    color: '#0ea5e9',
    gradient: 'from-sky-500/20 to-cyan-500/20',
    badgeLabel: 'Roadmap Planner',
    category: 'learning',
    suggestedPrompts: [
      'Create a roadmap to become an ML Engineer',
      'How do I become a Data Scientist in 1 year?',
      'Give me a Full Stack roadmap for a beginner',
      'What should I learn for backend engineering?',
    ],
  },

  career_recommendation_agent: {
    id: 'career_recommendation_agent',
    displayName: 'Career Advisor',
    emoji: '🚀',
    iconName: 'Rocket',
    description: 'Helps you discover which career path best fits your skills and interests',
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-orange-500/20',
    badgeLabel: 'Career Advisor',
    category: 'career',
    suggestedPrompts: [
      'Which is better for me: AI or Data Science?',
      'I like math and coding — what career fits?',
      'Compare ML Engineer vs Data Analyst',
      'What tech career has the best growth?',
    ],
  },

  skills_gap_agent: {
    id: 'skills_gap_agent',
    displayName: 'Skills Gap Analyzer',
    emoji: '📊',
    iconName: 'BarChart3',
    description: 'Compares your current skills against what your target role requires',
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-green-500/20',
    badgeLabel: 'Skills Analyzer',
    category: 'career',
    suggestedPrompts: [
      'Am I ready for a Data Scientist role?',
      'What skills am I missing for ML Engineering?',
      'Analyze my skills: Python, SQL, Excel',
      'What do I need to learn for AI research?',
    ],
  },

  project_agent: {
    id: 'project_agent',
    displayName: 'Project Mentor',
    emoji: '🛠',
    iconName: 'Wrench',
    description: 'Suggests portfolio-worthy projects based on your level and target role',
    color: '#8b5cf6',
    gradient: 'from-violet-500/20 to-purple-500/20',
    badgeLabel: 'Project Mentor',
    category: 'learning',
    suggestedPrompts: [
      'Give me 5 AI projects for my portfolio',
      'What project should a beginner ML engineer build?',
      'Suggest a capstone project for data science',
      'Ideas for a resume-worthy backend project',
    ],
  },

  resource_agent: {
    id: 'resource_agent',
    displayName: 'Resource Expert',
    emoji: '📚',
    iconName: 'BookOpen',
    description: 'Recommends the best courses, books, and tutorials for your goal',
    color: '#ec4899',
    gradient: 'from-pink-500/20 to-rose-500/20',
    badgeLabel: 'Resource Expert',
    category: 'learning',
    suggestedPrompts: [
      'Best free courses for Machine Learning',
      'Top books for Data Science beginners',
      'Recommend YouTube channels for Python',
      'Best Coursera courses for AI?',
    ],
  },

  practice_agent: {
    id: 'practice_agent',
    displayName: 'Practice Advisor',
    emoji: '⚡',
    iconName: 'Zap',
    description: 'Recommends coding platforms, competitions, and practice strategies',
    color: '#f97316',
    gradient: 'from-orange-500/20 to-red-500/20',
    badgeLabel: 'Practice Advisor',
    category: 'practice',
    suggestedPrompts: [
      'Where should I practice SQL?',
      'Best LeetCode plan for interviews',
      'How to get started with Kaggle?',
      'Python coding challenges for beginners',
    ],
  },

  resume_agent: {
    id: 'resume_agent',
    displayName: 'Resume Expert',
    emoji: '🧠',
    iconName: 'FileText',
    description: 'Reviews, rewrites, and optimizes your resume for ATS and recruiters',
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    badgeLabel: 'Resume Expert',
    category: 'job-search',
    suggestedPrompts: [
      'Review my resume for a Data Science role',
      'How do I make my resume ATS-friendly?',
      'Improve my experience section',
      'What skills should I add to my resume?',
    ],
  },

  interview_agent: {
    id: 'interview_agent',
    displayName: 'Interview Coach',
    emoji: '🎯',
    iconName: 'Target',
    description: 'Conducts mock interviews and prepares you for technical and behavioral rounds',
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-fuchsia-500/20',
    badgeLabel: 'Interview Coach',
    category: 'job-search',
    suggestedPrompts: [
      'Give me a mock ML interview',
      'Common behavioral interview questions',
      'Technical interview for Python developer',
      'How do I answer "Tell me about yourself"?',
    ],
  },

  salary_agent: {
    id: 'salary_agent',
    displayName: 'Salary Insights',
    emoji: '📈',
    iconName: 'TrendingUp',
    description: 'Provides salary ranges, negotiation tips, and compensation insights',
    color: '#22c55e',
    gradient: 'from-green-500/20 to-emerald-500/20',
    badgeLabel: 'Salary Insights',
    category: 'job-search',
    suggestedPrompts: [
      'What is the salary for a Data Scientist in India?',
      'How do I negotiate my first offer?',
      'ML Engineer salary at Google vs startup',
      'Expected CTC for a fresher in AI?',
    ],
  },

  job_search_agent: {
    id: 'job_search_agent',
    displayName: 'Job Search Expert',
    emoji: '💼',
    iconName: 'Briefcase',
    description: 'Helps with job portals, networking, applications, and referral strategies',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-indigo-500/20',
    badgeLabel: 'Job Search Expert',
    category: 'job-search',
    suggestedPrompts: [
      'How do I find AI internships?',
      'Best job portals for ML Engineers',
      'How to get a referral at Google?',
      'LinkedIn optimization for job search',
    ],
  },
};

/** Get agent metadata by ID — returns career_coach as fallback */
export function getAgentMeta(id: string | undefined): AgentMeta {
  if (id && id in AGENT_METADATA) {
    return AGENT_METADATA[id as AgentId];
  }
  return AGENT_METADATA.career_coach;
}

/** All agents except root */
export const SPECIALIST_AGENTS = Object.values(AGENT_METADATA).filter(
  (a) => a.category !== 'root'
);

/** Root agent */
export const ROOT_AGENT = AGENT_METADATA.career_coach;

/** Agents grouped by category */
export function getAgentsByCategory(category: AgentCategory): AgentMeta[] {
  return Object.values(AGENT_METADATA).filter((a) => a.category === category);
}

/** All suggested prompts across all agents (for welcome screen) */
export function getAllSuggestedPrompts(count = 6): string[] {
  const all = SPECIALIST_AGENTS.flatMap((a) => a.suggestedPrompts);
  // Shuffle and take first `count`
  return all.sort(() => Math.random() - 0.5).slice(0, count);
}
