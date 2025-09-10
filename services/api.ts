import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { STORAGE_KEYS } from '@/src/core/services/StorageKeys';
import { storageService } from '@/src/core/services';


// API Configuration
const BASE_URL = 'https://elf-fluent-morally.ngrok-free.app/api/v1';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface HealthPrediction {
  id: number;
  user_id: number;
  age: number;
  height_cm: number;
  weight_kg: number;
  bmi: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  cholesterol?: number;
  glucose?: number;
  smoking: boolean;
  exercise_hours_per_week: number;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  recommendations: string[];
  ai_powered: boolean;
  created_at: string;
}

export interface HealthStats {
  total_predictions: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  average_risk_score: number;
  ai_usage_percentage: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface HealthPredictionRequest {
  age: number;
  height_cm: number;
  weight_kg: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  cholesterol?: number;
  glucose?: number;
  smoking: boolean;
  exercise_hours_per_week: number;
}

export interface AIChat {
  prompt: string;
  system_prompt?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface AIChatResponse {
  response: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  timestamp: string;
}

// Create axios instance
class ApiService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await storageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error instanceof Error ? error : new Error('Request configuration failed'));
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, remove it
          await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        }
        return Promise.reject(error instanceof Error ? error : new Error('Request failed'));
      }
    );
  }

  // Authentication APIs
  async register(data: RegisterRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', data);
    // Store token securely
    await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } finally {
      // Always remove token from storage
      await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  // Health Prediction APIs
  async createHealthPrediction(data: HealthPredictionRequest): Promise<HealthPrediction> {
    const response: AxiosResponse<HealthPrediction> = await this.api.post('/health/predict', data);
    return response.data;
  }

  async createSimpleHealthPrediction(data: Pick<HealthPredictionRequest, 'age' | 'height_cm' | 'weight_kg' | 'smoking' | 'exercise_hours_per_week'>): Promise<HealthPrediction> {
    const response: AxiosResponse<HealthPrediction> = await this.api.post('/health/predict-simple', data);
    return response.data;
  }

  async getUserPredictions(limit: number = 10): Promise<HealthPrediction[]> {
    const response: AxiosResponse<HealthPrediction[]> = await this.api.get('/health/predictions', {
      params: { limit }
    });
    return response.data;
  }

  async getPredictionById(id: number): Promise<HealthPrediction> {
    const response: AxiosResponse<HealthPrediction> = await this.api.get(`/health/predictions/${id}`);
    return response.data;
  }

  async getHealthStats(): Promise<HealthStats> {
    const response: AxiosResponse<HealthStats> = await this.api.get('/health/stats');
    return response.data;
  }

  // AI Chat APIs
  async chatWithAI(data: AIChat): Promise<AIChatResponse> {
    const response: AxiosResponse<AIChatResponse> = await this.api.post('/ai/chat', data);
    return response.data;
  }

  async getAIStatus(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/ai/status');
    return response.data;
  }

  // System APIs
  async getSystemInfo(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/system/');
    return response.data;
  }

  async getHealthCheck(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/system/health');
    return response.data;
  }

  async getConfig(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/system/config');
    return response.data;
  }

  // Token management
  async getStoredToken(): Promise<string | null> {
    const token = await storageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token || null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    return !!token;
  }
}

export const apiService = new ApiService();
