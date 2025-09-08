import {
    Spacing,
    Typography,
} from '@/constants';
import {
    BorderRadius,
    Colors,
    Elevation,
} from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'good' | 'watch' | 'attention' | 'neutral';
  onPress?: () => void;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = 'neutral',
  onPress,
  subtitle,
  icon,
}: Readonly<MetricCardProps>) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return colors.healthGood;
      case 'watch':
        return colors.healthWatch;
      case 'attention':
        return colors.healthAttention;
      default:
        return colors.healthNeutral;
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    const iconMap = {
      up: '↗',
      down: '↘',
      neutral: '→',
    };
    
    return (
      <Text style={[styles.trendIcon, { color: getStatusColor() }]}>
        {iconMap[trend]}
      </Text>
    );
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
        {icon && (
          <View style={styles.iconContainer}>
            {typeof icon === 'string' ? (
              <Text style={styles.iconText}>{icon}</Text>
            ) : (
              icon
            )}
          </View>
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {String(title)}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {String(subtitle)}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: colors.text }]}>
          {String(value)}
          {unit && <Text style={[styles.unit, { color: colors.textSecondary }]}> {unit}</Text>}
        </Text>
        
        {(trend || trendValue) && (
          <View style={styles.trendContainer}>
            {getTrendIcon()}
            {trendValue && (
              <Text style={[styles.trendValue, { color: getStatusColor() }]}>
                {String(trendValue)}
              </Text>
            )}
          </View>
        )}
      </View>
      
      {status !== 'neutral' && (
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Elevation.card,
    minHeight: 100,
  },
  pressable: {
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
  },
  subtitle: {
    ...Typography.meta,
    marginTop: 2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  value: {
    ...Typography.sectionTitle,
    fontWeight: '700',
  },
  unit: {
    ...Typography.body,
    fontWeight: '400',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  trendIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  trendValue: {
    ...Typography.meta,
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
    borderTopRightRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  iconText: {
    fontSize: 24,
  },
});
