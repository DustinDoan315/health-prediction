import {
  AIRepository,
  ApiService,
  AuthRepository,
  HealthRepository
  } from '../../data';
import { container } from './Container';
import { IAIRepository, IAuthRepository, IHealthRepository } from '../../domain/repositories';
import { SERVICE_KEYS } from './ServiceKeys';
import { SocialAuthService } from '../services/SocialAuthService';
import {
  AppleLoginUseCase,
  ChatWithAIUseCase,
  CreateHealthPredictionUseCase,
  CreateSimpleHealthPredictionUseCase,
  GetCurrentUserUseCase,
  GetHealthStatsUseCase,
  GetUserPredictionsUseCase,
  GoogleLoginUseCase,
  LoginUseCase,
  LogoutUseCase,
  RegisterUseCase,
} from '../../domain';


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
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY) as IAuthRepository;
      return new LoginUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.REGISTER_USE_CASE, () => {
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY) as IAuthRepository;
      return new RegisterUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.GOOGLE_LOGIN_USE_CASE, () => {
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY) as IAuthRepository;
      return new GoogleLoginUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.APPLE_LOGIN_USE_CASE, () => {
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY) as IAuthRepository;
      return new AppleLoginUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.GET_CURRENT_USER_USE_CASE, () => {
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY) as IAuthRepository;
      return new GetCurrentUserUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.LOGOUT_USE_CASE, () => {
      const authRepository = container.resolve(SERVICE_KEYS.AUTH_REPOSITORY) as IAuthRepository;
      return new LogoutUseCase(authRepository);
    });

    container.register(SERVICE_KEYS.CREATE_HEALTH_PREDICTION_USE_CASE, () => {
      const healthRepository = container.resolve(SERVICE_KEYS.HEALTH_REPOSITORY) as IHealthRepository;
      return new CreateHealthPredictionUseCase(healthRepository);
    });

    container.register(SERVICE_KEYS.CREATE_SIMPLE_HEALTH_PREDICTION_USE_CASE, () => {
      const healthRepository = container.resolve(SERVICE_KEYS.HEALTH_REPOSITORY) as IHealthRepository;
      return new CreateSimpleHealthPredictionUseCase(healthRepository);
    });

    container.register(SERVICE_KEYS.GET_USER_PREDICTIONS_USE_CASE, () => {
      const healthRepository = container.resolve(SERVICE_KEYS.HEALTH_REPOSITORY) as IHealthRepository;
      return new GetUserPredictionsUseCase(healthRepository);
    });

    container.register(SERVICE_KEYS.GET_HEALTH_STATS_USE_CASE, () => {
      const healthRepository = container.resolve(SERVICE_KEYS.HEALTH_REPOSITORY) as IHealthRepository;
      return new GetHealthStatsUseCase(healthRepository);
    });

    container.register(SERVICE_KEYS.CHAT_WITH_AI_USE_CASE, () => {
      const aiRepository = container.resolve(SERVICE_KEYS.AI_REPOSITORY) as IAIRepository;
      return new ChatWithAIUseCase(aiRepository);
    });

    // Register Services
    container.register(SERVICE_KEYS.SOCIAL_AUTH_SERVICE, () => SocialAuthService.getInstance());
  }
}
