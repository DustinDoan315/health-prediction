export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  
  // Theme
  THEME_MODE: 'theme_mode',
  
  // App Settings
  APP_SETTINGS: 'app_settings',
  NOTIFICATION_SETTINGS: 'notification_settings',
  
  // Health Data
  HEALTH_PREFERENCES: 'health_preferences',
  LAST_SYNC_TIME: 'last_sync_time',
  
  // Onboarding
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // Cache
  CACHE_TIMESTAMP: 'cache_timestamp',
  OFFLINE_DATA: 'offline_data',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
