import { UIText } from '@/content';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import { clearError, loginUser, registerUser } from '@/store/slices/authSlice';
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
  Animated,
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


export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });

  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

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

  const handleSocialLogin = (provider: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/forgot-password');
  };

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
              <View style={styles.headerContent}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoIcon}>🏥</Text>
                </View>
                <Text style={styles.headerTitle}>
                  {isLogin ? 'Welcome Back!' : 'Join HealthAI'}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {isLogin 
                    ? 'Sign in to continue your health journey' 
                    : 'Start your personalized health journey today'
                  }
                </Text>
              </View>
            </View>
          <LinearGradient
            colors={['#FFFFFF', '#F1F5F9', '#E2E8F0']}
            style={styles.formCard}
          >
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
                <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>👤</Text>
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
                    <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>👨‍⚕️</Text>
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
                    <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>📧</Text>
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
                <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>🔐</Text>
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
                  <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>
                    {showPassword ? '👁️' : '🙈'}
                  </Text>
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
                  <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>🔐</Text>
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
                    <Text style={[styles.inputIcon, { color: colors.textSecondary }]}>
                      {showConfirmPassword ? '👁️' : '🙈'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[
                styles.submitButton, 
                { backgroundColor: colors.primary },
                isLoading && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={[styles.submitButtonText, { color: colors.surface }]}>
                {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Text>
              <Text style={[styles.submitButtonIcon, { color: colors.surface }]}>
                {isLogin ? '→' : '✨'}
              </Text>
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
                style={[styles.socialButton, { backgroundColor: '#1877F2' }]}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <Text style={styles.socialButtonText}>📘</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
                onPress={() => handleSocialLogin('Google')}
              >
                <Text style={styles.socialButtonText}>🔍</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
                onPress={() => handleSocialLogin('Twitter')}
              >
                <Text style={styles.socialButtonText}>🐦</Text>
              </TouchableOpacity>
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
          </LinearGradient>
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
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Elevation.card,
  },
  logoIcon: {
    fontSize: 45,
    color: '#3B82F6',
  },
  headerTitle: {
    ...Typography.pageTitle,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...Typography.body,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
    paddingHorizontal: Spacing.md,
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
    padding: Spacing.xl,
    marginTop: -Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
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
    minHeight: 56,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    ...Typography.body,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    minHeight: 56,
    ...Elevation.modal,
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
    fontSize: 20,
    fontWeight: 'bold',
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
    width: 70,
    height: 70,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.card,
  },
  socialButtonText: {
    fontSize: 24,
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
