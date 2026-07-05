import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, LayoutDashboard, Map, FileText, Target,
  BookOpen, Briefcase, TrendingUp, BarChart3, Settings,
  Plus, Zap, Search,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useChatStore } from '../../store/chatStore';
import { useUserStore } from '../../store/userStore';

const COMMANDS = [
  {
    group: 'Navigation',
    items: [
      { id: 'chat', label: 'Open Chat', icon: MessageSquare, path: '/chat', shortcut: 'C' },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', shortcut: 'D' },
      { id: 'roadmap', label: 'Roadmap', icon: Map, path: '/roadmap', shortcut: 'R' },
      { id: 'resume', label: 'Resume', icon: FileText, path: '/resume' },
      { id: 'interview', label: 'Interview', icon: Target, path: '/interview' },
      { id: 'resources', label: 'Resources', icon: BookOpen, path: '/resources' },
      { id: 'jobs', label: 'Job Tracker', icon: Briefcase, path: '/jobs' },
      { id: 'salary', label: 'Salary Insights', icon: TrendingUp, path: '/salary' },
      { id: 'skills', label: 'Skills Gap', icon: BarChart3, path: '/skills' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
  {
    group: 'Actions',
    items: [
      { id: 'new-chat', label: 'New Chat', icon: Plus, action: 'new-chat' },
    ],
  },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { createConversation, setActiveConversation } = useChatStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setCommandPaletteOpen]);

  const handleSelect = (item: { path?: string; action?: string }) => {
    setCommandPaletteOpen(false);
    setSearch('');

    if (item.action === 'new-chat' && user) {
      const conv = createConversation(user.id);
      setActiveConversation(conv.id);
      navigate('/chat');
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setCommandPaletteOpen(false)}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4"
          >
            <Command
              className="glass rounded-2xl border border-border/60 shadow-2xl overflow-hidden"
              shouldFilter={true}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
                <Search size={15} className="text-muted-foreground flex-shrink-0" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  autoFocus
                />
                <kbd className="text-xs text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded border border-border/40">
                  ESC
                </kbd>
              </div>

              {/* Items */}
              <Command.List className="max-h-72 overflow-y-auto py-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground/60">
                  No commands found.
                </Command.Empty>

                {COMMANDS.map((group) => (
                  <Command.Group
                    key={group.group}
                    heading={group.group}
                    className="px-2"
                  >
                    <div className="px-2 py-1">
                      <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                        {group.group}
                      </p>
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Command.Item
                          key={item.id}
                          value={item.label}
                          onSelect={() => handleSelect(item)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-foreground/80 data-[selected]:bg-accent data-[selected]:text-foreground transition-colors"
                        >
                          <Icon size={15} className="text-muted-foreground flex-shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          {'shortcut' in item && item.shortcut && (
                            <kbd className="text-xs text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded border border-border/40">
                              {item.shortcut}
                            </kbd>
                          )}
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ))}
              </Command.List>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-border/40 flex items-center gap-3 text-xs text-muted-foreground/50">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>ESC close</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
