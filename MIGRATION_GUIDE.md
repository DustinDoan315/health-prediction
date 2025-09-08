# Clean Architecture Migration Guide

## Overview

This guide outlines the migration from the current Redux-based architecture to Clean Architecture with MVVM pattern.

## Architecture Comparison

### Before (Legacy)
```
/app              → Screens with Redux
/components       → UI components
/services         → Direct API calls
/store/slices     → Redux state management
```

### After (Clean Architecture)
```
/src
├── /domain       → Business logic (entities, use cases, repositories)
├── /data         → Data layer (API implementations)
├── /presentation → UI layer (viewmodels, components)
└── /core         → Cross-cutting concerns (DI)
```

## Migration Steps

### 1. Initialize Clean Architecture

```typescript
// In app/_layout.tsx
import { AppInitializer } from '@/src/core';

// Initialize DI container
AppInitializer.initialize();
```

### 2. Migrate Screens

#### Before (Redux)
```typescript
// app/auth.tsx
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loginUser } from '@/store/slices/authSlice';

export default function AuthScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const handleLogin = () => {
    dispatch(loginUser({ username, password }));
  };
}
```

#### After (Clean Architecture)
```typescript
// src/presentation/screens/AuthScreen.tsx
import { useAuthViewModel } from '../viewmodels';

export default function AuthScreen() {
  const { state, login } = useAuthViewModel();
  
  const handleLogin = () => {
    login(username, password);
  };
}
```

### 3. Migrate Components

#### Before (Direct API calls)
```typescript
// components/HealthForm.tsx
import { apiService } from '@/services/api';

const handleSubmit = async () => {
  const result = await apiService.createHealthPrediction(data);
};
```

#### After (ViewModels)
```typescript
// src/presentation/components/HealthForm.tsx
import { useHealthViewModel } from '../viewmodels';

const { createPrediction } = useHealthViewModel();

const handleSubmit = async () => {
  const result = await createPrediction(data);
};
```

### 4. Migrate Services

#### Before (Direct API service)
```typescript
// services/api.ts
export class ApiService {
  async createHealthPrediction(data) {
    return await this.api.post('/health/predict', data);
  }
}
```

#### After (Repository pattern)
```typescript
// src/data/repositories/HealthRepository.ts
export class HealthRepository implements IHealthRepository {
  async createPrediction(data: HealthPredictionRequest): Promise<IHealthPrediction> {
    const response = await this.apiService.post('/health/predict', data);
    return HealthPrediction.fromApiResponse(response);
  }
}
```

## Benefits of Migration

### 1. Testability
- **Before**: Hard to test Redux slices and API calls
- **After**: Easy to mock repositories and use cases

### 2. Maintainability
- **Before**: Business logic scattered across components
- **After**: Centralized in use cases and domain entities

### 3. Scalability
- **Before**: Tight coupling between UI and data
- **After**: Loose coupling with dependency injection

### 4. Performance
- **Before**: Global state updates affect entire app
- **After**: Local state management with ViewModels

## Migration Timeline

### Phase 1: Setup (Week 1)
- [x] Create clean architecture structure
- [x] Implement dependency injection
- [x] Create domain entities and use cases
- [x] Implement repository interfaces

### Phase 2: Data Layer (Week 2)
- [x] Implement repository classes
- [x] Create API service abstraction
- [x] Add data mapping utilities

### Phase 3: Presentation Layer (Week 3)
- [x] Create ViewModels
- [x] Migrate auth screen
- [x] Create reusable components

### Phase 4: Migration (Week 4-6)
- [ ] Migrate remaining screens
- [ ] Migrate components
- [ ] Remove Redux dependencies
- [ ] Update tests

### Phase 5: Cleanup (Week 7)
- [ ] Remove legacy code
- [ ] Update documentation
- [ ] Performance optimization

## Best Practices

### 1. Gradual Migration
- Migrate one screen at a time
- Keep both architectures running in parallel
- Test thoroughly before removing legacy code

### 2. Dependency Injection
- Always use DI container for dependencies
- Register services at app startup
- Use interface-based dependencies

### 3. Error Handling
- Transform API errors to domain errors
- Handle errors in ViewModels
- Provide user-friendly error messages

### 4. State Management
- Use ViewModels for local state
- Avoid global state when possible
- Optimize with React.memo and useCallback

## Common Pitfalls

### 1. Mixing Architectures
- Don't call Redux from ViewModels
- Don't use legacy services in new code
- Keep clean separation of concerns

### 2. Over-engineering
- Start simple, add complexity gradually
- Don't create unnecessary abstractions
- Focus on business value

### 3. Performance Issues
- Use React.memo for expensive components
- Optimize ViewModels with useCallback
- Avoid unnecessary re-renders

## Testing Strategy

### Unit Tests
- Test use cases with mocked repositories
- Test ViewModels with mocked use cases
- Test domain entities and validation

### Integration Tests
- Test repository implementations
- Test API service integration
- Test end-to-end user flows

### Migration Tests
- Compare behavior between old and new
- Test edge cases and error scenarios
- Validate performance improvements
