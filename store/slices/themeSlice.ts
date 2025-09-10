import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export const loadThemeFromStorage = createAsyncThunk(
  'theme/loadFromStorage',
  async () => {
    try {
      const savedTheme = await storageService.getItem(STORAGE_KEYS.THEME_MODE);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        return savedTheme as ThemeMode;
      }
      return 'system';
    } catch {
      return 'system';
    }
  }
);

export const setThemeModeAsync = createAsyncThunk(
  'theme/setMode',
  async (mode: ThemeMode) => {
    await storageService.setItem(STORAGE_KEYS.THEME_MODE, mode);
    return mode;
  }
);

export const toggleThemeAsync = createAsyncThunk(
  'theme/toggle',
  async (currentMode: ThemeMode) => {
    const newMode = currentMode === 'system' || currentMode === 'light' ? 'dark' : 'light';
    await storageService.setItem(STORAGE_KEYS.THEME_MODE, newMode);
    return newMode;
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setSystemTheme: (state, action: PayloadAction<boolean>) => {
      if (state.mode === 'system') {
        state.isDark = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadThemeFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadThemeFromStorage.fulfilled, (state, action) => {
        state.mode = action.payload;
        if (action.payload !== 'system') {
          state.isDark = action.payload === 'dark';
        }
        state.isLoading = false;
      })
      .addCase(loadThemeFromStorage.rejected, (state) => {
        state.mode = 'system';
        state.isDark = false;
        state.isLoading = false;
      })
      .addCase(setThemeModeAsync.fulfilled, (state, action) => {
        state.mode = action.payload;
        if (action.payload !== 'system') {
          state.isDark = action.payload === 'dark';
        }
      })
      .addCase(toggleThemeAsync.fulfilled, (state, action) => {
        state.mode = action.payload;
        state.isDark = action.payload === 'dark';
      });
  },
});

export const { setSystemTheme, setLoading } = themeSlice.actions;
export default themeSlice.reducer;
