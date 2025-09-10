# Storage Migration: Expo SecureStore → MMKV

## Overview

The app has been migrated from Expo SecureStore to MMKV for local storage. MMKV provides better performance, synchronous operations, and more flexibility for storing various data types.

## What Changed

### 1. Storage Service (`src/core/services/StorageService.ts`)
- **New**: Centralized storage service using MMKV
- **Features**: 
  - Synchronous operations (no async/await needed)
  - Support for strings, objects, booleans, numbers
  - Encryption enabled by default
  - Better performance than SecureStore

### 2. Storage Keys (`src/core/services/StorageKeys.ts`)
- **New**: Centralized storage key constants
- **Benefits**: 
  - Prevents typos in storage keys
  - Easy to manage all storage keys in one place
  - Type-safe storage key references

### 3. Theme Persistence (`store/slices/themeSlice.ts`)
- **Updated**: Now uses MMKV instead of SecureStore
- **Benefits**: 
  - Faster theme loading on app startup
  - Synchronous operations eliminate loading delays
  - Better error handling

### 4. API Service (`services/api.ts`)
- **Updated**: Token storage now uses MMKV
- **Benefits**: 
  - Faster token retrieval for API requests
  - Synchronous token operations
  - Consistent storage approach across the app

### 5. App Settings Service (`src/core/services/AppSettingsService.ts`)
- **New**: Comprehensive settings management
- **Features**: 
  - Structured settings with TypeScript interfaces
  - Default values handling
  - Partial updates support
  - Settings reset functionality

## Usage Examples

### Basic Storage Operations

```typescript
import { storageService } from '@/src/core/services';

// Store a string
storageService.setItem('key', 'value');

// Retrieve a string
const value = storageService.getItem('key');

// Store an object
storageService.setObject('user', { name: 'John', age: 30 });

// Retrieve an object
const user = storageService.getObject<User>('user');

// Store boolean/number
storageService.setBoolean('isEnabled', true);
storageService.setNumber('count', 42);
```

### Using Storage Keys

```typescript
import { STORAGE_KEYS } from '@/src/core/services';

// Use centralized keys
storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
storageService.setItem(STORAGE_KEYS.THEME_MODE, 'dark');
```

### App Settings Management

```typescript
import { appSettingsService } from '@/src/core/services';

// Get all settings
const settings = await appSettingsService.getSettings();

// Update notification settings
await appSettingsService.updateNotificationSettings({
  healthReminders: false,
  predictionUpdates: true,
});

// Update display settings
await appSettingsService.updateDisplaySettings({
  units: 'imperial',
  language: 'es',
});
```

## Migration Benefits

### Performance
- **Synchronous operations**: No more async/await for storage operations
- **Faster startup**: Theme and settings load instantly
- **Better UX**: No loading delays for stored data

### Developer Experience
- **Type safety**: TypeScript interfaces for all stored data
- **Centralized keys**: No more scattered storage key strings
- **Consistent API**: Same interface for all storage operations
- **Better error handling**: Structured error handling throughout

### Data Management
- **Encryption**: All data encrypted by default
- **Structured data**: Support for complex objects and types
- **Default values**: Built-in handling of missing data
- **Reset functionality**: Easy data clearing and reset

## Storage Structure

```
MMKV Storage Instance: 'health-prediction-storage'
├── auth_token: string
├── theme_mode: 'light' | 'dark' | 'system'
├── app_settings: AppSettings object
├── user_data: User object
├── notification_settings: NotificationSettings object
├── health_preferences: HealthPreferences object
└── ... (other keys as needed)
```

## Future Enhancements

The new storage system is designed to be extensible:

1. **Offline Data**: Store health predictions for offline access
2. **Cache Management**: Implement intelligent caching strategies
3. **Data Migration**: Easy migration between storage versions
4. **Analytics**: Track storage usage and performance
5. **Backup/Restore**: Export/import user data

## Testing

All storage operations are now synchronous, making testing easier:

```typescript
// Before (async)
const theme = await SecureStore.getItemAsync('theme');

// After (sync)
const theme = storageService.getItem(STORAGE_KEYS.THEME_MODE);
```

This eliminates the need for async/await in tests and makes the code more predictable.
