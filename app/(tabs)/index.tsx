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
import { fetchHealthStats, fetchPredictions } from '@/store/slices/healthSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useCallback, useEffect } from 'react';

import { AnimatedCard } from '@/components/AnimatedCard';
import { LinearGradient } from 'expo-linear-gradient';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { router } from 'expo-router';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { stats, isLoading: healthLoading, statsLoaded, predictionsLoaded } = useAppSelector((state) => state.health);

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
    router.push('/health-prediction');
  }, []);

  const handleViewHistory = useCallback(() => {
    router.push('/(tabs)/medical-history');
  }, []);

  const handleChat = useCallback(() => {
    router.push('/(tabs)/chat');
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={healthLoading}
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi {user?.full_name?.split(' ')[0] || 'Julia'}!</Text>
            <Text style={styles.subtitle}>How are you feeling today?</Text>
          </View>
          <TouchableOpacity 
            style={styles.profilePic}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.profileEmoji}>👨‍⚕️</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        {stats && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Health Overview</Text>
            <View style={styles.statsGrid}>
              <AnimatedCard style={styles.statCard} delay={100}>
                <Text style={styles.statNumber}>{stats.total_predictions}</Text>
                <Text style={styles.statLabel}>Predictions</Text>
              </AnimatedCard>
              <AnimatedCard style={styles.statCard} delay={200}>
                <Text style={styles.statNumber}>{stats.average_risk_score.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Avg Risk</Text>
              </AnimatedCard>
              <AnimatedCard style={styles.statCard} delay={300}>
                <Text style={styles.statNumber}>{stats.risk_distribution.low}</Text>
                <Text style={styles.statLabel}>Low Risk</Text>
              </AnimatedCard>
            </View>
          </View>
        )}

        {/* Action Cards */}
        <View style={styles.actionsContainer}>
          <AnimatedCard style={styles.actionCard} onPress={handleViewHistory} delay={400}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.actionGradient}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>📋</Text>
              </View>
              <Text style={styles.actionTitle}>Medical History</Text>
              <Text style={styles.actionSubtitle}>View your health records</Text>
            </LinearGradient>
          </AnimatedCard>

          <AnimatedCard style={styles.actionCard} onPress={handleChat} delay={500}>
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.actionGradient}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>💬</Text>
              </View>
              <Text style={styles.actionTitle}>Online Chat</Text>
              <Text style={styles.actionSubtitle}>Get AI health advice</Text>
            </LinearGradient>
          </AnimatedCard>

          <AnimatedCard style={styles.actionCard} onPress={handleCreatePrediction} delay={600}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.actionGradient}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>🔍</Text>
              </View>
              <Text style={styles.actionTitle}>Health Check</Text>
              <Text style={styles.actionSubtitle}>Create new prediction</Text>
            </LinearGradient>
          </AnimatedCard>
        </View>

        {/* Create Prediction Button */}
        <AnimatedCard style={styles.createButton} onPress={handleCreatePrediction} delay={700}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.createButtonGradient}
          >
            <Text style={styles.createButtonText}>New Health Prediction</Text>
            <Text style={styles.createButtonIcon}>+</Text>
          </LinearGradient>
        </AnimatedCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 24,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  actionCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  createButton: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  createButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginRight: 10,
  },
  createButtonIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});