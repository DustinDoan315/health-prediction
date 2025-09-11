import { AnimatedCard } from '@/components';
import { useAppSelector } from '@/hooks';
import { HealthPrediction } from '@/services';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback } from 'react';

import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography,
} from '@/constants';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


interface PredictionItemProps {
  item: HealthPrediction;
  onPress: (prediction: HealthPrediction) => void;
}

export const PredictionItem = memo(function PredictionItem({
  item,
  onPress,
}: PredictionItemProps) {
  const { isDark } = useAppSelector(state => state.theme);
  const colors = Colors[isDark ? 'dark' : 'light'];

  const getRiskGradient = useCallback(
    (riskLevel: string): [string, string] => {
      switch (riskLevel) {
        case 'low':
          return [colors.healthGood, '#10B981'];
        case 'medium':
          return [colors.healthWatch, '#F59E0B'];
        case 'high':
          return [colors.healthAttention, '#EF4444'];
        default:
          return [colors.healthNeutral, '#6B7280'];
      }
    },
    [colors]
  );

  const getRiskIcon = useCallback((riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return '✓';
      case 'medium':
        return '⚠';
      case 'high':
        return '!';
      default:
        return '?';
    }
  }, []);

  const getRiskLabel = useCallback((riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Medium Risk';
      case 'high':
        return 'High Risk';
      default:
        return 'Unknown';
    }
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(item);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const { date, time } = formatDate(item.created_at);

  return (
    <AnimatedCard
      style={[styles.predictionCard, { backgroundColor: colors.surface }]}
      onPress={handlePress}
    >
      <LinearGradient
        colors={getRiskGradient(item.risk_level)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.riskIndicator}
      />
      
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Text style={[styles.dateText, { color: colors.text }]}>
            {date}
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {time}
          </Text>
        </View>
        
        <View style={[styles.riskBadgeContainer, { backgroundColor: getRiskGradient(item.risk_level)[0] + '20' }]}>
          <Text style={[styles.riskIcon, { color: getRiskGradient(item.risk_level)[0] }]}>
            {getRiskIcon(item.risk_level)}
          </Text>
          <Text style={[styles.riskLabel, { color: colors.text }]}>
            {getRiskLabel(item.risk_level)}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              BMI
            </Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {item.bmi.toFixed(1)}
            </Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Risk Score
            </Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {(item.risk_score * 100).toFixed(0)}%
            </Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Age
            </Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {item.age}
            </Text>
          </View>
        </View>

        {item.recommendations && item.recommendations.length > 0 && (
          <View style={[styles.recommendationsContainer, { backgroundColor: colors.primary + '08' }]}>
            <View style={styles.recommendationHeader}>
              <Text style={styles.recommendationIcon}>💡</Text>
              <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                Top Recommendation
              </Text>
            </View>
            <Text
              style={[styles.recommendationText, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.recommendations[0]}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
            View Details
          </Text>
          <Text style={[styles.arrowIcon, { color: colors.primary }]}>→</Text>
        </View>
        
        {item.ai_powered && (
          <View style={[styles.aiTag, { backgroundColor: colors.primary }]}>
            <Text style={styles.aiIcon}>🤖</Text>
            <Text style={[styles.aiTagText, { color: colors.surface }]}>
              AI
            </Text>
          </View>
        )}
      </View>
    </AnimatedCard>
  );
});

const styles = StyleSheet.create({
  predictionCard: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Elevation.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  riskIndicator: {
    height: 5,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    ...Typography.h2,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  timeText: {
    ...Typography.caption,
    marginTop: 4,
    opacity: 0.8,
    fontWeight: '500',
  },
  riskBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  riskIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  riskLabel: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 12,
  },
  cardContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  metricCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Elevation.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  metricLabel: {
    ...Typography.caption,
    marginBottom: Spacing.sm,
    fontWeight: '600',
    opacity: 0.8,
  },
  metricValue: {
    ...Typography.h2,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  recommendationsContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  recommendationIcon: {
    fontSize: 18,
  },
  recommendationsTitle: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 13,
  },
  recommendationText: {
    ...Typography.caption,
    lineHeight: 22,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  viewDetailsText: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 13,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  aiIcon: {
    fontSize: 14,
  },
  aiTagText: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 12,
  },
});
