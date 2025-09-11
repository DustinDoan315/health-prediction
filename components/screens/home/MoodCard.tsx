import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants';
import { UIText } from '@/content';
import * as Haptics from 'expo-haptics';
import { memo, useCallback, useRef } from 'react';

import {
    Animated,
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

interface AnimatedMoodOptionProps {
  option: { value: MoodValue; emoji: string; label: string };
  isSelected: boolean;
  colors: any;
  onPress: (mood: MoodValue) => void;
}

const AnimatedMoodOption = memo<AnimatedMoodOptionProps>(({ option, isSelected, colors, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1.05,
        tension: 400,
        friction: 20,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 300,
        friction: 25,
        useNativeDriver: true,
      }),
    ]).start();
    
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress(option.value);
  };

  return (
    <Animated.View style={{
      transform: [{ scale }],
      opacity,
    }}>
      <TouchableOpacity
        style={[
          styles.moodOption,
          { backgroundColor: isSelected ? colors.primary : colors.background },
          isSelected && styles.moodOptionSelected,
        ]}
        onPress={handlePress}
      >
        <Text style={styles.moodEmoji}>{option.emoji}</Text>
        <Text style={[
          styles.moodLabel,
          { color: isSelected ? colors.surface : colors.textSecondary }
        ]}>
          {option.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

AnimatedMoodOption.displayName = 'AnimatedMoodOption';

const MoodCard = memo<MoodCardProps>(({ selectedMood, onMoodSelect, isDark }) => {
  const colors = Colors[isDark ? 'dark' : 'light'];
  const liftAnim = useRef(new Animated.Value(0)).current;

  const handleMoodSelect = useCallback((mood: MoodValue) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(liftAnim, {
        toValue: -4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(liftAnim, {
        toValue: -6,
        tension: 200,
        friction: 15,
        useNativeDriver: true,
      }),
      Animated.spring(liftAnim, {
        toValue: -4,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }),
    ]).start();
    
    onMoodSelect(mood);
  }, [onMoodSelect, liftAnim]);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {UIText.home.today}
      </Text>
      <Animated.View style={[
        styles.moodCard, 
        { backgroundColor: colors.surface },
        { transform: [{ translateY: liftAnim }] }
      ]}>
        <Text style={[styles.moodQuestion, { color: colors.text }]}>
          {UIText.home.moodQuestion}
        </Text>
        <View style={styles.moodOptions}>
          {MOOD_OPTIONS.map((option) => (
            <AnimatedMoodOption
              key={option.value}
              option={option}
              isSelected={selectedMood === option.value}
              colors={colors}
              onPress={handleMoodSelect}
            />
          ))}
        </View>
      </Animated.View>
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
