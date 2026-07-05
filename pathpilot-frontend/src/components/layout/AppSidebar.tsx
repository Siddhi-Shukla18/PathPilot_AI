import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  LayoutDashboard,
  Settings,
  Compass,
  Command,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils';

const NAV_ITEMS = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
    id: 'nav-dashboard',
  },
  {
    to: '/chat',
    icon: MessageSquare,
    label: 'Chat',
    id: 'nav-chat',
  },
];

interface AppSidebarProps {
  variant?: 'full' | 'icon';
}

export function AppSidebar({ variant = 'full' }: AppSidebarProps) {
  const { toggleCommandPalette } = useUIStore();
  const collapsed = variant === 'icon';

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-surface-1 border-r border-border/50 flex-shrink-0 py-3',
        collapsed ? 'w-16 items-center' : 'w-56'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-2.5 px-3 mb-4',
          collapsed && 'justify-center px-0'
        )}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center flex-shrink-0">
          <Compass size={16} className="text-white" />
        </div>

        {!collapsed && (
          <span className="font-bold text-sm">PathPilot AI</span>
        )}
      </div>

      {/* Command Palette */}
      <button
        onClick={toggleCommandPalette}
        className={cn(
          'flex items-center gap-2 mx-2 mb-3 px-3 py-2 rounded-lg text-xs text-muted-foreground/60 border border-border/40 hover:border-primary/30 hover:text-muted-foreground bg-muted/30 transition-all',
          collapsed && 'mx-0 justify-center px-0 w-10'
        )}
      >
        <Command size={12} />

        {!collapsed && (
          <>
            <span className="flex-1 text-left">Search</span>
            <kbd className="bg-muted px-1 rounded text-muted-foreground/40">
              ⌘K
            </kbd>
          </>
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, id }) => (
          <NavLink key={to} to={to} id={id}>
            {({ isActive }) => (
              <div
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  collapsed && 'justify-center px-0 w-10 mx-auto'
                )}
              >
                <Icon size={16} />

                {!collapsed && <span>{label}</span>}

                {isActive && !collapsed && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings (disabled for now) */}
      <div className={cn('px-2', collapsed && 'flex justify-center px-0')}>
        <div
          className={cn(
            'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed',
            collapsed && 'justify-center px-0 w-10'
          )}
        >
          <Settings size={16} />
          {!collapsed && <span>Settings</span>}
        </div>
      </div>
    </aside>
  );
}