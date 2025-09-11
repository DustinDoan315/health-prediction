export enum LogType {
  WEIGHT = 'weight',
  BLOOD_PRESSURE = 'blood_pressure',
  STEPS = 'steps',
  HEART_RATE = 'heart_rate',
  SLEEP = 'sleep',
  WATER_INTAKE = 'water_intake',
  EXERCISE = 'exercise',
  MEDICATION = 'medication',
}

export interface IHealthLog {
  readonly id: string;
  readonly userId: number;
  readonly type: LogType;
  readonly value: number;
  readonly unit: string;
  readonly notes?: string;
  readonly loggedAt: Date;
  readonly createdAt: Date;
}

export class HealthLog implements IHealthLog {
  constructor(
    public readonly id: string,
    public readonly userId: number,
    public readonly type: LogType,
    public readonly value: number,
    public readonly unit: string,
    public readonly notes: string = '',
    public readonly loggedAt: Date,
    public readonly createdAt: Date
  ) {}

  static create(
    userId: number,
    type: LogType,
    value: number,
    unit: string,
    notes: string = '',
    loggedAt: Date = new Date()
  ): HealthLog {
    const now = new Date();
    return new HealthLog(
      `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      value,
      unit,
      notes,
      loggedAt,
      now
    );
  }

  toApiRequest(): any {
    return {
      user_id: this.userId,
      type: this.type,
      value: this.value,
      unit: this.unit,
      notes: this.notes,
      logged_at: this.loggedAt.toISOString(),
    };
  }
}
