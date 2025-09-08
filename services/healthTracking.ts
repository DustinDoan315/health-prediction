import { addBreadcrumb, captureException, captureMessage, setTag } from '@/services';

interface HealthDataContext {
  dataType: string;
  value?: number | string;
  unit?: string;
  timestamp?: string;
  isValid?: boolean;
}

interface PredictionContext {
  predictionType: string;
  inputData?: Record<string, any>;
  confidence?: number;
  result?: any;
}

export const trackHealthDataError = (
  error: Error,
  context: HealthDataContext
) => {
  const sanitizedContext = sanitizeHealthContext(context);
  
  captureException(error, {
    operation: 'health_data_processing',
    ...sanitizedContext,
  });
  
  addBreadcrumb('Health data error', 'health_error', {
    dataType: context.dataType,
    isValid: context.isValid,
    timestamp: new Date().toISOString(),
  });
};

export const trackPredictionError = (
  error: Error,
  context: PredictionContext
) => {
  const sanitizedContext = sanitizePredictionContext(context);
  
  captureException(error, {
    operation: 'health_prediction',
    ...sanitizedContext,
  });
  
  addBreadcrumb('Prediction error', 'prediction_error', {
    predictionType: context.predictionType,
    timestamp: new Date().toISOString(),
  });
};

export const trackDataValidationError = (
  dataType: string,
  validationRule: string,
  context?: Record<string, any>
) => {
  captureMessage(`Data validation failed: ${dataType}`, 'warning');
  
  addBreadcrumb('Data validation error', 'validation_error', {
    dataType,
    validationRule,
    timestamp: new Date().toISOString(),
    ...sanitizeContext(context),
  });
};

export const trackPrivacyComplianceEvent = (
  event: 'data_access' | 'data_deletion' | 'data_export' | 'consent_given' | 'consent_withdrawn',
  context?: Record<string, any>
) => {
  addBreadcrumb(`Privacy event: ${event}`, 'privacy', {
    event,
    timestamp: new Date().toISOString(),
    ...sanitizeContext(context),
  });
  
  setTag('privacy_event', event);
};

export const trackSecurityEvent = (
  event: 'auth_failure' | 'token_expired' | 'suspicious_activity',
  context?: Record<string, any>
) => {
  captureMessage(`Security event: ${event}`, 'warning');
  
  addBreadcrumb(`Security event: ${event}`, 'security', {
    event,
    timestamp: new Date().toISOString(),
    ...sanitizeContext(context),
  });
  
  setTag('security_event', event);
};

export const trackPerformanceIssue = (
  operation: string,
  duration: number,
  threshold: number,
  context?: Record<string, any>
) => {
  if (duration > threshold) {
    captureMessage(`Performance issue: ${operation} took ${duration}ms`, 'warning');
    
    addBreadcrumb('Performance issue', 'performance', {
      operation,
      duration,
      threshold,
      timestamp: new Date().toISOString(),
      ...sanitizeContext(context),
    });
  }
};

const sanitizeHealthContext = (context: HealthDataContext): Record<string, any> => {
  return {
    dataType: context.dataType,
    unit: context.unit,
    timestamp: context.timestamp,
    isValid: context.isValid,
    hasValue: context.value !== undefined,
    valueType: typeof context.value,
  };
};

const sanitizePredictionContext = (context: PredictionContext): Record<string, any> => {
  return {
    predictionType: context.predictionType,
    confidence: context.confidence,
    hasInputData: context.inputData !== undefined,
    inputDataKeys: context.inputData ? Object.keys(context.inputData) : [],
    hasResult: context.result !== undefined,
    resultType: typeof context.result,
  };
};

const SENSITIVE_HEALTH_KEYS = [
  'blood_pressure', 'heart_rate', 'weight', 'height', 'bmi', 'glucose',
  'cholesterol', 'medication', 'diagnosis', 'symptom', 'medical_history',
  'health_data', 'patient_id', 'ssn', 'social_security', 'age', 'gender'
];

const sanitizeContext = (context?: Record<string, any>): Record<string, any> => {
  if (!context) return {};
  
  const sanitized: Record<string, any> = {};
  
  Object.entries(context).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_HEALTH_KEYS.some(sensitive => lowerKey.includes(sensitive));
    
    if (isSensitive) {
      sanitized[key] = '[REDACTED_HEALTH_DATA]';
    } else if (typeof value === 'string' && value.length > 100) {
      sanitized[key] = '[REDACTED_LONG_STRING]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = '[REDACTED_OBJECT]';
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

export const trackHealthDataAccess = (
  dataType: string,
  accessType: 'read' | 'write' | 'delete',
  context?: Record<string, any>
) => {
  addBreadcrumb(`Health data ${accessType}: ${dataType}`, 'data_access', {
    dataType,
    accessType,
    timestamp: new Date().toISOString(),
    ...sanitizeContext(context),
  });
  
  setTag('data_access_type', accessType);
};

export const trackApiError = (
  endpoint: string,
  error: Error,
  context?: Record<string, any>
) => {
  captureException(error, {
    operation: 'api_call',
    endpoint,
    ...sanitizeContext(context),
  });
  
  addBreadcrumb(`API error: ${endpoint}`, 'api_error', {
    endpoint,
    errorMessage: error.message,
    timestamp: new Date().toISOString(),
  });
};
