// Global TypeScript types for PathPilot AI frontend

export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  agentId?: string;          // Which specialist responded (from ADK author field)
  routingPath?: string[];    // e.g. ['career_coach', 'resume_agent']
  isStreaming?: boolean;     // Whether still streaming
  isError?: boolean;
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  sessionId: string;         // ADK session ID
  activeAgentId?: string;
  pinned?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  careerGoal?: string;
  currentRole?: string;
  experience?: 'student' | 'fresher' | 'junior' | 'mid' | 'senior';
  skills?: string[];
  joinedAt: Date;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface StreamChunk {
  text: string;
  done: boolean;
  agentId?: string;
  error?: string;
}

// Dashboard types
export interface SkillProgress {
  name: string;
  current: number;
  target: number;
  category: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  dueDate?: Date;
  resources?: string[];
  children?: RoadmapMilestone[];
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';
  appliedAt?: Date;
  salary?: string;
  location: string;
  notes?: string;
  url?: string;
  logo?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'course' | 'book' | 'video' | 'documentation' | 'article' | 'tool';
  tier: 'free' | 'paid';
  platform: string;
  tags: string[];
  rating?: number;
  bookmarked?: boolean;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'system-design' | 'coding';
  difficulty: 'easy' | 'medium' | 'hard';
  role?: string;
  answer?: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
}

export interface SalaryData {
  role: string;
  experience: string;
  location: string;
  min: number;
  median: number;
  max: number;
  currency: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

// UI state types
export interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  theme: 'dark' | 'light' | 'system';
  notifications: Notification[];
}
