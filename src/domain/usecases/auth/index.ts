import {
  IAppleLoginUseCase,
  IGetCurrentUserUseCase,
  IGoogleLoginUseCase,
  ILoginUseCase,
  ILogoutUseCase,
  IRegisterUseCase
  } from './interfaces';
import { IAuthRepository, RegisterRequest } from '../../repositories';
import { IUser } from '../../entities';


export class LoginUseCase implements ILoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(username: string, password: string): Promise<{ user: IUser; token: string }> {
    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    return await this.authRepository.login(username, password);
  }
}

export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(idToken: string): Promise<{ user: IUser; token: string }> {
    if (!idToken.trim()) {
      throw new Error('Google ID token is required');
    }

    return await this.authRepository.loginWithGoogle(idToken);
  }
}

export class AppleLoginUseCase implements IAppleLoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(identityToken: string, authorizationCode: string): Promise<{ user: IUser; token: string }> {
    if (!identityToken.trim() || !authorizationCode.trim()) {
      throw new Error('Apple identity token and authorization code are required');
    }

    return await this.authRepository.loginWithApple(identityToken, authorizationCode);
  }
}

export class RegisterUseCase implements IRegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(userData: RegisterRequest): Promise<IUser> {
    this.validateRegistrationData(userData);
    return await this.authRepository.register(userData);
  }

  private validateRegistrationData(userData: RegisterRequest): void {
    if (!userData.username.trim()) {
      throw new Error('Username is required');
    }
    if (!userData.email.trim()) {
      throw new Error('Email is required');
    }
    if (!this.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    if (!userData.password.trim()) {
      throw new Error('Password is required');
    }
    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!userData.fullName.trim()) {
      throw new Error('Full name is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<IUser> {
    const isAuthenticated = await this.authRepository.isAuthenticated();
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }
    return await this.authRepository.getCurrentUser();
  }
}

export class LogoutUseCase implements ILogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
