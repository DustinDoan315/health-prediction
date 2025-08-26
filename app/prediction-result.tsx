import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useEffect, useRef } from 'react';

import { HealthPrediction } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchPredictionById } from '@/store/slices/healthSlice';

const { width } = Dimensions.get('window');

export default function PredictionResultScreen() {
  const { predictionId } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { currentPrediction, isLoading } = useAppSelector((state) => state.health);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const hasLoadedPrediction = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
      return;
    }

    const id = parseInt(predictionId as string);
    if (predictionId && !hasLoadedPrediction.current) {
      // Check if we already have the correct prediction
      if (currentPrediction && currentPrediction.id === id) {
        hasLoadedPrediction.current = true;
        return;
      }
      
      // Only fetch if we don't have the prediction or it's different
      if (!currentPrediction || currentPrediction.id !== id) {
        hasLoadedPrediction.current = true;
        dispatch(fetchPredictionById(id));
      }
    }
  }, [dispatch, predictionId, isAuthenticated, currentPrediction]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return ['#4CAF50', '#66BB6A'];
      case 'medium': return ['#FF9800', '#FFB74D'];
      case 'high': return ['#F44336', '#EF5350'];
      default: return ['#9E9E9E', '#BDBDBD'];
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '✅';
      case 'medium': return '⚠️';
      case 'high': return '❌';
      default: return '❓';
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const handleNewPrediction = () => {
    router.push('/health-prediction');
  };

  const handleBackToHome = () => {
    router.push('/(tabs)');
  };

  if (!isAuthenticated) {
    return null; // Will redirect to welcome
  }

  if (isLoading || !currentPrediction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const prediction = currentPrediction as HealthPrediction;
  const riskColors = getRiskColor(prediction.risk_level);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Report</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Risk Score Card */}
        <View style={styles.riskCard}>
          <LinearGradient
            colors={riskColors}
            style={styles.riskGradient}
          >
            <Text style={styles.riskIcon}>{getRiskIcon(prediction.risk_level)}</Text>
            <Text style={styles.riskLevel}>{prediction.risk_level.toUpperCase()} RISK</Text>
            <Text style={styles.riskScore}>{(prediction.risk_score * 100).toFixed(0)}%</Text>
            <Text style={styles.riskSubtitle}>Health Risk Score</Text>
          </LinearGradient>
        </View>

        {/* Health Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Health Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{prediction.bmi.toFixed(1)}</Text>
              <Text style={styles.metricLabel}>BMI</Text>
              <Text style={styles.metricCategory}>{getBMICategory(prediction.bmi)}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{prediction.age}</Text>
              <Text style={styles.metricLabel}>Age</Text>
              <Text style={styles.metricCategory}>years</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{prediction.exercise_hours_per_week}</Text>
              <Text style={styles.metricLabel}>Exercise</Text>
              <Text style={styles.metricCategory}>hrs/week</Text>
            </View>
          </View>

          {(prediction.systolic_bp || prediction.diastolic_bp || prediction.cholesterol || prediction.glucose) && (
            <View style={styles.metricsGrid}>
              {prediction.systolic_bp && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{prediction.systolic_bp}/{prediction.diastolic_bp}</Text>
                  <Text style={styles.metricLabel}>Blood Pressure</Text>
                  <Text style={styles.metricCategory}>mmHg</Text>
                </View>
              )}
              {prediction.cholesterol && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{prediction.cholesterol}</Text>
                  <Text style={styles.metricLabel}>Cholesterol</Text>
                  <Text style={styles.metricCategory}>mg/dL</Text>
                </View>
              )}
              {prediction.glucose && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{prediction.glucose}</Text>
                  <Text style={styles.metricLabel}>Glucose</Text>
                  <Text style={styles.metricCategory}>mg/dL</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Smoking Status:</Text>
              <Text style={[styles.infoValue, prediction.smoking ? styles.riskText : styles.safeText]}>
                {prediction.smoking ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Height:</Text>
              <Text style={styles.infoValue}>{prediction.height_cm} cm</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Weight:</Text>
              <Text style={styles.infoValue}>{prediction.weight_kg} kg</Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
          {prediction.recommendations && prediction.recommendations.length > 0 ? (
            prediction.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationCard}>
                <View style={styles.recommendationIcon}>
                  <Text style={styles.recommendationEmoji}>💡</Text>
                </View>
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noRecommendations}>
              <Text style={styles.noRecommendationsText}>
                Great job! Keep maintaining your current healthy lifestyle.
              </Text>
            </View>
          )}
        </View>

        {/* AI Badge */}
        {prediction.ai_powered && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiText}>🤖 AI-Powered Analysis</Text>
            <Text style={styles.aiSubtext}>
              This prediction was generated using advanced AI algorithms
            </Text>
          </View>
        )}

        {/* Timestamp */}
        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>
            Generated on {new Date(prediction.created_at).toLocaleDateString()} at{' '}
            {new Date(prediction.created_at).toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleNewPrediction}>
          <Text style={styles.secondaryButtonText}>New Assessment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleBackToHome}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.primaryGradient}
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  riskCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  riskGradient: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  riskIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  riskLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  riskScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  riskSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginTop: 25,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  metricCategory: {
    fontSize: 10,
    color: '#999',
  },
  additionalInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  riskText: {
    color: '#F44336',
  },
  safeText: {
    color: '#4CAF50',
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recommendationEmoji: {
    fontSize: 20,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noRecommendations: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  noRecommendationsText: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
  },
  aiBadge: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  aiText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 5,
  },
  aiSubtext: {
    fontSize: 12,
    color: '#1976d2',
    textAlign: 'center',
  },
  timestampContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 12,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#667eea',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  primaryButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
