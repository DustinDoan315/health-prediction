import { AIChatResponse, apiService } from '@/services/api';
import { EnhancedChatScreen } from '@/components/screens/chat';
import { useCallback } from 'react';


export default function ChatScreen() {

  const handleSendMessage = useCallback(async (message: string) => {
    try {
      const response: AIChatResponse = await apiService.chatWithAI({
        prompt: message,
        system_prompt: 'You are a helpful health assistant. Provide accurate, helpful health advice while encouraging users to consult healthcare professionals for serious concerns. Keep responses concise and actionable.',
        max_tokens: 1000,
        temperature: 0.7,
      });

      // Handle AI response - this would be integrated with the enhanced chat screen
      console.log('AI Response:', response.response);
    } catch (error: any) {
      console.error('Chat error:', error);
    }
  }, []);

  const handleVoiceStart = useCallback(() => {
    console.log('Voice recording started');
  }, []);

  const handleVoiceStop = useCallback(() => {
    console.log('Voice recording stopped');
  }, []);

  const handleImageUpload = useCallback((imageUri: string) => {
    console.log('Image uploaded:', imageUri);
  }, []);

  const handleFileUpload = useCallback((fileUri: string) => {
    console.log('File uploaded:', fileUri);
  }, []);

  return (
    <EnhancedChatScreen
      onSendMessage={handleSendMessage}
      onVoiceStart={handleVoiceStart}
      onVoiceStop={handleVoiceStop}
      onImageUpload={handleImageUpload}
      onFileUpload={handleFileUpload}
    />
  );
}

