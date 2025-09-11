import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  category: 'streak' | 'achievement' | 'goal' | 'challenge';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward?: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakType: string;
  lastActivity: Date;
}

const MILESTONES: Milestone[] = [
  {
    id: 'first_log',
    title: 'First Steps',
    description: 'Log your first health data',
    icon: '👶',
    progress: 1,
    maxProgress: 1,
    isCompleted: true,
    isUnlocked: true,
    category: 'achievement',
    rarity: 'common',
  },
  {
    id: 'week_streak',
    title: 'Weekly Warrior',
    description: 'Log data for 7 consecutive days',
    icon: '📅',
    progress: 5,
    maxProgress: 7,
    isCompleted: false,
    isUnlocked: true,
    category: 'streak',
    rarity: 'common',
  },
  {
    id: 'month_streak',
    title: 'Monthly Master',
    description: 'Log data for 30 consecutive days',
    icon: '🗓️',
    progress: 5,
    maxProgress: 30,
    isCompleted: false,
    isUnlocked: false,
    category: 'streak',
    rarity: 'rare',
  },
  {
    id: 'weight_loss',
    title: 'Weight Loss Champion',
    description: 'Lose 5kg from your starting weight',
    icon: '🏆',
    progress: 2,
    maxProgress: 5,
    isCompleted: false,
    isUnlocked: true,
    category: 'goal',
    rarity: 'epic',
  },
  {
    id: 'steps_master',
    title: 'Step Master',
    description: 'Walk 10,000 steps for 7 days',
    icon: '👟',
    progress: 3,
    maxProgress: 7,
    isCompleted: false,
    isUnlocked: true,
    category: 'challenge',
    rarity: 'rare',
  },
  {
    id: 'sleep_expert',
    title: 'Sleep Expert',
    description: 'Get 8+ hours of sleep for 14 days',
    icon: '😴',
    progress: 0,
    maxProgress: 14,
    isCompleted: false,
    isUnlocked: false,
    category: 'challenge',
    rarity: 'epic',
  },
  {
    id: 'health_guru',
    title: 'Health Guru',
    description: 'Complete all basic health assessments',
    icon: '🧘',
    progress: 4,
    maxProgress: 5,
    isCompleted: false,
    isUnlocked: true,
    category: 'achievement',
    rarity: 'legendary',
  },
];

const STREAK_DATA: StreakData = {
  currentStreak: 5,
  longestStreak: 12,
  streakType: 'Daily Logging',
  lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
};

const getRarityColor = (rarity: Milestone['rarity']): string => {
  switch (rarity) {
    case 'common': return '#6B7280';
    case 'rare': return '#3B82F6';
    case 'epic': return '#8B5CF6';
    case 'legendary': return '#F59E0B';
    default: return '#6B7280';
  }
};

const getRarityGradient = (rarity: Milestone['rarity']): string[] => {
  switch (rarity) {
    case 'common': return ['#6B7280', '#9CA3AF'];
    case 'rare': return ['#3B82F6', '#60A5FA'];
    case 'epic': return ['#8B5CF6', '#A78BFA'];
    case 'legendary': return ['#F59E0B', '#FBBF24'];
    default: return ['#6B7280', '#9CA3AF'];
  }
};

