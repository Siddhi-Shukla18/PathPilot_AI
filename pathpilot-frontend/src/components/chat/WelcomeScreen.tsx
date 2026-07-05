import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getAllSuggestedPrompts, SPECIALIST_AGENTS } from '../../config/agentMetadata';
import { AgentIcon } from './AgentIcon';

interface WelcomeScreenProps {
  onPromptSelect: (prompt: string) => void;
  userName?: string;
}

export function WelcomeScreen({ onPromptSelect, userName }: WelcomeScreenProps) {
  const prompts = getAllSuggestedPrompts(6);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 max-w-2xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        {/* Logo icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-glow">
            <Sparkles size={28} className="text-white" />
          </div>
          <div className="absolute -inset-2 rounded-2xl bg-primary/20 blur-xl -z-10" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          {userName ? `Welcome back, ${userName.split(' ')[0]} 👋` : 'Welcome to PathPilot AI'}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
          Your intelligent career coach powered by 10 specialist AI agents. Ask me anything
          about careers in AI, ML, Data Science, or Software Engineering.
        </p>
      </motion.div>

      {/* Suggested prompts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full mb-8"
      >
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 text-center">
          Try asking
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {prompts.map((prompt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              onClick={() => onPromptSelect(prompt)}
              className="group flex items-center justify-between gap-3 glass rounded-xl px-4 py-3 text-sm text-left border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              <span className="text-foreground/70 group-hover:text-foreground transition-colors line-clamp-1">
                {prompt}
              </span>
              <ArrowRight
                size={14}
                className="text-muted-foreground/40 group-hover:text-primary flex-shrink-0 transition-colors group-hover:translate-x-0.5 duration-200"
              />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Agent grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full"
      >
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 text-center">
          10 specialist agents ready
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SPECIALIST_AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border"
              style={{
                backgroundColor: `${agent.color}12`,
                borderColor: `${agent.color}28`,
                color: agent.color,
              }}
            >
              <AgentIcon iconName={agent.iconName} size={11} />
              <span className="font-medium">{agent.badgeLabel}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
