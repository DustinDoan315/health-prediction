import { fetchHealthStats, fetchPredictions, toggleThemeAsync } from '@/store/slices';
import { MoodValue } from '@/components/screens/home/MoodCard';
import { useAppDispatch, useAppSelector } from './redux';
import { useCallback, useEffect, useState } from 'react';


export const useHomeScreen = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { stats, isLoading: healthLoading, statsLoaded, predictionsLoaded } = useAppSelector((state) => state.health);
  const { isDark } = useAppSelector((state) => state.theme);
  
  const [mood, setMood] = useState<MoodValue | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && !statsLoaded) {
      dispatch(fetchHealthStats());
    }
  }, [dispatch, isAuthenticated, user, statsLoaded]);

  useEffect(() => {
    if (isAuthenticated && user && !predictionsLoaded) {
      dispatch(fetchPredictions(10));
    }
  }, [dispatch, isAuthenticated, user, predictionsLoaded]);

  const handleMoodSelect = useCallback((selectedMood: MoodValue) => {
    setMood(selectedMood);
  }, []);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleThemeAsync(isDark ? 'dark' : 'light'));
  }, [dispatch, isDark]);

  const onRefresh = useCallback(async () => {
    if (isAuthenticated && user) {
      dispatch(fetchHealthStats());
      dispatch(fetchPredictions(10));
    }
  }, [dispatch, isAuthenticated, user]);

  const userName = user?.full_name?.split(' ')[0];

  return {
    // State
    user,
    userName,
    isAuthenticated,
    authLoading,
    healthLoading,
    stats,
    isDark,
    mood,
    
    // Actions
    handleMoodSelect,
    handleToggleTheme,
    onRefresh,
  };
};
