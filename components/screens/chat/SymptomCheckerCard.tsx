import { BorderRadius, Spacing, Typography } from '@/constants';
import { Elevation } from '@/constants/Colors';
import { SymptomCheckerMessage } from '@/src/domain/entities/ChatMessage';
import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SymptomCheckerCardProps {
  message: SymptomCheckerMessage;
  colors: any;
  animationValue?: Animated.Value;
  onAnswer: (questionId: string, answer: string) => void;
  onComplete: () => void;
}

const SymptomCheckerCard: React.FC<SymptomCheckerCardProps> = ({
  message,
  colors,
  animationValue,
  onAnswer,
  onComplete,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
    onAnswer(questionId, answer);
  };

  const currentQuestion = message.questions[message.currentStep - 1];
  const progress = (message.currentStep / message.totalSteps) * 100;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        animationValue && {
          opacity: animationValue,
          transform: [
            {
              scale: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Symptom Assessment
        </Text>
        <Text style={[styles.progress, { color: colors.textSecondary }]}>
          {message.currentStep} of {message.totalSteps}
        </Text>
      </View>

      <View
        style={[styles.progressBar, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${progress}%`,
            },
          ]}
        />
      </View>

      {currentQuestion && (
        <View style={styles.questionContainer}>
          <Text style={[styles.question, { color: colors.text }]}>
            {currentQuestion.question}
          </Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={`${currentQuestion.id}-${option}-${index}`}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: colors.background,
                    borderColor:
                      selectedAnswers[currentQuestion.id] === option
                        ? colors.primary
                        : colors.background,
                  },
                ]}
                onPress={() => handleAnswerSelect(currentQuestion.id, option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        selectedAnswers[currentQuestion.id] === option
                          ? colors.primary
                          : colors.text,
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {message.currentStep === message.totalSteps && (
        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: colors.primary }]}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={[styles.completeButtonText, { color: colors.surface }]}>
            Complete Assessment
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
    ...Elevation.card,
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
  progress: {
    ...Typography.caption,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questionContainer: {
    marginBottom: Spacing.md,
  },
  question: {
    ...Typography.body,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  optionButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
  },
  optionText: {
    ...Typography.body,
    textAlign: 'center',
  },
  completeButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  completeButtonText: {
    ...Typography.body,
    fontWeight: '600',
  },
});

export default SymptomCheckerCard;
