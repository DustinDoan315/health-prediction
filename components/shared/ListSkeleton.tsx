import { BorderRadius, Colors, Spacing } from '@/constants';
import { Skeleton } from './Skeleton';
import { StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/hooks';


interface IListSkeletonProps {
  items?: number;
  showAvatars?: boolean;
  showSubtitle?: boolean;
}

export function ListSkeleton({
  items = 5,
  showAvatars = true,
  showSubtitle = true,
}: IListSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {Array.from({ length: items }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.item,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.background,
            },
          ]}
        >
          <View style={styles.content}>
            {showAvatars && (
              <Skeleton
                width={40}
                height={40}
                borderRadius={BorderRadius.lg}
                style={styles.avatar}
              />
            )}
            <View style={styles.textContent}>
              <Skeleton width="80%" height={16} style={styles.title} />
              {showSubtitle && (
                <Skeleton width="60%" height={14} style={styles.subtitle} />
              )}
            </View>
          </View>
          <Skeleton width={20} height={20} borderRadius={BorderRadius.sm} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: Spacing.md,
  },
  textContent: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {},
});
