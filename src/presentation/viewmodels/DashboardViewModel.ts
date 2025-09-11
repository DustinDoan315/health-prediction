import { useCallback, useEffect, useState } from 'react';
import {
    HealthGoal,
    HealthLog,
    LogType
} from '../../domain/entities';

export interface DashboardState {
  isLoading: boolean;
  error: string | null;
  todayLogs: HealthLog[];
  weeklyLogs: HealthLog[];
  activeGoals: HealthGoal[];
  dashboardData: {
    steps: number;
    heartRate: number;
    sleep: number;
    calories: number;
    waterIntake: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color: string;
  }[];
}

export const useDashboardViewModel = (
  userId: number,
  getLogs: (userId: number, type?: LogType, startDate?: Date, endDate?: Date) => Promise<HealthLog[]>,
  getGoals: (userId: number) => Promise<HealthGoal[]>
) => {
  const [state, setState] = useState<DashboardState>({
    isLoading: true,
    error: null,
    todayLogs: [],
    weeklyLogs: [],
    activeGoals: [],
    dashboardData: {
      steps: 0,
      heartRate: 0,
      sleep: 0,
      calories: 0,
      waterIntake: 0,
    },
  });

  const loadDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const [todayLogs, weeklyLogs, goals] = await Promise.all([
        getLogs(userId, undefined, today, today),
        getLogs(userId, undefined, startOfWeek, today),
        getGoals(userId),
      ]);

      const activeGoals = goals.filter(goal => goal.status === 'active');
      
      const dashboardData = {
        steps: todayLogs.find(log => log.type === LogType.STEPS)?.value || 0,
        heartRate: todayLogs.find(log => log.type === LogType.HEART_RATE)?.value || 0,
        sleep: todayLogs.find(log => log.type === LogType.SLEEP)?.value || 0,
        calories: todayLogs.find(log => log.type === LogType.EXERCISE)?.value || 0,
        waterIntake: todayLogs.find(log => log.type === LogType.WATER_INTAKE)?.value || 0,
      };

      setState(prev => ({
        ...prev,
        todayLogs,
        weeklyLogs,
        activeGoals,
        dashboardData,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  }, [userId, getLogs, getGoals]);

  const getStepsChartData = useCallback((): ChartData => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    const stepsData = last7Days.map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayLogs = state.weeklyLogs.filter(log => 
        log.type === LogType.STEPS && 
        log.loggedAt.toDateString() === date.toDateString()
      );
      return dayLogs.reduce((sum, log) => sum + log.value, 0);
    });

    return {
      labels: last7Days,
      datasets: [{ data: stepsData, color: '#3B82F6' }],
    };
  }, [state.weeklyLogs]);

  const getHeartRateChartData = useCallback((): ChartData => {
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      return hour.getHours().toString();
    });

    const heartRateData = last24Hours.map((_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      const hourLogs = state.todayLogs.filter(log => 
        log.type === LogType.HEART_RATE && 
        log.loggedAt.getHours() === hour.getHours()
      );
      return hourLogs.length > 0 ? hourLogs.reduce((sum, log) => sum + log.value, 0) / hourLogs.length : 0;
    });

    return {
      labels: last24Hours,
      datasets: [{ data: heartRateData, color: '#EF4444' }],
    };
  }, [state.todayLogs]);

  const getSleepChartData = useCallback((): ChartData => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    const sleepData = last7Days.map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayLogs = state.weeklyLogs.filter(log => 
        log.type === LogType.SLEEP && 
        log.loggedAt.toDateString() === date.toDateString()
      );
      return dayLogs.reduce((sum, log) => sum + log.value, 0);
    });

    return {
      labels: last7Days,
      datasets: [{ data: sleepData, color: '#8B5CF6' }],
    };
  }, [state.weeklyLogs]);

  const getCaloriesChartData = useCallback((): ChartData => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    const caloriesData = last7Days.map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayLogs = state.weeklyLogs.filter(log => 
        log.type === LogType.EXERCISE && 
        log.loggedAt.toDateString() === date.toDateString()
      );
      return dayLogs.reduce((sum, log) => sum + log.value, 0);
    });

    return {
      labels: last7Days,
      datasets: [{ data: caloriesData, color: '#F59E0B' }],
    };
  }, [state.weeklyLogs]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    state,
    loadDashboardData,
    getStepsChartData,
    getHeartRateChartData,
    getSleepChartData,
    getCaloriesChartData,
  };
};
