import { UIText } from '@/content';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import { clearCurrentPrediction, createPrediction, createSimplePrediction } from '@/store/slices/healthSlice';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import {
  Spacing,
  Typography,
} from '@/constants';
import {
  BorderRadius,
  Colors,
  Elevation,
} from '@/constants/Colors';
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


export default function HealthPredictionScreen() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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
      return;
    }
  }, [isAuthenticated]);

  useEffect(() => {
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

  if (!isAuthenticated) {
    return null;
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleModeToggle = (advanced: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsAdvanced(advanced);
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

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
        <Text style={[styles.label, { color: colors.text }]}>{UIText.healthForm.age}</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: colors.background, 
            backgroundColor: colors.background,
            color: colors.text 
          }]}
          placeholder={UIText.healthForm.enterAge}
          placeholderTextColor={colors.textSecondary}
          value={formData.age}
          onChangeText={(value) => handleInputChange('age', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
          <Text style={[styles.label, { color: colors.text }]}>{UIText.healthForm.height}</Text>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.background, 
              backgroundColor: colors.background,
              color: colors.text 
            }]}
            placeholder={UIText.healthForm.heightPlaceholder}
            placeholderTextColor={colors.textSecondary}
            value={formData.height_cm}
            onChangeText={(value) => handleInputChange('height_cm', value)}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
          <Text style={[styles.label, { color: colors.text }]}>{UIText.healthForm.weight}</Text>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.background, 
              backgroundColor: colors.background,
              color: colors.text 
            }]}
            placeholder={UIText.healthForm.weightPlaceholder}
            placeholderTextColor={colors.textSecondary}
            value={formData.weight_kg}
            onChangeText={(value) => handleInputChange('weight_kg', value)}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>{UIText.healthForm.exercise}</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: colors.background, 
            backgroundColor: colors.background,
            color: colors.text 
          }]}
          placeholder={UIText.healthForm.exercisePlaceholder}
          placeholderTextColor={colors.textSecondary}
          value={formData.exercise_hours_per_week}
          onChangeText={(value) => handleInputChange('exercise_hours_per_week', value)}
          keyboardType="decimal-pad"
        />
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Typical range: 0-10 hours per week
        </Text>
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: colors.text }]}>{UIText.healthForm.smoking}</Text>
        <View style={[styles.switchRow, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[
              styles.switchOption, 
              { backgroundColor: !formData.smoking ? colors.primary : 'transparent' }
            ]}
            onPress={() => handleInputChange('smoking', false)}
          >
            <Text style={[
              styles.switchText, 
              { color: !formData.smoking ? colors.surface : colors.textSecondary }
            ]}>
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchOption, 
              { backgroundColor: formData.smoking ? colors.primary : 'transparent' }
            ]}
            onPress={() => handleInputChange('smoking', true)}
          >
            <Text style={[
              styles.switchText, 
              { color: formData.smoking ? colors.surface : colors.textSecondary }
            ]}>
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{UIText.healthForm.advancedMetrics}</Text>
        
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
            <Text style={[styles.label, { color: colors.text }]}>{UIText.healthForm.systolicBP}</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.background, 
                backgroundColor: colors.background,
                color: colors.text 
              }]}
              placeholder={UIText.healthForm.systolicPlaceholder}
              placeholderTextColor={colors.textSecondary}
              value={formData.systolic_bp}
              onChangeText={(value) => handleInputChange('systolic_bp', value)}
              keyboardType="numeric"
            />
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Normal: 90-120 mmHg
            </Text>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
            <Text style={[styles.label, { color: colors.text }]}>{UIText.healthForm.diastolicBP}</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.background, 
                backgroundColor: colors.background,
                color: colors.text 
              }]}
              placeholder={UIText.healthForm.diastolicPlaceholder}
              placeholderTextColor={colors.textSecondary}
              value={formData.diastolic_bp}
              onChangeText={(value) => handleInputChange('diastolic_bp', value)}
              keyboardType="numeric"
            />
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Normal: 60-80 mmHg
            </Text>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
            <Text style={[styles.label, { color: colors.text }]}>{UIText.healthForm.cholesterol}</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.background, 
                backgroundColor: colors.background,
                color: colors.text 
              }]}
              placeholder={UIText.healthForm.cholesterolPlaceholder}
              placeholderTextColor={colors.textSecondary}
              value={formData.cholesterol}
              onChangeText={(value) => handleInputChange('cholesterol', value)}
              keyboardType="numeric"
            />
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Normal: &lt; 200 mg/dL
            </Text>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
            <Text style={[styles.label, { color: colors.text }]}>{UIText.healthForm.glucose}</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: colors.background, 
                backgroundColor: colors.background,
                color: colors.text 
              }]}
              placeholder={UIText.healthForm.glucosePlaceholder}
              placeholderTextColor={colors.textSecondary}
              value={formData.glucose}
              onChangeText={(value) => handleInputChange('glucose', value)}
              keyboardType="numeric"
            />
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Normal: 70-100 mg/dL
            </Text>
          </View>
        </View>
      </View>
    </>
  );



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.background }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{UIText.healthForm.title}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>Let&#39;s assess your health</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Fill in your information to get personalized health insights
            </Text>

            <View style={[styles.modeSelector, { backgroundColor: colors.background }]}>
              <TouchableOpacity
                style={[
                  styles.modeButton, 
                  { backgroundColor: !isAdvanced ? colors.surface : 'transparent' }
                ]}
                onPress={() => handleModeToggle(false)}
              >
                <Text style={[
                  styles.modeText, 
                  { color: !isAdvanced ? colors.primary : colors.textSecondary }
                ]}>
                  Quick Assessment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton, 
                  { backgroundColor: isAdvanced ? colors.surface : 'transparent' }
                ]}
                onPress={() => handleModeToggle(true)}
              >
                <Text style={[
                  styles.modeText, 
                  { color: isAdvanced ? colors.primary : colors.textSecondary }
                ]}>
                  Detailed Analysis
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.form, { backgroundColor: colors.surface }]}>
              {isAdvanced ? renderAdvancedForm() : renderBasicForm()}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              style={styles.submitGradient}
            >
              <Text style={[styles.submitText, { color: colors.surface }]}>
                {isLoading ? 'Analyzing...' : 'See my risk & plan'}
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
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  title: {
    ...Typography.pageTitle,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.body.lineHeight,
  },
  modeSelector: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xl,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Elevation.card,
  },
  modeText: {
    ...Typography.meta,
    fontWeight: '500',
  },
  form: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Elevation.card,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Typography.body,
  },
  helperText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  switchContainer: {
    marginBottom: Spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  switchOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  switchText: {
    ...Typography.body,
    fontWeight: '500',
  },
  advancedSection: {
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  submitButton: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Elevation.modal,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  submitText: {
    ...Typography.sectionTitle,
    fontWeight: '600',
  },
});
