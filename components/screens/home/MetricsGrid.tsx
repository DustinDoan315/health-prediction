import { Colors, Spacing, Typography } from '@/constants';
import { memo } from 'react';
import { MetricCard } from '@/components/shared';
import { UIText } from '@/content';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


interface HealthStats {
  total_predictions: number;
  average_risk_score: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
}

interface MetricsGridProps {
  stats: HealthStats;
  isDark: boolean;
}

const MetricsGrid = memo<MetricsGridProps>(({ stats, isDark }) => {
  const colors = Colors[isDark ? 'dark' : 'light'];

  const getRiskStatus = (score: number) => {
    if (score < 3) return 'good';
    if (score < 7) return 'watch';
    return 'attention';
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {UIText.home.recentInsights}
      </Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          title={UIText.metrics.totalPredictions}
          value={stats.total_predictions}
          status="neutral"
          icon="📊"
        />
        <MetricCard
          title={UIText.metrics.averageRisk}
          value={stats.average_risk_score.toFixed(1)}
          unit=""
          status={getRiskStatus(stats.average_risk_score)}
          icon="⚠️"
        />
        <MetricCard
          title={UIText.metrics.lowRiskCount}
          value={stats.risk_distribution.low}
          status="good"
          icon="✅"
        />
      </View>
    </View>
  );
});

MetricsGrid.displayName = 'MetricsGrid';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    gap: Spacing.md,
  },
});

export default MetricsGrid;
