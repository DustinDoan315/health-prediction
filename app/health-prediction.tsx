import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { clearCurrentPrediction, createPrediction, createSimplePrediction } from '@/store/slices/healthSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useEffect, useRef, useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function HealthPredictionScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, currentPrediction } = useAppSelector((state) => state.health);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [isAdvanced, setIsAdvanced] = useState(false);
  const hasNavigated = useRef(false);
  const [formData, setFormData] = useState({
    age: '',
    height_cm: '',
    weight_kg: '',
    systolic_bp: '',
    diastolic_bp: '',
    cholesterol: '',
    glucose: '',
    smoking: false,
    exercise_hours_per_week: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Clear any existing prediction when screen loads
    dispatch(clearCurrentPrediction());
    hasNavigated.current = false;
  }, [dispatch]);

  useEffect(() => {
    if (currentPrediction && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push({
        pathname: '/prediction-result',
        params: { predictionId: currentPrediction.id.toString() }
      });
    }
  }, [currentPrediction]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { age, height_cm, weight_kg, exercise_hours_per_week } = formData;
    
    if (!age || !height_cm || !weight_kg) {
      Alert.alert('Error', 'Please fill in age, height, and weight');
      return false;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height_cm);
    const weightNum = parseFloat(weight_kg);
    const exerciseNum = parseFloat(exercise_hours_per_week || '0');

    if (ageNum < 1 || ageNum > 120) {
      Alert.alert('Error', 'Age must be between 1 and 120');
      return false;
    }

    if (heightNum < 50 || heightNum > 300) {
      Alert.alert('Error', 'Height must be between 50 and 300 cm');
      return false;
    }

    if (weightNum < 10 || weightNum > 500) {
      Alert.alert('Error', 'Weight must be between 10 and 500 kg');
      return false;
    }

    if (exerciseNum < 0 || exerciseNum > 50) {
      Alert.alert('Error', 'Exercise hours must be between 0 and 50 per week');
      return false;
    }

    if (isAdvanced) {
      const { systolic_bp, diastolic_bp, cholesterol, glucose } = formData;
      
      if (systolic_bp) {
        const systolicNum = parseInt(systolic_bp);
        if (systolicNum < 70 || systolicNum > 250) {
          Alert.alert('Error', 'Systolic BP must be between 70 and 250');
          return false;
        }
      }

      if (diastolic_bp) {
        const diastolicNum = parseInt(diastolic_bp);
        if (diastolicNum < 40 || diastolicNum > 150) {
          Alert.alert('Error', 'Diastolic BP must be between 40 and 150');
          return false;
        }
      }

      if (cholesterol) {
        const cholesterolNum = parseInt(cholesterol);
        if (cholesterolNum < 100 || cholesterolNum > 500) {
          Alert.alert('Error', 'Cholesterol must be between 100 and 500');
          return false;
        }
      }

      if (glucose) {
        const glucoseNum = parseInt(glucose);
        if (glucoseNum < 50 || glucoseNum > 400) {
          Alert.alert('Error', 'Glucose must be between 50 and 400');
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const baseData = {
      age: parseInt(formData.age),
      height_cm: parseFloat(formData.height_cm),
      weight_kg: parseFloat(formData.weight_kg),
      smoking: formData.smoking,
      exercise_hours_per_week: parseFloat(formData.exercise_hours_per_week || '0'),
    };

    if (isAdvanced) {
      const advancedData = {
        ...baseData,
        systolic_bp: formData.systolic_bp ? parseInt(formData.systolic_bp) : undefined,
        diastolic_bp: formData.diastolic_bp ? parseInt(formData.diastolic_bp) : undefined,
        cholesterol: formData.cholesterol ? parseInt(formData.cholesterol) : undefined,
        glucose: formData.glucose ? parseInt(formData.glucose) : undefined,
      };
      dispatch(createPrediction(advancedData));
    } else {
      dispatch(createSimplePrediction(baseData));
    }
  };

  const renderBasicForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          placeholderTextColor="#999"
          value={formData.age}
          onChangeText={(value) => handleInputChange('age', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>Height (cm) *</Text>
          <TextInput
            style={styles.input}
            placeholder="170"
            placeholderTextColor="#999"
            value={formData.height_cm}
            onChangeText={(value) => handleInputChange('height_cm', value)}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
          <Text style={styles.label}>Weight (kg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="70"
            placeholderTextColor="#999"
            value={formData.weight_kg}
            onChangeText={(value) => handleInputChange('weight_kg', value)}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Exercise (hours/week)</Text>
        <TextInput
          style={styles.input}
          placeholder="3.5"
          placeholderTextColor="#999"
          value={formData.exercise_hours_per_week}
          onChangeText={(value) => handleInputChange('exercise_hours_per_week', value)}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Do you smoke?</Text>
        <View style={styles.switchRow}>
          <TouchableOpacity
            style={[styles.switchOption, !formData.smoking && styles.switchOptionActive]}
            onPress={() => handleInputChange('smoking', false)}
          >
            <Text style={[styles.switchText, !formData.smoking && styles.switchTextActive]}>
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchOption, formData.smoking && styles.switchOptionActive]}
            onPress={() => handleInputChange('smoking', true)}
          >
            <Text style={[styles.switchText, formData.smoking && styles.switchTextActive]}>
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderAdvancedForm = () => (
    <>
      {renderBasicForm()}
      
      <View style={styles.advancedSection}>
        <Text style={styles.sectionTitle}>Advanced Metrics (Optional)</Text>
        
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Systolic BP</Text>
            <TextInput
              style={styles.input}
              placeholder="120"
              placeholderTextColor="#999"
              value={formData.systolic_bp}
              onChangeText={(value) => handleInputChange('systolic_bp', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.label}>Diastolic BP</Text>
            <TextInput
              style={styles.input}
              placeholder="80"
              placeholderTextColor="#999"
              value={formData.diastolic_bp}
              onChangeText={(value) => handleInputChange('diastolic_bp', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Cholesterol</Text>
            <TextInput
              style={styles.input}
              placeholder="190"
              placeholderTextColor="#999"
              value={formData.cholesterol}
              onChangeText={(value) => handleInputChange('cholesterol', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.label}>Glucose</Text>
            <TextInput
              style={styles.input}
              placeholder="95"
              placeholderTextColor="#999"
              value={formData.glucose}
              onChangeText={(value) => handleInputChange('glucose', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
    </>
  );

  if (!isAuthenticated) {
    return null; // Will redirect to welcome
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Prediction</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Let's assess your health</Text>
            <Text style={styles.subtitle}>
              Fill in your information to get personalized health insights
            </Text>

            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[styles.modeButton, !isAdvanced && styles.modeButtonActive]}
                onPress={() => setIsAdvanced(false)}
              >
                <Text style={[styles.modeText, !isAdvanced && styles.modeTextActive]}>
                  Quick Assessment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, isAdvanced && styles.modeButtonActive]}
                onPress={() => setIsAdvanced(true)}
              >
                <Text style={[styles.modeText, isAdvanced && styles.modeTextActive]}>
                  Detailed Analysis
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {isAdvanced ? renderAdvancedForm() : renderBasicForm()}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>
                {isLoading ? 'Analyzing...' : 'Get Health Prediction'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  modeTextActive: {
    color: '#667eea',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
  switchContainer: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  switchOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  switchOptionActive: {
    backgroundColor: '#667eea',
  },
  switchText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  switchTextActive: {
    color: '#fff',
  },
  advancedSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
