import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatArea } from '../components/chat/ChatArea';
import { useChatStore } from '../store/chatStore';
import { useUserStore } from '../store/userStore';
import { useUIStore } from '../store/uiStore';
import { Button } from '../components/ui/Button';
import { getAgentMeta } from '../config/agentMetadata';
import { AgentBadge } from '../components/chat/AgentBadge';

export function ChatPage() {
  const { getActiveConversation, createConversation, setActiveConversation } = useChatStore();
  const { user } = useUserStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  // Create initial conversation if none
  useEffect(() => {
    const existing = getActiveConversation();
    if (!existing && user) {
      const conv = createConversation(user.id);
      setActiveConversation(conv.id);
    }
  }, []);

  const conversation = getActiveConversation();
  const activeAgent = conversation?.activeAgentId;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Chat sidebar (conversation history) */}
      <ChatSidebar />

      {/* Chat main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={toggleSidebar}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={16} />
            </Button>
            <div>
              <h1 className="font-semibold text-sm text-foreground">
                {conversation?.title ?? 'New Conversation'}
              </h1>
              {activeAgent && (
                <AgentBadge agentId={activeAgent} size="sm" showLabel animate={false} />
              )}
            </div>
          </div>

          {/* Active session info */}
          {conversation && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground/50 hidden sm:block">
                Session active
              </span>
            </div>
          )}
        </header>

        {/* Messages + Input */}
        <ChatArea />
      </div>
    </div>
  );
}
