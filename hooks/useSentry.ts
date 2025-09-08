import { addBreadcrumb, clearUser, setContext, setTag, setUser } from '@/services';

import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useSentryUser = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  useEffect(() => {
    if (user) {
      setUser({
        id: user.id.toString(),
        email: user.email,
      });
      
      setContext('user', {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      });
      
      addBreadcrumb('User logged in', 'auth', {
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
    } else {
      clearUser();
      addBreadcrumb('User logged out', 'auth', {
        timestamp: new Date().toISOString(),
      });
    }
  }, [user]);
};

export const useSentryNavigation = (screenName: string) => {
  useEffect(() => {
    setTag('current_screen', screenName);
    addBreadcrumb(`Screen view: ${screenName}`, 'navigation', {
      screen: screenName,
      timestamp: new Date().toISOString(),
    });
  }, [screenName]);
};

export const useSentryHealthData = () => {
  const healthData = useSelector((state: RootState) => state.health);
  
  useEffect(() => {
    if (healthData.lastFetchTime) {
      addBreadcrumb('Health data updated', 'health_data', {
        lastFetchTime: healthData.lastFetchTime,
        hasData: healthData.predictions.length > 0,
        timestamp: new Date().toISOString(),
      });
    }
  }, [healthData.lastFetchTime, healthData.predictions.length]);
};
