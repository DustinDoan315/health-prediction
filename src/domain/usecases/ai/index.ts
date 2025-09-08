import { IAIChatMessage } from '../../entities';
import { IAIRepository } from '../../repositories';
import { IChatWithAIUseCase } from '../index';

export class ChatWithAIUseCase implements IChatWithAIUseCase {
  constructor(private readonly aiRepository: IAIRepository) {}

  async execute(prompt: string): Promise<IAIChatMessage> {
    if (!prompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    if (prompt.length > 1000) {
      throw new Error('Prompt must be less than 1000 characters');
    }

    return await this.aiRepository.chatWithAI(prompt);
  }
}
