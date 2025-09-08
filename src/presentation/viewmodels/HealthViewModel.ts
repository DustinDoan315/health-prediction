import { useCallback, useState } from 'react';
import { SERVICE_KEYS, container } from '../../core/di';
import {
    HealthPredictionRequest,
    ICreateHealthPredictionUseCase,
    ICreateSimpleHealthPredictionUseCase,
    IGetHealthStatsUseCase,
    IGetUserPredictionsUseCase,
    SimpleHealthPredictionRequest
} from '../../domain';
import { IHealthPrediction, IHealthStats } from '../../domain/entities';

export interface HealthState {
  predictions: readonly IHealthPrediction[];
  stats: IHealthStats | null;
  isLoading: boolean;
  error: string | null;
  hasLoadedPredictions: boolean;
  hasLoadedStats: boolean;
}

export interface HealthViewModel {
  state: HealthState;
  createPrediction: (data: HealthPredictionRequest) => Promise<IHealthPrediction>;
  createSimplePrediction: (data: SimpleHealthPredictionRequest) => Promise<IHealthPrediction>;
  loadUserPredictions: (limit?: number) => Promise<void>;
  loadHealthStats: () => Promise<void>;
  clearError: () => void;
  resetLoadedFlags: () => void;
}

export const useHealthViewModel = (): HealthViewModel => {
  const [state, setState] = useState<HealthState>({
    predictions: [],
    stats: null,
    isLoading: false,
    error: null,
    hasLoadedPredictions: false,
    hasLoadedStats: false,
  });

  const createHealthPredictionUseCase = container.resolve<ICreateHealthPredictionUseCase>(SERVICE_KEYS.CREATE_HEALTH_PREDICTION_USE_CASE);
  const createSimpleHealthPredictionUseCase = container.resolve<ICreateSimpleHealthPredictionUseCase>(SERVICE_KEYS.CREATE_SIMPLE_HEALTH_PREDICTION_USE_CASE);
  const getUserPredictionsUseCase = container.resolve<IGetUserPredictionsUseCase>(SERVICE_KEYS.GET_USER_PREDICTIONS_USE_CASE);
  const getHealthStatsUseCase = container.resolve<IGetHealthStatsUseCase>(SERVICE_KEYS.GET_HEALTH_STATS_USE_CASE);

  const createPrediction = useCallback(async (data: HealthPredictionRequest): Promise<IHealthPrediction> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const prediction = await createHealthPredictionUseCase.execute(data);
      setState(prev => ({
        ...prev,
        isLoading: false,
        predictions: [prediction, ...prev.predictions],
        error: null,
      }));
      return prediction;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create prediction',
      }));
      throw error;
    }
  }, [createHealthPredictionUseCase]);

  const createSimplePrediction = useCallback(async (data: SimpleHealthPredictionRequest): Promise<IHealthPrediction> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const prediction = await createSimpleHealthPredictionUseCase.execute(data);
      setState(prev => ({
        ...prev,
        isLoading: false,
        predictions: [prediction, ...prev.predictions],
        error: null,
      }));
      return prediction;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create prediction',
      }));
      throw error;
    }
  }, [createSimpleHealthPredictionUseCase]);

  const loadUserPredictions = useCallback(async (limit: number = 10) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const predictions = await getUserPredictionsUseCase.execute(limit);
      setState(prev => ({
        ...prev,
        isLoading: false,
        predictions,
        hasLoadedPredictions: true,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load predictions',
      }));
    }
  }, [getUserPredictionsUseCase]);

  const loadHealthStats = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const stats = await getHealthStatsUseCase.execute();
      setState(prev => ({
        ...prev,
        isLoading: false,
        stats,
        hasLoadedStats: true,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load health stats',
      }));
    }
  }, [getHealthStatsUseCase]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetLoadedFlags = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasLoadedPredictions: false,
      hasLoadedStats: false,
    }));
  }, []);

  return {
    state,
    createPrediction,
    createSimplePrediction,
    loadUserPredictions,
    loadHealthStats,
    clearError,
    resetLoadedFlags,
  };
};
