import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import healthSlice from './slices/healthSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    health: healthSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
