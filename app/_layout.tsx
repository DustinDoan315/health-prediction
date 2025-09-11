import { ErrorBoundary, ThemeProvider } from '@/components';
import { initSentry } from '@/services';
import { AppInitializer } from '@/src/core/AppInitializer';
import { store } from '@/store/store';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';


initSentry();


function AppContent() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    initSentry();
    AppInitializer.initialize();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack initialRouteName="welcome">
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="health-prediction" options={{ headerShown: false }} />
        <Stack.Screen name="prediction-result" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="education" options={{ headerShown: false }} />
        <Stack.Screen name="health-goals-onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="health-logbook" options={{ headerShown: false }} />
        <Stack.Screen name="progress-milestones" options={{ headerShown: false }} />
        <Stack.Screen name="reminders" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </Provider>
    </GestureHandlerRootView>
  );
}
