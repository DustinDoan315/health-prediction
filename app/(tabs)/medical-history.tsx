import {
  EmptyState,
  MedicalHistoryHeader,
  MedicalHistorySkeleton,
  PredictionItem
} from '@/components';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { HealthPrediction } from '@/services';
import { fetchPredictions } from '@/store/slices';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  Colors,
  Spacing,
} from '@/constants';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';


export default function MedicalHistoryScreen() {
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector(state => state.theme);
  const colors = Colors[isDark ? 'dark' : 'light'];
  const { predictions, stats, isLoading, predictionsLoaded } = useAppSelector(
    state => state.health
  );
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    if (!predictionsLoaded) {
      dispatch(fetchPredictions(50));
    }
  }, [dispatch, predictionsLoaded]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchPredictions(50));
    setRefreshing(false);
  }, [dispatch]);

  const handlePredictionPress = useCallback((prediction: HealthPrediction) => {
    router.push({
      pathname: '/prediction-result',
      params: { predictionId: prediction.id.toString() },
    });
  }, []);

  const handleAddPrediction = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/health-prediction');
  }, []);

  const filteredPredictions = useCallback(() => {
    let filtered = predictions;

    if (searchQuery) {
      filtered = filtered.filter(prediction =>
        prediction.recommendations?.some(rec =>
          rec.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        prediction.risk_level.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(prediction => prediction.risk_level === selectedFilter);
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [predictions, searchQuery, selectedFilter]);

  const renderPredictionItem = useCallback(
    ({ item }: { item: HealthPrediction }) => (
      <PredictionItem item={item} onPress={handlePredictionPress} />
    ),
    [handlePredictionPress]
  );

  const keyExtractor = useCallback(
    (item: HealthPrediction) => item.id.toString(),
    []
  );


  const filteredData = filteredPredictions();

  return (
    <View style={[styles.container]}>
      {isLoading && predictions.length === 0 ? (
        <MedicalHistorySkeleton />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderPredictionItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={
            <MedicalHistoryHeader
              totalPredictions={stats?.total_predictions || predictions.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              onAddPrediction={handleAddPrediction}
            />
          }
          contentContainerStyle={[
            styles.listContainer,
            { backgroundColor: colors.background },
            filteredData.length === 0 && styles.emptyListContainer,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={colors.surface}
            />
          }
          ListEmptyComponent={<EmptyState onAddPrediction={handleAddPrediction} />}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={8}
          initialNumToRender={4}
          getItemLayout={(data, index) => ({
            length: 320,
            offset: 320 * index,
            index,
          })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    // paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
