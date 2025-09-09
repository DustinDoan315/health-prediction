import { Colors } from '@/constants/Colors';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ErrorBoundary } from '@/components';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initSentry } from '@/services';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { store } from '@/store/store';
import { useColorScheme } from '@/hooks';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';



initSentry();

// Custom theme that uses app's purple color scheme consistently
const CustomTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary, // #6C63FF
    background: Colors.light.background, // #F7F8FA
    card: Colors.light.surface, // #FFFFFF
    text: Colors.light.text, // #111827
    border: '#E5E7EB',
    notification: Colors.light.error, // #FF5252
  },
};

// Custom dark theme that also uses purple but with dark backgrounds
const CustomDarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.dark.primary, // #8B85FF
    background: Colors.dark.background, // #111827
    card: Colors.dark.surface, // #1F2937
    text: Colors.dark.text, // #F9FAFB
    border: '#374151',
    notification: Colors.dark.error, // #F87171
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    initSentry();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomTheme}>
            <Stack initialRouteName="welcome">
              <Stack.Screen name="welcome" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="health-prediction" options={{ headerShown: false }} />
              <Stack.Screen name="prediction-result" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
