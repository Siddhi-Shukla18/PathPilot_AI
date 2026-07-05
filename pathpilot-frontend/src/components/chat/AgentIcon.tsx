/**
 * AgentIcon — dynamically renders the correct Lucide icon
 * driven by the iconName field in agentMetadata.ts
 */
import {
  Compass, Map, Rocket, BarChart3, Wrench, BookOpen,
  Zap, FileText, Target, TrendingUp, Briefcase,
  HelpCircle, LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Compass,
  Map,
  Rocket,
  BarChart3,
  Wrench,
  BookOpen,
  Zap,
  FileText,
  Target,
  TrendingUp,
  Briefcase,
};

interface AgentIconProps {
  iconName: string;
  size?: number;
  className?: string;
  color?: string;
}

export function AgentIcon({ iconName, size = 16, className = '', color }: AgentIconProps) {
  const Icon = ICON_MAP[iconName] ?? HelpCircle;
  return <Icon size={size} className={className} style={color ? { color } : undefined} />;
}
