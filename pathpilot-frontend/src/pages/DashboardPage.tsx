import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Map, FileText, Target, BookOpen,
  Briefcase, TrendingUp, BarChart3, ArrowRight,
  Flame, Star, CheckCircle2, Clock, Zap,
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { SPECIALIST_AGENTS } from '../config/agentMetadata';
import { AgentIcon } from '../components/chat/AgentIcon';

// Dummy data
const SKILL_DATA = [
  { name: 'Python', level: 75, color: '#6366f1' },
  { name: 'Machine Learning', level: 55, color: '#0ea5e9' },
  { name: 'SQL', level: 80, color: '#10b981' },
  { name: 'Deep Learning', level: 40, color: '#f59e0b' },
  { name: 'Data Viz', level: 65, color: '#ec4899' },
  { name: 'Statistics', level: 60, color: '#8b5cf6' },
];

const ACTIVITY_DATA = [
  { day: 'Mon', sessions: 3 },
  { day: 'Tue', sessions: 5 },
  { day: 'Wed', sessions: 2 },
  { day: 'Thu', sessions: 7 },
  { day: 'Fri', sessions: 4 },
  { day: 'Sat', sessions: 6 },
  { day: 'Sun', sessions: 3 },
];

const RECENT_ACTIVITY = [
  { id: 1, text: 'Completed ML Roadmap Week 3', time: '2h ago', icon: CheckCircle2, color: '#10b981' },
  { id: 2, text: 'Mock interview: Python Developer', time: '5h ago', icon: Target, color: '#a855f7' },
  { id: 3, text: 'Updated resume with new project', time: '1d ago', icon: FileText, color: '#06b6d4' },
  { id: 4, text: 'Applied to DataXplorer Inc', time: '2d ago', icon: Briefcase, color: '#3b82f6' },
];

const STATS = [
  { label: 'Chat Sessions', value: '24', delta: '+3 today', icon: MessageSquare, color: '#6366f1' },
  { label: 'Streak', value: '7d', delta: 'Keep going!', icon: Flame, color: '#f59e0b' },
  { label: 'Jobs Tracked', value: '12', delta: '3 interviews', icon: Briefcase, color: '#3b82f6' },
  { label: 'Skills Gained', value: '18', delta: 'This month', icon: Star, color: '#10b981' },
];

const QUICK_ACTIONS = [
  { label: 'New Chat', icon: MessageSquare, to: '/chat', color: '#6366f1' },
  { label: 'View Roadmap', icon: Map, to: '/roadmap', color: '#0ea5e9' },
  { label: 'Mock Interview', icon: Target, to: '/interview', color: '#a855f7' },
  { label: 'Salary Check', icon: TrendingUp, to: '/salary', color: '#10b981' },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardPage() {
  const { user } = useUserStore();
  const { conversations } = useChatStore();
  const navigate = useNavigate();

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Good {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here's your career progress overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Ready
            </Badge>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={fadeUp}>
                <Card className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                        <p className="text-xs mt-1" style={{ color: stat.color }}>{stat.delta}</p>
                      </div>
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}18` }}
                      >
                        <Icon size={18} style={{ color: stat.color }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills progress */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 size={16} className="text-primary" />
                  Skill Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {SKILL_DATA.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-foreground/80 font-medium">{skill.name}</span>
                      <span style={{ color: skill.color }}>{skill.level}%</span>
                    </div>
                    <Progress
                      value={skill.level}
                      className="h-1.5"
                      indicatorClassName="rounded-full"
                      style={{ '--tw-gradient-from': skill.color } as React.CSSProperties}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile completion ring */}
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star size={16} className="text-amber-400" />
                  Profile Strength
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="65%"
                      outerRadius="100%"
                      startAngle={90}
                      endAngle={-270}
                      data={[{ value: 72, fill: '#6366f1' }]}
                    >
                      <RadialBar background dataKey="value" cornerRadius={8} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-3xl font-bold text-foreground -mt-12">72%</p>
                <p className="text-xs text-muted-foreground mt-8">Complete your profile</p>
                <div className="w-full mt-4 space-y-2 text-xs text-muted-foreground">
                  {[
                    { label: 'Add career goal', done: false },
                    { label: 'Set experience level', done: true },
                    { label: 'Add skills', done: true },
                    { label: 'Upload resume', done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <CheckCircle2 size={12} className={item.done ? 'text-emerald-400' : 'text-muted-foreground/30'} />
                      <span className={item.done ? 'line-through text-muted-foreground/40' : ''}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly activity */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap size={16} className="text-amber-400" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ACTIVITY_DATA}>
                      <defs>
                        <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(224 15% 18%)" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(224 18% 11%)',
                          border: '1px solid hsl(224 15% 18%)',
                          borderRadius: 12,
                          fontSize: 12,
                          color: 'hsl(213 31% 91%)',
                        }}
                      />
                      <Area type="monotone" dataKey="sessions" stroke="#6366f1" fill="url(#activityGrad)" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent activity */}
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {RECENT_ACTIVITY.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${item.color}18` }}
                      >
                        <Icon size={13} style={{ color: item.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-foreground/80 leading-snug">{item.text}</p>
                        <p className="text-xs text-muted-foreground/50 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.to)}
                  className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/50 hover:border-primary/30 bg-card hover:bg-primary/5 transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${action.color}18` }}
                  >
                    <Icon size={18} style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Available agents */}
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              AI Specialists
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/chat')}
              className="text-xs"
            >
              Ask any <ArrowRight size={12} className="ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SPECIALIST_AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => navigate('/chat')}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border/40 hover:border-primary/30 bg-card hover:bg-primary/5 transition-all text-center"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${agent.color}18` }}
                >
                  {agent.emoji}
                </div>
                <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground leading-tight">
                  {agent.badgeLabel}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
