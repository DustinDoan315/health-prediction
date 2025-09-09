import { IAIChatMessage } from '../../entities';

export interface IChatWithAIUseCase {
  execute(prompt: string): Promise<IAIChatMessage>;
}
