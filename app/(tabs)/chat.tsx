import { AIChatResponse, apiService } from '@/services/api';
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
import { useCallback, useEffect, useRef, useState } from 'react';

import { router } from 'expo-router';
import { useAppSelector } from '@/hooks/redux';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

export default function ChatScreen() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

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
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.typingIndicator}>
              <Animated.View
                style={[
                  styles.typingDot,
                  {
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
          item.isUser ? styles.userBubble : styles.aiBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.aiText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            item.isUser ? styles.userTimestamp : styles.aiTimestamp
          ]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  }, [typingAnimation]);

  const quickQuestions = [
    "What are healthy BMI ranges?",
    "How can I lower my blood pressure?",
    "What's a good exercise routine?",
    "How to improve my diet?",
    "Signs of high cholesterol?",
    "Benefits of regular exercise?",
  ];

  const handleQuickQuestion = useCallback((question: string) => {
    setInputText(question);
  }, []);

  if (!isAuthenticated) {
    return null; // Will redirect to welcome
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Chat</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>AI Online</Text>
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
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
            <View style={styles.quickQuestionsGrid}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={`quick-${index}`}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(question)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me about your health..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
              editable={!isLoading}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.sendButtonText}>→</Text>
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
    backgroundColor: '#f8f9fa',
    paddingBottom: Platform.OS === 'ios' ? 90 : 65,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 15,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 15,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#999',
  },
  quickQuestionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quickQuestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickQuestionButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  quickQuestionText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
    textAlign: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 3,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 120,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },
  sendButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
