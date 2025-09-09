import * as Haptics from 'expo-haptics';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
  } from 'react-native';
import { clearError, loginUser, registerUser } from '@/store/slices/authSlice';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootState } from '@/store/store';
import { router } from 'expo-router';
import { UIText } from '@/content';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useAuthViewModel } from '@/src/presentation/viewmodels/AuthViewModel';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useRef, useState } from 'react';

import {
  BorderRadius,
  Colors,
  Elevation,
} from '@/constants/Colors';
import {
  Spacing,
  Typography,
} from '@/constants';


export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<
  {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    full_name: string;
  }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });

  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isLoading, error, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  
  // Use ViewModel for social authentication
  const authViewModel = useAuthViewModel();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAuthenticated || authViewModel.state.isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, authViewModel.state.isAuthenticated]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (authViewModel.state.error) {
      Alert.alert('Error', authViewModel.state.error);
      authViewModel.clearError();
    }
  }, [authViewModel]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        Alert.alert('Error', 'Please fill in all required fields');
        return false;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.full_name) {
        Alert.alert('Error', 'Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters long');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!validateForm()) return;

    if (isLogin) {
      dispatch(loginUser({
        username: formData.username,
        password: formData.password,
      }));
    } else {
      dispatch(registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      }));
    }
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLogin(!isLogin);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleGoogleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await authViewModel.loginWithGoogle();
    } catch {
      // Error is handled by the ViewModel
    }
  };

  const handleAppleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await authViewModel.loginWithApple();
    } catch {
      // Error is handled by the ViewModel
    }
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/forgot-password');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
              <View style={styles.headerContent}>
                <View style={styles.logoContainer}>
                  <Ionicons name="medkit-sharp" size={45} color={colors.surface} />
                </View>
                <Text style={[styles.headerTitle, { color: colors.surface }]}>
                  {isLogin ? 'Welcome Back!' : 'Join HealthAI'}
                </Text>
               
              </View>
            </View>
          <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
            <Animated.View 
              style={[
                styles.formContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{UIText.auth.username}</Text>
              <View style={[styles.inputContainer, { 
                borderColor: colors.background,
                backgroundColor: colors.background 
              }]}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder={UIText.auth.enterUsername}
                  placeholderTextColor={colors.textSecondary}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {!isLogin && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>{UIText.auth.fullName}</Text>
                  <View style={[styles.inputContainer, { 
                    borderColor: colors.background,
                    backgroundColor: colors.background 
                  }]}>
                    <Ionicons name="person-add-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder={UIText.auth.enterFullName}
                      placeholderTextColor={colors.textSecondary}
                      value={formData.full_name}
                      onChangeText={(value) => handleInputChange('full_name', value)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>{UIText.auth.emailAddress}</Text>
                  <View style={[styles.inputContainer, { 
                    borderColor: colors.background,
                    backgroundColor: colors.background 
                  }]}>
                    <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder={UIText.auth.enterEmail}
                      placeholderTextColor={colors.textSecondary}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>{UIText.auth.password}</Text>
              <View style={[styles.inputContainer, { 
                borderColor: colors.background,
                backgroundColor: colors.background 
              }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder={UIText.auth.enterPassword}
                  placeholderTextColor={colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {!isLogin && (
                <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                  Password must be at least 8 characters long
                </Text>
              )}
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>{UIText.auth.passwordConfirmation}</Text>
                <View style={[styles.inputContainer, { 
                  borderColor: colors.background,
                  backgroundColor: colors.background 
                }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder={UIText.auth.confirmPassword}
                    placeholderTextColor={colors.textSecondary}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color={colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[
                styles.submitButton,
                (isLoading || authViewModel.state.isLoading) && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={isLoading || authViewModel.state.isLoading}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.submitButtonGradient}
              >
                <Text style={[styles.submitButtonText, { color: colors.surface }]}>
                  {(isLoading || authViewModel.state.isLoading) ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Text>
                <Ionicons 
                  name={isLogin ? "arrow-forward" : "sparkles"} 
                  size={20} 
                  color={colors.surface} 
                  style={styles.submitButtonIcon}
                />
              </LinearGradient>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.separator}>
              <View style={[styles.separatorLine, { backgroundColor: colors.background }]} />
              <Text style={[styles.separatorText, { color: colors.textSecondary }]}>OR</Text>
              <View style={[styles.separatorLine, { backgroundColor: colors.background }]} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
                onPress={handleGoogleLogin}
                disabled={isLoading || authViewModel.state.isLoading}
              >
                <FontAwesome5 name="google" size={24} color="white" />
              </TouchableOpacity>
              
              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  style={[styles.socialButton, { backgroundColor: '#000000' }]}
                  onPress={handleAppleLogin}
                  disabled={isLoading || authViewModel.state.isLoading}
                >
                  <FontAwesome5 name="apple" size={24} color="white" />
                </TouchableOpacity>
              )}
            </View>

            </Animated.View>

            <TouchableOpacity style={styles.switchContainer} onPress={toggleMode}>
              <Text style={[styles.switchText, { color: colors.textSecondary }]}>
                {isLogin 
                  ? "Don't have an account? " 
                  : 'Already have an account? '
                }
                <Text style={[styles.switchTextBold, { color: colors.primary }]}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Elevation.card,
  },
  headerTitle: {
    ...Typography.pageTitle,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
    paddingHorizontal: Spacing.md,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: -Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Elevation.card,
  },
  formContent: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 60,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
    ...Typography.body,
    lineHeight: Typography.body.lineHeight,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  eyeIcon: {
    padding: Spacing.sm,
  },
  helperText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  submitButton: {
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    minHeight: 56,
    ...Elevation.modal,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    minHeight: 56,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...Typography.sectionTitle,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  submitButtonIcon: {
    marginLeft: Spacing.xs,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    ...Typography.body,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    ...Typography.meta,
    marginHorizontal: Spacing.md,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.card,
  },
  switchContainer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  switchText: {
    ...Typography.body,
    textAlign: 'center',
  },
  switchTextBold: {
    fontWeight: '600',
  },
});
