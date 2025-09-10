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
import { MedicationReminderMessage } from '@/src/domain/entities/ChatMessage';


interface MedicationReminderCardProps {
  message: MedicationReminderMessage;
  colors: any;
  animationValue?: Animated.Value;
  onMarkComplete: (reminderId: string) => void;
  onSnooze: (reminderId: string) => void;
}

const MedicationReminderCard: React.FC<MedicationReminderCardProps> = ({ 
  message, 
  colors, 
  animationValue, 
  onMarkComplete, 
  onSnooze 
}) => {
  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        animationValue && {
          opacity: animationValue,
          transform: [{
            translateX: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.icon}>💊</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Medication Reminder</Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>{message.time}</Text>
        </View>
        {message.isCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: colors.healthGood }]}>
            <Text style={styles.completedText}>✓</Text>
          </View>
        )}
      </View>

      <View style={styles.medicationInfo}>
        <Text style={[styles.medicationName, { color: colors.text }]}>{message.medication}</Text>
        <Text style={[styles.dosage, { color: colors.textSecondary }]}>{message.dosage}</Text>
      </View>

      {!message.isCompleted && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton, { backgroundColor: colors.healthGood }]}
            onPress={() => onMarkComplete(message.reminderId)}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, { color: 'white' }]}>Mark Taken</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.snoozeButton, { backgroundColor: colors.background }]}
            onPress={() => onSnooze(message.reminderId)}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Snooze 15min</Text>
          </TouchableOpacity>
        </View>
      )}

      {message.isCompleted && (
        <View style={[styles.completedMessage, { backgroundColor: colors.healthGood + '20' }]}>
          <Text style={[styles.completedMessageText, { color: colors.healthGood }]}>
            Medication taken successfully! 🎉
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
  time: {
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
  medicationInfo: {
    marginBottom: Spacing.md,
  },
  medicationName: {
    ...Typography.body,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  dosage: {
    ...Typography.caption,
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
  completeButton: {
    // backgroundColor set dynamically
  },
  snoozeButton: {
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
  },
  completedMessageText: {
    ...Typography.body,
    fontWeight: '500',
  },
});

export default MedicationReminderCard;
