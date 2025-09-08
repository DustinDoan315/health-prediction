export interface IAIChatMessage {
  readonly id: string;
  readonly prompt: string;
  readonly response: string;
  readonly model: string;
  readonly usage: {
    readonly promptTokens: number;
    readonly completionTokens: number;
    readonly totalTokens: number;
  };
  readonly timestamp: Date;
}

export class AIChatMessage implements IAIChatMessage {
  constructor(
    public readonly id: string,
    public readonly prompt: string,
    public readonly response: string,
    public readonly model: string,
    public readonly usage: {
      readonly promptTokens: number;
      readonly completionTokens: number;
      readonly totalTokens: number;
    },
    public readonly timestamp: Date
  ) {}

  static fromApiResponse(data: any): AIChatMessage {
    return new AIChatMessage(
      data.id || Date.now().toString(),
      data.prompt,
      data.response,
      data.model,
      {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
      new Date(data.timestamp)
    );
  }

  toApiRequest(): any {
    return {
      prompt: this.prompt,
      system_prompt: 'You are a helpful health assistant.',
      max_tokens: 500,
      temperature: 0.7,
    };
  }
}
