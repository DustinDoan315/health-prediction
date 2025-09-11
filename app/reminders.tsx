import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


interface Reminder {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isEnabled: boolean;
  time: string;
  frequency: 'daily' | 'weekly' | 'custom';
  days: string[];
  notificationId?: string;
}

const REMINDER_TYPES = [
  {
    type: 'medication',
    title: 'Medication',
    description: 'Take your prescribed medication',
    icon: '💊',
    color: '#F97316',
    defaultTime: '08:00',
  },
  {
    type: 'water',
    title: 'Water Intake',
    description: 'Stay hydrated throughout the day',
    icon: '💧',
    color: '#06B6D4',
    defaultTime: '09:00',
  },
  {
    type: 'exercise',
    title: 'Exercise',
    description: 'Time for your daily workout',
    icon: '🏃',
    color: '#84CC16',
    defaultTime: '18:00',
  },
  {
    type: 'sleep',
    title: 'Sleep',
    description: 'Wind down for bedtime',
    icon: '😴',
    color: '#8B5CF6',
    defaultTime: '22:00',
  },
  {
    type: 'meal',
    title: 'Meal',
    description: 'Time for your meal',
    icon: '🍽️',
    color: '#F59E0B',
    defaultTime: '12:00',
  },
  {
    type: 'vitamin',
    title: 'Vitamins',
    description: 'Take your daily vitamins',
    icon: '💊',
    color: '#EF4444',
    defaultTime: '10:00',
  },
] as const;

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Mon', short: 'M' },
  { key: 'tuesday', label: 'Tue', short: 'T' },
  { key: 'wednesday', label: 'Wed', short: 'W' },
  { key: 'thursday', label: 'Thu', short: 'T' },
  { key: 'friday', label: 'Fri', short: 'F' },
  { key: 'saturday', label: 'Sat', short: 'S' },
  { key: 'sunday', label: 'Sun', short: 'S' },
] as const;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const ReminderCard = ({ 
  reminder, 
  onToggle, 
  onEdit, 
  onDelete 
}: { 
  reminder: Reminder; 
  onToggle: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.reminderCard, { backgroundColor: colors.surface }]}>
      <View style={styles.reminderHeader}>
        <View style={[styles.reminderIcon, { backgroundColor: reminder.color }]}>
          <Text style={styles.reminderIconText}>{reminder.icon}</Text>
        </View>
        
        <View style={styles.reminderInfo}>
          <Text style={[styles.reminderTitle, { color: colors.text }]}>
            {reminder.title}
          </Text>
          <Text style={[styles.reminderDescription, { color: colors.textSecondary }]}>
            {reminder.description}
          </Text>
          <Text style={[styles.reminderTime, { color: colors.textSecondary }]}>
            {reminder.time} • {reminder.frequency}
          </Text>
        </View>

        <Switch
          value={reminder.isEnabled}
          onValueChange={() => onToggle(reminder.id)}
          trackColor={{ false: colors.border, true: reminder.color }}
          thumbColor={reminder.isEnabled ? '#FFFFFF' : colors.textSecondary}
        />
      </View>

      {reminder.isEnabled && (
        <View style={styles.reminderDays}>
          {DAYS_OF_WEEK.map((day) => (
            <View
              key={day.key}
              style={[
                styles.dayChip,
                {
                  backgroundColor: reminder.days.includes(day.key) ? reminder.color : colors.background,
                  borderColor: reminder.days.includes(day.key) ? reminder.color : colors.border,
                },
              ]}
            >
              <Text style={[
                styles.dayChipText,
                { 
                  color: reminder.days.includes(day.key) ? '#FFFFFF' : colors.textSecondary 
                }
              ]}>
                {day.short}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.reminderActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEdit(reminder)}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onDelete(reminder.id)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications to receive reminders.');
    }
  };

  const loadReminders = useCallback(() => {
    const defaultReminders: Reminder[] = REMINDER_TYPES.map((type, index) => ({
      id: `reminder_${index}`,
      title: type.title,
      description: type.description,
      icon: type.icon,
      color: type.color,
      isEnabled: false,
      time: type.defaultTime,
      frequency: 'daily',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    }));
    
    setReminders(defaultReminders);
  }, []);

  useEffect(() => {
    loadReminders();
    requestNotificationPermissions();
  }, [loadReminders]);

  const scheduleNotification = async (reminder: Reminder) => {
    if (!reminder.isEnabled) return;

    const [hourStr, minuteStr] = reminder.time.split(':');
    const hour = parseInt(hourStr || '0');
    const minute = parseInt(minuteStr || '0');

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.description,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });

    return notificationId;
  };

  const cancelNotification = async (notificationId: string) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  };

  const handleToggleReminder = useCallback(async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setReminders(prev => {
      const updated = prev.map(reminder => {
        if (reminder.id === id) {
          const updatedReminder = { ...reminder, isEnabled: !reminder.isEnabled };
          
          if (updatedReminder.isEnabled) {
            scheduleNotification(updatedReminder).then(notificationId => {
              if (notificationId) {
                setReminders(current => 
                  current.map(r => 
                    r.id === id ? { ...r, notificationId } : r
                  )
                );
              }
            });
          } else if (reminder.notificationId) {
            cancelNotification(reminder.notificationId);
          }
          
          return updatedReminder;
        }
        return reminder;
      });
      
      return updated;
    });
  }, []);

  const handleEditReminder = useCallback((reminder: Reminder) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Edit Reminder',
      'This feature will allow you to customize reminder settings.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleDeleteReminder = useCallback((id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setReminders(prev => {
              const reminder = prev.find(r => r.id === id);
              if (reminder?.notificationId) {
                cancelNotification(reminder.notificationId);
              }
              return prev.filter(r => r.id !== id);
            });
          },
        },
      ]
    );
  }, []);

  const handleAddReminder = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Add Custom Reminder',
      'This feature will allow you to create custom reminders.',
      [{ text: 'OK' }]
    );
  }, []);

  const enabledCount = reminders.filter(r => r.isEnabled).length;
  const totalCount = reminders.length;

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Health Reminders
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddReminder}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryCard}>
            <LinearGradient
              colors={['#3B82F6', '#60A5FA']}
              style={styles.summaryGradient}
            >
              <Text style={styles.summaryIcon}>🔔</Text>
              <Text style={styles.summaryTitle}>Active Reminders</Text>
              <Text style={styles.summaryNumber}>{enabledCount}</Text>
              <Text style={styles.summaryLabel}>of {totalCount} total</Text>
            </LinearGradient>
          </View>

          <View style={styles.remindersSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Reminders
            </Text>
            
            {reminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={handleToggleReminder}
                onEdit={handleEditReminder}
                onDelete={handleDeleteReminder}
              />
            ))}
          </View>

          <View style={styles.tipsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Tips for Better Health
            </Text>
            
            <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={[styles.tipTitle, { color: colors.text }]}>
                Stay Consistent
              </Text>
              <Text style={[styles.tipDescription, { color: colors.textSecondary }]}>
                Set reminders for the same time each day to build healthy habits.
              </Text>
            </View>

            <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
              <Text style={styles.tipIcon}>⏰</Text>
              <Text style={[styles.tipTitle, { color: colors.text }]}>
                Optimal Timing
              </Text>
              <Text style={[styles.tipDescription, { color: colors.textSecondary }]}>
                Take medications with meals and exercise in the morning for better results.
              </Text>
            </View>

            <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
              <Text style={styles.tipIcon}>📱</Text>
              <Text style={[styles.tipTitle, { color: colors.text }]}>
                Use Notifications
              </Text>
              <Text style={[styles.tipDescription, { color: colors.textSecondary }]}>
                Enable push notifications to never miss important health reminders.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.h1,
    fontWeight: '700',
    textAlign: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  summaryCard: {
    marginBottom: Spacing.xl,
  },
  summaryGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Elevation.card,
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  summaryTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  summaryNumber: {
    ...Typography.h1,
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 48,
  },
  summaryLabel: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  remindersSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  reminderCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Elevation.card,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  reminderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  reminderIconText: {
    fontSize: 24,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  reminderDescription: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  reminderTime: {
    ...Typography.caption,
    fontWeight: '600',
  },
  reminderDays: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  dayChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minWidth: 32,
    alignItems: 'center',
  },
  dayChipText: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  reminderActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    padding: Spacing.sm,
  },
  actionButtonText: {
    fontSize: 16,
  },
  tipsSection: {
    marginBottom: Spacing.xl,
  },
  tipCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...Elevation.card,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    marginTop: Spacing.xs,
  },
  tipTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    flex: 1,
  },
  tipDescription: {
    ...Typography.caption,
    lineHeight: Typography.caption.lineHeight,
    flex: 1,
  },
});
