import { addBreadcrumb, captureException, captureMessage, setContext, setTag, startTransaction } from '@/services';

export const trackHealthPrediction = async <T>(
  predictionType: string,
  operation: () => Promise<T>
): Promise<T> => {
  const transaction = startTransaction(`health_prediction.${predictionType}`, 'health_prediction');
  
  try {
    addBreadcrumb(`Starting ${predictionType} prediction`, 'health_prediction', {
      predictionType,
      timestamp: new Date().toISOString(),
    });

    setTag('prediction_type', predictionType);
    setContext('health_prediction', {
      type: predictionType,
      timestamp: new Date().toISOString(),
    });

    const result = await operation();
    
    addBreadcrumb(`${predictionType} prediction completed`, 'health_prediction', {
      predictionType,
      success: true,
    });

    transaction.setStatus('ok');
    return result;
  } catch (error) {
    captureException(error as Error, {
      predictionType,
      operation: 'health_prediction',
    });
    
    addBreadcrumb(`${predictionType} prediction failed`, 'health_prediction', {
      predictionType,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    transaction.setStatus('internal_error');
    throw error;
  } finally {
    transaction.finish();
  }
};

export const trackApiCall = async <T>(
  endpoint: string,
  operation: () => Promise<T>
): Promise<T> => {
  const transaction = startTransaction(`api_call.${endpoint}`, 'http');
  
  try {
    addBreadcrumb(`API call to ${endpoint}`, 'http', {
      endpoint,
      timestamp: new Date().toISOString(),
    });

    const result = await operation();
    
    addBreadcrumb(`API call to ${endpoint} completed`, 'http', {
      endpoint,
      success: true,
    });

    transaction.setStatus('ok');
    return result;
  } catch (error) {
    captureException(error as Error, {
      endpoint,
      operation: 'api_call',
    });
    
    addBreadcrumb(`API call to ${endpoint} failed`, 'http', {
      endpoint,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    transaction.setStatus('internal_error');
    throw error;
  } finally {
    transaction.finish();
  }
};

export const trackUserAction = (action: string, context?: Record<string, any>) => {
  addBreadcrumb(`User action: ${action}`, 'user_action', {
    action,
    timestamp: new Date().toISOString(),
    ...context,
  });
};

export const trackScreenView = (screenName: string, context?: Record<string, any>) => {
  addBreadcrumb(`Screen view: ${screenName}`, 'navigation', {
    screen: screenName,
    timestamp: new Date().toISOString(),
    ...context,
  });
  
  setTag('current_screen', screenName);
};

export const trackHealthDataInput = (dataType: string, isValid: boolean, context?: Record<string, any>) => {
  addBreadcrumb(`Health data input: ${dataType}`, 'health_data', {
    dataType,
    isValid,
    timestamp: new Date().toISOString(),
    ...context,
  });
  
  if (!isValid) {
    captureMessage(`Invalid health data input: ${dataType}`, 'warning');
  }
};

export const trackPredictionResult = (
  predictionType: string,
  confidence: number,
  context?: Record<string, any>
) => {
  addBreadcrumb(`Prediction result: ${predictionType}`, 'prediction_result', {
    predictionType,
    confidence,
    timestamp: new Date().toISOString(),
    ...context,
  });
  
  setTag('prediction_confidence', confidence > 0.8 ? 'high' : confidence > 0.5 ? 'medium' : 'low');
};
