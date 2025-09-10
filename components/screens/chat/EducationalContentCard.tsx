import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
  } from 'react-native';
import { BorderRadius, Spacing, Typography } from '@/constants';
import { Colors } from '@/constants/Colors';
import { EducationalContentMessage } from '@/src/domain/entities/ChatMessage';


interface EducationalContentCardProps {
  message: EducationalContentMessage;
  colors: any;
  animationValue?: Animated.Value;
  onQuizAnswer: (questionId: string, answer: number) => void;
  onLearnMore: () => void;
}

const EducationalContentCard: React.FC<EducationalContentCardProps> = ({ 
  message, 
  colors, 
  animationValue, 
  onQuizAnswer, 
  onLearnMore 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return '🥗';
      case 'exercise': return '🏃‍♂️';
      case 'mental-health': return '🧠';
      case 'prevention': return '🛡️';
      default: return '📚';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return colors.healthGood;
      case 'exercise': return colors.primary;
      case 'mental-health': return colors.secondary;
      case 'prevention': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    onQuizAnswer(message.quiz!.question, answerIndex);
  };

  const isCorrect = selectedAnswer === message.quiz?.correctAnswer;

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
              outputRange: [0.95, 1],
            }),
          }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(message.category) + '20' }]}>
          <Text style={styles.icon}>{getCategoryIcon(message.category)}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{message.title}</Text>
          <Text style={[styles.category, { color: colors.textSecondary }]}>
            {message.category.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>{message.content}</Text>
      </View>

      {message.quiz && (
        <View style={styles.quizContainer}>
          <Text style={[styles.quizTitle, { color: colors.text }]}>Quick Quiz</Text>
          <Text style={[styles.quizQuestion, { color: colors.text }]}>{message.quiz.question}</Text>
          
          <View style={styles.quizOptions}>
            {message.quiz.options.map((option, index) => (
              <TouchableOpacity
                key={`quiz-${option}-${index}`}
                style={[
                  styles.quizOption,
                  { 
                    backgroundColor: colors.background,
                    borderColor: selectedAnswer === index 
                      ? (isCorrect ? colors.healthGood : colors.error)
                      : colors.background,
                  }
                ]}
                onPress={() => handleQuizAnswer(index)}
                activeOpacity={0.7}
                disabled={showResult}
              >
                <Text 
                  style={[
                    styles.quizOptionText,
                    { 
                      color: selectedAnswer === index 
                        ? (isCorrect ? colors.healthGood : colors.error)
                        : colors.text 
                    }
                  ]}
                >
                  {option}
                </Text>
                {showResult && selectedAnswer === index && (
                  <Text style={styles.resultIcon}>
                    {isCorrect ? '✓' : '✗'}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {showResult && (
            <View style={[styles.resultContainer, { backgroundColor: (isCorrect ? colors.healthGood : colors.error) + '20' }]}>
              <Text style={[styles.resultText, { color: isCorrect ? colors.healthGood : colors.error }]}>
                {isCorrect ? 'Correct! 🎉' : `Incorrect. The right answer is: ${message.quiz.options[message.quiz.correctAnswer]}`}
              </Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.learnMoreButton, { backgroundColor: colors.primary }]}
        onPress={onLearnMore}
        activeOpacity={0.8}
      >
        <Text style={[styles.learnMoreText, { color: colors.surface }]}>Learn More</Text>
      </TouchableOpacity>
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
  category: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  content: {
    marginBottom: Spacing.md,
  },
  contentText: {
    ...Typography.body,
    lineHeight: Typography.body.lineHeight,
  },
  quizContainer: {
    marginBottom: Spacing.md,
  },
  quizTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  quizQuestion: {
    ...Typography.body,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  quizOptions: {
    gap: Spacing.sm,
  },
  quizOption: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizOptionText: {
    ...Typography.body,
    flex: 1,
  },
  resultIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  resultText: {
    ...Typography.body,
    fontWeight: '500',
    textAlign: 'center',
  },
  learnMoreButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  learnMoreText: {
    ...Typography.body,
    fontWeight: '600',
  },
});

export default EducationalContentCard;
