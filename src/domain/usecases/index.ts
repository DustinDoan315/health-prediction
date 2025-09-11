export { ChatWithAIUseCase } from './ai';
export { AppleLoginUseCase, GetCurrentUserUseCase, GoogleLoginUseCase, LoginUseCase, LogoutUseCase, RegisterUseCase } from './auth';
export { CreateHealthGoalUseCase } from './CreateHealthGoalUseCase';
export { CreateUserProfileUseCase } from './CreateUserProfileUseCase';
export { CreateHealthPredictionUseCase, CreateSimpleHealthPredictionUseCase, GetHealthStatsUseCase, GetUserPredictionsUseCase } from './health';
export { LogHealthDataUseCase } from './LogHealthDataUseCase';

// Export interfaces
export type { IChatWithAIUseCase } from './ai/interfaces';
export type { IAppleLoginUseCase, IGetCurrentUserUseCase, IGoogleLoginUseCase, ILoginUseCase, ILogoutUseCase, IRegisterUseCase } from './auth/interfaces';
export type { ICreateHealthPredictionUseCase, ICreateSimpleHealthPredictionUseCase, IGetHealthStatsUseCase, IGetUserPredictionsUseCase } from './health/interfaces';

