import { Skeleton } from '@/components/shared';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing
} from '@/constants';
import { useAppSelector } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';


export function MedicalHistorySkeleton() {
  const { isDark } = useAppSelector(state => state.theme);
  const colors = Colors[isDark ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Skeleton width={140} height={28} borderRadius={BorderRadius.sm} style={styles.title} />
              <Skeleton width={120} height={16} borderRadius={BorderRadius.sm} style={styles.subtitle} />
            </View>
            <Skeleton width={48} height={48} borderRadius={BorderRadius.xl} />
          </View>

          <View style={styles.searchContainer}>
            <View style={[styles.searchInputContainer, { backgroundColor: colors.surface }]}>
              <Skeleton width={16} height={16} borderRadius={8} />
              <Skeleton width="70%" height={20} borderRadius={BorderRadius.sm} />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {['all', 'low', 'medium', 'high'].map((filterType, index) => (
              <Skeleton
                key={`filter-${filterType}`}
                width={index === 0 ? 50 : 80}
                height={36}
                borderRadius={BorderRadius.xl}
                style={styles.filterButton}
              />
            ))}
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Prediction Cards */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {Array.from({ length: 6 }, (_, index) => `card-${index}`).map((cardId) => (
          <View
            key={cardId}
            style={[
              styles.card,
              { backgroundColor: colors.surface },
              Elevation.card,
            ]}
          >
            <Skeleton width="100%" height={4} borderRadius={0} style={styles.riskIndicator} />
            
            <View style={styles.cardHeader}>
              <View style={styles.dateContainer}>
                <Skeleton width={60} height={18} borderRadius={BorderRadius.sm} style={styles.dateText} />
                <Skeleton width={50} height={14} borderRadius={BorderRadius.sm} style={styles.timeText} />
              </View>
              <View style={styles.riskBadgeContainer}>
                <Skeleton width={16} height={16} borderRadius={8} style={styles.riskIcon} />
                <Skeleton width={70} height={16} borderRadius={BorderRadius.sm} style={styles.riskLabel} />
              </View>
            </View>

            <View style={styles.metricsGrid}>
              {['bmi', 'risk', 'age'].map((metricType) => (
                <View key={`metric-${metricType}`} style={[styles.metricCard, { backgroundColor: colors.background }]}>
                  <Skeleton width="60%" height={12} borderRadius={BorderRadius.sm} style={styles.metricLabel} />
                  <Skeleton width="40%" height={18} borderRadius={BorderRadius.sm} style={styles.metricValue} />
                </View>
              ))}
            </View>

            <View style={styles.recommendationsContainer}>
              <View style={styles.recommendationHeader}>
                <Skeleton width={16} height={16} borderRadius={8} />
                <Skeleton width={120} height={14} borderRadius={BorderRadius.sm} style={styles.recommendationsTitle} />
              </View>
              <Skeleton width="90%" height={12} borderRadius={BorderRadius.sm} style={styles.recommendationText} />
              <Skeleton width="70%" height={12} borderRadius={BorderRadius.sm} style={styles.recommendationText} />
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerLeft}>
                <Skeleton width={80} height={16} borderRadius={BorderRadius.sm} />
                <Skeleton width={16} height={16} borderRadius={8} />
              </View>
              <Skeleton width={40} height={24} borderRadius={BorderRadius.lg} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 56,
  },
  header: {
    paddingHorizontal: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {},
  searchContainer: {
    marginBottom: Spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  filtersContainer: {
    marginBottom: Spacing.sm,
  },
  filtersContent: {
    paddingRight: Spacing.lg,
    gap: Spacing.sm,
  },
  filterButton: {
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  riskIndicator: {
    height: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    marginBottom: 2,
  },
  timeText: {},
  riskBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  riskIcon: {},
  riskLabel: {},
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  metricLabel: {
    marginBottom: Spacing.xs,
  },
  metricValue: {},
  recommendationsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  recommendationsTitle: {},
  recommendationText: {
    marginBottom: Spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
