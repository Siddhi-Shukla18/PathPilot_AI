import { motion } from 'framer-motion';
import { getAgentMeta, ROOT_AGENT } from '../../config/agentMetadata';
import { AgentIcon } from './AgentIcon';

interface AgentBadgeProps {
  agentId: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export function AgentBadge({
  agentId,
  showLabel = true,
  size = 'md',
  className = '',
  animate = true,
}: AgentBadgeProps) {
  const meta = getAgentMeta(agentId);

  const sizeClasses = {
    sm: { pill: 'px-2 py-0.5 text-xs gap-1', icon: 14 },
    md: { pill: 'px-3 py-1 text-xs gap-1.5', icon: 16 },
    lg: { pill: 'px-4 py-1.5 text-sm gap-2', icon: 18 },
  }[size];

  const badge = (
    <div
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses.pill} ${className}`}
      style={{
        backgroundColor: `${meta.color}18`,
        borderColor: `${meta.color}35`,
        color: meta.color,
      }}
    >
      <span className="leading-none">{meta.emoji}</span>
      {showLabel && <span>{meta.badgeLabel}</span>}
    </div>
  );

  if (!animate) return badge;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
    >
      {badge}
    </motion.div>
  );
}

/**
 * RoutingPath — visualizes Career Coach → Specialist Agent routing
 * This is a core architectural feature: users see how multi-agent routing works.
 */
interface RoutingPathProps {
  agentId: string;
}

export function RoutingPath({ agentId }: RoutingPathProps) {
  const specialist = getAgentMeta(agentId);

  // Only show routing path for non-root agents
  if (agentId === ROOT_AGENT.id || agentId === 'career_coach') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex items-center gap-1.5 mb-2"
    >
      {/* Root agent */}
      <div
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border"
        style={{
          backgroundColor: `${ROOT_AGENT.color}15`,
          borderColor: `${ROOT_AGENT.color}30`,
          color: ROOT_AGENT.color,
        }}
      >
        <span>{ROOT_AGENT.emoji}</span>
        <span className="font-medium">{ROOT_AGENT.displayName}</span>
      </div>

      {/* Arrow */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center text-muted-foreground/60"
      >
        <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
          <path
            d="M0 4H18M18 4L14 1M18 4L14 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Specialist agent */}
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium"
        style={{
          backgroundColor: `${specialist.color}18`,
          borderColor: `${specialist.color}35`,
          color: specialist.color,
          boxShadow: `0 0 8px -2px ${specialist.color}40`,
        }}
      >
        <AgentIcon iconName={specialist.iconName} size={11} />
        <span>{specialist.badgeLabel}</span>
      </motion.div>
    </motion.div>
  );
}
