import * as Sentry from '@sentry/react-native';

import Constants from 'expo-constants';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

export const initSentry = () => {
  if (!SENTRY_DSN) {
    if (__DEV__) {
      console.log('Sentry DSN not configured. Error tracking disabled in development.');
    } else {
      console.warn('Sentry DSN not configured. Error tracking disabled.');
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    debug: __DEV__,
    tracesSampleRate: __DEV__ ? 1.0 : 0.1,
    profilesSampleRate: __DEV__ ? 1.0 : 0.1,
    integrations: [
      Sentry.reactNativeTracingIntegration(),
    ],
    beforeSend(event) {
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === 'ChunkLoadError' || error?.value?.includes('Loading chunk')) {
          return null;
        }
      }
      
      // Remove sensitive health data
      if (event.extra) {
        event.extra = sanitizeObject(event.extra);
      }
      
      if (event.tags) {
        event.tags = sanitizeObject(event.tags);
      }
      
      if (event.user) {
        event.user = sanitizeUserData(event.user);
      }
      
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === 'http' && breadcrumb.data?.url?.includes('health')) {
        breadcrumb.data.url = '[REDACTED]';
      }
      
      // Sanitize breadcrumb data
      if (breadcrumb.data) {
        breadcrumb.data = sanitizeObject(breadcrumb.data);
      }
      
      return breadcrumb;
    },
  });

  Sentry.setContext('app', {
    name: 'Health Prediction',
    version: Constants.expoConfig?.version || '1.0.0',
    buildNumber: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1',
  });
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level);
};

export const setUser = (user: { id: string; email?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
  });
};

export const clearUser = () => {
  Sentry.setUser(null);
};

export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
};

export const startTransaction = (name: string, op: string) => {
  return Sentry.startSpan({ name, op }, (span) => span);
};

export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

export const setContext = (key: string, context: Record<string, any>) => {
  Sentry.setContext(key, context);
};

const SENSITIVE_KEYS = [
  'password', 'token', 'secret', 'key', 'auth', 'credential',
  'blood_pressure', 'heart_rate', 'weight', 'height', 'bmi',
  'glucose', 'cholesterol', 'medication', 'diagnosis', 'symptom',
  'medical_history', 'health_data', 'patient_id', 'ssn', 'social_security'
];

const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive));
    
    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else if (typeof value === 'string' && value.length > 100) {
      sanitized[key] = '[REDACTED_LONG_STRING]';
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

const sanitizeUserData = (user: any): any => {
  return {
    id: user.id,
    email: user.email ? '[REDACTED_EMAIL]' : undefined,
    username: user.username ? '[REDACTED_USERNAME]' : undefined,
  };
};
