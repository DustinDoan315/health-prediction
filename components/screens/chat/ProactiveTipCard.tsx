import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
  } from 'react-native';
import { BorderRadius, Spacing, Typography } from '@/constants';
import { Colors } from '@/constants/Colors';
import { ProactiveTipMessage } from '@/src/domain/entities/ChatMessage';


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
  onDismiss 
}) => {
  const getTipIcon = (tipType: string) => {
    switch (tipType) {
      case 'reminder': return '⏰';
      case 'alert': return '⚠️';
      case 'suggestion': return '💡';
      case 'achievement': return '🏆';
      default: return '💬';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const getTipBackgroundColor = (tipType: string) => {
    switch (tipType) {
      case 'reminder': return colors.primary + '20';
      case 'alert': return colors.error + '20';
      case 'suggestion': return colors.warning + '20';
      case 'achievement': return colors.healthGood + '20';
      default: return colors.background;
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
          transform: [{
            translateX: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getTipBackgroundColor(message.tipType) }]}>
          <Text style={styles.icon}>{getTipIcon(message.tipType)}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{message.title}</Text>
          <View style={styles.priorityContainer}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(message.priority) }]} />
            <Text style={[styles.priorityText, { color: colors.textSecondary }]}>
              {message.priority} priority
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Text style={[styles.dismissText, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.message, { color: colors.text }]}>{message.message}</Text>
      </View>

      {message.actionButton && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => onActionPress(message.actionButton!.action)}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionButtonText, { color: colors.surface }]}>
            {message.actionButton.text}
          </Text>
        </TouchableOpacity>
      )}
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
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
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
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    ...Typography.body,
    fontWeight: '600',
  },
});

export default ProactiveTipCard;
