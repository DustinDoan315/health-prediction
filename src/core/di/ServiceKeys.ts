export const SERVICE_KEYS = {
  // Repositories
  AUTH_REPOSITORY: 'authRepository',
  HEALTH_REPOSITORY: 'healthRepository',
  AI_REPOSITORY: 'aiRepository',
  
  // Use Cases
  LOGIN_USE_CASE: 'loginUseCase',
  REGISTER_USE_CASE: 'registerUseCase',
  GET_CURRENT_USER_USE_CASE: 'getCurrentUserUseCase',
  LOGOUT_USE_CASE: 'logoutUseCase',
  CREATE_HEALTH_PREDICTION_USE_CASE: 'createHealthPredictionUseCase',
  CREATE_SIMPLE_HEALTH_PREDICTION_USE_CASE: 'createSimpleHealthPredictionUseCase',
  GET_USER_PREDICTIONS_USE_CASE: 'getUserPredictionsUseCase',
  GET_HEALTH_STATS_USE_CASE: 'getHealthStatsUseCase',
  CHAT_WITH_AI_USE_CASE: 'chatWithAIUseCase',
} as const;
