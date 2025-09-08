export type RiskLevel = 'low' | 'medium' | 'high';

export interface IHealthPrediction {
  readonly id: number;
  readonly userId: number;
  readonly age: number;
  readonly heightCm: number;
  readonly weightKg: number;
  readonly bmi: number;
  readonly systolicBp?: number;
  readonly diastolicBp?: number;
  readonly cholesterol?: number;
  readonly glucose?: number;
  readonly smoking: boolean;
  readonly exerciseHoursPerWeek: number;
  readonly riskScore: number;
  readonly riskLevel: RiskLevel;
  readonly recommendations: readonly string[];
  readonly aiPowered: boolean;
  readonly createdAt: Date;
}

export class HealthPrediction implements IHealthPrediction {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly age: number,
    public readonly heightCm: number,
    public readonly weightKg: number,
    public readonly bmi: number,
    public readonly systolicBp: number | undefined,
    public readonly diastolicBp: number | undefined,
    public readonly cholesterol: number | undefined,
    public readonly glucose: number | undefined,
    public readonly smoking: boolean,
    public readonly exerciseHoursPerWeek: number,
    public readonly riskScore: number,
    public readonly riskLevel: RiskLevel,
    public readonly recommendations: readonly string[],
    public readonly aiPowered: boolean,
    public readonly createdAt: Date
  ) {}

  static fromApiResponse(data: any): HealthPrediction {
    return new HealthPrediction(
      data.id,
      data.user_id,
      data.age,
      data.height_cm,
      data.weight_kg,
      data.bmi,
      data.systolic_bp,
      data.diastolic_bp,
      data.cholesterol,
      data.glucose,
      data.smoking,
      data.exercise_hours_per_week,
      data.risk_score,
      data.risk_level,
      data.recommendations,
      data.ai_powered,
      new Date(data.created_at)
    );
  }

  toApiRequest(): any {
    return {
      age: this.age,
      height_cm: this.heightCm,
      weight_kg: this.weightKg,
      systolic_bp: this.systolicBp,
      diastolic_bp: this.diastolicBp,
      cholesterol: this.cholesterol,
      glucose: this.glucose,
      smoking: this.smoking,
      exercise_hours_per_week: this.exerciseHoursPerWeek,
    };
  }

  getRiskColor(): string {
    switch (this.riskLevel) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  }

  getRiskLabel(): string {
    switch (this.riskLevel) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
      default: return 'Unknown';
    }
  }
}
