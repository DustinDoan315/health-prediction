import { BorderRadius, Spacing, Typography } from '@/constants';
import { Colors, Elevation } from '@/constants/Colors';
import { UIText } from '@/content';
import { useAppSelector } from '@/hooks';
import { ChatMessage } from '@/src/domain/entities/ChatMessage';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EducationalContentCard from './EducationalContentCard';
import EnhancedInputBar from './EnhancedInputBar';
import GoalTrackingCard from './GoalTrackingCard';
import HealthDataCard from './HealthDataCard';
import MedicationReminderCard from './MedicationReminderCard';
import ProactiveTipCard from './ProactiveTipCard';
import SymptomCheckerCard from './SymptomCheckerCard';
import VoiceMessageCard from './VoiceMessageCard';

interface EnhancedChatScreenProps {
  onSendMessage: (message: string) => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  onImageUpload: (imageUri: string) => void;
  onFileUpload: (fileUri: string) => void;
}

const EnhancedChatScreen: React.FC<EnhancedChatScreenProps> = ({
  onSendMessage,
  onVoiceStart,
  onVoiceStop,
  onImageUpload,
  onFileUpload,
}) => {
  const { isDark } = useAppSelector(state => state.theme);
  const colors = Colors[isDark ? 'dark' : 'light'];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'text',
      text: "Hello! I'm your AI health assistant. I can help you with health assessments, medication reminders, goal tracking, and much more. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'proactive-tip',
      title: 'Daily Health Check',
      message:
        "It's been a while since your last health assessment. Would you like to do a quick checkup?",
      tipType: 'suggestion',
      priority: 'medium',
      actionButton: {
        text: 'Start Assessment',
        action: 'start-assessment',
      },
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const messageAnimations = useRef<Map<string, Animated.Value>>(new Map());

  const createMessageAnimation = useCallback((messageId: string) => {
    const animation = new Animated.Value(0);
    messageAnimations.current.set(messageId, animation);

    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    return animation;
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'text',
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    createMessageAnimation(userMessage.id);
    onSendMessage(inputText.trim());
  }, [inputText, isLoading, onSendMessage, createMessageAnimation]);

  const handleSymptomCheckerAnswer = useCallback(
    (questionId: string, answer: string) => {
      setMessages(prev =>
        prev.map(msg => {
          if (msg.type === 'symptom-checker' && msg.id === questionId) {
            return {
              ...msg,
              questions: msg.questions.map(q =>
                q.id === questionId ? { ...q, selected: answer } : q
              ),
            };
          }
          return msg;
        })
      );
    },
    []
  );

  const handleSymptomCheckerComplete = useCallback(() => {
    const assessmentMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'text',
      text: 'Thank you for completing the symptom assessment. Based on your responses, I recommend consulting with a healthcare professional for further evaluation.',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assessmentMessage]);
    createMessageAnimation(assessmentMessage.id);
  }, [createMessageAnimation]);

  const handleMedicationComplete = useCallback((reminderId: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (
          msg.type === 'medication-reminder' &&
          msg.reminderId === reminderId
        ) {
          return { ...msg, isCompleted: true };
        }
        return msg;
      })
    );
  }, []);

  const handleMedicationSnooze = useCallback((reminderId: string) => {
    // Implement snooze logic
    console.log('Snoozing medication:', reminderId);
  }, []);

  const handleGoalProgressUpdate = useCallback(
    (goalId: string, newProgress: number) => {
      setMessages(prev =>
        prev.map(msg => {
          if (msg.type === 'goal-tracking' && msg.goal.id === goalId) {
            return { ...msg, progress: newProgress };
          }
          return msg;
        })
      );
    },
    []
  );

  const handleGoalViewDetails = useCallback((goalId: string) => {
    console.log('Viewing goal details:', goalId);
  }, []);

  const handleVoicePlay = useCallback(() => {
    console.log('Playing voice message');
  }, []);

  const handleVoiceStop = useCallback(() => {
    console.log('Stopping voice message');
  }, []);

  const handleVoiceRetry = useCallback(() => {
    console.log('Retrying voice message');
  }, []);

  const handleProactiveAction = useCallback(
    (action: string) => {
      if (action === 'start-assessment') {
        const symptomCheckerMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'symptom-checker',
          symptoms: ['headache', 'fatigue'],
          questions: [
            {
              id: 'q1',
              question: 'How would you rate your energy level today?',
              options: ['Very low', 'Low', 'Moderate', 'High', 'Very high'],
            },
            {
              id: 'q2',
              question: 'Have you experienced any headaches recently?',
              options: ['No', 'Mild', 'Moderate', 'Severe'],
            },
          ],
          currentStep: 1,
          totalSteps: 2,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, symptomCheckerMessage]);
        createMessageAnimation(symptomCheckerMessage.id);
      }
    },
    [createMessageAnimation]
  );

  const handleProactiveDismiss = useCallback(() => {
    console.log('Dismissing proactive tip');
  }, []);

  const handleQuizAnswer = useCallback((questionId: string, answer: number) => {
    console.log('Quiz answer:', questionId, answer);
  }, []);

  const handleLearnMore = useCallback(() => {
    console.log('Learn more clicked');
  }, []);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const animation =
        messageAnimations.current.get(item.id) ||
        createMessageAnimation(item.id);

      switch (item.type) {
        case 'text':
          return (
            <Animated.View
              style={[
                styles.messageContainer,
                item.isUser ? styles.userMessage : styles.aiMessage,
                {
                  opacity: animation,
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  item.isUser
                    ? [styles.userBubble, { backgroundColor: colors.primary }]
                    : [styles.aiBubble, { backgroundColor: colors.surface }],
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.isUser
                      ? [styles.userText, { color: colors.surface }]
                      : [styles.aiText, { color: colors.text }],
                  ]}
                >
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.timestamp,
                    item.isUser
                      ? [
                          styles.userTimestamp,
                          { color: 'rgba(255, 255, 255, 0.7)' },
                        ]
                      : [styles.aiTimestamp, { color: colors.textSecondary }],
                  ]}
                >
                  {item.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </Animated.View>
          );

        case 'health-data':
          return (
            <HealthDataCard
              message={item}
              colors={colors}
              animationValue={animation}
            />
          );

        case 'symptom-checker':
          return (
            <SymptomCheckerCard
              message={item}
              colors={colors}
              animationValue={animation}
              onAnswer={handleSymptomCheckerAnswer}
              onComplete={handleSymptomCheckerComplete}
            />
          );

        case 'medication-reminder':
          return (
            <MedicationReminderCard
              message={item}
              colors={colors}
              animationValue={animation}
              onMarkComplete={handleMedicationComplete}
              onSnooze={handleMedicationSnooze}
            />
          );

        case 'goal-tracking':
          return (
            <GoalTrackingCard
              message={item}
              colors={colors}
              animationValue={animation}
              onUpdateProgress={handleGoalProgressUpdate}
              onViewDetails={handleGoalViewDetails}
            />
          );

        case 'voice':
          return (
            <VoiceMessageCard
              message={item}
              colors={colors}
              animationValue={animation}
              onPlay={handleVoicePlay}
              onStop={handleVoiceStop}
              onRetry={handleVoiceRetry}
            />
          );

        case 'proactive-tip':
          return (
            <ProactiveTipCard
              message={item}
              colors={colors}
              animationValue={animation}
              onActionPress={handleProactiveAction}
              onDismiss={handleProactiveDismiss}
            />
          );

        case 'educational':
          return (
            <EducationalContentCard
              message={item}
              colors={colors}
              animationValue={animation}
              onQuizAnswer={handleQuizAnswer}
              onLearnMore={handleLearnMore}
            />
          );

        default:
          return null;
      }
    },
    [
      colors,
      createMessageAnimation,
      handleSymptomCheckerAnswer,
      handleSymptomCheckerComplete,
      handleMedicationComplete,
      handleMedicationSnooze,
      handleGoalProgressUpdate,
      handleGoalViewDetails,
      handleVoicePlay,
      handleVoiceStop,
      handleVoiceRetry,
      handleProactiveAction,
      handleProactiveDismiss,
      handleQuizAnswer,
      handleLearnMore,
    ]
  );

  const quickActions = [
    {
      id: 'health-check',
      title: 'Health Check',
      icon: '🔍',
      action: 'start-assessment',
    },
    {
      id: 'medication',
      title: 'Medication',
      icon: '💊',
      action: 'medication-reminder',
    },
    { id: 'goals', title: 'Goals', icon: '🎯', action: 'goal-tracking' },
    {
      id: 'education',
      title: 'Learn',
      icon: '📚',
      action: 'educational-content',
    },
  ];

  const handleQuickAction = useCallback(
    (action: string) => {
      switch (action) {
        case 'start-assessment':
          handleProactiveAction('start-assessment');
          break;
        case 'medication-reminder': {
          const medicationMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'medication-reminder',
            medication: 'Vitamin D',
            dosage: '1000 IU',
            time: '9:00 AM',
            isCompleted: false,
            reminderId: 'med-1',
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, medicationMessage]);
          createMessageAnimation(medicationMessage.id);
          break;
        }
        case 'goal-tracking': {
          const goalMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'goal-tracking',
            goal: {
              id: 'goal-1',
              title: 'Daily Steps',
              description: 'Walk 10,000 steps daily',
              target: 10000,
              current: 7500,
              unit: 'steps',
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            progress: 7500,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, goalMessage]);
          createMessageAnimation(goalMessage.id);
          break;
        }
        case 'educational-content': {
          const educationMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'educational',
            title: 'Importance of Hydration',
            content:
              'Staying hydrated is crucial for maintaining optimal health. Water helps regulate body temperature, supports digestion, and keeps your skin healthy.',
            category: 'nutrition',
            quiz: {
              question: 'How much water should an average adult drink daily?',
              options: [
                '6-8 glasses',
                '10-12 glasses',
                '4-6 glasses',
                '12-14 glasses',
              ],
              correctAnswer: 0,
            },
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, educationMessage]);
          createMessageAnimation(educationMessage.id);
          break;
        }
      }
    },
    [handleProactiveAction, createMessageAnimation]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {UIText.chat.title}
        </Text>
        <View style={styles.statusContainer}>
          <View
            style={[styles.statusDot, { backgroundColor: colors.healthGood }]}
          />
          <Text style={[styles.statusText, { color: colors.healthGood }]}>
            {UIText.chat.online}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: Platform.OS === 'ios' ? 20 : 10 },
          ]}
          onContentSizeChange={() => {
            setTimeout(
              () => flatListRef.current?.scrollToEnd({ animated: true }),
              100
            );
          }}
          onLayout={() => {
            setTimeout(
              () => flatListRef.current?.scrollToEnd({ animated: false }),
              100
            );
          }}
          showsVerticalScrollIndicator={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
        />

        {messages.length <= 2 && !isLoading && (
          <View
            style={[
              styles.quickActionsContainer,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.background,
              },
            ]}
          >
            <Text style={[styles.quickActionsTitle, { color: colors.text }]}>
              Quick Actions
            </Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map(action => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.quickActionButton,
                    { backgroundColor: colors.background },
                  ]}
                  onPress={() => handleQuickAction(action.action)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                  <Text
                    style={[styles.quickActionText, { color: colors.primary }]}
                  >
                    {action.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <EnhancedInputBar
          inputText={inputText}
          setInputText={setInputText}
          onSend={handleSendMessage}
          onVoiceStart={onVoiceStart}
          onVoiceStop={onVoiceStop}
          onImageUpload={onImageUpload}
          onFileUpload={onFileUpload}
          colors={colors}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 90 : 65,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...Typography.h3,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  messagesContent: {
    paddingVertical: Spacing.md,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: Spacing.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  userBubble: {
    borderBottomRightRadius: BorderRadius.sm,
  },
  aiBubble: {
    borderBottomLeftRadius: BorderRadius.sm,
    ...Elevation.card,
  },
  messageText: {
    ...Typography.body,
    lineHeight: Typography.body.lineHeight,
  },
  userText: {
    // Color set dynamically
  },
  aiText: {
    // Color set dynamically
  },
  timestamp: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  userTimestamp: {
    textAlign: 'right',
  },
  aiTimestamp: {
    // Color set dynamically
  },
  quickActionsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  quickActionsTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minWidth: 80,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  quickActionText: {
    ...Typography.caption,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default EnhancedChatScreen;
