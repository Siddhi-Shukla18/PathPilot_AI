import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, MessageSquare, Pin, Trash2, ChevronLeft, ChevronRight,
  Settings, User, LogOut, Compass, X,
} from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useUserStore } from '../../store/userStore';
import { useUIStore } from '../../store/uiStore';
import { cn, relativeTime, truncate, getInitials } from '../../utils';
import { Button } from '../ui/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAgentMeta } from '../../config/agentMetadata';

export function ChatSidebar() {
  const { conversations, activeConversationId, createConversation, setActiveConversation, deleteConversation, pinConversation } = useChatStore();
  const { user, logout } = useUserStore();
  const { sidebarCollapsed, toggleSidebarCollapse, setSidebarOpen } = useUIStore();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter((c) => c.pinned);
  const recent = filtered.filter((c) => !c.pinned);

  const handleNewChat = () => {
    if (!user) return;
    const conv = createConversation(user.id);
    setActiveConversation(conv.id);
    navigate('/chat');
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    navigate('/chat');
    // On mobile: close sidebar
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteConversation(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-full bg-surface-1 border-r border-border/50 flex-shrink-0 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/40 flex-shrink-0">
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
              <Compass size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm text-foreground">PathPilot</span>
          </motion.div>
        )}
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={toggleSidebarCollapse}
          className="ml-auto"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>

      {/* New Chat button */}
      <div className="p-2 border-b border-border/40 flex-shrink-0">
        <Button
          onClick={handleNewChat}
          variant="ghost"
          className={cn(
            'w-full justify-start gap-2 h-9 text-sm',
            sidebarCollapsed && 'justify-center px-0'
          )}
          aria-label="New conversation"
        >
          <Plus size={15} />
          {!sidebarCollapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <div className="px-2 py-2 flex-shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full h-8 rounded-lg bg-muted/60 border border-border/40 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors"
              aria-label="Search conversations"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
                <X size={11} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-1">
        {/* Pinned */}
        {pinned.length > 0 && !sidebarCollapsed && (
          <div className="px-2 mb-1">
            <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider px-2 py-1.5">
              Pinned
            </p>
            {pinned.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                isActive={c.id === activeConversationId}
                onSelect={() => handleSelectConversation(c.id)}
                onPin={() => pinConversation(c.id)}
                onDelete={() => handleDelete(c.id)}
                confirmDelete={deleteConfirm === c.id}
                collapsed={sidebarCollapsed}
              />
            ))}
          </div>
        )}

        {/* Recent */}
        {!sidebarCollapsed && recent.length > 0 && (
          <div className="px-2">
            {pinned.length > 0 && (
              <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider px-2 py-1.5">
                Recent
              </p>
            )}
            {recent.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                isActive={c.id === activeConversationId}
                onSelect={() => handleSelectConversation(c.id)}
                onPin={() => pinConversation(c.id)}
                onDelete={() => handleDelete(c.id)}
                confirmDelete={deleteConfirm === c.id}
                collapsed={sidebarCollapsed}
              />
            ))}
          </div>
        )}

        {/* Collapsed icons only */}
        {sidebarCollapsed && conversations.slice(0, 8).map((c) => {
          const agentId = c.activeAgentId;
          const agent = agentId ? getAgentMeta(agentId) : null;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectConversation(c.id)}
              className={cn(
                'w-full flex justify-center p-2 my-0.5 rounded-lg transition-colors',
                c.id === activeConversationId ? 'bg-primary/15' : 'hover:bg-accent'
              )}
              title={c.title}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                style={agent ? { backgroundColor: `${agent.color}25`, color: agent.color } : {}}
              >
                {agent?.emoji ?? <MessageSquare size={12} />}
              </div>
            </button>
          );
        })}

        {/* Empty state */}
        {conversations.length === 0 && !sidebarCollapsed && (
          <div className="px-4 py-8 text-center">
            <MessageSquare size={24} className="mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground/50">
              No conversations yet. Start chatting!
            </p>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="border-t border-border/40 p-2 flex-shrink-0 space-y-1">
        <NavLink to="/settings" aria-label="Settings">
          {({ isActive }) => (
            <button
              className={cn(
                'w-full flex items-center gap-2 h-9 px-2 rounded-lg text-sm transition-colors',
                isActive ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                sidebarCollapsed && 'justify-center'
              )}
            >
              <Settings size={15} />
              {!sidebarCollapsed && <span>Settings</span>}
            </button>
          )}
        </NavLink>

        {/* User profile */}
        {user && (
          <div className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-lg',
            sidebarCollapsed && 'justify-center'
          )}>
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-primary">
              {getInitials(user.name)}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground/60 truncate">{user.email}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={logout}
                className="p-1 rounded text-muted-foreground/50 hover:text-foreground hover:bg-accent transition-colors"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
}

// ─── Conversation Item ────────────────────────────────────────────────────────

interface ConversationItemProps {
  conversation: { id: string; title: string; updatedAt: Date; activeAgentId?: string; pinned?: boolean };
  isActive: boolean;
  onSelect: () => void;
  onPin: () => void;
  onDelete: () => void;
  confirmDelete: boolean;
  collapsed: boolean;
}

function ConversationItem({
  conversation: c,
  isActive,
  onSelect,
  onPin,
  onDelete,
  confirmDelete,
}: ConversationItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors text-sm',
        isActive ? 'bg-primary/12 text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <MessageSquare size={13} className="flex-shrink-0" />
      <span className="flex-1 truncate text-xs">{truncate(c.title, 28)}</span>

      {/* Actions (visible on hover) */}
      {hovered && (
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onPin}
            className="p-1 rounded hover:bg-accent-foreground/10 transition-colors"
            title={c.pinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={11} className={c.pinned ? 'text-primary' : ''} />
          </button>
          <button
            onClick={onDelete}
            className={cn(
              'p-1 rounded transition-colors',
              confirmDelete
                ? 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                : 'hover:bg-accent-foreground/10 text-muted-foreground/60 hover:text-destructive'
            )}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}
    </div>
  );
}
