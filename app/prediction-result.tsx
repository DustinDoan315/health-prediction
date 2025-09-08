import { ConfidenceBadge, PredictionResultSkeleton } from '@/components';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
} from '@/constants';
import { UIText } from '@/content';
import { useAppDispatch, useAppSelector, useColorScheme } from '@/hooks';
import { HealthPrediction } from '@/services';
import { fetchPredictionById } from '@/store/slices';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


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
  }, [isAuthenticated]);

  useEffect(() => {

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
  }, [dispatch, predictionId, currentPrediction]);

  if (!isAuthenticated) {
    return null;
  }

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
    if (bmi < 18.5) return UIText.bmiCategories.underweight;
    if (bmi < 25) return UIText.bmiCategories.normal;
    if (bmi < 30) return UIText.bmiCategories.overweight;
    return UIText.bmiCategories.obese;
  };

  const handleNewPrediction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/health-prediction');
  };

  const handleBackToHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)');
  };



  if (isLoading || !currentPrediction) {
    return <PredictionResultSkeleton />;
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
          <Text style={[styles.backButtonText, { color: colors.text }]}>{UIText.navigation.back}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{UIText.navigation.healthReport}</Text>
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
              {riskLevel === 'low' ? UIText.predictionResult.lowRisk : 
               riskLevel === 'medium' ? UIText.predictionResult.mediumRisk : 
               UIText.predictionResult.highRisk}
            </Text>
            <Text style={[styles.riskScore, { color: colors.surface }]}>
              {(prediction.risk_score * 100).toFixed(0)}%
            </Text>
            <Text style={[styles.riskSubtitle, { color: colors.surface }]}>
              {UIText.predictionResult.healthRiskScore}
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{UIText.predictionResult.yourHealthMetrics}</Text>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.bmi.toFixed(1)}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{UIText.healthMetrics.bmi}</Text>
              <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>{getBMICategory(prediction.bmi)}</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.age}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{UIText.healthMetrics.age}</Text>
              <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>{UIText.healthMetrics.years}</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.exercise_hours_per_week}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{UIText.healthMetrics.exercise}</Text>
              <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>{UIText.healthMetrics.hrsWeek}</Text>
            </View>
          </View>

          {(prediction.systolic_bp || prediction.diastolic_bp || prediction.cholesterol || prediction.glucose) && (
            <View style={styles.metricsGrid}>
              {prediction.systolic_bp && (
                <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.systolic_bp}/{prediction.diastolic_bp}</Text>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{UIText.healthMetrics.bloodPressure}</Text>
                  <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>{UIText.healthMetrics.mmHg}</Text>
                </View>
              )}
              {prediction.cholesterol && (
                <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.cholesterol}</Text>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{UIText.healthMetrics.cholesterol}</Text>
                  <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>{UIText.healthMetrics.mgdL}</Text>
                </View>
              )}
              {prediction.glucose && (
                <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.metricValue, { color: colors.primary }]}>{prediction.glucose}</Text>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{UIText.healthMetrics.glucose}</Text>
                  <Text style={[styles.metricCategory, { color: colors.textSecondary }]}>{UIText.healthMetrics.mgdL}</Text>
                </View>
              )}
            </View>
          )}

          <View style={[styles.additionalInfo, { backgroundColor: colors.surface }]}>
            <View style={[styles.infoRow, { borderBottomColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{UIText.healthMetrics.smokingStatus}</Text>
              <Text style={[
                styles.infoValue, 
                prediction.smoking ? { color: colors.healthAttention } : { color: colors.healthGood }
              ]}>
                {prediction.smoking ? UIText.healthMetrics.yes : UIText.healthMetrics.no}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderBottomColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{UIText.healthMetrics.height}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{prediction.height_cm} {UIText.healthMetrics.cm}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomColor: colors.background }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{UIText.healthMetrics.weight}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{prediction.weight_kg} {UIText.healthMetrics.kg}</Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{UIText.predictionResult.personalizedRecommendations}</Text>
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
                {UIText.predictionResult.greatJob}
              </Text>
            </View>
          )}
        </View>

        {/* AI Badge */}
        {prediction.ai_powered && (
          <View style={[styles.aiBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.aiText, { color: colors.surface }]}>{UIText.predictionResult.aiPoweredAnalysis}</Text>
            <Text style={[styles.aiSubtext, { color: colors.surface }]}>
              {UIText.predictionResult.aiSubtext}
            </Text>
          </View>
        )}

        {/* Timestamp */}
        <View style={styles.timestampContainer}>
          <Text style={[styles.timestampText, { color: colors.textSecondary }]}>
            {UIText.predictionResult.generatedOn.replace('{date}', new Date(prediction.created_at).toLocaleDateString()).replace('{time}', new Date(prediction.created_at).toLocaleTimeString())}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.secondaryButton, { borderColor: colors.primary }]} 
          onPress={handleNewPrediction}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>{UIText.predictionResult.newAssessment}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleBackToHome}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.primaryGradient}
          >
            <Text style={[styles.primaryButtonText, { color: colors.surface }]}>{UIText.predictionResult.backToHome}</Text>
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
    ...Typography.h3,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  riskScore: {
    ...Typography.h1,
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
    ...Typography.h3,
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
    ...Typography.h3,
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
    ...Typography.caption,
  },
  infoValue: {
    ...Typography.caption,
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
    ...Typography.caption,
    lineHeight: Typography.caption.lineHeight,
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
