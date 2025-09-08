import { Colors, Spacing } from '@/constants';
import { useColorScheme } from '@/hooks';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';


export function WelcomeScreenSkeleton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Skeleton width={120} height={32} borderRadius={8} />
          <Skeleton width={80} height={16} borderRadius={4} style={styles.subtitle} />
        </View>

        <View style={styles.illustrationContainer}>
          <Skeleton width={120} height={120} borderRadius={60} />
        </View>

        <View style={styles.titleSection}>
          <Skeleton width={200} height={32} borderRadius={8} />
          <Skeleton width={280} height={48} borderRadius={8} style={styles.subtitleSkeleton} />
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={180} height={20} borderRadius={4} style={styles.featureText} />
          </View>
          <View style={styles.featureItem}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={200} height={20} borderRadius={4} style={styles.featureText} />
          </View>
          <View style={styles.featureItem}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={190} height={20} borderRadius={4} style={styles.featureText} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Skeleton width={220} height={56} borderRadius={20} />
        </View>

        <View style={styles.footer}>
          <Skeleton width={250} height={16} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 2,
  },
  subtitleSkeleton: {
    marginTop: Spacing.xl,
  },
  featuresContainer: {
    marginBottom: Spacing.xl * 2,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  featureText: {
    marginLeft: Spacing.lg,
  },
  buttonContainer: {
    marginBottom: Spacing.xl * 2,
  },
  footer: {
    alignItems: 'center',
  },
});
