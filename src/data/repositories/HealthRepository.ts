import { IHealthPrediction, IHealthStats, HealthPrediction, HealthStats } from '../../domain/entities';
import { IHealthRepository, HealthPredictionRequest, SimpleHealthPredictionRequest } from '../../domain/repositories';
import { ApiService } from './ApiService';

export class HealthRepository implements IHealthRepository {
  constructor(private readonly apiService: ApiService) {}

  async createPrediction(data: HealthPredictionRequest): Promise<IHealthPrediction> {
    try {
      const response = await this.apiService.post('/health/predict', data);
      return HealthPrediction.fromApiResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create health prediction');
    }
  }

  async createSimplePrediction(data: SimpleHealthPredictionRequest): Promise<IHealthPrediction> {
    try {
      const response = await this.apiService.post('/health/predict-simple', data);
      return HealthPrediction.fromApiResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create simple health prediction');
    }
  }

  async getUserPredictions(limit?: number): Promise<readonly IHealthPrediction[]> {
    try {
      const response = await this.apiService.get('/health/predictions', { limit });
      return (response.data as any).map((item: any) => HealthPrediction.fromApiResponse(item));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user predictions');
    }
  }

  async getPredictionById(id: number): Promise<IHealthPrediction> {
    try {
      const response = await this.apiService.get(`/health/predictions/${id}`);
      return HealthPrediction.fromApiResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get prediction by ID');
    }
  }

  async getHealthStats(): Promise<IHealthStats> {
    try {
      const response = await this.apiService.get('/health/stats');
      return HealthStats.fromApiResponse(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get health stats');
    }
  }
}
