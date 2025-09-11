import { useCallback, useState } from 'react';
import {
    Gender,
    GoalType,
    HealthGoal,
    UserProfile
} from '../../domain/entities';
import { CreateHealthGoalUseCase, CreateUserProfileUseCase } from '../../domain/usecases';

export interface OnboardingState {
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  userProfile: UserProfile | null;
  healthGoals: HealthGoal[];
}

export interface OnboardingFormData {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lbs';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  weightTarget: number;
  activityGoal: number;
}

export const useOnboardingViewModel = (
  createProfileUseCase: CreateUserProfileUseCase,
  createGoalUseCase: CreateHealthGoalUseCase,
  userId: number
) => {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    isLoading: false,
    error: null,
    userProfile: null,
    healthGoals: [],
  });

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const createUserProfile = useCallback(async (formData: OnboardingFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const profile = await createProfileUseCase.execute({
        userId,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        heightUnit: formData.heightUnit,
        weightUnit: formData.weightUnit,
        activityLevel: formData.activityLevel,
      });

      setState(prev => ({ ...prev, userProfile: profile }));
      return profile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [createProfileUseCase, userId]);

  const createHealthGoals = useCallback(async (formData: OnboardingFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const goals: HealthGoal[] = [];
      
      const weightGoal = await createGoalUseCase.execute({
        userId,
        type: GoalType.WEIGHT_TARGET,
        title: 'Weight Target',
        description: `Reach ${formData.weightTarget} ${formData.weightUnit}`,
        targetValue: formData.weightTarget,
        unit: formData.weightUnit,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });

      const activityGoal = await createGoalUseCase.execute({
        userId,
        type: GoalType.ACTIVITY_GOAL,
        title: 'Weekly Activity Goal',
        description: `${formData.activityGoal} hours of exercise per week`,
        targetValue: formData.activityGoal,
        unit: 'hours/week',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      goals.push(weightGoal, activityGoal);
      setState(prev => ({ ...prev, healthGoals: goals }));
      return goals;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create health goals';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [createGoalUseCase, userId]);

  const completeOnboarding = useCallback(async (formData: OnboardingFormData) => {
    try {
      await createUserProfile(formData);
      await createHealthGoals(formData);
      setState(prev => ({ ...prev, currentStep: 6 }));
    } catch (error) {
      throw error;
    }
  }, [createUserProfile, createHealthGoals]);

  return {
    state,
    nextStep,
    previousStep,
    setError,
    createUserProfile,
    createHealthGoals,
    completeOnboarding,
  };
};
