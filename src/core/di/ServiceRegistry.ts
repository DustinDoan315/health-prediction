import { AIRepository, ApiService, AuthRepository, HealthRepository } from '../../data';
import {
    ChatWithAIUseCase,
    CreateHealthPredictionUseCase,
    CreateSimpleHealthPredictionUseCase,
    GetCurrentUserUseCase,
    GetHealthStatsUseCase,
    GetUserPredictionsUseCase,
    LoginUseCase,
    LogoutUseCase,
    RegisterUseCase,
} from '../../domain';

import { container } from './Container';
import { SERVICE_KEYS } from './ServiceKeys';

export class ServiceRegistry {
  static registerServices(): void {
    // Register API Service
    container.register(SERVICE_KEYS.AUTH_REPOSITORY, () => {
      const apiService = new ApiService();
      return new AuthRepository(apiService);
    });

    container.register(SERVICE_KEYS.HEALTH_REPOSITORY, () => {
      const apiService = new ApiService();
      return new HealthRepository(apiService);
    });

    container.register(SERVICE_KEYS.AI_REPOSITORY, () => {
      const apiService = new ApiService();
      return new AIRepository(apiService);
    });

    // Register Use Cases
    container.register(SERVICE_KEYS.LOGIN_USE_CASE, () => {
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY);
      return new LoginUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.REGISTER_USE_CASE, () => {
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY);
      return new RegisterUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.GET_CURRENT_USER_USE_CASE, () => {
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY);
      return new GetCurrentUserUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.LOGOUT_USE_CASE, () => {
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY);
      return new LogoutUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.CREATE_HEALTH_PREDICTION_USE_CASE, () => {
      const healthRepository = container.resolve(SERVICE_KEYS.HEALTH_REPOSITORY);
      return new CreateHealthPredictionUseCase(healthRepository);
    });

    container.register(SERVICE_KEYS.CREATE_SIMPLE_HEALTH_PREDICTION_USE_CASE, () => {
      const healthRepository = container.resolve(SERVICE_KEYS.HEALTH_REPOSITORY);
      return new CreateSimpleHealthPredictionUseCase(healthRepository);
    });

    container.register(SERVICE_KEYS.GET_USER_PREDICTIONS_USE_CASE, () => {
      const healthRepository = container.resolve(SERVICE_KEYS.HEALTH_REPOSITORY);
      return new GetUserPredictionsUseCase(healthRepository);
    });

    container.register(SERVICE_KEYS.GET_HEALTH_STATS_USE_CASE, () => {
      const healthRepository = container.resolve(SERVICE_KEYS.HEALTH_REPOSITORY);
      return new GetHealthStatsUseCase(healthRepository);
    });

    container.register(SERVICE_KEYS.CHAT_WITH_AI_USE_CASE, () => {
      const aiRepository = container.resolve(SERVICE_KEYS.AI_REPOSITORY);
      return new ChatWithAIUseCase(aiRepository);
    });
  }
}
