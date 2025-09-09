import {
  AuthProvider,
  IAIChatMessage,
  IHealthPrediction,
  IHealthStats,
  IUser
  } from '../entities';

export interface IAuthRepository {
  login(username: string, password: string): Promise<{ user: IUser; token: string }>;
  register(userData: RegisterRequest): Promise<IUser>;
  loginWithGoogle(idToken: string): Promise<{ user: IUser; token: string }>;
  loginWithApple(identityToken: string, authorizationCode: string): Promise<{ user: IUser; token: string }>;
  getCurrentUser(): Promise<IUser>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

export interface IHealthRepository {
  createPrediction(data: HealthPredictionRequest): Promise<IHealthPrediction>;
  createSimplePrediction(data: SimpleHealthPredictionRequest): Promise<IHealthPrediction>;
  getUserPredictions(limit?: number): Promise<readonly IHealthPrediction[]>;
  getPredictionById(id: number): Promise<IHealthPrediction>;
  getHealthStats(): Promise<IHealthStats>;
}

export interface IAIRepository {
  chatWithAI(prompt: string): Promise<IAIChatMessage>;
  getAIStatus(): Promise<boolean>;
}

export interface RegisterRequest {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly fullName: string;
  readonly authProvider?: AuthProvider;
  readonly providerId?: string;
}

export interface SocialLoginRequest {
  readonly email: string;
  readonly fullName: string;
  readonly authProvider: AuthProvider;
  readonly providerId: string;
  readonly idToken?: string;
  readonly authorizationCode?: string;
}

export interface HealthPredictionRequest {
  readonly age: number;
  readonly heightCm: number;
  readonly weightKg: number;
  readonly systolicBp?: number;
  readonly diastolicBp?: number;
  readonly cholesterol?: number;
  readonly glucose?: number;
  readonly smoking: boolean;
  readonly exerciseHoursPerWeek: number;
}

export interface SimpleHealthPredictionRequest {
  readonly age: number;
  readonly heightCm: number;
  readonly weightKg: number;
  readonly smoking: boolean;
  readonly exerciseHoursPerWeek: number;
}
