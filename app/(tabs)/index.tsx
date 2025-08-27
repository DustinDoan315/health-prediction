import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MetricCard } from '@/components/MetricCard';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
} from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fetchHealthStats, fetchPredictions } from '@/store/slices/healthSlice';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { stats, isLoading: healthLoading, statsLoaded, predictionsLoaded } = useAppSelector((state) => state.health);
  
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'bad' | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
      return;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user && !statsLoaded) {
      dispatch(fetchHealthStats());
    }
  }, [dispatch, isAuthenticated, user, statsLoaded]);

  useEffect(() => {
    if (isAuthenticated && user && !predictionsLoaded) {
      dispatch(fetchPredictions(10));
    }
  }, [dispatch, isAuthenticated, user, predictionsLoaded]);

  const handleCreatePrediction = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/health-prediction');
  }, []);

  const handleViewHistory = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile');
  }, []);

  const handleChat = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/chat');
  }, []);

  const handleMoodSelect = useCallback((selectedMood: typeof mood) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMood(selectedMood);
  }, []);

  const onRefresh = useCallback(async () => {
    if (isAuthenticated && user) {
      dispatch(fetchHealthStats());
      dispatch(fetchPredictions(10));
    }
  }, [dispatch, isAuthenticated, user]);

  if (!isAuthenticated) {
    return null; // Will redirect to welcome
  }

  if (authLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={healthLoading}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header with Search */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hi {user?.full_name?.split(' ')[0] || 'there'}!
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              How are you feeling today?
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.searchButton, { backgroundColor: colors.surface }]}
              onPress={() => {/* TODO: Implement search */}}
            >
              <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.profilePic, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/profile')}
            >
              <Text style={[styles.profileEmoji, { color: colors.surface }]}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Mood Check-in */}
        <View style={styles.moodContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today</Text>
          <View style={[styles.moodCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.moodQuestion, { color: colors.text }]}>
              How are you feeling today?
            </Text>
            <View style={styles.moodOptions}>
              {[
                { value: 'great', emoji: '😊', label: 'Great' },
                { value: 'good', emoji: '🙂', label: 'Good' },
                { value: 'okay', emoji: '😐', label: 'Okay' },
                { value: 'bad', emoji: '😔', label: 'Bad' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.moodOption,
                    { backgroundColor: mood === option.value ? colors.primary : colors.background },
                    mood === option.value && styles.moodOptionSelected,
                  ]}
                  onPress={() => handleMoodSelect(option.value as typeof mood)}
                >
                  <Text style={styles.moodEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    { color: mood === option.value ? colors.surface : colors.textSecondary }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Quick Action Tiles */}
        <View style={styles.actionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          
          <View style={styles.actionTiles}>
            <TouchableOpacity 
              style={[styles.actionTile, { backgroundColor: colors.surface }]}
              onPress={handleViewHistory}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <Text style={[styles.actionEmoji, { color: colors.surface }]}>📋</Text>
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Medical History</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                View your health records
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionTile, { backgroundColor: colors.surface }]}
              onPress={handleChat}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.actionEmoji, { color: colors.surface }]}>💬</Text>
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>AI Assistant</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                Get health advice
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionTile, { backgroundColor: colors.surface }]}
              onPress={handleCreatePrediction}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
                <Text style={[styles.actionEmoji, { color: colors.surface }]}>🔍</Text>
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>New Prediction</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                2-min checkup
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Metrics Overview */}
        {stats && (
          <View style={styles.metricsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Insights</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Total Predictions"
                value={stats.total_predictions}
                status="neutral"
                icon="📊"
              />
              <MetricCard
                title="Average Risk"
                value={stats.average_risk_score.toFixed(1)}
                unit=""
                status={stats.average_risk_score < 3 ? 'good' : stats.average_risk_score < 7 ? 'watch' : 'attention'}
                icon="⚠️"
              />
              <MetricCard
                title="Low Risk Count"
                value={stats.risk_distribution.low}
                status="good"
                icon="✅"
              />
            </View>
          </View>
        )}

        {/* Primary CTA */}
        <TouchableOpacity 
          style={[styles.primaryCTA, { backgroundColor: colors.primary }]}
          onPress={handleCreatePrediction}
        >
          <Text style={[styles.primaryCTAText, { color: colors.surface }]}>
            See my risk & plan
          </Text>
          <Text style={[styles.primaryCTAArrow, { color: colors.surface }]}>→</Text>
        </TouchableOpacity>
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
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.sm,
    ...Typography.body,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    ...Typography.pageTitle,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.card,
  },
  searchIcon: {
    fontSize: 20,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },
  moodContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    marginBottom: Spacing.md,
  },
  moodCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Elevation.card,
  },
  moodQuestion: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodOption: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 70,
  },
  moodOptionSelected: {
    ...Elevation.card,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    ...Typography.caption,
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
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
  actionTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    flex: 1,
  },
  actionSubtitle: {
    ...Typography.meta,
  },
  metricsContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  metricsGrid: {
    gap: Spacing.md,
  },
  primaryCTA: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.modal,
  },
  primaryCTAText: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  primaryCTAArrow: {
    fontSize: 24,
    fontWeight: '600',
  },
});