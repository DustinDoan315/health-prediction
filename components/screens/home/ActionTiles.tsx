import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
} from '@/constants';
import { UIText } from '@/content';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  memo,
  useCallback,
  useEffect,
  useRef
} from 'react';

import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


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
  const tileLiftAnim = useRef(new Animated.Value(0)).current;
  const tileScaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(tileLiftAnim, {
        toValue: -4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(tileLiftAnim, {
        toValue: -6,
        tension: 200,
        friction: 15,
        useNativeDriver: true,
      }),
      Animated.spring(tileLiftAnim, {
        toValue: -4,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }),
    ]).start();
    
    Animated.sequence([
      Animated.timing(tileScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(tileScaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }),
    ]).start();
    
    action.onPress();
  };

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: tileLiftAnim },
          { scale: tileScaleAnim }
        ],
      }}
    >
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
  
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const containerScale = useRef(new Animated.Value(0.8)).current;

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
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(containerScale, {
        toValue: 1,
        tension: 400,
        friction: 25,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mood, isNewUser, containerOpacity, containerScale]);


  return (
    <Animated.View style={[
      styles.container,
      {
        opacity: containerOpacity,
        transform: [{ scale: containerScale }],
      }
    ]}>
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
    marginVertical: Spacing.xl,
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
