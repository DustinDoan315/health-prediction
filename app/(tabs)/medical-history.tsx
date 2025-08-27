import { AnimatedCard } from '@/components/AnimatedCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
} from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HealthPrediction } from '@/services/api';
import { fetchPredictions } from '@/store/slices/healthSlice';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import {
  memo,
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


const PredictionItem = memo(function PredictionItem({ item, onPress }: { item: HealthPrediction; onPress: (prediction: HealthPrediction) => void }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getRiskColor = useCallback((riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return colors.healthGood;
      case 'medium': return colors.healthWatch;
      case 'high': return colors.healthAttention;
      default: return colors.healthNeutral;
    }
  }, [colors]);

  const getRiskIcon = useCallback((riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '✅';
      case 'medium': return '⚠️';
      case 'high': return '❌';
      default: return '❓';
    }
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(item);
  };

  return (
    <AnimatedCard 
      style={[styles.predictionCard, { backgroundColor: colors.surface }] as any}
      onPress={handlePress}
    >
      <View style={[styles.cardHeader, { borderBottomColor: colors.background }]}>
        <View style={styles.dateContainer}>
          <Text style={[styles.dateText, { color: colors.text }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {new Date(item.created_at).toLocaleTimeString()}
          </Text>
        </View>
        <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.risk_level) }]}>
          <Text style={styles.riskIcon}>{getRiskIcon(item.risk_level)}</Text>
          <Text style={[styles.riskText, { color: colors.surface }]}>{item.risk_level.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>BMI</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{item.bmi.toFixed(1)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Risk Score</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{(item.risk_score * 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Age</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{item.age}</Text>
          </View>
        </View>

        {item.recommendations && item.recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={[styles.recommendationsTitle, { color: colors.text }]}>Top Recommendation:</Text>
            <Text style={[styles.recommendationText, { color: colors.textSecondary }]} numberOfLines={2}>
              {item.recommendations[0]}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.viewDetailsText, { color: colors.primary }]}>Tap to view details →</Text>
        {item.ai_powered && (
          <View style={[styles.aiTag, { backgroundColor: colors.primary }]}>
            <Text style={[styles.aiTagText, { color: colors.surface }]}>AI</Text>
          </View>
        )}
      </View>
    </AnimatedCard>
  );
});

export default function MedicalHistoryScreen() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { predictions, isLoading, predictionsLoaded } = useAppSelector((state) => state.health);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
      return;
    }
    
    // Only fetch if we haven't loaded predictions yet
    if (!predictionsLoaded) {
      dispatch(fetchPredictions(50));
    }
  }, [dispatch, isAuthenticated, predictionsLoaded]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchPredictions(50));
    setRefreshing(false);
  }, [dispatch]);

  const handlePredictionPress = useCallback((prediction: HealthPrediction) => {
    router.push({
      pathname: '/prediction-result',
      params: { predictionId: prediction.id.toString() }
    });
  }, []);

  const handleAddPrediction = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/health-prediction');
  }, []);

  const renderPredictionItem = useCallback(({ item }: { item: HealthPrediction }) => (
    <PredictionItem item={item} onPress={handlePredictionPress} />
  ), [handlePredictionPress]);

  const keyExtractor = useCallback((item: HealthPrediction) => item.id.toString(), []);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📊</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No health records yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Start tracking your health by creating your first assessment
      </Text>
      <TouchableOpacity 
        style={[styles.emptyButton, { backgroundColor: colors.primary }]}
        onPress={handleAddPrediction}
      >
        <Text style={[styles.emptyButtonText, { color: colors.surface }]}>Create Assessment</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isAuthenticated) {
    return null; // Will redirect to welcome
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Health History</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddPrediction}
        >
          <Text style={[styles.addButtonText, { color: colors.surface }]}>+</Text>
        </TouchableOpacity>
      </View>

      {isLoading && predictions.length === 0 ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading your health history...</Text>
        </View>
      ) : (
        <FlatList
          data={predictions}
          renderItem={renderPredictionItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.listContainer,
            predictions.length === 0 && styles.emptyListContainer
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={5}
          getItemLayout={(data, index) => ({
            length: 200,
            offset: 200 * index,
            index,
          })}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 90 : 65,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    ...Typography.pageTitle,
    fontWeight: '600',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  predictionCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Elevation.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    ...Typography.body,
    fontWeight: '600',
  },
  timeText: {
    ...Typography.meta,
    marginTop: 2,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  riskIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
    marginBottom: 4,
  },
  statValue: {
    ...Typography.sectionTitle,
    fontWeight: '700',
  },
  recommendationsContainer: {
    marginTop: Spacing.sm,
  },
  recommendationsTitle: {
    ...Typography.meta,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  recommendationText: {
    ...Typography.meta,
    lineHeight: Typography.meta.lineHeight,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  viewDetailsText: {
    ...Typography.meta,
    fontWeight: '500',
  },
  aiTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  aiTagText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Elevation.modal,
  },
  emptyButtonText: {
    ...Typography.body,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    ...Typography.body,
    textAlign: 'center',
  },
});
