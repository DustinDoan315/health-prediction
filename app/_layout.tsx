import 'react-native-reanimated';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { store } from '@/store/store';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  <Stack initialRouteName="welcome">
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="health-prediction" options={{ headerShown: false }} />
          <Stack.Screen name="prediction-result" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
