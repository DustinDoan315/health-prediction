import * as Haptics from 'expo-haptics';
import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
  } from '@/constants';
import { memo, useCallback } from 'react';
import { UIText } from '@/content';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


export type MoodValue = 'great' | 'good' | 'okay' | 'bad';

interface MoodCardProps {
  selectedMood: MoodValue | null;
  onMoodSelect: (mood: MoodValue) => void;
  isDark: boolean;
}

const MOOD_OPTIONS = [
  { value: 'great' as const, emoji: '😊', label: UIText.mood.great },
  { value: 'good' as const, emoji: '🙂', label: UIText.mood.good },
  { value: 'okay' as const, emoji: '😐', label: UIText.mood.okay },
  { value: 'bad' as const, emoji: '😔', label: UIText.mood.bad },
] as const;

const MoodCard = memo<MoodCardProps>(({ selectedMood, onMoodSelect, isDark }) => {
  const colors = Colors[isDark ? 'dark' : 'light'];

  const handleMoodSelect = useCallback((mood: MoodValue) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onMoodSelect(mood);
  }, [onMoodSelect]);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {UIText.home.today}
      </Text>
      <View style={[styles.moodCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.moodQuestion, { color: colors.text }]}>
          {UIText.home.moodQuestion}
        </Text>
        <View style={styles.moodOptions}>
          {MOOD_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.moodOption,
                { backgroundColor: selectedMood === option.value ? colors.primary : colors.background },
                selectedMood === option.value && styles.moodOptionSelected,
              ]}
              onPress={() => handleMoodSelect(option.value)}
            >
              <Text style={styles.moodEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.moodLabel,
                { color: selectedMood === option.value ? colors.surface : colors.textSecondary }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
});

MoodCard.displayName = 'MoodCard';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  moodCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Elevation.card,
  },
  moodQuestion: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodOption: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 70,
  },
  moodOptionSelected: {
    ...Elevation.card,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    ...Typography.caption,
    fontWeight: '500',
  },
});

export default MoodCard;
