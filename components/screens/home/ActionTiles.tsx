import * as Haptics from 'expo-haptics';

import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
} from '@/constants';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { memo, useCallback, useEffect } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { UIText } from '@/content';
import { router } from 'expo-router';

export type MoodValue = 'great' | 'good' | 'okay' | 'bad';

interface ActionTileProps {
  action: {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    iconBg: string;
    onPress: () => void;
  };
  colors: any;
  index: number;
}

const ActionTile = memo<ActionTileProps>(({ action, colors, index }) => {
  const tileLiftAnim = useSharedValue(0);
  const tileShadowOpacity = useSharedValue(0.12);
  
  const tileAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tileLiftAnim.value }],
    shadowOpacity: tileShadowOpacity.value,
    shadowOffset: { width: 0, height: Math.abs(tileLiftAnim.value) + 4 },
    shadowRadius: Math.abs(tileLiftAnim.value) + 8,
    elevation: Math.abs(tileLiftAnim.value) + 4,
  }));

  const handlePress = () => {
    tileLiftAnim.value = withSequence(
      withTiming(-4, { duration: 100 }),
      withSpring(-6, { damping: 15, stiffness: 200 }),
      withSpring(-4, { damping: 20, stiffness: 300 })
    );
    
    tileShadowOpacity.value = withSequence(
      withTiming(0.20, { duration: 100 }),
      withSpring(0.24, { damping: 15, stiffness: 200 }),
      withSpring(0.20, { damping: 20, stiffness: 300 })
    );
    
    action.onPress();
  };

  return (
    <Animated.View
      entering={FadeIn.delay(index * 80).duration(350).springify()}
      exiting={FadeOut.duration(150)}
    >
      <Animated.View style={tileAnimatedStyle}>
        <TouchableOpacity 
          style={[styles.actionTile, { backgroundColor: colors.surface }]}
          onPress={handlePress}
        >
          <LinearGradient
            colors={[action.iconBg, action.iconBg + '80']}
            style={styles.actionIcon}
          >
            <Text style={[styles.actionEmoji, { color: colors.surface }]}>
              {action.icon}
            </Text>
          </LinearGradient>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>
              {action.title}
            </Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
              {action.subtitle}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
});

ActionTile.displayName = 'ActionTile';

interface ActionTilesProps {
  isDark: boolean;
  mood: MoodValue | null;
  isNewUser?: boolean;
}

