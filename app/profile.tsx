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

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';


interface ProfileData {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lbs';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  healthConditions: string[];
  medications: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
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

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    age: 28,
    gender: Gender.PREFER_NOT_TO_SAY,
    height: 170,
    weight: 70,
    heightUnit: 'cm',
    weightUnit: 'kg',
    activityLevel: 'moderate',
    healthConditions: [],
    medications: [],
    allergies: [],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'basic' | 'health' | 'emergency'>('basic');
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const updateProfileData = useCallback((updates: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSave = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  }, []);

  const handleCancel = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditing(false);
    setProfileData({
      age: 28,
      gender: Gender.PREFER_NOT_TO_SAY,
      height: 170,
      weight: 70,
      heightUnit: 'cm',
      weightUnit: 'kg',
      activityLevel: 'moderate',
      healthConditions: [],
      medications: [],
      allergies: [],
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
    });
  }, []);

  const calculateBMI = useCallback(() => {
    const heightInMeters = profileData.heightUnit === 'cm' ? profileData.height / 100 : profileData.height * 0.3048;
    const weightInKg = profileData.weightUnit === 'kg' ? profileData.weight : profileData.weight * 0.453592;
    return weightInKg / (heightInMeters * heightInMeters);
  }, [profileData.height, profileData.weight, profileData.heightUnit, profileData.weightUnit]);

  const getBMICategory = useCallback(() => {
    const bmi = calculateBMI();
    if (bmi < 18.5) return { category: 'Underweight', color: '#3B82F6' };
    if (bmi < 25) return { category: 'Normal', color: '#10B981' };
    if (bmi < 30) return { category: 'Overweight', color: '#F59E0B' };
    return { category: 'Obese', color: '#EF4444' };
  }, [calculateBMI]);

  const renderBasicInfo = () => (
    <View style={styles.sectionContent}>
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Age</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={profileData.age.toString()}
          onChangeText={(text) => updateProfileData({ age: parseInt(text) || 0 })}
          keyboardType="numeric"
          editable={isEditing}
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
                  backgroundColor: profileData.gender === option.value ? colors.primary : colors.surface,
                  borderColor: profileData.gender === option.value ? colors.primary : colors.border,
                },
              ]}
              onPress={() => isEditing && updateProfileData({ gender: option.value })}
              disabled={!isEditing}
            >
              <Text style={styles.genderIcon}>{option.icon}</Text>
              <Text style={[
                styles.genderLabel,
                { color: profileData.gender === option.value ? colors.surface : colors.text }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Height</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={[styles.input, styles.flexInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={profileData.height.toString()}
            onChangeText={(text) => updateProfileData({ height: parseFloat(text) || 0 })}
            keyboardType="numeric"
            editable={isEditing}
          />
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: profileData.heightUnit === 'cm' ? colors.primary : colors.surface }
              ]}
              onPress={() => isEditing && updateProfileData({ heightUnit: 'cm' })}
              disabled={!isEditing}
            >
              <Text style={[
                styles.unitButtonText,
                { color: profileData.heightUnit === 'cm' ? colors.surface : colors.text }
              ]}>
                cm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: profileData.heightUnit === 'ft' ? colors.primary : colors.surface }
              ]}
              onPress={() => isEditing && updateProfileData({ heightUnit: 'ft' })}
              disabled={!isEditing}
            >
              <Text style={[
                styles.unitButtonText,
                { color: profileData.heightUnit === 'ft' ? colors.surface : colors.text }
              ]}>
                ft
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Weight</Text>
        <View style={styles.unitInputContainer}>
          <TextInput
            style={[styles.input, styles.flexInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={profileData.weight.toString()}
            onChangeText={(text) => updateProfileData({ weight: parseFloat(text) || 0 })}
            keyboardType="numeric"
            editable={isEditing}
          />
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: profileData.weightUnit === 'kg' ? colors.primary : colors.surface }
              ]}
              onPress={() => isEditing && updateProfileData({ weightUnit: 'kg' })}
              disabled={!isEditing}
            >
              <Text style={[
                styles.unitButtonText,
                { color: profileData.weightUnit === 'kg' ? colors.surface : colors.text }
              ]}>
                kg
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: profileData.weightUnit === 'lbs' ? colors.primary : colors.surface }
              ]}
              onPress={() => isEditing && updateProfileData({ weightUnit: 'lbs' })}
              disabled={!isEditing}
            >
              <Text style={[
                styles.unitButtonText,
                { color: profileData.weightUnit === 'lbs' ? colors.surface : colors.text }
              ]}>
                lbs
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Activity Level</Text>
        <View style={styles.activityContainer}>
          {ACTIVITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.activityOption,
                {
                  backgroundColor: profileData.activityLevel === level.value ? colors.primary : colors.surface,
                  borderColor: profileData.activityLevel === level.value ? colors.primary : colors.border,
                },
              ]}
              onPress={() => isEditing && updateProfileData({ activityLevel: level.value })}
              disabled={!isEditing}
            >
              <Text style={[
                styles.activityLabel,
                { color: profileData.activityLevel === level.value ? colors.surface : colors.text }
              ]}>
                {level.label}
              </Text>
              <Text style={[
                styles.activityDescription,
                { color: profileData.activityLevel === level.value ? colors.surface : colors.textSecondary }
              ]}>
                {level.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderHealthInfo = () => (
    <View style={styles.sectionContent}>
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Health Conditions</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text }]}
          value={profileData.healthConditions.join(', ')}
          onChangeText={(text) => updateProfileData({ healthConditions: text.split(',').map(s => s.trim()).filter(s => s) })}
          placeholder="Enter health conditions separated by commas"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Medications</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text }]}
          value={profileData.medications.join(', ')}
          onChangeText={(text) => updateProfileData({ medications: text.split(',').map(s => s.trim()).filter(s => s) })}
          placeholder="Enter medications separated by commas"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Allergies</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text }]}
          value={profileData.allergies.join(', ')}
          onChangeText={(text) => updateProfileData({ allergies: text.split(',').map(s => s.trim()).filter(s => s) })}
          placeholder="Enter allergies separated by commas"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          editable={isEditing}
        />
      </View>
    </View>
  );

  const renderEmergencyInfo = () => (
    <View style={styles.sectionContent}>
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Emergency Contact Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={profileData.emergencyContact.name}
          onChangeText={(text) => updateProfileData({ 
            emergencyContact: { ...profileData.emergencyContact, name: text }
          })}
          placeholder="Enter contact name"
          placeholderTextColor={colors.textSecondary}
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={profileData.emergencyContact.phone}
          onChangeText={(text) => updateProfileData({ 
            emergencyContact: { ...profileData.emergencyContact, phone: text }
          })}
          placeholder="Enter phone number"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Relationship</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={profileData.emergencyContact.relationship}
          onChangeText={(text) => updateProfileData({ 
            emergencyContact: { ...profileData.emergencyContact, relationship: text }
          })}
          placeholder="e.g., Spouse, Parent, Friend"
          placeholderTextColor={colors.textSecondary}
          editable={isEditing}
        />
      </View>
    </View>
  );

  const bmiData = getBMICategory();
  const bmi = calculateBMI();

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
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
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Profile
              </Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsEditing(!isEditing);
                }}
              >
                <Text style={styles.editButtonText}>
                  {isEditing ? '✕' : '✏️'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bmiCard}>
              <LinearGradient
                colors={[bmiData.color, `${bmiData.color}80`]}
                style={styles.bmiGradient}
              >
                <Text style={styles.bmiIcon}>⚖️</Text>
                <Text style={styles.bmiTitle}>BMI</Text>
                <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
                <Text style={styles.bmiCategory}>{bmiData.category}</Text>
              </LinearGradient>
            </View>

            <View style={styles.sectionTabs}>
              {[
                { key: 'basic', label: 'Basic Info', icon: '👤' },
                { key: 'health', label: 'Health', icon: '🏥' },
                { key: 'emergency', label: 'Emergency', icon: '🚨' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor: activeSection === tab.key ? colors.primary : colors.surface,
                      borderColor: activeSection === tab.key ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveSection(tab.key as any);
                  }}
                >
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text style={[
                    styles.tabLabel,
                    { color: activeSection === tab.key ? colors.surface : colors.text }
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <LinearGradient
              colors={['#FFFFFF', '#F1F5F9', '#E2E8F0']}
              style={styles.formCard}
            >
              {activeSection === 'basic' && renderBasicInfo()}
              {activeSection === 'health' && renderHealthInfo()}
              {activeSection === 'emergency' && renderEmergencyInfo()}
            </LinearGradient>

            {isEditing && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton, { borderColor: colors.border }]} 
                  onPress={handleCancel}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]} 
                  onPress={handleSave}
                >
                  <Text style={[styles.buttonText, { color: colors.surface }]}>
                    Save Changes
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.h1,
    fontWeight: '700',
    textAlign: 'center',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bmiCard: {
    marginBottom: Spacing.xl,
  },
  bmiGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Elevation.card,
  },
  bmiIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  bmiTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  bmiValue: {
    ...Typography.h1,
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 48,
  },
  bmiCategory: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionTabs: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  tabLabel: {
    ...Typography.caption,
    fontWeight: '600',
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
  sectionContent: {
    minHeight: 400,
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
  textArea: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
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
  cancelButton: {
    borderWidth: 2,
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    ...Typography.body,
    fontWeight: '600',
  },
});