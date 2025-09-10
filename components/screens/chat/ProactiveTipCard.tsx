import { BorderRadius, Spacing, Typography } from '@/constants';
import { ProactiveTipMessage } from '@/src/domain/entities/ChatMessage';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProactiveTipCardProps {
  message: ProactiveTipMessage;
  colors: any;
  animationValue?: Animated.Value;
  onActionPress: (action: string) => void;
  onDismiss: () => void;
}

const ProactiveTipCard: React.FC<ProactiveTipCardProps> = ({
  message,
  colors,
  animationValue,
  onActionPress,
  onDismiss,
}) => {
  const getTipIcon = (tipType: string) => {
    switch (tipType) {
      case 'reminder':
        return '⏰';
      case 'alert':
        return '⚠️';
      case 'suggestion':
        return '💡';
      case 'achievement':
        return '🏆';
      default:
        return '💬';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getTipBackgroundColor = (tipType: string) => {
    switch (tipType) {
      case 'reminder':
        return colors.primary + '20';
      case 'alert':
        return colors.error + '20';
      case 'suggestion':
        return colors.warning + '20';
      case 'achievement':
        return colors.healthGood + '20';
      default:
        return colors.background;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderLeftColor: getPriorityColor(message.priority),
          borderLeftWidth: 4,
        },
        animationValue && {
          opacity: animationValue,
          transform: [
            {
              translateX: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getTipBackgroundColor(message.tipType) },
          ]}
        >
          <Text style={styles.icon}>{getTipIcon(message.tipType)}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>
            {message.title}
          </Text>
          <View style={styles.priorityContainer}>
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: getPriorityColor(message.priority) },
              ]}
            />
            <Text
              style={[styles.priorityText, { color: colors.textSecondary }]}
            >
              {message.priority} priority
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Text style={[styles.dismissText, { color: colors.textSecondary }]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.message, { color: colors.text }]}>
          {message.message}
        </Text>
      </View>

      {message.actionButton && (
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.actionButton}
        >
          <TouchableOpacity
            style={styles.actionButtonInner}
            onPress={() => onActionPress(message.actionButton!.action)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>
              {message.actionButton.text}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  priorityText: {
    ...Typography.caption,
  },
  dismissButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    marginBottom: Spacing.md,
  },
  message: {
    ...Typography.body,
    lineHeight: Typography.body.lineHeight,
  },
  actionButton: {
    borderRadius: BorderRadius.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonInner: {
    padding: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  actionButtonText: {
    ...Typography.body,
    fontWeight: '700',
    color: 'white',
  },
});

export default ProactiveTipCard;
