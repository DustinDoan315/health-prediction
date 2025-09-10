import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
  } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';


export type MoodValue = 'great' | 'good' | 'okay' | 'bad';

interface UserStatusCardProps {
  mood: MoodValue | null;
  isDark: boolean;
  isNewUser: boolean;
  userStats?: any;
}

const UserStatusCard = memo<UserStatusCardProps>(({ mood, isDark, isNewUser, userStats }) => {
  const colors = Colors[isDark ? 'dark' : 'light'];
  
  const fadeAnim = useSharedValue(1);
  const scaleAnim = useSharedValue(1);
  const slideAnim = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const liftAnim = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.12);

  const getMoodGradient = () => {
    switch (mood) {
      case 'great':
        return colors.moodGreatGradient;
      case 'good':
        return colors.moodGoodGradient;
      case 'okay':
        return colors.moodOkayGradient;
      case 'bad':
        return colors.moodBadGradient;
      default:
        return colors.moodGoodGradient;
    }
  };

  const getMoodContent = () => {
    if (isNewUser) {
      switch (mood) {
        case 'great':
          return {
            emoji: '🎉',
            title: 'Welcome to your health journey!',
            message: 'You\'re starting strong! Let\'s build healthy habits together.',
          };
        case 'good':
          return {
            emoji: '👋',
            title: 'Welcome aboard!',
            message: 'Great to have you here. Let\'s begin your wellness journey.',
          };
        case 'okay':
          return {
            emoji: '🤝',
            title: 'We\'re here to help',
            message: 'Starting your health journey can feel overwhelming. We\'ll guide you step by step.',
          };
        case 'bad':
          return {
            emoji: '💙',
            title: 'You\'re not alone',
            message: 'Taking the first step shows courage. We\'re here to support you every step of the way.',
          };
        default:
          return {
            emoji: '🌟',
            title: 'Welcome to Health Prediction!',
            message: 'Let\'s start your personalized health journey together.',
          };
      }
    } else {
      switch (mood) {
        case 'great':
          return {
            emoji: '🌟',
            title: 'You\'re doing amazing!',
            message: 'Keep up the great work! Your consistency is paying off.',
          };
        case 'good':
          return {
            emoji: '😊',
            title: 'Looking good!',
            message: 'You\'re maintaining healthy habits. Small steps lead to big changes.',
          };
        case 'okay':
          return {
            emoji: '🤗',
            title: 'It\'s okay to feel this way',
            message: 'Everyone has ups and downs. You\'re stronger than you think.',
          };
        case 'bad':
          return {
            emoji: '💙',
            title: 'We\'re here for you',
            message: 'Remember, it\'s okay to ask for help. You\'re not alone in this.',
          };
        default:
          return {
            emoji: '👋',
            title: 'Welcome back!',
            message: 'How are you feeling today? Let\'s continue your health journey.',
          };
      }
    }
  };

  const content = getMoodContent();
  const gradientColors = getMoodGradient();

  useEffect(() => {
    // Lift up animation sequence
    liftAnim.value = withSequence(
      withTiming(-8, { duration: 200 }), // Lift up
      withSpring(-12, { damping: 15, stiffness: 200 }), // Bounce higher
      withSpring(-8, { damping: 20, stiffness: 300 }) // Settle
    );
    
    // Shadow animation - deeper shadow when lifted
    shadowOpacity.value = withSequence(
      withTiming(0.24, { duration: 200 }),
      withSpring(0.32, { damping: 15, stiffness: 200 }),
      withSpring(0.24, { damping: 20, stiffness: 300 })
    );
    
    // Crossfade effect for content changes
    contentOpacity.value = withSequence(
      withTiming(0, { duration: 200 }),
      withTiming(1, { duration: 300 })
    );
    
    // Smooth entrance animation
    fadeAnim.value = withTiming(1, { duration: 400 });
    scaleAnim.value = withSpring(1, { 
      damping: 20, 
      stiffness: 300,
      mass: 0.8
    });
    slideAnim.value = withSpring(0, { 
      damping: 20, 
      stiffness: 300,
      mass: 0.8
    });
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [
      { scale: scaleAnim.value },
      { translateY: slideAnim.value + liftAnim.value }
    ],
    shadowOpacity: shadowOpacity.value,
    shadowOffset: { width: 0, height: Math.abs(liftAnim.value) + 8 },
    shadowRadius: Math.abs(liftAnim.value) + 16,
    elevation: Math.abs(liftAnim.value) + 8,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <LinearGradient
        colors={gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <Text style={styles.emoji}>{content.emoji}</Text>
          <Text style={styles.title}>
            {content.title}
          </Text>
          <Text style={styles.message}>
            {content.message}
          </Text>
          {isNewUser && (
            <View style={styles.newUserBadge}>
              <Text style={styles.badgeText}>New User</Text>
            </View>
          )}
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
});

UserStatusCard.displayName = 'UserStatusCard';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Elevation.card,
  },
  content: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  message: {
    ...Typography.body,
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: Spacing.sm,
  },
  newUserBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default UserStatusCard;
