import { Colors, Spacing } from '@/constants';
import { Skeleton } from '@/components/shared';
import { StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';


export function OnboardingSkeleton() {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme ?? 'light');

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.content}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Skeleton
                  key={`progress-dot-${item}`}
                  width={8}
                  height={8}
                  borderRadius={4}
                  style={styles.progressDot}
                />
              ))}
            </View>
          </View>

          <View style={styles.skipButton}>
            <Skeleton width={40} height={16} borderRadius={8} />
          </View>

          <View style={styles.mainContent}>
            <Skeleton
              width={120}
              height={120}
              borderRadius={60}
              style={styles.iconContainer}
            />

            <Skeleton
              width={280}
              height={32}
              borderRadius={16}
              style={styles.titleSkeleton}
            />

            <Skeleton
              width={240}
              height={24}
              borderRadius={12}
              style={styles.subtitleSkeleton}
            />

            <Skeleton
              width={320}
              height={60}
              borderRadius={12}
              style={styles.descriptionSkeleton}
            />

            <View style={styles.featuresContainer}>
              {[1, 2, 3, 4].map((item) => (
                <View key={`feature-item-${item}`} style={styles.featureItem}>
                  <Skeleton width={8} height={8} borderRadius={4} />
                  <Skeleton
                    width={200}
                    height={16}
                    borderRadius={8}
                    style={styles.featureTextSkeleton}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.navigationButtons}>
              <Skeleton
                width={100}
                height={48}
                borderRadius={24}
                style={styles.previousButtonSkeleton}
              />
              <Skeleton
                width={120}
                height={48}
                borderRadius={24}
                style={styles.nextButtonSkeleton}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.xl,
    },
    progressContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    progressBar: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    progressDot: {
      marginHorizontal: 4,
    },
    skipButton: {
      position: 'absolute',
      top: Spacing.xl,
      right: Spacing.xxl,
      zIndex: 1,
    },
    mainContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      marginBottom: Spacing.xl * 2,
    },
    titleSkeleton: {
      marginBottom: Spacing.lg,
    },
    subtitleSkeleton: {
      marginBottom: Spacing.lg,
    },
    descriptionSkeleton: {
      marginBottom: Spacing.xl * 2,
    },
    featuresContainer: {
      width: '100%',
      maxWidth: 300,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
      gap: Spacing.md,
    },
    featureTextSkeleton: {
      flex: 1,
    },
    buttonContainer: {
      paddingBottom: Spacing.xl,
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    previousButtonSkeleton: {
      // Empty for now
    },
    nextButtonSkeleton: {
      // Empty for now
    },
  });
};
