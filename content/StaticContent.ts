

export const StaticContent = {
  // Disclaimers
  disclaimers: {
    aiPrediction: 'AI predictions are not medical advice',
    healthDisclaimer: 'This app is for informational purposes only and should not replace professional medical advice',
    dataPrivacy: 'Your health data is encrypted and stored securely',
    consultDoctor: 'Always consult with a healthcare professional for medical decisions',
  },

  // Legal Text
  legal: {
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    dataUsage: 'Data Usage Policy',
    cookiePolicy: 'Cookie Policy',
  },

  // Informational Content
  info: {
    aboutApp: 'Health Prediction App helps you understand your health risks using AI-powered analysis',
    howItWorks: 'Our AI analyzes your health metrics to provide personalized risk assessments',
    dataSecurity: 'We use industry-standard encryption to protect your health data',
    accuracy: 'Our predictions are based on medical research and machine learning models',
  },

  // Help Content
  help: {
    gettingStarted: 'Getting Started',
    faq: 'Frequently Asked Questions',
    contactUs: 'Contact Us',
    reportBug: 'Report a Bug',
    featureRequest: 'Request a Feature',
  },

  // Risk Level Descriptions
  riskDescriptions: {
    low: 'Low risk - Continue maintaining your healthy lifestyle',
    medium: 'Medium risk - Consider lifestyle improvements and regular checkups',
    high: 'High risk - Consult with a healthcare professional for guidance',
  },

  // Recommendations Categories
  recommendations: {
    exercise: 'Exercise regularly for at least 30 minutes daily',
    diet: 'Maintain a balanced diet with plenty of fruits and vegetables',
    sleep: 'Get 7-9 hours of quality sleep each night',
    stress: 'Practice stress management techniques like meditation',
    smoking: 'Quit smoking to reduce health risks significantly',
    alcohol: 'Limit alcohol consumption to moderate levels',
    checkups: 'Schedule regular health checkups with your doctor',
  },
} as const;

export type StaticContentKey = typeof StaticContent;
