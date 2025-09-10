import { BorderRadius, Colors, Spacing } from '@/constants';
import { useColorScheme } from '@/hooks';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';


interface IFormSkeletonProps {
  fields?: number;
  showTitle?: boolean;
  showButton?: boolean;
}

export function FormSkeleton({
  fields = 4,
  showTitle = true,
  showButton = true,
}: IFormSkeletonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      {showTitle && (
        <Skeleton width="60%" height={24} style={styles.title} />
      )}

      <View style={styles.form}>
        {Array.from({ length: fields }).map((_, index) => (
          <View key={index} style={styles.field}>
            <Skeleton width="30%" height={14} style={styles.label} />
            <Skeleton
              width="100%"
              height={48}
              borderRadius={BorderRadius.md}
              style={styles.input}
            />
          </View>
        ))}

        {showButton && (
          <Skeleton
            width="100%"
            height={48}
            borderRadius={BorderRadius.md}
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  form: {
    gap: Spacing.lg,
  },
  field: {
    gap: Spacing.sm,
  },
  label: {},
  input: {},
  button: {
    marginTop: Spacing.md,
  },
});
