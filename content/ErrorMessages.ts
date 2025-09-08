/**
 * Error Messages
 * Centralized error messages for consistent error handling
 */

export const ErrorMessages = {
  // Authentication Errors
  auth: {
    notAuthenticated: 'Please log in to continue',
    sessionExpired: 'Your session has expired. Please log in again.',
    invalidCredentials: 'Invalid email or password',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
  },

  // Health Data Errors
  health: {
    predictionNotFound: 'Prediction not found',
    invalidData: 'Invalid health data provided',
    dataLoadError: 'Failed to load health data',
    predictionFailed: 'Failed to generate prediction',
    statsLoadError: 'Failed to load health statistics',
  },

  // Validation Errors
  validation: {
    required: '{field} is required',
    invalidEmail: 'Please enter a valid email address',
    invalidAge: 'Age must be between 1 and 120',
    invalidHeight: 'Height must be between 50 and 250 cm',
    invalidWeight: 'Weight must be between 20 and 300 kg',
    invalidBloodPressure: 'Invalid blood pressure values',
    invalidCholesterol: 'Cholesterol must be between 50 and 500 mg/dL',
    invalidGlucose: 'Glucose must be between 50 and 500 mg/dL',
  },

  // Network Errors
  network: {
    noConnection: 'No internet connection',
    timeout: 'Request timed out',
    serverUnavailable: 'Server is temporarily unavailable',
    rateLimited: 'Too many requests. Please try again later.',
  },

  // General Errors
  general: {
    unexpectedError: 'An unexpected error occurred',
    tryAgain: 'Please try again',
    contactSupport: 'Please contact support if the problem persists',
    notFound: 'The requested resource was not found',
    forbidden: 'You do not have permission to access this resource',
  },
} as const;

export type ErrorMessagesKey = typeof ErrorMessages;
