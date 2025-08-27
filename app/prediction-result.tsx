import { ConfidenceBadge } from '@/components/ConfidenceBadge';
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
import { fetchPredictionById } from '@/store/slices/healthSlice';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';

import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


const { width } = Dimensions.get('window');

export default function PredictionResultScreen() {
  const { predictionId } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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

  const getRiskLevel = (riskScore: number) => {
    if (riskScore < 0.3) return 'low';
    if (riskScore < 0.7) return 'medium';
    return 'high';
  };

  const getRiskColor = (riskLevel: string): [string, string] => {
    switch (riskLevel) {
      case 'low': return [colors.healthGood, colors.healthGood];
      case 'medium': return [colors.healthWatch, colors.healthWatch];
      case 'high': return [colors.healthAttention, colors.healthAttention];
      default: return [colors.healthNeutral, colors.healthNeutral];
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/health-prediction');
  };

  const handleBackToHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)');
  };

  if (!isAuthenticated) {
    return null; // Will redirect to welcome
  }

  if (isLoading || !currentPrediction) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const prediction = currentPrediction as HealthPrediction;
  const riskLevel = getRiskLevel(prediction.risk_score);
  const riskColors = getRiskColor(riskLevel);
  const confidence = Math.round((1 - prediction.risk_score) * 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.background }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Health Report</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Risk Score Card */}
        <View style={styles.riskCard}>
          <LinearGradient
            colors={riskColors}
            style={styles.riskGradient}
          >
            <Text style={styles.riskIcon}>{getRiskIcon(riskLevel)}</Text>
            <Text style={[styles.riskLevel, { color: colors.surface }]}>
              {riskLevel.toUpperCase()} RISK
            </Text>
            <Text style={[styles.riskScore, { color: colors.surface }]}>
              {(prediction.risk_score * 100).toFixed(0)}%
            </Text>
            <Text style={[styles.riskSubtitle, { color: colors.surface }]}>
              Health Risk Score
            </Text>
          </LinearGradient>
        </View>

        {/* Confidence Badge */}
        <View style={styles.confidenceContainer}>
          <ConfidenceBadge
            confidence={confidence}
            riskLevel={riskLevel}
            showDetails={true}
          />
        </View>

        {/* Health Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Health Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.bmi.toFixed(1)}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>BMI</Text>
              <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>{getBMICategory(prediction.bmi)}</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.age}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Age</Text>
              <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>years</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.exercise_hours_per_week}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Exercise</Text>
              <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>hrs/week</Text>
            </View>
          </View>

          {(prediction.systolic_bp || prediction.diastolic_bp || prediction.cholesterol || prediction.glucose) && (
            <View style={styles.metricsGrid}>
              {prediction.systolic_bp && (
                <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.systolic_bp}/{prediction.diastolic_bp}</Text>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Blood Pressure</Text>
                  <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>mmHg</Text>
                </View>
              )}
              {prediction.cholesterol && (
                <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.cholesterol}</Text>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Cholesterol</Text>
                  <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>mg/dL</Text>
                </View>
              )}
              {prediction.glucose && (
                <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.glucose}</Text>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Glucose</Text>
                  <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>mg/dL</Text>
                </View>
              )}
            </View>
          )}

          <View style={[styles.additionalInfo, { backgroundColor: colors.surface }]}>
            <View style={[styles.infoRow, { borderBottomColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Smoking Status:</Text>
              <Text style={[
                styles.infoValue, 
                prediction.smoking ? { color: colors.healthAttention } : { color: colors.healthGood }
              ]}>
                {prediction.smoking ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderBottomColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Height:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{prediction.height_cm} cm</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Weight:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{prediction.weight_kg} kg</Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personalized Recommendations</Text>
          {prediction.recommendations && prediction.recommendations.length > 0 ? (
            prediction.recommendations.map((recommendation, index) => (
              <View key={index} style={[styles.recommendationCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.recommendationIcon, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.recommendationEmoji, { color: colors.surface }]}>💡</Text>
                </View>
                <Text style={[styles.recommendationText, { color: colors.text }]}>{recommendation}</Text>
              </View>
            ))
          ) : (
            <View style={[styles.noRecommendations, { backgroundColor: colors.healthGood }]}>
              <Text style={[styles.noRecommendationsText, { color: colors.surface }]}>
                Great job! Keep maintaining your current healthy lifestyle.
              </Text>
            </View>
          )}
        </View>

        {/* AI Badge */}
        {prediction.ai_powered && (
          <View style={[styles.aiBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.aiText, { color: colors.surface }]}>🤖 AI-Powered Analysis</Text>
            <Text style={[styles.aiSubtext, { color: colors.surface }]}>
              This prediction was generated using advanced AI algorithms
            </Text>
          </View>
        )}

        {/* Timestamp */}
        <View style={styles.timestampContainer}>
          <Text style={[styles.timestampText, { color: colors.textSecondary }]}>
            Generated on {new Date(prediction.created_at).toLocaleDateString()} at{' '}
            {new Date(prediction.created_at).toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.secondaryButton, { borderColor: colors.primary }]} 
          onPress={handleNewPrediction}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>New Assessment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleBackToHome}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.primaryGradient}
          >
            <Text style={[styles.primaryButtonText, { color: colors.surface }]}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
  },
  scrollView: {
    flex: 1,
  },
  riskCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Elevation.modal,
  },
  riskGradient: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  riskIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  riskLevel: {
    ...Typography.sectionTitle,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  riskScore: {
    ...Typography.pageTitle,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  riskSubtitle: {
    ...Typography.body,
  },
  confidenceContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  section: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  metricCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: 4,
    alignItems: 'center',
    ...Elevation.card,
  },
  metricValue: {
    ...Typography.sectionTitle,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    ...Typography.caption,
    marginBottom: 2,
  },
  metricCategory: {
    ...Typography.caption,
    fontSize: 10,
  },
  additionalInfo: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    ...Elevation.card,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  infoLabel: {
    ...Typography.meta,
  },
  infoValue: {
    ...Typography.meta,
    fontWeight: '500',
  },
  recommendationCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Elevation.card,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recommendationEmoji: {
    fontSize: 20,
  },
  recommendationText: {
    flex: 1,
    ...Typography.meta,
    lineHeight: Typography.meta.lineHeight,
  },
  noRecommendations: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  noRecommendationsText: {
    ...Typography.body,
    textAlign: 'center',
  },
  aiBadge: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  aiText: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  aiSubtext: {
    ...Typography.caption,
    textAlign: 'center',
  },
  timestampContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  timestampText: {
    ...Typography.caption,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...Typography.body,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    marginLeft: Spacing.sm,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.body,
    fontWeight: '600',
  },
});
