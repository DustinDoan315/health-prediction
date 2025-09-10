import { BorderRadius, Colors, Spacing } from '@/constants';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/shared';
import { useColorScheme } from '@/hooks';


export function PredictionResultSkeleton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Skeleton width="60%" height={32} style={styles.title} />
        <Skeleton width="40%" height={16} style={styles.subtitle} />
      </View>

      {/* Risk Score Card */}
      <View
        style={[
          styles.riskCard,
          { backgroundColor: colors.surface },
        ]}
      >
        <Skeleton width="50%" height={20} style={styles.riskTitle} />
        <Skeleton width="30%" height={48} style={styles.riskScore} />
        <Skeleton width="60%" height={16} style={styles.riskDescription} />
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.metricCard,
              { backgroundColor: colors.surface },
            ]}
          >
            <Skeleton width="80%" height={14} style={styles.metricLabel} />
            <Skeleton width="60%" height={20} style={styles.metricValue} />
            <Skeleton width="40%" height={12} style={styles.metricUnit} />
          </View>
        ))}
      </View>

      {/* Recommendations Section */}
      <View style={styles.section}>
        <Skeleton width="50%" height={20} style={styles.sectionTitle} />
        <View style={styles.recommendationsList}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.recommendationItem,
                { backgroundColor: colors.surface },
              ]}
            >
              <Skeleton width={24} height={24} borderRadius={BorderRadius.sm} />
              <View style={styles.recommendationContent}>
                <Skeleton width="90%" height={16} style={styles.recommendationTitle} />
                <Skeleton width="80%" height={14} style={styles.recommendationDescription} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Skeleton width="45%" height={48} borderRadius={BorderRadius.md} />
        <Skeleton width="45%" height={48} borderRadius={BorderRadius.md} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {},
  riskCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  riskTitle: {
    marginBottom: Spacing.md,
  },
  riskScore: {
    marginBottom: Spacing.md,
  },
  riskDescription: {},
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  metricCard: {
    width: '47%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  metricLabel: {
    marginBottom: Spacing.sm,
  },
  metricValue: {
    marginBottom: Spacing.xs,
  },
  metricUnit: {},
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  recommendationsList: {
    gap: Spacing.md,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  recommendationContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  recommendationTitle: {
    marginBottom: Spacing.xs,
  },
  recommendationDescription: {},
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
