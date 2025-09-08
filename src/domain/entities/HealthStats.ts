export interface IHealthStats {
  readonly totalPredictions: number;
  readonly riskDistribution: {
    readonly low: number;
    readonly medium: number;
    readonly high: number;
  };
  readonly averageRiskScore: number;
  readonly aiUsagePercentage: number;
}

export class HealthStats implements IHealthStats {
  constructor(
    public readonly totalPredictions: number,
    public readonly riskDistribution: {
      readonly low: number;
      readonly medium: number;
      readonly high: number;
    },
    public readonly averageRiskScore: number,
    public readonly aiUsagePercentage: number
  ) {}

  static fromApiResponse(data: any): HealthStats {
    return new HealthStats(
      data.total_predictions,
      {
        low: data.risk_distribution.low,
        medium: data.risk_distribution.medium,
        high: data.risk_distribution.high,
      },
      data.average_risk_score,
      data.ai_usage_percentage
    );
  }

  getTotalRiskCount(): number {
    return this.riskDistribution.low + this.riskDistribution.medium + this.riskDistribution.high;
  }

  getRiskPercentage(level: 'low' | 'medium' | 'high'): number {
    const total = this.getTotalRiskCount();
    return total > 0 ? (this.riskDistribution[level] / total) * 100 : 0;
  }
}
