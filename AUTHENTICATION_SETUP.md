# Authentication System Setup

## Overview

The app now uses an automatic authentication wrapper that eliminates the need to manually check authentication status in individual screens.

## How It Works

The `AuthWrapper` component in `components/AuthWrapper.tsx` automatically:

1. **Initializes authentication state** when the app starts by dispatching `loadUser()`
2. **Monitors route changes** using `useSegments()` to detect when users navigate to protected routes
3. **Automatically redirects** unauthenticated users to the welcome screen
4. **Handles loading states** while authentication is being checked

## Protected Routes

The following routes are automatically protected:
- `(tabs)` - All tab screens (index, chat, medical-history, settings)
- `health-prediction` - Health prediction form
- `prediction-result` - Prediction results display
- `profile` - User profile

## Public Routes

These routes are accessible without authentication:
- `welcome` - Welcome/landing page
- `auth` - Login/registration screen
- `+not-found` - 404 error page

## Implementation

### Root Layout (`app/_layout.tsx`)

```tsx
import { AuthWrapper } from '@/components/AuthWrapper';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthWrapper>
          <Stack initialRouteName="welcome">
            {/* All your screens here */}
          </Stack>
        </AuthWrapper>
      </ThemeProvider>
    </Provider>
  );
}
```

### Individual Screens

**Before (old way):**
```tsx
export default function SomeScreen() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
      return;
    }
  }, [isAuthenticated]);
  
  // Screen content...
}
```

**After (new way):**
```tsx
export default function SomeScreen() {
  // No authentication check needed!
  // Screen content...
}
```

## Benefits

1. **DRY Principle** - No more repeated authentication logic
2. **Centralized Control** - All auth logic in one place
3. **Automatic Updates** - Changes to auth logic automatically apply to all screens
4. **Cleaner Code** - Individual screens focus on their core functionality
5. **Better UX** - Consistent authentication behavior across the app

## Adding New Protected Routes

To add a new protected route, simply add it to the `inAuthGroup` check in `AuthWrapper.tsx`:

```tsx
const inAuthGroup = segments[0] === '(tabs)' || 
                   segments[0] === 'health-prediction' || 
                   segments[0] === 'prediction-result' || 
                   segments[0] === 'profile' ||
                   segments[0] === 'your-new-route'; // Add here
```

## Customization

You can customize the authentication behavior by modifying the `AuthWrapper` component:

- Change the redirect destination
- Add custom loading states
- Implement different auth strategies
- Add route-specific permissions

## Troubleshooting

If authentication isn't working:

1. Check that `AuthWrapper` is properly imported and used in `_layout.tsx`
2. Verify that the Redux store is properly configured
3. Ensure that `loadUser` action is working correctly
4. Check that the auth slice is properly connected to the store
