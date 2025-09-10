export interface BaseChatMessage {
  id: string;
  timestamp: Date;
  isUser: boolean;
}

export interface TextMessage extends BaseChatMessage {
  type: 'text';
  text: string;
  isTyping?: boolean;
}

export interface HealthDataMessage extends BaseChatMessage {
  type: 'health-data';
  title: string;
  data: {
    metric: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    status?: 'good' | 'warning' | 'critical';
  }[];
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface SymptomCheckerMessage extends BaseChatMessage {
  type: 'symptom-checker';
  symptoms: string[];
  questions: {
    id: string;
    question: string;
    options: string[];
    selected?: string;
  }[];
  currentStep: number;
  totalSteps: number;
}

export interface MedicationReminderMessage extends BaseChatMessage {
  type: 'medication-reminder';
  medication: string;
  dosage: string;
  time: string;
  isCompleted: boolean;
  reminderId: string;
}

export interface GoalTrackingMessage extends BaseChatMessage {
  type: 'goal-tracking';
  goal: {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    deadline?: Date;
  };
  progress: number;
}

export interface VoiceMessage extends BaseChatMessage {
  type: 'voice';
  audioUrl?: string;
  duration?: number;
  isRecording?: boolean;
  transcript?: string;
}

export interface ImageMessage extends BaseChatMessage {
  type: 'image';
  imageUrl: string;
  caption?: string;
  analysis?: string;
}

export interface EducationalContentMessage extends BaseChatMessage {
  type: 'educational';
  title: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'mental-health' | 'prevention' | 'general';
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export interface ProactiveTipMessage extends BaseChatMessage {
  type: 'proactive-tip';
  tipType: 'reminder' | 'alert' | 'suggestion' | 'achievement';
  title: string;
  message: string;
  actionButton?: {
    text: string;
    action: string;
  };
  priority: 'low' | 'medium' | 'high';
}

export type ChatMessage = 
  | TextMessage 
  | HealthDataMessage 
  | SymptomCheckerMessage 
  | MedicationReminderMessage 
  | GoalTrackingMessage 
  | VoiceMessage 
  | ImageMessage 
  | EducationalContentMessage 
  | ProactiveTipMessage;

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: {
    userHealthData?: any;
    currentGoals?: any[];
    activeReminders?: any[];
  };
  createdAt: Date;
  updatedAt: Date;
}
