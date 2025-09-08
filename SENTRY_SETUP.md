# Sentry Integration Setup

This project includes comprehensive Sentry integration for error tracking, performance monitoring, and health-specific analytics.

## Configuration

1. **Get your Sentry DSN:**
   - Sign up at [sentry.io](https://sentry.io)
   - Create a new project for React Native
   - Copy your DSN from the project settings

2. **Configure environment variables:**

   ```bash
   EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   ```

3. **Update app.json:**
   Replace the placeholder values in `app.json` with your actual Sentry configuration:

   ```json
   {
     "plugins": [
       [
         "@sentry/react-native/expo",
         {
           "url": "https://sentry.io/",
           "organization": "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",
           "project": "health-prediction",
           "authToken": "a92617c28c7d11f0b9d5eed5b3ff0ede",
           "project ID": "4509982594433025"
         }
       ]
     ]
   }
   ```

## Features

### Error Tracking

- Automatic error boundary integration
- Health data processing error tracking
- API error monitoring
- Privacy-compliant error reporting

### Performance Monitoring

- Health prediction operation tracking
- API call performance monitoring
- Screen navigation tracking
- Custom transaction tracking

### Health-Specific Analytics

- Health data input validation tracking
- Prediction result confidence monitoring
- Privacy compliance event tracking
- Security event monitoring

### Privacy Compliance

- Automatic data sanitization
- Health data redaction
- HIPAA-compliant error reporting
- User consent tracking

## Usage

### Basic Error Tracking

```typescript
import { captureException } from '@/services';

try {
  // Your code here
} catch (error) {
  captureException(error);
}
```

### Health Data Tracking

```typescript
import { trackHealthDataError } from '@/services';

trackHealthDataError(error, {
  dataType: 'blood_pressure',
  isValid: false,
  unit: 'mmHg'
});
```

### Performance Tracking

```typescript
import { trackHealthPrediction } from '@/services';

const result = await trackHealthPrediction('diabetes', async () => {
  return await predictDiabetes(data);
});
```

### User Tracking

```typescript
import { useSentryUser } from '@/hooks';

function App() {
  useSentryUser(); // Automatically tracks user login/logout
  return <YourApp />;
}
```

## Privacy & Security

- All health data is automatically sanitized before sending to Sentry
- Sensitive information is redacted or removed
- User consent is tracked for compliance
- Data retention policies are enforced

## Custom Hooks

- `useSentryUser()` - Tracks user authentication state
- `useSentryNavigation(screenName)` - Tracks screen navigation
- `useSentryHealthData()` - Tracks health data updates

## Services

- `sentry.ts` - Core Sentry configuration and utilities
- `analytics.ts` - Performance and user action tracking
- `healthTracking.ts` - Health-specific error and event tracking
