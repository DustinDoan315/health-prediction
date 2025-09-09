import { IUser } from '../../entities';
import { RegisterRequest } from '../../repositories';

export interface ILoginUseCase {
  execute(username: string, password: string): Promise<{ user: IUser; token: string }>;
}

export interface IGoogleLoginUseCase {
  execute(idToken: string): Promise<{ user: IUser; token: string }>;
}

export interface IAppleLoginUseCase {
  execute(identityToken: string, authorizationCode: string): Promise<{ user: IUser; token: string }>;
}

export interface IRegisterUseCase {
  execute(userData: RegisterRequest): Promise<IUser>;
}

export interface IGetCurrentUserUseCase {
  execute(): Promise<IUser>;
}

export interface ILogoutUseCase {
  execute(): Promise<void>;
}
