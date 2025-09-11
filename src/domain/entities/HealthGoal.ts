export enum GoalType {
  WEIGHT_TARGET = 'weight_target',
  ACTIVITY_GOAL = 'activity_goal',
  WATER_INTAKE = 'water_intake',
  SLEEP_GOAL = 'sleep_goal',
  STEP_COUNT = 'step_count',
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
}

export interface IHealthGoal {
  readonly id: string;
  readonly userId: number;
  readonly type: GoalType;
  readonly title: string;
  readonly description: string;
  readonly targetValue: number;
  readonly currentValue: number;
  readonly unit: string;
  readonly status: GoalStatus;
  readonly startDate: Date;
  readonly targetDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class HealthGoal implements IHealthGoal {
  constructor(
    public readonly id: string,
    public readonly userId: number,
    public readonly type: GoalType,
    public readonly title: string,
    public readonly description: string,
    public readonly targetValue: number,
    public readonly currentValue: number,
    public readonly unit: string,
    public readonly status: GoalStatus,
    public readonly startDate: Date,
    public readonly targetDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    userId: number,
    type: GoalType,
    title: string,
    description: string,
    targetValue: number,
    unit: string,
    targetDate: Date
  ): HealthGoal {
    const now = new Date();
    return new HealthGoal(
      `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      description,
      targetValue,
      0,
      unit,
      GoalStatus.ACTIVE,
      now,
      targetDate,
      now,
      now
    );
  }

  getProgressPercentage(): number {
    if (this.targetValue === 0) return 0;
    return Math.min((this.currentValue / this.targetValue) * 100, 100);
  }

  isCompleted(): boolean {
    return this.currentValue >= this.targetValue;
  }

  updateProgress(newValue: number): HealthGoal {
    return new HealthGoal(
      this.id,
      this.userId,
      this.type,
      this.title,
      this.description,
      this.targetValue,
      newValue,
      this.unit,
      this.isCompleted() ? GoalStatus.COMPLETED : this.status,
      this.startDate,
      this.targetDate,
      this.createdAt,
      new Date()
    );
  }

  toApiRequest(): any {
    return {
      user_id: this.userId,
      type: this.type,
      title: this.title,
      description: this.description,
      target_value: this.targetValue,
      current_value: this.currentValue,
      unit: this.unit,
      status: this.status,
      start_date: this.startDate.toISOString(),
      target_date: this.targetDate.toISOString(),
    };
  }
}
