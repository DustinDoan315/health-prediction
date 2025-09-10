import * as Haptics from 'expo-haptics';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
  } from '@/constants';
import { memo, useCallback } from 'react';
import { router } from 'expo-router';
import { UIText } from '@/content';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


interface ActionTilesProps {
  isDark: boolean;
}

const ActionTiles = memo<ActionTilesProps>(({ isDark }) => {
  const colors = Colors[isDark ? 'dark' : 'light'];

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

  const actions = [
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

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {UIText.home.quickActions}
      </Text>
      <View style={styles.actionTiles}>
        {actions.map((action) => (
          <TouchableOpacity 
            key={action.id}
            style={[styles.actionTile, { backgroundColor: colors.surface }]}
            onPress={action.onPress}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.iconBg }]}>
              <Text style={[styles.actionEmoji, { color: colors.surface }]}>
                {action.icon}
              </Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                {action.title}
              </Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                {action.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
