import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, ChatMessage } from '../types';
import { generateConversationTitle } from '../utils';

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;

  // Actions
  createConversation: (userId: string) => Conversation;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateLastMessage: (conversationId: string, patch: Partial<ChatMessage>) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  updateConversationAgent: (conversationId: string, agentId: string) => void;
  deleteConversation: (id: string) => void;
  pinConversation: (id: string) => void;
  setStreaming: (val: boolean) => void;
  getActiveConversation: () => Conversation | null;
  clearAll: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,

      createConversation: (userId) => {
        const conversation: Conversation = {
          id: uuidv4(),
          title: 'New Conversation',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
          sessionId: uuidv4(),
        };
        set((s) => ({
          conversations: [conversation, ...s.conversations],
          activeConversationId: conversation.id,
        }));
        return conversation;
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      addMessage: (conversationId, message) => {
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages, message];
            // Auto-title from first user message
            const title =
              c.title === 'New Conversation' && message.role === 'user'
                ? generateConversationTitle(message.content)
                : c.title;
            return { ...c, messages, title, updatedAt: new Date() };
          }),
        }));
      },

      updateLastMessage: (conversationId, patch) => {
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages];
            if (messages.length === 0) return c;
            messages[messages.length - 1] = {
              ...messages[messages.length - 1],
              ...patch,
            };
            return { ...c, messages, updatedAt: new Date() };
          }),
        }));
      },

      updateConversationTitle: (conversationId, title) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, title } : c
          ),
        }));
      },

      updateConversationAgent: (conversationId, agentId) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, activeAgentId: agentId } : c
          ),
        }));
      },

      deleteConversation: (id) => {
        set((s) => {
          const remaining = s.conversations.filter((c) => c.id !== id);
          const newActive =
            s.activeConversationId === id
              ? (remaining[0]?.id ?? null)
              : s.activeConversationId;
          return { conversations: remaining, activeConversationId: newActive };
        });
      },

      pinConversation: (id) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned } : c
          ),
        }));
      },

      setStreaming: (val) => set({ isStreaming: val }),

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId) ?? null;
      },

      clearAll: () => set({ conversations: [], activeConversationId: null }),
    }),
    {
      name: 'pathpilot-chat',
      // Serialize dates properly
      partialize: (state) => ({
        conversations: state.conversations.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
          messages: c.messages.map((m) => ({
            ...m,
            timestamp: m.timestamp.toISOString(),
          })),
        })),
        activeConversationId: state.activeConversationId,
      }),
      // Rehydrate dates
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.conversations = (state.conversations as unknown[]).map((c: unknown) => {
          const conv = c as Record<string, unknown>;
          return {
            ...conv,
            createdAt: new Date(conv.createdAt as string),
            updatedAt: new Date(conv.updatedAt as string),
            messages: ((conv.messages as unknown[]) ?? []).map((m: unknown) => {
              const msg = m as Record<string, unknown>;
              return { ...msg, timestamp: new Date(msg.timestamp as string) };
            }),
          } as Conversation;
        });
      },
    }
  )
);
