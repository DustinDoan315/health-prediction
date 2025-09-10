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

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
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

interface AnimatedMoodOptionProps {
  option: { value: MoodValue; emoji: string; label: string };
  isSelected: boolean;
  colors: any;
  onPress: (mood: MoodValue) => void;
}

const AnimatedMoodOption = memo<AnimatedMoodOptionProps>(({ option, isSelected, colors, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    // More sophisticated press animation
    scale.value = withSequence(
      withTiming(0.92, { duration: 100 }),
      withSpring(1.05, { damping: 20, stiffness: 400 }),
      withSpring(1, { damping: 25, stiffness: 300 })
    );
    
    opacity.value = withSequence(
      withTiming(0.7, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );
    
    onPress(option.value);
  };

  return (
    <Animated.View style={animatedStyle}>
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
  const liftAnim = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.12);

  const handleMoodSelect = useCallback((mood: MoodValue) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Lift animation when mood is selected
    liftAnim.value = withSequence(
      withTiming(-4, { duration: 150 }),
      withSpring(-6, { damping: 15, stiffness: 200 }),
      withSpring(-4, { damping: 20, stiffness: 300 })
    );
    
    shadowOpacity.value = withSequence(
      withTiming(0.20, { duration: 150 }),
      withSpring(0.24, { damping: 15, stiffness: 200 }),
      withSpring(0.20, { damping: 20, stiffness: 300 })
    );
    
    onMoodSelect(mood);
  }, [onMoodSelect]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: liftAnim.value }],
    shadowOpacity: shadowOpacity.value,
    shadowOffset: { width: 0, height: Math.abs(liftAnim.value) + 4 },
    shadowRadius: Math.abs(liftAnim.value) + 8,
    elevation: Math.abs(liftAnim.value) + 4,
  }));

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {UIText.home.today}
      </Text>
      <Animated.View style={[styles.moodCard, { backgroundColor: colors.surface }, cardAnimatedStyle]}>
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
