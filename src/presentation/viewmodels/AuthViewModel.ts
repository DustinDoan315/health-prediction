import { useCallback, useState } from 'react';
import { SERVICE_KEYS, container } from '../../core/di';
import { IGetCurrentUserUseCase, ILoginUseCase, ILogoutUseCase, IRegisterUseCase } from '../../domain';

import { IUser } from '../../domain/entities';

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
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
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
  const getCurrentUserUseCase = container.resolve<IGetCurrentUserUseCase>(SERVICE_KEYS.GET_CURRENT_USER_USE_CASE);
  const logoutUseCase = container.resolve<ILogoutUseCase>(SERVICE_KEYS.LOGOUT_USE_CASE);

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

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await logoutUseCase.execute();
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
  }, [logoutUseCase]);

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
    } catch (error) {
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
    logout,
    loadUser,
    clearError,
  };
};
