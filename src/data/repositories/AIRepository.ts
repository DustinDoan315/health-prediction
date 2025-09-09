import { IAIChatMessage, AIChatMessage } from '../../domain/entities';
import { IAIRepository } from '../../domain/repositories';
import { ApiService } from './ApiService';

export class AIRepository implements IAIRepository {
  constructor(private readonly apiService: ApiService) {}

  async chatWithAI(prompt: string): Promise<IAIChatMessage> {
    try {
      const response = await this.apiService.post('/ai/chat', { prompt });
      return AIChatMessage.fromApiResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to chat with AI');
    }
  }

  async getAIStatus(): Promise<boolean> {
    try {
      const response = await this.apiService.get('/ai/status');
      return (response.data as any).status === 'active';
    } catch (error: any) {
      return false;
    }
  }
}
