import {
    BorderRadius,
    Colors,
    Elevation,
    Spacing,
    Typography
} from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Gender } from '@/src/domain/entities';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';


interface OnboardingFormData {
  age: string;
  gender: Gender;
  height: string;
  weight: string;
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lbs';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  weightTarget: string;
  activityGoal: string;
}

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
  { value: 'active', label: 'Active', description: 'Heavy exercise 6-7 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Very heavy exercise, physical job' },
] as const;

const GENDER_OPTIONS = [
  { value: Gender.MALE, label: 'Male', icon: '👨' },
  { value: Gender.FEMALE, label: 'Female', icon: '👩' },
  { value: Gender.OTHER, label: 'Other', icon: '🧑' },
  { value: Gender.PREFER_NOT_TO_SAY, label: 'Prefer not to say', icon: '🤐' },
] as const;

export default function HealthGoalsOnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
    age: '',
    gender: Gender.PREFER_NOT_TO_SAY,
    height: '',
    weight: '',
    heightUnit: 'cm',
    weightUnit: 'kg',
    activityLevel: 'moderate',
    weightTarget: '',
    activityGoal: '',
  });
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const updateFormData = useCallback((updates: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, []);

  const previousStep = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handleComplete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const age = parseInt(formData.age);
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const weightTarget = parseFloat(formData.weightTarget);
    const activityGoal = parseFloat(formData.activityGoal);

    if (!age || !height || !weight || !weightTarget || !activityGoal) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Onboarding Complete!',
      'Your health profile and goals have been set up successfully.',
      [
        {
          text: 'Continue',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  }, [formData]);

  const renderStep0 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Personal Information
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
        Tell us about yourself to personalize your health journey
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Age *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={formData.age}
          onChangeText={(text) => updateFormData({ age: text })}
          placeholder="Enter your age"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Gender</Text>
        <View style={styles.genderContainer}>
          {GENDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.genderOption,
                {
                  backgroundColor: formData.gender === option.value ? colors.primary : colors.surface,
                  borderColor: formData.gender === option.value ? colors.primary : colors.border,
                },
              ]}
              onPress={() => updateFormData({ gender: option.value })}
            >
              <Text style={styles.genderIcon}>{option.icon}</Text>
              <Text style={[
                styles.genderLabel,
                { color: formData.gender === option.value ? colors.surface : colors.text }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Physical Measurements
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
        Your height and weight help us calculate important health metrics
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Height *</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={[styles.input, styles.flexInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={formData.height}
            onChangeText={(text) => updateFormData({ height: text })}
            placeholder="170"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: formData.heightUnit === 'cm' ? colors.primary : colors.surface }
              ]}
              onPress={() => updateFormData({ heightUnit: 'cm' })}
            >
              <Text style={[
                styles.unitButtonText,
                { color: formData.heightUnit === 'cm' ? colors.surface : colors.text }
              ]}>
                cm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: formData.heightUnit === 'ft' ? colors.primary : colors.surface }
              ]}
              onPress={() => updateFormData({ heightUnit: 'ft' })}
            >
              <Text style={[
                styles.unitButtonText,
                { color: formData.heightUnit === 'ft' ? colors.surface : colors.text }
              ]}>
                ft
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Weight *</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={[styles.input, styles.flexInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={formData.weight}
            onChangeText={(text) => updateFormData({ weight: text })}
            placeholder="70"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: formData.weightUnit === 'kg' ? colors.primary : colors.surface }
              ]}
              onPress={() => updateFormData({ weightUnit: 'kg' })}
            >
              <Text style={[
                styles.unitButtonText,
                { color: formData.weightUnit === 'kg' ? colors.surface : colors.text }
              ]}>
                kg
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: formData.weightUnit === 'lbs' ? colors.primary : colors.surface }
              ]}
              onPress={() => updateFormData({ weightUnit: 'lbs' })}
            >
              <Text style={[
                styles.unitButtonText,
                { color: formData.weightUnit === 'lbs' ? colors.surface : colors.text }
              ]}>
                lbs
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Activity Level
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
        How active are you in your daily life?
      </Text>

      <View style={styles.activityContainer}>
        {ACTIVITY_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.value}
            style={[
              styles.activityOption,
              {
                backgroundColor: formData.activityLevel === level.value ? colors.primary : colors.surface,
                borderColor: formData.activityLevel === level.value ? colors.primary : colors.border,
              },
            ]}
            onPress={() => updateFormData({ activityLevel: level.value })}
          >
            <Text style={[
              styles.activityLabel,
              { color: formData.activityLevel === level.value ? colors.surface : colors.text }
            ]}>
              {level.label}
            </Text>
            <Text style={[
              styles.activityDescription,
              { color: formData.activityLevel === level.value ? colors.surface : colors.textSecondary }
            ]}>
              {level.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Health Goals
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
        Set your targets for a healthier lifestyle
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Weight Target *</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={[styles.input, styles.flexInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={formData.weightTarget}
            onChangeText={(text) => updateFormData({ weightTarget: text })}
            placeholder="65"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
          <Text style={[styles.unitText, { color: colors.textSecondary }]}>
            {formData.weightUnit}
          </Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Weekly Exercise Goal *</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={[styles.input, styles.flexInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={formData.activityGoal}
            onChangeText={(text) => updateFormData({ activityGoal: text })}
            placeholder="5"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
          <Text style={[styles.unitText, { color: colors.textSecondary }]}>
            hours/week
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Ready to Start!
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
        Your personalized health journey begins now
      </Text>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Profile Summary</Text>
          <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
            Age: {formData.age} years
          </Text>
          <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
            Gender: {GENDER_OPTIONS.find(g => g.value === formData.gender)?.label}
          </Text>
          <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
            Height: {formData.height} {formData.heightUnit}
          </Text>
          <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
            Weight: {formData.weight} {formData.weightUnit}
          </Text>
          <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
            Activity: {ACTIVITY_LEVELS.find(a => a.value === formData.activityLevel)?.label}
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Health Goals</Text>
          <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
            Weight Target: {formData.weightTarget} {formData.weightUnit}
          </Text>
          <Text style={[styles.summaryItem, { color: colors.textSecondary }]}>
            Exercise Goal: {formData.activityGoal} hours/week
          </Text>
        </View>
      </View>
    </View>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4];
  const stepTitles = [
    'Personal Info',
    'Measurements',
    'Activity Level',
    'Health Goals',
    'Summary'
  ];

  return (
    <LinearGradient
      colors={['#DBEAFE', '#BFDBFE', '#93C5FD']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Health Goals Setup</Text>
              <Text style={styles.headerSubtitle}>
                Step {currentStep + 1} of {steps.length}: {stepTitles[currentStep]}
              </Text>
            </View>

            <LinearGradient
              colors={['#FFFFFF', '#F1F5F9', '#E2E8F0']}
              style={styles.formCard}
            >
              {steps[currentStep]?.()}
            </LinearGradient>

            <View style={styles.buttonContainer}>
              {currentStep > 0 && (
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton, { borderColor: colors.primary }]} 
                  onPress={previousStep}
                >
                  <Text style={[styles.buttonText, { color: colors.primary }]}>
                    Previous
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]} 
                onPress={currentStep === steps.length - 1 ? handleComplete : nextStep}
              >
                <Text style={[styles.buttonText, { color: colors.surface }]}>
                  {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: -Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    ...Elevation.card,
  },
  stepContainer: {
    minHeight: 400,
  },
  stepTitle: {
    ...Typography.h2,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  stepSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.body.lineHeight,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  flexInput: {
    flex: 1,
  },
  unitInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  unitSelector: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  unitButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minWidth: 50,
    alignItems: 'center',
  },
  unitButtonText: {
    ...Typography.body,
    fontWeight: '600',
  },
  unitText: {
    ...Typography.body,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  genderOption: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  genderIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  genderLabel: {
    ...Typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  activityContainer: {
    gap: Spacing.md,
  },
  activityOption: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  activityLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  activityDescription: {
    ...Typography.caption,
    lineHeight: Typography.caption.lineHeight,
  },
  summaryContainer: {
    gap: Spacing.lg,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  summaryTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  summaryItem: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.modal,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    borderWidth: 2,
    // borderColor set dynamically
  },
  buttonText: {
    ...Typography.body,
    fontWeight: '600',
  },
});
