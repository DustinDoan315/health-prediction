import { AuthProvider, IUser, User } from '../../domain/entities';
import { IAuthRepository, RegisterRequest } from '../../domain/repositories';
import { ApiService } from './ApiService';

export class AuthRepository implements IAuthRepository {
  constructor(private readonly apiService: ApiService) {}

  async login(username: string, password: string): Promise<{ user: IUser; token: string }> {
    try {
      const response = await this.apiService.post('/auth/login', {
        username,
        password,
      });

      return {
        user: User.fromApiResponse((response.data as any).user),
        token: (response.data as any).token,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData: RegisterRequest): Promise<IUser> {
    try {
      const response = await this.apiService.post('/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName,
        auth_provider: userData.authProvider || AuthProvider.EMAIL_PASSWORD,
        provider_id: userData.providerId,
      });

      return User.fromApiResponse((response.data as any).user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async loginWithGoogle(idToken: string): Promise<{ user: IUser; token: string }> {
    try {
      const response = await this.apiService.post('/auth/google', {
        id_token: idToken,
      });

      return {
        user: User.fromApiResponse((response.data as any).user),
        token: (response.data as any).token,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  }

  async loginWithApple(identityToken: string, authorizationCode: string): Promise<{ user: IUser; token: string }> {
    try {
      const response = await this.apiService.post('/auth/apple', {
        identity_token: identityToken,
        authorization_code: authorizationCode,
      });

      return {
        user: User.fromApiResponse((response.data as any).user),
        token: (response.data as any).token,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Apple login failed');
    }
  }

  async getCurrentUser(): Promise<IUser> {
    try {
      const response = await this.apiService.get('/auth/me');
      return User.fromApiResponse((response.data as any).user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.apiService.post('/auth/logout');
    } catch (error: any) {
      // Don't throw error on logout failure
      console.warn('Logout request failed:', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
}
