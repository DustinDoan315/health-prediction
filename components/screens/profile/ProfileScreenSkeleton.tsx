import { BorderRadius, Colors, Spacing } from '@/constants';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/shared';
import { useColorScheme } from '@/hooks';


export function ProfileScreenSkeleton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Skeleton width={80} height={80} borderRadius={40} style={styles.avatar} />
        <Skeleton width="60%" height={24} style={styles.name} />
        <Skeleton width="40%" height={16} style={styles.email} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.statCard,
              { backgroundColor: colors.surface },
            ]}
          >
            <Skeleton width="50%" height={16} style={styles.statTitle} />
            <Skeleton width="30%" height={24} style={styles.statValue} />
            <Skeleton width="40%" height={14} style={styles.statSubtitle} />
          </View>
        ))}
      </View>

      {/* Settings Sections */}
      <View style={styles.sectionsContainer}>
        {Array.from({ length: 4 }).map((_, sectionIndex) => (
          <View
            key={sectionIndex}
            style={[
              styles.section,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Skeleton width="40%" height={18} style={styles.sectionTitle} />
              <Skeleton width={24} height={24} borderRadius={BorderRadius.sm} />
            </View>
            
            <View style={styles.sectionContent}>
              {Array.from({ length: 3 }).map((_, itemIndex) => (
                <View key={itemIndex} style={styles.sectionItem}>
                  <View style={styles.sectionItemLeft}>
                    <Skeleton width={20} height={20} borderRadius={BorderRadius.sm} />
                    <Skeleton width="70%" height={16} style={styles.sectionItemText} />
                  </View>
                  <Skeleton width={20} height={20} borderRadius={BorderRadius.sm} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Logout Button */}
      <Skeleton
        width="90%"
        height={48}
        borderRadius={BorderRadius.md}
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  avatar: {
    marginBottom: Spacing.md,
  },
  name: {
    marginBottom: Spacing.sm,
  },
  email: {},
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  statTitle: {
    marginBottom: Spacing.sm,
  },
  statValue: {
    marginBottom: Spacing.xs,
  },
  statSubtitle: {},
  sectionsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  section: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {},
  sectionContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  sectionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionItemText: {
    marginLeft: Spacing.md,
  },
  logoutButton: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
