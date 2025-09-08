/**
 * UI Text Content
 * Centralized text content for all user interface elements
 * Structured for easy i18n implementation
 */

export const UIText = {
  // Navigation & Headers
  navigation: {
    home: 'Home',
    chat: 'Chat',
    history: 'History',
    settings: 'Settings',
    healthReport: 'Health Report',
    back: '←',
  },

  // Home Screen
  home: {
    greeting: 'Hi {name}!',
    greetingFallback: 'Hi there!',
    subtitle: 'How are you feeling today?',
    today: 'Today',
    moodQuestion: 'How are you feeling today?',
    quickActions: 'Quick Actions',
    recentInsights: 'Recent Insights',
    seeMyRiskPlan: 'See my risk & plan',
  },

  // Mood Options
  mood: {
    great: 'Great',
    good: 'Good',
    okay: 'Okay',
    bad: 'Bad',
  },

  // Quick Actions
  actions: {
    medicalHistory: 'Medical History',
    medicalHistorySubtitle: 'View your health records',
    aiAssistant: 'AI Assistant',
    aiAssistantSubtitle: 'Get health advice',
    newPrediction: 'New Prediction',
    newPredictionSubtitle: '2-min checkup',
  },

  // Health Metrics
  metrics: {
    totalPredictions: 'Total Predictions',
    averageRisk: 'Average Risk',
    lowRiskCount: 'Low Risk Count',
  },

  // Medical History
  medicalHistory: {
    title: 'Medical History',
    subtitle: 'Your health predictions',
    noPredictions: 'No predictions yet',
    noPredictionsSubtitle: 'Start your first health assessment',
    addPrediction: '+',
    riskLevel: 'Risk Level',
    recommendations: 'Recommendations',
    viewDetails: 'View Details →',
    newAssessment: 'New Assessment',
    riskScore: 'Risk Score',
    topRecommendation: 'Top Recommendation:',
    emptyTitle: 'No health records yet',
    createAssessment: 'Create Assessment',
  
  },

  // Prediction Result
  predictionResult: {
    lowRisk: 'LOW RISK',
    mediumRisk: 'MEDIUM RISK',
    highRisk: 'HIGH RISK',
    healthRiskScore: 'Health Risk Score',
    yourHealthMetrics: 'Your Health Metrics',
    personalizedRecommendations: 'Personalized Recommendations',
    aiPoweredAnalysis: '🤖 AI-Powered Analysis',
    aiSubtext: 'This prediction was generated using advanced AI algorithms',
    generatedOn: 'Generated on {date} at {time}',
    newAssessment: 'New Assessment',
    backToHome: 'Back to Home',
    greatJob: 'Great job! Keep maintaining your current healthy lifestyle.',
  },

  // Health Metrics Labels
  healthMetrics: {
    bmi: 'BMI',
    age: 'Age',
    exercise: 'Exercise',
    bloodPressure: 'Blood Pressure',
    cholesterol: 'Cholesterol',
    glucose: 'Glucose',
    smokingStatus: 'Smoking Status:',
    height: 'Height:',
    weight: 'Weight:',
    years: 'years',
    hrsWeek: 'hrs/week',
    mmHg: 'mmHg',
    mgdL: 'mg/dL',
    cm: 'cm',
    kg: 'kg',
    yes: 'Yes',
    no: 'No',
  },

  // BMI Categories
  bmiCategories: {
    underweight: 'Underweight',
    normal: 'Normal',
    overweight: 'Overweight',
    obese: 'Obese',
  },

  // Profile
  profile: {
    logout: 'Logout',
    accountSettings: 'Account Settings',
    privacySettings: 'Privacy Settings',
    notifications: 'Notifications',
    helpSupport: 'Help & Support',
    about: 'About',
  },

  // Authentication
  auth: {
    // Labels
    username: 'Username',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    password: 'Password',
    passwordConfirmation: 'Password Confirmation',
    
    // Placeholders
    enterUsername: 'Enter your username',
    enterFullName: 'Enter your full name',
    enterEmail: 'Enter your email address...',
    enterPassword: 'Enter your password',
    confirmPassword: 'Confirm your password',
  },

  // Health Assessment Form
  healthForm: {
    // Title
    title: 'Health Assessment',
    
    // Labels
    age: 'Age *',
    ageLabel: 'Age',
    height: 'Height (cm) *',
    weight: 'Weight (kg) *',
    exercise: 'Exercise (hours/week)',
    smoking: 'Do you smoke?',
    advancedMetrics: 'Advanced Metrics (Optional)',
    systolicBP: 'Systolic BP',
    diastolicBP: 'Diastolic BP',
    cholesterol: 'Cholesterol',
    glucose: 'Glucose',
    
    // Placeholders
    enterAge: 'Enter your age',
    heightPlaceholder: '170',
    weightPlaceholder: '70',
    exercisePlaceholder: '3.5',
    systolicPlaceholder: '120',
    diastolicPlaceholder: '80',
    cholesterolPlaceholder: '190',
    glucosePlaceholder: '95',
  },

  // Settings Screen
  settings: {
    title: 'Settings',
    member: 'Member',
    logout: 'Logout',
    logoutSubtitle: 'Sign out of your account',
    appName: 'Health Prediction App',
    version: 'Version 1.0.0',
  },

  // Chat Screen
  chat: {
    title: 'AI Health Assistant',
    placeholder: 'Ask me about your health...',
    online: 'Online',
    quickQuestions: 'Quick Questions:',
  },

  // Welcome Screen
  welcome: {
    loading: 'Loading...',
    appName: 'HealthAI',
    tagline: 'Powered by AI',
    greeting: 'Hello Beautiful',
    subtitle: 'Your health assistant powered by AI. \nGet insights, predictions, and personalized recommendations for better health.',
    features: {
      aiAnalysis: 'AI-Powered Health Analysis',
      personalizedRisk: 'Personalized Risk Assessment',
      smartRecommendations: 'Smart Health Recommendations',
    },
    getStarted: 'Get Started',
    termsText: 'By continuing, you agree to our Terms of Service & Privacy Policy',
  },

  // Onboarding Flow
  onboarding: {
    // Screen 1: Welcome
    welcome: {
      title: 'Welcome to HealthAI',
      subtitle: 'Your personal health companion powered by advanced AI technology',
      description: 'Get personalized health insights, risk assessments, and smart recommendations to help you live your healthiest life.',
      next: 'Continue',
      skip: 'Skip',
    },
    
    // Screen 2: AI Analysis
    aiAnalysis: {
      title: 'AI-Powered Analysis',
      subtitle: 'Advanced health assessment',
      description: 'Our AI analyzes your health data using medical-grade algorithms to provide accurate predictions and insights.',
      features: [
        'Medical-grade AI algorithms',
        'Comprehensive health analysis',
        'Real-time risk assessment',
        'Evidence-based predictions'
      ],
      next: 'Continue',
      skip: 'Skip',
    },
    
    // Screen 3: Risk Assessment
    riskAssessment: {
      title: 'Personalized Risk Assessment',
      subtitle: 'Understand your health risks',
      description: 'Get detailed risk scores for various health conditions based on your personal data and lifestyle factors.',
      features: [
        'Personalized risk scoring',
        'Multiple health conditions',
        'Lifestyle factor analysis',
        'Trend tracking over time'
      ],
      next: 'Continue',
      skip: 'Skip',
    },
    
    // Screen 4: Smart Recommendations
    smartRecommendations: {
      title: 'Smart Recommendations',
      subtitle: 'Actionable health advice',
      description: 'Receive personalized recommendations to improve your health, from lifestyle changes to preventive measures.',
      features: [
        'Personalized health tips',
        'Lifestyle recommendations',
        'Preventive care guidance',
        'Progress tracking'
      ],
      next: 'Continue',
      skip: 'Skip',
    },
    
    // Screen 5: Privacy & Security
    privacy: {
      title: 'Your Privacy Matters',
      subtitle: 'Secure and private',
      description: 'Your health data is encrypted and stored securely. We follow strict privacy standards and never share your information.',
      features: [
        'End-to-end encryption',
        'HIPAA compliant',
        'Your data, your control',
        'No data sharing'
      ],
      next: 'Continue',
      skip: 'Skip',
    },
    
    // Screen 6: Get Started
    getStarted: {
      title: 'Ready to Begin?',
      subtitle: 'Start your health journey',
      description: 'Create your account and take your first health assessment to get personalized insights.',
      startJourney: 'Start My Journey',
      signIn: 'I already have an account',
    },
    
    // Common
    next: 'Next',
    previous: 'Previous',
    skip: 'Skip',
    done: 'Done',
  },

  // Forgot Password
  forgotPassword: {
    title: 'Forgot Password?',
    subtitle: 'Then let\'s submit password reset.',
    passwordSent: 'Password Sent!',
  },

  // Goals
  goals: {
    title: 'Health Goals',
    thisWeek: 'This Week',
    yourGoals: 'Your Goals',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: '🔍',
    profile: '👤',
  },
} as const;

export type UITextKey = typeof UIText;
