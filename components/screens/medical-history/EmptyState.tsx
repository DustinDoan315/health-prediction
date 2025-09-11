import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography,
} from '@/constants';
import { useAppSelector } from '@/hooks';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


interface EmptyStateProps {
  onAddPrediction: () => void;
}

export const EmptyState = memo(function EmptyState({
  onAddPrediction,
}: EmptyStateProps) {
  const { isDark } = useAppSelector(state => state.theme);
  const colors = Colors[isDark ? 'dark' : 'light'];

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyIconGradient}
        />
        <Text style={styles.emptyEmoji}>📊</Text>
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Health Records Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Start your health journey by creating your first assessment and get personalized insights.
      </Text>
      <TouchableOpacity
        style={[styles.emptyButton, { backgroundColor: colors.primary }]}
        onPress={onAddPrediction}
      >
        <Text style={styles.emptyButtonIcon}>+</Text>
        <Text style={[styles.emptyButtonText, { color: colors.surface }]}>
          Create Assessment
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconGradient: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.15,
  },
  emptyEmoji: {
    fontSize: 64,
    zIndex: 2,
  },
  emptyTitle: {
    ...Typography.h1,
    fontWeight: '800',
    marginBottom: Spacing.lg,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: Spacing.xxl,
    opacity: 0.8,
    fontWeight: '500',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.xl,
    ...Elevation.modal,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    gap: Spacing.sm,
  },
  emptyButtonIcon: {
    fontSize: 24,
    fontWeight: '700',
  },
  emptyButtonText: {
    ...Typography.body,
    fontWeight: '700',
    fontSize: 16,
  },
});
