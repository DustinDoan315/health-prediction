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
import { memo, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import { AnimatedCard } from '@/components/AnimatedCard';
import { HealthPrediction } from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { fetchPredictions } from '@/store/slices/healthSlice';
import { router } from 'expo-router';

const PredictionItem = memo(({ item, onPress }: { item: HealthPrediction; onPress: (prediction: HealthPrediction) => void }) => {
  const getRiskColor = useCallback((riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#9E9E9E';
    }
  }, []);

  const getRiskIcon = useCallback((riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '✅';
      case 'medium': return '⚠️';
      case 'high': return '❌';
      default: return '❓';
    }
  }, []);

  return (
    <AnimatedCard 
      style={styles.predictionCard}
      onPress={() => onPress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <Text style={styles.timeText}>
            {new Date(item.created_at).toLocaleTimeString()}
          </Text>
        </View>
        <View style={[styles.riskBadge, { backgroundColor: getRiskColor(item.risk_level) }]}>
          <Text style={styles.riskIcon}>{getRiskIcon(item.risk_level)}</Text>
          <Text style={styles.riskText}>{item.risk_level.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>BMI</Text>
            <Text style={styles.statValue}>{item.bmi.toFixed(1)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Risk Score</Text>
            <Text style={styles.statValue}>{(item.risk_score * 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Age</Text>
            <Text style={styles.statValue}>{item.age}</Text>
          </View>
        </View>

        {item.recommendations && item.recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Top Recommendation:</Text>
            <Text style={styles.recommendationText} numberOfLines={2}>
              {item.recommendations[0]}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.viewDetailsText}>Tap to view details →</Text>
        {item.ai_powered && (
          <View style={styles.aiTag}>
            <Text style={styles.aiTagText}>AI</Text>
          </View>
        )}
      </View>
    </AnimatedCard>
  );
});

export default function MedicalHistoryScreen() {
  const dispatch = useAppDispatch();
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

  const renderPredictionItem = useCallback(({ item }: { item: HealthPrediction }) => (
    <PredictionItem item={item} onPress={handlePredictionPress} />
  ), [handlePredictionPress]);

  const keyExtractor = useCallback((item: HealthPrediction) => item.id.toString(), []);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📊</Text>
      <Text style={styles.emptyTitle}>You don't have any records</Text>
      <Text style={styles.emptySubtitle}>
        Click the plus button to add your first health prediction
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => router.push('/health-prediction')}
      >
        <Text style={styles.emptyButtonText}>Create Prediction</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isAuthenticated) {
    return null; // Will redirect to welcome
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical History</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/health-prediction')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {isLoading && predictions.length === 0 ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} />
          <Text style={styles.loadingText}>Loading your health history...</Text>
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
              colors={['#667eea']}
              tintColor="#667eea"
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
    backgroundColor: '#f8f9fa',
    paddingBottom: Platform.OS === 'ios' ? 90 : 65,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  predictionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  riskIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  cardContent: {
    padding: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recommendationsContainer: {
    marginTop: 10,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  aiTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aiTagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
