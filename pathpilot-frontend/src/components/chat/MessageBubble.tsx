import { motion } from 'framer-motion';
import { Copy, Check, User } from 'lucide-react';
import { useState } from 'react';
import type { ChatMessage } from '../../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AgentBadge, RoutingPath } from './AgentBadge';
import { copyToClipboard, formatTime } from '../../utils';
import { getAgentMeta } from '../../config/agentMetadata';

interface MessageBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
}

export function MessageBubble({ message, isLast = false }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const agentMeta = message.agentId ? getAgentMeta(message.agentId) : null;

  const handleCopy = async () => {
    await copyToClipboard(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-end justify-end gap-2 mb-4 group"
      >
        <div className="flex flex-col items-end gap-1 max-w-[75%]">
          {/* Message */}
          <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-primary text-primary-foreground shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          {/* Timestamp */}
          <span className="text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mb-1">
          <User size={14} className="text-primary" />
        </div>
      </motion.div>
    );
  }

  // Assistant message
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3 mb-4 group"
    >
      {/* Agent Avatar */}
      <div
        className="w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-1"
        style={{
          backgroundColor: agentMeta ? `${agentMeta.color}18` : 'hsl(var(--muted))',
          borderColor: agentMeta ? `${agentMeta.color}35` : 'hsl(var(--border))',
        }}
      >
        <span className="text-base leading-none">
          {agentMeta?.emoji ?? '🧭'}
        </span>
      </div>

      <div className="flex-1 min-w-0 max-w-[85%]">
        {/* Routing path — Career Coach → Specialist */}
        {message.agentId && <RoutingPath agentId={message.agentId} />}

        {/* Agent badge */}
        {message.agentId && (
          <div className="mb-2">
            <AgentBadge agentId={message.agentId} size="sm" animate={isLast} />
          </div>
        )}

        {/* Message card */}
        <div className="glass rounded-2xl rounded-tl-sm px-5 py-4 border border-border/40 relative">
          {/* Streaming cursor */}
          {message.isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
          )}

          <MarkdownRenderer content={message.content} />

          {/* Copy button */}
          {!message.isStreaming && (
            <button
              onClick={handleCopy}
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground rounded-md px-2 py-1 hover:bg-accent"
              aria-label="Copy message"
            >
              {copied ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground/50 ml-1 mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}
