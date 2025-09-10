import { BorderRadius, Colors, Spacing } from '@/constants';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/shared';
import { useColorScheme } from '@/hooks';


export function MedicalHistorySkeleton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Skeleton width="50%" height={32} style={styles.title} />
        <Skeleton width="30%" height={16} style={styles.subtitle} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            width={80}
            height={36}
            borderRadius={BorderRadius.md}
          />
        ))}
      </View>

      {/* Prediction Cards */}
      <View style={styles.cardsContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: colors.surface },
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Skeleton width={40} height={40} borderRadius={BorderRadius.lg} />
                <View style={styles.cardHeaderContent}>
                  <Skeleton width="70%" height={16} style={styles.cardTitle} />
                  <Skeleton width="50%" height={14} style={styles.cardDate} />
                </View>
              </View>
              <Skeleton width={60} height={24} borderRadius={BorderRadius.sm} />
            </View>

            {/* Risk Score */}
            <View style={styles.riskSection}>
              <Skeleton width="30%" height={14} style={styles.riskLabel} />
              <Skeleton width="20%" height={20} style={styles.riskValue} />
            </View>

            {/* Metrics */}
            <View style={styles.metricsSection}>
              {Array.from({ length: 3 }).map((_, metricIndex) => (
                <View key={metricIndex} style={styles.metric}>
                  <Skeleton width="60%" height={12} style={styles.metricLabel} />
                  <Skeleton width="40%" height={16} style={styles.metricValue} />
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsSection}>
              <Skeleton width="40%" height={14} style={styles.recommendationsTitle} />
              <Skeleton width="90%" height={12} style={styles.recommendationText} />
              <Skeleton width="70%" height={12} style={styles.recommendationText} />
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <Skeleton width={80} height={32} borderRadius={BorderRadius.md} />
              <Skeleton width={60} height={32} borderRadius={BorderRadius.md} />
            </View>
          </View>
        ))}
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
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {},
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  cardsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardHeaderContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  cardTitle: {
    marginBottom: Spacing.xs,
  },
  cardDate: {},
  riskSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  riskLabel: {},
  riskValue: {},
  metricsSection: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {},
  metricValue: {},
  recommendationsSection: {
    marginBottom: Spacing.md,
  },
  recommendationsTitle: {
    marginBottom: Spacing.sm,
  },
  recommendationText: {
    marginBottom: Spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
