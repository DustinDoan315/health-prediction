import { GoalType, HealthGoal } from '../entities';

export interface IHealthGoalRepository {
  createGoal(goal: HealthGoal): Promise<HealthGoal>;
  getUserGoals(userId: number): Promise<HealthGoal[]>;
  updateGoal(goal: HealthGoal): Promise<HealthGoal>;
  deleteGoal(goalId: string): Promise<void>;
}

export interface CreateHealthGoalRequest {
  userId: number;
  type: GoalType;
  title: string;
  description: string;
  targetValue: number;
  unit: string;
  targetDate: Date;
}

export class CreateHealthGoalUseCase {
  constructor(private readonly goalRepository: IHealthGoalRepository) {}

  async execute(request: CreateHealthGoalRequest): Promise<HealthGoal> {
    const goal = HealthGoal.create(
      request.userId,
      request.type,
      request.title,
      request.description,
      request.targetValue,
      request.unit,
      request.targetDate
    );

    return await this.goalRepository.createGoal(goal);
  }
}
