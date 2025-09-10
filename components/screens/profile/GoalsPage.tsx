import { UIText } from '@/content';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { GoalTile } from './GoalTile';

import {
    Spacing,
    Typography,
} from '@/constants';
import {
    BorderRadius,
    Colors,
    Elevation,
} from '@/constants/Colors';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


export function GoalsPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const goals = [
    {
      id: 'sleep',
      title: 'Sleep Quality',
      icon: '😴',
      currentValue: 7.5,
      targetValue: 8,
      unit: 'hours',
      streak: 5,
      coachTip: 'Try to go to bed at the same time every night and avoid screens 1 hour before sleep.',
      status: 'on-track' as const,
    },
    {
      id: 'steps',
      title: 'Daily Steps',
      icon: '👟',
      currentValue: 8500,
      targetValue: 10000,
      unit: 'steps',
      streak: 12,
      coachTip: 'Take a 10-minute walk after meals to boost your step count naturally.',
      status: 'behind' as const,
    },
    {
      id: 'water',
      title: 'Water Intake',
      icon: '💧',
      currentValue: 2.2,
      targetValue: 2.5,
      unit: 'liters',
      streak: 8,
      coachTip: 'Keep a water bottle with you and set hourly reminders to stay hydrated.',
      status: 'on-track' as const,
    },
    {
      id: 'bp-checks',
      title: 'Blood Pressure',
      icon: '❤️',
      currentValue: 3,
      targetValue: 4,
      unit: 'checks/week',
      streak: 2,
      coachTip: 'Measure BP at the same time daily, preferably in the morning before medication.',
      status: 'behind' as const,
    },
    {
      id: 'exercise',
      title: 'Exercise',
      icon: '🏃',
      currentValue: 4,
      targetValue: 5,
      unit: 'hours/week',
      streak: 3,
      coachTip: 'Mix cardio and strength training. Even 10-minute sessions count towards your goal!',
      status: 'behind' as const,
    },
  ];

  const handleGoalPress = (goalId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to goal details or edit screen
    console.log('Goal pressed:', goalId);
  };

  const handleAddGoal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to add goal screen
    console.log('Add new goal');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{UIText.goals.title}</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddGoal}
          >
            <Text style={[styles.addIcon, { color: colors.surface }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Stats */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>{UIText.goals.thisWeek}</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                {goals.filter(g => g.status === 'on-track').length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                On Track
              </Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryNumber, { color: colors.healthWatch }]}>
                {goals.filter(g => g.status === 'behind').length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Need Attention
              </Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryNumber, { color: colors.healthGood }]}>
                {Math.max(...goals.map(g => g.streak))}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Best Streak
              </Text>
            </View>
          </View>
        </View>

        {/* Goals List */}
        <View style={styles.goalsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{UIText.goals.yourGoals}</Text>
          {goals.map((goal) => (
            <GoalTile
              key={goal.id}
              title={goal.title}
              icon={goal.icon}
              currentValue={goal.currentValue}
              targetValue={goal.targetValue}
              unit={goal.unit}
              streak={goal.streak}
              coachTip={goal.coachTip}
              status={goal.status}
              onPress={() => handleGoalPress(goal.id)}
            />
          ))}
        </View>

        {/* Motivation Section */}
        <View style={[styles.motivationCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.motivationTitle, { color: colors.text }]}>
            💪 Keep Going!
          </Text>
          <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
            You&apos;re building healthy habits that will last a lifetime. Every small step counts towards your long-term health goals.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  title: {
    ...Typography.pageTitle,
    flex: 1,
    textAlign: 'center',
    marginLeft: -44, // Center the title
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Elevation.card,
  },
  summaryTitle: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryNumber: {
    ...Typography.pageTitle,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    ...Typography.caption,
    fontWeight: '500',
    textAlign: 'center',
  },
  goalsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  motivationCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Elevation.card,
  },
  motivationTitle: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  motivationText: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});
