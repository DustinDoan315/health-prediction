import { useCallback, useState } from 'react';
import { SERVICE_KEYS, container } from '../../core/di';

import { IChatWithAIUseCase } from '../../domain';
import { IAIChatMessage } from '../../domain/entities';

export interface AIState {
  messages: readonly IAIChatMessage[];
  isLoading: boolean;
  error: string | null;
  isAIAvailable: boolean;
}

export interface AIViewModel {
  state: AIState;
  sendMessage: (prompt: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export const useAIViewModel = (): AIViewModel => {
  const [state, setState] = useState<AIState>({
    messages: [],
    isLoading: false,
    error: null,
    isAIAvailable: true,
  });

  const chatWithAIUseCase = container.resolve<IChatWithAIUseCase>(SERVICE_KEYS.CHAT_WITH_AI_USE_CASE);

  const sendMessage = useCallback(async (prompt: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const message = await chatWithAIUseCase.execute(prompt);
      setState(prev => ({
        ...prev,
        isLoading: false,
        messages: [...prev.messages, message],
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      }));
    }
  }, [chatWithAIUseCase]);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    sendMessage,
    clearMessages,
    clearError,
  };
};
