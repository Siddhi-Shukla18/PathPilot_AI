import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '../../store/chatStore';
import { useUserStore } from '../../store/userStore';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { WelcomeScreen } from './WelcomeScreen';
import { ChatInput } from './ChatInput';
import { sendMessage, createSession } from '../../api/adk';
import type { ChatMessage } from '../../types';
import toast from 'react-hot-toast';

export function ChatArea() {
  const {
    getActiveConversation,
    activeConversationId,
    addMessage,
    updateLastMessage,
    updateConversationAgent,
    isStreaming,
    setStreaming,
    createConversation,
    setActiveConversation,
  } = useChatStore();

  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<boolean>(false);
  const sendingRef = useRef(false);
  const lastSendRef = useRef(0);

  const conversation = getActiveConversation();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages?.length, isStreaming]);

  // Ensure session exists when conversation changes
  useEffect(() => {
    if (conversation && user) {
      createSession(user.id, conversation.sessionId).catch(() => { });
    }
  }, [conversation?.id, user?.id]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!user) return;
      if (sendingRef.current || isStreaming) {
        toast.error('Please wait, previous request is still processing.');
        return;
      }
      if (Date.now() - lastSendRef.current < 500) {
        return;
      }
      lastSendRef.current = Date.now();
      abortRef.current = false;

      // Get or create conversation
      let conv = getActiveConversation();
      if (!conv) {
        conv = createConversation(user.id);
        setActiveConversation(conv.id);
        await createSession(user.id, conv.sessionId);
      }

      const convId = conv.id;

      // Add user message
      const userMsg: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      addMessage(convId, userMsg);

      // Add placeholder assistant message
      const assistantMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };
      addMessage(convId, assistantMsg);
      sendingRef.current = true;
      setStreaming(true);

      let fullContent = '';
      let detectedAgentId: string | undefined;

      try {
        const stream = sendMessage(user.id, conv.sessionId, text);

        for await (const chunk of stream) {
          if (abortRef.current) break;

          fullContent += chunk.text;

          if (chunk.agentId && !detectedAgentId) {
            detectedAgentId = chunk.agentId;
          }

          updateLastMessage(convId, {
            content: fullContent,
            agentId: detectedAgentId,
            isStreaming: !chunk.done,
          });

          if (chunk.done) break;
          if (chunk.error) {
            toast.error('Backend error. Is ADK running?');
            break;
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        updateLastMessage(convId, {
          content: `⚠️ Error: ${message}`,
          isStreaming: false,
          isError: true,
        });
        toast.error('Failed to connect to backend');
      } finally {
        updateLastMessage(convId, {
          isStreaming: false,
          agentId: detectedAgentId,
        });
        if (detectedAgentId) {
          updateConversationAgent(convId, detectedAgentId);
        }
        sendingRef.current = false;
        setStreaming(false);
      }
    },
    [user, getActiveConversation, createConversation, setActiveConversation, addMessage, updateLastMessage, updateConversationAgent, setStreaming]
  );

  const handleStop = () => {
    abortRef.current = true;
    setStreaming(false);
    if (activeConversationId) {
      updateLastMessage(activeConversationId, { isStreaming: false });
    }
  };

  const messages = conversation?.messages ?? [];
  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {showWelcome ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[60vh]"
              >
                <WelcomeScreen
                  onPromptSelect={handleSend}
                  userName={user?.name}
                />
              </motion.div>
            ) : (
              <motion.div key="messages">
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isLast={i === messages.length - 1}
                  />
                ))}
                {isStreaming && messages.at(-1)?.content === '' && (
                  <TypingIndicator />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-border/40 bg-background/80 backdrop-blur-sm px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSend}
            isStreaming={isStreaming}
            onStop={handleStop}
          />
          <p className="text-center text-xs text-muted-foreground/40 mt-2">
            PathPilot AI may make mistakes. Verify important career advice.
          </p>
        </div>
      </div>
    </div>
  );
}
