import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    HealthGoal
} from '../../domain/entities';
import { IHealthGoalRepository } from '../../domain/usecases/CreateHealthGoalUseCase';


const HEALTH_GOALS_KEY = 'health_goals';

export class LocalHealthGoalRepository implements IHealthGoalRepository {
  private async getStoredGoals(): Promise<HealthGoal[]> {
    try {
      const stored = await AsyncStorage.getItem(HEALTH_GOALS_KEY);
      if (!stored) return [];
      
      const data = JSON.parse(stored);
      return data.map((item: any) => new HealthGoal(
        item.id,
        item.userId,
        item.type,
        item.title,
        item.description,
        item.targetValue,
        item.currentValue,
        item.unit,
        item.status,
        new Date(item.startDate),
        new Date(item.targetDate),
        new Date(item.createdAt),
        new Date(item.updatedAt)
      ));
    } catch (error) {
      console.error('Error loading health goals:', error);
      return [];
    }
  }

  private async saveGoals(goals: HealthGoal[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HEALTH_GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving health goals:', error);
      throw error;
    }
  }

  async createGoal(goal: HealthGoal): Promise<HealthGoal> {
    const goals = await this.getStoredGoals();
    goals.push(goal);
    await this.saveGoals(goals);
    return goal;
  }

  async getUserGoals(userId: number): Promise<HealthGoal[]> {
    const goals = await this.getStoredGoals();
    return goals.filter(goal => goal.userId === userId);
  }

  async updateGoal(updatedGoal: HealthGoal): Promise<HealthGoal> {
    const goals = await this.getStoredGoals();
    const index = goals.findIndex(goal => goal.id === updatedGoal.id);
    
    if (index === -1) {
      throw new Error('Goal not found');
    }
    
    goals[index] = updatedGoal;
    await this.saveGoals(goals);
    return updatedGoal;
  }

  async deleteGoal(goalId: string): Promise<void> {
    const goals = await this.getStoredGoals();
    const filteredGoals = goals.filter(goal => goal.id !== goalId);
    await this.saveGoals(filteredGoals);
  }
}
