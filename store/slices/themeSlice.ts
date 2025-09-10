import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/src/core/services/StorageKeys';
import { storageService } from '@/src/core/services';


export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  isLoading: boolean;
}

const initialState: ThemeState = {
  mode: 'system',
  isDark: false,
  isLoading: true,
};


const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      if (action.payload !== 'system') {
        state.isDark = action.payload === 'dark';
      }
      storageService.setItem(STORAGE_KEYS.THEME_MODE, action.payload);
    },
    setSystemTheme: (state, action: PayloadAction<boolean>) => {
      if (state.mode === 'system') {
        state.isDark = action.payload;
      }
    },
    toggleTheme: (state) => {
      if (state.mode === 'system' || state.mode === 'light') {
        state.mode = 'dark';
        state.isDark = true;
      } else {
        state.mode = 'light';
        state.isDark = false;
      }
      storageService.setItem(STORAGE_KEYS.THEME_MODE, state.mode);
    },
    loadTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      if (action.payload !== 'system') {
        state.isDark = action.payload === 'dark';
      }
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setThemeMode, setSystemTheme, toggleTheme, loadTheme, setLoading } = themeSlice.actions;
export default themeSlice.reducer;

export const loadThemeFromStorage = () => async (dispatch: any) => {
  try {
    const savedTheme = storageService.getItem(STORAGE_KEYS.THEME_MODE);
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      dispatch(loadTheme(savedTheme as ThemeMode));
    } else {
      dispatch(loadTheme('system'));
    }
  } catch (error) {
    dispatch(loadTheme('system'));
  }
};
