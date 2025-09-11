import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LogType } from '@/src/domain/entities';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';


interface LogEntry {
  id: string;
  type: LogType;
  value: number;
  unit: string;
  notes: string;
  loggedAt: Date;
}

const LOG_TYPES = [
  {
    type: LogType.WEIGHT,
    label: 'Weight',
    icon: '⚖️',
    unit: 'kg',
    placeholder: '70.5',
    color: '#3B82F6',
  },
  {
    type: LogType.BLOOD_PRESSURE,
    label: 'Blood Pressure',
    icon: '🩸',
    unit: 'mmHg',
    placeholder: '120/80',
    color: '#EF4444',
  },
  {
    type: LogType.STEPS,
    label: 'Steps',
    icon: '👟',
    unit: 'steps',
    placeholder: '8500',
    color: '#10B981',
  },
  {
    type: LogType.HEART_RATE,
    label: 'Heart Rate',
    icon: '❤️',
    unit: 'bpm',
    placeholder: '72',
    color: '#F59E0B',
  },
  {
    type: LogType.SLEEP,
    label: 'Sleep',
    icon: '😴',
    unit: 'hours',
    placeholder: '7.5',
    color: '#8B5CF6',
  },
  {
    type: LogType.WATER_INTAKE,
    label: 'Water Intake',
    icon: '💧',
    unit: 'glasses',
    placeholder: '8',
    color: '#06B6D4',
  },
  {
    type: LogType.EXERCISE,
    label: 'Exercise',
    icon: '🏃',
    unit: 'minutes',
    placeholder: '30',
    color: '#84CC16',
  },
  {
    type: LogType.MEDICATION,
    label: 'Medication',
    icon: '💊',
    unit: 'doses',
    placeholder: '1',
    color: '#F97316',
  },
] as const;

export default function HealthLogbookScreen() {
  const [selectedType, setSelectedType] = useState<LogType>(LogType.WEIGHT);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const selectedLogType = LOG_TYPES.find(lt => lt.type === selectedType) || LOG_TYPES[0];

  const handleTypeSelect = useCallback((type: LogType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedType(type);
    setValue('');
    setNotes('');
  }, []);

  const handleLogEntry = useCallback(async () => {
    if (!value.trim()) {
      Alert.alert('Invalid Input', 'Please enter a value for your log entry.');
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        throw new Error('Please enter a valid number');
      }

      const newLog: LogEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        type: selectedType,
        value: numericValue,
        unit: selectedLogType.unit,
        notes: notes.trim(),
        loggedAt: new Date(),
      };

      setLogs(prev => [newLog, ...prev]);
      setValue('');
      setNotes('');
      
      Alert.alert('Success', 'Health data logged successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to log data');
    } finally {
      setIsLoading(false);
    }
  }, [value, selectedType, selectedLogType.unit, notes]);

  const handleDeleteLog = useCallback((logId: string) => {
    Alert.alert(
      'Delete Log Entry',
      'Are you sure you want to delete this log entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setLogs(prev => prev.filter(log => log.id !== logId));
          },
        },
      ]
    );
  }, []);

  const getRecentLogs = useCallback((type: LogType, limit: number = 3) => {
    return logs
      .filter(log => log.type === type)
      .slice(0, limit)
      .sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
  }, [logs]);

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
                Health Logbook
              </Text>
              <View style={styles.placeholder} />
            </View>

            <LinearGradient
              colors={['#FFFFFF', '#F1F5F9', '#E2E8F0']}
              style={styles.formCard}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Log Health Data
              </Text>

              <View style={styles.typeSelector}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.typeScrollContent}
                >
                  {LOG_TYPES.map((logType) => (
                    <TouchableOpacity
                      key={logType.type}
                      style={[
                        styles.typeOption,
                        {
                          backgroundColor: selectedType === logType.type ? logType.color : colors.surface,
                          borderColor: selectedType === logType.type ? logType.color : colors.border,
                        },
                      ]}
                      onPress={() => handleTypeSelect(logType.type)}
                    >
                      <Text style={styles.typeIcon}>{logType.icon}</Text>
                      <Text style={[
                        styles.typeLabel,
                        { color: selectedType === logType.type ? '#FFFFFF' : colors.text }
                      ]}>
                        {logType.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  {selectedLogType.label} ({selectedLogType.unit})
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                  value={value}
                  onChangeText={setValue}
                  placeholder={selectedLogType.placeholder}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Notes (Optional)
                </Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text }]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any additional notes..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.logButton, 
                  { 
                    backgroundColor: selectedLogType.color,
                    opacity: isLoading ? 0.7 : 1,
                  }
                ]} 
                onPress={handleLogEntry}
                disabled={isLoading}
              >
                <Text style={[styles.logButtonText, { color: '#FFFFFF' }]}>
                  {isLoading ? 'Logging...' : 'Log Entry'}
                </Text>
                <Text style={[styles.logButtonIcon, { color: '#FFFFFF' }]}>📝</Text>
              </TouchableOpacity>
            </LinearGradient>

            {logs.length > 0 && (
              <View style={styles.recentLogsSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Recent Entries
                </Text>

                {LOG_TYPES.map((logType) => {
                  const recentLogs = getRecentLogs(logType.type);
                  if (recentLogs.length === 0) return null;

                  return (
                    <View key={logType.type} style={[styles.logTypeCard, { backgroundColor: colors.surface }]}>
                      <View style={styles.logTypeHeader}>
                        <Text style={styles.logTypeIcon}>{logType.icon}</Text>
                        <Text style={[styles.logTypeTitle, { color: colors.text }]}>
                          {logType.label}
                        </Text>
                      </View>

                      {recentLogs.map((log) => (
                        <View key={log.id} style={styles.logEntry}>
                          <View style={styles.logEntryInfo}>
                            <Text style={[styles.logValue, { color: colors.text }]}>
                              {log.value} {log.unit}
                            </Text>
                            <Text style={[styles.logDate, { color: colors.textSecondary }]}>
                              {log.loggedAt.toLocaleDateString()} at {log.loggedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                            {log.notes && (
                              <Text style={[styles.logNotes, { color: colors.textSecondary }]}>
                                {log.notes}
                              </Text>
                            )}
                          </View>
                          <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => handleDeleteLog(log.id)}
                          >
                            <Text style={styles.deleteButtonText}>🗑️</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
    flexGrow: 1,
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
  placeholder: {
    width: 44,
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: -Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    ...Elevation.card,
  },
  sectionTitle: {
    ...Typography.h3,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  typeSelector: {
    marginBottom: Spacing.xl,
  },
  typeScrollContent: {
    paddingHorizontal: Spacing.sm,
  },
  typeOption: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    marginHorizontal: Spacing.sm,
    minWidth: 80,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  typeLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textArea: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
    ...Elevation.modal,
  },
  logButtonText: {
    ...Typography.body,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  logButtonIcon: {
    fontSize: 20,
  },
  recentLogsSection: {
    marginTop: Spacing.xl,
  },
  logTypeCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Elevation.card,
  },
  logTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logTypeIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  logTypeTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  logEntryInfo: {
    flex: 1,
  },
  logValue: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  logDate: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  logNotes: {
    ...Typography.caption,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  deleteButtonText: {
    fontSize: 16,
  },
});
