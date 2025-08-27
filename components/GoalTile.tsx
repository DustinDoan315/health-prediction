import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
} from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


interface GoalTileProps {
  title: string;
  icon: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  streak: number;
  coachTip: string;
  onPress?: () => void;
  status: 'on-track' | 'behind' | 'ahead';
}

export function GoalTile({
  title,
  icon,
  currentValue,
  targetValue,
  unit,
  streak,
  coachTip,
  onPress,
  status,
}: GoalTileProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getStatusColor = () => {
    switch (status) {
      case 'on-track':
        return colors.healthGood;
      case 'behind':
        return colors.healthWatch;
      case 'ahead':
        return colors.healthGood;
      default:
        return colors.healthNeutral;
    }
  };

  const getProgressPercentage = () => {
    return Math.min((currentValue / targetValue) * 100, 100);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'on-track':
        return '✅';
      case 'behind':
        return '⚠️';
      case 'ahead':
        return '🎯';
      default:
        return '📊';
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        onPress && styles.pressable,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.streakContainer}>
            <Text style={[styles.streakText, { color: colors.primary }]}>
              🔥 {streak} day streak
            </Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: colors.text }]}>
            {currentValue} / {targetValue} {unit}
          </Text>
          <Text style={[styles.percentageText, { color: getStatusColor() }]}>
            {Math.round(getProgressPercentage())}%
          </Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: getStatusColor(),
                width: `${getProgressPercentage()}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.coachTipContainer}>
        <Text style={[styles.coachLabel, { color: colors.textSecondary }]}>
          💡 Coach tip:
        </Text>
        <Text style={[styles.coachTip, { color: colors.text }]} numberOfLines={2}>
          {coachTip}
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Elevation.card,
    marginBottom: Spacing.md,
  },
  pressable: {
    // Additional styles for pressable tiles
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    ...Typography.caption,
    fontWeight: '500',
  },
  statusContainer: {
    marginLeft: Spacing.sm,
  },
  statusIcon: {
    fontSize: 20,
  },
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  progressText: {
    ...Typography.meta,
    fontWeight: '500',
  },
  percentageText: {
    ...Typography.meta,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  coachTipContainer: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  coachLabel: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  coachTip: {
    ...Typography.meta,
    lineHeight: Typography.meta.lineHeight,
  },
});
