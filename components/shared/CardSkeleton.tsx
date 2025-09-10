import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing
} from '@/constants';
import { useColorScheme } from '@/hooks';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';


interface ICardSkeletonProps {
  showAvatar?: boolean;
  showActions?: boolean;
  lines?: number;
}

export function CardSkeleton({
  showAvatar = false,
  showActions = false,
  lines = 2,
}: ICardSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
        },
        Elevation.card,
      ]}
    >
      <View style={styles.header}>
        {showAvatar && (
          <Skeleton
            width={48}
            height={48}
            borderRadius={BorderRadius.lg}
            style={styles.avatar}
          />
        )}
        <View style={styles.content}>
          <Skeleton width="70%" height={16} style={styles.title} />
          <Skeleton width="50%" height={14} style={styles.subtitle} />
        </View>
      </View>

      <View style={styles.body}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            width={index === lines - 1 ? '60%' : '100%'}
            height={14}
            style={styles.line}
          />
        ))}
      </View>

      {showActions && (
        <View style={styles.actions}>
          <Skeleton width={80} height={32} borderRadius={BorderRadius.md} />
          <Skeleton width={60} height={32} borderRadius={BorderRadius.md} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {},
  body: {
    marginBottom: Spacing.md,
  },
  line: {
    marginBottom: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
