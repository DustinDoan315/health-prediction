import { OnboardingSkeleton } from '@/components/OnboardingSkeleton';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
} from '@/constants';
import { UIText } from '@/content';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import { loadUser } from '@/store/slices/authSlice';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


const { width: screenWidth } = Dimensions.get('window');

const ONBOARDING_SCREENS = [
  {
    id: 'welcome',
    emoji: '👋',
    content: UIText.onboarding.welcome,
  },
  {
    id: 'aiAnalysis',
    emoji: '🤖',
    content: UIText.onboarding.aiAnalysis,
  },
  {
    id: 'riskAssessment',
    emoji: '📊',
    content: UIText.onboarding.riskAssessment,
  },
  {
    id: 'smartRecommendations',
    emoji: '💡',
    content: UIText.onboarding.smartRecommendations,
  },
  {
    id: 'privacy',
    emoji: '🔒',
    content: UIText.onboarding.privacy,
  },
  {
    id: 'getStarted',
    emoji: '🚀',
    content: UIText.onboarding.getStarted,
  },
];

export default function OnboardingScreen() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme ?? 'light');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const animateToNext = (direction: 'next' | 'previous') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const targetValue = direction === 'next' ? -screenWidth : screenWidth;
    
    Animated.timing(slideAnim, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(direction === 'next' ? currentIndex + 1 : currentIndex - 1);
      slideAnim.setValue(0);
      setIsAnimating(false);
    });
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SCREENS.length - 1) {
      animateToNext('next');
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      animateToNext('previous');
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/auth');
  };

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/auth');
  };

  const handleSignIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/auth');
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isAnimating) return;
      slideAnim.setValue(event.translationX);
    })
    .onEnd((event) => {
      if (isAnimating) return;
      
      const threshold = screenWidth * 0.3;
      const translation = event.translationX;
      
      if (translation > threshold && currentIndex > 0) {
        animateToNext('previous');
      } else if (translation < -threshold && currentIndex < ONBOARDING_SCREENS.length - 1) {
        animateToNext('next');
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    });

  if (isLoading) {
    return <OnboardingSkeleton />;
  }

  const currentScreen: any = ONBOARDING_SCREENS[currentIndex] ?? ONBOARDING_SCREENS[0];
  const isLastScreen = currentIndex === ONBOARDING_SCREENS.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.content, { transform: [{ translateX: slideAnim }] }]}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              {ONBOARDING_SCREENS.map((screen, index) => (
                <View
                  key={screen.id}
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: index <= currentIndex 
                        ? Colors[colorScheme ?? 'light'].surface 
                        : 'rgba(255, 255, 255, 0.3)',
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Skip Button */}
          {!isLastScreen && (
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
              accessibilityLabel={UIText.onboarding.skip}
              accessibilityRole="button"
            >
              <Text style={styles.skipText}>{UIText.onboarding.skip}</Text>
            </TouchableOpacity>
          )}

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Emoji/Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>{currentScreen.emoji}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{currentScreen.content.title}</Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>{currentScreen.content.subtitle}</Text>
            
            {/* Description */}
            <Text style={styles.description}>{currentScreen.content.description}</Text>

            {/* Features List (for screens that have them) */}
            {currentScreen.content.features && (
              <View style={styles.featuresContainer}>
                {currentScreen.content.features.map((feature: any, index: number) => (
                  <View key={`${currentScreen.id}-feature-${index}`} style={styles.featureItem}>
                    <Text style={styles.featureBullet}>•</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {isLastScreen ? (
              <View style={styles.finalButtons}>
                <TouchableOpacity
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                  accessibilityLabel={currentScreen.content.startJourney}
                  accessibilityRole="button"
                  style={styles.primaryButton}
                >
                  <LinearGradient
                    colors={[Colors[colorScheme ?? 'light'].gradientStart,
                      Colors[colorScheme ?? 'light'].gradientEnd]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.primaryButtonText}>
                      {currentScreen.content.startJourney}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSignIn}
                  activeOpacity={0.8}
                  accessibilityLabel={currentScreen.content.signIn}
                  accessibilityRole="button"
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>
                    {currentScreen.content.signIn}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.navigationButtons}>
                {currentIndex > 0 && (
                  <TouchableOpacity
                    onPress={handlePrevious}
                    activeOpacity={0.8}
                    accessibilityLabel={UIText.onboarding.previous}
                    accessibilityRole="button"
                    style={styles.previousButton}
                  >
                    <Text style={styles.previousButtonText}>
                      {UIText.onboarding.previous}
                    </Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  onPress={handleNext}
                  activeOpacity={0.8}
                  accessibilityLabel={currentScreen.content.next}
                  accessibilityRole="button"
                  style={styles.nextButton}
                >
                  <LinearGradient
                    colors={[Colors[colorScheme ?? 'light'].gradientStart,
                      Colors[colorScheme ?? 'light'].gradientEnd]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.nextButtonText}>
                      {currentScreen.content.next}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.xl,
    },
    progressContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    progressBar: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    skipButton: {
      position: 'absolute',
      top: Spacing.xl,
      right: Spacing.xxl,
      zIndex: 1,
    },
    skipText: {
      ...Typography.caption,
      color: colors.surface,
      opacity: 0.8,
      fontWeight: '500',
    },
    mainContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      marginBottom: Spacing.xl * 2,
    },
    iconEmoji: {
      fontSize: 72,
    },
    title: {
      ...Typography.h1,
      color: colors.surface,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    subtitle: {
      ...Typography.h3,
      color: colors.surface,
      opacity: 0.9,
      textAlign: 'center',
      marginBottom: Spacing.lg,
      fontWeight: '600',
    },
    description: {
      ...Typography.body,
      color: colors.surface,
      opacity: 0.8,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: Spacing.xl * 2,
      maxWidth: 320,
    },
    featuresContainer: {
      width: '100%',
      maxWidth: 300,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: Spacing.md,
    },
    featureBullet: {
      ...Typography.body,
      color: colors.surface,
      marginRight: Spacing.md,
      fontSize: 16,
    },
    featureText: {
      ...Typography.body,
      color: colors.surface,
      opacity: 0.9,
      flex: 1,
      lineHeight: 22,
    },
    buttonContainer: {
      paddingBottom: Spacing.xl,
    },
    finalButtons: {
      gap: Spacing.lg,
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    primaryButton: {
      borderRadius: BorderRadius.xl,
      ...Elevation.modal,
    },
    gradientButton: {
      paddingHorizontal: Spacing.xl * 2,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButtonText: {
      ...Typography.button,
      fontSize: 18,
      color: colors.surface,
      fontWeight: '600',
    },
    secondaryButton: {
      paddingHorizontal: Spacing.xl * 2,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.xl,
      borderWidth: 2,
      borderColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      ...Typography.button,
      fontSize: 16,
      color: colors.surface,
      fontWeight: '500',
    },
    previousButton: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.xl,
      borderWidth: 2,
      borderColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 100,
      marginRight: Spacing.xxl,
    },
    previousButtonText: {
      ...Typography.button,
      fontSize: 16,
      color: colors.surface,
      fontWeight: '500',
    },
    nextButton: {
      borderRadius: BorderRadius.xl,
      ...Elevation.modal,
      minWidth: 120,
    },
    nextButtonText: {
      ...Typography.button,
      fontSize: 16,
      color: colors.surface,
      fontWeight: '600',
    },
  });
};
