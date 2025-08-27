import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import { loadUser } from '@/store/slices/authSlice';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';



const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already authenticated
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.background}
      >
        <View style={styles.content}>
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={[styles.illustration, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Text style={styles.illustrationEmoji}>👩‍⚕️</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Hello Beautiful</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your personal health assistant powered by AI. Get insights, predictions, and personalized recommendations for better health.
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.surface }]} 
            onPress={handleGetStarted}
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    marginTop: Spacing.sm,
  },
  illustrationContainer: {
    marginBottom: Spacing.xxl,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  title: {
    ...Typography.pageTitle,
    color: '#fff',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
    marginBottom: Spacing.xxl,
    maxWidth: 320,
  },
  button: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Elevation.modal,
    minWidth: 200,
  },
  buttonText: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    textAlign: 'center',
  },
});
