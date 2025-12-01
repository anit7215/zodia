import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  zodiacSign: string;
  message: string;
  timestamp: number;
  isMe: boolean;
}

type ConnectionStatus = 'disconnected' | 'connected' | 'error';

interface ChatStore {
  messages: ChatMessage[];
  connectionStatus: ConnectionStatus;
  isChatOpen: boolean;

  addMessage: (message: ChatMessage) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  toggleChat: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  connectionStatus: 'disconnected',
  isChatOpen: false,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  clearMessages: () => set({ messages: [] })
}));
