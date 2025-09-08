import { BorderRadius, Colors, Spacing } from '@/constants';
import { useColorScheme } from '@/hooks';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';


export function HomeScreenSkeleton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Skeleton width="40%" height={32} style={styles.greeting} />
          <Skeleton width="60%" height={16} style={styles.subtitle} />
        </View>
        <View style={styles.headerActions}>
          <Skeleton width={44} height={44} borderRadius={BorderRadius.lg} />
          <Skeleton width={44} height={44} borderRadius={BorderRadius.lg} />
        </View>
      </View>

      {/* Mood Check-in Card */}
      <View style={styles.section}>
        <Skeleton width="20%" height={20} style={styles.sectionTitle} />
        <View
          style={[
            styles.moodCard,
            { backgroundColor: colors.surface },
          ]}
        >
          <Skeleton width="80%" height={16} style={styles.moodQuestion} />
          <View style={styles.moodOptions}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`mood-${index}`}
              width={70}
              height={60}
              borderRadius={BorderRadius.md}
            />
          ))}
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Skeleton width="30%" height={20} style={styles.sectionTitle} />
        <View style={styles.actionTiles}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View
              key={`action-${index}`}
              style={[
                styles.actionTile,
                { backgroundColor: colors.surface },
              ]}
            >
              <Skeleton width={48} height={48} borderRadius={BorderRadius.lg} />
              <View style={styles.actionContent}>
                <Skeleton width="80%" height={16} style={styles.actionTitle} />
                <Skeleton width="60%" height={14} style={styles.actionSubtitle} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Health Metrics */}
      <View style={styles.section}>
        <Skeleton width="40%" height={20} style={styles.sectionTitle} />
        <View style={styles.metricsGrid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View
              key={`metric-${index}`}
              style={[
                styles.metricCard,
                { backgroundColor: colors.surface },
              ]}
            >
              <Skeleton width="60%" height={16} style={styles.metricTitle} />
              <Skeleton width="40%" height={28} style={styles.metricValue} />
              <Skeleton width="20%" height={14} style={styles.metricUnit} />
            </View>
          ))}
        </View>
      </View>

      {/* Primary CTA */}
      <Skeleton
        width="90%"
        height={56}
        borderRadius={BorderRadius.xl}
        style={styles.primaryCTA}
      />
    </ScrollView>
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
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    marginBottom: Spacing.xs,
  },
  subtitle: {},
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  moodCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  moodQuestion: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionTiles: {
    gap: Spacing.md,
  },
  actionTile: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  actionTitle: {
    marginBottom: Spacing.xs,
  },
  actionSubtitle: {},
  metricsGrid: {
    gap: Spacing.md,
  },
  metricCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  metricTitle: {
    marginBottom: Spacing.sm,
  },
  metricValue: {
    marginBottom: Spacing.xs,
  },
  metricUnit: {},
  primaryCTA: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
});
