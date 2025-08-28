import {
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography
} from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AIChatResponse, apiService } from '@/services/api';
import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';



interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI health assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const startTypingAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [typingAnimation]);

  const stopTypingAnimation = useCallback(() => {
    typingAnimation.stopAnimation();
    typingAnimation.setValue(0);
  }, [typingAnimation]);



  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const currentMessage = inputText.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    startTypingAnimation();

    // Show typing indicator
    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response: AIChatResponse = await apiService.chatWithAI({
        prompt: currentMessage,
        system_prompt: 'You are a helpful health assistant. Provide accurate, helpful health advice while encouraging users to consult healthcare professionals for serious concerns. Keep responses concise and actionable.',
        max_tokens: 1000,
        temperature: 0.7,
      });

      // Remove typing indicator and add actual response
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => !msg.isTyping);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response.response,
          isUser: false,
          timestamp: new Date(),
        };
        return [...withoutTyping, aiMessage];
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => !msg.isTyping);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I\'m having trouble responding right now. Please try again later.',
          isUser: false,
          timestamp: new Date(),
        };
        return [...withoutTyping, errorMessage];
      });
    } finally {
      setIsLoading(false);
      stopTypingAnimation();
    }
  }, [inputText, isLoading, startTypingAnimation, stopTypingAnimation]);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => {
    if (item.isTyping) {
      return (
        <View style={[styles.messageContainer, styles.aiMessage]}>
          <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: colors.surface }]}>
            <View style={styles.typingIndicator}>
              <Animated.View
                style={[
                  styles.typingDot,
                  {
                    backgroundColor: colors.textSecondary,
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 1, 0.3],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.typingDot,
                  {
                    backgroundColor: colors.textSecondary,
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 0.3, 0.8, 1],
                      outputRange: [0.3, 0.3, 1, 0.3],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.typingDot,
                  {
                    backgroundColor: colors.textSecondary,
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [0.3, 0.3, 1],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage
      ]}>
        <View style={[
          styles.messageBubble,
          item.isUser ? [styles.userBubble, { backgroundColor: colors.primary }] : [styles.aiBubble, { backgroundColor: colors.surface }]
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? [styles.userText, { color: colors.surface }] : [styles.aiText, { color: colors.text }]
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            item.isUser ? [styles.userTimestamp, { color: 'rgba(255, 255, 255, 0.7)' }] : [styles.aiTimestamp, { color: colors.textSecondary }]
          ]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  }, [typingAnimation, colors]);

  const quickQuestions = [
    "What are healthy BMI ranges?",
    "How can I lower my blood pressure?",
    "What's a good exercise routine?",
    "How to improve my diet?",
    "Signs of high cholesterol?",
    "Benefits of regular exercise?",
  ];

  const handleQuickQuestion = useCallback((question: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText(question);
  }, []);



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>AI Health Assistant</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: colors.healthGood }]} />
          <Text style={[styles.statusText, { color: colors.healthGood }]}>Online</Text>
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
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: Platform.OS === 'ios' ? 20 : 10 }
          ]}
          onContentSizeChange={() => {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
          }}
          onLayout={() => {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
          }}
          showsVerticalScrollIndicator={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
        />

        {messages.length <= 1 && !isLoading && (
          <View style={[styles.quickQuestionsContainer, { backgroundColor: colors.surface, borderTopColor: colors.background }]}>
            <Text style={[styles.quickQuestionsTitle, { color: colors.text }]}>Quick Questions:</Text>
            <View style={styles.quickQuestionsGrid}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={`quick-${index}`}
                  style={[styles.quickQuestionButton, { backgroundColor: colors.background }]}
                  onPress={() => handleQuickQuestion(question)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.quickQuestionText, { color: colors.primary }]}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.background }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, { 
                borderColor: colors.background, 
                backgroundColor: colors.background,
                color: colors.text 
              }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me about your health..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={1000}
              editable={!isLoading}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton, 
                { backgroundColor: colors.primary },
                (!inputText.trim() || isLoading) && [styles.sendButtonDisabled, { backgroundColor: colors.textSecondary }]
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.7}
            >
              <Text style={[styles.sendButtonText, { color: colors.surface }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    ...Typography.sectionTitle,
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
    ...Typography.meta,
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
  quickQuestionsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  quickQuestionsTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  quickQuestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickQuestionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    minWidth: '48%',
    alignItems: 'center',
  },
  quickQuestionText: {
    ...Typography.meta,
    fontWeight: '500',
    textAlign: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  inputContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    maxHeight: 120,
    marginRight: Spacing.md,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.card,
  },
  sendButtonDisabled: {
    ...Elevation.card,
  },
  sendButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
