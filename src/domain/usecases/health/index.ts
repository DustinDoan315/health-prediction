import { HealthPredictionRequest, IHealthRepository, SimpleHealthPredictionRequest } from '../../repositories';
import {
  ICreateHealthPredictionUseCase,
  ICreateSimpleHealthPredictionUseCase,
  IGetHealthStatsUseCase,
  IGetUserPredictionsUseCase
  } from './interfaces';
import { IHealthPrediction, IHealthStats } from '../../entities';

export class CreateHealthPredictionUseCase implements ICreateHealthPredictionUseCase {
  constructor(private readonly healthRepository: IHealthRepository) {}

  async execute(data: HealthPredictionRequest): Promise<IHealthPrediction> {
    this.validateHealthData(data);
    return await this.healthRepository.createPrediction(data);
  }

  private validateHealthData(data: HealthPredictionRequest): void {
    if (data.age < 1 || data.age > 120) {
      throw new Error('Age must be between 1 and 120 years');
    }
    if (data.heightCm < 50 || data.heightCm > 250) {
      throw new Error('Height must be between 50 and 250 cm');
    }
    if (data.weightKg < 10 || data.weightKg > 300) {
      throw new Error('Weight must be between 10 and 300 kg');
    }
    if (data.systolicBp && (data.systolicBp < 70 || data.systolicBp > 250)) {
      throw new Error('Systolic blood pressure must be between 70 and 250 mmHg');
    }
    if (data.diastolicBp && (data.diastolicBp < 40 || data.diastolicBp > 150)) {
      throw new Error('Diastolic blood pressure must be between 40 and 150 mmHg');
    }
    if (data.cholesterol && (data.cholesterol < 50 || data.cholesterol > 500)) {
      throw new Error('Cholesterol must be between 50 and 500 mg/dL');
    }
    if (data.glucose && (data.glucose < 50 || data.glucose > 500)) {
      throw new Error('Glucose must be between 50 and 500 mg/dL');
    }
    if (data.exerciseHoursPerWeek < 0 || data.exerciseHoursPerWeek > 168) {
      throw new Error('Exercise hours must be between 0 and 168 per week');
    }
  }
}

export class CreateSimpleHealthPredictionUseCase implements ICreateSimpleHealthPredictionUseCase {
  constructor(private readonly healthRepository: IHealthRepository) {}

  async execute(data: SimpleHealthPredictionRequest): Promise<IHealthPrediction> {
    this.validateSimpleHealthData(data);
    return await this.healthRepository.createSimplePrediction(data);
  }

  private validateSimpleHealthData(data: SimpleHealthPredictionRequest): void {
    if (data.age < 1 || data.age > 120) {
      throw new Error('Age must be between 1 and 120 years');
    }
    if (data.heightCm < 50 || data.heightCm > 250) {
      throw new Error('Height must be between 50 and 250 cm');
    }
    if (data.weightKg < 10 || data.weightKg > 300) {
      throw new Error('Weight must be between 10 and 300 kg');
    }
    if (data.exerciseHoursPerWeek < 0 || data.exerciseHoursPerWeek > 168) {
      throw new Error('Exercise hours must be between 0 and 168 per week');
    }
  }
}

export class GetUserPredictionsUseCase implements IGetUserPredictionsUseCase {
  constructor(private readonly healthRepository: IHealthRepository) {}

  async execute(limit: number = 10): Promise<readonly IHealthPrediction[]> {
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
    return await this.healthRepository.getUserPredictions(limit);
  }
}

export class GetHealthStatsUseCase implements IGetHealthStatsUseCase {
  constructor(private readonly healthRepository: IHealthRepository) {}

  async execute(): Promise<IHealthStats> {
    return await this.healthRepository.getHealthStats();
  }
}
