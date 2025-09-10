import * as Haptics from 'expo-haptics';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
  } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { loadUser } from '@/store/slices/authSlice';
import { router } from 'expo-router';
import { UIText } from '@/content';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useEffect } from 'react';
import { WelcomeScreenSkeleton } from '@/components/WelcomeScreenSkeleton';

import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


export default function WelcomeScreen() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { isDark } = useAppSelector((state) => state.theme);
  const styles = createStyles(isDark ? 'dark' : 'light');

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
    router.push('/onboarding');
  };

  if (isLoading) {
    return <WelcomeScreenSkeleton />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <View style={styles.content}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>{UIText.welcome.appName}</Text>
              <Text style={styles.logoSubtext}>{UIText.welcome.tagline}</Text>
            </View>
          </View>

          {/* Main Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustration}>
              <Text style={styles.illustrationEmoji}>👩‍⚕️</Text>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{UIText.welcome.greeting}</Text>
            <Text style={styles.subtitle}>
              {UIText.welcome.subtitle}
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureText}>{UIText.welcome.features.aiAnalysis}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>{UIText.welcome.features.personalizedRisk}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💡</Text>
              <Text style={styles.featureText}>{UIText.welcome.features.smartRecommendations}</Text>
            </View>
          </View>

          {/* Get Started Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={handleGetStarted}
              activeOpacity={0.8}
              accessibilityLabel={UIText.welcome.getStarted}
              accessibilityRole="button"
              accessibilityHint="Navigate to authentication screen"
            >
              <LinearGradient
                colors={[Colors[isDark ? 'dark' : 'light'].gradientStart,
                  Colors[isDark ? 'dark' : 'light'].gradientEnd]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{UIText.welcome.getStarted}</Text>
                <Text style={styles.buttonIcon}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {UIText.welcome.termsText}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    background: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.xl * 2,
    },
    header: {
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    logoContainer: {
      alignItems: 'center',
    },
    logoText: {
      ...Typography.h1,
      color: colors.surface,
      marginBottom: Spacing.xs,
    },
    logoSubtext: {
      ...Typography.caption,
      color: colors.surface,
      opacity: 0.8,
      fontWeight: '500',
    },
    illustrationContainer: {
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    illustration: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    illustrationEmoji: {
      fontSize: 72,
    },
    titleSection: {
      marginBottom: Spacing.xl * 2,
    },
    title: {
      ...Typography.h1,
      color: colors.surface,
      marginBottom: Spacing.xl,
      textAlign: 'center',
    },
    subtitle: {
      ...Typography.body,
      color: colors.surface,
      opacity: 0.9,
      maxWidth: 320,

    },
    featuresContainer: {
      marginBottom: Spacing.xl * 2,
      justifyContent: 'center',
      textAlign: 'center',

    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.lg,
      paddingHorizontal: Spacing.xl,
    },
    featureIcon: {
      fontSize: 20,
      marginRight: Spacing.lg,
    },
    featureText: {
      ...Typography.body,
      color: colors.surface,
      opacity: 0.9,
      fontWeight: '500',
    },
    buttonContainer: {
      marginBottom: Spacing.xl * 2,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl * 2,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.xl,
      minWidth: 220,
      justifyContent: 'center',
      ...Elevation.modal,
    },
    buttonText: {
      ...Typography.button,
      fontSize: 20,
      marginRight: Spacing.sm,
      color: colors.surface,
    },
    buttonIcon: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.surface,
    },
    footer: {
      alignItems: 'center',
    },
    footerText: {
      ...Typography.caption,
      color: colors.surface,
      opacity: 0.7,
      textAlign: 'center',
    },
  });
};

