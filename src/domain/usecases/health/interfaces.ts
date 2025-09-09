import { IHealthPrediction, IHealthStats } from '../../entities';
import { HealthPredictionRequest, SimpleHealthPredictionRequest } from '../../repositories';

export interface ICreateHealthPredictionUseCase {
  execute(data: HealthPredictionRequest): Promise<IHealthPrediction>;
}

export interface ICreateSimpleHealthPredictionUseCase {
  execute(data: SimpleHealthPredictionRequest): Promise<IHealthPrediction>;
}

export interface IGetUserPredictionsUseCase {
  execute(limit?: number): Promise<readonly IHealthPrediction[]>;
}

export interface IGetHealthStatsUseCase {
  execute(): Promise<IHealthStats>;
}
