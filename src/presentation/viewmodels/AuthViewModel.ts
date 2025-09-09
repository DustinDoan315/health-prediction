import { container, SERVICE_KEYS } from '../../core/di';
import {
  IAppleLoginUseCase,
  IGetCurrentUserUseCase,
  IGoogleLoginUseCase,
  ILoginUseCase,
  ILogoutUseCase,
  IRegisterUseCase
  } from '../../domain';
import { IUser } from '../../domain/entities';
import { RegisterRequest } from '../../domain/repositories';
import { SocialAuthService } from '../../core/services/SocialAuthService';
import { useCallback, useState } from 'react';


export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthViewModel {
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}


export const useAuthViewModel = (): AuthViewModel => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const loginUseCase = container.resolve<ILoginUseCase>(SERVICE_KEYS.LOGIN_USE_CASE);
  const registerUseCase = container.resolve<IRegisterUseCase>(SERVICE_KEYS.REGISTER_USE_CASE);
  const googleLoginUseCase = container.resolve<IGoogleLoginUseCase>(SERVICE_KEYS.GOOGLE_LOGIN_USE_CASE);
  const appleLoginUseCase = container.resolve<IAppleLoginUseCase>(SERVICE_KEYS.APPLE_LOGIN_USE_CASE);
  const getCurrentUserUseCase = container.resolve<IGetCurrentUserUseCase>(SERVICE_KEYS.GET_CURRENT_USER_USE_CASE);
  const logoutUseCase = container.resolve<ILogoutUseCase>(SERVICE_KEYS.LOGOUT_USE_CASE);
  const socialAuthService = SocialAuthService.getInstance();

  const login = useCallback(async (username: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await loginUseCase.execute(username, password);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: result.user,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
    }
  }, [loginUseCase]);

  const register = useCallback(async (userData: RegisterRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await registerUseCase.execute(userData);
      setState(prev => ({
        ...prev,
        isLoading: false,
        user,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
    }
  }, [registerUseCase]);

  const loginWithGoogle = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const socialResult = await socialAuthService.signInWithGoogle();
      const result = await googleLoginUseCase.execute(socialResult.idToken!);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: result.user,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Google login failed',
      }));
    }
  }, [googleLoginUseCase, socialAuthService]);

  const loginWithApple = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const socialResult = await socialAuthService.signInWithApple();
      const result = await appleLoginUseCase.execute(socialResult.idToken!, socialResult.authorizationCode!);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: result.user,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Apple login failed',
      }));
    }
  }, [appleLoginUseCase, socialAuthService]);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await logoutUseCase.execute();
      await socialAuthService.signOut();
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
    }
  }, [logoutUseCase, socialAuthService]);

  const loadUser = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const user = await getCurrentUserUseCase.execute();
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user,
        error: null,
      }));
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      }));
    }
  }, [getCurrentUserUseCase]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    login,
    register,
    loginWithGoogle,
    loginWithApple,
    logout,
    loadUser,
    clearError,
  };
};
