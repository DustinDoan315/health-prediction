import { loadThemeFromStorage, setSystemTheme } from '@/store/slices';
import { useAppDispatch, useAppSelector, useColorScheme } from '@/hooks';
import { useEffect } from 'react';


export function useAppTheme() {
  const dispatch = useAppDispatch();
  const systemColorScheme = useColorScheme();
  const { mode, isDark } = useAppSelector((state) => state.theme);

  useEffect(() => {
    dispatch(loadThemeFromStorage());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSystemTheme(systemColorScheme === 'dark'));
  }, [dispatch, systemColorScheme]);

  if (mode === 'system') {
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }

  return isDark ? 'dark' : 'light';
}
