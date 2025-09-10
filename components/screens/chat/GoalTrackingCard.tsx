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
import { GoalTrackingMessage } from '@/src/domain/entities/ChatMessage';


interface GoalTrackingCardProps {
  message: GoalTrackingMessage;
  colors: any;
  animationValue?: Animated.Value;
  onUpdateProgress: (goalId: string, newProgress: number) => void;
  onViewDetails: (goalId: string) => void;
}

const GoalTrackingCard: React.FC<GoalTrackingCardProps> = ({ 
  message, 
  colors, 
  animationValue, 
  onUpdateProgress, 
  onViewDetails 
}) => {
  const progressPercentage = (message.progress / message.goal.target) * 100;
  const isCompleted = message.progress >= message.goal.target;

  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        animationValue && {
          opacity: animationValue,
          transform: [{
            scale: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            }),
          }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.icon}>🎯</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{message.goal.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {message.goal.description}
          </Text>
        </View>
        {isCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: colors.healthGood }]}>
            <Text style={styles.completedText}>✓</Text>
          </View>
        )}
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: colors.text }]}>
            {message.progress} / {message.goal.target} {message.goal.unit}
          </Text>
          <Text style={[styles.percentage, { color: colors.primary }]}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>

        <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: isCompleted ? colors.healthGood : colors.primary,
                width: `${Math.min(progressPercentage, 100)}%`,
              }
            ]} 
          />
        </View>

        {message.goal.deadline && (
          <Text style={[styles.deadline, { color: colors.textSecondary }]}>
            Deadline: {message.goal.deadline.toLocaleDateString()}
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.updateButton, { backgroundColor: colors.primary }]}
          onPress={() => onUpdateProgress(message.goal.id, message.progress + 1)}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionButtonText, { color: colors.surface }]}>+1 Progress</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.detailsButton, { backgroundColor: colors.background }]}
          onPress={() => onViewDetails(message.goal.id)}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionButtonText, { color: colors.text }]}>View Details</Text>
        </TouchableOpacity>
      </View>

      {isCompleted && (
        <View style={[styles.completedMessage, { backgroundColor: colors.healthGood + '20' }]}>
          <Text style={[styles.completedMessageText, { color: colors.healthGood }]}>
            🎉 Goal completed! Great job!
          </Text>
        </View>
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
  description: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressText: {
    ...Typography.body,
    fontWeight: '500',
  },
  percentage: {
    ...Typography.body,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  deadline: {
    ...Typography.caption,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  updateButton: {
    // backgroundColor set dynamically
  },
  detailsButton: {
    // backgroundColor set dynamically
  },
  actionButtonText: {
    ...Typography.body,
    fontWeight: '600',
  },
  completedMessage: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  completedMessageText: {
    ...Typography.body,
    fontWeight: '500',
  },
});

export default GoalTrackingCard;
