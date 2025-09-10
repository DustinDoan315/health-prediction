import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View
  } from 'react-native';
import { BorderRadius, Spacing, Typography } from '@/constants';
import { Colors } from '@/constants/Colors';
import { HealthDataMessage } from '@/src/domain/entities/ChatMessage';


interface HealthDataCardProps {
  message: HealthDataMessage;
  colors: any;
  animationValue?: Animated.Value;
}

const HealthDataCard: React.FC<HealthDataCardProps> = ({ message, colors, animationValue }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'good': return colors.healthGood;
      case 'warning': return colors.warning;
      case 'critical': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '';
    }
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'low': return colors.healthGood;
      case 'medium': return colors.warning;
      case 'high': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        animationValue && {
          opacity: animationValue,
          transform: [{
            translateY: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{message.title}</Text>
        {message.riskLevel && (
          <View style={[styles.riskBadge, { backgroundColor: getRiskColor(message.riskLevel) }]}>
            <Text style={styles.riskText}>{message.riskLevel.toUpperCase()}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.dataContainer}>
        {message.data.map((item, index) => (
          <View key={`${item.metric}-${index}`} style={styles.dataRow}>
            <View style={styles.metricInfo}>
              <Text style={[styles.metricName, { color: colors.text }]}>{item.metric}</Text>
              <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: colors.text }]}>
                  {item.value} {item.unit && <Text style={[styles.unit, { color: colors.textSecondary }]}>{item.unit}</Text>}
                </Text>
                {item.trend && (
                  <Text style={styles.trendIcon}>{getTrendIcon(item.trend)}</Text>
                )}
              </View>
            </View>
            {item.status && (
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    ...Colors.Elevation.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
  },
  riskBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  riskText: {
    ...Typography.caption,
    color: 'white',
    fontWeight: '600',
  },
  dataContainer: {
    gap: Spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricInfo: {
    flex: 1,
  },
  metricName: {
    ...Typography.caption,
    color: 'inherit',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  value: {
    ...Typography.body,
    fontWeight: '600',
  },
  unit: {
    ...Typography.caption,
    fontWeight: '400',
  },
  trendIcon: {
    marginLeft: Spacing.xs,
    fontSize: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
});

export default HealthDataCard;
