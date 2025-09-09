export { ChatWithAIUseCase } from './ai';
export { AppleLoginUseCase, GetCurrentUserUseCase, GoogleLoginUseCase, LoginUseCase, LogoutUseCase, RegisterUseCase } from './auth';
export { CreateHealthPredictionUseCase, CreateSimpleHealthPredictionUseCase, GetHealthStatsUseCase, GetUserPredictionsUseCase } from './health';

// Export interfaces
export type { IChatWithAIUseCase } from './ai/interfaces';
export type { IAppleLoginUseCase, IGetCurrentUserUseCase, IGoogleLoginUseCase, ILoginUseCase, ILogoutUseCase, IRegisterUseCase } from './auth/interfaces';
export type { ICreateHealthPredictionUseCase, ICreateSimpleHealthPredictionUseCase, IGetHealthStatsUseCase, IGetUserPredictionsUseCase } from './health/interfaces';