const MilestoneCard = ({ milestone, onPress }: { milestone: Milestone; onPress: () => void }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const rarityColor = getRarityColor(milestone.rarity);
  const gradientColors = getRarityGradient(milestone.rarity);
  
  const progressPercentage = (milestone.progress / milestone.maxProgress) * 100;
  const isLocked = !milestone.isUnlocked;

  return (
    <TouchableOpacity
      style={[
        styles.milestoneCard,
        {
          backgroundColor: isLocked ? colors.surface : colors.background,
          opacity: isLocked ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={milestone.isCompleted ? gradientColors as [string, string] : ['transparent', 'transparent']}
        style={styles.milestoneGradient}
      >
        <View style={styles.milestoneHeader}>
          <View style={[
            styles.milestoneIcon,
            { backgroundColor: milestone.isCompleted ? 'rgba(255, 255, 255, 0.2)' : colors.surface }
          ]}>
            <Text style={styles.milestoneIconText}>{milestone.icon}</Text>
          </View>
          
          <View style={styles.milestoneInfo}>
            <Text style={[
              styles.milestoneTitle,
              { color: milestone.isCompleted ? '#FFFFFF' : colors.text }
            ]}>
              {milestone.title}
            </Text>
            <Text style={[
              styles.milestoneDescription,
              { color: milestone.isCompleted ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary }
            ]}>
              {milestone.description}
            </Text>
          </View>

          {milestone.isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>✓</Text>
            </View>
          )}
        </View>

        {!milestone.isCompleted && !isLocked && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: rarityColor,
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {milestone.progress}/{milestone.maxProgress}
            </Text>
          </View>
        )}

        {isLocked && (
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockedText}>🔒</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const StreakCard = ({ streakData }: { streakData: StreakData }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <LinearGradient
      colors={['#3B82F6', '#60A5FA']}
      style={styles.streakCard}
    >
      <View style={styles.streakHeader}>
        <Text style={styles.streakIcon}>🔥</Text>
        <Text style={styles.streakTitle}>Current Streak</Text>
      </View>
      
      <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
      <Text style={styles.streakLabel}>days</Text>
      
      <View style={styles.streakStats}>
        <View style={styles.streakStat}>
          <Text style={styles.streakStatValue}>{streakData.longestStreak}</Text>
          <Text style={styles.streakStatLabel}>Best Streak</Text>
        </View>
        <View style={styles.streakStat}>
          <Text style={styles.streakStatValue}>{streakData.streakType}</Text>
          <Text style={styles.streakStatLabel}>Activity</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default function ProgressMilestonesScreen() {
  const [milestones, setMilestones] = useState<Milestone[]>(MILESTONES);
  const [streakData, setStreakData] = useState<StreakData>(STREAK_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | Milestone['category']>('all');
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const categories = [
    { key: 'all', label: 'All', icon: '🌟' },
    { key: 'streak', label: 'Streaks', icon: '🔥' },
    { key: 'achievement', label: 'Achievements', icon: '🏆' },
    { key: 'goal', label: 'Goals', icon: '🎯' },
    { key: 'challenge', label: 'Challenges', icon: '⚡' },
  ] as const;

  const filteredMilestones = selectedCategory === 'all' 
    ? milestones 
    : milestones.filter(m => m.category === selectedCategory);

  const completedCount = milestones.filter(m => m.isCompleted).length;
  const totalCount = milestones.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setTimeout(() => {
      setMilestones([...MILESTONES]);
      setStreakData({ ...STREAK_DATA });
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleMilestonePress = useCallback((milestone: Milestone) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (milestone.isCompleted) {
      // Show celebration animation
      return;
    }
    
    // Navigate to relevant screen or show details
    router.push('/health-logbook');
  }, []);

  const handleCategorySelect = useCallback((category: typeof categories[0]['key']) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category as any);
  }, []);

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshData}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Progress & Milestones
            </Text>
            <View style={styles.placeholder} />
          </View>

          <StreakCard streakData={streakData} />

          <View style={styles.progressOverview}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Overall Progress
            </Text>
            <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
              <Text style={styles.progressPercentage}>{Math.round(completionPercentage)}%</Text>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                {completedCount} of {totalCount} milestones completed
              </Text>
              <View style={styles.overallProgressBar}>
                <View 
                  style={[
                    styles.overallProgressFill,
                    { width: `${completionPercentage}%` }
                  ]} 
                />
              </View>
            </View>
          </View>

          <View style={styles.categoriesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Categories
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScrollContent}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: selectedCategory === category.key ? colors.primary : colors.surface,
                      borderColor: selectedCategory === category.key ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleCategorySelect(category.key)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryLabel,
                    { color: selectedCategory === category.key ? colors.surface : colors.text }
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.milestonesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Milestones
            </Text>
            
            {filteredMilestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onPress={() => handleMilestonePress(milestone)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.h1,
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  streakCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    ...Elevation.card,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  streakTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  streakNumber: {
    ...Typography.h1,
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 48,
  },
  streakLabel: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.lg,
  },
  streakStats: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  streakStat: {
    alignItems: 'center',
  },
  streakStatValue: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  streakStatLabel: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressOverview: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  progressCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Elevation.card,
  },
  progressPercentage: {
    ...Typography.h1,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  overallProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  categoriesSection: {
    marginBottom: Spacing.xl,
  },
  categoriesScrollContent: {
    paddingHorizontal: Spacing.sm,
  },
  categoryButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    marginHorizontal: Spacing.sm,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  categoryLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  milestonesSection: {
    marginBottom: Spacing.xl,
  },
  milestoneCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Elevation.card,
  },
  milestoneGradient: {
    padding: Spacing.lg,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  milestoneIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  milestoneIconText: {
    fontSize: 24,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  milestoneDescription: {
    ...Typography.caption,
    lineHeight: Typography.caption.lineHeight,
  },
  completedBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...Typography.caption,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  lockedText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
});