const ActionTiles = memo<ActionTilesProps>(({ isDark, mood, isNewUser = false }) => {
  const colors = Colors[isDark ? 'dark' : 'light'];
  
  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const liftAnim = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.12);

  const handleViewHistory = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  }, []);

  const handleChat = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/chat');
  }, []);

  const handleCreatePrediction = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/health-prediction');
  }, []);

  const handleTrackExercise = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  }, []);

  const handleSetGoals = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  }, []);

  const handleHealthTips = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/chat');
  }, []);

  const handleEmergencyContacts = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  }, []);

  const getMoodBasedActions = () => {
    if (isNewUser) {
      switch (mood) {
        case 'great':
          return [
            {
              id: 'get-started',
              title: 'Get Started',
              subtitle: 'Complete your profile',
              icon: '🚀',
              iconBg: colors.success,
              onPress: handleViewHistory,
            },
            {
              id: 'first-prediction',
              title: 'First Prediction',
              subtitle: 'Try your first health check',
              icon: '🔍',
              iconBg: colors.primary,
              onPress: handleCreatePrediction,
            },
            {
              id: 'ai-assistant',
              title: 'Meet Your AI',
              subtitle: 'Ask questions',
              icon: '💬',
              iconBg: colors.secondary,
              onPress: handleChat,
            },
          ];
        case 'good':
          return [
            {
              id: 'setup-profile',
              title: 'Setup Profile',
              subtitle: 'Tell us about yourself',
              icon: '👤',
              iconBg: colors.primary,
              onPress: handleViewHistory,
            },
            {
              id: 'ai-assistant',
              title: 'AI Assistant',
              subtitle: 'Get personalized help',
              icon: '💬',
              iconBg: colors.secondary,
              onPress: handleChat,
            },
            {
              id: 'first-prediction',
              title: 'Health Check',
              subtitle: 'Start your journey',
              icon: '🔍',
              iconBg: colors.success,
              onPress: handleCreatePrediction,
            },
          ];
        case 'okay':
          return [
            {
              id: 'ai-assistant',
              title: 'Get Support',
              subtitle: 'We\'re here to help',
              icon: '💬',
              iconBg: colors.secondary,
              onPress: handleChat,
            },
            {
              id: 'setup-profile',
              title: 'Setup Profile',
              subtitle: 'Take your time',
              icon: '👤',
              iconBg: colors.primary,
              onPress: handleViewHistory,
            },
            {
              id: 'health-tips',
              title: 'Health Tips',
              subtitle: 'Gentle guidance',
              icon: '💡',
              iconBg: colors.warning,
              onPress: handleHealthTips,
            },
          ];
        case 'bad':
          return [
            {
              id: 'ai-assistant',
              title: 'Talk to AI',
              subtitle: 'Emotional support',
              icon: '💬',
              iconBg: colors.secondary,
              onPress: handleChat,
            },
            {
              id: 'emergency-contacts',
              title: 'Emergency Help',
              subtitle: 'Get help now',
              icon: '🚨',
              iconBg: colors.error,
              onPress: handleEmergencyContacts,
            },
            {
              id: 'wellness-resources',
              title: 'Resources',
              subtitle: 'Mental health help',
              icon: '🆘',
              iconBg: colors.warning,
              onPress: handleHealthTips,
            },
          ];
        default:
          return [
            {
              id: 'ai-assistant',
              title: 'Meet Your AI',
              subtitle: 'Start a conversation',
              icon: '💬',
              iconBg: colors.secondary,
              onPress: handleChat,
            },
            {
              id: 'setup-profile',
              title: 'Setup Profile',
              subtitle: 'Tell us about yourself',
              icon: '👤',
              iconBg: colors.primary,
              onPress: handleViewHistory,
            },
            {
              id: 'first-prediction',
              title: 'Health Check',
              subtitle: 'Start your journey',
              icon: '🔍',
              iconBg: colors.success,
              onPress: handleCreatePrediction,
            },
          ];
      }
    } else {
      switch (mood) {
        case 'great':
          return [
            {
              id: 'track-exercise',
              title: 'Track Exercise',
              subtitle: 'Log your workout',
              icon: '🏃‍♂️',
              iconBg: colors.success,
              onPress: handleTrackExercise,
            },
            {
              id: 'set-goals',
              title: 'Set Health Goals',
              subtitle: 'Create new targets',
              icon: '🎯',
              iconBg: colors.primary,
              onPress: handleSetGoals,
            },
            {
              id: 'ai-assistant',
              title: UIText.actions.aiAssistant,
              subtitle: UIText.actions.aiAssistantSubtitle,
              icon: '💬',
              iconBg: colors.secondary,
              onPress: handleChat,
            },
          ];
      case 'good':
        return [
          {
            id: 'medical-history',
            title: UIText.actions.medicalHistory,
            subtitle: UIText.actions.medicalHistorySubtitle,
            icon: '📋',
            iconBg: colors.primary,
            onPress: handleViewHistory,
          },
          {
            id: 'ai-assistant',
            title: UIText.actions.aiAssistant,
            subtitle: UIText.actions.aiAssistantSubtitle,
            icon: '💬',
            iconBg: colors.secondary,
            onPress: handleChat,
          },
          {
            id: 'new-prediction',
            title: UIText.actions.newPrediction,
            subtitle: UIText.actions.newPredictionSubtitle,
            icon: '🔍',
            iconBg: colors.success,
            onPress: handleCreatePrediction,
          },
        ];
      case 'okay':
        return [
          {
            id: 'health-tips',
            title: 'Health Tips',
            subtitle: 'Wellness guidance',
            icon: '💡',
            iconBg: colors.warning,
            onPress: handleHealthTips,
          },
          {
            id: 'ai-assistant',
            title: UIText.actions.aiAssistant,
            subtitle: 'Get support',
            icon: '💬',
            iconBg: colors.secondary,
            onPress: handleChat,
          },
          {
            id: 'medical-history',
            title: UIText.actions.medicalHistory,
            subtitle: UIText.actions.medicalHistorySubtitle,
            icon: '📋',
            iconBg: colors.primary,
            onPress: handleViewHistory,
          },
        ];
      case 'bad':
        return [
          {
            id: 'emergency-contacts',
            title: 'Emergency Contacts',
            subtitle: 'Get help now',
            icon: '🚨',
            iconBg: colors.error,
            onPress: handleEmergencyContacts,
          },
          {
            id: 'ai-assistant',
            title: 'Talk to AI',
            subtitle: 'Emotional support',
            icon: '💬',
            iconBg: colors.secondary,
            onPress: handleChat,
          },
          {
            id: 'wellness-resources',
            title: 'Wellness Resources',
            subtitle: 'Mental health help',
            icon: '🆘',
            iconBg: colors.warning,
            onPress: handleHealthTips,
          },
        ];
      default:
        return [
          {
            id: 'ai-assistant',
            title: UIText.actions.aiAssistant,
            subtitle: 'Start a conversation',
            icon: '💬',
            iconBg: colors.secondary,
            onPress: handleChat,
          },
          {
            id: 'medical-history',
            title: UIText.actions.medicalHistory,
            subtitle: UIText.actions.medicalHistorySubtitle,
            icon: '📋',
            iconBg: colors.primary,
            onPress: handleViewHistory,
          },
          {
            id: 'new-prediction',
            title: UIText.actions.newPrediction,
            subtitle: UIText.actions.newPredictionSubtitle,
            icon: '🔍',
            iconBg: colors.success,
            onPress: handleCreatePrediction,
          },
        ];
      }
    }
  };

  const actions = getMoodBasedActions();

  useEffect(() => {
    // Lift up animation sequence
    liftAnim.value = withSequence(
      withTiming(-6, { duration: 200 }), // Lift up
      withSpring(-10, { damping: 15, stiffness: 200 }), // Bounce higher
      withSpring(-6, { damping: 20, stiffness: 300 }) // Settle
    );
    
    // Shadow animation - deeper shadow when lifted
    shadowOpacity.value = withSequence(
      withTiming(0.20, { duration: 200 }),
      withSpring(0.28, { damping: 15, stiffness: 200 }),
      withSpring(0.20, { damping: 20, stiffness: 300 })
    );
    
    containerOpacity.value = withTiming(1, { duration: 300 });
    containerScale.value = withSpring(1, { 
      damping: 25, 
      stiffness: 400,
      mass: 0.6
    });
  }, [mood, isNewUser]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [
      { scale: containerScale.value },
      { translateY: liftAnim.value }
    ],
    shadowOpacity: shadowOpacity.value,
    shadowOffset: { width: 0, height: Math.abs(liftAnim.value) + 8 },
    shadowRadius: Math.abs(liftAnim.value) + 16,
    elevation: Math.abs(liftAnim.value) + 8,
  }));


  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {UIText.home.quickActions}
      </Text>
      <View style={styles.actionTiles}>
        {actions.map((action, index) => (
          <ActionTile
            key={action.id}
            action={action}
            colors={colors}
            index={index}
          />
        ))}
      </View>
    </Animated.View>
  );
});

ActionTiles.displayName = 'ActionTiles';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  actionTiles: {
    gap: Spacing.md,
  },
  actionTile: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Elevation.card,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  actionSubtitle: {
    ...Typography.caption,
  },
});

export default ActionTiles;
